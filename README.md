# Marea

An inclusive menstrual cycle tracking website for teenagers with an integrated chatbot.

## Registro: frontend y backend

El registro ahora funciona en dos pasos:

1. `log-in/sign-up/sign-up.html` toma el correo y la contraseña, los conserva temporalmente en `sessionStorage` y pasa al formulario.
2. `log-in/formulario/formulario.js` guarda las respuestas del cuestionario y, al finalizar, envía un `POST` JSON a `http://localhost:3000/api/registro`.

El JSON enviado tiene esta forma:

```json
{
  "mail": "persona@example.com",
  "contrasena": "contraseña-ingresada",
  "nombre": "Nombre",
  "regularidad": "regular",
  "regular": true,
  "duracionCiclo": 28,
  "duracionMenstruacion": 5,
  "fechasMenstruacion": ["2026-08-01", "2026-08-02"]
}
```

Para levantar el backend:

```bash
cd Backend
npm install
npm run build
npm start
```

El servidor expone `POST /api/registro` y guarda el registro en `Backend/Data/usuarios.json`. La contraseña se recibe en el JSON, pero se almacena como un hash `scrypt` con sal; no se guarda en texto plano. Si el backend se ejecuta en otro host o puerto, cambia `API_REGISTRO` en `log-in/formulario/formulario.js`.
