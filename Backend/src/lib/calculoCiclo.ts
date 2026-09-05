import type {CiclosMenstruales} from "./types.js"
import * as fs from 'fs';
/* [
  {
    "id": 0,
    "inicio": "2026-08-06",
    "duracion": 4
  },
  {
    "id": 0,
    "inicio": "2026-09-01",
    "duracion": 4
  }
]*/
function duracionCiclos (Ciclos: CiclosMenstruales, idusuario: number) : void {
    let dias: number []= []
    for (let i:number =0; i<Ciclos.length; i++) {
        if (Ciclos[i]?.id===idusuario) {
            dias.push(Ciclos[i]?.duracion as number)
        }
        else {}
    }
    console.log (dias)
}

function inicioCiclos (Ciclos: CiclosMenstruales, idusuario: number) : void {
    let dias: Date []= []
    let dia: Date | null = null
    for (let i:number =0; i<Ciclos.length; i++) {
        if (Ciclos[i]?.id===idusuario) {
            dia = new Date (Ciclos[i]?.inicio as string)
            dias.push(dia as Date)
        }
        else {}
    }
    console.log (dias)
}

let Contenido = fs.readFileSync('../../Data/ciclos.json', 'utf8')
let Ciclos = JSON.parse(Contenido) as CiclosMenstruales

inicioCiclos (Ciclos, 0)