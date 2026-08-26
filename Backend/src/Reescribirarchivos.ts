import * as fs from 'fs';
import { stringify } from 'querystring';

const ruta: string = '../Data/Ciclo.json'; 
  
  type Ciclo = {
    id: number;
    fechasDeMenstruacion: string[]
  }
  
  type DiasMenstruacion = Ciclo  []
function leerDatos(): DiasMenstruacion {
  const contenido = fs.readFileSync(ruta, 'utf8');
  return JSON.parse(contenido) as DiasMenstruacion;
}

// Función genérica para guardar el JSON completo
function guardarDatos(datos: DiasMenstruacion): void {
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
    fechasDeMenstruacion: ["hola", "hola"]
}
agregarSintoma(NuevasFechas);