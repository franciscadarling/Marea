document.addEventListener('DOMContentLoaded', function() {
  const contenedor = document.querySelector('.pantalla');
  const calendarioScroll = document.getElementById('calendario-scroll');
  
  let diasMarcados = new Set();

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

  function normalizarDiasMarcados(datos, duracionMenstruacion) {
    const fechas = new Set();

    const agregarRango = (inicio, duracion) => {
      const fechaInicio = fechaIso(inicio);
      if (!fechaInicio) return;

      const dias = Math.max(
        1,
        Math.min(Math.round(Number(duracion) || duracionMenstruacion), 14)
      );

      for (let i = 0; i < dias; i++) {
        fechas.add(sumarDias(fechaInicio, i));
      }
    };

    const agregarItem = (item) => {
      if (!item) return;

      if (typeof item === "string" || item instanceof Date) {
        const fecha = fechaIso(item);
        if (fecha) fechas.add(fecha);
        return;
      }

      if (typeof item !== "object") return;

      const fechasDelItem = item.fechasDeMenstruacion ?? item.fechasMenstruacion ?? item.fechas ?? item.dias;
      if (Array.isArray(fechasDelItem)) {
        fechasDelItem.forEach((fecha) => {
          const fechaNormalizada = fechaIso(fecha);
          if (fechaNormalizada) fechas.add(fechaNormalizada);
        });
        return;
      }

      const inicio = item.inicio ?? item.fecha;
      if (inicio) agregarRango(inicio, item.duracion ?? duracionMenstruacion);
    };

    (datos == null ? [] : Array.isArray(datos) ? datos : [datos]).forEach(agregarItem);

    // Los períodos guardados localmente solo se agregan si el servidor
    // todavía no tiene cubierta esa fecha. Así no se alargan de más.
    const fechasDelServidor = new Set(fechas);
    leerPeriodosLocales().forEach((item) => {
      const inicio = fechaIso(typeof item === "object" && item !== null ? (item.inicio ?? item.fecha) : item);
      if (!inicio) return;

      const yaCubierto = [...fechasDelServidor].some((fecha) => {
        const diferencia = diferenciaEnDias(fecha, inicio);
        return diferencia >= 0 && diferencia < duracionMenstruacion;
      });

      if (!yaCubierto) agregarItem(item);
    });

    // Agrupamos los días que pertenecen a la misma menstruación (fechas
    // cercanas entre sí). Si el servidor devolvió solo el primer día, o
    // algunos días sueltos, completamos el período hasta la duración.
    const ordenadas = [...fechas].filter(Boolean).sort();
    const resultado = new Set(fechas);

    let i = 0;
    while (i < ordenadas.length) {
      let j = i;
      while (
        j + 1 < ordenadas.length &&
        diferenciaEnDias(ordenadas[j], ordenadas[j + 1]) < duracionMenstruacion
      ) {
        j++;
      }

      const inicio = ordenadas[i];
      const fin = ordenadas[j];
      const diasDelGrupo = diferenciaEnDias(inicio, fin) + 1;

      // Se completa hasta la duración (también rellena huecos internos).
      const diasAMarcar = Math.max(diasDelGrupo, duracionMenstruacion);
      for (let d = 0; d < diasAMarcar; d++) {
        resultado.add(sumarDias(inicio, d));
      }

      i = j + 1;
    }

    return resultado;
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
      
      if (diasMarcados.has(fechaStr)) {
        celda.classList.add('dia-menstruacion');
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
  const limiteFuturo = new Date(hoy.getFullYear() + 1, hoy.getMonth(), 1);

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

  function cargarMesAnterior() {
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

  if (usuarioId === undefined || usuarioId === null) {
    diasMarcados = normalizarDiasMarcados([], duracionMenstruacion);
    inicializarCalendario();
    return;
  }

  fetch(`http://localhost:3000/marea/calendario/${usuarioId}`, { cache: 'no-store' })
    .then(response => {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.json();
    })
    .then(data => {
      diasMarcados = normalizarDiasMarcados(data, duracionMenstruacion);
      inicializarCalendario();
    })
    .catch(error => {
      console.error('Error al leer los días de menstruación:', error);
      diasMarcados = normalizarDiasMarcados([], duracionMenstruacion);
      inicializarCalendario();
    });
});