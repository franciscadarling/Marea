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

   // Duración del sangrado configurada por la usuaria.
   function obtenerDuracionMenstruacion() {
     const guardado = JSON.parse(localStorage.getItem("usuarioRegistrado")) || {};
     let duracion = Number(guardado.duracionMenstruacion);

     if (!Number.isFinite(duracion) || duracion < 1) {
       try {
         const ciclo = JSON.parse(localStorage.getItem("miCiclo"));
         duracion = Number(ciclo?.periodo);
       } catch (e) {
         duracion = NaN;
       }
     }

     if (!Number.isFinite(duracion) || duracion < 1) duracion = 5;
     return Math.min(Math.round(duracion), 14);
   }

   // Guarda el período en el navegador para que el calendario pueda marcar
   // todos sus días aunque el servidor todavía no los tenga.
   function guardarPeriodoLocal(fechaInicio, duracion) {
     if (idUser === undefined || idUser === null || !fechaInicio) return;

     const clave = `periodosLocales_${idUser}`;
     let periodos = [];

     try {
       periodos = JSON.parse(localStorage.getItem(clave)) || [];
     } catch (e) {
       periodos = [];
     }

     if (!Array.isArray(periodos)) periodos = [];

     const yaExiste = periodos.some((periodo) => {
       const inicio = typeof periodo === "string" ? periodo : periodo?.inicio;
       return String(inicio).slice(0, 10) === fechaInicio;
     });

     if (!yaExiste) {
       periodos.push({ inicio: fechaInicio, duracion });
       localStorage.setItem(clave, JSON.stringify(periodos));
     }
   }


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

           const idsMenstruacion = [1, 2, 3, 4];
           const hoyMenstruo = registro.sintomasActivos.some(s => idsMenstruacion.includes(s));
           const duracionMenstruacion = obtenerDuracionMenstruacion();

           // Si registró sangrado, guardamos el período completo (inicio + duración)
           // para que el calendario marque también los días siguientes.
           if (hoyMenstruo && registro.fechaseleccionada) {
             guardarPeriodoLocal(registro.fechaseleccionada, duracionMenstruacion);
           }

           if (diaExiste === false) {
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
                exito.style.display= "block";
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
                exito.style.display= "block";
                diaExiste = true
            })
            .catch (error => {
              console.log("Hubo un error")
            })
          }
          } else if (diaExiste === true) { 
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
                  exito.style.display= "block";
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
                  exito.style.display= "block";
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
                  diaExiste = registro.sintomasActivos.length > 0 || registro.entradaDiaria !== ""
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