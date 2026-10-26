const URL_BASE = "http://localhost:3000";
const MS_POR_DIA = 1000 * 60 * 60 * 24;

function aFecha(texto) {
  return new Date(String(texto).slice(0, 10) + "T00:00:00");
}

function obtenerFase(dia, duracionPeriodo, duracionCiclo) {
  const ovulacion = duracionCiclo - 14;
  if (dia <= duracionPeriodo) return "Menstruación";
  if (dia < ovulacion - 1) return "Fase folicular";
  if (dia <= ovulacion + 1) return "Ovulación";
  return "Fase lútea";
}

function mostrarRueda(datos) {
  if (!datos || !datos.inicioUltimo) {
    console.log("Todavía no hay fecha de menstruación registrada");
    return;
  }

  const duracionCiclo = datos.duracionUltimoCiclo;
  const inicioUltimo = aFecha(datos.inicioUltimo);
  const hayProxima = Array.isArray(datos.completo) && datos.completo.length > 0;

  // Duración de la menstruación: si el back no la manda, uso los días de "completo"
  const duracionPeriodo = datos.duracion ?? (hayProxima ? datos.completo.length : 5);

  // Inicio de la próxima menstruación: el primer día de "completo"
  const inicioProximo = hayProxima
    ? aFecha(datos.completo[0])
    : new Date(inicioUltimo.getTime() + duracionCiclo * MS_POR_DIA);

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

// Si inicioUltimo es hoy, da 1 (la rueda se "resetea" sola)
const diaDelCiclo = Math.round((hoy - inicioUltimo) / MS_POR_DIA) + 1;

// Texto de "próximo período" o de atraso
let textoProximo;
if (datos.atrasado === true) {
  const atraso = Math.max(1, Math.round((hoy - inicioProximo) / MS_POR_DIA));
  textoProximo = `Tenés ${atraso} ${atraso === 1 ? "día" : "días"} de atraso`;
} else {
  textoProximo = "Tu próximo período inicia el " +
    inicioProximo.toLocaleDateString("es-AR", { day: "numeric", month: "long" });
}

// Rueda y burbuja (el aro nunca pasa de lleno, aunque haya atraso)
const porcentaje = Math.min(diaDelCiclo / duracionCiclo, 1);
const circunferencia = 534;

document.getElementById("hoy").textContent = `Día ${diaDelCiclo}`;
  document.getElementById("fase").textContent =
    obtenerFase(diaDelCiclo, duracionPeriodo, duracionCiclo);
  document.getElementById("proximo").textContent = textoProximo;
}

async function iniciar() {
  const usuario = JSON.parse(localStorage.getItem("usuarioRegistrado"));
  const id = usuario?.id;

  if (!id) {
    console.error("No hay usuario registrado en localStorage");
    return;
  }

  try {
    const respuesta = await fetch(`${URL_BASE}/marea/rueda/${id}`);
    if (!respuesta.ok) throw new Error("Rueda: error " + respuesta.status);

    const datos = await respuesta.json();
    console.log(datos);
    mostrarRueda(datos);
  } catch (error) {
    console.error("No se pudieron cargar los datos:", error);
  }
}

iniciar();











/*
function empezoPeriodo(sintomas) {
  if (!Array.isArray(sintomas)) return false;
  return sintomas.some((s) => {
    const idSintoma = typeof s === "object" ? s.id : s; // "id" tiene que ser el param que tenga en los sintomas endpoint
    return SINTOMAS_PERIODO.includes(Number(idSintoma));
  });
}

async function buscarInicioReciente(id) {
  const peticiones = [];
  for (let i = 0; i < DIAS_A_REVISAR; i++) {
    const dia = new Date();
    dia.setDate(dia.getDate() - i);
    peticiones.push(
      fetch(`${URL_BASE}/marea/versintomas/${id}/${fechaLocal(dia)}`)
        .then((r) => (r.ok ? r.json() : []))
        .then((sintomas) => ({ dia, tiene: empezoPeriodo(sintomas) }))
        .catch(() => ({ dia, tiene: false }))
    );
  }

const masReciente = dias.findIndex((d) => d.tiene);
  if (masReciente === -1) return null;

  // desde ese día, retrocedemos mientras haya síntomas consecutivos
  let inicio = masReciente;
  while (inicio + 1 < dias.length && dias[inicio + 1].tiene) inicio++;

  // si la racha llega al borde de la ventana, no sabemos cuándo empezó de verdad
  if (inicio === dias.length - 1) return null;

  const fecha = new Date(dias[inicio].dia);
  fecha.setHours(0, 0, 0, 0);
  return fecha;
}

function mostrarRueda(datos, periodoHoy) {
  const duracionPeriodo = datos.duracion;
  const duracionCiclo = datos.duracionUltimoCiclo;
  const inicioUltimo = new Date(datos.inicioUltimo + "T00:00:00");
  const inicioProximo = new Date(datos.completo[0] + "T00:00:00");

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

const periodoNuevo = inicioReciente && inicioReciente > inicioUltimo;
const inicioCiclo = periodoNuevo ? inicioReciente : inicioUltimo;
const diaDelCiclo = Math.round((hoy - inicioCiclo) / MS_POR_DIA) + 1;

  let textoProximo;

if (periodoNuevo) {
    const estimado = new Date(inicioCiclo.getTime() + duracionCiclo * MS_POR_DIA);
    textoProximo = "Tu próximo período inicia el " +
      estimado.toLocaleDateString("es-AR", { day: "numeric", month: "long" });
  } else if (inicioProximo >= hoy) {
    textoProximo = "Tu próximo período inicia el " +
      inicioProximo.toLocaleDateString("es-AR", { day: "numeric", month: "long" });
  } else {
    const atraso = Math.round((hoy - inicioProximo) / MS_POR_DIA);
    textoProximo = `Tu período lleva ${atraso} ${atraso === 1 ? "día" : "días"} de atraso`;
  }

  const porcentaje = Math.min(diaDelCiclo / duracionCiclo, 1);
  const circunferencia = 534;

document.querySelector(".progreso").style.strokeDashoffset =
    circunferencia * (1 - porcentaje);
  document.querySelector(".rueda").style.setProperty("--angulo", porcentaje * 360 + "deg");
  document.getElementById("burbuja").textContent = `Día ${diaDelCiclo}`;

  document.getElementById("hoy").textContent = `Día ${diaDelCiclo}`;
  document.getElementById("fase").textContent = obtenerFase(diaDelCiclo, duracionPeriodo, duracionCiclo);
  document.getElementById("proximo").textContent = textoProximo;
}

async function iniciar() {
  const usuario = JSON.parse(localStorage.getItem('usuarioRegistrado'));
  const id = usuario?.id;

  try {
    const resRueda = await fetch(`${URL_BASE}/marea/rueda/${id}`);
    if (!resRueda.ok) throw new Error("Rueda: error " + resRueda.status);

    const datos = await resRueda.json();
    const inicioReciente = await buscarInicioReciente(id);
    console.log(datos, inicioReciente);

    mostrarRueda(datos, inicioReciente);
  } catch (error) {
    console.error("No se pudieron cargar los datos:", error);
  }
}

iniciar();

*/