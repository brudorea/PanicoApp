let panicoAtivado = false // Variável para controlar o estado do botão de pânico
let som = new Audio("sound/alarme.mp3") // Carrega o áudio do alarme para ser reproduzido

const botao = document.getElementById('button') // Seleciona o botão pelo ID 'button'

let track // Declara a variável track para armazenar o controle de vídeo

async function inicializarLanterna() { // Inicializa a lanterna
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" } // Solicita a câmera traseira
        })
        
        track = stream.getVideoTracks()[0] // Obtém a track de vídeo
        const capabilities = track.getCapabilities() // Verifica as capacidades do dispositivo
        
        if (!capabilities.torch) { // Se a lanterna não for suportada
            console.log("Lanterna não suportada no dispositivo.")
            return
        }
    } catch (error) {
        console.error(`Erro ao inicializar a lanterna: ${error}`)
    }
}

async function ligarLanterna() { // Liga a lanterna
    if (track) {
        try {
            await track.applyConstraints({ advanced: [{ torch: true }] })
        } catch (error) {
            console.error(`Erro ao ligar a lanterna: ${error}`)
        }
    }
}

async function desligarLanterna() { // Desliga a lanterna
    if (track) {
        try {
            await track.applyConstraints({ advanced: [{ torch: false }] })
        } catch (error) {
            console.error(`Erro ao desligar a lanterna: ${error}`)
        }
    }
}

function ativarPanico() {
    if (!panicoAtivado) {
        botao.src = "img/panicon.png" // Muda a imagem para o estado "ativado"
        som.play() // Toca o alarme
        panicoAtivado = true // Marca o pânico como ativado
        ligarLanterna() // Liga a lanterna se for um dispositivo com suporte
    }
}

function desativarPanico() {
    if (panicoAtivado) {
        botao.src = "img/botaopanico.jpg" // Muda a imagem para o estado "desativado"
        som.pause() // Pausa o alarme
        som.currentTime = 0 // Reinicia o áudio
        panicoAtivado = false // Marca o pânico como desativado
        desligarLanterna() // Desliga a lanterna se for um dispositivo com suporte
    }
}

botao.addEventListener('mousedown', (event) => {
    event.preventDefault()
    ativarPanico() // Ativa o pânico ao pressionar o botão
})

botao.addEventListener('touchstart', (event) => {
    event.preventDefault()
    ativarPanico() // Ativa o pânico ao tocar na tela
})

botao.addEventListener('mouseup', (event) => {
    event.preventDefault()
    desativarPanico() // Desativa o pânico ao soltar o botão
})

botao.addEventListener('touchend', (event) => {
    event.preventDefault()
    desativarPanico() // Desativa o pânico ao soltar o toque
})

inicializarLanterna() // Inicializa a lanterna quando a página carrega
