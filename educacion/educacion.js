const articulosmenstruacion = [
    { titulo: "Cuidado Menstrual", subtitulo: "Todo lo que necesitas saber sobre métodos reutilizables." },
    { titulo: "Ciclo Irregular", subtitulo: "Causas comunes y cuándo consultar a un especialista." },
    { titulo: "Cuidado Menstrual", subtitulo: "Todo lo que necesitas saber sobre métodos reutilizables." },
    { titulo: "Ciclo Irregular", subtitulo: "Causas comunes y cuándo consultar a un especialista." }
];

const articulosSPM = [
    { titulo: "Síndrome Premenstrual", subtitulo: "Consejos prácticos para lidiar con los cambios de humor." },
    { titulo: "Alimentación y SPM", subtitulo: "Qué alimentos incorporar y cuáles evitar durante estos días." }
];

const articulosHYS = [
    { titulo: "Higiene y Confort", subtitulo: "Hábitos saludables para el cuidado diario." },
    { titulo: "Mitos y Verdades", subtitulo: "Desmintiendo creencias populares sobre la salud íntima." }
];
/*hay que hacer un fetch que traiga los tres tipos de artículos*/
const containerMenstruacion = document.getElementById("carrusel-1")
function cargarArticulosMenstruacion (listaArticulos = articulosmenstruacion){
    containerMenstruacion.innerHTML = "";
  listaArticulos.forEach(articulo => {
    containerMenstruacion.innerHTML += `
      <article class="tarjeta">
        <a class="link-articulo" href="contenedor.html">
        <h1>${articulo.titulo}</h1>
        <h2>${articulo.subtitulo}</h2></a>
      </article>
    `;
  });
}

const containerSPM = document.getElementById("carrusel-2")
function cargarArticulosSPM (listaArticulos = articulosSPM){
    containerSPM.innerHTML = "";
  listaArticulos.forEach(articulo => {
    containerSPM.innerHTML += `
      <article class="tarjeta">
        <a class="link-articulo" href="contenedor.html">
        <h1>${articulo.titulo}</h1>
        <h2>${articulo.subtitulo}</h2></a>
      </article>
    `;
  });
}
const containerHYS = document.getElementById("carrusel-3")
function cargarArticulosHYS (listaArticulos = articulosHYS){
    containerHYS.innerHTML = "";
  listaArticulos.forEach(articulo => {
    containerHYS.innerHTML += `
      <article class="tarjeta">
        <a class="link-articulo" href="contenedor.html">
        <h1>${articulo.titulo}</h1>
        <h2>${articulo.subtitulo}</h2></a>
      </article>
    `;
  });
}
cargarArticulosMenstruacion();
cargarArticulosSPM();
cargarArticulosHYS();