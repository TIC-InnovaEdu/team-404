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


document.addEventListener("keydown", (e) => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault(); 
    teclasPresionadas[e.key] = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault();
    teclasPresionadas[e.key] = false;
  }
});

document.addEventListener("keydown", (e) => {  
  teclasPresionadas[e.key] = true;
  if (e.key === "Escape") {
    const juegoVisible = !document.getElementById("pantalla-juego").classList.contains("oculto");
    const nivelesVisible = !document.getElementById("pantalla-niveles").classList.contains("oculto");
    if (!document.getElementById("pantalla-records").classList.contains("oculto")) {
      document.getElementById("pantalla-records").classList.add("oculto");
      document.getElementById("menu-principal").classList.remove("oculto");
    }
    if (juegoVisible || nivelesVisible) {
      volverAlMenu();
    }
  }

});



preCargarSprites(personajeSeleccionado);


function preCargarSprites(nombreArchivo) {
  const baseNombre = nombreArchivo.split(".")[0].toLowerCase();
  const max = spritesPorDireccion[nombreArchivo];
  const direcciones = ["up", "down", "left", "right"];

  imagenesCargadas[baseNombre] = {};

  direcciones.forEach(dir => {
    imagenesCargadas[baseNombre][dir] = [];
    for (let i = 1; i <= max; i++) {
      const img = new Image();
      img.src = Recursos/${baseNombre}${i}${dir}.png;
      imagenesCargadas[baseNombre][dir].push(img);
    }
  });

  const idle = new Image();
  idle.src = Recursos/${baseNombre}Idle.png;
  imagenesCargadas[baseNombre]["idle"] = idle;
}
function mostrarJuego() {
  document.getElementById("menu-principal").classList.add("oculto");
  document.getElementById("pantalla-niveles").classList.add("oculto");
  document.getElementById("pantalla-juego").classList.remove("oculto");
  iniciarNivel(0);
  pausarMusicaFondo();
}

function mostrarRegistro() {
  document.getElementById("login-form").classList.add("oculto");
  document.getElementById("registro-form").classList.remove("oculto");
  pausarMusicaFondo();
}

function mostrarLogin() {
  document.getElementById("registro-form").classList.add("oculto");
  document.getElementById("login-form").classList.remove("oculto");
  pausarMusicaFondo();
}

function volverAlMenu() {
  document.getElementById("pantalla-juego").classList.add("oculto");
  document.getElementById("pantalla-niveles").classList.add("oculto");
  document.getElementById("menu-principal").classList.remove("oculto");
  reproducirMusicaFondo();
}
function salir() {
  document.getElementById("menu-principal").classList.add("oculto");
  document.getElementById("pantalla-inicio").classList.remove("oculto");
  pausarMusicaFondo();
}

function irAlMenu() {
  document.getElementById("pantalla-juego").classList.add("oculto");
  document.getElementById("pantalla-inicio").classList.add("oculto");
  document.getElementById("menu-principal").classList.remove("oculto");
  reproducirMusicaFondo();
}

function mostrarNiveles() {
  document.getElementById("pantalla-juego").classList.add("oculto");
  document.getElementById("menu-principal").classList.add("oculto");
  document.getElementById("pantalla-niveles").classList.remove("oculto");
  reproducirMusicaFondo();
}

function mostrarRecords() {
  document.getElementById("menu-principal").classList.add("oculto");
  document.getElementById("pantalla-records").classList.remove("oculto");
  document.getElementById("records-subtitulo").textContent = "Selecciona un nivel para ver los records.";
  document.getElementById("tabla-records").innerHTML = "";
  reproducirMusicaFondo();
}

function cargarTexturas(nivel) {
  const set = texturasPorNivel[nivel];
  imagenesTexturas[nivel] = {};

  for (let tipo in set) {
    const img = new Image();
    img.src = set[tipo];
    imagenesTexturas[nivel][tipo] = img;
  }
}

