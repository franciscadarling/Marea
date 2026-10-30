const API = "http://localhost:3000/marea";

const contenedores = {
    menstruacion: document.getElementById("carrusel-1"),
    ciclo: document.getElementById("carrusel-2"),
    hys: document.getElementById("carrusel-3"),
    otros: document.getElementById("carrusel-4")
};

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

function leerPendientes() {
    try {
        return JSON.parse(localStorage.getItem("leidoPendiente")) || {};
    } catch (e) {
        return {};
    }
}

function idDe(item) {
    return (typeof item === "object" && item !== null) ? (item.id ?? item._id) : item;
}

function renderizarTarjetas(listaArticulos, idsLeidos, pendientes, claseFiltro, contenedor) {
    contenedor.innerHTML = "";

    listaArticulos.forEach(articulo => {
        if (articulo.clase !== claseFiltro) return;

        const id = String(articulo.id);

        // un cambio pendiente (todavía no confirmado) manda sobre el servidor
        const estaLeido = (id in pendientes) ? pendientes[id] : idsLeidos.has(id);

        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta" + (estaLeido ? " leido" : "");

        const link = document.createElement("a");
        link.className = "link-articulo";
        link.href = "contenedor.html";

        const h1 = document.createElement("h1");
        h1.textContent = articulo.titulo;

        const h2 = document.createElement("h2");
        h2.textContent = articulo.subtitulo;

        link.append(h1, h2);

        link.addEventListener("click", () => {
            localStorage.setItem(
                "articuloActual",
                JSON.stringify({ ...articulo, leido: estaLeido })
            );
        });

        tarjeta.appendChild(link);
        contenedor.appendChild(tarjeta);
    });
}

let numeroDeCarga = 0;

async function inicializarPagina() {
    const miCarga = ++numeroDeCarga; // para ignorar respuestas viejas si hay cargas superpuestas

    try {
        const idUser = obtenerIdUsuario();
        if (!idUser) {
            console.warn("No hay un usuario registrado en el localStorage.");
        }

        const resArticulos = await fetch(`${API}/articulos`, { cache: "no-store" });
        if (!resArticulos.ok) throw new Error("HTTP " + resArticulos.status);
        const todosLosArticulos = await resArticulos.json();

        let idsLeidos = new Set();
        if (idUser) {
            const resLeidos = await fetch(`${API}/educacion/${idUser}`, { cache: "no-store" });
            if (!resLeidos.ok) throw new Error("HTTP " + resLeidos.status);
            const lista = await resLeidos.json();
            idsLeidos = new Set(lista.map(item => String(idDe(item))));
        }

        if (miCarga !== numeroDeCarga) return; // llegó una carga más nueva

        const pendientes = leerPendientes();

        for (const [clase, contenedor] of Object.entries(contenedores)) {
            renderizarTarjetas(todosLosArticulos, idsLeidos, pendientes, clase, contenedor);
        }
    } catch (error) {
        console.error("Error al cargar los datos de educación:", error);
    }
}

// Carga inicial
inicializarPagina();

// Cada vez que la página se muestra (volver con "atrás", caché, etc.)
window.addEventListener("pageshow", () => inicializarPagina());

// Cuando volvés a la pestaña / app
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") inicializarPagina();
});