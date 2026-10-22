const datosGuardados = localStorage.getItem('usuarioRegistrado');
if (datosGuardados){
    const usuarioObj = JSON.parse(datosGuardados);
    let mail = document.getElementById("mail");
    let contrasena = document.getElementById("contrasena");
    let usuario = document.getElementById("usuario")
    mail.textContent = usuarioObj.mailUser;
    contrasena.textContent = usuarioObj.password;
    usuario.textContent = usuarioObj.nombre;
}
    else {
        console.log("No hay sesión activa o el usuario no está logueado.");
    }

