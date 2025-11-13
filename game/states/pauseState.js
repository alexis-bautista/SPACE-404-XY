// Estado de Pausa - Siguiendo principios de Pro HTML5 Games
import { loader } from "../../engine/loader.js";

class PauseState {
  constructor(canvas, stateManager) {
    this.canvas = canvas;
    this.stateManager = stateManager;
    this.backgroundState = null; // Estado que está detrás (el juego)
    this.previousState = "level1"; // Estado al que volver cuando se reanude

    // Configuración del panel de pausa
    this.panel = {
      x: 0,
      y: 0,
      width: 400,
      height: 450,
      cornerRadius: 20,
      backgroundColor: "rgba(50, 50, 50, 0.95)",
    };

    // Botones del menú de pausa
    this.buttons = {
      reanudar: { x: 0, y: 0, width: 0, height: 0 },
      reiniciar: { x: 0, y: 0, width: 0, height: 0 },
      settings: { x: 0, y: 0, width: 0, height: 0 },
      menuPrincipal: { x: 0, y: 0, width: 0, height: 0 },
    };

    // Estado del submenú (null, 'settings', 'controls')
    this.subMenuState = null;

    // Configuraciones copiadas de settingsState
    this.settings = {
      difficulty: "medio",
      music: true,
      soundEffects: true,
    };

    // Botones de settings cuando está en submenú
    this.settingsButtons = {
      controles: { x: 0, y: 0, width: 0, height: 0 },
      musica: { x: 0, y: 0, width: 0, height: 0 },
      efectos_sonido: { x: 0, y: 0, width: 0, height: 0 },
      atras: { x: 0, y: 0, width: 0, height: 0 },
    };
  }

  // Establecer el estado que está siendo pausado
  setBackgroundState(state, stateName) {
    this.backgroundState = state;
    this.previousState = stateName;
  }

  enter() {
    console.log("Juego pausado");
    this.subMenuState = null;
  }

  update(dt) {
    // No actualizar el estado de fondo mientras está pausado
  }

  render(ctx) {
    // 1. Renderizar el juego de fondo (estado pausado)
    if (this.backgroundState && this.backgroundState.render) {
      this.backgroundState.render(ctx);
    }

    // 2. Overlay oscuro semi-transparente sobre el juego
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 3. Decidir qué renderizar según el submenú
    if (this.subMenuState === "settings") {
      this.renderSettingsMenu(ctx);
    } else if (this.subMenuState === "controls") {
      this.renderControlsMenu(ctx);
    } else {
      this.renderPauseMenu(ctx);
    }
  }

