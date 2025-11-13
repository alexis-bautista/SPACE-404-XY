// Estado de documentación de controles
import { loader } from "../../engine/loader.js";

class ControlsState {
  constructor(canvas, stateManager) {
    this.canvas = canvas;
    this.stateManager = stateManager;

    // Posición del botón back
    this.buttons = {
      back: { x: 0, y: 0, width: 0, height: 0 },
    };
  }

  enter() {
    console.log("Entrando a pantalla de controles");
  }

  update(dt) {
    // No requiere actualización
  }

  render(ctx) {
    // 1. Dibujar fondo desenfocado
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

    // 2. Dibujar imagen de documentación de controles
    const controlesDoc = loader.getImage("controles_doc");
    if (controlesDoc) {
      const docX = (this.canvas.width - controlesDoc.width) / 2;
      const docY = (this.canvas.height - controlesDoc.height) / 2;
      ctx.drawImage(controlesDoc, docX, docY);
    }

    // 3. Botón Back
    const backBtn = loader.getImage("back");
    if (backBtn) {
      const backX = 20;
      const backY = 20;
      const newWidth = backBtn.width * 2.5;
      const newHeight = backBtn.height * 2.5;
      ctx.drawImage(backBtn, backX, backY, newWidth, newHeight);
      this.buttons.back = {
        x: backX,
        y: backY,
        width: newWidth,
        height: newHeight,
      };
    }
  }

  exit() {
    console.log("Saliendo de pantalla de controles");
  }

  // Manejar clics
  handleClick(x, y) {
    // Verificar clic en Back
    if (
      x >= this.buttons.back.x &&
      x <= this.buttons.back.x + this.buttons.back.width &&
      y >= this.buttons.back.y &&
      y <= this.buttons.back.y + this.buttons.back.height
    ) {
      console.log("Botón Back presionado - Regresando a configuración");
      this.stateManager.setState("settings");
      return "back";
    }

    return null;
  }

  // Manejar teclas del teclado
  handleKeyDown(key) {
    if (key === "Escape") {
      console.log("Tecla Escape presionada - Regresando a configuración");
      this.stateManager.setState("settings");
    }
  }
}

export default ControlsState;
