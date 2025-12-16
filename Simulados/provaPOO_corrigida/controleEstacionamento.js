//Busca os elementos na DOM pra facilitar a codificação 
//operações de estacionamento
btRegistraEntrada = document.getElementById("registrarEntrada");
placaEntrada = document.getElementById("placaEntrada");
btRegistraSaida = document.getElementById("registrarSaida");
placaSaida = document.getElementById("placaSaida");

//relatórios
btExibirVeiculos = document.getElementById("ExibirVeiculos");
btExibirVeiculosEstacionados = document.getElementById("ExibirVeiculosEstacionados");
btExibirHistoricoVeiculo = document.getElementById("ExibirHistoricoVeiculo");
//placa para busca do histórico utilizando a placa
HistoricoPlaca = document.getElementById("HistoricoPlaca");

//cadastro de novo veiculo
btSalvarveiculo = document.getElementById("CadastrarVeiculo");
radioCarro = document.getElementById("radioCarro");
radioMoto = document.getElementById("radioMoto");
radioCaminhao = document.getElementById("radioCaminhao");


function alteraTipoVeiculo(event) {
    //mantém todos invisíveis para depois deixar visivel apenas o que é necessário, isso simplifica a lógica
    document.getElementById('divradioCarro').style.display = 'none';
    document.getElementById('divradioMoto').style.display = 'none';
    document.getElementById('divradioCaminhao').style.display = 'none';
    //de forma marota aproveita o nome do ID para encontrar e mostrar o bloco de inputs associados ao tipo selecionado
    document.getElementById('div' + event.currentTarget.id).style.display = 'block';
}

//seleção de tipo de veiculo
radioCarro.addEventListener("change", alteraTipoVeiculo)
radioMoto.addEventListener("change", alteraTipoVeiculo)
radioCaminhao.addEventListener("change", alteraTipoVeiculo)

//registra a entrada de um veículo
function registrarEntradaVeiculos()
{
      estacionamentoAvCentral.registrarEntrada(placaEntrada.value)
}
btRegistraEntrada.addEventListener('click', registrarEntradaVeiculos)

//registra a saída de um veículo
function registrarSaidaVeiculos()
{
      estacionamentoAvCentral.registrarSaida(placaSaida.value)
}
btRegistraSaida.addEventListener('click', registrarSaidaVeiculos)

//exibi o histórico de registros de um veículo
function ExibirHistoricoVeiculo()
{
     estacionamentoAvCentral.registrosPorPlaca(HistoricoPlaca.value)
}
btExibirHistoricoVeiculo.addEventListener('click', ExibirHistoricoVeiculo)

//exibi todos os carros cadastrados
function ExibirVeiculos()
{
     estacionamentoAvCentral.listarTodosCarros()
}
btExibirVeiculos.addEventListener('click', ExibirVeiculos)

//botao de exibir veiculos estacionados
function ExibirVeiculosEstacionados()
{
     estacionamentoAvCentral.carrosAtualmenteEstacionados()
}
btExibirVeiculosEstacionados.addEventListener('click', ExibirVeiculosEstacionados)


function salvarVeiculo() {

    // Dados gerais
    const placa = document.getElementById('NovoVeiculoPlaca').value
    const modelo = document.getElementById('NovoVeiculoModelo').value
    const cor = document.getElementById('NovoVeiculoCor').value
    const ano = document.getElementById('NovoVeiculoAno').value

    let novoVeiculo = null
    if (document.getElementById('radioCarro').checked) {
        const precisaCarregamentoEletrico = document.getElementById('NovoVeiculoCarregamentoE').value
        const quantasPortas = document.getElementById('NovoVeiculoQtsPortas').value

        novoVeiculo = new carro(placa, cor, modelo, ano, precisaCarregamentoEletrico, quantasPortas, "carro")
    }

    // MOTO selecionada
    else if (document.getElementById('radioMoto').checked) {
        const tipoVaga = document.getElementById('NovoVeiculoTipoVaga').value
        const quantasVagasNecessita = document.getElementById('NovoVeiculoQtsVagas').value
        novoVeiculo = new motocicleta(placa, cor, modelo, ano, tipoVaga, quantasVagasNecessita)
    }

    // CAMINHÃO selecionado
    else if (document.getElementById('radioCaminhao').checked) {
        const qtdEixos = document.getElementById('NovoVeiculoEixos').value
        const altura = document.getElementById('NovoVeiculoAltura').value
        // só existiam 2 campos — vou criar o "comprimento" como placeholder
        const comprimento = 0
        novoVeiculo = new caminhao(placa, cor, modelo, ano, qtdEixos, altura, comprimento)
    }

    //verificação de placa já cadastrada
    let novoVeiculoLista = placaCadastrada(placa)
    if (novoVeiculoLista != undefined) {
        alert('Essa placa já está cadastrada')
        return;
    }
    if (novoVeiculo == null) {
        alert("Selecione o tipo de veículo!")
        return
    }

    listaVeiculos.add(novoVeiculo)
    alert("Veículo cadastrado com sucesso!")
}


