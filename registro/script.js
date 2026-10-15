document.addEventListener('DOMContentLoaded', () => { 
const botones = document.querySelectorAll('.opcion');

botones.forEach(boton => {
  boton.addEventListener('click', () => {
    event.preventDefault();
    boton.classList.toggle('activo');
  });
});

const enviar = document.getElementById ("boton-enviar");
enviar.addEventListener('click', function() {
  
  
  const fecha = document.getElementById("inputfecha");
  const fechaseleccionada = fecha.value;

  const diario = document.getElementById("entradaDiario");
  const entrada = diario.value;
  
  const sintomas = Array.from(document.querySelectorAll('.opcion.activo'))
  .map(el => el.id);

  const registro = {fechaseleccionada, entrada, sintomas };
  console.log(registro);
});

});


