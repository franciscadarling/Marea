const express = require('express');
const app = express();

document.addEventListener('DOMContentLoaded', () => { 
const botones = document.querySelectorAll('.opcion');

botones.forEach(boton => {
  
  boton.addEventListener('click', () => {
    boton.classList.toggle('activo');
  });
})
});

document.addEventListener('click', () => { 
  const botones = document.querySelectorAll('.opcion');
});

/*ignorar*/
const enviar = document.getElementById ("boton-enviar");
enviar.addEventListener('click', function() {
  const fecha = document.getElementById("inputfecha")
  const fechaseleccionada = fecha.value
  




});




