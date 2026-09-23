let preguntas = [
  `<div class="inicio">
     <p class="parrafo">Este es un formulario para conocer los datos de tu ciclo menstrual y brindarte un seguimiento personalizado.</p>
   </div>`,
  `<div class="preguntas"><label class="label">¿Cómo querés que te llamemos?</label> <input type="text" id="p1"></div>`,
  `<div class="preguntas"><label class="label">¿Sos regular o irregular?</label> <select id="regularidad">
      <option value="regular">Regular</option>
      <option value="irregular">Irregular</option>
    </select></div>`,
  `<div class="preguntas"><label class="label">¿Cuántos días dura tu ciclo aproximadamente?</label> <input type="number" id="p3"></div>`,
  `<div class="preguntas"><label class="label">¿Cuántos días dura tu menstruación aproximadamente?</label> <input type="number" id="p4"></div>`,
  `<div class="preguntas">
     <label class="label">Selecciona las fechas de tus menstruaciones anteriores</label>
     <div class="calendario-pantalla" id="calendario-pantalla-p5">
       <div class="calendario-scroll" id="calendario-scroll-p5"></div>
     </div>
   </div>`
];

let indiceinicial = 0;
let contenedorpregunta = document.getElementById("contenedor");
let botonsig = document.getElementById("siguiente");
let botonat = document.getElementById("atrás");

// Fechas que el usuario va seleccionando en p5
let fechasSeleccionadas = [];

function mostrarPregunta() {
  contenedorpregunta.innerHTML = preguntas[indiceinicial];

  if (indiceinicial === 0) {
    botonat.style.display = "none";
    botonsig.textContent = "Comenzar";
    botonsig.className = "boton-comenzar";
  } else {
    botonat.style.display = "inline-block";
    botonsig.textContent = "";
    botonsig.className = "siguiente";
  }

  // Si es la pregunta del calendario, la inicializamos
  if (indiceinicial === 5) {
    inicializarCalendarioP5();
  }
}

botonsig.addEventListener("click", () => {
  if (indiceinicial < preguntas.length - 1) {
    indiceinicial++;
    mostrarPregunta();
  }
});

botonat.addEventListener("click", () => {
  if (indiceinicial > 0) {
    indiceinicial--;
    mostrarPregunta();
  }
});

mostrarPregunta();

// ---------- Calendario seleccionable para p5 ----------

function inicializarCalendarioP5() {
  const contenedor = document.getElementById("calendario-pantalla-p5");
  const calendarioScroll = document.getElementById("calendario-scroll-p5");

  const nombresMes = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const diasSemanaCorto = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];

  const hoy = new Date();
  const limiteFuturo = hoy; // no se pueden seleccionar días futuros
  const limitePasado = new Date(hoy.getFullYear() - 2, hoy.getMonth(), hoy.getDate());

  // Empezamos hoy y vamos agregando hacia atrás
  let fechaCursor = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

  function crearCeldaDia(fecha) {
    const celda = document.createElement('div');
    celda.className = 'dia-celda';

    const fechaStr = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;

    celda.textContent = `${diasSemanaCorto[(fecha.getDay() + 6) % 7]} ${fecha.getDate()} de ${nombresMes[fecha.getMonth()]} ${fecha.getFullYear()}`;

    if (fechasSeleccionadas.includes(fechaStr)) {
      celda.classList.add('dia-seleccionada');
    }

    if (fecha > limiteFuturo) {
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
      });
    }

    return celda;
  }

  function cargarBloqueAnterior(cantidad = 30) {
    const alturaAntes = calendarioScroll.scrollHeight;
    const fragment = document.createDocumentFragment();
    let ultimaCelda = null;

    for (let i = 0; i < cantidad; i++) {
      if (fechaCursor < limitePasado) break;
      const celda = crearCeldaDia(fechaCursor);
      fragment.insertBefore(celda, fragment.firstChild);
      ultimaCelda = celda;
      fechaCursor = new Date(fechaCursor.getFullYear(), fechaCursor.getMonth(), fechaCursor.getDate() - 1);
    }

    calendarioScroll.insertBefore(fragment, calendarioScroll.firstChild);
    const alturaDespues = calendarioScroll.scrollHeight;
    contenedor.scrollTop += (alturaDespues - alturaAntes);

    if (ultimaCelda && fechaCursor >= limitePasado) {
      observarPrimero(calendarioScroll.firstElementChild);
    }
  }

  function observarPrimero(celda) {
    if (!celda) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          observer.disconnect();
          cargarBloqueAnterior();
        }
      });
    }, { root: contenedor, threshold: 0.1 });
    observer.observe(celda);
  }

  // Carga inicial: hoy hacia atrás
  cargarBloqueAnterior(30);

  // Arranca scrolleado abajo del todo (donde está "hoy")
  contenedor.scrollTop = contenedor.scrollHeight;
}