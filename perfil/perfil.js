document.addEventListener('DOMContentLoaded', () => {
    const datosGuardados = localStorage.getItem('usuarioRegistrado');

    if (!datosGuardados) {
        console.log("No hay sesión activa o el usuario no está logueado.");
        return;
    }

    let usuarioObj;
    try {
        const guardado = JSON.parse(datosGuardados);
        // El login puede guardar { usuario: {...} }, { user: {...} } o los datos planos.
        usuarioObj = guardado?.usuario ?? guardado?.user ?? guardado?.datos ?? guardado;
    } catch (error) {
        console.error("No se pudieron leer los datos de la sesión:", error);
        return;
    }

    const mail = document.getElementById("mail");
    const contrasena = document.getElementById("contrasena");
    const usuario = document.getElementById("usuario");

    if (mail) {
        mail.textContent = usuarioObj.mail ?? usuarioObj.mailUser ?? "Sin correo";
    }

    if (contrasena) {
        const clave = usuarioObj.password ?? usuarioObj.contrasena;
        // Si el backend devuelve el hash, no lo mostramos.
        contrasena.textContent = clave && !String(clave).startsWith("scrypt:")
            ? clave
            : "********";
    }

    if (usuario) {
        usuario.textContent = usuarioObj.nombre ?? "Usuario";
    }
});
