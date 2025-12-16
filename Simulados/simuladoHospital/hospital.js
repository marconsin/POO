// --- 1. SELEÇÃO DE ELEMENTOS DA DOM ---

// Botões e Inputs de Ação
const btnInternar = document.getElementById("btnInternar");
const cpfInternacao = document.getElementById("cpfInternacao");

const btnAlta = document.getElementById("btnAlta");
const cpfAlta = document.getElementById("cpfAlta");

// Cadastro
const btnCadastrar = document.getElementById("btnCadastrarPaciente");
const radioParticular = document.getElementById("radioParticular");
const radioConvenio = document.getElementById("radioConvenio");
const radioSUS = document.getElementById("radioSUS");

// Relatórios
const btnListarInternados = document.getElementById("btnListarInternados");
const btnListarTodos = document.getElementById("btnListarTodos");
const btnHistorico = document.getElementById("btnHistorico");
const buscaHistoricoCPF = document.getElementById("BuscaHistoricoCPF");
const divRelatorio = document.getElementById("relatorios");


// --- 2. CONTROLE VISUAL (Ocultar/Mostrar campos) ---
function alteraTipoPaciente(event) {
    document.getElementById('divradioParticular').style.display = 'none';
    document.getElementById('divradioConvenio').style.display = 'none';
    document.getElementById('divradioSUS').style.display = 'none';
    
    // Truque do ID: 'div' + 'radioParticular' vira 'divradioParticular'
    document.getElementById('div' + event.currentTarget.id).style.display = 'block';
}

radioParticular.addEventListener("change", alteraTipoPaciente);
radioConvenio.addEventListener("change", alteraTipoPaciente);
radioSUS.addEventListener("change", alteraTipoPaciente);


// --- 3. CLASSES (POO) ---

// CLASSE MÃE (Superclasse)
class Paciente {
    constructor(cpf, nome, idade) {
        this.cpf = cpf;
        this.nome = nome;
        this.idade = idade;
    }
}

// CLASSES FILHAS (Herança)
class Particular extends Paciente {
    constructor(cpf, nome, idade, quarto) {
        super(cpf, nome, idade);
        this.quarto = quarto;
        this.tipo = "Particular";
    }
}

class Convenio extends Paciente {
    constructor(cpf, nome, idade, plano, carencia) {
        super(cpf, nome, idade);
        this.nomePlano = plano;
        this.temCarencia = carencia;
        this.tipo = "Convênio";
    }
}

class SUS extends Paciente {
    constructor(cpf, nome, idade, cartaoSUS) {
        super(cpf, nome, idade);
        this.cartaoSUS = cartaoSUS;
        this.tipo = "SUS";
    }
}

// CLASSE DE REGISTRO (Associação: Paciente + Datas)
class RegistroInternacao {
    constructor(paciente) {
        this.paciente = paciente;       // O objeto paciente inteiro
        this.dataEntrada = new Date();  // Hora da internação
        this.dataAlta = null;           // Null = ainda está no hospital
    }
}

// CLASSE GESTORA (O Hospital)
class Hospital {
    constructor() {
        this.listaInternacoes = []; // Onde ficam os registros de entrada/saída
    }

    // Método a) Registrar Internação
    registrarInternacao(cpf) {
        // Busca na lista geral de pacientes cadastrados
        let pacienteEncontrado = listaPacientesGeral.find(p => p.cpf == cpf);

        if (!pacienteEncontrado) {
            alert("Erro: Paciente não cadastrado na base de dados.");
            return;
        }

        // Verifica se já não está internado (segurança extra)
        let jaInternado = this.listaInternacoes.find(r => r.paciente.cpf == cpf && r.dataAlta == null);
        if (jaInternado) {
            alert("Este paciente já está internado!");
            return;
        }

        // Cria o registro
        this.listaInternacoes.push(new RegistroInternacao(pacienteEncontrado));
        alert(`Internação de ${pacienteEncontrado.nome} registrada!`);
    }