  renderPauseMenu(ctx) {
    // Calcular posición central del panel
    this.panel.x = (this.canvas.width - this.panel.width) / 2;
    this.panel.y = (this.canvas.height - this.panel.height) / 2;

    // Dibujar panel con esquinas redondeadas
    this.drawRoundedRect(
      ctx,
      this.panel.x,
      this.panel.y,
      this.panel.width,
      this.panel.height,
      this.panel.cornerRadius,
      this.panel.backgroundColor
    );

    // Título "PAUSA"
    ctx.fillStyle = "#fff";
    ctx.font = "bold 48px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("PAUSA", this.canvas.width / 2, this.panel.y + 70);

    // Posiciones de los botones dentro del panel
    const centerX = this.canvas.width / 2;
    const startY = this.panel.y + 75;
    const spacing = 80;

    // Botón Reanudar
    const reanudarBtn = loader.getImage("reanudar");
    if (reanudarBtn) {
      const btnX = centerX - reanudarBtn.width / 2;
      const btnY = startY;
      ctx.drawImage(reanudarBtn, btnX, btnY);
      this.buttons.reanudar = {
        x: btnX,
        y: btnY,
        width: reanudarBtn.width,
        height: reanudarBtn.height,
      };
    }

    // Botón Reiniciar
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

    // Botón Settings
    const settingsBtn = loader.getImage("settings");
    if (settingsBtn) {
      const btnX = centerX - settingsBtn.width / 2;
      const btnY = startY + spacing * 2;
      ctx.drawImage(settingsBtn, btnX, btnY);
      this.buttons.settings = {
        x: btnX,
        y: btnY,
        width: settingsBtn.width,
        height: settingsBtn.height,
      };
    }

    // Botón Menú Principal
    const menuPrincipalBtn = loader.getImage("menu_principal");
    if (menuPrincipalBtn) {
      const btnX = centerX - menuPrincipalBtn.width / 2;
      const btnY = startY + spacing * 3;
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
    ctx.font = "16px system-ui";
    ctx.fillText(
      "Presiona ESC para reanudar",
      this.canvas.width / 2,
      this.panel.y + this.panel.height - 20
    );
  }

  renderSettingsMenu(ctx) {
    // Panel para settings (sin dificultad)
    const settingsPanel = {
      x: (this.canvas.width - 500) / 2,
      y: (this.canvas.height - 450) / 2,
      width: 550,
      height: 450,
    };

    // Dibujar panel con esquinas redondeadas
    this.drawRoundedRect(
      ctx,
      settingsPanel.x,
      settingsPanel.y,
      settingsPanel.width,
      settingsPanel.height,
      this.panel.cornerRadius,
      this.panel.backgroundColor
    );

    // Título "CONFIGURACIÓN"
    ctx.fillStyle = "#fff";
    ctx.font = "bold 36px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("CONFIGURACIÓN", this.canvas.width / 2, settingsPanel.y + 60);

    // Posiciones centrales para los botones
    const centerX = this.canvas.width / 2;
    const startY = settingsPanel.y + 75;
    const spacing = 80;

    // Botón Controles
    const controlesBtn = loader.getImage("controles");
    if (controlesBtn) {
      const btnX = centerX - controlesBtn.width / 2;
      const btnY = startY;
      ctx.drawImage(controlesBtn, btnX, btnY);
      this.settingsButtons.controles = {
        x: btnX,
        y: btnY,
        width: controlesBtn.width,
        height: controlesBtn.height,
      };
    }

    // Botón Música
    const musicaBtn = loader.getImage("musica");
    if (musicaBtn) {
      const btnX = centerX - musicaBtn.width / 2;
      const btnY = startY + spacing;
      ctx.drawImage(musicaBtn, btnX, btnY);
      this.settingsButtons.musica = {
        x: btnX,
        y: btnY,
        width: musicaBtn.width,
        height: musicaBtn.height,
      };

      // Texto de estado
      ctx.font = "20px system-ui";
      ctx.textAlign = "left";
      const estadoMusica = this.settings.music ? "ENCENDIDO" : "APAGADO";
      ctx.fillStyle = this.settings.music ? "#00ff00" : "#ff0000";
      ctx.fillText(
        estadoMusica,
        btnX + musicaBtn.width + 15,
        btnY + musicaBtn.height / 2 + 6
      );
    }

    // Botón Efectos de Sonido
    const efectosBtn = loader.getImage("efectos_sonido");
    if (efectosBtn) {
      const btnX = centerX - efectosBtn.width / 2;
      const btnY = startY + spacing * 2;
      ctx.drawImage(efectosBtn, btnX, btnY);
      this.settingsButtons.efectos_sonido = {
        x: btnX,
        y: btnY,
        width: efectosBtn.width,
        height: efectosBtn.height,
      };

      // Texto de estado
      const estadoEfectos = this.settings.soundEffects
        ? "ENCENDIDO"
        : "APAGADO";
      ctx.fillStyle = this.settings.soundEffects ? "#00ff00" : "#ff0000";
      ctx.fillText(
        estadoEfectos,
        btnX + efectosBtn.width + 15,
        btnY + efectosBtn.height / 2 + 6
      );
    }

    // Botón Atrás
    const atrasBtn = loader.getImage("atras");
    if (atrasBtn) {
      const btnX = centerX - atrasBtn.width / 2;
      const btnY = startY + spacing * 3;
      ctx.drawImage(atrasBtn, btnX, btnY);
      this.settingsButtons.atras = {
        x: btnX,
        y: btnY,
        width: atrasBtn.width,
        height: atrasBtn.height,
      };
    }

    // Indicación de tecla ESC
    ctx.fillStyle = "#aaa";
    ctx.font = "14px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(
      "Presiona ESC para volver al menú de pausa",
      this.canvas.width / 2,
      settingsPanel.y + settingsPanel.height - 15
    );
  }

