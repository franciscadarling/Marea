document.addEventListener("DOMContentLoaded", () => {
    // 1. Obtener de forma segura el usuario y el artículo del localStorage
    const usuarioGuardado = localStorage.getItem("usuarioRegistrado");
    const articuloGuardado = localStorage.getItem("articuloActual");

    let idUser = null;
    if (usuarioGuardado) {
        try {
            const userObj = JSON.parse(usuarioGuardado);
            idUser = userObj.id || userObj._id || usuarioGuardado;
        } catch (e) {
            idUser = usuarioGuardado;
        }
    }

    let idArticulo = null;
    let articuloActualObj = null;

    if (articuloGuardado) {
        try {
            articuloActualObj = JSON.parse(articuloGuardado);
            idArticulo = articuloActualObj.id;
            
            // Rellenar la vista del artículo
            document.getElementById("titulo").textContent = articuloActualObj.titulo || "";
            document.getElementById("subtitulo").textContent = articuloActualObj.subtitulo || "";
            document.getElementById("cuerpo").textContent = articuloActualObj.texto || "";

            // Marcar el checkbox si la propiedad 'leido' es true
            const checkLeido = document.getElementById("check-leido");
            if (checkLeido) {
                checkLeido.checked = !!articuloActualObj.leido;
            }
        } catch (e) {
            console.error("Error al parsear articuloActual", e);
        }
    } else {
        console.warn("No hay 'articuloActual' en el localStorage.");
    }

    // 2. Controlar el evento 'change' del checkbox
    const marcarleido = document.getElementById("check-leido");

    if (marcarleido) {
        marcarleido.addEventListener('change', async function(event) {
            const leido = event.target.checked; // true o false

            if (!idUser || !idArticulo) {
                console.error("Faltan los datos del usuario o del artículo en localStorage.", { idUser, idArticulo });
                return;
            }

            // Actualizar inmediatamente el objeto en localStorage para que sincronice si vuelve atrás
            if (articuloActualObj) {
                articuloActualObj.leido = leido;
                localStorage.setItem("articuloActual", JSON.stringify(articuloActualObj));
            }

            fetch(`http://localhost:3000/marea/leido/${idUser}/${idArticulo}/${leido}`,{
                method: "PUT"
            })
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