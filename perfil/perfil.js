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