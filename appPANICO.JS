let panicoAtivado = false; // Variável para controlar o estado do botão de pânico
let som = new Audio("sound/alarme.mp3"); // Carrega o áudio do alarme para ser reproduzido
let track; // Variável para armazenar o controle de vídeo

// Seleciona o botão pelo ID 'button' apenas quando o documento estiver pronto
window.onload = function() {
    const botao = document.getElementById('button');

    // Função para ativar o pânico
    async function ativarPanico() {
        if (!panicoAtivado) {
            botao.src = "img/panicon.png"; // Altera a imagem do botão para o estado "ativado"
            som.play(); // Toca o som do alarme
            await ligarLanterna(); // Liga a lanterna
            panicoAtivado = true; // Define que o modo pânico está ativado
        }
    }

    // Função para desativar o pânico
    async function desativarPanico() {
        if (panicoAtivado) {
            botao.src = "img/botaopanico.jpg"; // Altera a imagem do botão para o estado "desativado"
            som.pause(); // Pausa o som do alarme
            som.currentTime = 0; // Reinicia o áudio do começo para a próxima ativação
            await desligarLanterna(); // Desliga a lanterna
            panicoAtivado = false; // Define que o modo pânico está desativado
        }
    }

    // Eventos de ativação e desativação do pânico com mousedown/touchstart e mouseup/touchend
    botao.addEventListener('mousedown', (event) => {
        event.preventDefault();
        ativarPanico();
    });
    botao.addEventListener('touchstart', (event) => {
        event.preventDefault();
        ativarPanico();
    });
    botao.addEventListener('mouseup', (event) => {
        event.preventDefault();
        desativarPanico();
    });
    botao.addEventListener('touchend', (event) => {
        event.preventDefault();
        desativarPanico();
    });

    // Inicializa a lanterna ao carregar o script
    inicializarLanterna();
}

// Função para inicializar a lanterna
async function inicializarLanterna() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" } // Usa a câmera traseira
        });
        track = stream.getVideoTracks()[0]; // Obtém a primeira track de vídeo do stream

        const capabilities = track.getCapabilities();
        if (!capabilities.torch) {
            console.log("Lanterna não suportada no dispositivo.");
            return;
        }
    } catch (error) {
        console.error(`Erro ao inicializar a lanterna: ${error}`);
    }
}

// Função para ligar a lanterna
async function ligarLanterna() {
    if (track) {
        try {
            await track.applyConstraints({ advanced: [{ torch: true }] });
        } catch (error) {
            console.error(`Erro ao ligar a lanterna: ${error}`);
        }
    }
}

// Função para desligar a lanterna
async function desligarLanterna() {
    if (track) {
        try {
            await track.applyConstraints({ advanced: [{ torch: false }] });
        } catch (error) {
            console.error(`Erro ao desligar a lanterna: ${error}`);
        }
    }
}
