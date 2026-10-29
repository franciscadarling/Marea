document.addEventListener("DOMContentLoaded", () => {
    const usuarioGuardado = localStorage.getItem("usuarioRegistrado");
    const articuloGuardado = localStorage.getItem("articuloActual");
    let idUser = null;
    if (usuarioGuardado) {
            const userObj = JSON.parse(usuarioGuardado);
            idUser = userObj.id || usuarioGuardado; 
    }

    let idArticulo = null;
    if (articuloGuardado) {
            const articulo = JSON.parse(articuloGuardado);
            const idArticulo = articulo.id;
            document.getElementById("titulo").textContent = articulo.titulo || "";
            document.getElementById("subtitulo").textContent = articulo.subtitulo || "";
            document.getElementById("cuerpo").textContent = articulo.texto || "";   
    }

    const marcarleido = document.getElementById("check-leido");

    if (marcarleido) {
        marcarleido.addEventListener('change', function(event) {
            const leido = event.target.checked; 
            if (!idUser || !idArticulo) {
                console.error("Faltan los datos del usuario o del artículo en localStorage.");
                return;
            }
            fetch(`http://localhost:3000/marea/leido/${idUser}/${idArticulo}/${leido}`)
                .then(response => response.json())
                .then(data => {
                    console.log('Estado actualizado con éxito:', data);
                })
                .catch(error => {
                    console.error('Error al actualizar el estado de leído:', error);
                });
        });
    }
});
