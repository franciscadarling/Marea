document.addEventListener('DOMContentLoaded', () => {
    const datosusuario = localStorage.getItem('usuarioRegistrado');
    const datosMenstruacion = localStorage.getItem("miCiclo");
    const mail = document.getElementById("mail");
    const contrasena = document.getElementById("contrasena");
    const usuario = document.getElementById("usuario");
    const fotoPerfil = document.getElementById('fotoPerfil');
    const fotoChica = document.getElementById('fotito');
    const duracionCiclo = document.getElementById("duracionCiclo");
    const duracionMenstruacion = document.getElementById("duracionMenstruacion");
    const ultimaMenstruacion = document.getElementById('ultimaMestruacion');
    const cerrarSesion = document.getElementById('cerrar-sesion');

    if (!datosusuario) {
        if (mail) mail.textContent = "";
        if (contrasena) contrasena.textContent = "";
        if (usuario) {
            usuario.innerHTML = '<a href="../log-in/index.html" style="color: inherit; text-decoration: underline;">Inicia sesión para ver tus datos</a>';
        }
        return; 
    }

    const guardado = JSON.parse(datosusuario);
    const guardadoM = datosMenstruacion ? JSON.parse(datosMenstruacion) : {};

    if (mail) mail.textContent = "Mail: " + (guardado.mail || guardado.mailUser || "");
    
    if (contrasena) {
        contrasena.textContent = "Contraseña: " + guardado.password;
    }

    if (usuario) usuario.textContent = "Nombre: " +guardado.nombre || "Usuario";

    if (fotoPerfil && guardado.foto) {
        fotoPerfil.src = guardado.foto;
        fotoChica.src = guardado.foto;
    }
    if (duracionCiclo) duracionCiclo.textContent = "Duración del ciclo: " +guardadoM.duracion || "";
    
    if (duracionMenstruacion) {
        duracionMenstruacion.textContent = "Duración del sangrado: " + guardadoM.periodo;
    }


});

/* Acá carga la foto de perfil jiji */
const inputFoto = document.getElementById('inputFoto');
const fotoPerfil = document.getElementById('fotoPerfil');
const fotoChica = document.getElementById('fotito');
const LADO_MAXIMO_FOTO = 512;

// Achica la imagen antes de guardarla para no llenar el localStorage.
function achicarImagen(archivo) {
    return new Promise((resolve, reject) => {
        const urlImagen = URL.createObjectURL(archivo);
        const imagen = new Image();

        imagen.onload = () => {
            URL.revokeObjectURL(urlImagen);
            const escala = Math.min(1, LADO_MAXIMO_FOTO / Math.max(imagen.width, imagen.height));
            const lienzo = document.createElement('canvas');
            lienzo.width = Math.round(imagen.width * escala);
            lienzo.height = Math.round(imagen.height * escala);
            lienzo.getContext('2d').drawImage(imagen, 0, 0, lienzo.width, lienzo.height);
            resolve(lienzo.toDataURL('image/jpeg', 0.85));
        };

        imagen.onerror = () => {
            URL.revokeObjectURL(urlImagen);
            reject(new Error('No se pudo leer la imagen.'));
        };

        imagen.src = urlImagen;
    });
}