function placaCadastrada(placa) {
    let veiculoEncontrado = undefined
    //cbusca pra ver se existe um veiculo com a referida placa
    listaVeiculos.forEach(element => {
        if (element.placa.toString().toLowerCase() == placa.toString().toLowerCase())
            veiculoEncontrado = element;
    });
    //retorna o veiculo
    return veiculoEncontrado;
}

btSalvarveiculo.addEventListener("click", salvarVeiculo)

class veiculo {
    placa
    cor
    modelo
    ano
    constructor(placa, cor, modelo, ano) {
        this.placa = placa
        this.cor = cor
        this.modelo = modelo
        this.ano = ano
    }
}

class motocicleta extends veiculo {
    tipoVaga
    quantasVagasNecessita
    constructor(placa, cor, modelo, ano, tipoVaga, quantasVagasNecessita) {
        super(placa, cor, modelo, ano)
        this.tipoVaga = tipoVaga
        this.quantasVagasNecessita = quantasVagasNecessita
    }
}

class carro extends veiculo {
    precisaCarregamentoEletrico = false
    quantasPortas
    tipoVeiculo

    constructor(placa, cor, modelo, ano, precisaCarregamentoEletrico, quantasPortas, tipoVeiculo) {
        super(placa, cor, modelo, ano)
        this.precisaCarregamentoEletrico = precisaCarregamentoEletrico
        this.quantasPortas = quantasPortas
        this.tipoVeiculo = tipoVeiculo
    }
}

class caminhao extends veiculo {
    qtdEixos
    altura
    comprimento

    constructor(placa, cor, modelo, ano, qtdEixos, altura, comprimento) {
        super(placa, cor, modelo, ano)
        this.qtdEixos = qtdEixos
        this.altura = altura
        this.comprimento = comprimento
    }
}


//Classe para organizar os dados de uma operação, ou seja, de um evento de estacionamento
class registroEstacionamento {
    dataIn
    dataOut = false
    veiculoEstacionado

    constructor(veiculoEstacionado, data = new Date()) {
        this.veiculoEstacionado = veiculoEstacionado
        this.dataIn = data
    }

    registrarSaida(data = new Date()) {
        this.dataOut = data
    }
}

class estacionamento {
    listaEntradas = new Set()
    relatorio
    constructor()
    {
        this.relatorio = document.getElementById('relatorios')//utilizei um span pra gerar os relatórios, a divisão ocorre por quebra de linha
    }

    //faz a busca de um veiculo na lista geral de cadastros utilizando a placa
    registrarEntrada(placa, data = new Date()) {
        let veiculoIn = placaCadastrada(placa)//método genérico de busca de veiculos cadastrados
        if(!veiculoIn) {
            alert('Veiculo não encontrado')
            return;
        }
        this.listaEntradas.add(new registroEstacionamento(veiculoIn) )
    }

    registrarSaida(placa, data = new Date()) {
        let registroEst =  this.buscaVeiculo(placa)//método especifico da classe estacionamento para verificar um veiculo estacionado
        if(!registroEst) {
            alert('Veiculo não encontrado')
            return;
        }
        registroEst.registrarSaida(data)        
    }    

    //busca um veiculo na lista de registros do estacionamento: listaEntradas
    buscaVeiculo(placa) {
        let veiculoEncontrado = undefined
        //cbusca pra ver se existe um veiculo com a referida placa
        this.listaEntradas.forEach(element => {
            if (element.veiculoEstacionado.placa.toString().toLowerCase() == placa.toString().toLowerCase())
                veiculoEncontrado = element;
        });
        //retorna o veiculo
        return veiculoEncontrado;
    }

    //Relatório: mostrando o json, sem frescura, em WD nos preocupamos com isso
    carrosAtualmenteEstacionados()
    {
        this.relatorio.innerHTML = ''
        this.listaEntradas.forEach(v => { if(!v.dataOut) this.relatorio.innerHTML += JSON.stringify( v) +'<br><br>'})
    }

    //relatorio por placa de um veiculo
    registrosPorPlaca(placa)
    {
        this.relatorio.innerHTML = ''
        this.listaEntradas.forEach(v => { if(v.veiculoEstacionado.placa == placa) this.relatorio.innerHTML += JSON.stringify( v) +'<br>'})
    }

    //relatório de todos os carros cadastrados
    listarTodosCarros()
    {
        this.relatorio.innerHTML = ''
        listaVeiculos.forEach(v => this.relatorio.innerHTML += JSON.stringify( v) +'<br>'  )
    }
}
//lista de veiculos cadastrados. Essa lista pode ser utilizada por outros estacionamentos(instâncias)
listaVeiculos = new Set()
//instancia de estacionamento: aqui será feito o controle de entrada e saída e a exibição de relatórios
estacionamentoAvCentral = new estacionamento()