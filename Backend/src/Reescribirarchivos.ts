import * as fs from 'fs';
import { stringify } from 'querystring';

const ruta: string = '../Data/ciclos.json'; 
  
type Ciclo = {
  id: number;
  inicio: string;
  duracion: number
}
  
  type CiclosMenstruacion = Ciclo  []
function leerDatos(): CiclosMenstruacion {
  const contenido = fs.readFileSync(ruta, 'utf8');
  return JSON.parse(contenido) as CiclosMenstruacion;
}

// Función genérica para guardar el JSON completo
function guardarDatos(datos: CiclosMenstruacion): void {
  fs.writeFileSync(ruta, JSON.stringify(datos, null, 2), 'utf8');
}

// Agregar un nuevo síntoma
function agregarSintoma(NuevasFechas: Ciclo): void {
  const datos = leerDatos();
  datos.push(NuevasFechas);
  guardarDatos(datos);
}
let NuevasFechas: Ciclo = {
    id: 1,
    inicio: "27-08-2026",
    duracion: 5
}
agregarSintoma(NuevasFechas);