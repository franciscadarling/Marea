import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { randomBytes, scryptSync } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

type RegistroPayload = {
  mail: string;
  contrasena: string;
  nombre: string;
  regular: boolean;
  duracionCiclo: number;
  duracionMenstruacion: number;
  fechasMenstruacion: string[];
};

type Usuario = {
  [clave: string]: unknown;
  id?: number;
  mail?: unknown;
  contrasena?: unknown;
};

class ErrorValidacion extends Error {}
class ErrorDuplicado extends Error {}

const puerto = Number(process.env.PORT || 3000);
const rutaUsuarios = fileURLToPath(new URL("../Data/usuarios.json", import.meta.url));

function configurarCors(res: ServerResponse): void {
  res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
}

function responderJson(res: ServerResponse, estado: number, datos: unknown): void {
  res.statusCode = estado;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(datos));
}

function leerUsuarios(): Usuario[] {
  const contenido = readFileSync(rutaUsuarios, "utf8");
  const usuarios: unknown = JSON.parse(contenido);

  if (!Array.isArray(usuarios)) {
    throw new Error("usuarios.json no contiene una lista.");
  }

  return usuarios as Usuario[];
}

function leerTexto(valor: unknown, nombre: string, maximo: number): string {
  if (typeof valor !== "string" || !valor.trim() || valor.length > maximo) {
    throw new ErrorValidacion(`El campo ${nombre} no es válido.`);
  }

  return valor.trim();
}

function leerNumero(valor: unknown, nombre: string, minimo: number, maximo: number): number {
  const numero = typeof valor === "number" ? valor : Number(valor);

  if (!Number.isInteger(numero) || numero < minimo || numero > maximo) {
    throw new ErrorValidacion(`El campo ${nombre} debe estar entre ${minimo} y ${maximo}.`);
  }

  return numero;
}

function esFechaIso(fecha: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return false;
  }

  const date = new Date(`${fecha}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === fecha;
}

function validarRegistro(cuerpo: unknown): RegistroPayload {
  if (!cuerpo || typeof cuerpo !== "object" || Array.isArray(cuerpo)) {
    throw new ErrorValidacion("El cuerpo de la petición debe ser un objeto JSON.");
  }

  const datos = cuerpo as Record<string, unknown>;
  const mail = leerTexto(datos.mail, "mail", 160).toLowerCase();
  const contrasena = leerTexto(datos.contrasena, "contrasena", 200);
  const nombre = leerTexto(datos.nombre, "nombre", 100);
  const regular = datos.regular;

  if (typeof regular !== "boolean") {
    throw new ErrorValidacion("El campo regular debe ser true o false.");
  }

  const fechas = datos.fechasMenstruacion;
  if (!Array.isArray(fechas) || fechas.length === 0 || fechas.length > 24) {
    throw new ErrorValidacion("Seleccioná entre 1 y 24 fechas de menstruación.");
  }

  if (!fechas.every((fecha): fecha is string => typeof fecha === "string" && esFechaIso(fecha))) {
    throw new ErrorValidacion("Alguna de las fechas no tiene el formato AAAA-MM-DD.");
  }

  const fechasUnicas = [...new Set(fechas)];
  if (fechasUnicas.length !== fechas.length) {
    throw new ErrorValidacion("No se pueden enviar fechas repetidas.");
  }

  return {
    mail,
    contrasena,
    nombre,
    regular,
    duracionCiclo: leerNumero(datos.duracionCiclo, "duracionCiclo", 1, 60),
    duracionMenstruacion: leerNumero(
      datos.duracionMenstruacion,
      "duracionMenstruacion",
      1,
      14
    ),
    fechasMenstruacion: fechasUnicas
  };
}

function guardarRegistro(registro: RegistroPayload): Usuario {
  const usuarios = leerUsuarios();
  const yaExiste = usuarios.some(
    (usuario) => typeof usuario.mail === "string" && usuario.mail.toLowerCase() === registro.mail
  );

  if (yaExiste) {
    throw new ErrorDuplicado("Ya existe una cuenta con ese correo.");
  }

  const id = usuarios.reduce((mayorId, usuario) => {
    const idUsuario = typeof usuario.id === "number" ? usuario.id : 0;
    return Math.max(mayorId, idUsuario);
  }, 0) + 1;

  // No se guarda la contraseña en texto plano: se almacena su hash y una sal.
  const sal = randomBytes(16).toString("hex");
  const hash = scryptSync(registro.contrasena, sal, 64).toString("hex");
  const usuario: Usuario = {
    id,
    nombre: registro.nombre,
    mail: registro.mail,
    contrasena: `scrypt:${sal}:${hash}`,
    regular: registro.regular,
    duracionCiclo: registro.duracionCiclo,
    duracionMenstruacion: registro.duracionMenstruacion,
    fechasMenstruacion: registro.fechasMenstruacion,
    creadoEn: new Date().toISOString()
  };

  usuarios.push(usuario);
  writeFileSync(rutaUsuarios, `${JSON.stringify(usuarios, null, 2)}\n`, "utf8");
  return usuario;
}

function leerCuerpo(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let cuerpo = "";
    let exceeded = false;

    req.setEncoding("utf8");
    req.on("data", (fragmento: string) => {
      if (exceeded) {
        return;
      }

      cuerpo += fragmento;
      if (cuerpo.length > 100_000) {
        exceeded = true;
      }
    });
    req.on("end", () => {
      if (exceeded) {
        reject(new ErrorValidacion("La petición es demasiado grande."));
        return;
      }

      try {
        resolve(JSON.parse(cuerpo));
      } catch {
        reject(new ErrorValidacion("El cuerpo no contiene un JSON válido."));
      }
    });
    req.on("error", reject);
  });
}

const servidor = createServer(async (req, res) => {
  configurarCors(res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  if (req.method === "GET" && url.pathname === "/api/salud") {
    responderJson(res, 200, { ok: true });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/registro") {
    try {
      const contentType = req.headers["content-type"] || "";
      if (!contentType.includes("application/json")) {
        throw new ErrorValidacion("El endpoint espera application/json.");
      }

      const registro = validarRegistro(await leerCuerpo(req));
      const usuario = guardarRegistro(registro);
      responderJson(res, 201, {
        mensaje: "Registro guardado correctamente.",
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          mail: usuario.mail
        }
      });
    } catch (error) {
      if (error instanceof ErrorValidacion) {
        responderJson(res, 400, { mensaje: error.message });
        return;
      }

      if (error instanceof ErrorDuplicado) {
        responderJson(res, 409, { mensaje: error.message });
        return;
      }

      console.error(error);
      responderJson(res, 500, { mensaje: "No se pudo guardar el registro en el servidor." });
    }
    return;
  }

  responderJson(res, 404, { mensaje: "Ruta no encontrada." });
});

servidor.listen(Number.isFinite(puerto) ? puerto : 3000, () => {
  console.log(`Backend escuchando en http://localhost:${puerto}`);
});
