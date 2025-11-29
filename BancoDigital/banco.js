/**
 * Simulação de Banco Digital Simplificado
 */

class ContaBancaria {
  constructor(nome) {
    this.nome = nome;
    this.saldo = 0;
    this.historico = []; // Armazena o extrato
  }

  // Helper para formatar moeda em Reais (BRL)
  formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  // Helper para registrar transações
  registrarTransacao(tipo, valor, descricao = '') {
    const data = new Date().toLocaleString('pt-BR');
    this.historico.push({
      data,
      tipo,
      valor: this.formatarMoeda(valor),
      descricao
    });
  }

  // 1. Funcionalidade: Depositar
  depositar(valor) {
    if (valor <= 0) {
      console.error(`[Erro] Depósito inválido. Valor deve ser positivo.`);
      return;
    }
    this.saldo += valor;
    this.registrarTransacao('Entrada', valor, 'Depósito via Pix');
    console.log(`✅ Depósito de ${this.formatarMoeda(valor)} realizado com sucesso!`);
  }

  // 2. Funcionalidade: Sacar (necessário para pagamentos/transferências)
  sacar(valor) {
    if (valor > this.saldo) {
      console.error(`[Erro] Saldo insuficiente para sacar ${this.formatarMoeda(valor)}.`);
      return false;
    }
    this.saldo -= valor;
    return true;
  }

  // 3. Funcionalidade: Transferir
  transferir(valor, contaDestino) {
    if (valor <= 0) return console.error("[Erro] Valor inválido.");
    if (contaDestino === this) return console.error("[Erro] Não pode transferir para si mesmo.");

    console.log(`🔄 Iniciando transferência para ${contaDestino.nome}...`);
    
    const sucessoSaque = this.sacar(valor); // Tenta tirar o dinheiro primeiro

    if (sucessoSaque) {
      // Adiciona dinheiro na conta destino sem gerar log de "Depósito comum"
      contaDestino.saldo += valor;
      contaDestino.registrarTransacao('Entrada', valor, `Transferência recebida de ${this.nome}`);
      
      // Registra a saída na conta atual
      this.registrarTransacao('Saída', valor, `Transferência enviada para ${contaDestino.nome}`);
      console.log(`✅ Transferência realizada!`);
    }
  }

  // 4. Funcionalidade Extra: Pagar Boleto
  pagarBoleto(valor, codigoBarras) {
    console.log(`📄 Tentando pagar boleto: ${codigoBarras}...`);
    const sucesso = this.sacar(valor);
    
    if (sucesso) {
      this.registrarTransacao('Saída', valor, 'Pagamento de Boleto');
      console.log(`✅ Boleto pago com sucesso!`);
    }
  }

  // 5. Funcionalidade: Ver Extrato
  verExtrato() {
    console.log(`\n========================================`);
    console.log(`EXTRATO: ${this.nome.toUpperCase()}`);
    console.log(`----------------------------------------`);
    
    if (this.historico.length === 0) {
      console.log("Nenhuma movimentação registrada.");
    } else {
      this.historico.forEach((item, index) => {
        const seta = item.tipo === 'Entrada' ? '🟢' : '🔴';
        console.log(`${index + 1}. ${item.data} | ${seta} ${item.tipo}`);
        console.log(`   ${item.descricao} | Valor: ${item.valor}`);
      });
    }
    
    console.log(`----------------------------------------`);
    console.log(`💰 SALDO ATUAL: ${this.formatarMoeda(this.saldo)}`);
    console.log(`========================================\n`);
  }
}

// --- ÁREA DE TESTES (SIMULAÇÃO) ---

// Criando dois usuários
const minhaConta = new ContaBancaria("Dev FullStack");
const contaAmigo = new ContaBancaria("João Silva");

// 1. Fazendo um depósito inicial
minhaConta.depositar(1500.00);

// 2. Pagando uma conta (Funcionalidade extra)
minhaConta.pagarBoleto(250.50, "83291.32131.12312.31231");

// 3. Tentando transferir mais do que tem (Teste de erro)
minhaConta.transferir(5000, contaAmigo); 

// 4. Transferindo valor válido para o João
minhaConta.transferir(300.00, contaAmigo);

// 5. Imprimindo os extratos finais
minhaConta.verExtrato();
contaAmigo.verExtrato();