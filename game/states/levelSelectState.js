// Estado de selección de niveles
import { loader } from "../../engine/loader.js";

class LevelSelectState {
  constructor(canvas, stateManager) {
    this.canvas = canvas;
    this.stateManager = stateManager;
    this.levels = [
      { id: 1, x: 150, y: 200, width: 64, height: 64 },
      { id: 2, x: 400, y: 200, width: 64, height: 64 },
      { id: 3, x: 650, y: 200, width: 64, height: 64 },
    ];
    // Áreas de botones
    this.buttons = {
      back: { x: 0, y: 0, width: 0, height: 0 },
      sound: { x: 0, y: 0, width: 0, height: 0 },
    };
  }

  enter() {
    console.log("Entrando a selección de niveles");
  }

  update(dt) {
    // TODO: lógica de selección de niveles
  }

  render(ctx) {
    // 1. Dibujar imagen de fondo
    const fondoDesenfocado = loader.getImage("fondo_desenfocado");
    if (fondoDesenfocado) {
      ctx.drawImage(
        fondoDesenfocado,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
    }

    // 2. Título
    ctx.fillStyle = "#eee";
    ctx.font = "36px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("Selecciona un Nivel", this.canvas.width / 2, 100);

    // 3. Dibujar niveles
    const nivel1 = loader.getImage("nivel1");
    const nivel2 = loader.getImage("nivel2");
    const nivel3 = loader.getImage("nivel3");

    if (nivel1) {
      ctx.drawImage(
        nivel1,
        this.levels[0].x,
        this.levels[0].y,
        this.levels[0].width,
        this.levels[0].height
      );
    }

    if (nivel2) {
      ctx.drawImage(
        nivel2,
        this.levels[1].x,
        this.levels[1].y,
        this.levels[1].width,
        this.levels[1].height
      );
    }

    if (nivel3) {
      ctx.drawImage(
        nivel3,
        this.levels[2].x,
        this.levels[2].y,
        this.levels[2].width,
        this.levels[2].height
      );
    }

    // 4. Etiquetas de niveles
    ctx.font = "20px system-ui";
    ctx.fillStyle = "#fff";
    ctx.fillText("Nivel 1", this.levels[0].x + 32, this.levels[0].y + 90);
    ctx.fillText("Nivel 2", this.levels[1].x + 32, this.levels[1].y + 90);
    ctx.fillText("Nivel 3", this.levels[2].x + 32, this.levels[2].y + 90);

    // 5. Botón Back
    const backBtn = loader.getImage("back");
    if (backBtn) {
      const backX = 20;
      const backY = 20;
      const newWidth = backBtn.width * 2.5;
      const newHeight = backBtn.height * 2.5;
      ctx.drawImage(backBtn, backX, backY, newWidth, newHeight);
      // Guardar posición para detección de clics
      this.buttons.back = {
        x: backX,
        y: backY,
        width: newWidth,
        height: newHeight,
      };
    }

    // 6. Botón Sound
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

  exit() {
    console.log("Saliendo de selección de niveles");
  }

  // Verificar si se hizo clic en un nivel o botón
  handleClick(x, y) {
    // Verificar clic en botón Back
    if (
      x >= this.buttons.back.x &&
      x <= this.buttons.back.x + this.buttons.back.width &&
      y >= this.buttons.back.y &&
      y <= this.buttons.back.y + this.buttons.back.height
    ) {
      console.log("Botón Back presionado - Regresando al menú");
      this.stateManager.setState("menu");
      return "back";
    }

    // Verificar clic en botón Sound
    if (
      x >= this.buttons.sound.x &&
      x <= this.buttons.sound.x + this.buttons.sound.width &&
      y >= this.buttons.sound.y &&
      y <= this.buttons.sound.y + this.buttons.sound.height
    ) {
      console.log("Botón Sound presionado");
      return "sound";
    }

    // Verificar clic en niveles
    for (let level of this.levels) {
      if (
        x >= level.x &&
        x <= level.x + level.width &&
        y >= level.y &&
        y <= level.y + level.height
      ) {
        console.log(`Nivel ${level.id} seleccionado`);
        // Cambiar al estado del nivel correspondiente
        if (level.id === 1) {
          this.stateManager.setState("level1");
        } else if (level.id === 2) {
          this.stateManager.setState("level2");
        } else if (level.id === 3) {
          this.stateManager.setState("level3");
        }
        return level.id;
      }
    }
    return null;
  }

  // Manejar teclas del teclado
  handleKeyDown(key) {
    if (key === "Escape") {
      console.log("Tecla Escape presionada - Regresando al menú");
      this.stateManager.setState("menu");
    }
  }
}

export default LevelSelectState;
