// --- PARTE 1: PEGAR ELEMENTOS DO HTML (IGUAL AO SEU CÓDIGO) ---

// Botões e inputs de Empréstimo/Devolução
btRegistraEmprestimo = document.getElementById("registrarEmprestimo");
codigoEntrada = document.getElementById("codigoEntrada");

btRegistraDevolucao = document.getElementById("registrarDevolucao");
codigoSaida = document.getElementById("codigoSaida");

// Relatórios
btExibirAcervo = document.getElementById("ExibirAcervo");
btExibirEmprestados = document.getElementById("ExibirEmprestados");
btExibirHistorico = document.getElementById("ExibirHistorico");
HistoricoCodigo = document.getElementById("HistoricoCodigo");
spanRelatorio = document.getElementById("relatorios");

// Cadastro
btSalvarMaterial = document.getElementById("CadastrarMaterial");
radioLivro = document.getElementById("radioLivro");
radioRevista = document.getElementById("radioRevista");
radioDVD = document.getElementById("radioDVD");


// --- PARTE 2: FUNÇÕES DE CONTROLE DE TELA ---

// Função para mostrar/esconder inputs (Igual ao alteraTipoVeiculo)
function alteraTipoMaterial(event) {
    document.getElementById('divradioLivro').style.display = 'none';
    document.getElementById('divradioRevista').style.display = 'none';
    document.getElementById('divradioDVD').style.display = 'none';
    
    // Mostra a div correspondente ao radio clicado
    document.getElementById('div' + event.currentTarget.id).style.display = 'block';
}

radioLivro.addEventListener("change", alteraTipoMaterial);
radioRevista.addEventListener("change", alteraTipoMaterial);
radioDVD.addEventListener("change", alteraTipoMaterial);

// --- EVENTOS DOS BOTÕES ---

btRegistraEmprestimo.addEventListener('click', () => {
    minhaBiblioteca.registrarEmprestimo(codigoEntrada.value);
});

btRegistraDevolucao.addEventListener('click', () => {
    minhaBiblioteca.registrarDevolucao(codigoSaida.value);
});

btExibirAcervo.addEventListener('click', () => {
    spanRelatorio.innerHTML = '';
    // Varre o acervo e imprime tudo
    acervoGeral.forEach(m => spanRelatorio.innerHTML += JSON.stringify(m) + '<br>');
});

btExibirEmprestados.addEventListener('click', () => {
    minhaBiblioteca.listarEmprestados();
});

btExibirHistorico.addEventListener('click', () => {
    minhaBiblioteca.listarHistoricoPorCodigo(HistoricoCodigo.value);
});

btSalvarMaterial.addEventListener("click", salvarMaterial);


// --- PARTE 3: LÓGICA DE SALVAR (Igual ao seu salvarVeiculo) ---

function salvarMaterial() {
    const codigo = document.getElementById('NovoMaterialCodigo').value;
    const titulo = document.getElementById('NovoMaterialTitulo').value;
    const ano = document.getElementById('NovoMaterialAno').value;

    let novoMaterial = null;

    // Verifica qual radio está marcado e cria o objeto certo
    if (radioLivro.checked) {
        const autor = document.getElementById('NovoMaterialAutor').value;
        novoMaterial = new Livro(codigo, titulo, ano, autor);
    } 
    else if (radioRevista.checked) {
        const edicao = document.getElementById('NovoMaterialEdicao').value;
        novoMaterial = new Revista(codigo, titulo, ano, edicao);
    } 
    else if (radioDVD.checked) {
        const duracao = document.getElementById('NovoMaterialDuracao').value;
        novoMaterial = new DVD(codigo, titulo, ano, duracao);
    }

    if (novoMaterial == null) {
        alert("Selecione o tipo de material!");
        return;
    }

    // Adiciona ao "banco de dados" fake
    acervoGeral.push(novoMaterial);
    alert("Material cadastrado com sucesso!");
}

// --- PARTE 4: CLASSES (POO) ---

// CLASSE MÃE
class Material {
    constructor(codigo, titulo, ano) {
        this.codigo = codigo;
        this.titulo = titulo;
        this.ano = ano;
    }
}

// CLASSES FILHAS
class Livro extends Material {
    constructor(codigo, titulo, ano, autor) {
        super(codigo, titulo, ano);
        this.autor = autor;
        this.tipo = "Livro";
    }
}

class Revista extends Material {
    constructor(codigo, titulo, ano, edicao) {
        super(codigo, titulo, ano);
        this.edicao = edicao;
        this.tipo = "Revista";
    }
}

class DVD extends Material {
    constructor(codigo, titulo, ano, duracao) {
        super(codigo, titulo, ano);
        this.duracao = duracao;
        this.tipo = "DVD";
    }
}

// CLASSE DE REGISTRO (ticket de empréstimo)
class RegistroEmprestimo {
    constructor(material) {
        this.material = material;
        this.dataEmprestimo = new Date();
        this.dataDevolucao = null; // null = ainda está com a pessoa
    }
}

// CLASSE CONTROLADORA (A Biblioteca)
class Biblioteca {
    constructor() {
        this.listaEmprestimos = []; 
        this.relatorio = document.getElementById('relatorios');
    }

    registrarEmprestimo(codigo) {
        // Busca o objeto completo no acervo usando o código
        let material = acervoGeral.find(item => item.codigo == codigo);

        if(!material) {
            alert('Material não encontrado no cadastro!');
            return;
        }
        
        // Cria um novo registro e salva na lista
        this.listaEmprestimos.push(new RegistroEmprestimo(material));
        alert("Empréstimo Registrado!");
    }

    registrarDevolucao(codigo) {
        // Busca um empréstimo que tenha esse código E que a devolução seja null
        let registro = this.listaEmprestimos.find(r => r.material.codigo == codigo && r.dataDevolucao == null);

        if(!registro) {
            alert('Não há empréstimo pendente para este código.');
            return;
        }

        // Atualiza a data de devolução
        registro.dataDevolucao = new Date();
        alert("Devolução Registrada!");
    }

    listarEmprestados() {
        this.relatorio.innerHTML = '';
        // Filtra só quem NÃO tem data de devolução
        this.listaEmprestimos.forEach(r => {
            if(r.dataDevolucao == null) {
                this.relatorio.innerHTML += JSON.stringify(r) + '<br><br>';
            }
        });
    }

    listarHistoricoPorCodigo(codigo) {
        this.relatorio.innerHTML = '';
        // Mostra tudo que tem aquele código, devolvido ou não
        this.listaEmprestimos.forEach(r => {
            if(r.material.codigo == codigo) {
                this.relatorio.innerHTML += JSON.stringify(r) + '<br>';
            }
        });
    }
}

// --- INSTANCIAÇÃO ---
let acervoGeral = []; // Lista global de livros cadastrados
let minhaBiblioteca = new Biblioteca(); // O sistema rodando