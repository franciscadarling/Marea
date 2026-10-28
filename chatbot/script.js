
const formulario = document.getElementById("formMensaje")
const mensajito = document.getElementById("mensaje")
const boton = document.getElementById("Enviar")
const infoUsuario = localStorage.getItem('usuarioRegistrado')
const infoGuardada = JSON.parse(infoUsuario)
formulario.addEventListener("submit", (event) => {
    event.preventDefault()

    fetch (`http://localhost:3000/marea/mensajeChatbot/${infoGuardada.id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            mensaje: mensajito.value
        })
    })
    .then (response => response.json())
    .then (data => {
        console.log(data)
    })
})