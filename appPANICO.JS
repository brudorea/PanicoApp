let panicoAtivado = false;
let som = new Audio("sound/alarme.mp3");
let track;

document.addEventListener("DOMContentLoaded", () => {
    const botao = document.getElementById('button');

    if (!botao) {
        console.error("Botão com id 'button' não encontrado no DOM.");
        return;
    }

    botao.addEventListener('mousedown', ativarPanico);
    botao.addEventListener('mouseup', desativarPanico);
    botao.addEventListener('touchstart', ativarPanico);
    botao.addEventListener('touchend', desativarPanico);

    async function inicializarLanterna() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            track = stream.getVideoTracks()[0];
            if (!track.getCapabilities().torch) {
                console.log("Lanterna não suportada no dispositivo.");
                pararStream();
                return;
            }
        } catch (error) {
            console.error(`Erro ao inicializar a lanterna: ${error}`);
        }
    }

    function ativarPanico() {
        if (!panicoAtivado) {
            botao.src = "img/panicon.png";
            som.play();
            panicoAtivado = true;
            ligarLanterna();
        }
    }

    function desativarPanico() {
        if (panicoAtivado) {
            botao.src = "img/botaopanico.jpg";
            som.pause();
            som.currentTime = 0;
            panicoAtivado = false;
            desligarLanterna();
        }
    }

    async function ligarLanterna() {
        if (!track) await inicializarLanterna();
        if (track) {
            try {
                await track.applyConstraints({ advanced: [{ torch: true }] });
            } catch (error) {
                console.error(`Erro ao ligar a lanterna: ${error}`);
            }
        }
    }

    async function desligarLanterna() {
        if (track) {
            try {
                await track.applyConstraints({ advanced: [{ torch: false }] });
            } catch (error) {
                console.error(`Erro ao desligar a lanterna: ${error}`);
            } finally {
                pararStream();
            }
        }
    }

    function pararStream() {
        if (track) {
            track.stop();
            track = null;
        }
    }
});
