let nivelActual = 0;
let mapa = [];
const tileSize = 48;

const spritesPorDireccion = {
  "pikachu.png": 3,
  "luigi.png": 8,
  "cuphead.png": 9,
};

let personajeSeleccionado = "pikachu.png";
let direccion = "down";
let frame = 1;
let posX = 0;
let posY = 0;
let destinoX = 0;
let destinoY = 0;
let moviendo = false;
let distanciaDesdeInicio = 0;
const imagenesCargadas = {};

const texturasPorNivel = [
  { 
    bordes: "Recursos/bosque_arbol.png",
    camino: "Recursos/bosque_tierra.png",
    colision: "Recursos/bosque_arbusto.png"
  },
  { 
    bordes: "Recursos/dulce_arbol.png",
    camino: "Recursos/dulce_tierra.png",
    colision: "Recursos/dulce_baston.png"
  },
  { 
    bordes: "Recursos/playa_agua.png",
    camino: "Recursos/playa_arena.png",
    colision: "Recursos/playa_roca.png"
  },
  { 
    bordes: "Recursos/bosque_arbol.png",
    camino: "Recursos/bosque_tierra.png",
    colision: "Recursos/bosque_arbusto.png"
  },
  { 
    bordes: "Recursos/antartida_hielo.png",
    camino: "Recursos/antartida_nieve.png",
    colision: "Recursos/antartida_pico.png"
  },
  { 
    bordes: "Recursos/cementerio_calavera.png",
    camino: "Recursos/cementerio_tierra.png",
    colision: "Recursos/cementerio_lapida.png"
  },
  { 
    bordes: "Recursos/bosque_arbol.png",
    camino: "Recursos/bosque_tierra.png",
    colision: "Recursos/bosque_arbusto.png"
  },
  { 
    bordes: "Recursos/dulce_arbol.png",
    camino: "Recursos/dulce_tierra.png",
    colision: "Recursos/dulce_baston.png"
  },
  { 
    bordes: "Recursos/nether_lava.png",
    camino: "Recursos/nether_camino.png",
    colision: "Recursos/nether_roca.png"
  },
];

const imagenesTexturas = [];

let preguntaAnim = {
  size: 10,
  maxSize: 40,
  y: null,
  targetY: null,
  fase: "creciendo", 
  done: false
};
let mostrarPregunta = false;

let preguntaActual = "";

const preguntasPorNivel = [
  "¿Cuál de estas palabras es aguda?",
  "¿Cuál de estas palabras es grave?",
  "¿Cuál de estas palabras es esdrujula?",
  "¿Cuál de estas palabras es grave?",
  "¿Cuál de estas palabras es aguda?",
  "¿Cuál de estas palabras es esdrujula?",
  "¿Cuál de estas palabras es aguda?",
  "¿Cuál de estas palabras es esdrujula?",
  "¿Cuál de estas palabras es grave?",
];

//palabras al azar para probar (no se identifica si es correcta o incorrecta)
const palabrasPorNivel = [
  ["Palabra", "Arena", "Mar", "Ola"],             
  ["Perro", "Gato", "Pez", "Loro"],           
  ["Rojo", "Verde", "Azul", "Amarillo"],       
  ["Manzana", "Pera", "Uva", "Sandía"],        
  ["Luna", "Sol", "Estrella", "Nube"],          
  ["Uno", "Dos", "Tres", "Cuatro"],            
  ["Fútbol", "Tenis", "Golf", "Natación"],      
  ["Carro", "Bici", "Avión", "Tren"],           
  ["Casa", "Escuela", "Parque", "Hospital"],    
];

let ultimoCambioSprite = Date.now();
const tiempoEntreSprites = 60;
const velocidad = 6;
let loopID = null;
let tiempoRestante = 30;
let intervaloTiempo = null;
let teclasPresionadas = {};


let krisList = [];

const krisSprites = {};
function preCargarKrisSprites() {
  const dirs = ["up", "down", "left", "right"];
  krisSprites["kris"] = {};
  dirs.forEach(dir => {
    krisSprites["kris"][dir] = [];
    for (let i = 1; i <= 4; i++) {
      const img = new Image();
      img.src = `Recursos/Kris${i}${dir}.png`;
      krisSprites["kris"][dir].push(img);
    }
  });
}
preCargarKrisSprites();

const velocidadKrisPorNivel = [
  4,
  4, 
  5, 
  5, 
  5, 
  6,
  6, 
  6, 
  7  
];
