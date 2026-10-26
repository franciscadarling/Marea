// Función para mostrar el estado en el DOM y consola
function mostrarEstado(mensajex) {
    let mensaje = document.getElementById('mensaje');
    console.log(mensajex);
    
    if (mensajex) {
        mensaje.textContent = mensajex;
        mensaje.removeAttribute('hidden');
    } else {
        mensaje.textContent = "";
        mensaje.setAttribute('hidden', true); 
    }
}

function validarRespuestaActual(respuestas) {
    let mensajex = "";
    let regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!respuestas.mail) {
        mensajex = "Escribí tu mail para continuar.";
    } 
    else if (!regexEmail.test(respuestas.mail)) {
        mensajex = "El mail no es válido";
    }
    else if (!respuestas.password) {
        mensajex = "Elegí una contraseña para continuar.";
    } 

    mostrarEstado(mensajex);
    return mensajex === ""; 
}

function comoBooleano(valor) {
    if (typeof valor === "boolean") return valor;
    if (typeof valor === "number") return valor !== 0;

    if (typeof valor === "string") {
        const texto = valor.trim().toLowerCase();
        if (["si", "sí", "true", "ok", "1", "correcto", "exitoso"].includes(texto)) return true;
        if (["no", "false", "0", "incorrecto", "incorrecta", "error"].includes(texto)) return false;
    }

    return null;
}

// Según el README, /marea/login responde 200 OK con "Sí/No" + paleta + foto.
function loginExitoso(resultado) {
    const directo = comoBooleano(resultado);
    if (directo !== null) return directo;

    if (!resultado || typeof resultado !== "object") return false;

    const claves = [
        "puedeIniciarSesion", "puedeIniciar", "inicioSesion", "login",
        "ok", "exito", "éxito", "success", "autenticado", "logueado",
        "estaLogueado", "valido", "válido", "acceso", "ingreso"
    ];

    for (const clave of claves) {
        if (clave in resultado) {
            const valor = comoBooleano(resultado[clave]);
            if (valor !== null) return valor;
        }
    }

    const mensaje = comoBooleano(resultado.mensaje ?? resultado.message ?? resultado.estado);
    if (mensaje !== null) return mensaje;

    // Si vino la paleta o la foto, el login fue correcto.
    if (resultado.paleta || resultado.foto) return true;

    const usuario = resultado.usuario ?? resultado.user ?? resultado.datos;
    return Boolean(usuario?.id ?? resultado.id ?? usuario);
}

function mensajeDeError(resultado) {
    if (resultado && typeof resultado === "object") {
        return resultado.mensaje || resultado.message || resultado.error ||
            "El usuario o la contraseña no coinciden.";
    }

    return "El usuario o la contraseña no coinciden.";
}

async function enviarDatos(respuestas) {
    try {
        const respuesta = await fetch("http://localhost:3000/marea/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(respuestas)
        });

        // La respuesta puede ser JSON o texto plano ("Sí"/"No").
        const texto = await respuesta.text();
        let resultado;

        try {
            resultado = JSON.parse(texto);
        } catch {
            resultado = texto.trim();
        }

        console.log(resultado);

        if (!respuesta.ok || !loginExitoso(resultado)) {
            mostrarEstado(mensajeDeError(resultado));
            return;
        }

        mostrarEstado("¡Inicio de sesión exitoso!");

        // Puede venir { usuario: {...} }, { user: {...} } o los datos planos.
        let datosLogin = {};
        if (resultado && typeof resultado === "object") {
            const { usuario, user, datos, ...resto } = resultado;
            const perfil = usuario ?? user ?? datos;
            datosLogin = perfil && typeof perfil === "object"
                ? { ...resto, ...perfil }
                : resto;
        }

        let datosPrevios = {};
        try {
            const guardado = JSON.parse(localStorage.getItem('usuarioRegistrado'));
            datosPrevios = guardado?.usuario ?? guardado?.user ?? guardado?.datos ?? guardado ?? {};
        } catch {
            datosPrevios = {};
        }

        // Mezclamos para no perder las respuestas del formulario
        // (duración del ciclo, fechas de menstruación, etc.).
        const usuarioFinal = { ...datosPrevios, ...datosLogin };
        localStorage.setItem('usuarioRegistrado', JSON.stringify(usuarioFinal));

        if (!usuarioFinal.id) {
            console.warn("El login no devolvió un id. El home necesita ese id para pedir /marea/rueda/:id.");
        }

        window.location.href = "../../index.html";

    } catch (error) {
        console.error("Error al conectar con el servidor:", error);
        mostrarEstado("No se pudo conectar con el servidor.");
    }
}

document.getElementById('formulario-signup').addEventListener('submit', function(e) {
    e.preventDefault();

    let inputmail = document.getElementById("mail").value.trim();
    let inputcontrasena = document.getElementById("contrasena").value.trim();
    
    let respuestas = {
        mail: inputmail,            
        password: inputcontrasena 
    };

    let esValido = validarRespuestaActual(respuestas);

    if (esValido === true) {
        mostrarEstado("Validando credenciales...");
        enviarDatos(respuestas);
    } else {
        console.log("Formulario inválido");
    }
});