  renderControlsMenu(ctx) {
    // Panel para mostrar la imagen de controles
    const controlsPanel = {
      x: (this.canvas.width - 700) / 2,
      y: (this.canvas.height - 500) / 2,
      width: 700,
      height: 500,
    };

    // Dibujar panel con esquinas redondeadas
    this.drawRoundedRect(
      ctx,
      controlsPanel.x,
      controlsPanel.y,
      controlsPanel.width,
      controlsPanel.height,
      this.panel.cornerRadius,
      this.panel.backgroundColor
    );

    // Título "CONTROLES"
    ctx.fillStyle = "#fff";
    ctx.font = "bold 36px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("CONTROLES", this.canvas.width / 2, controlsPanel.y + 50);

    // Mostrar imagen de controles_doc
    const controlesDoc = loader.getImage("controles_doc");
    if (controlesDoc) {
      // Calcular dimensiones para mantener proporción dentro del panel
      const maxWidth = controlsPanel.width - 80;
      const maxHeight = controlsPanel.height - 180;

      let imgWidth = controlesDoc.width;
      let imgHeight = controlesDoc.height;

      // Escalar si es necesario
      if (imgWidth > maxWidth || imgHeight > maxHeight) {
        const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
        imgWidth *= scale;
        imgHeight *= scale;
      }

      const imgX = (this.canvas.width - imgWidth) / 2;
      const imgY = controlsPanel.y + 60;

      ctx.drawImage(controlesDoc, imgX, imgY, imgWidth, imgHeight);
    }

    // Botón Atrás en la parte inferior
    const atrasBtn = loader.getImage("atras");
    if (atrasBtn) {
      const btnX = this.canvas.width / 2 - atrasBtn.width / 2;
      const btnY =
        controlsPanel.y + controlsPanel.height - atrasBtn.height - 20;
      ctx.drawImage(atrasBtn, btnX, btnY);

      // Guardar posición para detección de clics
      this.settingsButtons.atras = {
        x: btnX,
        y: btnY,
        width: atrasBtn.width,
        height: atrasBtn.height,
      };
    }

    // Indicación de tecla ESC
    ctx.fillStyle = "#aaa";
    ctx.font = "14px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(
      "Presiona ESC para volver",
      this.canvas.width / 2,
      controlsPanel.y + controlsPanel.height - 5
    );
  }

  // Función auxiliar para dibujar rectángulos con esquinas redondeadas
  drawRoundedRect(ctx, x, y, width, height, radius, fillColor) {
    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
    ctx.fill();

    // Borde sutil
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  exit() {
    console.log("Saliendo del menú de pausa");
  }

  handleClick(x, y) {
    // Si estamos en el submenú de controles
    if (this.subMenuState === "controls") {
      return this.handleControlsClick(x, y);
    }

    // Si estamos en el submenú de settings
    if (this.subMenuState === "settings") {
      return this.handleSettingsClick(x, y);
    }

    // Manejo de clics en el menú de pausa principal
    // Botón Reanudar
    if (
      x >= this.buttons.reanudar.x &&
      x <= this.buttons.reanudar.x + this.buttons.reanudar.width &&
      y >= this.buttons.reanudar.y &&
      y <= this.buttons.reanudar.y + this.buttons.reanudar.height
    ) {
      console.log("Reanudando juego");
      this.stateManager.setState(this.previousState);
      return "reanudar";
    }

    // Botón Reiniciar
    if (
      x >= this.buttons.reiniciar.x &&
      x <= this.buttons.reiniciar.x + this.buttons.reiniciar.width &&
      y >= this.buttons.reiniciar.y &&
      y <= this.buttons.reiniciar.y + this.buttons.reiniciar.height
    ) {
      console.log("Reiniciando nivel");
      // Reiniciar el nivel actual ANTES de cambiar de estado
      if (
        this.backgroundState &&
        typeof this.backgroundState.restart === "function"
      ) {
        this.backgroundState.restart();
      }
      this.stateManager.setState(this.previousState);
      return "reiniciar";
    }

    // Botón Settings
    if (
      x >= this.buttons.settings.x &&
      x <= this.buttons.settings.x + this.buttons.settings.width &&
      y >= this.buttons.settings.y &&
      y <= this.buttons.settings.y + this.buttons.settings.height
    ) {
      console.log("Abriendo configuración desde pausa");
      this.subMenuState = "settings";
      return "settings";
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

  handleControlsClick(x, y) {
    // Botón Atrás en la pantalla de controles
    if (
      x >= this.settingsButtons.atras.x &&
      x <= this.settingsButtons.atras.x + this.settingsButtons.atras.width &&
      y >= this.settingsButtons.atras.y &&
      y <= this.settingsButtons.atras.y + this.settingsButtons.atras.height
    ) {
      console.log("Regresando al menú de configuración");
      this.subMenuState = "settings";
      return "atras";
    }
    return null;
  }

  handleSettingsClick(x, y) {
    // Botón Atrás
    if (
      x >= this.settingsButtons.atras.x &&
      x <= this.settingsButtons.atras.x + this.settingsButtons.atras.width &&
      y >= this.settingsButtons.atras.y &&
      y <= this.settingsButtons.atras.y + this.settingsButtons.atras.height
    ) {
      console.log("Regresando al menú de pausa");
      this.subMenuState = null;
      return "atras";
    }

    // Botón Controles
    if (
      x >= this.settingsButtons.controles.x &&
      x <=
        this.settingsButtons.controles.x +
          this.settingsButtons.controles.width &&
      y >= this.settingsButtons.controles.y &&
      y <=
        this.settingsButtons.controles.y + this.settingsButtons.controles.height
    ) {
      console.log("Mostrando controles");
      this.subMenuState = "controls";
      return "controles";
    }

    // Botón Música
    if (
      x >= this.settingsButtons.musica.x &&
      x <= this.settingsButtons.musica.x + this.settingsButtons.musica.width &&
      y >= this.settingsButtons.musica.y &&
      y <= this.settingsButtons.musica.y + this.settingsButtons.musica.height
    ) {
      this.settings.music = !this.settings.music;
      console.log(`Música: ${this.settings.music ? "Encendida" : "Apagada"}`);
      return "musica";
    }

    // Botón Efectos de Sonido
    if (
      x >= this.settingsButtons.efectos_sonido.x &&
      x <=
        this.settingsButtons.efectos_sonido.x +
          this.settingsButtons.efectos_sonido.width &&
      y >= this.settingsButtons.efectos_sonido.y &&
      y <=
        this.settingsButtons.efectos_sonido.y +
          this.settingsButtons.efectos_sonido.height
    ) {
      this.settings.soundEffects = !this.settings.soundEffects;
      console.log(
        `Efectos: ${this.settings.soundEffects ? "Encendidos" : "Apagados"}`
      );
      return "efectos_sonido";
    }

    return null;
  }

  handleKeyDown(key) {
    if (key === "Escape") {
      if (this.subMenuState === "controls") {
        // Si estamos en controles, volver a settings
        console.log("Regresando al menú de configuración");
        this.subMenuState = "settings";
      } else if (this.subMenuState === "settings") {
        // Si estamos en settings, volver al menú de pausa
        console.log("Regresando al menú de pausa");
        this.subMenuState = null;
      } else {
        // Si estamos en el menú de pausa, reanudar el juego
        console.log("Reanudando juego");
        this.stateManager.setState(this.previousState);
      }
    }
  }
}

export default PauseState;
