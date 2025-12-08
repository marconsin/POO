class ContaBancaria {
    constructor(nome) {
        this.nome = nome;
        this.saldo = 0;
        this.historico = [];
    }

    // registra a operação no histórico
    registrar(tipo, valor, descricao) {
        this.historico.push({
            data: new Date().toLocaleTimeString(),
            tipo,
            valor,
            descricao
        });
    }

    depositar(valor) {
        if (valor <= 0) return console.log('Valor inválido.');
        
        this.saldo += valor;
        this.registrar('Entrada', valor, 'Deposito');
        console.log(`Deposito de R$ ${valor} feito com sucesso.`);
    }

    // retorna true se conseguiu sacar, false se falhou
    sacar(valor) {
        if (valor > this.saldo) {
            console.log(`Saldo insuficiente para sacar R$ ${valor}`);
            return false;
        }
        this.saldo -= valor;
        return true;
    }

    transferir(valor, contaDestino) {
        // tenta sacar primeiro
        if (this.sacar(valor)) {
            // adiciona na conta do amigo
            contaDestino.saldo += valor;
            contaDestino.registrar('Entrada', valor, `Recebido de ${this.nome}`);
            
            // registra a saida na sua conta
            this.registrar('Saida', valor, `Enviado para ${contaDestino.nome}`);
            console.log('Transferencia realizada.');
        }
    }

    pagarBoleto(valor) {
        if (this.sacar(valor)) {
            this.registrar('Saida', valor, 'Pagamento Boleto');
            console.log('Boleto pago.');
        }
    }

    verExtrato() {
        console.log(`\n--- Extrato: ${this.nome} ---`);
        this.historico.forEach(item => {
            console.log(`${item.data} | ${item.tipo} | R$ ${item.valor} | ${item.descricao}`);
        });
        console.log(`Saldo Final: R$ ${this.saldo}\n`);
    }
}

// --- TESTES ---

const conta1 = new ContaBancaria("Dev FullStack");
const conta2 = new ContaBancaria("João Silva");

conta1.depositar(1500);
conta1.pagarBoleto(250);
conta1.transferir(5000, conta2); // teste de erro (sem saldo)
conta1.transferir(300, conta2);  // sucesso

conta1.verExtrato();
conta2.verExtrato();