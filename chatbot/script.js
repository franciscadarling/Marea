
const formulario = document.getElementById("formMensaje")
const mensajito = document.getElementById("mensaje")
const eliminarH = document.getElementById("eliminar")
const historial = document.getElementById("historial")
const infoUsuario = localStorage.getItem('usuarioRegistrado')
const infoGuardada = JSON.parse(infoUsuario)

function agregarBurbuja(texto) {
    const burbuja = document.createElement("article")
    burbuja.classList.add("bdetexto")
    burbuja.textContent = texto
    historial.appendChild(burbuja)
    historial.scrollTop = historial.scrollHeight 
    return burbuja
}

formulario.addEventListener("submit", (event) => {
    event.preventDefault()

    const texto = mensajito.value
    if (!texto.trim()) return
    mensajito.value = ""
    const burbuja = agregarBurbuja("Dejame pensar...")

    fetch (`http://localhost:3000/marea/mensajeChatbot/${infoGuardada.id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            mensaje: texto
        })
    })
    .then (response => response.json())
    .then (data => {
        console.log(data)
        burbuja.textContent = data.respuesta 
        historial.scrollTop = historial.scrollHeight
    })
})

eliminarH.addEventListener("submit", (event) => {
    fetch (`http://localhost:3000/marea/eliminarChatbot/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            mensaje: texto
        })
    })
    .then (response => response.json())
    .then (data => {
        console.log(data)
        burbuja.textContent = data.respuesta 
        historial.scrollTop = historial.scrollHeight
    })

})