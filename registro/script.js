document.addEventListener('DOMContentLoaded', () => { 
  const botones = document.querySelectorAll('.opcion');

  botones.forEach(boton => {
      boton.addEventListener('click', (event) => {
          event.preventDefault();
          boton.classList.toggle('activo');
      });
  });
   function iniciar() {
    const usuario = JSON.parse(localStorage.getItem("usuarioRegistrado")) 
    const id = usuario?.id
    return id
  }

   let idUser = iniciar()

   function verSintomas(id, fecha) {
    fetch(`http://localhost:3000/marea/versintomas/${id}/${fecha}`)
      .then(respuesta => respuesta.json())
      if (fecha = /*null*/) { //COMPLETAR

        const activos = document.querySelectorAll('.opcion.activo');
        const idsMenstruacion = ['1', '2', '3', '4'];
        const hoyMenstruo = Array.from(activos).some(el => idsMenstruacion.includes(el.id))
        if (hoyMenstruo) {
        fetch(`http://localhost:3000/marea/sintomas/${id}/${fecha}`)
      } 
      else {
        fetch(`http://localhost:3000/marea/sintomas/${id}/${fecha}`)
        fetch(`http://localhost:3000/marea/cambiarsintomas/${id}/${fecha}`)
      }
      } else if (fecha = /*no null*/) { //COMPLETAR
      (datos => {
        document.querySelectorAll('.opcion.activo')
        .forEach(el => el.classList.remove('activo'));

        if (datos && Array.isArray(datos.sintomas)) {
          datos.sintomas.forEach(idSintoma => {
            const boton = document.getElementById(idSintoma);
            if (boton) {
              boton.classList.add('activo');}
          });
        }; 
        const diario = document.getElementById("entradaDiario");
        if (diario) {
          diario.value = (datos && datos.entrada) ? datos.entrada : '';}
      
      console.log(datos);

      const activos = document.querySelectorAll('.opcion.activo');
      const idsMenstruacion = ['1', '2', '3', '4'];
      const hoyMenstruo = Array.from(activos).some(el => idsMenstruacion.includes(el.id))
      if (hoyMenstruo) {
      // COMPLETAR
      } 
      else {
      // COMPLETAR
      }
      })
      .catch(error => {
        console.log("No se pudieron cargar los datos:", error);});
  } 
}


  const enviar = document.getElementById("boton-enviar");
  if (enviar) {
      enviar.addEventListener('click', function() {
          const fecha = document.getElementById("inputfecha");
          const fechaseleccionada = fecha ? fecha.value : '';

          const diario = document.getElementById("entradaDiario");
          const entrada = diario ? diario.value : '';
          
          const sintomas = Array.from(document.querySelectorAll('.opcion.activo'))
              .map(el => el.id);

          const registro = {idUser, fechaseleccionada, entrada, sintomas };
          console.log(registro);
      });
  }

  const fechaInput = document.getElementById("inputfecha");
  const fechaSeleccionada = localStorage.getItem('registro');
  console.log (fechaSeleccionada);

  if (fechaInput) {
    if (fechaSeleccionada) {
      cargarFecha(fechaInput);
      console.log("Se cargó la fecha "+fechaSeleccionada);
  } else {
      asignarFechaHoy(fechaInput);
      console.log("Se cargó la fecha de hoy por defecto.");
  }
  verSintomas (idUser, fechaInput.value)
  }
  fechaInput.addEventListener('change', () => {
    verSintomas(idUser, fechaInput.value);
  });
});

/*
get "hay sintomas previos hoy"

A)if get "null"

1-post
2-verif. 1: fijarse si persona tiene sintomas 1,2,3,4
3-if not, fetch añadir sintomas
4-if, fetch añadir sintomas y fetch añadir fechas

A) COMPLETADO (PSEUDO(?))

B)if get no "null"

1-put
2-verif.2: fijarse si hay sintomas 1,2,3,4 hoy 
3-if not, 
4-if, 

*/




function asignarFechaHoy(input) {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  
  if (input) {
      input.value = `${anio}-${mes}-${dia}`;
  }
}

function cargarFecha(input){
  const fechaSeleccionada = localStorage.getItem('registro');
  input.value = fechaSeleccionada;
}

window.addEventListener('beforeunload', () => {
  localStorage.removeItem('registro');
});

