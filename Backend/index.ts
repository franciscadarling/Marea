import * as fs from 'fs';
import { stringify } from 'querystring';

type tablas = {
    infogeneral: {
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
    }[];
  
    sintomas: {
      id: number;
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
    }[];
  
    educacion: {
      id: number;
      articulo: number;
      leido: boolean;
    }[];
  
    fechas: {
      id: number;
      fechasDeMenstruacion: string[];
    }[];
  }
const ruta: string = './tablas.json'
const contenido: string = fs.readFileSync(ruta, 'utf8');

const datos: tablas = JSON.parse(contenido);

console.log(datos.fechas[0]!.fechasDeMenstruacion)