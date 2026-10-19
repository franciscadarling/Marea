/*  (lo que me dio chat)

fetch: info de alan */

const inicioUltimoPeriodo = new Date("2026-10-10");
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

  const angulo = porcentaje * 360;
  document.querySelector(".rueda").style.setProperty("--angulo", angulo + "deg");
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
  
