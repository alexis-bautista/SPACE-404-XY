// Punto de entrada del juego
import { loader } from "./engine/loader.js";
import StateManager from "./engine/stateManager.js";
import PerformanceMonitor from "./game/utils/performanceMonitor.js";
import LoadingState from "./game/states/loadingState.js";
import MenuState from "./game/states/menuState.js";
import LevelSelectState from "./game/states/levelSelectState.js";
import SettingsState from "./game/states/settingsState.js";
import ControlsState from "./game/states/controlsState.js";
import Level1State from "./game/states/level1State.js";
import Level2State from "./game/states/level2State.js";
import Level3State from "./game/states/level3State.js";
import PauseState from "./game/states/pauseState.js";
import GameOverState from "./game/states/gameOverState.js";
import LevelCompleteState from "./game/states/levelCompleteState.js";
import HudConfigState from "./game/states/hudConfigState.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let last = 0;

// Monitor de rendimiento
const performanceMonitor = new PerformanceMonitor();
window.performanceMonitor = performanceMonitor; // Accesible desde consola

// Tamaño base del juego (resolución de diseño)
const BASE_WIDTH = 960;
const BASE_HEIGHT = 540;

// Escala actual del canvas
let canvasScale = 1;

// Configurar el tamaño del canvas para que se adapte a la ventana manteniendo proporción
function resizeCanvas() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  
  // Calcular la escala para mantener la proporción 16:9
  const scaleX = windowWidth / BASE_WIDTH;
  const scaleY = windowHeight / BASE_HEIGHT;
  canvasScale = Math.min(scaleX, scaleY);
  
  // Establecer el tamaño lógico del canvas (siempre el mismo)
  canvas.width = BASE_WIDTH;
  canvas.height = BASE_HEIGHT;
  
  // Escalar visualmente el canvas con CSS
  canvas.style.width = (BASE_WIDTH * canvasScale) + 'px';
  canvas.style.height = (BASE_HEIGHT * canvasScale) + 'px';
}

// Ajustar el canvas al cargar y al cambiar el tamaño de la ventana
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Configuración global del juego
window.gameConfig = {
  soundEffectsEnabled: true,
  musicEnabled: true,
  effectsVolume: 0.3,
  contrast: 1.0 // Valor de 0.0 a 2.0 (100% es el normal)
};

// Crear contexto de audio para efectos generados
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Función para reproducir sonido láser generado
function playGeneratedLaserSound() {
  const duration = 0.15;
  const startFrequency = 1200;
  const endFrequency = 200;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(startFrequency, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(endFrequency, audioContext.currentTime + duration);
  
  // Usar el volumen configurado
  const volume = window.gameConfig.effectsVolume || 0.3;
  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}

// Función para reproducir efectos de sonido
window.playSoundEffect = function(soundId) {
  if (!window.gameConfig.soundEffectsEnabled) {
    return; // No reproducir si están desactivados
  }
  
  // Para el sonido láser, usar Web Audio API (no requiere archivo)
  if (soundId === 'laserSound') {
    playGeneratedLaserSound();
    return;
  }
  
  // Para otros sonidos, usar elementos de audio HTML
  const sound = document.getElementById(soundId);
  if (sound) {
    // Reiniciar el sonido si ya está reproduciéndose
    sound.currentTime = 0;
    const volume = window.gameConfig.effectsVolume || 0.3;
    sound.volume = volume;
    sound.play().catch(err => {
      console.log('Error reproduciendo efecto de sonido:', err);
    });
  }
};

// Crear el gestor de estados
const stateManager = new StateManager();

// Crear e inicializar los estados
const loadingState = new LoadingState(canvas);
const menuState = new MenuState(canvas, stateManager);
const levelSelectState = new LevelSelectState(canvas, stateManager);
const settingsState = new SettingsState(canvas, stateManager);
const controlsState = new ControlsState(canvas, stateManager);
const level1State = new Level1State(canvas, stateManager);
const level2State = new Level2State(canvas, stateManager);
const level3State = new Level3State(canvas, stateManager);
const pauseState = new PauseState(canvas, stateManager);
const gameOverState = new GameOverState(canvas, stateManager);
const levelCompleteState = new LevelCompleteState(canvas, stateManager);
const hudConfigState = new HudConfigState(canvas, stateManager);

// Registrar estados
stateManager.addState("loading", loadingState);
stateManager.addState("menu", menuState);
stateManager.addState("levelSelect", levelSelectState);
stateManager.addState("settings", settingsState);
stateManager.addState("controls", controlsState);
stateManager.addState("level1", level1State);
stateManager.addState("level2", level2State);
stateManager.addState("level3", level3State);
stateManager.addState("pause", pauseState);
stateManager.addState("gameOver", gameOverState);
stateManager.addState("levelComplete", levelCompleteState);
stateManager.addState("hudConfig", hudConfigState);

// Iniciar en el estado de carga
stateManager.setState("loading");

// Cargar assets
async function loadAssets() {
  try {
    await loader.loadImages({
      titulo: "assets/images/icons/titulo.png",
      fondo_carga: "assets/images/fondos/fondo_pantalla_carga.jpg",
      fondo_desenfocado: "assets/images/fondos/fondo_pantalla_desenfocado.jpg",
      play: "assets/images/icons/play.png",
      settings: "assets/images/icons/settings.png",
      sound: "assets/images/icons/sound.png",
      back: "assets/images/icons/back.png",
      atras: "assets/images/icons/atras.png",
      menu: "assets/images/icons/menu.png",
      nivel1: "assets/images/icons/nivel1.jpg",
      nivel2: "assets/images/icons/nivel2.jpg",
      nivel3: "assets/images/icons/nivel3.jpg",
      controles: "assets/images/icons/controles.png",
      dificultad: "assets/images/icons/dificultad.png",
      musica: "assets/images/icons/musica.png",
      efectos_sonido: "assets/images/icons/efectos_sonido.png",
      controles_doc: "assets/images/icons/controles_doc.png",
      reanudar: "assets/images/icons/reanudar.png",
      reiniciar: "assets/images/icons/reiniciar.png",
      menu_principal: "assets/images/icons/menu_principal.png",
      siguiente_nivel: "assets/images/icons/siguiente_nivel.png",
    });
    console.log("Assets cargados correctamente");
    
    // Cambiar al estado del menú cuando termine la carga
    stateManager.setState("menu");
  } catch (error) {
    console.error("Error cargando assets:", error);
  }
}

// Loop principal del juego
function loop(ts) {
  const dt = (ts - last) / 1000;
  last = ts;

  // Actualizar monitor de rendimiento
  performanceMonitor.update(ts);

  // Actualizar el estado actual
  stateManager.update(dt);

  // Limpiar canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Renderizar el estado actual
  stateManager.render(ctx);

  // Renderizar monitor de rendimiento
  performanceMonitor.render(ctx);

  requestAnimationFrame(loop);
}

// Manejar clics en el canvas
canvas.addEventListener("mousedown", (event) => {
  const rect = canvas.getBoundingClientRect();
  
  // Ajustar las coordenadas del clic según la escala
  const scaleX = BASE_WIDTH / rect.width;
  const scaleY = BASE_HEIGHT / rect.height;
  
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;

  // Delegar el clic al estado actual
  const currentState = stateManager.getCurrentState();
  if (currentState && currentState.handleClick) {
    currentState.handleClick(x, y);
  }
});

// Manejar movimiento del mouse para arrastrar sliders
canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  
  // Ajustar las coordenadas según la escala
  const scaleX = BASE_WIDTH / rect.width;
  const scaleY = BASE_HEIGHT / rect.height;
  
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;

  // Delegar el movimiento al estado actual
  const currentState = stateManager.getCurrentState();
  if (currentState && currentState.handleMouseMove) {
    currentState.handleMouseMove(x, y);
  }
});

