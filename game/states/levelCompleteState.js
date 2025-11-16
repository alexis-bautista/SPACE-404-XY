// Estado de Nivel Completado
import { loader } from "../../engine/loader.js";

class LevelCompleteState {
  constructor(canvas, stateManager) {
    this.canvas = canvas;
    this.stateManager = stateManager;

    // Estado del nivel de fondo (congelado)
    this.backgroundState = null;
    this.backgroundStateName = "";
    this.currentLevel = 1; // Nivel actual completado

    // Posiciones de botones
    this.buttons = {
      siguienteNivel: { x: 0, y: 0, width: 0, height: 0 },
      reiniciar: { x: 0, y: 0, width: 0, height: 0 },
      menuPrincipal: { x: 0, y: 0, width: 0, height: 0 },
    };
  }

  enter() {
    console.log("Entrando a Level Complete");
    
    // Reproducir sonido de victoria
    if (window.playSoundEffect) {
      window.playSoundEffect('winSound');
    }
    
    // Pausar música del juego
    const gameMusic = document.getElementById('gameMusic');
    if (gameMusic) {
      gameMusic.pause();
    }
  }

  update(dt) {
    // No hay animaciones por ahora
  }

  // Configurar el estado de fondo (el nivel actual)
  setBackgroundState(state, stateName, level) {
    this.backgroundState = state;
    this.backgroundStateName = stateName;
    this.currentLevel = level || 1;
  }

  render(ctx) {
    // 1. Renderizar el estado de fondo (el nivel congelado)
    if (this.backgroundState) {
      this.backgroundState.render(ctx);
    }

    // 2. Overlay oscuro semitransparente
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Verificar si es el nivel 3 (último nivel)
    if (this.currentLevel === 3) {
      this.renderGameComplete(ctx);
    } else {
      this.renderLevelComplete(ctx);
    }
  }

  // Renderizar pantalla de nivel completado (niveles 1 y 2)
  renderLevelComplete(ctx) {
    // 3. Panel central para el menú de nivel completado
    const panelWidth = 600;
    const panelHeight = 450;
    const panelX = (this.canvas.width - panelWidth) / 2;
    const panelY = (this.canvas.height - panelHeight) / 2;

    this.drawRoundedRect(ctx, panelX, panelY, panelWidth, panelHeight, 20);

    // 4. Título "NIVEL COMPLETADO"
    ctx.fillStyle = "#4bd";
    ctx.font = "bold 42px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("NIVEL COMPLETADO", this.canvas.width / 2, panelY + 70);

    // 5. Mensaje de felicitación
    ctx.fillStyle = "#eee";
    ctx.font = "20px system-ui";
    ctx.fillText(
      "¡Felicidades! Has destruido todas las naves enemigas",
      this.canvas.width / 2,
      panelY + 120
    );

    // Posiciones centrales para los botones
    const centerX = this.canvas.width / 2;
    const startY = panelY + 170;
    const spacing = 80;

    // 6. Botón Siguiente Nivel
    const siguienteNivelBtn = loader.getImage("siguiente_nivel");
    if (siguienteNivelBtn) {
      const btnX = centerX - siguienteNivelBtn.width / 2;
      const btnY = startY;
      ctx.drawImage(siguienteNivelBtn, btnX, btnY);
      this.buttons.siguienteNivel = {
        x: btnX,
        y: btnY,
        width: siguienteNivelBtn.width,
        height: siguienteNivelBtn.height,
      };
    }

    // 7. Botón Reiniciar
    const reiniciarBtn = loader.getImage("reiniciar");
    if (reiniciarBtn) {
      const btnX = centerX - reiniciarBtn.width / 2;
      const btnY = startY + spacing;
      ctx.drawImage(reiniciarBtn, btnX, btnY);
      this.buttons.reiniciar = {
        x: btnX,
        y: btnY,
        width: reiniciarBtn.width,
        height: reiniciarBtn.height,
      };
    }

    // 8. Botón Menú Principal
    const menuPrincipalBtn = loader.getImage("menu_principal");
    if (menuPrincipalBtn) {
      const btnX = centerX - menuPrincipalBtn.width / 2;
      const btnY = startY + spacing * 2;
      ctx.drawImage(menuPrincipalBtn, btnX, btnY);
      this.buttons.menuPrincipal = {
        x: btnX,
        y: btnY,
        width: menuPrincipalBtn.width,
        height: menuPrincipalBtn.height,
      };
    }

    // 9. Indicación de tecla ESC
    ctx.fillStyle = "#aaa";
    ctx.font = "14px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(
      "Presiona ESC para volver a la selección de niveles",
      this.canvas.width / 2,
      panelY + panelHeight - 20
    );
  }

  // Renderizar pantalla de juego completado (nivel 3)
  renderGameComplete(ctx) {
    // Panel central más grande
    const panelWidth = 700;
    const panelHeight = 500;
    const panelX = (this.canvas.width - panelWidth) / 2;
    const panelY = (this.canvas.height - panelHeight) / 2;

    this.drawRoundedRect(ctx, panelX, panelY, panelWidth, panelHeight, 20);

    // Título "JUEGO COMPLETADO" en dorado
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 48px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("JUEGO COMPLETADO", this.canvas.width / 2, panelY + 80);

    // Mensaje de victoria en dos líneas
    ctx.fillStyle = "#4bd";
    ctx.font = "bold 28px system-ui";
    ctx.fillText("¡Felicidades!", this.canvas.width / 2, panelY + 150);

    ctx.fillStyle = "#eee";
    ctx.font = "24px system-ui";
    ctx.fillText(
      "Has vengado a la Tierra",
      this.canvas.width / 2,
      panelY + 190
    );

    // Estrellas decorativas
    ctx.fillStyle = "#FFD700";
    ctx.font = "40px system-ui";
    ctx.fillText("★ ★ ★", this.canvas.width / 2, panelY + 240);

    // Posiciones centrales para los botones
    const centerX = this.canvas.width / 2;
    const startY = panelY + 290;
    const spacing = 80;

    // Ocultar botón siguiente nivel para nivel 3
    this.buttons.siguienteNivel = { x: -1000, y: -1000, width: 0, height: 0 };

    // Botón Reiniciar
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

    // Botón Menú Principal
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

    // Indicación de tecla ESC
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
    console.log("Saliendo de Level Complete");
  }

  handleClick(x, y) {
    // Botón Siguiente Nivel
    if (
      x >= this.buttons.siguienteNivel.x &&
      x <= this.buttons.siguienteNivel.x + this.buttons.siguienteNivel.width &&
      y >= this.buttons.siguienteNivel.y &&
      y <= this.buttons.siguienteNivel.y + this.buttons.siguienteNivel.height
    ) {
      console.log("Avanzando al siguiente nivel");

      // Determinar el siguiente nivel
      const nextLevel = this.currentLevel + 1;

      // Verificar si hay más niveles disponibles
      if (nextLevel > 3) {
        console.log("No hay más niveles disponibles");
        this.stateManager.setState("levelSelect");
      } else if (nextLevel === 2) {
        // Ir al nivel 2
        console.log("Cargando Nivel 2");
        this.stateManager.setState("level2");
      } else if (nextLevel === 3) {
        // Ir al nivel 3
        console.log("Cargando Nivel 3");
        this.stateManager.setState("level3");
      }

      return "siguienteNivel";
    }

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

export default LevelCompleteState;
