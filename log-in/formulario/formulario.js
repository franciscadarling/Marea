let preguntas = [
  `<div class="inicio">
     <p class="parrafo">Este es un formulario para conocer los datos de tu ciclo menstrual y brindarte un seguimiento personalizado.</p>
   </div>`,
  `<div class="preguntas"><label class="label" for="p1">¿Cómo querés que te llamemos?</label> <input type="text" id="p1" name="nombre" autocomplete="name" required></div>`,
  `<div class="preguntas"><label class="label" for="regularidad">¿Sos regular o irregular?</label> <select id="regularidad" name="regularidad" required>
      <option value="">Elegí una opción</option>
       <option value="regular">Regular</option>
      <option value="irregular">Irregular</option>
    </select></div>`,
  `<div class="preguntas"><label class="label" for="p3">¿Cuántos días dura tu ciclo aproximadamente?</label> <input type="number" id="p3" name="duracionCiclo" min="1" max="60" required></div>`,
  `<div class="preguntas"><label class="label" for="p4">¿Cuántos días dura tu menstruación aproximadamente?</label> <input type="number" id="p4" name="duracionMenstruacion" min="1" max="14" required></div>`,
  `<div class="preguntas">
     <label class="label">Selecciona las fechas de tus menstruaciones anteriores</label>
     <div class="calendario-pantalla" id="calendario-pantalla-p5">
       <div class="calendario-scroll" id="calendario-scroll-p5"></div>
     </div>
   </div>`
];

const API_REGISTRO = "http://localhost:3000/api/registro";
const CREDENCIALES_KEY = "marea.credenciales";
const RESPUESTAS_KEY = "marea.respuestas";

let indiceinicial = 0;
let contenedorpregunta = document.getElementById("contenedor");
let botonsig = document.getElementById("siguiente");
let botonat = document.getElementById("atrás");
let estadoFormulario = document.getElementById("estado-formulario");
let envioEnCurso = false;
let fechasSeleccionadas = [];
let respuestas = cargarRespuestas();

function crearRespuestasVacias() {
  return {
    nombre: "",
    regularidad: "",
    duracionCiclo: "",
    duracionMenstruacion: "",
    fechasMenstruacion: []
  };
}

function cargarRespuestas() {
  try {
    const respuestasGuardadas = JSON.parse(sessionStorage.getItem(RESPUESTAS_KEY) || "null");
    if (!respuestasGuardadas || typeof respuestasGuardadas !== "object") {
      return crearRespuestasVacias();
    }

    const base = crearRespuestasVacias();
    return {
      ...base,
      ...respuestasGuardadas,
      fechasMenstruacion: Array.isArray(respuestasGuardadas.fechasMenstruacion)
        ? respuestasGuardadas.fechasMenstruacion
        : []
    };
  } catch (error) {
    return crearRespuestasVacias();
  }
}

function guardarRespuestas() {
  try {
    sessionStorage.setItem(RESPUESTAS_KEY, JSON.stringify(respuestas));
  } catch (error) {
    console.error(error);
  }
}

function obtenerCredenciales() {
  try {
    const credenciales = JSON.parse(sessionStorage.getItem(CREDENCIALES_KEY) || "null");
    if (
      credenciales &&
      typeof credenciales.mail === "string" &&
      typeof credenciales.contrasena === "string" &&
      credenciales.mail.trim() &&
      credenciales.contrasena
    ) {
      return credenciales;
    }
  } catch (error) {
    console.error(error);
  }

  return null;
}

function mostrarEstado(mensaje, tipo = "error") {
  estadoFormulario.textContent = mensaje;
  estadoFormulario.className = `estado-formulario ${tipo}`;
  estadoFormulario.hidden = !mensaje;
}

function guardarRespuestaActual() {
  switch (indiceinicial) {
    case 1:
      respuestas.nombre = document.getElementById("p1")?.value.trim() || "";
      break;
    case 2:
      respuestas.regularidad = document.getElementById("regularidad")?.value || "";
      break;
    case 3:
      respuestas.duracionCiclo = document.getElementById("p3")?.value || "";
      break;
    case 4:
      respuestas.duracionMenstruacion = document.getElementById("p4")?.value || "";
      break;
    case 5:
      respuestas.fechasMenstruacion = [...fechasSeleccionadas];
      break;
  }

  guardarRespuestas();
}

