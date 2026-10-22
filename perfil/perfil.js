const datosGuardados = localStorage.getItem('usuarioRegistrado');
if (!datosGuardados){
    let mail = document.getElementById("mail");
    let contrasena = document.getElementById("contrasena");
    let usuario = document.getElementById("usuario")
    mail.innerHTML = datosGuardados.mailUser;
    contrasena.innerHTML = datosGuardados.password;
    usuario.innerHTML = datosGuardados.nombre;
}
