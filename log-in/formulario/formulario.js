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


/*declaro variables*/
let indiceinicial = 0;
let contenedorpregunta = document.getElementById("contenedor");
let botonsig = document.getElementById("siguiente");
let botonat = document.getElementById("atrás");
let fechasSeleccionadas = [];
let respuestas = cargarRespuestas();
let mailGuardado = localStorage.getItem('Email');
let contrasenaGuardada = localStorage.getItem('Contrasena');


function crearNuevasRespuestas(mailGuardado, contrasenaGuardada) {
  let respuestas = {
    mail: mailGuardado,         
    contrasena: contrasenaGuardada,
    nombre: "",
    regularidad: "",
    duracionCiclo: "",
    duracionMenstruacion: "",
    fechasMenstruacion: []      
  };
  return respuestas;
}

function guardarRespuestasParciales(){
// 1. Buscamos el input actual en la pantalla (ajusta el selector según cómo tengas tu HTML)
let inputActual = document.getElementById("input-respuesta"); 
  
if (!inputActual) return; // Si no hay input en esta pantalla, salimos

// 2. Guardamos el valor según el paso en el que estamos (índice)
// (Suponiendo que 'misRespuestas' es el objeto que armamos antes)
switch (indiceinicial) {
  case 1:
    misRespuestas.nombre = inputActual.value;
    break;
  case 2:
    misRespuestas.regularidad = inputActual.value;
    break;
  case 3:
    misRespuestas.duracionCiclo = inputActual.value;
    break;
  case 4:
    misRespuestas.duracionMenstruacion = inputActual.value;
    break;
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
      mensaje = "La duración del ciclo debe ser un número entre 1 y 40.";
    }
  } else if (indiceinicial === 4) {
    const dias = Number(respuestas.duracionMenstruacion);
    if (!Number.isInteger(dias) || dias < 1 || dias > 14) {
      mensaje = "La duración de la menstruación debe ser un número entre 1 y 9, si es más deberías consultar con un médico.";
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

/*función para mostrar las preguntas*/
function mostrarPregunta() {
  contenedorpregunta.innerHTML = preguntas[indiceinicial];
  if (indiceinicial === 0) {
    botonat.style.display = "none";
    botonsig.textContent = "Comenzar";
    botonsig.className = "boton-comenzar";
  } 
  else if (indiceinicial>0){
    botonat.style.display = "inline-block";
    botonsig.textContent = "";
    botonsig.className = "siguiente";
    botonsig.disabled = false;
  }
  if (indiceinicial === 5) {
    inicializarCalendarioP5(); /*acá inicia la función del calendario, y ya después manda la respuesta*/
  }
}

botonsig.addEventListener("click", async () => {
  if (envioEnCurso || !validarRespuestaActual()) {
    return;
  }

  if (indiceinicial < preguntas.length - 1) { /*si no es la última pregunta avanza, cuando lo es hace el fetch*/
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