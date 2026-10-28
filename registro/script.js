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
           const entradaDiaria = diario ? diario.value : '';
           
           const sintomasActivos = Array.from(document.querySelectorAll('.opcion.activo'))
               .map(el => Number(el.id));
 
          const registro = {idUser, fechaseleccionada, entradaDiaria, sintomasActivos };

           if (diaExiste === false) {
            const idsMenstruacion = [1, 2, 3, 4];
            const hoyMenstruo = registro.sintomasActivos.some(s => idsMenstruacion.includes(s));
            if (hoyMenstruo) {
            fetch(`http://localhost:3000/marea/sintomas/${idUser}/${fechaseleccionada}`, {
              method: "POST",
              headers: {
            "Content-Type": "application/json"
               },
             body: JSON.stringify({
              entrada: registro.entradaDiaria,
              sintomas: registro.sintomasActivos,
               })
            }) 
            .then (response => response.json())
            .then (data => {
                console.log(data)
            })
            .catch (error => {
              console.log("Hubo un error")
            })
            fetch(`http://localhost:3000/marea/agregarfechas/${idUser}`, {
              method: "POST",
              headers: {
            "Content-Type": "application/json"
               },
             body: JSON.stringify({
              fecha: registro.fechaseleccionada
               })
            }) 
            .then (response => response.json())
            .then (data => {
                console.log(data)
                diaExiste=true
            })
            .catch (error => {
              console.log("Hubo un error")
            })
          } 
          else {
            fetch(`http://localhost:3000/marea/sintomas/${idUser}/${fechaseleccionada}`, {
              method: "POST",
              headers: {
            "Content-Type": "application/json"
               },
             body: JSON.stringify({
              entrada: registro.entradaDiaria,
              sintomas: registro.sintomasActivos,
               })
            }) 
            .then (response => response.json())
            .then (data => {
                console.log(data)
            })
            .catch (error => {
              console.log("Hubo un error")
            })
          }
          } else if (diaExiste === true) { 
            const idsMenstruacion = [1, 2, 3, 4];
            const hoyMenstruo = registro.sintomasActivos.some(s => idsMenstruacion.includes(s));
            if (hoyMenstruo) {
              fetch(`http://localhost:3000/marea/cambiarsintomas/${idUser}/${fechaseleccionada}`, {
                method: "PUT",
                headers: {
              "Content-Type": "application/json"
                 },
               body: JSON.stringify({
                entrada: registro.entradaDiaria,
                sintomas: registro.sintomasActivos,
                 })
              }) 
              .then (response => response.json())
              .then (data => {
                  console.log(data)
              })
              .catch (error => {
                console.log("Hubo un error")
              })
              fetch(`http://localhost:3000/marea/agregarfechas/${idUser}`, {
                method: "POST",
                headers: {
              "Content-Type": "application/json"
                 },
               body: JSON.stringify({
                fecha: registro.fechaseleccionada
                 })
              }) 
              .then (response => response.json())
              .then (data => {
                  console.log(data)
                  diaExiste=true
              })
              .catch (error => {
                console.log("Hubo un error")
              })
            } 
            else {
              fetch(`http://localhost:3000/marea/cambiarsintomas/${idUser}/${fechaseleccionada}`, {
                method: "PUT",
                headers: {
              "Content-Type": "application/json"
                 },
               body: JSON.stringify({
                entrada: registro.entradaDiaria,
                sintomas: registro.sintomasActivos,
                 })
              }) 
              .then (response => response.json())
              .then (data => {
                  console.log(data)
              })
              .catch (error => {
                console.log("Hubo un error")
              })
             fetch(`http://localhost:3000/marea/eliminarfecha/${idUser}`, {
                method: "DELETE",
                headers: {
              "Content-Type": "application/json"
                 },
               body: JSON.stringify({
                fecha: registro.fechaseleccionada
                 })
              }) 
              .then (response => response.json())
              .then (data => {
                  console.log(data)
                  diaExiste = fals
              })
              .catch (error => {
                console.log("Hubo un error")
              })
            }
        } 
       });
   }

let diaExiste = true

   function verSintomas(idUser, fechaseleccionada) {
    fetch(`http://localhost:3000/marea/versintomas/${idUser}/${fechaseleccionada}`)
      .then(respuesta => respuesta.json())   
      .then (datos => {
    if (datos?.fecha) {
      diaExiste=true
    }
    else {
      diaExiste = false
    }

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
})
.catch(error => {
  console.log("No se pudieron cargar los datos:", error);});
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

  fechaInput.addEventListener('change', () => {
    verSintomas(idUser, fechaInput.value);
  });
  }
  
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

