//  (para probar)--> document.querySelector(".progreso").style.strokeDashoffset = 267; 


/* fetch('https://marea/rueda/:id')
.then(respuesta => respuesta.json())
  .then(datos => console.log(datos));

.params.fecha 
*/ 


const URL_BASE = "http://localhost:3000";
const duracionPeriodo = 5; // por defecto, hasta que el backend la mande

// Fase del ciclo
function obtenerFase(dia) {
  if (dia <= duracionPeriodo) return "Menstruación";
  if (dia <= 13) return "Fase folicular";
  if (dia <= 16) return "Ovulación";
  return "Fase lútea";
}

function mostrarRueda(datos) {
  // OJO: estos nombres son supuestos, cambialos por los reales
  const duracionCiclo = datos.duracion;
  const diasQueFaltan = datos.falta;
  const proximoCiclo = new Date(datos.proximoCiclo + "T00:00:00");

  // Día del ciclo, porcentaje y rueda
  const diaDelCiclo = duracionCiclo - diasQueFaltan + 1;
  const porcentaje = diaDelCiclo / duracionCiclo;
  const circunferencia = 534;

  document.querySelector(".progreso").style.strokeDashoffset =
    circunferencia * (1 - porcentaje);
  document.querySelector(".rueda").style.setProperty("--angulo", porcentaje * 360 + "deg");
  document.getElementById("burbuja").textContent = `Día ${diaDelCiclo}`;

  // Textos
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
