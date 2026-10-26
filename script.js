//  (para probar)--> document.querySelector(".progreso").style.strokeDashoffset = 267; 


const URL_BASE = "http://localhost:3000";
const MS_POR_DIA = 1000 * 60 * 60 * 24;
const SINTOMAS_PERIODO = [1, 2, 3, 4];
const DIAS_A_REVISAR = 8;

function fechaLocal(fecha) {
  const a = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, "0");
  const d = String(fecha.getDate()).padStart(2, "0");
  return `${a}-${m}-${d}`;
}

function obtenerFase(dia, duracionPeriodo, duracionCiclo) {
  const ovulacion = duracionCiclo - 14;
  if (dia <= duracionPeriodo) return "Menstruación";
  if (dia < ovulacion - 1) return "Fase folicular";
  if (dia <= ovulacion + 1) return "Ovulación";
  return "Fase lútea";
}

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

  const dias = await Promise.all(peticiones);

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

function mostrarRueda(datos, inicioReciente) {
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
  let usuario = null;

  try {
    usuario = JSON.parse(localStorage.getItem('usuarioRegistrado'));
  } catch (error) {
    console.error("No se pudieron leer los datos de la sesión:", error);
  }

  // El login puede guardar { usuario: {...} }, { user: {...} } o los datos planos.
  usuario = usuario?.usuario ?? usuario?.user ?? usuario?.datos ?? usuario;
  const id = usuario?.id;

  if (!id) {
    console.error("No hay un usuario logueado. Iniciá sesión para ver tu ciclo.");
    const burbuja = document.getElementById("burbuja");
    if (burbuja) burbuja.textContent = "Sin sesión";
    return;
  }

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