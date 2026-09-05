import * as fs from 'fs';
import { stringify } from 'querystring';
import type {Users, Sintomas, Educacion, CiclosMenstruales} from './lib/types.js'

function leerDatosUsuarios(): Users {
  const ruta: string = '../Data/usuarios.json'
  const contenido = fs.readFileSync(ruta, 'utf8');
  return JSON.parse(contenido);
}

function leerDatosSintomas(): Sintomas {
  const ruta: string = '../Data/sintomas.json'
  const contenido = fs.readFileSync(ruta, 'utf8');
  return JSON.parse(contenido) as Sintomas;
}

function leerDatosEducacion(): Educacion {
  const ruta: string = '../Data/educacion.json'
  const contenido = fs.readFileSync(ruta, 'utf8');
  return JSON.parse(contenido) as Educacion;
}

function leerDatosCiclos(): CiclosMenstruales {
  const ruta: string = '../Data/ciclos.json'
  const contenido = fs.readFileSync(ruta, 'utf8');
  return JSON.parse(contenido) as CiclosMenstruales;
}
function DatoEspecifico
<T //"No sé qué tipo de objeto me vas a mandar todavía, pero al que mandes lo voy a bautizar temporalmente como T"
 extends //"debe cumplir con la condición de..."
 Record<string, any>> //"Cualquier objeto que tenga llaves de tipo texto (string) y valores de cualquier tipo (any)"
 (Tabla: T[], Aleer: keyof T, id: number) {
  return Tabla[id]?.[Aleer];
}
/*let Datitos = leerDatosUsuarios ()
const Aleer = "mail" as keyof Users[number];
console.log(Datitos[0]?.[Aleer])

let IdLeer: number= 1
//Quiero leer el mail de la persona id 2
for (let id: number = 0; id < Datitos.length; id++) {
  if (id!==IdLeer) {

  }
  else {
    console.log (Datitos)
  }
}*/

let hola = leerDatosSintomas ()
let info = DatoEspecifico (hola, 'fuerte', 0)
console.log (info)