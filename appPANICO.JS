// Seleciona a imagem que atua como botão
const alertButton = document.getElementById("alertButton") // Obtenha o elemento com id "alertButton" para ser usado como botão de alerta

// Variáveis de apoio
let alertaAtivo = false // Estado do alerta sonoro e LED, inicialmente falso

// Pré-carregamento de áudio
const somAlerta = new Audio("sound/alarme.mp3") // Cria um objeto de áudio com o som do alarme

// Função para ativar o LED, som e trocar a imagem
function ativarAlerta() {
    somAlerta.loop = true // Configura o som para repetir
    somAlerta.play() // Inicia o som do alarme
    alertaAtivo = true // Define o estado do alerta como ativo
    alertButton.src = "img/panicon.png" // Troca a imagem do botão
    ligarLed() // Chama a função para ligar o LED
}

// Função para desativar o LED, som e restaurar a imagem
function desativarAlerta() {
    somAlerta.pause() // Pausa o som do alarme
    somAlerta.currentTime = 0 // Reinicia o som para o início
    alertaAtivo = false // Define o estado do alerta como inativo
    alertButton.src = "img/botaopanico.jpg" // Restaura a imagem original
    desligarLed() // Chama a função para desligar o LED
}

// Ativar alerta e LED ao pressionar a imagem (botão)
alertButton.addEventListener("mousedown", (event) => {
    event.preventDefault() // Evita o comportamento padrão do evento
    if (!alertaAtivo) ativarAlerta() // Ativa o alerta se ele estiver inativo
})

// Desativar alerta e LED ao soltar a imagem
alertButton.addEventListener("mouseup", (event) => {
    event.preventDefault() // Evita o comportamento padrão do evento
    if (alertaAtivo) desativarAlerta() // Desativa o alerta se ele estiver ativo
})

// Eventos para dispositivos touch
alertButton.addEventListener("touchstart", (event) => {
    event.preventDefault()
    if (!alertaAtivo) ativarAlerta()
})

alertButton.addEventListener("touchend", (event) => {
    event.preventDefault()
    if (alertaAtivo) desativarAlerta()
})

// Inicialização do LED
let track // Variável para armazenar a faixa de vídeo

async function inicializarLed() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        })
        track = stream.getVideoTracks()[0]
        const capabilities = track.getCapabilities()
        if (!capabilities.torch) {
            console.log("LED não suportado no dispositivo.")
            return
        }
    } catch (error) {
        console.error(`Erro ao inicializar o LED: ${error}`)
    }
}

// Funções para controlar o LED
async function ligarLed() {
    if (track) {
        try {
            await track.applyConstraints({ advanced: [{ torch: true }] })
        } catch (error) {
            console.error(`Erro ao ligar o LED: ${error}`)
        }
    }
}

async function desligarLed() {
    if (track) {
        try {
            await track.applyConstraints({ advanced: [{ torch: false }] })
        } catch (error) {
            console.error(`Erro ao desligar o LED: ${error}`)
        }
    }
}

// Inicializar o LED ao carregar a página
inicializarLed()
