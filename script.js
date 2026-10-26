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

// Aro y burbuja
document.querySelector(".progreso").style.strokeDashoffset =
circunferencia * (1 - porcentaje);
document.querySelector(".rueda").style.setProperty("--angulo", porcentaje * 360 + "deg");
document.getElementById("burbuja").textContent = `Día ${diaDelCiclo}`;

document.getElementById("hoy").textContent = `Día ${diaDelCiclo}`;
  document.getElementById("fase").textContent =
    obtenerFase(diaDelCiclo, duracionPeriodo, duracionCiclo);
  document.getElementById("proximo-ciclo").textContent = textoProximo;
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

