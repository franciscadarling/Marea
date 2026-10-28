
const containerMenstruacion = document.getElementById("carrusel-1")
const containerCICLO = document.getElementById("carrusel-2")
const containerHYS = document.getElementById("carrusel-3")
const containerOTROS = document.getElementById("carrusel-4")

function cargarArticulosMenstruacion (listaArticulos){
    containerMenstruacion.innerHTML = "";
  listaArticulos.forEach(articulo => {
    if (articulo.clase === "menstruacion"){
      containerMenstruacion.innerHTML += `
        <article class="tarjeta">
          <a class="link-articulo" href="contenedor.html" onclick='localStorage.setItem("articuloActual", JSON.stringify(${JSON.stringify(articulo)}))'>
          <h1>${articulo.titulo}</h1>
          <h2>${articulo.subtitulo}</h2></a>
        </article>
      `;
  }
  });
}

function cargarArticulosSPM (listaArticulos){
    containerCICLO.innerHTML = "";
  listaArticulos.forEach(articulo => {
    if (articulo.clase === "ciclo"){
      containerCICLO.innerHTML += `
        <article class="tarjeta">
          <a class="link-articulo" href="contenedor.html" onclick='localStorage.setItem("articuloActual", JSON.stringify(${JSON.stringify(articulo)}))'>
          <h1>${articulo.titulo}</h1>
          <h2>${articulo.subtitulo}</h2></a>
        </article>
      `;
  }
  });
}

function cargarArticulosHYS (listaArticulos){
    containerHYS.innerHTML = "";
  listaArticulos.forEach(articulo => {
    if (articulo.clase === "hys"){
      containerHYS.innerHTML += `
        <article class="tarjeta">
          <a class="link-articulo" href="contenedor.html" onclick='localStorage.setItem("articuloActual", JSON.stringify(${JSON.stringify(articulo)}))'>
          <h1>${articulo.titulo}</h1>
          <h2>${articulo.subtitulo}</h2></a>
        </article>
      `;
  }
  });
}

function cargarArticulosOTROS (listaArticulos){
    containerOTROS.innerHTML = "";
  listaArticulos.forEach(articulo => {
    if (articulo.clase === "otros"){
    containerOTROS.innerHTML += `
      <article class="tarjeta">
        <a class="link-articulo" href="contenedor.html" onclick='localStorage.setItem("articuloActual", JSON.stringify(${JSON.stringify(articulo)}))'>
        <h1>${articulo.titulo}</h1>
        <h2>${articulo.subtitulo}</h2></a>
      </article>
    `;
}});
}

fetch('http://localhost:3000/marea/articulos')          // Ruta al archivo JSON
  .then(response => response.json())  // Convertir la respuesta en JSON
  .then(data => {                     // Aquí tienes acceso al JSON en formato de objeto JS
    const todosLosArticulos = data;   // Ya es un objeto, no hace falta JSON.parse

    // Las funciones se llaman acá adentro, cuando los datos ya llegaron
    cargarArticulosMenstruacion(todosLosArticulos);
    cargarArticulosSPM(todosLosArticulos);
    cargarArticulosHYS(todosLosArticulos);
    cargarArticulosOTROS(todosLosArticulos);
  })
  .catch(error => {                   // Manejo de errores al leer el archivo JSON
    console.error('Error al leer el archivo JSON:', error);
  });