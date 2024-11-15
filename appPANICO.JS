let panicoAtivado = false // Variável para controlar o estado do botão de pânico
let som = new Audio("sound/alarme.mp3") // Carrega o áudio do alarme para ser reproduzido

const botao = document.getElementById('button') // Seleciona o botão pelo ID 'button'

// Função para ativar o pânico
function ativarPanico() { // Define a função que ativa o modo pânico
    if (!panicoAtivado) { // Verifica se o modo pânico não está ativado
        botao.src = "img/panicon.png" // Altera a imagem do botão para o estado "ativado"
        som.play() // Toca o som do alarme
        panicoAtivado = true // Define que o modo pânico está ativado
    }
}

// Função para desativar o pânico
function desativarPanico() { // Define a função que desativa o modo pânico
    if (panicoAtivado) { // Verifica se o modo pânico está ativado
        botao.src = "img/botaopanico.jpg" // Altera a imagem do botão para o estado "desativado"
        som.pause() // Pausa o som do alarme
        som.currentTime = 0 // Reinicia o áudio do começo para a próxima ativação
        panicoAtivado = false // Define que o modo pânico está desativado
    }
}

// Evento para mousedown e touchstart
botao.addEventListener('mousedown', (event) => { // Adiciona um evento para quando o botão é pressionado com o mouse
    event.preventDefault() // Impede o comportamento padrão do evento
    ativarPanico() // Chama a função de ativar o pânico
})

botao.addEventListener('touchstart', (event) => { // Adiciona um evento para quando o botão é pressionado com toque na tela
    event.preventDefault() // Impede o comportamento padrão do evento
    ativarPanico() // Chama a função de ativar o pânico
})

// Evento para mouseup e touchend
botao.addEventListener('mouseup', (event) => { // Adiciona um evento para quando o botão é solto após ser pressionado com o mouse
    event.preventDefault() // Impede o comportamento padrão do evento
    desativarPanico() // Chama a função de desativar o pânico
})

botao.addEventListener('touchend', (event) => { // Adiciona um evento para quando o botão é solto após ser pressionado com toque na tela
    event.preventDefault() // Impede o comportamento padrão do evento
    desativarPanico() // Chama a função de desativar o pânico
})

// Lanterna (torch)
let track // Declara a variável track para armazenar o controle de vídeo

async function inicializarLanterna() { // Define uma função assíncrona para inicializar a lanterna
    try { // Inicia um bloco try-catch para tratar erros
        const stream = await navigator.mediaDevices.getUserMedia({ // Solicita acesso à câmera traseira sem exibir o vídeo
            video: { facingMode: "environment" } // Define a câmera como a traseira
        })
        
        track = stream.getVideoTracks()[0] // Obtém a primeira track de vídeo do stream

        const capabilities = track.getCapabilities() // Verifica as capacidades do dispositivo de vídeo
        if (!capabilities.torch) { // Verifica se a lanterna (torch) é suportada pelo dispositivo
            console.log("Lanterna não suportada no dispositivo.") // Exibe uma mensagem se a lanterna não for suportada
            return // Sai da função se a lanterna não for suportada
        }
    } catch (error) { // Captura possíveis erros ao acessar a câmera
        console.error(`Erro ao inicializar a lanterna: ${error}`) // Exibe uma mensagem de erro
    }
}

// Função para ligar a lanterna
async function ligarLanterna() { // Define uma função assíncrona para ligar a lanterna
    if (track) { // Verifica se a track de vídeo está ativa
        try { // Inicia um bloco try-catch para tratar erros
            await track.applyConstraints({ advanced: [{ torch: true }] }) // Aplica a restrição de ativar a lanterna
        } catch (error) { // Captura possíveis erros ao ligar a lanterna
            console.error(`Erro ao ligar a lanterna: ${error}`) // Exibe uma mensagem de erro
        }
    }
}

// Função para desligar a lanterna
async function desligarLanterna() { // Define uma função assíncrona para desligar a lanterna
    if (track) { // Verifica se a track de vídeo está ativa
        try { // Inicia um bloco try-catch para tratar erros
            await track.applyConstraints({ advanced: [{ torch: false }] }) // Aplica a restrição de desativar a lanterna
        } catch (error) { // Captura possíveis erros ao desligar a lanterna
            console.error(`Erro ao desligar a lanterna: ${error}`) // Exibe uma mensagem de erro
        }
    }
}
