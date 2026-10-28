document.addEventListener('DOMContentLoaded', () => {
    const datosusuario = localStorage.getItem('usuarioRegistrado');
    const datosMenstruacion = localStorage.getItem("miCiclo");
    const mail = document.getElementById("mail");
    const contrasena = document.getElementById("contrasena");
    const usuario = document.getElementById("usuario");
    const fotoPerfil = document.getElementById('fotoPerfil');
    const duracionCiclo = document.getElementById("duracionCiclo");
    const duracionMenstruacion = document.getElementById("duracionMenstruacion");
    const ultimaMenstruacion = document.getElementById('ultimaMestruacion');

    if (!datosusuario) {
        if (mail) mail.textContent = "";
        if (usuario) {
            usuario.innerHTML = '<a href="../log-in/index.html" style="color: inherit; text-decoration: underline;">Inicia sesión para ver tus datos</a>';
        }
        return; 
    }

    const guardado = JSON.parse(datosusuario);
    const guardadoM = JSON.parse(datosMenstruacion);

    if (mail) mail.textContent = guardado.mailUser || "";
    
    if (contrasena) {
        contrasena.textContent = guardado.password;
    }

    if (usuario) usuario.textContent = guardado.nombre || "Usuario";

    if (fotoPerfil && guardado.foto) {
        fotoPerfil.src = guardado.foto;
    }
    if (duracionCiclo) duracionCiclo.textContent = guardadoM.duracion || "";
    
    if (duracionMenstruacion) {
        duracionMenstruacion.textContent = guardadoM.periodo;
    }
    if (ultimaMenstruacion) {
        ultimaMenstruacion.textContent = guardadoM.inicio;
    }


});

/* Acá carga la foto de perfil jiji */
const inputFoto = document.getElementById('inputFoto');
const fotoPerfil = document.getElementById('fotoPerfil');

inputFoto?.addEventListener('change', function(evento) {
    const archivo = evento.target.files[0];
    if (!archivo) return;

    const urlImagen = URL.createObjectURL(archivo);
    if (fotoPerfil) fotoPerfil.src = urlImagen;

    const lector = new FileReader();
    lector.onload = async function(e) {
        const base64String = e.target.result;
        const datosGuardados = localStorage.getItem('usuarioRegistrado');
        if (!datosGuardados) return;

        try {
            const guardado = JSON.parse(datosGuardados);
            const userId = guardado.id;

            if (!userId) return;

            const respuesta = await fetch(`http://localhost:3000/marea/nuevafoto/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ foto: base64String })
            });

            if (respuesta.ok) {
                guardado.foto = base64String;
                localStorage.setItem('usuarioRegistrado', JSON.stringify(guardado));
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
        }
    };
    lector.readAsDataURL(archivo);
});