function iniciarNivel(nivel) {
  nivelActual = nivel;
  mapa = JSON.parse(JSON.stringify(mapasPorNivel[nivelActual]));
  preguntaActual = preguntasPorNivel[nivelActual];

  let encontrado = false;
  for (let y = 0; y < mapa.length; y++) {
    for (let x = 0; x < mapa[0].length; x++) {
      if (mapa[y][x] === 4) {
        if (!encontrado) {
          posX = x * tileSize + tileSize / 2;
          posY = y * tileSize + tileSize / 2;
          destinoX = posX;
          destinoY = posY;
          encontrado = true;
        }
        mapa[y][x] = 0;
      }
    }
  }

  krisList = [];
  for (let y = 0; y < mapa.length; y++) {
    for (let x = 0; x < mapa[0].length; x++) {
      if (mapa[y][x] === 5) {
        krisList.push({
          x: x * tileSize + tileSize / 2,
          y: y * tileSize + tileSize / 2,
          destinoX: x * tileSize + tileSize / 2,
          destinoY: y * tileSize + tileSize / 2,
          direccion: "down",
          frame: 1,
          moviendo: false,
          velocidad: velocidadKrisPorNivel[nivelActual],
          activo: true,
        });
        mapa[y][x] = 0;
      }
    }
  }

  mostrarPregunta = true;
  preguntaAnim.size = 10;
  preguntaAnim.maxSize = 40;
  preguntaAnim.fase = "creciendo";
  preguntaAnim.done = false;
  preguntaAnim.y = null;
  preguntaAnim.targetY = null;

  const valor = document.getElementById("contador-valor");
  if (valor) {
    valor.textContent = "50s";
    valor.classList.remove("mensaje-final");
    valor.style.color = "#ffffff";
    valor.style.fontSize = "1.3em";
  }

  if (intervaloTiempo) clearInterval(intervaloTiempo);
  tiempoRestante = 50;
  actualizarContador();

  document.getElementById("pantalla-niveles").classList.add("oculto");
  document.getElementById("pantalla-juego").classList.remove("oculto");

  iniciarLoop();
  cargarTexturas(nivel);
}

function cambiarPersonaje(nombre) {
  personajeSeleccionado = nombre;
  document.getElementById("imagen-personaje").src = "Recursos/" + nombre;
  preCargarSprites(nombre);
}

function mostrarRegistro() {
  document.getElementById("login-form").classList.add("oculto");
  document.getElementById("registro-form").classList.remove("oculto");
}

function mostrarLogin() {
  document.getElementById("registro-form").classList.add("oculto");
  document.getElementById("login-form").classList.remove("oculto");
}

function iniciarLoop() {
  const canvas = document.getElementById("canvas-juego");
  const ctx = canvas.getContext("2d");
  canvas.width = tileSize * 32;
  canvas.height = tileSize * mapa.length;

  if (loopID) clearInterval(loopID);

  loopID = setInterval(() => {
    if (!preguntaAnim.done) {
      dibujarMapa(ctx);
      dibujarPreguntaAnimada(ctx);
      return;
    }
    moverPersonaje();
    moverKris();
    actualizarPosicion();
    verificarColisionKris(); 
    dibujarPreguntaAnimada(ctx);
  }, 40);
}

