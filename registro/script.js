const express = require('express');
const app = express();

document.addEventListener('DOMContentLoaded', () => { 
const botones = document.querySelectorAll('.opcion');

botones.forEach(boton => {
  boton.addEventListener('click', () => {
    event.preventDefault()
    boton.classList.toggle('activo');
  });
});

/*
document.addEventListener('click', () => { 
  const selecciones = document.querySelectorAll('.opcion.activo');
});
*/

const enviar = document.getElementById ("boton-enviar");
enviar.addEventListener('click', function() {

  const fecha = document.getElementById("inputfecha");
  const fechaseleccionada = fecha.value;

  const diario = document.getElementById("entradaDiario");
  const entrada = diario.value;
  
  const sintomas = [document.querySelectorAll('.opcion.activo')]
  .map(el => el.id);

  /* opp2 = const elementosActivos = document.querySelectorAll('.opcion.activo');
const seleccionados = [];

elementosActivos.forEach(el => {
  seleccionados.push(el.id);
});
  */

  const registro = { fechaseleccionada, entrada, sintomas };
  console.log(registro);
});

});


