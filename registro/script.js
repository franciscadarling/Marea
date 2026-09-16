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