// Detectar cuando se suelta el mouse
canvas.addEventListener("mouseup", () => {
  const currentState = stateManager.getCurrentState();
  if (currentState && currentState.handleMouseUp) {
    currentState.handleMouseUp();
  }
});

// Manejar teclas del teclado
document.addEventListener("keydown", (event) => {
  // Atajos para el monitor de rendimiento
  if (event.key === 'F3') {
    event.preventDefault();
    performanceMonitor.toggle();
  } else if (event.key === 'F4') {
    event.preventDefault();
    performanceMonitor.toggleDetailed();
  } else if (event.key === 'F5' && event.ctrlKey) {
    event.preventDefault();
    performanceMonitor.printReport();
  }

  // Delegar el evento de teclado al estado actual
  const currentState = stateManager.getCurrentState();
  if (currentState && currentState.handleKeyDown) {
    currentState.handleKeyDown(event.key);
  }
});

document.addEventListener("keyup", (event) => {
  // Delegar el evento de teclado al estado actual
  const currentState = stateManager.getCurrentState();
  if (currentState && currentState.handleKeyUp) {
    currentState.handleKeyUp(event.key);
  }
});

// ========== CONTROLES TÁCTILES ==========

// Manejar eventos táctiles (touchstart)
canvas.addEventListener("touchstart", (event) => {
  event.preventDefault(); // Prevenir scroll y zoom
  const rect = canvas.getBoundingClientRect();
  const scaleX = BASE_WIDTH / rect.width;
  const scaleY = BASE_HEIGHT / rect.height;

  for (let i = 0; i < event.changedTouches.length; i++) {
    const touch = event.changedTouches[i];
    const x = (touch.clientX - rect.left) * scaleX;
    const y = (touch.clientY - rect.top) * scaleY;
    const touchId = touch.identifier;

    const currentState = stateManager.getCurrentState();
    if (currentState && currentState.handleTouchStart) {
      currentState.handleTouchStart(x, y, touchId);
    }
  }
});

// Manejar movimiento táctil (touchmove)
canvas.addEventListener("touchmove", (event) => {
  event.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const scaleX = BASE_WIDTH / rect.width;
  const scaleY = BASE_HEIGHT / rect.height;

  for (let i = 0; i < event.changedTouches.length; i++) {
    const touch = event.changedTouches[i];
    const x = (touch.clientX - rect.left) * scaleX;
    const y = (touch.clientY - rect.top) * scaleY;
    const touchId = touch.identifier;

    const currentState = stateManager.getCurrentState();
    if (currentState && currentState.handleTouchMove) {
      currentState.handleTouchMove(x, y, touchId);
    }
  }
});

// Manejar fin del toque (touchend)
canvas.addEventListener("touchend", (event) => {
  event.preventDefault();

  for (let i = 0; i < event.changedTouches.length; i++) {
    const touch = event.changedTouches[i];
    const touchId = touch.identifier;

    const currentState = stateManager.getCurrentState();
    if (currentState && currentState.handleTouchEnd) {
      currentState.handleTouchEnd(touchId);
    }
  }
});

// Manejar cancelación de toque (touchcancel)
canvas.addEventListener("touchcancel", (event) => {
  event.preventDefault();

  for (let i = 0; i < event.changedTouches.length; i++) {
    const touch = event.changedTouches[i];
    const touchId = touch.identifier;

    const currentState = stateManager.getCurrentState();
    if (currentState && currentState.handleTouchEnd) {
      currentState.handleTouchEnd(touchId);
    }
  }
});

// Iniciar carga de assets y loop del juego
loadAssets();
requestAnimationFrame(loop);
