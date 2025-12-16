class Estacionamento {
    constructor(){
        this.veiculosAtuais = []; // Veículos que estão agora
        this.historico = [];       // Veículos que já passaram
    }
    
    // a) registrarEntrada(veiculo)
    registrarEntrada(veiculo){
        // 1. Adiciona o veículo à lista de atuais
        this.veiculosAtuais.push(veiculo);
        console.log(`Entrada registrada para a placa: ${veiculo.placa}`);
    }

    // b) registrarSaida(placa)
    registrarSaida(placa){
        // 1. Encontra o veículo na lista de atuais
        const index = this.veiculosAtuais.findIndex(v => v.placa === placa);

        if (index === -1) {
            console.error(`Veículo com placa ${placa} não encontrado.`);
            return false;
        }

        const veiculoSaindo = this.veiculosAtuais[index];

        // 2. Atualiza a horaSaida
        veiculoSaindo.horaSaida = new Date().toLocaleTimeString(); // Usando uma data/hora real para simular

        // 3. Move para o histórico
        this.historico.push(veiculoSaindo);

        // 4. Remove dos veículos atuais
        this.veiculosAtuais.splice(index, 1);
        
        console.log(`Saída registrada para a placa: ${placa}`);
        return true;
    }

    // c) listarVeiculosAtuais()
    listarVeiculosAtuais(){
        console.log("\n--- Veículos Atualmente Estacionados ---");
        console.table(this.veiculosAtuais.map(v => ({
            Placa: v.placa, 
            Modelo: v.modelo, 
            Entrada: v.horaEntrada,
            Vaga: v.vagaOcupada
        })));
    }

    // d) listarHistorico()
    listarHistorico(){
        console.log("\n--- Histórico de Veículos ---");
        console.table(this.historico.map(v => ({
            Placa: v.placa, 
            Modelo: v.modelo, 
            Entrada: v.horaEntrada, 
            Saída: v.horaSaida,
            Cobrança: v.valorCobranca // Exemplo de uso dos dados específicos
        })));
    }
}