const CREDENCIALES_KEY = "marea.credenciales";
const RESPUESTAS_KEY = "marea.respuestas";

const formulario = document.getElementById("formulario-signup");
const inputMail = document.getElementById("mail");
const inputContrasena = document.getElementById("contrasena");
const mensajeError = document.getElementById("error-signup");

function mostrarError(mensaje) {
  mensajeError.textContent = mensaje;
  mensajeError.hidden = !mensaje;
}

formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  mostrarError("");

  const mail = inputMail.value.trim();
  const contrasena = inputContrasena.value;

  if (!formulario.checkValidity()) {
    formulario.reportValidity();
    return;
  }

  if (!mail || !contrasena) {
    mostrarError("Completá tu e-mail y tu contraseña.");
    return;
  }

  try {
    // La contraseña queda sólo en sessionStorage hasta completar el formulario.
    sessionStorage.setItem(CREDENCIALES_KEY, JSON.stringify({ mail, contrasena }));
    // Un nuevo registro no debe reutilizar respuestas de un registro anterior.
    sessionStorage.removeItem(RESPUESTAS_KEY);
    window.location.href = "../formulario/formulario.html";
  } catch (error) {
    console.error(error);
    mostrarError("No se pudieron guardar tus datos en este navegador.");
  }
});