function dibujarPreguntaAnimada(ctx) {
  if (!mostrarPregunta) return;

  const centerX = ctx.canvas.width / 2;
  if (preguntaAnim.y === null) preguntaAnim.y = ctx.canvas.height / 2;

  let fila9 = -1;
  for (let y = mapa.length - 1; y >= 0; y--) {
    if (mapa[y].every(cell => cell === 9)) {
      fila9 = y;
      break;
    }
  }
  if (fila9 === -1) fila9 = mapa.length - 1;

  const targetY = fila9 * tileSize + tileSize / 2 - 24;

  if (preguntaAnim.fase === "creciendo") {
    if (preguntaAnim.size < preguntaAnim.maxSize) {
      preguntaAnim.size += 0.5;
    } else {
      preguntaAnim.fase = "bajando";
      preguntaAnim.targetY = targetY;
    }
  }
  else if (preguntaAnim.fase === "bajando") {
    if (preguntaAnim.y < preguntaAnim.targetY) {
      preguntaAnim.y += 20;
      if (preguntaAnim.y > preguntaAnim.targetY) preguntaAnim.y = preguntaAnim.targetY;
    } else {
      preguntaAnim.fase = "fijo";
      preguntaAnim.done = true;   
      iniciarContador();
    }
  }

  else if (preguntaAnim.fase === "fijo") {
    preguntaAnim.y = preguntaAnim.targetY;
  }

  ctx.save();
  ctx.font = `bold ${preguntaAnim.size}px 'Press Start 2P', Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const texto = preguntaActual;
  const metrics = ctx.measureText(texto);
  const paddingX = 40;
  const paddingY = 28;
  const ancho = metrics.width + paddingX;
  const alto = preguntaAnim.size + paddingY;

  ctx.globalAlpha = 0.92;
  ctx.fillStyle = "#2a003a";
  ctx.strokeStyle = "#00aaff";
  ctx.lineWidth = 4;
  ctx.shadowColor = "#000";
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.roundRect(centerX - ancho / 2, preguntaAnim.y - alto / 2, ancho, alto, 18);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.stroke();

  ctx.lineWidth = 6;
  ctx.strokeStyle = "#1a0033";
  ctx.strokeText(texto, centerX, preguntaAnim.y);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#000";
  ctx.strokeText(texto, centerX, preguntaAnim.y);
  ctx.fillStyle = "#fff";
  ctx.shadowColor = "#00aaff";
  ctx.shadowBlur = 8;
  ctx.fillText(texto, centerX, preguntaAnim.y);
  ctx.restore();
}

function moverPersonaje() {
  if (!preguntaAnim.done) return;
  if (tiempoRestante <= 0) return; 
  if (moviendo) return;

  const col = Math.floor(posX / tileSize);
  const fil = Math.floor(posY / tileSize);

  if (teclasPresionadas["ArrowUp"]) {
    direccion = "up";
    if (puedeMoverJugador(col, fil - 1)) {
      destinoY -= tileSize;
      moviendo = true;
    }
  } else if (teclasPresionadas["ArrowDown"]) {
    direccion = "down";
    if (puedeMoverJugador(col, fil + 1)) {
      destinoY += tileSize;
      moviendo = true;
    }
  } else if (teclasPresionadas["ArrowLeft"]) {
    direccion = "left";
    if (puedeMoverJugador(col - 1, fil)) {
      destinoX -= tileSize;
      moviendo = true;
    }
  } else if (teclasPresionadas["ArrowRight"]) {
    direccion = "right";
    if (puedeMoverJugador(col + 1, fil)) {
      destinoX += tileSize;
      moviendo = true;
    }
  }
}

function puedeMoverJugador(x, y) {
  if (y < 0 || y >= mapa.length || x < 0 || x >= mapa[0].length) return false;
  return mapa[y][x] !== 1;
}

function puedeMoverKris(x, y) {
  if (y < 0 || y >= mapa.length || x < 0 || x >= mapa[0].length) return false;
  return mapa[y][x] !== 1 && mapa[y][x] !== 2 && mapa[y][x] !== 3;
}

function actualizarPosicion() {
  if (!moviendo) return;

  const dx = destinoX - posX;
  const dy = destinoY - posY;

  const antesX = posX;
  const antesY = posY;

  if (Math.abs(dx) > velocidad) posX += velocidad * Math.sign(dx);
  else posX = destinoX;

  if (Math.abs(dy) > velocidad) posY += velocidad * Math.sign(dy);
  else posY = destinoY;

  distanciaDesdeInicio += Math.abs(posX - antesX) + Math.abs(posY - antesY);

  if (posX === destinoX && posY === destinoY) {
    moviendo = false;
    distanciaDesdeInicio = 0;
  }
  const col = Math.floor(posX / tileSize);
  const fil = Math.floor(posY / tileSize);

  krisList.forEach(kris => {
    if (kris.activo) {
      const distKris = Math.abs(posX - kris.x) + Math.abs(posY - kris.y);
      if (distKris < tileSize * 0.7) {
        kris.activo = false;
        terminarJuego("Te atrapó Kris 💀", "#ff4444");
      }
    }
  });

  if (mapa[fil] && mapa[fil][col] === 2) {
    terminarJuego("GAME OVER", "#ff4444");
  } else if (mapa[fil] && mapa[fil][col] === 3) {
    terminarJuego("Has completado el nivel", "#44ff44");
  }

}

function dibujarMapa(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const tex = imagenesTexturas[nivelActual];

  for (let y = 0; y < mapa.length; y++) {
    for (let x = 0; x < mapa[y].length; x++) {
      const valor = mapa[y][x];
      if (valor === 9) continue;
      let usarImagen = false;

      const filasPregunta = 2;

      if (
        x === 0 ||
        y === 0 ||
        x === mapa[0].length - 1 ||
        y === mapa.length - 1 - filasPregunta
      ) {
        if (tex?.bordes?.complete) {
          ctx.drawImage(tex.bordes, x * tileSize, y * tileSize, tileSize, tileSize);
          usarImagen = true;
        }
      } else if ((valor === 0 || valor === 4) && tex?.camino?.complete) {
        ctx.drawImage(tex.camino, x * tileSize, y * tileSize, tileSize, tileSize);
        usarImagen = true;
      } else if (valor === 1 && tex?.colision?.complete) {
        ctx.drawImage(tex.colision, x * tileSize, y * tileSize, tileSize, tileSize);
        usarImagen = true;
      }
    }
  }

  const palabras = palabrasPorNivel[nivelActual];
  let indexPalabra = 0;
  const visitados = new Set();

  for (let y = 0; y < mapa.length; y++) {
    for (let x = 0; x < mapa[y].length; x++) {
      const valor = mapa[y][x];
      if ((valor === 2 || valor === 3) && !visitados.has(`${x},${y}`)) {
        if (indexPalabra >= palabras.length) return;

        for (let dy = 0; dy < 2; dy++) {
          for (let dx = 0; dx < 3; dx++) {
            visitados.add(`${x + dx},${y + dy}`);
          }
        }

        const tiempo = performance.now() / 1000;
        const desplazamiento = Math.sin(tiempo * 2) * 100;

        const grad = ctx.createLinearGradient(
          x * tileSize + desplazamiento,
          y * tileSize,
          (x + 3) * tileSize + desplazamiento,
          (y + 2) * tileSize
        );

        grad.addColorStop(0, "#cccccc");
        grad.addColorStop(0.5, "#b19cd9");
        grad.addColorStop(1, "#aee4ff");

        ctx.fillStyle = grad;
        ctx.fillRect(x * tileSize, y * tileSize, tileSize * 3, tileSize * 2);

        ctx.fillStyle = "#003366";
        ctx.font = `bold ${tileSize * 0.4}px 'Press Start 2P', Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowBlur = 0;
        ctx.fillText(
          palabras[indexPalabra],
          x * tileSize + (tileSize * 3) / 2,
          y * tileSize + tileSize
        );
        ctx.shadowBlur = 0;

        indexPalabra++;
      }
    }
  }

  const ahora = Date.now();
  const baseNombre = personajeSeleccionado.split(".")[0].toLowerCase();
  let img;

  const hayTecla = teclasPresionadas["ArrowUp"] || teclasPresionadas["ArrowDown"] ||
    teclasPresionadas["ArrowLeft"] || teclasPresionadas["ArrowRight"];

  const juegoActivo = preguntaAnim.done && tiempoRestante > 0;

  if ((moviendo || hayTecla) && juegoActivo) {
    if (ahora - ultimoCambioSprite >= tiempoEntreSprites) {
      const max = spritesPorDireccion[personajeSeleccionado];
      frame = frame < max ? frame + 1 : 1;
      ultimoCambioSprite = ahora;
    }
    img = imagenesCargadas[baseNombre]?.[direccion]?.[frame - 1];
  } else {
    frame = 1;
    img = imagenesCargadas[baseNombre]?.["idle"];
  }

  if (img && img.complete) {
    ctx.drawImage(img, posX - tileSize / 2, posY - tileSize / 2, tileSize, tileSize);
  }

  krisList.forEach(kris => {
    if (kris.activo) {
      let krisImg;
      if (kris.moviendo) {
        krisImg = krisSprites["kris"][kris.direccion][kris.frame - 1];
      } else {
        krisImg = krisSprites["kris"]["down"][0];
      }
      if (krisImg && krisImg.complete) {
        ctx.drawImage(krisImg, kris.x - tileSize / 2, kris.y - tileSize / 2, tileSize, tileSize);
      }
    }
  });
}


