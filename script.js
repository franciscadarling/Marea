const MS_POR_DIA = 1000 * 60 * 60 * 24;
const CIRCUNFERENCIA = 534; // 2 * π * 85, el mismo r del círculo SVG

// "2026-10-28T..." -> Date a medianoche local (evita desfases por zona horaria)
function aFecha(texto) {
  return new Date(String(texto).slice(0, 10) + "T00:00:00");
}

// Día del ciclo en que ocurre la ovulación
function diaOvulacion(duracionCiclo) {
  return Math.round(duracionCiclo / 2);
}

function obtenerFase(dia, duracionPeriodo, duracionCiclo) {
  const ovulacion = diaOvulacion(duracionCiclo);

  if (dia <= duracionPeriodo) return "Menstruación";
  if (dia < ovulacion - 1) return "Fase folicular";
  if (dia <= ovulacion + 1) return "Ovulación";   // ventana de 3 días
  return "Fase lútea";
}

function mostrarRueda(datos) {
  if (!datos || !datos.inicioUltimo) {
    console.log("Todavía no hay fecha de menstruación registrada");
    return;
  }

  // --- Datos base ---
  const duracionCiclo = datos.duracionUltimoCiclo ?? 28;
  const inicioUltimo = aFecha(datos.inicioUltimo);
  const hayProxima = Array.isArray(datos.completo) && datos.completo.length > 0;
  const duracionPeriodo = datos.duracion ?? (hayProxima ? datos.completo.length : 5);

  // Se guarda para otras pantallas (calendario, etc.)
  localStorage.setItem("miCiclo", JSON.stringify({
    duracion: duracionCiclo,
    inicio: inicioUltimo,
    periodo: duracionPeriodo
  }));

  // Inicio de la próxima menstruación: primer día de "completo",
  // o, si no hay, inicio del último ciclo + duración del ciclo
  const inicioProximo = hayProxima
    ? aFecha(datos.completo[0])
    : new Date(inicioUltimo.getTime() + duracionCiclo * MS_POR_DIA);

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // Si inicioUltimo es hoy, da 1
  const diaDelCiclo = Math.round((hoy - inicioUltimo) / MS_POR_DIA) + 1;

  // --- Texto de próximo período o de atraso ---
  let textoProximo;
  if (datos.atrasado === true) {
    const atraso = Math.max(1, Math.round((hoy - inicioProximo) / MS_POR_DIA));
    textoProximo = `Tenés ${atraso} ${atraso === 1 ? "día" : "días"} de atraso`;
  } else {
    textoProximo = "Tu próximo período inicia el " +
      inicioProximo.toLocaleDateString("es-AR", { day: "numeric", month: "long" });
  }

  // --- Rueda y burbuja (el aro nunca pasa de lleno, aunque haya atraso) ---
  const progreso = Math.min(diaDelCiclo / duracionCiclo, 1);

  document.querySelector(".progreso").style.strokeDashoffset =
    CIRCUNFERENCIA * (1 - progreso);
  document.querySelector(".rueda").style.setProperty("--angulo", progreso * 360 + "deg");
  document.getElementById("burbuja").textContent = `Día ${diaDelCiclo}`;


  document.getElementById("hoy").textContent =
    "Hoy, " + hoy.toLocaleDateString("es-AR", { day: "numeric", month: "long" });
  document.getElementById("fase").textContent =
    obtenerFase(diaDelCiclo, duracionPeriodo, duracionCiclo);
  document.getElementById("proximo").textContent = textoProximo;
  document.getElementById("proximo-ciclo").textContent = textoProximo;
}

function iniciar() {
  const usuario = JSON.parse(localStorage.getItem("usuarioRegistrado"));
  const id = usuario?.id;

  if (!id) {
    console.error("No hay usuario registrado en localStorage");
    return;
  }

  fetch(`http://localhost:3000/marea/rueda/${id}`)
    .then((respuesta) => {
      if (!respuesta.ok) throw new Error("Rueda: error " + respuesta.status);
      return respuesta.json();
    })
    .then((datos) => {
      console.log(datos);
      mostrarRueda(datos);
    })
    .catch((error) => {
      console.error("No se pudieron cargar los datos:", error);
    });
}

iniciar();

