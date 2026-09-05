import type {CiclosMenstruales} from "./types.js"
import * as fs from 'fs';
/* [
  {
    "id": 0,
    "inicio": "2026-08-06",
    "duracion": 4
  },
  {
    "id": 1,
    "inicio": "2026-07-06",
    "duracion": 6
  },
  {
    "id": 0,
    "inicio": "2026-09-01",
    "duracion": 5
  }
]*/
function duracionCiclos (Ciclos: CiclosMenstruales, idusuario: number) : number[] {
    let dias: number []= []
    for (let i:number =0; i<Ciclos.length; i++) {
        if (Ciclos[i]?.id===idusuario) {
            dias.push(Ciclos[i]?.duracion as number)
        }
        else {}
    }
    return dias
}

function inicioCiclos (Ciclos: CiclosMenstruales, idusuario: number) : number [] {
    let dias: number []= []
    let dia: Date | number | null = null
    let tiempo: number = 0
    for (let i:number =0; i<Ciclos.length; i++) {
        if (Ciclos[i]?.id===idusuario) {
            dia = new Date (Ciclos[i]?.inicio as string) //Aca los dias que son tipo string en el json pasan a ser type Date
            dia = dia.getTime () //los dias que estan en type date pasan ahora a ser el tiempo transcurrido desde el 1/1/1970
            dias.push(dia as number)
        }
        else {}
    }
    dias.sort ((a, b) => a-b) // Esta función lo que hace es que solo sort toma el array como string (0, 1, 2, 3 … 8, 9, a, b) por lo que el 10 quedaría adelante del 2, entonces al hacer (a,b) => a-b se fija con cada par de números consecutivos en el array y hace la resta, si el resultado es negativo (a < b), coloca a antes que b.Si el resultado es positivo (a > b), coloca b antes que a. Si es cero, los deja en la misma posición. Hasta que el array quede ordenado
    return dias
}

function DuracionProximo (anteriores: number[]): number | null {
    let proximo: number = 0
    let proximaduracion: number | null = 0
    for (let i:number =0; i<anteriores.length; i++) {
        proximo = proximo + anteriores[i]!
    }
    if (anteriores.length>0) {
        proximaduracion= proximo/anteriores.length
        let sincoma= Math.floor(proximaduracion)
        if (proximaduracion-sincoma<0.5) {
            proximaduracion = sincoma
        }
        else {
            proximaduracion = sincoma+1
        }
    }
    else {
        proximaduracion = null
        console.log ("No hay ciclos anteriores")
    }
    return proximaduracion
}
function InicioProximo (anteriores: number []) : void {
    let diferencia: number = 0
    let FechaInicio: any = 0
    if (anteriores.length>=2) {
    for (let i: number = 0; i<anteriores.length && i+1<anteriores.length ; i++) {
        diferencia= diferencia + (anteriores[i+1]!-anteriores[i]!)
    }
    console.log (diferencia)
    diferencia= diferencia/(anteriores.length-1)
    console.log (diferencia)
    FechaInicio= Math.floor((anteriores[anteriores.length-1]!)+diferencia)
    FechaInicio= new Date (FechaInicio)
    console.log (FechaInicio)
    }
}
let Contenido = fs.readFileSync('../../Data/ciclos.json', 'utf8')
let Ciclos = JSON.parse(Contenido) as CiclosMenstruales
let id: number = 0
let DuracionCiclos: number[]= duracionCiclos (Ciclos, id)
let InicioCiclos: number []= inicioCiclos (Ciclos, id)
console.log (DuracionCiclos)
console.log (InicioCiclos)
let proximoTiempo: number | null = DuracionProximo (DuracionCiclos)
console.log (proximoTiempo)
InicioProximo (InicioCiclos)