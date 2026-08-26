import * as fs from 'fs';
import { stringify } from 'querystring';

type InfoGral=  {
  id: number;
  nombre: string;
  mail: string;
  contraseña: number;
  genero: string;
  edad: number;
  foto: string;
  paleta: string;
  regular: boolean;
  condiciones: string;
  peso: number;
  altura: number;
}

type Users = InfoGral []

type Sintoma = {id: number;
  fecha: string;
  entrada: string;
  ligero: boolean;
  moderado: boolean;
  fuerte: boolean;
  masacre: boolean;
  rojo: boolean;
marron: boolean;
  cambiosDeAnimo: boolean;
  normal: boolean;
  irritabilidad: boolean;
  enojo: boolean;
  ansiedad: boolean;
  tristeza: boolean;
  Indiferencia: boolean;
  sinDolor: boolean;
  colicos: boolean;
  sensibilidadSenos: boolean;
  migraña: boolean;
  lumbares: boolean;
  articulaciones: boolean;
  vulvar: boolean;
  tampon: boolean;
  toallahigienica: boolean;
  protectorDiario: boolean;
  copa: boolean;
  ropaInteriorPro: boolean;
  malaMemoria: boolean;
  nieblaMental: boolean;
  distraccion: boolean;
  estres: boolean;
  sinMotivacion: boolean;
  bajoRendimiento: boolean;
  vitalidad: boolean;
  ok: boolean;
  Agotamiento: boolean;
  cansancioFatiga: boolean;
  Mareo: boolean;
  Nauseas: boolean;
  debilidadMuscular: boolean;
  presionBaja: boolean;
}

type sintomas = Sintoma []

type Edu = {
  id: number;
  articulo: number;
  leido: boolean;
}

type educacion = Edu []

type Ciclo = {
  id: number;
  fechasDeMenstruacion: string[]
}

type diasmenstruacion = Ciclo  []

type tablas = {
    infogeneral: InfoGral[];
  
    sintomas: Sintoma[];
  
    educacion: Edu[];
  
    fechas: Ciclo[];
  }
const ruta: string = 'Data/Ciclo.json'
const contenido: string = fs.readFileSync(ruta, 'utf8');

const datos: sintomas = JSON.parse(contenido);
console.log(datos [0])