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

  try {
    const respuesta =  fetch(`http://localhost:3000/marea/versintomas/${idUser}/${fechaSeleccionada}`);
    const datos =  respuesta.json();
    console.log(datos);
  } catch (error) {
    console.error("No se pudieron cargar los datos:", error);
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
  }
});

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