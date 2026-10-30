const API = "http://localhost:3000/marea";

function obtenerIdUsuario() {
    const usuarioGuardado = localStorage.getItem("usuarioRegistrado");
    if (!usuarioGuardado) return null;
    try {
        const userObj = JSON.parse(usuarioGuardado);
        return userObj.id ?? userObj._id ?? usuarioGuardado;
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

function guardarPendientes(pendientes) {
    localStorage.setItem("leidoPendiente", JSON.stringify(pendientes));
}

// En educacion.json cada registro es { id: <usuario>, articulo: <articulo>, leido: <bool> }.
// El id que nos interesa para el artículo es "articulo", no "id" (que es el del usuario).
function idDeArticulo(item) {
    if (typeof item !== "object" || item === null) return item;
    return item.articulo ?? item.idArticulo ?? item.id ?? item._id;
}

// Un registro cuenta como leído solo si "leido" no es falso.
// Si el servidor devuelve directamente ids (o artículos sin "leido"), se considera leído.
function esLeido(item) {
    if (typeof item !== "object" || item === null) return true;
    if (!("leido" in item)) return true;
    const valor = item.leido;
    return valor === true || valor === 1 || valor === "true" || valor === "1";
}

document.addEventListener("DOMContentLoaded", () => {
    const idUser = obtenerIdUsuario();
    const check = document.getElementById("check-leido");

    let articulo = null;
    try {
        articulo = JSON.parse(localStorage.getItem("articuloActual"));
    } catch (e) {
        console.error("Error al parsear articuloActual", e);
    }

    if (!articulo) {
        console.log("No hay 'articuloActual' en el localStorage.");
        return;
    }

    const idArticulo = String(articulo.id ?? articulo._id);

    // 1. Rellenar la vista
    document.getElementById("titulo").textContent = articulo.titulo || "";
    document.getElementById("subtitulo").textContent = articulo.subtitulo || "";
    document.getElementById("cuerpo").textContent = articulo.texto || "";

    // 2. Estado inicial rápido (pendiente > lo guardado en la tarjeta)
    const pendientes = leerPendientes();
    check.checked = (idArticulo in pendientes) ? pendientes[idArticulo] : !!articulo.leido;

    // 3. Sincronizar con el servidor (la fuente de verdad)
    async function sincronizarConServidor() {
        if (!idUser) return;
        // si hay un cambio todavía sin confirmar, no lo pisamos
        if (idArticulo in leerPendientes()) return;

        try {
            const res = await fetch(`${API}/educacion/${idUser}`, { cache: "no-store" });
            if (!res.ok) throw new Error("HTTP " + res.status);
            const lista = await res.json();

            const leido = lista.some(
                item => String(idDeArticulo(item)) === idArticulo && esLeido(item)
            );
            check.checked = leido;

            articulo.leido = leido;
            localStorage.setItem("articuloActual", JSON.stringify(articulo));
        } catch (error) {
            console.error("No se pudo sincronizar el estado de leído:", error);
        }
    }

    sincronizarConServidor();

    // si la página vuelve desde la caché del navegador, volver a sincronizar
    window.addEventListener("pageshow", (event) => {
        if (event.persisted) sincronizarConServidor();
    });

    // 4. Cuando el usuario marca / desmarca
    check.addEventListener("change", async (event) => {
        const leido = event.target.checked;

        if (!idUser || !idArticulo) {
            console.error("Faltan datos del usuario o del artículo.", { idUser, idArticulo });
            check.checked = !leido;
            return;
        }

        // guardar como pendiente + actualizar el artículo local al instante
        const pend = leerPendientes();
        pend[idArticulo] = leido;
        guardarPendientes(pend);

        articulo.leido = leido;
        localStorage.setItem("articuloActual", JSON.stringify(articulo));

        try {
            const res = await fetch(`${API}/leido/${idUser}/${idArticulo}/${leido}`, {
                method: "PUT",
                keepalive: true // evita que se cancele si salís de la página rápido
            });
            if (!res.ok) throw new Error("HTTP " + res.status);

            const data = await res.json().catch(() => null);
            console.log("Estado actualizado con éxito:", data);

            // el servidor confirmó: ya no hace falta el pendiente
            const p = leerPendientes();
            delete p[idArticulo];
            guardarPendientes(p);
        } catch (error) {
            console.error("Error al actualizar el estado de leído:", error);

            // si falló, volvemos atrás para no mostrar algo falso
            const p = leerPendientes();
            delete p[idArticulo];
            guardarPendientes(p);

            check.checked = !leido;
            articulo.leido = !leido;
            localStorage.setItem("articuloActual", JSON.stringify(articulo));
        }
    });
});