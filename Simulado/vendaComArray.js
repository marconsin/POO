class pessoa{
    constructor(nome, cpf, idade){
        this.nome = nome;
        this.cpf = cpf;
        this.idade = idade;
    }
}

class vendedor extends pessoa{
    constructor(nome, cpf, idade, idVendedor){
        super(nome, cpf, idade);
        this.idVendedor = idVendedor;
    }
}

let vini = new vendedor ("Vinícius", "03076538110", 20, 1);

class cliente extends pessoa{
    constructor(nome, cpf, idade, endereco, dinheiro){
        super(nome, cpf, idade);
        this.endereco = endereco;
        this.dinheiro = dinheiro;
    }
}

let joao = new cliente ("João", "04764237840", 69, "Rua A", 100); // dei mais dinheiro pro joao

class produtos{
    constructor(nome, valor, estoque){
        this.nome = nome;
        this.valor = valor;
        this.estoque = estoque;
    }
}

// criando varios produtos
let suco = new produtos ("Suco", 20, 5);
let coxinha = new produtos ("Coxinha", 10, 10);
let doce = new produtos ("Doce", 5, 20);

class vendas{
    constructor(){
        this.historico = [];
    }

   // agora recebe uma LISTA de produtos (array)
   processarCarrinho(cliente, listaProdutos){
    
    let totalCompra = 0;

    // --- passo 1: verificar tudo antes de vender ---
    
    // loop para somar valor e checar estoque
    for (let item of listaProdutos) {
        
        // checa se tem estoque desse item
        if (item.estoque <= 0) {
            console.log(`erro: ${item.nome} acabou!`);
            return false;
        }

        // soma ao valor total
        totalCompra += item.valor;
    }

    // checa se tem dinheiro pro total
    if (totalCompra > cliente.dinheiro) {
        console.log(`falta dinheiro! total é ${totalCompra}`);
        return false;
    }

    // --- passo 2: efetivar a venda ---
    
    console.log('carrinho aprovado! processando...');

    // desconta o dinheiro
    cliente.dinheiro -= totalCompra;

    // loop para tirar do estoque um por um
    for (let item of listaProdutos) {
        item.estoque -= 1;
    }

    // salva no historico
    let registro = {
        cliente: cliente.nome,
        itens: listaProdutos.length, // conta quantos itens
        valorTotal: totalCompra
    };
    
    this.historico.push(registro);
    
    console.log(`venda feita! total: R$ ${totalCompra}`);
    return true;
    }

    gerarRelatorio(){
        console.log("--- relatorio ---");
        console.table(this.historico);
    }
}

// sistema de vendas
let loja = new vendas();

// --- criando um carrinho de compras ---
// array com os produtos que o joao quer
let carrinhoDoJoao = [suco, coxinha, doce, coxinha]; // ele quer 2 coxinhas

// processa a lista inteira
loja.processarCarrinho(joao, carrinhoDoJoao);

// mostra como ficou o dinheiro e estoque
console.log(`saldo do joão: ${joao.dinheiro}`);
console.log(`estoque coxinha: ${coxinha.estoque}`);

// relatorio
loja.gerarRelatorio();