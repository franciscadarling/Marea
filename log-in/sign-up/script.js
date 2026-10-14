let formulario = document.getElementById("formulario-signup");
let inputMail = document.getElementById("mail");
let inputContrasena = document.getElementById("contrasena");
let mensajeError = document.getElementById("error");

function mostrarError(mensaje) {
  mensajeError.textContent = mensaje;
  mensajeError.hidden = !mensaje;
}

formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  mostrarError("");

  let nuevomail = inputMail.value;
  let nuevacontrasena = inputContrasena.value;

  if (!formulario.checkValidity()) {
    formulario.reportValidity();
    return;
  }

  if (!nuevomail || !nuevacontrasena) /*esto lo googlié y chequea que la variable exista digamos */ {
    mostrarError("Completá tu e-mail y tu contraseña.");
    return;
  }
  localStorage.setItem('Email', nuevomail);
  localStorage.setItem('Contrasena', nuevacontrasena);
  window.location.href = "../formulario/formulario.html";
})
