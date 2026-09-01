import * as fs from 'fs';
import { stringify } from 'querystring';
import type {Users, Sintomas, Educacion, CiclosMenstruales} from './types.js'

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

/*function leerDatosEducacion(): Educacion {
  const contenido = fs.readFileSync(ruta, 'utf8');
  return JSON.parse(contenido) as Educacion;
}

function leerDatosCiclos(): CiclosMenstruales {
  const contenido = fs.readFileSync(ruta, 'utf8');
  return JSON.parse(contenido) as CiclosMenstruales;
}*/

let Datitos = leerDatosUsuarios ()
const Aleer = "mail" as keyof Users[0];
console.log(Datitos[0]?.[Aleer])
/*
let IdLeer: number= 1
//Quiero leer el mail de la persona id 2
for (let id: number = 0; id < Datitos.length; id++) {
  if (id!==IdLeer) {

  }
  else {
    console.log (Datitos)
  }
}*/