function iniciarContador() {
  tiempoRestante = 50;
  actualizarContador();

  if (intervaloTiempo) clearInterval(intervaloTiempo);

  intervaloTiempo = setInterval(() => {
    tiempoRestante--;
    actualizarContador();

    if (tiempoRestante <= 0) {
      clearInterval(intervaloTiempo);
      terminarJuego("GAME OVER", "#ff4444"); 
    }
  }, 1000);
}
function actualizarContador() {
  const valor = document.getElementById("contador-valor");
  if (valor) {
    valor.textContent = `${tiempoRestante}s`;
  }
}

function mostrarGameOver() {
  const valor = document.getElementById("contador-valor");
  if (valor) {
    valor.textContent = "GAME OVER 🕹️";
    valor.classList.add("mensaje-final");
    valor.style.color = "#ff4444";
    valor.style.textShadow = "0 0 18px #ff4444, 0 0 32px #fff";
    valor.style.fontSize = "3em";
  }
  mostrarBotonesFinJuego("perder");
}

function terminarJuego(mensaje, color) {
  clearInterval(intervaloTiempo);
  clearInterval(loopID);
  const valor = document.getElementById("contador-valor");
  if (valor) {
    valor.textContent = mensaje;
    valor.style.color = color;
    if (mensaje.includes("Felicidades") || mensaje.includes("Has completado el nivel")) {
      valor.style.fontSize = "1.5em"; 
    } else {
      valor.style.fontSize = "1.8em";
    }
  }
  if (mensaje.includes("Felicidades") || mensaje.includes("Has completado el nivel")) {
    mostrarBotonesFinJuego("ganar");
  } else {
    mostrarBotonesFinJuego("perder");
  }
}

