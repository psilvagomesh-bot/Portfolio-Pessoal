/**
 * script.js — Portfólio Pedro Henrique
 * Responsável por: menu mobile, validação de formulário.
 */

/* =============================================
   MENU MOBILE
============================================= */
const menuToggle = document.getElementById('menuToggle');
const mainMenu   = document.getElementById('mainMenu');

if (menuToggle && mainMenu) {
    menuToggle.addEventListener('click', () => {
        const aberto = mainMenu.classList.toggle('aberto');
        menuToggle.classList.toggle('aberto', aberto);
        menuToggle.setAttribute('aria-expanded', String(aberto));
    });

    mainMenu.querySelectorAll('.link').forEach(link => {
        link.addEventListener('click', fecharMenu);
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) fecharMenu();
    });

    document.addEventListener('click', (e) => {
        if (!mainMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            fecharMenu();
        }
    });

    function fecharMenu() {
        mainMenu.classList.remove('aberto');
        menuToggle.classList.remove('aberto');
        menuToggle.setAttribute('aria-expanded', 'false');
    }
}


/* =============================================
   VALIDAÇÃO DO FORMULÁRIO DE CONTATO
============================================= */

const form = document.getElementById("formContato");

if (form) {
    function sanitizar(str) {
        const div = document.createElement("div");
        div.textContent = str;
        return div.innerHTML;
    }

    function validarEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function mostrarErro(campo, msg) {
        const errSpan = campo.parentElement.querySelector(".erro-campo");

        if (errSpan) {
            errSpan.textContent = msg;
        }

        campo.setAttribute("aria-invalid", "true");
        campo.classList.add("campo-invalido");
    }

    function limparErro(campo) {
        const errSpan = campo.parentElement.querySelector(".erro-campo");

        if (errSpan) {
            errSpan.textContent = "";
        }

        campo.removeAttribute("aria-invalid");
        campo.classList.remove("campo-invalido");
    }

    function validarCampo(campo) {
        const valor = campo.value.trim();

        if (campo.id === "Nome") {
            if (!valor) {
                mostrarErro(campo, "O nome é obrigatório.");
                return;
            }

            if (valor.length < 2) {
                mostrarErro(campo, "O nome deve ter ao menos 2 caracteres.");
                return;
            }
        }

        if (campo.id === "Email") {
            if (!valor) {
                mostrarErro(campo, "O e-mail é obrigatório.");
                return;
            }

            if (!validarEmail(valor)) {
                mostrarErro(campo, "Informe um e-mail válido.");
                return;
            }
        }

        if (campo.id === "Mensagem") {
            if (!valor) {
                mostrarErro(campo, "A mensagem é obrigatória.");
                return;
            }

            if (valor.length < 10) {
                mostrarErro(campo, "A mensagem deve ter ao menos 10 caracteres.");
                return;
            }
        }

        limparErro(campo);
    }
    

    // Eventos de validação em tempo real
    form.querySelectorAll(".caixa-nome").forEach((campo) => {
        campo.addEventListener("blur", () => validarCampo(campo));

        campo.addEventListener("input", () => {
            if (campo.classList.contains("campo-invalido")) {
                validarCampo(campo);
            }
        });
    });

    /* =============================================
       CONFIGURAÇÃO EMAILJS
       Nota: emailjs.init() já é chamado no <head> do HTML.
       Não duplicar aqui para evitar comportamento inesperado.
    ============================================= */

    const serviceID  = "service_nsksvho";
    const templateID = "template_pgttfwt";

    /* =============================================
       ENVIO DO FORMULÁRIO
    ============================================= */

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const campos = form.querySelectorAll(".caixa-nome");
        let valido = true;

        campos.forEach((campo) => {
            validarCampo(campo);

            if (campo.classList.contains("campo-invalido")) {
                valido = false;
            }
        });

        if (!valido) {
            return;
        }

        // CORREÇÃO: as chaves devem bater EXATAMENTE com as variáveis
        // definidas no template do EmailJS (ex: {{from_name}}, {{reply_to}}, {{message}}).
        // Se você renomeou as variáveis no template, ajuste as chaves abaixo para o mesmo nome.
        const formData = {
            from_name: sanitizar(document.getElementById("Nome").value.trim()),
            reply_to:  sanitizar(document.getElementById("Email").value.trim()),
            mensagem:  sanitizar(document.getElementById("Mensagem").value.trim()),
        };


        const submitButton = document.getElementById("btn-form");

        submitButton.disabled = true;
        submitButton.textContent = "Enviando...";

        emailjs
            .send(serviceID, templateID, formData)
            .then(() => {
                submitButton.textContent = "✓ Mensagem enviada!";
                submitButton.style.background = 'linear-gradient(45deg, #059669, #10b981)';

                setTimeout(() => {
                    form.reset();

                    campos.forEach((campo) => {
                        limparErro(campo);
                    });

                    submitButton.disabled = false;
                    submitButton.textContent = "Enviar Mensagem";
                    submitButton.style.background = '';
                }, 3000);
            })
            .catch((error) => {
                console.error("Erro ao enviar mensagem:", error);

                alert(
                    "Não foi possível enviar sua mensagem. Tente novamente."
                );

                submitButton.disabled = false;
                submitButton.textContent = "Enviar Mensagem";
            });
    });
}
       
