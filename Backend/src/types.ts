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
  
  export type Users = InfoGral []
  
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
  
  export type Sintomas = Sintoma []
  
  type Edu = {
    id: number;
    articulo: number;
    leido: boolean;
  }
  
  export type Educacion = Edu []
  
type Ciclo = {
    id: number;
    inicio: string;
    duracion: number
  }
  
  export type CiclosMenstruales = Ciclo  []
  
  type tablas = {
      infogeneral: InfoGral[];
    
      sintomas: Sintoma[];
    
      educacion: Edu[];
    
      fechas: Ciclo[];
    }