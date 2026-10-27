document.addEventListener('DOMContentLoaded', () => {
    const datosGuardados = localStorage.getItem('usuarioRegistrado');
    if (!datosGuardados) {
        const mail = document.getElementById("mail");
        const usuario = document.getElementById("usuario");
        if (mail) mail.textContent = "";
        if (usuario) usuario.innerHTML = '<a href="../log-in/index.html" style="color: inherit; text-decoration: underline;">Inicia sesión para ver tus datos</a>'
        return; 
    }

   
    else {let usuarioObj;
    try {
        const guardado = JSON.parse(datosGuardados);
        usuarioObj = guardado.usuario || guardado.user || guardado.datos || guardado;
    } catch (error) {
        console.error("Error al leer los datos de la sesión:", error);
        return;
    }}

    const mail = document.getElementById("mail");
    const contrasena = document.getElementById("contrasena");
    const usuario = document.getElementById("usuario");
    const fotoPerfilImg = document.getElementById("fotoPerfil");

    if (mail) {
        mail.textContent = usuarioObj.mail || usuarioObj.mailUser || "Sin correo";
    }

    if (contrasena) {
        const clave = usuarioObj.password || usuarioObj.contrasena;
        contrasena.textContent = (clave && !String(clave).startsWith("scrypt:")) ? clave : "********";
    }

    if (usuario) {
        usuario.textContent = usuarioObj.nombre || "Usuario";
    }

    if (fotoPerfilImg && usuarioObj.foto) {
        fotoPerfilImg.src = usuarioObj.foto;
    }
});

const inputFoto = document.getElementById('inputFoto');
const fotoPerfil = document.getElementById('fotoPerfil');

if (inputFoto) {
    inputFoto.addEventListener('change', function(evento) {
        const archivo = evento.target.files[0];
        
        if (archivo) {
            const urlImagen = URL.createObjectURL(archivo);
            if (fotoPerfil) fotoPerfil.src = urlImagen;

            const lector = new FileReader();
            lector.onload = async function(e) {
                const base64String = e.target.result;
                const datosGuardados = localStorage.getItem('usuarioRegistrado');
                if (!datosGuardados) return;

                try {
                    const guardado = JSON.parse(datosGuardados);
                    const usuarioObj = guardado.usuario || guardado.user || guardado.datos || guardado;
                    const userId = usuarioObj.id;

                    if (!userId) return;

                    const respuesta = await fetch(`http://localhost:3000/marea/nuevafoto/${userId}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ foto: base64String })
                    });

                    if (respuesta.ok) {
                        usuarioObj.foto = base64String;
                        localStorage.setItem('usuarioRegistrado', JSON.stringify(guardado));
                    }
                } catch (error) {
                    console.error("Error al conectar con el servidor:", error);
                }
            };
            lector.readAsDataURL(archivo);
        }
    });
}