    // Método b) Registrar Alta
    registrarAlta(cpf) {
        // Busca uma internação ativa (dataAlta == null) desse CPF
        let registro = this.listaInternacoes.find(r => r.paciente.cpf == cpf && r.dataAlta == null);

        if (!registro) {
            alert("Não há internação ativa para este CPF.");
            return;
        }

        registro.dataAlta = new Date(); // Marca a saída
        alert("Alta médica registrada com sucesso!");
    }

    // Método c) Listar Pacientes Atuais (Internados)
    listarInternados() {
        divRelatorio.innerHTML = '<strong>Pacientes Atualmente Internados:</strong><br>';
        
        this.listaInternacoes.forEach(r => {
            if (r.dataAlta == null) { // Só quem não saiu ainda
                divRelatorio.innerHTML += `Nome: ${r.paciente.nome} (${r.paciente.tipo}) - Quarto/Leito: ${this.getDetalheLocal(r.paciente)}<br>`;
            }
        });
    }

    // Método auxiliar para pegar detalhe dependendo do tipo (Polimorfismo simples)
    getDetalheLocal(paciente) {
        if (paciente.tipo == "Particular") return "Quarto " + paciente.quarto;
        if (paciente.tipo == "Convênio") return "Plano " + paciente.nomePlano;
        return "Leito SUS";
    }

    // Método d) Histórico
    listarHistorico(cpf) {
        divRelatorio.innerHTML = `<strong>Histórico do CPF ${cpf}:</strong><br>`;
        
        let historico = this.listaInternacoes.filter(r => r.paciente.cpf == cpf);
        
        historico.forEach(r => {
            let status = r.dataAlta ? `Alta em: ${r.dataAlta.toLocaleString()}` : "AINDA INTERNADO";
            divRelatorio.innerHTML += `Entrada: ${r.dataEntrada.toLocaleString()} | ${status} <br><hr>`;
        });
    }
}


// --- 4. LISTAS E INICIALIZAÇÃO ---

let listaPacientesGeral = []; // Banco de dados de pessoas
let meuHospital = new Hospital(); // Sistema rodando


// --- 5. EVENTOS DOS BOTÕES ---

// Botão de Cadastrar Paciente
btnCadastrar.addEventListener('click', () => {
    let cpf = document.getElementById('NovoPacienteCPF').value;
    let nome = document.getElementById('NovoPacienteNome').value;
    let idade = document.getElementById('NovoPacienteIdade').value;
    
    let novoPaciente = null;

    if (radioParticular.checked) {
        let quarto = document.getElementById('InputQuarto').value;
        novoPaciente = new Particular(cpf, nome, idade, quarto);
    } 
    else if (radioConvenio.checked) {
        let plano = document.getElementById('InputPlano').value;
        let carencia = document.getElementById('InputCarencia').value;
        novoPaciente = new Convenio(cpf, nome, idade, plano, carencia);
    } 
    else if (radioSUS.checked) {
        let cartao = document.getElementById('InputCartaoSUS').value;
        novoPaciente = new SUS(cpf, nome, idade, cartao);
    }

    if (novoPaciente) {
        // Verifica duplicidade simples
        if(listaPacientesGeral.find(p => p.cpf == cpf)){
            alert("CPF já cadastrado!");
            return;
        }
        
        listaPacientesGeral.push(novoPaciente);
        alert("Paciente cadastrado com sucesso!");
    } else {
        alert("Selecione um tipo de atendimento!");
    }
});

// Botões de fluxo
btnInternar.addEventListener('click', () => {
    meuHospital.registrarInternacao(cpfInternacao.value);
});

btnAlta.addEventListener('click', () => {
    meuHospital.registrarAlta(cpfAlta.value);
});

// Botões de relatório
btnListarInternados.addEventListener('click', () => {
    meuHospital.listarInternados();
});

btnListarTodos.addEventListener('click', () => {
    divRelatorio.innerHTML = "<strong>Base de Dados:</strong><br>";
    listaPacientesGeral.forEach(p => {
        divRelatorio.innerHTML += `${p.nome} - CPF: ${p.cpf} (${p.tipo})<br>`;
    });
});

btnHistorico.addEventListener('click', () => {
    meuHospital.listarHistorico(buscaHistoricoCPF.value);
});