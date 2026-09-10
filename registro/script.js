
let idsSeleccionados = []; 
let fechaSeleccionada = "";

// 2. Listener para detectar el cambio de fecha (asumiendo que usas un <input type="date" id="input-fecha">)
// Si usas un calendario personalizado, solo actualiza la variable 'fechaSeleccionada' cuando el usuario elija un día.
const inputFecha = document.getElementById('input-fecha');

if (inputFecha) {
  inputFecha.addEventListener('change', function(event) {
    fechaSeleccionada = event.target.value;
    console.log('Fecha seleccionada:', fechaSeleccionada);

  });
}
if (!fechaSeleccionada) {
  alert("Por favor, selecciona primero una fecha en el calendario.");
  return;
}


function esBotonValido(elemento) {
  return elemento.classList.contains('opcion');
}

//tiene que tomar en cuenta la variable de fecha tambien TT

function agregarIdAlArray(id) {
  if (id && !idsSeleccionados.includes(id)) {
      idsSeleccionados.push(id);
      console.log('Array actualizado:', idsSeleccionados);
  }
}

document.addEventListener('click', function(event) {
  const elementoPresionado = event.target;
  if (esBotonValido(elementoPresionado)) {
      agregarIdAlArray(elementoPresionado.id);
  }
});

console.log(agregarIdAlArray)
