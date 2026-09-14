
let idsSeleccionados = []; 
let fechaSeleccionada = "";

// 2. Listener para detectar el cambio de fecha (usando un <input type="date" id="inputfecha">)
// Si usas un calendario personalizado, solo actualiza la variable 'fechaSeleccionada' cuando el usuario elija un día.
const inputFecha = document.getElementById('inputfecha');

if (inputFecha) {
  inputFecha.addEventListener('change', function(event) {
    fechaSeleccionada = event.target.value;
    console.log('Fecha seleccionada:', fechaSeleccionada);

  });
}

function esBotonValido(elemento) {
  return elemento && elemento.classList.contains('opcion');
}

function alternarSintoma(elemento) {
  const id = elemento.id; 

  // Si el ID ya existe en el array, lo borramos (Desmarcar)
  if (idsSeleccionados.includes(id)) {
    idsSeleccionados = idsSeleccionados.filter(item => item !== id);
    elemento.classList.remove('seleccionado'); // Quita estilo visual
    console.log(`ID ${id} removido.`);
  } 
  // Si no existe, lo agregamos (Marcar)
  else {
    idsSeleccionados.push(id);
    elemento.classList.add('seleccionado'); // Añade estilo visual
    console.log(`ID ${id} agregado.`); } 

    console.log('Array actualizado para la fecha:', fechaSeleccionada, idsSeleccionados);
}

document.addEventListener('click', function(event) {
  const elementoPresionado = event.target;
  
  if (esBotonValido(elementoPresionado)) {
    alternarSintoma(elementoPresionado);
  }
});


//function agregarIdAlArray(id) {
//  if (id && !idsSeleccionados.includes(id)) {
//     idsSeleccionados.push(id);
//      console.log('Array actualizado:', idsSeleccionados);
//  } }

// document.addEventListener('click', function(event) {
//  const elementoPresionado = event.target;
//  if (esBotonValido(elementoPresionado)) {
//      agregarIdAlArray(elementoPresionado.id);
//  }
// });
// console.log(agregarIdAlArray)

//fetch('http://api.alan')
//  .then(respuesta => {
//    if (!respuesta.ok) {
//      throw new Error(`Error HTTP: ${respuesta.status}`);
//    }
//    return respuesta.json(); 
//  })
//  .then(datos => console.log(datos))
//  .catch(error => console.error('Error:', error));

