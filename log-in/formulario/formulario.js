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