async function guardarFotoEnServidor(foto) {
    const datosGuardados = localStorage.getItem('usuarioRegistrado');
    if (!datosGuardados) {
        throw new Error('No hay un usuario con sesión iniciada.');
    }

    const guardado = JSON.parse(datosGuardados);
    const userId = guardado.id;

    if (!userId) {
        throw new Error('No pudimos identificar tu usuario. Cerrá sesión y volvé a iniciar sesión.');
    }

    const respuesta = await fetch(`http://localhost:3000/marea/nuevafoto/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foto })
    });

    if (!respuesta.ok) {
        throw new Error(`El servidor respondió ${respuesta.status}.`);
    }

    guardado.foto = foto;
    localStorage.setItem('usuarioRegistrado', JSON.stringify(guardado));
}

inputFoto?.addEventListener('change', async function (evento) {
    const archivo = evento.target.files[0];
    if (!archivo) return;

    if (!archivo.type.startsWith('image/')) {
        alert('Elegí un archivo de imagen.');
        return;
    }

    try {
        // Se achica antes de subirla: una foto de celular en base64 pesa varios MB
        // y el backend la rechaza por tamaño.
        const fotoComprimida = await achicarImagen(archivo);
        if (fotoPerfil) fotoPerfil.src = fotoComprimida;
        if (fotoChica) fotoChica.src = fotoComprimida;

        await guardarFotoEnServidor(fotoComprimida);
    } catch (error) {
        console.error('No se pudo guardar la foto de perfil:', error);
        alert('No se pudo guardar la foto: ' + (error.message || 'error desconocido'));
    }
});
document.getElementById('cerrar-sesion')?.addEventListener('click', () => {
  localStorage.clear();
  window.location.href = "../log-in/index.html";
});

 /* Acá se abre y cierra el modal del usuario */
 const botonAbrirUsuario = document.getElementById('usuario-editar');
    const botonCerrarUsuario = document.getElementById('cerrar-usuario');
  const modal = document.getElementById('inputUsuario');
    const inputUsuario = document.getElementById('nuevoUsuario');

  botonAbrirUsuario.addEventListener('click', () => {
    modal.showModal(); // showModal() bloquea el fondo automáticamente
  });

  botonCerrarUsuario.addEventListener('click', () => {
    const datosusuario = localStorage.getItem('usuarioRegistrado');
    const guardado = JSON.parse(datosusuario);
    const nuevoUsuario = inputUsuario.value.trim;

    fetch (`http://localhost:3000/marea/cambiarUsuario/${guardado.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombre: nuevoUsuario
        })
    })
    .then(response => 
        response.json())
    .then(data => 
        mostrarRespuesta(data.respuesta))
        .catch(error => {
            console.log(error)
            mostrarRespuesta("Ups, algo salió mal. Probá de nuevo.") 
        })
    modal.close();
  });


 /* Acá se abre y cierra el modal del mail */
  const botonAbrirMail = document.getElementById('mail-editar');
    const botonCerrarMail = document.getElementById('cerrar-mail');
  const modalMail = document.getElementById('inputMail');

  botonAbrirMail.addEventListener('click', () => {
    modalMail.showModal(); // showModal() bloquea el fondo automáticamente
  });

  botonCerrarMail.addEventListener('click', () => {
    modalMail.close();
  });

  /* Acá se abre y cierra el modal de la contraseña */
const botonAbrirContrasena = document.getElementById('contrasena-editar');
    const botonCerrarContrasena = document.getElementById('cerrar-contrasena');
  const modalContrasena = document.getElementById('inputContrasena');

  botonAbrirContrasena.addEventListener('click', () => {
    modalContrasena.showModal(); // showModal() bloquea el fondo automáticamente
  });

  botonCerrarContrasena.addEventListener('click', () => {
    modalContrasena.close();
  });
  
  /* Acá se abre y cierra el modal de la duración del ciclo */
  const botonAbrirDuracionCiclo = document.getElementById('duracionCiclo-editar');
    const botonCerrarDuracionCiclo = document.getElementById('cerrar-duracionCiclo');
  const modalDuracionCiclo = document.getElementById('inputduracionCiclo');

  botonAbrirDuracionCiclo.addEventListener('click', () => {
    modalDuracionCiclo.showModal(); // showModal() bloquea el fondo automáticamente
  });

  botonCerrarDuracionCiclo.addEventListener('click', () => {
    modalDuracionCiclo.close();
  });
  /* Acá se abre y cierra el modal de la duración de menstruación */
const botonAbrirDuracionMenstruacion = document.getElementById('duracionMenstruacion-editar');
const botonCerrarMenstruacion = document.getElementById('cerrar-menstruacion');
  const modalDuracionMenstruacion = document.getElementById('inputduracionMenstruacion');

  botonAbrirDuracionMenstruacion.addEventListener('click', () => {
    modalDuracionMenstruacion.showModal(); 
  });

  botonCerrarMenstruacion.addEventListener('click', () => {
    modalDuracionMenstruacion.close();
  });

