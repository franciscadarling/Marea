
// Ejecutas la función al cargar el script
tocarBotondeOpcion();

const seleccionadas = []; // acá se van guardando los valores

function tocarBotondeOpcion() {
  const opciones = document.querySelectorAll('.opcion');

  opciones.forEach(opcion => {
    opcion.addEventListener('click', () => {
        const valor = opcion.id; 
        seleccionadas.push(valor);
      console.log(seleccionadas); // para que veas que se va llenando
    });
  });
}

tocarBotondeOpcion();