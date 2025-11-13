// Estado del menú principal
import { loader } from "../../engine/loader.js";

class MenuState {
  constructor(canvas, stateManager) {
    this.canvas = canvas;
    this.stateManager = stateManager;
    // Definir áreas de botones
    this.buttons = {
      play: { x: 0, y: 0, width: 0, height: 0 },
      settings: { x: 0, y: 0, width: 0, height: 0 },
      sound: { x: 0, y: 0, width: 0, height: 0 },
    };
  }

  enter() {
    console.log("Entrando al menú principal");
  }

  update(dt) {
    // TODO: lógica del menú (detectar clics en botones, etc.)
  }

  render(ctx) {
    // 1. Dibujar imagen de fondo
    const fondoCarga = loader.getImage("fondo_carga");
    if (fondoCarga) {
      ctx.drawImage(fondoCarga, 0, 0, this.canvas.width, this.canvas.height);
    }

    // 2. Título del juego
    const tituloImg = loader.getImage("titulo");
    if (tituloImg) {
      const tituloX = (this.canvas.width - tituloImg.width) / 2;
      const tituloY = -25;
      ctx.drawImage(tituloImg, tituloX, tituloY);
    }

    // 3. Botón Play
    const playBtn = loader.getImage("play");
    if (playBtn) {
      const playX = this.canvas.width - playBtn.width - 50;
      const playY = this.canvas.height / 2 - 100;
      ctx.drawImage(playBtn, playX, playY);
      // Guardar posición para detección de clics
      this.buttons.play = {
        x: playX,
        y: playY,
        width: playBtn.width,
        height: playBtn.height,
      };
    }

    // 4. Botón Settings
    const settingsBtn = loader.getImage("settings");
    if (settingsBtn) {
      const settingsX = this.canvas.width - settingsBtn.width - 50;
      const settingsY = this.canvas.height / 2 + 20;
      ctx.drawImage(settingsBtn, settingsX, settingsY);
      // Guardar posición para detección de clics
      this.buttons.settings = {
        x: settingsX,
        y: settingsY,
        width: settingsBtn.width,
        height: settingsBtn.height,
      };
    }

    // 5. Botón Sound
    const soundBtn = loader.getImage("sound");
    if (soundBtn) {
      const soundX = 20;
      const soundY = this.canvas.height - soundBtn.height * 2.5 - 20;
      const newWidth = soundBtn.width * 2.5;
      const newHeight = soundBtn.height * 2.5;
      ctx.drawImage(soundBtn, soundX, soundY, newWidth, newHeight);
      // Guardar posición para detección de clics
      this.buttons.sound = {
        x: soundX,
        y: soundY,
        width: newWidth,
        height: newHeight,
      };
    }
  }

  // Manejar clics en los botones
  handleClick(x, y) {
    // Verificar si se hizo clic en Play
    if (
      x >= this.buttons.play.x &&
      x <= this.buttons.play.x + this.buttons.play.width &&
      y >= this.buttons.play.y &&
      y <= this.buttons.play.y + this.buttons.play.height
    ) {
      console.log("Botón Play presionado");
      this.stateManager.setState("levelSelect");
      return "play";
    }

    // Verificar si se hizo clic en Settings
    if (
      x >= this.buttons.settings.x &&
      x <= this.buttons.settings.x + this.buttons.settings.width &&
      y >= this.buttons.settings.y &&
      y <= this.buttons.settings.y + this.buttons.settings.height
    ) {
      console.log("Botón Settings presionado");
      this.stateManager.setState("settings");
      return "settings";
    }

    // Verificar si se hizo clic en Sound
    if (
      x >= this.buttons.sound.x &&
      x <= this.buttons.sound.x + this.buttons.sound.width &&
      y >= this.buttons.sound.y &&
      y <= this.buttons.sound.y + this.buttons.sound.height
    ) {
      console.log("Botón Sound presionado");
      return "sound";
    }

    return null;
  }

  exit() {
    console.log("Saliendo del menú principal");
  }
}

export default MenuState;
