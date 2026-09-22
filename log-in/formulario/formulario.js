let preguntas = [
  `<div class="inicio">
     <p class="parrafo">Este es un formulario para conocer los datos de tu ciclo menstrual y brindarte un seguimiento personalizado.</p>
   </div>`,
  `<div class="preguntas"><label class="label">¿Cómo querés que te llamemos?</label> <input type="text" id="p1"></div>`,
  `<div class="preguntas"><label class="label">¿Sos regular o irregular?</label> <select id="regularidad">
      <option value="regular">Regular</option>
      <option value="irregular">Irregular</option>
    </select></div>`,
  `<div class="preguntas"><label class="label">¿Cuántos días dura tu ciclo aproximadamente?</label> <input type="number" id="p3"></div>`,
  `<div class="preguntas"><label class="label">¿Cuántos días dura tu menstruación aproximadamente?</label> <input type="number" id="p4"></div>`,
  `<div class="preguntas"><label class="label">Selecciona las fechas de tus menstruaciones anteriores</label> <input type="text" id="p5"></div>`
];

let indiceinicial = 0;
let contenedorpregunta = document.getElementById("contenedor");
let botonsig = document.getElementById("siguiente");
let botonat = document.getElementById("atrás");

function mostrarPregunta() {

  contenedorpregunta.innerHTML = preguntas[indiceinicial];


  if (indiceinicial === 0) {
    botonat.style.display = "none"; 
    botonsig.textContent = "Comenzar"; 
    botonsig.className = "boton-comenzar"
  } else {
    botonat.style.display = "inline-block"; 
    botonsig.textContent = ""; 
    botonsig.className = "siguiente"
  }
}

botonsig.addEventListener("click", () => {
  if (indiceinicial < preguntas.length - 1) {
    indiceinicial++;
    mostrarPregunta();
  }
});

botonat.addEventListener("click", () => {
  if (indiceinicial > 0) {
    indiceinicial--;
    mostrarPregunta();
  }
});

mostrarPregunta();