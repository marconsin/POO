// vambora thiagão

// classe regulador financeiro
class ReguladorFinanceiro {
    registroSuspeito = [];

    // verifica movimentacoes suspeitas
    auditarTransacao(conta, quantia, tipoOperacao) {
        if (Math.abs(quantia) > 1000) {
            const alerta = {
                instituicao: conta.bancoPertencente.nomeFantasia,
                filial: conta.filial.codigoFilial,
                contaAlvo: conta.idConta,
                valor: quantia,
                tipo: tipoOperacao,
                timestamp: new Date().toLocaleString()
            };
            this.registroSuspeito.push(alerta);
            console.warn("ALERTA: Movimentação de baleia detectada!", alerta);
        }
    }
}

// classe principal da instituicao
class Instituicao {
    nomeFantasia;
    regulador;
    // lista de filiais ativas
    filiais = []; 
    historicoGlobal = [];

    constructor(nome, reguladorRef) {
        this.nomeFantasia = nome;
        this.regulador = reguladorRef;
    }

    inaugurarFilial(codigo, apelido) {
        const novaFilial = new Filial(codigo, apelido, this);
        this.filiais.push(novaFilial);
        return novaFilial;
    }

    registrarOperacao(contaEnvolvida, valor, descricao, contaDestino = null) {
        // registro no log geral
        this.historicoGlobal.push({
            conta: contaEnvolvida.idConta,
            valor: valor,
            desc: descricao,
            data: new Date()
        });
        // notificacao ao regulador
        this.regulador.auditarTransacao(contaEnvolvida, valor, descricao);
    }

    localizarContaGlobal(idContaBusca) {
        for (let f of this.filiais) {
            const encontrada = f.buscarContaNaFilial(idContaBusca);
            if (encontrada) return encontrada;
        }
        return null;
    }
}

// classe filial
class Filial {
    codigoFilial;
    apelidoFilial;
    instituicaoPai;
    // banco de dados das contas
    listaContas = []; 

    constructor(codigo, apelido, instituicao) {
        this.codigoFilial = codigo;
        this.apelidoFilial = apelido;
        this.instituicaoPai = instituicao;
    }

    criarContaCorrente(titular, depositoInicial = 0) {
        // gera identificador unico da conta
        const sequencial = (this.listaContas.length + 1).toString().padStart(5, '0');
        const idGerado = `${this.codigoFilial}-${sequencial}`;
        
        const novaConta = new ContaBancaria(idGerado, this, titular, this.instituicaoPai);
        
        if(depositoInicial > 0) {
            novaConta.realizarDeposito(depositoInicial, true);
        }

        this.listaContas.push(novaConta);
        // salva estado atual
        salvarDados(); 
        return novaConta;
    }

    buscarContaNaFilial(id) {
        return this.listaContas.find(c => c.idConta === id);
    }
}

// classe conta bancaria
class ContaBancaria {
    idConta;
    filial;
    titular;
    bancoPertencente;
    // saldo atual disponivel
    saldoAtual = 0; 
    extratoDetalhado = [];

    constructor(id, filial, titular, banco) {
        this.idConta = id;
        this.filial = filial;
        this.titular = titular;
        this.bancoPertencente = banco;
    }

    // acesso rapido as propriedades
    get saldo() { return this.saldoAtual; }
    get extrato() { return this.extratoDetalhado; }

    _addExtrato(descricao, valor) {
        this.extratoDetalhado.push({
            descricao: descricao,
            valor: valor,
            data: new Date().toLocaleDateString()
        });
    }

    realizarDeposito(valor, isInicial = false) {
        this.saldoAtual += valor;
        const desc = isInicial ? "Bônus de Entrada" : "Recarga (Depósito)";
        this._addExtrato(desc, valor);
        this.bancoPertencente.registrarOperacao(this, valor, desc);
        // persiste dados no storage
        salvarDados(); 
    }

