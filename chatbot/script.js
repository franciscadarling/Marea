
const formulario = document.getElementById("formMensaje")
const mensajito = document.getElementById("mensaje")
const burbujaAvatar = document.getElementById("burbujaAvatar")
const eliminarH = document.getElementById("eliminar")
const historial = document.getElementById("historial")
const infoUsuario = localStorage.getItem('usuarioRegistrado')
const infoGuardada = JSON.parse(infoUsuario)
const saludo = "Hola, soy Selene. ¿En qué te puedo ayudar?"


function agregarBurbuja(texto, autor = "selene") {
    const burbuja = document.createElement("article")
    burbuja.classList.add("bdetexto")
    if (autor === "usuario") {
        burbuja.classList.add("bdetexto-usuario")
    }
    burbuja.textContent = texto
    historial.appendChild(burbuja)
    historial.scrollTop = historial.scrollHeight 
}

function mostrarRespuesta(texto) {
    burbujaAvatar.textContent = saludo      
    historial.style.display = "flex"        
    agregarBurbuja(texto)
}

function mostrarHistorial(entradas) {
    if (!Array.isArray(entradas) || entradas.length === 0) return

    const ordenadas = [...entradas].sort((a, b) => (Number(a?.id) || 0) - (Number(b?.id) || 0))

    historial.style.display = "flex"
    ordenadas.forEach(entrada => {
        if (!entrada) return
        if (entrada.mensaje) agregarBurbuja(entrada.mensaje, "usuario")
        if (entrada.respuesta) agregarBurbuja(entrada.respuesta, "selene")
    })
    historial.scrollTop = historial.scrollHeight
}

formulario.addEventListener("submit", (event) => {
    event.preventDefault()

    const texto = mensajito.value
    if (!texto.trim()) return
    mensajito.value = ""
    burbujaAvatar.textContent = "Dejame pensar..."

    fetch (`http://localhost:3000/marea/mensajeChatbot/${infoGuardada.id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            mensaje: texto
        })
    })
    .then(response => 
        response.json())
    .then(data => 
        mostrarRespuesta(data.respuesta))
        .catch(error => {
            console.log(error)
            mostrarRespuesta("Ups, algo salió mal. Probá de nuevo.") 
        })
})

eliminarH.addEventListener("click", (event) => {
    fetch (`http://localhost:3000/marea/eliminarChatbot/${infoGuardada.id}`, {
        method: "DELETE", 
        })
        .then(response => {
            if (!response.ok) throw new Error()
            historial.innerHTML = ""
            historial.style.display = "none"
            burbujaAvatar.textContent = saludo
        })
    })

    function cargarHistorial() {
        if (!infoGuardada?.id) return

        fetch(`http://localhost:3000/marea/chatbot/${infoGuardada.id}`)
            .then(response => response.ok ? response.json() : null)
            .then(data => {
                console.log(data);
                mostrarHistorial(data);
            })
            .catch(error => {
                console.log(error)
                mostrarRespuesta("Ups, algo salió mal. Probá de nuevo.")
            })
    }
    cargarHistorial();