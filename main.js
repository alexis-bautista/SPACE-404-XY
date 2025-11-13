// Punto de entrada del juego
import { loader } from "./engine/loader.js";
import StateManager from "./engine/stateManager.js";
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

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let last = 0;

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

  // Actualizar el estado actual
  stateManager.update(dt);

  // Limpiar canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Renderizar el estado actual
  stateManager.render(ctx);

  requestAnimationFrame(loop);
}

// Manejar clics en el canvas
canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Delegar el clic al estado actual
  const currentState = stateManager.getCurrentState();
  if (currentState && currentState.handleClick) {
    currentState.handleClick(x, y);
  }
});

// Manejar teclas del teclado
document.addEventListener("keydown", (event) => {
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

// Iniciar carga de assets y loop del juego
loadAssets();
requestAnimationFrame(loop);
