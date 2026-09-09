
function esBotonValido(elemento) {
  return elemento.classList.contains('opcion');
}

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


