fetch('http://localhost:3000/marea/articulos')          // Ruta al archivo JSON
  .then(response => response.json())  // Convertir la respuesta en JSON
  .then(data => {                     // Aquí tienes acceso al JSON en formato de objeto J   
    articulos = data;                   // Asignar el JSON a la variable comidas
  })
  .catch(error => {                   // Manejo de errores al leer el archivo JSON
    console.error('Error al leer el archivo JSON:', error);
  });


const containerMenstruacion = document.getElementById("carrusel-1")
const todosLosArticulos = JSON.parse(articulos);

function cargarArticulosMenstruacion (listaArticulos){
    containerMenstruacion.innerHTML = "";
  listaArticulos.forEach(articulo => {
    if (articulo.clase = "menstruacion"){
      containerHYS.innerHTML += `
        <article class="tarjeta">
          <a class="link-articulo" href="contenedor.html">
          <h1>${articulo.titulo}</h1>
          <h2>${articulo.subtitulo}</h2></a>
        </article>
      `;
  }
  });
}

const containerCICLO = document.getElementById("carrusel-2")
function cargarArticulosSPM (listaArticulos){
    containerSPM.innerHTML = "";
  listaArticulos.forEach(articulo => {
    if (articulo.clase = "ciclo"){
      containerHYS.innerHTML += `
        <article class="tarjeta">
          <a class="link-articulo" href="contenedor.html">
          <h1>${articulo.titulo}</h1>
          <h2>${articulo.subtitulo}</h2></a>
        </article>
      `;
  }
  });
}
const containerHYS = document.getElementById("carrusel-3")
function cargarArticulosHYS (listaArticulos){
    containerHYS.innerHTML = "";
  listaArticulos.forEach(articulo => {
    if (articulo.clase = "hys"){
      containerHYS.innerHTML += `
        <article class="tarjeta">
          <a class="link-articulo" href="contenedor.html">
          <h1>${articulo.titulo}</h1>
          <h2>${articulo.subtitulo}</h2></a>
        </article>
      `;
  }
  });
}

const containerOTROS = document.getElementById("carrusel-4")
function cargarArticulosOTROS (listaArticulos){
    containerOTROS.innerHTML = "";
  listaArticulos.forEach(articulo => {
    if (articulo.clase = "otros"){
    containerHYS.innerHTML += `
      <article class="tarjeta">
        <a class="link-articulo" href="contenedor.html">
        <h1>${articulo.titulo}</h1>
        <h2>${articulo.subtitulo}</h2></a>
      </article>
    `;
}});
}
cargarArticulosMenstruacion(todosLosArticulos);
cargarArticulosSPM(todosLosArticulos);
cargarArticulosHYS(todosLosArticulos);
cargarArticulosOTROS(todosLosArticulos);