/* Muestra en el header la foto de perfil guardada, en todas las páginas. */
document.addEventListener('DOMContentLoaded', () => {
    const fotoHeader = document.getElementById('fotito');
    if (!fotoHeader) return;

    const datosGuardados = localStorage.getItem('usuarioRegistrado');
    if (!datosGuardados) return;

    else try {
        const usuario = JSON.parse(datosGuardados);
        const foto = usuario.foto;

        if (foto) {
            fotoHeader.src = foto;
        }
    } catch (error) {
        console.error('No se pudo leer la foto de perfil guardada:', error);
    }
});
