document.addEventListener('DOMContentLoaded', function () {

  /* Variables y constantes*/
  const contenedor = document.querySelector('.pantalla')
  const calendarioScroll = document.getElementById('calendario-scroll')
  const usuario = JSON.parse(localStorage.getItem('usuarioRegistrado'))
  const nombresMes = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
  let diasRegistrados = new Set()
  let diasPredichos = new Set()
  let diasSintomas = new Set()
  const hoy = new Date()
  const limiteFuturo = new Date(hoy.getFullYear(), hoy.getMonth() + 6, 1)
  let fechaAdelante = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
  let fechaAtras = new Date(hoy.getFullYear(), hoy.getMonth(), 1)

  function fechaIso(fecha) {
    const mes = String(fecha.getMonth() + 1).padStart(2, '0')
    const dia = String(fecha.getDate()).padStart(2, '0')
    return `${fecha.getFullYear()}-${mes}-${dia}`
  }

  function sumarDias(fechaISO, cantidad) {
    const [anio, mes, dia] = fechaISO.split('-').map(Number)
    return fechaIso(new Date(anio, mes - 1, dia + cantidad))
  }

  function diferenciaEnDias(desdeISO, hastaISO) {
    const [a1, m1, d1] = desdeISO.split('-').map(Number)
    const [a2, m2, d2] = hastaISO.split('-').map(Number)
    return Math.round((new Date(a2, m2 - 1, d2) - new Date(a1, m1 - 1, d1)) / 86400000)
  }

  function normalizarDiasMarcados(datos, inicioUltimo) {
    const duracion = Number(usuario.duracionMenstruacion) || 5
    const registrados = new Set()
    const predichos = new Set()
    const todas = new Set()

    const finRegistrado = inicioUltimo
      ? sumarDias(inicioUltimo, Math.max(duracion, 7) - 1)
      : fechaIso(new Date())

    if (Array.isArray(datos)) {
      datos.forEach((fecha) => {
        todas.add(fecha)
        if (fecha <= finRegistrado) registrados.add(fecha)
        else predichos.add(fecha)
      })
    }

    const locales = JSON.parse(localStorage.getItem(`periodosLocales_${usuario.id}`) || '[]')
    locales.forEach((periodo) => {
      const inicio = typeof periodo === 'string' ? periodo : periodo.inicio
      const dias = Number(periodo.duracion) || duracion
      for (let i = 0; i < dias; i++) {
        const fecha = sumarDias(inicio, i)
        if (i === 0) registrados.add(fecha)
        else predichos.add(fecha)
        todas.add(fecha)
      }
    })

    const ordenadas = [...todas].sort()
    let i = 0
    while (i < ordenadas.length) {
      let fin = i
      while (
        fin + 1 < ordenadas.length &&
        diferenciaEnDias(ordenadas[fin], ordenadas[fin + 1]) < duracion
      ) {
        fin++
      }

      const grupo = ordenadas.slice(i, fin + 1)
      const inicio = grupo.find((fecha) => registrados.has(fecha)) || grupo[0]

      grupo.forEach((fecha) => {
        if (diferenciaEnDias(inicio, fecha) >= duracion) predichos.delete(fecha)
      })

      for (let d = 1; d < duracion; d++) {
        const fecha = sumarDias(inicio, d)
        if (!registrados.has(fecha)) predichos.add(fecha)
      }

      i = fin + 1
    }

    registrados.forEach((fecha) => predichos.delete(fecha))

    return { registrados, predichos }
  }

  function crearBloqueMes(año, mes) {
    const bloque = document.createElement('div')
    bloque.className = 'mes-bloque'

    const titulo = document.createElement('div')
    titulo.className = 'mes-titulo'
    titulo.textContent = `${nombresMes[mes]} ${año}`
    bloque.appendChild(titulo)

    const grid = document.createElement('div')
    grid.className = 'dias-grid'

    diasSemana.forEach((dia) => {
      const celdaHeader = document.createElement('div')
      celdaHeader.className = 'dia-semana-nombre'
      celdaHeader.textContent = dia
      grid.appendChild(celdaHeader)
    })

    const primerDia = (new Date(año, mes, 1).getDay() + 6) % 7
    const totalDias = new Date(año, mes + 1, 0).getDate()

    for (let i = 0; i < primerDia; i++) {
      grid.appendChild(document.createElement('div'))
    }

    for (let dia = 1; dia <= totalDias; dia++) {
      const celda = document.createElement('div')
      celda.className = 'dia-celda'
      celda.textContent = dia

      const fecha = fechaIso(new Date(año, mes, dia))

      if (diasRegistrados.has(fecha)) celda.classList.add('dia-menstruacion')
      else if (diasPredichos.has(fecha)) celda.classList.add('dia-menstruacion-predicho')

      if (diasSintomas.has(fecha)) {
        const punto = document.createElement('div')
        punto.className = 'punto-sintoma'
        celda.appendChild(punto)
      }

      celda.addEventListener('click', function () {
        localStorage.setItem('registro', fecha)
        window.location.href = '../registro/index.html'
      })

      grid.appendChild(celda)
    }

    bloque.appendChild(grid)
    return bloque
  }

  function observar(bloque, alEntrar) {
    if (!bloque) return

    const observer = new IntersectionObserver((entradas) => {
      if (!entradas.some((entrada) => entrada.isIntersecting)) return
      observer.disconnect()
      alEntrar()
    }, { root: contenedor, threshold: 0.3 })

    observer.observe(bloque)
  }

  function cargarMesSiguiente() {
    const siguiente = new Date(fechaAdelante.getFullYear(), fechaAdelante.getMonth() + 1, 1)
    if (siguiente > limiteFuturo) return

    fechaAdelante = siguiente
    const bloque = crearBloqueMes(fechaAdelante.getFullYear(), fechaAdelante.getMonth())
    calendarioScroll.appendChild(bloque)

    if (fechaAdelante < limiteFuturo) observar(bloque, cargarMesSiguiente)
  }

  function cargarMesAnterior() {
    const anterior = new Date(fechaAtras.getFullYear(), fechaAtras.getMonth() - 1, 1)
    if (anterior.getFullYear() < 1950) return

    fechaAtras = anterior
    const bloque = crearBloqueMes(fechaAtras.getFullYear(), fechaAtras.getMonth())

    const alturaAntes = calendarioScroll.scrollHeight
    calendarioScroll.insertBefore(bloque, calendarioScroll.firstChild)
    contenedor.scrollTop += calendarioScroll.scrollHeight - alturaAntes

    observar(bloque, cargarMesAnterior)
  }

  function inicializarCalendario() {
    calendarioScroll.innerHTML = ''

    fechaAdelante = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
    fechaAtras = new Date(hoy.getFullYear(), hoy.getMonth(), 1)

    const bloqueActual = crearBloqueMes(hoy.getFullYear(), hoy.getMonth())
    calendarioScroll.appendChild(bloqueActual)

    for (let i = 0; i < 3; i++) cargarMesSiguiente()
    for (let i = 0; i < 3; i++) cargarMesAnterior()

    const irAlMesActual = () => {
      contenedor.scrollTop = bloqueActual.getBoundingClientRect().top
        - contenedor.getBoundingClientRect().top
        + contenedor.scrollTop
    }
    irAlMesActual()
    requestAnimationFrame(irAlMesActual)

    if (fechaAdelante < limiteFuturo) {
      observar(calendarioScroll.lastElementChild, cargarMesSiguiente)
    }
    observar(calendarioScroll.firstElementChild, cargarMesAnterior)
  }

  if (!usuario) {
    console.error('No hay usuario logueado en localStorage')
    inicializarCalendario()
    return
  }

  async function pedir(ruta) {
    const respuesta = await fetch(`http://localhost:3000${ruta}`, { cache: 'no-store' })
    return respuesta.ok ? respuesta.json() : null
  }

  async function iniciar() {
    const [datosCalendario, datosRueda, datosSintomas] = await Promise.all([
      pedir(`/marea/calendario/${usuario.id}`),
      pedir(`/marea/rueda/${usuario.id}`),
      pedir(`/marea/diassintomas/${usuario.id}`)
    ])

    const inicioUltimo = datosRueda ? datosRueda.inicioUltimo : null

    const resultado = normalizarDiasMarcados(datosCalendario, inicioUltimo)
    diasRegistrados = resultado.registrados
    diasPredichos = resultado.predichos

    // Si no hay síntomas cargados, la ruta responde 404 y pedir() devuelve null.
    diasSintomas = new Set(Array.isArray(datosSintomas) ? datosSintomas : [])

    inicializarCalendario()
  }

  iniciar().catch((error) => console.error('No se pudo cargar el calendario:', error))
})