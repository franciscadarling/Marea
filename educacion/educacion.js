const containerMenstruacion = document.getElementById("carrusel-1");
const containerCICLO = document.getElementById("carrusel-2");
const containerHYS = document.getElementById("carrusel-3");
const containerOTROS = document.getElementById("carrusel-4");

// Obtener de forma segura el id del usuario desde localStorage
function obtenerIdUsuario() {
    const usuarioGuardado = localStorage.getItem("usuarioRegistrado");
    if (!usuarioGuardado) return null;
    try {
        const userObj = JSON.parse(usuarioGuardado);
        return userObj.id || userObj._id || usuarioGuardado;
    } catch (e) {
        return usuarioGuardado; // Por si se guardó como texto plano
    }
}

const idUser = obtenerIdUsuario();

// Funciones de renderizado
function cargarArticulosMenstruacion(listaArticulos, articulosLeidos) {
    containerMenstruacion.innerHTML = "";
    listaArticulos.forEach(articulo => {
        if (articulo.clase === "menstruacion") {
            const estaLeido = articulosLeidos.some(leido => leido.id === articulo.id || leido === articulo.id);
            const claseLeido = estaLeido ? "leido" : "";
            const articuloConEstado = { ...articulo, leido: estaLeido };

            containerMenstruacion.innerHTML += `
                <article class="tarjeta ${claseLeido}">
                  <a class="link-articulo" href="contenedor.html" onclick='localStorage.setItem("articuloActual", JSON.stringify(${JSON.stringify(articuloConEstado)}))'>
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
            const articuloConEstado = { ...articulo, leido: estaLeido };

            containerCICLO.innerHTML += `
                <article class="tarjeta ${claseLeido}">
                  <a class="link-articulo" href="contenedor.html" onclick='localStorage.setItem("articuloActual", JSON.stringify(${JSON.stringify(articuloConEstado)}))'>
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
            const articuloConEstado = { ...articulo, leido: estaLeido };

            containerHYS.innerHTML += `
                <article class="tarjeta ${claseLeido}">
                  <a class="link-articulo" href="contenedor.html" onclick='localStorage.setItem("articuloActual", JSON.stringify(${JSON.stringify(articuloConEstado)}))'>
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
            const articuloConEstado = { ...articulo, leido: estaLeido };

            containerOTROS.innerHTML += `
                <article class="tarjeta ${claseLeido}">
                  <a class="link-articulo" href="contenedor.html" onclick='localStorage.setItem("articuloActual", JSON.stringify(${JSON.stringify(articuloConEstado)}))'>
                  <h1>${articulo.titulo}</h1>
                  <h2>${articulo.subtitulo}</h2></a>
                </article>
            `;
        }
    });
}

// Función principal asíncrona en SECUENCIA (uno tras otro con await)
async function inicializarPagina() {
    try {
        if (!idUser) {
            console.warn("No hay un usuario registrado en el localStorage.");
        }

        // 1. Primer fetch: Traer todos los artículos
        const resArticulos = await fetch('http://localhost:3000/marea/articulos');
        const todosLosArticulos = await resArticulos.json();

        // 2. Segundo fetch: Traer los artículos leídos (si hay usuario)
        let articulosLeidos = [];
        if (idUser) {
            const resLeidos = await fetch(`http://localhost:3000/marea/educacion/${idUser}`);
            articulosLeidos = await resLeidos.json();
        }

        // 3. Renderizar cada sección
        cargarArticulosMenstruacion(todosLosArticulos, articulosLeidos);
        cargarArticulosSPM(todosLosArticulos, articulosLeidos);
        cargarArticulosHYS(todosLosArticulos, articulosLeidos);
        cargarArticulosOTROS(todosLosArticulos, articulosLeidos);

    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
}

inicializarPagina();