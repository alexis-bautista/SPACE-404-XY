// Estado de Game Over
import { loader } from "../../engine/loader.js";

class GameOverState {
  constructor(canvas, stateManager) {
    this.canvas = canvas;
    this.stateManager = stateManager;

    // Estado del nivel de fondo (congelado)
    this.backgroundState = null;
    this.backgroundStateName = "";

    // Posiciones de botones
    this.buttons = {
      reiniciar: { x: 0, y: 0, width: 0, height: 0 },
      menuPrincipal: { x: 0, y: 0, width: 0, height: 0 },
    };
  }

  enter() {
    console.log("Entrando a Game Over");
  }

  update(dt) {
    // No hay animaciones por ahora
  }

  // Configurar el estado de fondo (el nivel actual)
  setBackgroundState(state, stateName) {
    this.backgroundState = state;
    this.backgroundStateName = stateName;
  }

  render(ctx) {
    // 1. Renderizar el estado de fondo (el nivel congelado)
    if (this.backgroundState) {
      this.backgroundState.render(ctx);
    }

    // 2. Overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 3. Panel para el menú de game over
    const panelWidth = 600;
    const panelHeight = 400;
    const panelX = (this.canvas.width - panelWidth) / 2;
    const panelY = (this.canvas.height - panelHeight) / 2;

    this.drawRoundedRect(ctx, panelX, panelY, panelWidth, panelHeight, 20);

    // 4. Título "GAME OVER"
    ctx.fillStyle = "#f00";
    ctx.font = "bold 48px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", this.canvas.width / 2, panelY + 80);

    // 5. Mensaje adicional
    ctx.fillStyle = "#eee";
    ctx.font = "20px system-ui";
    ctx.fillText(
      "Tu nave ha sido destruida",
      this.canvas.width / 2,
      panelY + 130
    );

    // Posiciones centrales para los botones
    const centerX = this.canvas.width / 2;
    const startY = panelY + 180;
    const spacing = 80;

    // 6. Botón Reiniciar
    const reiniciarBtn = loader.getImage("reiniciar");
    if (reiniciarBtn) {
      const btnX = centerX - reiniciarBtn.width / 2;
      const btnY = startY;
      ctx.drawImage(reiniciarBtn, btnX, btnY);
      this.buttons.reiniciar = {
        x: btnX,
        y: btnY,
        width: reiniciarBtn.width,
        height: reiniciarBtn.height,
      };
    }

    // 7. Botón Menú Principal
    const menuPrincipalBtn = loader.getImage("menu_principal");
    if (menuPrincipalBtn) {
      const btnX = centerX - menuPrincipalBtn.width / 2;
      const btnY = startY + spacing;
      ctx.drawImage(menuPrincipalBtn, btnX, btnY);
      this.buttons.menuPrincipal = {
        x: btnX,
        y: btnY,
        width: menuPrincipalBtn.width,
        height: menuPrincipalBtn.height,
      };
    }

    // 8. Indicación de tecla ESC
    ctx.fillStyle = "#aaa";
    ctx.font = "14px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(
      "Presiona ESC para volver a la selección de niveles",
      this.canvas.width / 2,
      panelY + panelHeight - 20
    );
  }

  // Función auxiliar para dibujar rectángulos con bordes redondeados
  drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.fillStyle = "rgba(20, 20, 30, 0.95)";
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();

    // Borde
    ctx.strokeStyle = "#4bd";
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  exit() {
    console.log("Saliendo de Game Over");
  }

  handleClick(x, y) {
    // Botón Reiniciar
    if (
      x >= this.buttons.reiniciar.x &&
      x <= this.buttons.reiniciar.x + this.buttons.reiniciar.width &&
      y >= this.buttons.reiniciar.y &&
      y <= this.buttons.reiniciar.y + this.buttons.reiniciar.height
    ) {
      console.log("Reiniciando nivel");
      if (
        this.backgroundState &&
        typeof this.backgroundState.restart === "function"
      ) {
        this.backgroundState.restart();
      }
      this.stateManager.setState(this.backgroundStateName);
      return "reiniciar";
    }

    // Botón Menú Principal
    if (
      x >= this.buttons.menuPrincipal.x &&
      x <= this.buttons.menuPrincipal.x + this.buttons.menuPrincipal.width &&
      y >= this.buttons.menuPrincipal.y &&
      y <= this.buttons.menuPrincipal.y + this.buttons.menuPrincipal.height
    ) {
      console.log("Regresando al menú principal");

      // Resetear el nivel antes de ir al menú principal
      if (
        this.backgroundState &&
        typeof this.backgroundState.restart === "function"
      ) {
        this.backgroundState.restart();
      }

      this.stateManager.setState("menu");
      return "menuPrincipal";
    }

    return null;
  }

  handleKeyDown(key) {
    // Presionar ESC para volver a la selección de niveles
    if (key === "Escape") {
      console.log("Regresando a la selección de niveles");

      // Resetear el nivel antes de salir
      if (
        this.backgroundState &&
        typeof this.backgroundState.restart === "function"
      ) {
        this.backgroundState.restart();
      }

      this.stateManager.setState("levelSelect");
    }
  }
}

export default GameOverState;
