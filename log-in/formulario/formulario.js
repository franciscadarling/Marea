/*declaro variables*/
let indiceinicial = 0;
let contenedorpregunta = document.getElementById("formulario");
let fechasSeleccionadas = [];
let mailGuardado = localStorage.getItem('Email');
let contrasenaGuardada = localStorage.getItem('Contrasena');
let nam = document.getElementById("nombre").value;
let regular = document.getElementById("regularidad").value;
let ciclo = document.getElementById("duracionCiclo").value;
let menst = document.getElementById("duracionMenstruacion").value;
let calendar = document.getElementById("calendario-pantalla-p5").value;


function crearNuevasRespuestas(mailGuardado, contrasenaGuardada) {
  let respuestas = {
    mail: mailGuardado,          
    password: contrasenaGuardada,
    nombre: "",
    genero: "",
    edad: "",
    regularidad: "", 
    condiciones: "",
    duracionCiclo: 0,
    duracionMenstruacion: 0,
    fechasMenstruacion: [] 
  };
  return respuestas;
}

function mostrarEstado(mensaje) {
  console.log(mensaje);
}

formulario.addEventListener('submit', function(e) {
  e.preventDefault(); 
   respuestas = {
    mail: mailGuardado,          
    password: contrasenaGuardada,
    nombre: nam,
    genero: "",
    edad: "",
    regularidad: regular, 
    condiciones: "",
    duracionCiclo: ciclo,
    duracionMenstruacion: menst,
    fechasMenstruacion: calendar 
  };

function validarRespuestaActual() {
  let mensaje = "";
  if (!respuestas.nombre) {
    mensaje = "Escribí tu nombre para continuar.";
  } else if (!respuestas.regularidad) {
    mensaje = "Elegí si tu ciclo es regular o irregular.";
  } else if (!respuestas.duracionCiclo || respuestas.duracionCiclo > 40 || respuestas.duracionCiclo<1) {
      mensaje = "La duración del ciclo debe ser un número entre 1 y 40.";
    } else if (!respuestas.duracionMenstruacion || respuestas.duracionMenstruacion > 9 || respuestas.duracionMenstruacion<1) {
      mensaje = "La duración de la menstruación debe ser un número entre 1 y 9, si es más deberías consultar con un médico.";
    }
   else if (!respuestas.fechasMenstruacion || respuestas.fechasMenstruacion.length === 0) {
    mensaje = "Seleccioná al menos una fecha de menstruación.";
  }

  mostrarEstado(mensaje);
  return !mensaje;
}



// ---------- Calendario tipo Almanaque / Tabla para p5 ----------

function inicializarCalendarioP5() {
  const contenedor = document.getElementById("calendario-pantalla-p5");
  const calendarioScroll = document.getElementById("calendario-scroll-p5");

  // Validación de seguridad por si los elementos aún no cargaron en el DOM
  if (!contenedor || !calendarioScroll) return;

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

// Ejecutar cuando el DOM esté listo por seguridad
document.addEventListener("DOMContentLoaded", () => {
  inicializarCalendarioP5();
});