function restaurarRespuestaActual() {
  switch (indiceinicial) {
    case 1: {
      const campo = document.getElementById("p1");
      if (campo) campo.value = respuestas.nombre;
      break;
    }
    case 2: {
      const campo = document.getElementById("regularidad");
      if (campo) campo.value = respuestas.regularidad;
      break;
    }
    case 3: {
      const campo = document.getElementById("p3");
      if (campo) campo.value = respuestas.duracionCiclo;
      break;
    }
    case 4: {
      const campo = document.getElementById("p4");
      if (campo) campo.value = respuestas.duracionMenstruacion;
      break;
    }
    case 5:
      fechasSeleccionadas = [...respuestas.fechasMenstruacion];
      break;
  }
}

function validarRespuestaActual() {
  guardarRespuestaActual();

  if (indiceinicial === 0) {
    mostrarEstado("");
    return true;
  }

  let mensaje = "";
  if (indiceinicial === 1 && !respuestas.nombre) {
    mensaje = "Escribí tu nombre para continuar.";
  } else if (indiceinicial === 2 && !respuestas.regularidad) {
    mensaje = "Elegí si tu ciclo es regular o irregular.";
  } else if (indiceinicial === 3) {
    const dias = Number(respuestas.duracionCiclo);
    if (!Number.isInteger(dias) || dias < 1 || dias > 60) {
      mensaje = "La duración del ciclo debe ser un número entre 1 y 60.";
    }
  } else if (indiceinicial === 4) {
    const dias = Number(respuestas.duracionMenstruacion);
    if (!Number.isInteger(dias) || dias < 1 || dias > 14) {
      mensaje = "La duración de la menstruación debe ser un número entre 1 y 14.";
    }
  } else if (indiceinicial === 5 && respuestas.fechasMenstruacion.length === 0) {
    mensaje = "Seleccioná al menos una fecha de menstruación.";
  }

  mostrarEstado(mensaje);
  return !mensaje;
}

function crearPayload(credenciales) {
  return {
    mail: credenciales.mail.trim(),
    contrasena: credenciales.contrasena,
    nombre: respuestas.nombre,
    regularidad: respuestas.regularidad,
    regular: respuestas.regularidad === "regular",
    duracionCiclo: Number(respuestas.duracionCiclo),
    duracionMenstruacion: Number(respuestas.duracionMenstruacion),
    fechasMenstruacion: [...respuestas.fechasMenstruacion]
  };
}

async function enviarRegistro() {
  const credenciales = obtenerCredenciales();
  if (!credenciales) {
    mostrarEstado("Primero tenés que completar el registro con tu e-mail y contraseña.");
    return;
  }

  envioEnCurso = true;
  botonsig.disabled = true;
  botonsig.textContent = "Guardando...";
  mostrarEstado("Guardando tus datos...", "");

  try {
    const respuesta = await fetch(API_REGISTRO, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(crearPayload(credenciales))
    });

    let resultado = {};
    try {
      resultado = await respuesta.json();
    } catch (error) {
      resultado = {};
    }

    if (!respuesta.ok) {
      throw new Error(resultado.mensaje || "No se pudo guardar el registro.");
    }

    sessionStorage.removeItem(CREDENCIALES_KEY);
    sessionStorage.removeItem(RESPUESTAS_KEY);
    botonsig.textContent = "Listo";
    mostrarEstado("¡Tu registro se guardó correctamente!", "exito");
  } catch (error) {
    envioEnCurso = false;
    botonsig.disabled = false;
    botonsig.textContent = "Finalizar";
    mostrarEstado(error instanceof Error ? error.message : "No se pudo conectar con el backend.");
  }
}

function mostrarPregunta() {
  contenedorpregunta.innerHTML = preguntas[indiceinicial];
  restaurarRespuestaActual();

  if (indiceinicial === 0) {
    botonat.style.display = "none";
    botonsig.textContent = "Comenzar";
    botonsig.className = "boton-comenzar";
  } else if (indiceinicial === preguntas.length - 1) {
    botonat.style.display = "inline-block";
    botonsig.textContent = envioEnCurso ? "Guardando..." : "Finalizar";
    botonsig.className = "boton-comenzar";
    botonsig.disabled = envioEnCurso;
  } else {
    botonat.style.display = "inline-block";
    botonsig.textContent = "";
    botonsig.className = "siguiente";
    botonsig.disabled = false;
  }

  if (indiceinicial === 5) {
    inicializarCalendarioP5();
  }
}

