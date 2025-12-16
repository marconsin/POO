// classe pessoa, padrão pra vendedor e cliente herdar os atributos dela depois. (utilizando constructor)
class pessoa{
    constructor(nome, cpf, idade){
        this.nome = nome;
        this.cpf = cpf;
        this.idade = idade;
    }
}
class vendedor extends pessoa{
    constructor(nome, cpf, idade, idVendedor){
        super(nome, cpf, idade); // puxa dados de pessoa
        this.idVendedor = idVendedor;
    }
}

// cria o vendedor seguindo os parametros do constructor (nome, cpf, idade e id)
let vini = new vendedor ("Vinícius", "03076538110", 20, 1);

class cliente extends pessoa{
    constructor(nome, cpf, idade, endereco, dinheiro){
        super(nome, cpf, idade); // puxa dados de pessoa
        this.endereco = endereco;
        this.dinheiro = dinheiro;
    }
}

// cria o cliente com 50 reais
let joao = new cliente ("João", "04764237840", 69, "Rua A", 50);

class produtos{
    constructor(nome, valor, estoque){
        this.nome = nome;
        this.valor = valor;
        this.estoque = estoque;
    }
}

// cria suco: custa 20, tem 5 no estoque
let suco = new produtos ("Suco", 20, 5);

class vendas{
    constructor(){
        this.historico = []; // lista pra guardar vendas
    }

   processarVendas(cliente, produto, qtd){
    
    // calcula preço total
    let total = produto.valor * qtd;

    // confere se tem dinheiro
    if (total > cliente.dinheiro) 
        {console.log('Saldo insuficiente!');
        return false;}

    // confere se tem estoque
    if (qtd > produto.estoque)
        {console.log('Estoque esgotado!')
        return false}

    else { 
           console.log('Processando...');
           
           // tira do estoque
           produto.estoque -= qtd; 
           
           // cobra do cliente
           cliente.dinheiro -= total;
           
           // cria registro simples
           let registro = {
               quem: cliente.nome,
               item: produto.nome,
               qtd: qtd,
               valor: total
           }

           // salva no historico
           this.historico.push(registro);
           
           console.log("Venda realizada!");
           return true;
        }
    }

    // mostra relatório final
    gerarRelatorio(){
        console.log("\n--- Relatorio ---");
        console.table(this.historico);
    }
}

// inicia sistema de vendas
let loja = new vendas();

console.log(`Estoque de itens disponíveis: ${suco.nome} : ${suco.estoque}\n`)

// joao compra 2 sucos
loja.processarVendas(joao, suco, 2);

// joao tenta comprar mais 1 (vai faltar dinheiro)
loja.processarVendas(joao, suco, 1);

// mostra o historico na tela
loja.gerarRelatorio();