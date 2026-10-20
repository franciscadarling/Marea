//  (lo que me dio chat)

/* fetch('https://marea/calendario/:id')
.then(respuesta => respuesta.json())
  .then(datos => console.log(datos));

.params.fecha 

async function cargarDatos() {
  const respuesta = await fetch("http://192.168.1.50:3000/ciclo");
  const datos = await respuesta.json();
  return datos;
}
  
*/

//  (para probar)--> document.querySelector(".progreso").style.strokeDashoffset = 267; 

const inicioUltimoPeriodo = new Date("2026-10-10T00:00:00");
const duracionCiclo = 28;
const duracionPeriodo = 5;

// 1. ¿Qué día del ciclo es hoy?
const hoy = new Date();
const msPorDia = 1000 * 60 * 60 * 24;
const diasPasados = Math.floor((hoy - inicioUltimoPeriodo) / msPorDia);
const diaDelCiclo = (diasPasados % duracionCiclo) + 1;

// 2. Porcentaje y rueda
const porcentaje = diaDelCiclo / duracionCiclo;
const circunferencia = 534;

document.querySelector(".progreso").style.strokeDashoffset =
  circunferencia * (1 - porcentaje);

  document.querySelector(".rueda").style.setProperty("--angulo", porcentaje * 360 + "deg");
  document.getElementById("burbuja").textContent = `Día ${diaDelCiclo}`;

// 3. Fase del ciclo
function obtenerFase(dia) {
  if (dia <= duracionPeriodo) return "Menstruación";
  if (dia <= 13) return "Fase folicular";
  if (dia <= 16) return "Ovulación";
  return "Fase lútea";
}

// 4. Próximo período
const proximoPeriodo = new Date(
  inicioUltimoPeriodo.getTime() +
  Math.ceil((diasPasados + 1) / duracionCiclo) * duracionCiclo * msPorDia
);

// 5. Mostrar textos
document.getElementById("hoy").textContent = `Día ${diaDelCiclo}`;
document.getElementById("fase").textContent = obtenerFase(diaDelCiclo);
document.getElementById("proximo").textContent =
  "Tu próximo período inicia el " +
  proximoPeriodo.toLocaleDateString("es-AR", { day: "numeric", month: "long" }); 
  
