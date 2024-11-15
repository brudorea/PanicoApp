let panicoAtivado = false // Variável para controlar o estado do botão de pânico
let som = new Audio("sound/alarme.mp3") // Carrega o áudio do alarme para ser reproduzido
let botao, track // Declaração de variáveis para o botão e controle de vídeo

document.addEventListener('DOMContentLoaded', () => {
    botao = document.getElementById('button') // Seleciona o botão pelo ID 'button'
    
    inicializarLanterna() // Inicializa a lanterna ao carregar a página

    // Evento para mousedown e touchstart
    botao.addEventListener('mousedown', (event) => {
        event.preventDefault() 
        ativarPanico()
    })

    botao.addEventListener('touchstart', (event) => {
        event.preventDefault()
        ativarPanico()
    })

    // Evento para mouseup e touchend
    botao.addEventListener('mouseup', (event) => {
        event.preventDefault()
        desativarPanico()
    })

    botao.addEventListener('touchend', (event) => {
        event.preventDefault()
        desativarPanico()
    })
})

// Função para ativar o pânico
function ativarPanico() {
    if (!panicoAtivado) {
        botao.src = "img/panicon.png" // Altera a imagem do botão para o estado "ativado"
        som.play() // Toca o som do alarme
        ligarLanterna() // Liga a lanterna
        panicoAtivado = true // Define que o modo pânico está ativado
    }
}

// Função para desativar o pânico
function desativarPanico() {
    if (panicoAtivado) {
        botao.src = "img/botaopanico.jpg" // Altera a imagem do botão para o estado "desativado"
        som.pause() // Pausa o som do alarme
        som.currentTime = 0 // Reinicia o áudio para a próxima ativação
        desligarLanterna() // Desliga a lanterna
        panicoAtivado = false // Define que o modo pânico está desativado
    }
}

// Função assíncrona para inicializar a lanterna
async function inicializarLanterna() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        })
        track = stream.getVideoTracks()[0]
        const capabilities = track.getCapabilities()
        if (!capabilities.torch) {
            console.log("Lanterna não suportada no dispositivo.")
        }
    } catch (error) {
        console.error(`Erro ao inicializar a lanterna: ${error}`)
    }
}

// Função assíncrona para ligar a lanterna
async function ligarLanterna() {
    if (track) {
        try {
            await track.applyConstraints({ advanced: [{ torch: true }] })
        } catch (error) {
            console.error(`Erro ao ligar a lanterna: ${error}`)
        }
    }
}

// Função assíncrona para desligar a lanterna
async function desligarLanterna() {
    if (track) {
        try {
            await track.applyConstraints({ advanced: [{ torch: false }] })
        } catch (error) {
            console.error(`Erro ao desligar a lanterna: ${error}`)
        }
    }
}
