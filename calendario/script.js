document.addEventListener('DOMContentLoaded', function() {
  const contenedor = document.querySelector('.pantalla');
  const calendarioScroll = document.getElementById('calendario-scroll');
  
  let diasRegistrados = new Set();
  let diasPredichos = new Set();

  const usuario = JSON.parse(localStorage.getItem("usuarioRegistrado"));
  const usuarioId = usuario?.id;

  // Duración del sangrado: primero la del usuario, después la que ya calculó la rueda.
  function obtenerDuracionMenstruacion() {
    let duracion = Number(usuario?.duracionMenstruacion);

    if (!Number.isFinite(duracion) || duracion < 1) {
      try {
        const ciclo = JSON.parse(localStorage.getItem("miCiclo"));
        duracion = Number(ciclo?.periodo);
      } catch (e) {
        duracion = NaN;
      }
    }

    if (!Number.isFinite(duracion) || duracion < 1) duracion = 5;
    return Math.min(Math.round(duracion), 14);
  }

  function fechaIso(valor) {
    if (!valor) return "";

    if (valor instanceof Date) {
      if (Number.isNaN(valor.getTime())) return "";
      return `${valor.getFullYear()}-${String(valor.getMonth() + 1).padStart(2, "0")}-${String(valor.getDate()).padStart(2, "0")}`;
    }

    // Solo aceptamos fechas con formato AAAA-MM-DD (el servidor a veces
    // devuelve textos de error y no queremos marcarlos como días).
    const coincidencia = String(valor).match(/^(\d{4})-(\d{2})-(\d{2})/);
    return coincidencia ? coincidencia[0] : "";
  }

  function sumarDias(fechaISO, cantidad) {
    const [anio, mes, dia] = fechaISO.split("-").map(Number);
    const fecha = new Date(anio, mes - 1, dia + cantidad);
    return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;
  }

  function diferenciaEnDias(desdeISO, hastaISO) {
    const [a1, m1, d1] = desdeISO.split("-").map(Number);
    const [a2, m2, d2] = hastaISO.split("-").map(Number);
    return Math.round((new Date(a2, m2 - 1, d2) - new Date(a1, m1 - 1, d1)) / 86400000);
  }

  // Períodos guardados localmente al registrarlos, por si el servidor
  // todavía no los devuelve o solo devuelve el primer día.
  function leerPeriodosLocales() {
    if (usuarioId === undefined || usuarioId === null) return [];
    try {
      const guardado = JSON.parse(localStorage.getItem(`periodosLocales_${usuarioId}`));
      return Array.isArray(guardado) ? guardado : [];
    } catch (e) {
      return [];
    }
  }

  // Devuelve dos conjuntos:
  //  - registrados: días que la usuaria cargó realmente.
  //  - predichos: días estimados (los que completa el calendario y los que
  //    calcula el servidor para los próximos ciclos).
  function normalizarDiasMarcados(datos, duracionMenstruacion, inicioUltimo) {
    const registrados = new Set();
    const predichos = new Set();
    const todas = new Set();

    const hoyISO = fechaIso(new Date());
    const inicioRegistrado = fechaIso(inicioUltimo);

    // El servidor agrega los días predichos después del último período
    // cargado. Todo lo anterior a ese período es dato real.
    const finRegistrado = inicioRegistrado
      ? sumarDias(inicioRegistrado, Math.max(duracionMenstruacion, 7) - 1)
      : hoyISO;

    const clasificar = (fecha) => {
      if (fecha <= finRegistrado) registrados.add(fecha);
      else predichos.add(fecha);
      todas.add(fecha);
    };

    // Agrega un período a partir de su primer día. El primer día es el que
    // cargó la usuaria; el resto de la duración es una predicción.
    const agregarRango = (inicio, duracion) => {
      const fechaInicio = fechaIso(inicio);
      if (!fechaInicio) return;

      const dias = Math.max(
        1,
        Math.min(Math.round(Number(duracion) || duracionMenstruacion), 14)
      );

      for (let i = 0; i < dias; i++) {
        const fecha = sumarDias(fechaInicio, i);
        if (i === 0) registrados.add(fecha);
        else predichos.add(fecha);
        todas.add(fecha);
      }
    };

    const agregarItem = (item) => {
      if (!item) return;

      if (typeof item === "string" || item instanceof Date) {
        const fecha = fechaIso(item);
        if (fecha) clasificar(fecha);
        return;
      }

      if (typeof item !== "object") return;

      const fechasDelItem = item.fechasDeMenstruacion ?? item.fechasMenstruacion ?? item.fechas ?? item.dias;
      if (Array.isArray(fechasDelItem)) {
        fechasDelItem.forEach((fecha) => {
          const fechaNormalizada = fechaIso(fecha);
          if (fechaNormalizada) clasificar(fechaNormalizada);
        });
        return;
      }

      const inicio = item.inicio ?? item.fecha;
      if (inicio) agregarRango(inicio, item.duracion ?? duracionMenstruacion);
    };

    (datos == null ? [] : Array.isArray(datos) ? datos : [datos]).forEach(agregarItem);

    // Períodos guardados localmente al registrarlos (el primer día es real).
    leerPeriodosLocales().forEach(agregarItem);

    // Completamos cada período cargado hasta la duración configurada. Los
    // días que agrega el calendario son predichos, no registrados.
    const ordenadas = [...todas].filter(Boolean).sort();

    let i = 0;
    while (i < ordenadas.length) {
      let j = i;
      while (
        j + 1 < ordenadas.length &&
        diferenciaEnDias(ordenadas[j], ordenadas[j + 1]) < duracionMenstruacion
      ) {
        j++;
      }

      const grupo = ordenadas.slice(i, j + 1);
      const inicio = grupo.find((fecha) => registrados.has(fecha));

      if (inicio) {
        const fin = grupo[grupo.length - 1];
        const diasDelGrupo = diferenciaEnDias(inicio, fin) + 1;

        // Se completa hasta la duración (también rellena huecos internos).
        const diasAMarcar = Math.max(diasDelGrupo, duracionMenstruacion);
        for (let d = 0; d < diasAMarcar; d++) {
          const fecha = sumarDias(inicio, d);
          if (!registrados.has(fecha)) predichos.add(fecha);
        }
      }

      i = j + 1;
    }

    // Un día registrado nunca se muestra como predicho.
    registrados.forEach((fecha) => predichos.delete(fecha));

    return { registrados, predichos };
  }

  const nombresMes = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  function crearBloqueMes(año, mes) {
    const bloque = document.createElement('div');
    bloque.className = 'mes-bloque';

    const titulo = document.createElement('div');
    titulo.className = 'mes-titulo';
    titulo.textContent = `${nombresMes[mes]} ${año}`;
    bloque.appendChild(titulo);

    const grid = document.createElement('div');
    grid.className = 'dias-grid';

    diasSemana.forEach(dia => {
      const celdaHeader = document.createElement('div');
      celdaHeader.className = 'dia-semana-nombre';
      celdaHeader.textContent = dia;
      grid.appendChild(celdaHeader);
    });

    let primerDia = new Date(año, mes, 1).getDay();
    primerDia = (primerDia + 6) % 7;

    const totalDias = new Date(año, mes + 1, 0).getDate();

    for (let i = 0; i < primerDia; i++) {
      grid.appendChild(document.createElement('div'));
    }

    for (let dia = 1; dia <= totalDias; dia++) {
      const celda = document.createElement('div');
      celda.className = 'dia-celda';
      celda.textContent = dia;

      const fechaStr = `${año}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
      
      if (diasRegistrados.has(fechaStr)) {
        celda.classList.add('dia-menstruacion');
      } else if (diasPredichos.has(fechaStr)) {
        celda.classList.add('dia-menstruacion-predicho');
      }

      celda.addEventListener('click', function() {
        localStorage.setItem('registro', fechaStr);
        window.location.href = "../registro/index.html";
      });

      grid.appendChild(celda);
    }

    bloque.appendChild(grid);
    return bloque;
  }

  const hoy = new Date();
  const limiteFuturo = new Date(hoy.getFullYear(), hoy.getMonth() + 6, 1);

  let fechaAdelante = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  let fechaAtras = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

  function cargarMesSiguiente() {
    const siguiente = new Date(fechaAdelante.getFullYear(), fechaAdelante.getMonth() + 1, 1);
    if (siguiente > limiteFuturo) return;

    fechaAdelante = siguiente;
    const bloque = crearBloqueMes(fechaAdelante.getFullYear(), fechaAdelante.getMonth());
    calendarioScroll.appendChild(bloque);

    if (fechaAdelante < limiteFuturo) {
      observarUltimo(bloque);
    }
  }
  const limitePasado = 1950;

  function cargarMesAnterior() {
    // Creamos una copia para probar el mes siguiente al retroceder
    const fechaPrueba = new Date(fechaAtras);
    fechaPrueba.setMonth(fechaPrueba.getMonth() - 1);
  
    // Si al retroceder el año es menor a 1950, detenemos la ejecución
    if (fechaPrueba.getFullYear() < limitePasado) {
      return; 
    }
  
    fechaAtras.setMonth(fechaAtras.getMonth() - 1);
    const bloque = crearBloqueMes(fechaAtras.getFullYear(), fechaAtras.getMonth());
  
    const alturaAntes = calendarioScroll.scrollHeight;
    calendarioScroll.insertBefore(bloque, calendarioScroll.firstChild);
    const alturaDespues = calendarioScroll.scrollHeight;
  
    contenedor.scrollTop += (alturaDespues - alturaAntes);
    observarPrimero(bloque);
  }
  function observarUltimo(bloque) {
    if (!bloque) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          cargarMesSiguiente();
          observer.disconnect();
        }
      });
    }, { root: contenedor, threshold: 0.3 });
    observer.observe(bloque);
  }

  function observarPrimero(bloque) {
    if (!bloque) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          cargarMesAnterior();
          observer.disconnect();
        }
      });
    }, { root: contenedor, threshold: 0.3 });
    observer.observe(bloque);
  }

  function inicializarCalendario() {
    calendarioScroll.innerHTML = ''; 

    fechaAdelante = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    fechaAtras = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

    const bloqueActual = crearBloqueMes(hoy.getFullYear(), hoy.getMonth());
    calendarioScroll.appendChild(bloqueActual);

    for (let i = 0; i < 3; i++) cargarMesSiguiente();
    for (let i = 0; i < 3; i++) cargarMesAnterior();

    // Al abrir el calendario, dejar el mes actual arriba de todo.
    const irAlMesActual = () => {
      const top = bloqueActual.getBoundingClientRect().top
        - contenedor.getBoundingClientRect().top
        + contenedor.scrollTop;
      contenedor.scrollTop = top;
    };
    irAlMesActual();
    requestAnimationFrame(irAlMesActual);

    if (fechaAdelante < limiteFuturo) {
      observarUltimo(calendarioScroll.lastElementChild);
    }
    observarPrimero(calendarioScroll.firstElementChild);
  }

  const duracionMenstruacion = obtenerDuracionMenstruacion();

  function aplicarDias(datosCalendario, datosRueda) {
    const inicioUltimo = datosRueda && typeof datosRueda === "object"
      ? datosRueda.inicioUltimo
      : null;

    const { registrados, predichos } = normalizarDiasMarcados(
      datosCalendario,
      duracionMenstruacion,
      inicioUltimo
    );

    diasRegistrados = registrados;
    diasPredichos = predichos;
    inicializarCalendario();
  }

  if (usuarioId === undefined || usuarioId === null) {
    aplicarDias(null, null);
    return;
  }

  const pedir = (ruta) =>
    fetch(`http://localhost:3000${ruta}`, { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .catch((error) => {
        console.error(`Error al leer ${ruta}:`, error);
        return null;
      });

  Promise.all([
    pedir(`/marea/calendario/${usuarioId}`),
    pedir(`/marea/rueda/${usuarioId}`)
  ]).then(([datosCalendario, datosRueda]) => {
    aplicarDias(datosCalendario, datosRueda);
  });
});