function inicializarBotonesNiveles() {
  const botones = document.querySelectorAll('.nivel-btn');
  botones.forEach(btn => {
    const img = btn.getAttribute('data-img');
    if (img) {
      btn.style.backgroundImage = `url("Recursos/${img}")`;
    }
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-nivel'), 10);
      if (!isNaN(idx)) {
        pausarMusicaFondo(); 
        iniciarNivel(idx);
      }
    });
  });
}

function moverKris() {
  krisList.forEach(kris => {
    if (!kris.activo || !preguntaAnim.done || tiempoRestante <= 0) return;

    if (kris.moviendo) {
      const dx = kris.destinoX - kris.x;
      const dy = kris.destinoY - kris.y;
      if (Math.abs(dx) > kris.velocidad) kris.x += kris.velocidad * Math.sign(dx);
      else kris.x = kris.destinoX;
      if (Math.abs(dy) > kris.velocidad) kris.y += kris.velocidad * Math.sign(dy);
      else kris.y = kris.destinoY;
      if (kris.x === kris.destinoX && kris.y === kris.destinoY) kris.moviendo = false;
      return;
    }

    const col = Math.floor(kris.x / tileSize);
    const fil = Math.floor(kris.y / tileSize);

    let opciones = [];
    if (puedeMoverKris(col, fil - 1)) opciones.push("up");
    if (puedeMoverKris(col, fil + 1)) opciones.push("down");
    if (puedeMoverKris(col - 1, fil)) opciones.push("left");
    if (puedeMoverKris(col + 1, fil)) opciones.push("right");

    if (opciones.length === 0) {
      kris.moviendo = false;
      return;
    }

    if (opciones.length === 1) {
      kris.direccion = opciones[0];
    } else {
      let posibles = opciones.filter(dir => {
        if (kris.direccion === "up" && dir === "down") return false;
        if (kris.direccion === "down" && dir === "up") return false;
        if (kris.direccion === "left" && dir === "right") return false;
        if (kris.direccion === "right" && dir === "left") return false;
        return true;
      });
      kris.direccion = posibles.length ? posibles[Math.floor(Math.random() * posibles.length)] : opciones[Math.floor(Math.random() * opciones.length)];
    }

    let dx = 0, dy = 0;
    if (kris.direccion === "up") dy = -1;
    if (kris.direccion === "down") dy = 1;
    if (kris.direccion === "left") dx = -1;
    if (kris.direccion === "right") dx = 1;
    kris.destinoX = (col + dx) * tileSize + tileSize / 2;
    kris.destinoY = (fil + dy) * tileSize + tileSize / 2;
    kris.moviendo = true;
    kris.frame = kris.frame < 4 ? kris.frame + 1 : 1;
  });
}

