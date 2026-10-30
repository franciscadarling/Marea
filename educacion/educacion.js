const containerMenstruacion = document.getElementById("carrusel-1");
const containerCICLO = document.getElementById("carrusel-2");
const containerHYS = document.getElementById("carrusel-3");
const containerOTROS = document.getElementById("carrusel-4");
function obtenerIdUsuario() {
    const usuarioGuardado = localStorage.getItem("usuarioRegistrado");
    if (!usuarioGuardado) return null;
    try {
        const userObj = JSON.parse(usuarioGuardado);
        return userObj.id || userObj._id || usuarioGuardado;
    } catch (e) {
        return usuarioGuardado;
    }
}

const idUser = obtenerIdUsuario();
function renderizarTarjetas(listaArticulos, articulosLeidos, claseFiltro, contenedor) {
    contenedor.innerHTML = "";
    
    listaArticulos.forEach(articulo => {
        if (articulo.clase === claseFiltro) {
            const estaLeido = articulosLeidos.some(leido => {
                const idLeido = (typeof leido === 'object' && leido !== null) ? (leido.id || leido._id) : leido;
                return String(idLeido) === String(articulo.id);
            });

            const claseLeido = estaLeido ? "leido" : "";
            const articuloConEstado = { ...articulo, leido: estaLeido };

            contenedor.innerHTML += `
                <article class="tarjeta ${claseLeido}">
                  <a class="link-articulo" href="contenedor.html" onclick='localStorage.setItem("articuloActual", JSON.stringify(${JSON.stringify(articuloConEstado)}))'>
                  <h1>${articulo.titulo}</h1>
                  <h2>${articulo.subtitulo}</h2></a>
                </article>
            `;
        }
    });
}

async function inicializarPagina() {
    try {
        if (!idUser) {
            console.warn("No hay un usuario registrado en el localStorage.");
        }
        const resArticulos = await fetch('http://localhost:3000/marea/articulos', { cache: "no-store" });
        const todosLosArticulos = await resArticulos.json();

        let articulosLeidos = [];
        if (idUser) {
            const resLeidos = await fetch(`http://localhost:3000/marea/educacion/${idUser}`, { cache: "no-store" });
            articulosLeidos = await resLeidos.json();
        }

        renderizarTarjetas(todosLosArticulos, articulosLeidos, "menstruacion", containerMenstruacion);
        renderizarTarjetas(todosLosArticulos, articulosLeidos, "ciclo", containerCICLO);
        renderizarTarjetas(todosLosArticulos, articulosLeidos, "hys", containerHYS);
        renderizarTarjetas(todosLosArticulos, articulosLeidos, "otros", containerOTROS);

    } catch (error) {
        console.error('Error al cargar los datos de educación:', error);
    }
}

inicializarPagina();
window.addEventListener("pageshow", (event) => {
    if (event.persisted) inicializarPagina();
});