    realizarSaque(valor) {
        if(valor > this.saldoAtual) return false;
        
        this.saldoAtual -= valor;
        this._addExtrato("Saque de Lucros", -valor);
        this.bancoPertencente.registrarOperacao(this, -valor, "Saque");
        // persiste dados no storage
        salvarDados(); 
        return true;
    }

    enviarTransferencia(valor, contaDestino) {
        if(valor > this.saldoAtual) return false;

        this.saldoAtual -= valor;
        this._addExtrato(`Pix enviado para ${contaDestino.titular.nome}`, -valor);
        
        contaDestino.receberTransferencia(valor, this);
        
        this.bancoPertencente.registrarOperacao(this, -valor, "Pix Enviado", contaDestino);
        // persiste dados no storage
        salvarDados(); 
        return true;
    }

    receberTransferencia(valor, contaRemetente) {
        this.saldoAtual += valor;
        this._addExtrato(`Pix recebido de ${contaRemetente.titular.nome}`, valor);
        this.bancoPertencente.registrarOperacao(this, valor, "Pix Recebido");
    }
}

// classe do cliente
class Correntista {
    nome;
    documento;
    
    constructor(nome, doc) {
        this.nome = nome;
        this.documento = doc;
    }
}

// inicializacao do sistema

const sistemaRegulador = new ReguladorFinanceiro();
const bancoTigrudo = new Instituicao("Banco do Tigrudo", sistemaRegulador);

// criacao das filiais padrao
const filialVip = bancoTigrudo.inaugurarFilial("777", "Sala VIP");
const filialComum = bancoTigrudo.inaugurarFilial("100", "Entrada");

// gerenciamento do localstorage

function salvarDados() {
    // serializa estrutura para backup
    const backup = bancoTigrudo.filiais.map(f => ({
        codigo: f.codigoFilial,
        contas: f.listaContas.map(c => ({
            id: c.idConta,
            titular: c.titular,
            saldo: c.saldoAtual,
            extrato: c.extratoDetalhado
        }))
    }));

    localStorage.setItem('db_tigrudo_v1', JSON.stringify(backup));
}

function carregarDados() {
    const raw = localStorage.getItem('db_tigrudo_v1');
    // encerra se nao houver backup
    if (!raw) return; 

    const backup = JSON.parse(raw);

    backup.forEach(filialData => {
        // busca referencia da filial
        const filialReal = bancoTigrudo.filiais.find(f => f.codigoFilial === filialData.codigo);
        
        if (filialReal) {
            // reconstroi instancias das contas
            filialReal.listaContas = filialData.contas.map(cData => {
                const titularObj = new Correntista(cData.titular.nome, cData.titular.documento);
                const contaRecuperada = new ContaBancaria(cData.id, filialReal, titularObj, bancoTigrudo);
                
                // restaura valores
                contaRecuperada.saldoAtual = cData.saldo;
                contaRecuperada.extratoDetalhado = cData.extrato;
                
                return contaRecuperada;
            });
        }
    });
}

// executa carga inicial
carregarDados();

// controle de interface e eventos

const fecharModalBootstrap = (idModal) => {
    const modalEl = document.getElementById(idModal);
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
}

// 1. cadastro de usuario
document.getElementById('btnSalvarCliente').addEventListener('click', () => {
    const nome = document.getElementById('cadNome').value;
    const cpf = document.getElementById('cadCPF').value;
    const valorIni = Number(document.getElementById('cadValorInicial').value);

    if(!nome || !cpf) { alert("Preencha seus dados pra entrar no jogo!"); return; }

    const novoTitular = new Correntista(nome, cpf);
    const novaConta = filialVip.criarContaCorrente(novoTitular, valorIni);

    alert(`Bem-vindo ao time!\nAgência: ${novaConta.filial.codigoFilial}\nConta: ${novaConta.idConta}`);
    
    document.getElementById('cadNome').value = '';
    document.getElementById('cadCPF').value = '';
    document.getElementById('cadValorInicial').value = '';
    fecharModalBootstrap('modalNovoCliente');
});