function siguientePasoBFS(kris) {
  const start = [Math.floor(kris.x / tileSize), Math.floor(kris.y / tileSize)];
  const end = [Math.floor(posX / tileSize), Math.floor(posY / tileSize)];
  const queue = [start];
  const visited = {};
  visited[start.join(",")] = null;

  while (queue.length > 0) {
    const [cx, cy] = queue.shift();
    if (cx === end[0] && cy === end[1]) break;
    [
      [0, -1, "up"],
      [0, 1, "down"],
      [-1, 0, "left"],
      [1, 0, "right"]
    ].forEach(([dx, dy, dir]) => {
      const nx = cx + dx, ny = cy + dy;
      if (
        nx >= 0 && ny >= 0 &&
        ny < mapa.length && nx < mapa[0].length &&
        puedeMoverKris(nx, ny) &&
        !visited[`${nx},${ny}`]
      ) {
        visited[`${nx},${ny}`] = [cx, cy, dir];
        queue.push([nx, ny]);
      }
    });
  }

  let path = [];
  let cur = end;
  while (visited[cur.join(",")]) {
    path.unshift(cur);
    cur = visited[cur.join(",")].slice(0, 2);
  }
  if (path.length > 1) {
    const [nx, ny] = path[1];
    const dir = visited[path[1].join(",")][2];
    return { nx, ny, dir };
  }
  return null;
}

function verificarColisionKris() {
  krisList.forEach(kris => {
    if (kris.activo) {
      const distKris = Math.abs(posX - kris.x) + Math.abs(posY - kris.y);
      if (distKris < tileSize * 0.7) {
        kris.activo = false;
        terminarJuego("💀 Te atrapó Kris 💀", "#ff4444");
      }
    }
  });
}

function mostrarBotonesFinJuego(tipo) {
  const contenedor = document.getElementById("botones-fin-juego");
  const btnNiveles = document.getElementById("btn-niveles");
  const btnMenu = document.getElementById("btn-menu");
  const btnReintentar = document.getElementById("btn-reintentar");
  const btnSiguiente = document.getElementById("btn-siguiente");

  contenedor.classList.remove("oculto");
  btnNiveles.classList.remove("oculto");
  btnMenu.classList.remove("oculto");

  if (tipo === "perder") {
    btnReintentar.classList.remove("oculto");
    btnSiguiente.classList.add("oculto");
  } else if (tipo === "ganar") {
    btnReintentar.classList.add("oculto");
    btnSiguiente.classList.remove("oculto");
  }
}

function ocultarBotonesFinJuego() {
  document.getElementById("botones-fin-juego").classList.add("oculto");
}

document.getElementById("btn-niveles").onclick = function () {
  ocultarBotonesFinJuego();
  mostrarNiveles();
};
document.getElementById("btn-menu").onclick = function () {
  ocultarBotonesFinJuego();
  volverAlMenu();
};
document.getElementById("btn-reintentar").onclick = function () {
  ocultarBotonesFinJuego();
  iniciarNivel(nivelActual);
};
document.getElementById("btn-siguiente").onclick = function () {
  ocultarBotonesFinJuego();
  if (nivelActual < mapasPorNivel.length - 1) {
    iniciarNivel(nivelActual + 1);
  } else {
    volverAlMenu();
  }
};

