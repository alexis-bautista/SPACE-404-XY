// Estado de configuración
import { loader } from "../../engine/loader.js";

class SettingsState {
  constructor(canvas, stateManager) {
    this.canvas = canvas;
    this.stateManager = stateManager;

    // Configuraciones del juego
    this.settings = {
      difficulty: "medio", // facil, medio, dificil
      music: true, // true = encendido, false = apagado
      soundEffects: true, // true = encendido, false = apagado
    };

    // Posiciones de botones
    this.buttons = {
      controles: { x: 0, y: 0, width: 0, height: 0 },
      dificultad: { x: 0, y: 0, width: 0, height: 0 },
      musica: { x: 0, y: 0, width: 0, height: 0 },
      efectos_sonido: { x: 0, y: 0, width: 0, height: 0 },
      back: { x: 0, y: 0, width: 0, height: 0 },
    };
  }

  enter() {
    console.log("Entrando a configuración");
  }

  update(dt) {
    // Lógica de actualización si es necesaria
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

    // 2. Título
    ctx.fillStyle = "#eee";
    ctx.font = "42px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("CONFIGURACIÓN", this.canvas.width / 2, 80);

    // Posiciones centrales para los botones
    const centerX = this.canvas.width / 2;
    const startY = 135;
    const spacing = 80;

    // 3. Botón Controles (centrado)
    const controlesBtn = loader.getImage("controles");
    if (controlesBtn) {
      const btnX = centerX - controlesBtn.width / 2;
      const btnY = startY;
      ctx.drawImage(controlesBtn, btnX, btnY);
      this.buttons.controles = {
        x: btnX,
        y: btnY,
        width: controlesBtn.width,
        height: controlesBtn.height,
      };
    }

    // 4. Botón Dificultad
    const dificultadBtn = loader.getImage("dificultad");
    if (dificultadBtn) {
      const btnX = centerX - dificultadBtn.width / 2;
      const btnY = startY + spacing;
      ctx.drawImage(dificultadBtn, btnX, btnY);
      this.buttons.dificultad = {
        x: btnX,
        y: btnY,
        width: dificultadBtn.width,
        height: dificultadBtn.height,
      };

      // Texto de dificultad
      ctx.font = "24px system-ui";
      ctx.fillStyle = "#ffd700";
      ctx.textAlign = "left";
      ctx.fillText(
        this.settings.difficulty.toUpperCase(),
        btnX + dificultadBtn.width + 20,
        btnY + dificultadBtn.height / 2 + 8
      );
    }

    // 5. Botón Música
    const musicaBtn = loader.getImage("musica");
    if (musicaBtn) {
      const btnX = centerX - musicaBtn.width / 2;
      const btnY = startY + spacing * 2;
      ctx.drawImage(musicaBtn, btnX, btnY);
      this.buttons.musica = {
        x: btnX,
        y: btnY,
        width: musicaBtn.width,
        height: musicaBtn.height,
      };

      // Texto de estado al lado derecho
      const estadoMusica = this.settings.music ? "ENCENDIDO" : "APAGADO";
      ctx.fillStyle = this.settings.music ? "#00ff00" : "#ff0000";
      ctx.fillText(
        estadoMusica,
        btnX + musicaBtn.width + 20,
        btnY + musicaBtn.height / 2 + 8
      );
    }

    // 6. Botón Efectos de Sonido
    const efectosBtn = loader.getImage("efectos_sonido");
    if (efectosBtn) {
      const btnX = centerX - efectosBtn.width / 2;
      const btnY = startY + spacing * 3;
      ctx.drawImage(efectosBtn, btnX, btnY);
      this.buttons.efectos_sonido = {
        x: btnX,
        y: btnY,
        width: efectosBtn.width,
        height: efectosBtn.height,
      };

      // Texto de estado al lado derecho
      const estadoEfectos = this.settings.soundEffects
        ? "ENCENDIDO"
        : "APAGADO";
      ctx.fillStyle = this.settings.soundEffects ? "#00ff00" : "#ff0000";
      ctx.fillText(
        estadoEfectos,
        btnX + efectosBtn.width + 20,
        btnY + efectosBtn.height / 2 + 8
      );
    }

    // 7. Botón Back (esquina superior izquierda, tamaño 2.5x)
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
    console.log("Saliendo de configuración");
  }

  // Manejar clics en botones
  handleClick(x, y) {
    // Verificar clic en Back
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

    // Verificar clic en Controles
    if (
      x >= this.buttons.controles.x &&
      x <= this.buttons.controles.x + this.buttons.controles.width &&
      y >= this.buttons.controles.y &&
      y <= this.buttons.controles.y + this.buttons.controles.height
    ) {
      console.log("Botón Controles presionado");
      this.stateManager.setState("controls");
      return "controles";
    }

    // Verificar clic en Dificultad
    if (
      x >= this.buttons.dificultad.x &&
      x <= this.buttons.dificultad.x + this.buttons.dificultad.width &&
      y >= this.buttons.dificultad.y &&
      y <= this.buttons.dificultad.y + this.buttons.dificultad.height
    ) {
      // Ciclar entre dificultades
      if (this.settings.difficulty === "facil") {
        this.settings.difficulty = "medio";
      } else if (this.settings.difficulty === "medio") {
        this.settings.difficulty = "dificil";
      } else {
        this.settings.difficulty = "facil";
      }
      console.log(`Dificultad cambiada a: ${this.settings.difficulty}`);
      return "dificultad";
    }

    // Verificar clic en Música
    if (
      x >= this.buttons.musica.x &&
      x <= this.buttons.musica.x + this.buttons.musica.width &&
      y >= this.buttons.musica.y &&
      y <= this.buttons.musica.y + this.buttons.musica.height
    ) {
      this.settings.music = !this.settings.music;
      console.log(`Música: ${this.settings.music ? "Encendida" : "Apagada"}`);
      // TODO: Implementar control de música real
      return "musica";
    }

    // Verificar clic en Efectos de Sonido
    if (
      x >= this.buttons.efectos_sonido.x &&
      x <= this.buttons.efectos_sonido.x + this.buttons.efectos_sonido.width &&
      y >= this.buttons.efectos_sonido.y &&
      y <= this.buttons.efectos_sonido.y + this.buttons.efectos_sonido.height
    ) {
      this.settings.soundEffects = !this.settings.soundEffects;
      console.log(
        `Efectos: ${this.settings.soundEffects ? "Encendidos" : "Apagados"}`
      );
      // TODO: Implementar control de efectos real
      return "efectos_sonido";
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

  // Obtener configuraciones actuales
  getSettings() {
    return this.settings;
  }
}

export default SettingsState;
