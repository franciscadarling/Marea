document.addEventListener('DOMContentLoaded', function() {
    const contenedor = document.querySelector('.pantalla');
    const calendarioScroll = document.getElementById('calendario-scroll');
    const diasMarcados = ['2026-09-03', '2026-09-04', '2026-09-05']; //es solo ejemplo por ahora
  
    const nombresMes = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  
    function crearBloqueMes(año, mes) {
      const bloque = document.createElement('div');
      bloque.className = 'mes-bloque';
  
      const titulo = document.createElement('div');
      titulo.className = 'mes-titulo';
      titulo.textContent = `${nombresMes[mes]} ${año}`;
      bloque.appendChild(titulo);
  
      const grid = document.createElement('div');
      grid.className = 'dias-grid';
  
      const primerDia = new Date(año, mes, 1).getDay();
      const totalDias = new Date(año, mes + 1, 0).getDate();
  
      for (let i = 0; i < primerDia; i++) {
        grid.appendChild(document.createElement('div'));
      }
  
      for (let dia = 1; dia <= totalDias; dia++) {
        const celda = document.createElement('div');
        celda.className = 'dia-celda';
        celda.textContent = dia;
  
        const fechaStr = `${año}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
        if (diasMarcados.includes(fechaStr)) {
          celda.classList.add('dia-menstruacion');
        }
  
        grid.appendChild(celda);
      }
  
      bloque.appendChild(grid);
      return bloque;
    }
  
    const hoy = new Date();
    let fechaAdelante = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    let fechaAtras = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  
    function cargarMesSiguiente() {
      fechaAdelante.setMonth(fechaAdelante.getMonth() + 1);
      const bloque = crearBloqueMes(fechaAdelante.getFullYear(), fechaAdelante.getMonth());
      calendarioScroll.appendChild(bloque);
      observarUltimo(bloque);
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
    const bloqueActual = crearBloqueMes(hoy.getFullYear(), hoy.getMonth());
    calendarioScroll.appendChild(bloqueActual);
  
    for (let i = 0; i < 3; i++) cargarMesSiguiente();
    for (let i = 0; i < 3; i++) cargarMesAnterior();
  
    observarUltimo(calendarioScroll.lastElementChild);
    observarPrimero(calendarioScroll.firstElementChild);
  });