botonsig.addEventListener("click", async () => {
  if (envioEnCurso || !validarRespuestaActual()) {
    return;
  }

  if (indiceinicial < preguntas.length - 1) {
    indiceinicial++;
    mostrarPregunta();
  } else {
    await enviarRegistro();
  }
});

botonat.addEventListener("click", () => {
  if (indiceinicial > 0) {
    guardarRespuestaActual();
    indiceinicial--;
    mostrarPregunta();
  }
});

mostrarPregunta();

// ---------- Calendario tipo Almanaque / Tabla para p5 ----------

function inicializarCalendarioP5() {
  const contenedor = document.getElementById("calendario-pantalla-p5");
  const calendarioScroll = document.getElementById("calendario-scroll-p5");

  const nombresMes = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const diasSemana = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];

  const hoy = new Date();
  const limitePasado = new Date(hoy.getFullYear() - 2, hoy.getMonth(), 1);

  let fechaAtras = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

  function crearBloqueMes(año, mes) {
    const bloque = document.createElement('div');
    bloque.className = 'mes-bloque';

    const titulo = document.createElement('div');
    titulo.className = 'mes-titulo';
    titulo.textContent = `${nombresMes[mes]} ${año}`;
    bloque.appendChild(titulo);

    const grid = document.createElement('div');
    grid.className = 'dias-grid';

    // Encabezados de días
    diasSemana.forEach(dia => {
      const celdaHeader = document.createElement('div');
      celdaHeader.className = 'dia-semana-nombre';
      celdaHeader.textContent = dia;
      grid.appendChild(celdaHeader);
    });

    // Desplazamiento del 1er día del mes (Lunes = 0)
    let primerDia = new Date(año, mes, 1).getDay();
    primerDia = (primerDia + 6) % 7;

    const totalDias = new Date(año, mes + 1, 0).getDate();

    // Espacios en blanco previos
    for (let i = 0; i < primerDia; i++) {
      grid.appendChild(document.createElement('div'));
    }

    // Celdas numéricas
    for (let dia = 1; dia <= totalDias; dia++) {
      const celda = document.createElement('div');
      celda.className = 'dia-celda';
      celda.textContent = dia;

      const fechaStr = `${año}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
      const fechaCelda = new Date(año, mes, dia);

      if (fechasSeleccionadas.includes(fechaStr)) {
        celda.classList.add('dia-seleccionada');
      }

      if (fechaCelda > hoy) {
        celda.classList.add('dia-deshabilitada');
      } else {
        celda.addEventListener('click', function() {
          if (fechasSeleccionadas.includes(fechaStr)) {
            fechasSeleccionadas = fechasSeleccionadas.filter(f => f !== fechaStr);
            celda.classList.remove('dia-seleccionada');
          } else {
            fechasSeleccionadas.push(fechaStr);
            celda.classList.add('dia-seleccionada');
          }

          respuestas.fechasMenstruacion = [...fechasSeleccionadas];
          guardarRespuestas();
        });
      }

      grid.appendChild(celda);
    }

    bloque.appendChild(grid);
    return bloque;
  }

  function cargarMesAnterior() {
    const anterior = new Date(fechaAtras.getFullYear(), fechaAtras.getMonth() - 1, 1);
    if (anterior < limitePasado) return;

    fechaAtras = anterior;
    const bloque = crearBloqueMes(fechaAtras.getFullYear(), fechaAtras.getMonth());

    const alturaAntes = calendarioScroll.scrollHeight;
    calendarioScroll.insertBefore(bloque, calendarioScroll.firstChild);
    const alturaDespues = calendarioScroll.scrollHeight;

    contenedor.scrollTop += (alturaDespues - alturaAntes);
    observarPrimero(bloque);
  }

  function observarPrimero(bloque) {
    if (!bloque) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          observer.disconnect();
          cargarMesAnterior();
        }
      });
    }, { root: contenedor, threshold: 0.1 });
    observer.observe(bloque);
  }

  // Carga inicial
  const bloqueActual = crearBloqueMes(hoy.getFullYear(), hoy.getMonth());
  calendarioScroll.appendChild(bloqueActual);

  for (let i = 0; i < 2; i++) cargarMesAnterior();

  observarPrimero(calendarioScroll.firstElementChild);
  contenedor.scrollTop = contenedor.scrollHeight;
}