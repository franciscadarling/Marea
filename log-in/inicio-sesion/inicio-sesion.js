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

async function enviarDatos(respuestas) {
    try {
        const respuesta = await fetch("http://localhost:3000/marea/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(respuestas)
        });

        const resultado = await respuesta.json();
        console.log(resultado);

        if (!respuesta.ok) {
            const mensajeError = resultado.mensaje || resultado.error || "El usuario o la contraseña no coinciden.";
            mostrarEstado(mensajeError);
        } else {
            mostrarEstado("¡Inicio de sesión exitoso!");
            window.location.href = "../../index.html";
        }

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
        localStorage.setItem('usuarioRegistrado', JSON.stringify(respuestas));
        enviarDatos(respuestas);
    } else {
        console.log("Formulario inválido");
    }
});

  
    
  