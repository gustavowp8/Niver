
document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       1. CONTAGEM REGRESSIVA
    ===================================== */

    const dataFesta = new Date(
        2026, 10, 22, 11, 0, 0
    ).getTime();

    const dias = document.getElementById("days");
    const horas = document.getElementById("hours");
    const minutos = document.getElementById("minutes");
    const segundos = document.getElementById("seconds");

    function atualizarContagem() {

        const agora = new Date().getTime();
        const distancia = dataFesta - agora;

        if (distancia <= 0) {
            dias.textContent = "00";
            horas.textContent = "00";
            minutos.textContent = "00";
            segundos.textContent = "00";
            return;
        }

        const quantidadeDias = Math.floor(
            distancia / (1000 * 60 * 60 * 24)
        );

        const quantidadeHoras = Math.floor(
            (distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );

        const quantidadeMinutos = Math.floor(
            (distancia % (1000 * 60 * 60)) / (1000 * 60)
        );

        const quantidadeSegundos = Math.floor(
            (distancia % (1000 * 60)) / 1000
        );

        dias.textContent = String(quantidadeDias).padStart(2, "0");
        horas.textContent = String(quantidadeHoras).padStart(2, "0");
        minutos.textContent = String(quantidadeMinutos).padStart(2, "0");
        segundos.textContent = String(quantidadeSegundos).padStart(2, "0");
    }

    atualizarContagem();
    setInterval(atualizarContagem, 1000);


    /* =====================================
       2. ELEMENTOS DO MODAL
    ===================================== */

    const modalPresenca = document.getElementById("modalPresenca");

    const btnConfirmarPresenca = document.getElementById("btnConfirmarPresenca");
    const btnFecharModal = document.getElementById("btnFecharModal");

    const formPresenca = document.getElementById("formPresenca");

    const mensagemConfirmacao = document.getElementById("mensagemConfirmacao");
    const textoConfirmacao = document.getElementById("textoConfirmacao");

    const nomeConvidadoInput = document.getElementById("nomeConvidado");
    const nomeAcompanhanteInput = document.getElementById("nomeAcompanhante");

    const presenteConfirmadoInput = document.getElementById("presenteConfirmado");

    const btnEnviar = document.getElementById("btnEnviar");
    const btnSemPresente = document.getElementById("btnSemPresente");
    const btnFinalizar = document.getElementById("btnFinalizar");

    const statusPresenca = document.getElementById("status");

    const giftSection = document.querySelector(".gift-section");
    const modalHeader = document.querySelector(".modal-header");

    const giftOptions = document.querySelectorAll(".gift-option");


    /* =====================================
       3. VARIÁVEIS
    ===================================== */

    let presenteSelecionado = null;
    let modalAberto = false;


    /* =====================================
       4. ABRIR MODAL
    ===================================== */

    function abrirModal() {

        modalPresenca.classList.add("active");

        modalPresenca.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";

        modalAberto = true;
    }

    btnConfirmarPresenca.addEventListener("click", abrirModal);


    /* =====================================
       5. FECHAR MODAL
    ===================================== */

    function fecharModal() {

        modalPresenca.classList.remove("active");

        modalPresenca.setAttribute("aria-hidden", "true");

        document.body.style.overflow = "";

        modalAberto = false;
    }

    btnFecharModal.addEventListener("click", fecharModal);


    /* =====================================
       6. FECHAR CLICANDO FORA
    ===================================== */

    modalPresenca.addEventListener("click", function (event) {

        if (event.target === modalPresenca) {
            fecharModal();
        }

    });


    /* =====================================
       7. FECHAR COM ESC
    ===================================== */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape" && modalAberto) {
            fecharModal();
        }

    });


    /* =====================================
       8. SELECIONAR PRESENTE
    ===================================== */

    giftOptions.forEach(function (opcao) {

        opcao.addEventListener("click", function () {

            // Limpar seleção anterior

            giftOptions.forEach(function (item) {
                item.classList.remove("selected");
            });

            // Selecionar presente

            opcao.classList.add("selected");

            presenteSelecionado = opcao.dataset.gift;

            // Atualizar campo

            presenteConfirmadoInput.value = presenteSelecionado;

        });

    });


    /* =====================================
       9. MOSTRAR CONFIRMAÇÃO
    ===================================== */

    function mostrarConfirmacao(nome, presente) {

        formPresenca.hidden = true;
        giftSection.hidden = true;
        modalHeader.hidden = true;

        mensagemConfirmacao.hidden = false;

        const primeiroNome = nome.split(" ")[0];

        if (presente) {

            textoConfirmacao.textContent =
                "Obrigada, " +
                primeiroNome +
                "! Sua escolha de presente foi " +
                presente +
                ". Estou muito feliz em celebrar esse momento com você!";

        } else {

            textoConfirmacao.textContent =
                "Obrigada, " +
                primeiroNome +
                "! Sua presença será o meu maior presente. Estou muito feliz em celebrar esse momento com você!";

        }

    }


    /* =====================================
       10. CONFIGURAÇÃO DO TELEGRAM
    ===================================== */

    const TELEGRAM_TOKEN = "8259378498:AAF1rXYr1TQngistGhS4nKBHCk_27IhYgF8";
    const TELEGRAM_CHAT_ID = "-1003857825945";


    /* =====================================
       11. ENVIAR CONFIRMAÇÃO AO TELEGRAM
    ===================================== */

    async function enviarConfirmacao(presenteEscolhido = null) {

        const nome = nomeConvidadoInput.value.trim();

        const acompanhante = nomeAcompanhanteInput.value.trim();

        // Validar nome

        if (!nome) {

            statusPresenca.textContent =
                "Por favor, informe seu nome.";

            nomeConvidadoInput.focus();

            return;
        }

        // Validar configuração do Telegram

        if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {

            statusPresenca.textContent =
                "Configuração do Telegram não encontrada.";

            return;
        }

        const presente = presenteEscolhido || "Não selecionado";

        const mensagem = `
🎉 *CONFIRMAÇÃO DE PRESENÇA*

👑 *Evento:* 15 anos da Sophia

👤 *Convidado:* ${nome}
👥 *Acompanhante:* ${acompanhante || "Sem acompanhante"}
🎁 *Presente:* ${presente}

📅 *Data:* 22/11/2026
⏰ *Horário:* A partir das 11h
`;

        btnEnviar.disabled = true;
        btnSemPresente.disabled = true;

        statusPresenca.textContent = "Enviando confirmação...";

        try {

            const resposta = await fetch(
                `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        chat_id: TELEGRAM_CHAT_ID,
                        text: mensagem,
                        parse_mode: "Markdown"
                    })
                }
            );

            const resultado = await resposta.json();

            if (!resposta.ok || !resultado.ok) {
                throw new Error("Não foi possível enviar a confirmação.");
            }

            statusPresenca.textContent = "";

            mostrarConfirmacao(nome, presente);

        } catch (erro) {

            console.error("Erro Telegram:", erro);

            statusPresenca.textContent =
                "Não foi possível enviar. Tente novamente.";

            btnEnviar.disabled = false;
            btnSemPresente.disabled = false;

        }

    }


    /* =====================================
       12. CONFIRMAR COM PRESENTE
    ===================================== */

    formPresenca.addEventListener("submit", async function (event) {

        event.preventDefault();

        await enviarConfirmacao(presenteSelecionado);

    });


    /* =====================================
       13. CONFIRMAR SEM PRESENTE
    ===================================== */

    btnSemPresente.addEventListener("click", async function () {

        presenteSelecionado = null;

        presenteConfirmadoInput.value = "";

        // Desmarcar presentes

        giftOptions.forEach(function (item) {
            item.classList.remove("selected");
        });

        await enviarConfirmacao(null);

    });


    /* =====================================
       14. FINALIZAR
    ===================================== */

    btnFinalizar.addEventListener("click", function () {

        fecharModal();

        // Restaurar formulário

        formPresenca.hidden = false;
        giftSection.hidden = false;
        modalHeader.hidden = false;

        mensagemConfirmacao.hidden = true;

        // Limpar campos

        formPresenca.reset();

        presenteSelecionado = null;

        statusPresenca.textContent = "";

        // Restaurar botões

        btnEnviar.disabled = false;
        btnSemPresente.disabled = false;

        // Limpar seleção visual

        giftOptions.forEach(function (item) {
            item.classList.remove("selected");
        });

    });

});
