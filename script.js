const URL_BASE = "http://localhost:3000";
const MS_POR_DIA = 1000 * 60 * 60 * 24;
const CIRCUNFERENCIA = 534; // 2 * π * 85, el mismo r del círculo SVG

// Texto informativo de cada fase (va en la tarjeta de abajo)
const DATOS_FASE = {
  "Menstruación":
    "Es normal sentir cólicos, cansancio o cambios de ánimo. Descansar, tomar agua y poner calor suave en la panza puede aliviar. Si el dolor es muy fuerte o no te deja hacer tus cosas, consultá con un profesional de la salud.",
  "Fase folicular":
    "Los estrógenos van subiendo y es común sentir más energía y mejor ánimo. Tu cuerpo está preparando un óvulo para liberarlo.",
  "Ovulación":
    "Se libera un óvulo y es la etapa con más probabilidad de embarazo. Puede aparecer flujo más transparente y elástico. En ciclos irregulares el momento puede variar.",
  "Fase lútea":
    "Sube la progesterona. Puede aparecer el síndrome premenstrual: hinchazón, sensibilidad en el pecho, antojos o cambios de ánimo."
};

// "2026-10-28T..." -> Date a medianoche local (evita desfases por zona horaria)
function aFecha(texto) {
  return new Date(String(texto).slice(0, 10) + "T00:00:00");
}

// Escribe un texto en un elemento; si el elemento no existe, no rompe el resto
function escribir(id, texto) {
  const elemento = document.getElementById(id);
  if (elemento) elemento.textContent = texto;
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

  // --- Textos ---
  const fase = obtenerFase(diaDelCiclo, duracionPeriodo, duracionCiclo);

  escribir("burbuja", `Día ${diaDelCiclo}`);
  escribir("dia-ciclo", `Día ${diaDelCiclo}`);
  escribir("fase", fase);                          // <- nueva
  escribir("proximo-ciclo", textoProximo);
  escribir("dato-fase", `${fase}: ${DATOS_FASE[fase]}`);
}

function iniciar() {
  const usuario = JSON.parse(localStorage.getItem("usuarioRegistrado"));
  const id = usuario?.id;

  if (!id) {
    console.error("No hay usuario registrado en localStorage");
    return;
  }

  fetch(`${URL_BASE}/marea/rueda/${id}`)
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

