class pessoa{
    nome;
    cpf;
    idade;
}

class vendedor extends pessoa{
    idVendedor;
}

let vini = new vendedor ();
vini.nome = "Vinícius Vieira Queiroz Marconsin";  
vini.cpf = "03076538110";  
vini.idade = 20;
vini.idVendedor = 10

class cliente extends pessoa{
    endereco = {}
    dinheiro;
}

let joao = new cliente ();
joao.nome = "João Só João";  
joao.cpf = "04764237840";  
joao.idade = 69;
joao.endereco = {"Rua:": "Antônio Estevan Leal", "Número": "2633"}
joao.dinheiro = 20

class produtos{
    idProduto;
    valorProduto;
}

let suco = new produtos ();
suco.idProduto = 1
suco.valorProduto = 20

class vendas{
   processarVendas (cliente, produtos){
    if (produtos.valorProdutos > cliente.dinheiro) 
        {console.log('Saldo insuficiente!');
        return false;}

    else { console.log('Processando venda...')
            cliente.dinheiro -= produtos.valorProduto;
            this.totalValor = produtos.valorProduto;
            this.cliente = cliente.nome;
            return true;
        }
}
}
// FAZENDO UMA VENDA
let venda1 = new vendas();

// CHAMANDO A VENDA
venda1.processarVendas(joao, suco)