function volverAlMenuDesdeRecords() {
  document.getElementById("pantalla-records").classList.add("oculto");
  document.getElementById("menu-principal").classList.remove("oculto");
}

function verRecordsNivel(nivel) {
  document.getElementById("tabla-records").innerHTML =
    `<p class="subtitulo-dificultad">Records del nivel ${nivel + 1}:</p>
     <p>(Aquí se mostrarán los 5 mejores tiempos)</p>`;
}

function reproducirMusicaFondo() {
  if (musicaFondo && musicaFondo.paused) {
    musicaFondo.currentTime = 0;
    musicaFondo.play();
  }
}

function pausarMusicaFondo() {
  if (!musicaFondo.paused) {
    musicaFondo.pause();
    musicaFondo.currentTime = 0;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  musicaFondo = document.getElementById("musica-fondo");
});

function entrarANivel(idx) {
  pausarMusicaFondo();
  iniciarNivel(idx);
}

inicializarBotonesNiveles();

const mapasPorNivel = [
  // Dificultad facil
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 3, 3, 3, 1],
    [1, 2, 2, 2, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 3, 3, 3, 1],
    [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 5, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 5, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 4, 4, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 4, 4, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 2, 2, 2, 1],
    [1, 2, 2, 2, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
  ],
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
    [1, 0, 1, 1, 2, 2, 2, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 5, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 5, 0, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 2, 2, 2, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
  ],
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1],
    [1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 5, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 0, 0, 0, 3, 3, 3, 1, 5, 1, 0, 1, 4, 4, 1, 0, 1, 5, 1, 2, 2, 2, 0, 0, 0, 2, 2, 2, 1],
    [1, 2, 2, 2, 0, 0, 0, 3, 3, 3, 1, 0, 1, 0, 1, 4, 4, 1, 0, 1, 0, 1, 2, 2, 2, 0, 0, 0, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1],
    [1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
  ],
  // Dificultad medio
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 2, 2, 2, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 2, 2, 2, 1, 0, 1],
    [1, 0, 1, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 5, 0, 1, 1, 1, 1, 1, 1, 1, 0, 4, 4, 0, 1, 1, 1, 1, 1, 1, 1, 0, 5, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 4, 4, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 3, 3, 3, 1, 0, 1],
    [1, 0, 1, 2, 2, 2, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 3, 3, 3, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
  ],
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 1, 1, 1, 1, 1, 1, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 3, 3, 3, 1, 1, 1, 1, 1, 1, 2, 2, 2, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 1, 1, 1, 1, 5, 0, 1, 0, 1, 0, 0, 4, 4, 0, 0, 1, 0, 1, 0, 5, 1, 1, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 4, 4, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
  ],
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1],
    [1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1],
    [1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1],
    [1, 2, 2, 2, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 2, 2, 2, 1],
    [1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 0, 5, 0, 0, 1, 1, 1, 0, 0, 0, 4, 4, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 4, 4, 0, 0, 0, 1, 1, 1, 0, 0, 5, 0, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 1],
    [1, 2, 2, 2, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 3, 3, 3, 1],
    [1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1],
    [1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1],
    [1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1],
    [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
  ],
  // Dificultad dificil
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 5, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 1, 2, 2, 2, 1, 5, 1, 0, 3, 3, 3, 1, 4, 4, 1, 2, 2, 2, 0, 1, 5, 1, 2, 2, 2, 1, 0, 0, 1],
    [1, 0, 0, 1, 2, 2, 2, 1, 0, 1, 0, 3, 3, 3, 1, 4, 4, 1, 2, 2, 2, 0, 1, 0, 1, 2, 2, 2, 1, 0, 0, 1],
    [1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 5, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
  ],
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 1],
    [1, 2, 2, 2, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 5, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 5, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 4, 4, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 4, 4, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 5, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 5, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1],
    [1, 3, 3, 3, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 2, 2, 2, 1],
    [1, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
  ],
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 1, 5, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1],
    [1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1],
    [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 1, 0, 0, 1, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 0, 0, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 5, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1],
    [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 0, 0, 1, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 1, 0, 0, 1, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1],
    [1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 5, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
  ]
];