// 2. operacao de deposito
document.getElementById('btnExecutarDeposito').addEventListener('click', () => {
    const numConta = document.getElementById('depContaDestino').value.trim();
    const valor = Number(document.getElementById('depValor').value);

    const contaAlvo = bancoTigrudo.localizarContaGlobal(numConta);

    if(!contaAlvo) { alert("Conta não achada!"); return; }
    if(valor <= 0) { alert("Valor inválido!"); return; }

    contaAlvo.realizarDeposito(valor);
    alert(`Recarga realizada com sucesso!`);
    fecharModalBootstrap('modalOperacaoDeposito');
    
    document.getElementById('depContaDestino').value = '';
    document.getElementById('depValor').value = '';
});

// 3. operacao de saque
document.getElementById('btnExecutarSaque').addEventListener('click', () => {
    const numConta = document.getElementById('saqContaOrigem').value.trim();
    const valor = Number(document.getElementById('saqValor').value);

    const contaAlvo = bancoTigrudo.localizarContaGlobal(numConta);

    if(!contaAlvo) { alert("Conta não achada!"); return; }
    if(valor <= 0) { alert("Valor inválido!"); return; }

    if(contaAlvo.realizarSaque(valor)) {
        alert(`Saque feito! O dinheiro tá na mão.`);
        fecharModalBootstrap('modalOperacaoSaque');
        document.getElementById('saqContaOrigem').value = '';
        document.getElementById('saqValor').value = '';
    } else {
        alert("Saldo insuficiente na banca.");
    }
});

// 4. transferencia entre contas
document.getElementById('btnExecutarTransf').addEventListener('click', () => {
    const cOrigem = document.getElementById('transfOrigem').value.trim();
    const cDestino = document.getElementById('transfDestino').value.trim();
    const valor = Number(document.getElementById('transfValor').value);

    if(cOrigem === cDestino) { alert("Não dá pra transferir pra mesma conta."); return; }

    const objOrigem = bancoTigrudo.localizarContaGlobal(cOrigem);
    const objDestino = bancoTigrudo.localizarContaGlobal(cDestino);

    if(!objOrigem || !objDestino) { alert("Conta errada ou inexistente."); return; }
    if(valor <= 0) { alert("Valor inválido."); return; }

    if(objOrigem.enviarTransferencia(valor, objDestino)) {
        alert("Pix enviado com sucesso!");
        fecharModalBootstrap('modalOperacaoTransferencia');
    } else {
        alert("Sem saldo na banca pra transferir.");
    }
});

// 5. consulta de extrato
document.getElementById('btnBuscarDados').addEventListener('click', () => {
    const numConta = document.getElementById('consConta').value.trim();
    const painel = document.getElementById('painelResultados');
    const lista = document.getElementById('listaExtrato');
    const displaySaldo = document.getElementById('displaySaldo');

    const contaObj = bancoTigrudo.localizarContaGlobal(numConta);

    if(!contaObj) {
        alert("Conta não encontrada.");
        painel.classList.add('d-none');
        return;
    }

    displaySaldo.innerText = contaObj.saldo.toFixed(2);
    lista.innerHTML = ''; 

    if(contaObj.extrato.length === 0) {
        lista.innerHTML = '<li class="list-group-item">Sem movimentações ainda.</li>';
    } else {
        // ordenacao decrescente por data
        [...contaObj.extrato].reverse().forEach(item => {
            const cor = item.valor >= 0 ? 'text-success' : 'text-danger';
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                <span>${item.descricao} <small class="text-muted">(${item.data})</small></span>
                <span class="fw-bold ${cor}">R$ ${item.valor.toFixed(2)}</span>
            `;
            lista.appendChild(li);
        });
    }

    painel.classList.remove('d-none');
});