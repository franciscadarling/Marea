//  (para probar)--> document.querySelector(".progreso").style.strokeDashoffset = 267; 


const URL_BASE = "http://localhost:3000";
const MS_POR_DIA = 1000 * 60 * 60 * 24;
const SINTOMAS_PERIODO = [1, 2, 3, 4];

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
    const idSintoma = typeof s === "object" ? s.id : s; // "id" tiene que ser el param que y tenga en los sintomas
    return SINTOMAS_PERIODO.includes(Number(idSintoma));
  });
}

function mostrarRueda(datos, periodoHoy) {
  const duracionPeriodo = datos.duracion;
  const duracionCiclo = datos.duracionUltimoCiclo;
  const inicioUltimo = new Date(datos.inicioUltimo + "T00:00:00");
  const inicioProximo = new Date(datos.completo[0] + "T00:00:00");

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  let diaDelCiclo;
  let textoProximo;

  if (periodoHoy) {
    diaDelCiclo = 1;
    const estimado = new Date(hoy.getTime() + duracionCiclo * MS_POR_DIA);
    textoProximo = "Tu próximo período inicia el " +
      estimado.toLocaleDateString("es-AR", { day: "numeric", month: "long" });
  } else {
    diaDelCiclo = Math.round((hoy - inicioUltimo) / MS_POR_DIA) + 1;
    if (inicioProximo >= hoy) {
      textoProximo = "Tu próximo período inicia el " +
        inicioProximo.toLocaleDateString("es-AR", { day: "numeric", month: "long" });
    } else {
      const atraso = Math.round((hoy - inicioProximo) / MS_POR_DIA);
      textoProximo = `Tu período lleva ${atraso} ${atraso === 1 ? "día" : "días"} de atraso`;
    }
  }

  const porcentaje = Math.min(diaDelCiclo / duracionCiclo, 1); 
  const circunferencia = 534;

// revisar lo siguiente

const diasPasados = Math.round((hoy - inicioUltimo) / MS_POR_DIA); 
const diaDelCiclo = (diasPasados % duracionCiclo) + 1;



  document.querySelector(".progreso").style.strokeDashoffset =
    circunferencia * (1 - porcentaje);
  document.querySelector(".rueda").style.setProperty("--angulo", porcentaje * 360 + "deg");
  document.getElementById("burbuja").textContent = `Día ${diaDelCiclo}`;


  
  document.getElementById("hoy").textContent = `Día ${diaDelCiclo}`;
  document.getElementById("fase").textContent = obtenerFase(diaDelCiclo);
  document.getElementById("proximo").textContent =
    "Tu próximo período inicia el " +
    proximoCiclo.toLocaleDateString("es-AR", { day: "numeric", month: "long" });
}

// Pedir los datos al backend
async function iniciar() {
  const id = 1; // fijo por ahora, para probar

  try {
    const respuesta = await fetch(`${URL_BASE}/marea/rueda/${id}`);
    if (!respuesta.ok) throw new Error("Error " + respuesta.status);

    const datos = await respuesta.json();
    console.log(datos); // mirá acá cómo se llaman los campos
    mostrarRueda(datos);
  } catch (error) {
    console.error("No se pudieron cargar los datos:", error);
  }
}

iniciar();
