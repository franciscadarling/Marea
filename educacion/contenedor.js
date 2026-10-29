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
    if (articuloGuardado) {
        try {
            const articulo = JSON.parse(articuloGuardado);
            idArticulo = articulo.id;
            
            // Rellenar la vista del artículo
            document.getElementById("titulo").textContent = articulo.titulo || "";
            document.getElementById("subtitulo").textContent = articulo.subtitulo || "";
            document.getElementById("cuerpo").textContent = articulo.texto || "";

            // Marcar el checkbox si la propiedad 'leido' viene en true
            const checkLeido = document.getElementById("check-leido");
            if (checkLeido && articulo.leido) {
                checkLeido.checked = true;
            }
        } catch (e) {
            console.error("Error al parsear articuloActual", e);
        }
    } else {
        console.warn("No hay 'articuloActual' en el localStorage.");
    }

    // 2. Controlar el evento 'change' del checkbox para actualizar el backend
    const marcarleido = document.getElementById("check-leido");

    if (marcarleido) {
        marcarleido.addEventListener('change', function(event) {
            const leido = event.target.checked; // true o false

            if (!idUser || !idArticulo) {
                console.error("Faltan los datos del usuario o del artículo en localStorage.", { idUser, idArticulo });
                return;
            }

            // Actualizar localmente el objeto en localStorage por si vuelve a la pantalla anterior
            if (articuloGuardado) {
                try {
                    const artObj = JSON.parse(articuloGuardado);
                    artObj.leido = leido;
                    localStorage.setItem("articuloActual", JSON.stringify(artObj));
                } catch (e) {}
            }

            // Petición Fetch al backend
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