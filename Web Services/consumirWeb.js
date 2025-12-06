async function buscarCep()
{
    let resposta = await fetch('https://viacep.com.br/ws/79610310/json/')
    document.getElementById("texto").innerHTML = (await resposta.json()).logradouro


}

buscarCep()