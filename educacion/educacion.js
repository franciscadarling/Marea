const containerMenstruacion = document.getElementById("carrusel-1");
const containerCICLO = document.getElementById("carrusel-2");
const containerHYS = document.getElementById("carrusel-3");
const containerOTROS = document.getElementById("carrusel-4");

// Obtener de forma segura el usuario desde localStorage
const usuarioGuardado = localStorage.getItem("usuarioRegistrado");
let idUser = null;
if (usuarioGuardado) {
    try {
        const userObj = JSON.parse(usuarioGuardado);
        idUser = userObj.id || usuarioGuardado;
    } catch (e) {
        idUser = usuarioGuardado;
    }
}

// Funciones de renderizado que reciben la lista de artículos y los leídos
function cargarArticulosMenstruacion(listaArticulos, articulosLeidos) {
    containerMenstruacion.innerHTML = "";
    listaArticulos.forEach(articulo => {
        if (articulo.clase === "menstruacion") {
            const estaLeido = articulosLeidos.some(leido => leido.id === articulo.id || leido === articulo.id);
            const claseLeido = estaLeido ? "leido" : "";

            containerMenstruacion.innerHTML += `
                <article class="tarjeta ${claseLeido}">
                  <a class="link-articulo" href="contenedor.html" onclick='localStorage.setItem("articuloActual", JSON.stringify(${JSON.stringify(articulo)}))'>
                  <h1>${articulo.titulo}</h1>
                  <h2>${articulo.subtitulo}</h2></a>
                </article>
            `;
        }
    });
}

function cargarArticulosSPM(listaArticulos, articulosLeidos) {
    containerCICLO.innerHTML = "";
    listaArticulos.forEach(articulo => {
        if (articulo.clase === "ciclo") {
            const estaLeido = articulosLeidos.some(leido => leido.id === articulo.id || leido === articulo.id);
            const claseLeido = estaLeido ? "leido" : "";

            containerCICLO.innerHTML += `
                <article class="tarjeta ${claseLeido}">
                  <a class="link-articulo" href="contenedor.html" onclick='localStorage.setItem("articuloActual", JSON.stringify(${JSON.stringify(articulo)}))'>
                  <h1>${articulo.titulo}</h1>
                  <h2>${articulo.subtitulo}</h2></a>
                </article>
            `;
        }
    });
}

function cargarArticulosHYS(listaArticulos, articulosLeidos) {
    containerHYS.innerHTML = "";
    listaArticulos.forEach(articulo => {
        if (articulo.clase === "hys") {
            const estaLeido = articulosLeidos.some(leido => leido.id === articulo.id || leido === articulo.id);
            const claseLeido = estaLeido ? "leido" : "";

            containerHYS.innerHTML += `
                <article class="tarjeta ${claseLeido}">
                  <a class="link-articulo" href="contenedor.html" onclick='localStorage.setItem("articuloActual", JSON.stringify(${JSON.stringify(articulo)}))'>
                  <h1>${articulo.titulo}</h1>
                  <h2>${articulo.subtitulo}</h2></a>
                </article>
            `;
        }
    });
}

function cargarArticulosOTROS(listaArticulos, articulosLeidos) {
    containerOTROS.innerHTML = "";
    listaArticulos.forEach(articulo => {
        if (articulo.clase === "otros") {
            const estaLeido = articulosLeidos.some(leido => leido.id === articulo.id || leido === articulo.id);
            const claseLeido = estaLeido ? "leido" : "";

            containerOTROS.innerHTML += `
                <article class="tarjeta ${claseLeido}">
                  <a class="link-articulo" href="contenedor.html" onclick='localStorage.setItem("articuloActual", JSON.stringify(${JSON.stringify(articulo)}))'>
                  <h1>${articulo.titulo}</h1>
                  <h2>${articulo.subtitulo}</h2></a>
                </article>
            `;
        }
    });
}

// Función principal asíncrona para obtener los datos en SECUENCIA (uno tras otro)
async function inicializarPagina() {
    try {
        // 1. Primer fetch: Traer todos los artículos
        const resArticulos = await fetch('http://localhost:3000/marea/articulos');
        const todosLosArticulos = await resArticulos.json();

        // 2. Segundo fetch: Traer los artículos leídos del usuario
        const resLeidos = await fetch(`http://localhost:3000/marea/educacion/${idUser}`);
        const articulosLeidos = await resLeidos.json();

        // 3. Renderizar cada sección pasándole ambas listas
        cargarArticulosMenstruacion(todosLosArticulos, articulosLeidos);
        cargarArticulosSPM(todosLosArticulos, articulosLeidos);
        cargarArticulosHYS(todosLosArticulos, articulosLeidos);
        cargarArticulosOTROS(todosLosArticulos, articulosLeidos);

    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
}

// Ejecutamos la función
inicializarPagina();