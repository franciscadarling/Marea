let preguntas = [
  "Comenzar",
  "1",
  "2",
  "3",
  "4"
];
let indiceinicial = 0;
let contenedorpregunta = document.getElementById("contenedor");
let botonsig = document.getElementById("siguiente");
let botonat = document.getElementById("atrás");

function mostrarPregunta() {
  contenedorpregunta.replaceChildren();

  const nuevoParrafo = document.createElement("p");
  nuevoParrafo.textContent = preguntas[indiceinicial];
  nuevoParrafo.classList.add("parrafo");

  contenedorpregunta.appendChild(nuevoParrafo);
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