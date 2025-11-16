// Estado de configuración
import { loader } from "../../engine/loader.js";
import { UIHelpers } from "../utils/uiHelpers.js";

class SettingsState {
  constructor(canvas, stateManager) {
    this.canvas = canvas;
    this.stateManager = stateManager;

    // Configuraciones del juego
    this.settings = {
      difficulty: "medio", // facil, medio, dificil
      contrast: 1.0, // 0.0 a 2.0 (contraste del canvas)
      music: true, // true = encendido, false = apagado
      soundEffects: true, // true = encendido, false = apagado
    };

    // Posiciones de botones
    this.buttons = {
      controles: { x: 0, y: 0, width: 0, height: 0 },
      dificultad: { x: 0, y: 0, width: 0, height: 0 },
      contraste: { x: 0, y: 0, width: 0, height: 0 },
      musica: { x: 0, y: 0, width: 0, height: 0 },
      efectos_sonido: { x: 0, y: 0, width: 0, height: 0 },
      hud: { x: 0, y: 0, width: 0, height: 0 },
      back: { x: 0, y: 0, width: 0, height: 0 },
    };

    // Controles deslizantes para volumen y contraste
    this.volumeSliders = {
      music: { x: 0, y: 0, width: 200, height: 20, isDragging: false },
      effects: { x: 0, y: 0, width: 200, height: 20, isDragging: false },
      contrast: { x: 0, y: 0, width: 200, height: 20, isDragging: false }
    };
  }

  enter() {
    console.log("Entrando a configuración");
    this.menuMusic = document.getElementById('menuMusic');
    
    // Continuar reproduciendo la música si no está sonando
    if (this.menuMusic && this.menuMusic.paused) {
      this.menuMusic.play().catch(err => console.log('Error reproduciendo música:', err));
    }
    
    // Sincronizar el estado de la configuración con el estado real
    if (this.menuMusic) {
      this.settings.music = !this.menuMusic.muted;
    }
    
    // Sincronizar efectos de sonido con la configuración global
    if (window.gameConfig) {
      this.settings.soundEffects = window.gameConfig.soundEffectsEnabled;
      if (window.gameConfig.contrast !== undefined) {
        this.settings.contrast = window.gameConfig.contrast;
      }
    }
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

    // Botón HUD al lado derecho del título
    const hudBtnWidth = 120;
    const hudBtnHeight = 40;
    const hudX = this.canvas.width / 2 + 250;
    const hudY = 45;
    
    this.buttons.hud = UIHelpers.drawCustomButton(ctx, 'HUD', hudX, hudY, hudBtnWidth, hudBtnHeight);

    // Posiciones centrales para los botones
    const centerX = this.canvas.width / 2;
    const startY = 105;
    const spacing = 90;
    const leftColX = 150;
    const rightColX = 550;

    // 3. Botón Controles (columna izquierda)
    const controlesBtn = loader.getImage("controles");
    if (controlesBtn) {
      const btnX = leftColX;
      const btnY = startY;
      ctx.drawImage(controlesBtn, btnX, btnY);
      this.buttons.controles = {
        x: btnX,
        y: btnY,
        width: controlesBtn.width,
        height: controlesBtn.height,
      };
    }

    // 4. Botón Dificultad (alineado a la izquierda)
    const dificultadBtn = loader.getImage("dificultad");
    if (dificultadBtn) {
      const btnX = leftColX;
      const btnY = startY + spacing;
      ctx.drawImage(dificultadBtn, btnX, btnY);
      this.buttons.dificultad = {
        x: btnX,
        y: btnY,
        width: dificultadBtn.width,
        height: dificultadBtn.height,
      };

      // Texto de dificultad (a la derecha del botón, alineado)
      const textX = leftColX + dificultadBtn.width + 100;
      ctx.font = "bold 24px system-ui";
      ctx.fillStyle = "#ffd700";
      ctx.textAlign = "left";
      ctx.fillText(
        this.settings.difficulty.toUpperCase(),
        textX,
        btnY + dificultadBtn.height / 2 + 8
      );
    }

    // 5. Botón Música (alineado a la izquierda)
    const musicaBtn = loader.getImage("musica");
    if (musicaBtn) {
      const btnX = leftColX;
      const btnY = startY + spacing * 2;
      
      ctx.drawImage(musicaBtn, btnX, btnY);
      this.buttons.musica = {
        x: btnX,
        y: btnY,
        width: musicaBtn.width,
        height: musicaBtn.height,
      };

      // Texto de estado (a la derecha del botón, alineado)
      const textX = leftColX + musicaBtn.width + 70;
      const estadoMusica = this.settings.music ? "ENCENDIDO" : "APAGADO";
      ctx.font = "bold 20px system-ui";
      ctx.fillStyle = this.settings.music ? "#00ff00" : "#ff0000";
      ctx.textAlign = "left";
      ctx.fillText(
        estadoMusica,
        textX,
        btnY + 20
      );

      // Slider de volumen para música (debajo del texto, alineado)
      if (this.settings.music) {
        const sliderX = textX;
        const sliderY = btnY + 35;
        this.volumeSliders.music = { x: sliderX, y: sliderY, width: 200, height: 20 };
        const musicVolume = this.menuMusic ? this.menuMusic.volume : 0.3;
        UIHelpers.drawSlider(ctx, sliderX, sliderY, 200, 20, musicVolume, 'volume');
      }
    }

    // 6. Botón Efectos de Sonido (alineado a la izquierda)
    const efectosBtn = loader.getImage("efectos_sonido");
    if (efectosBtn) {
      const btnX = leftColX;
      const btnY = startY + spacing * 3;
      
      ctx.drawImage(efectosBtn, btnX, btnY);
      this.buttons.efectos_sonido = {
        x: btnX,
        y: btnY,
        width: efectosBtn.width,
        height: efectosBtn.height,
      };

      // Texto de estado (a la derecha del botón, alineado)
      const textX = leftColX + efectosBtn.width + 40;
      const estadoEfectos = this.settings.soundEffects ? "ENCENDIDO" : "APAGADO";
      ctx.font = "bold 20px system-ui";
      ctx.fillStyle = this.settings.soundEffects ? "#00ff00" : "#ff0000";
      ctx.textAlign = "left";
      ctx.fillText(
        estadoEfectos,
        textX,
        btnY + 20
      );

      // Slider de volumen para efectos (debajo del texto, alineado)
      if (this.settings.soundEffects) {
        const sliderX = textX;
        const sliderY = btnY + 35;
        this.volumeSliders.effects = { x: sliderX, y: sliderY, width: 200, height: 20 };
        const effectsVolume = window.gameConfig ? window.gameConfig.effectsVolume : 0.3;
        UIHelpers.drawSlider(ctx, sliderX, sliderY, 200, 20, effectsVolume, 'volume');
      }
    }

    // 7. Contraste (columna derecha, misma altura que Controles)
    // Título "Contraste"
    ctx.font = "bold 32px system-ui";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "left";
    ctx.fillText("Contraste", rightColX - 10, startY + 30);
    
    // Slider de contraste
    const contrastSliderX = rightColX - 30;
    const contrastSliderY = startY + 55;
    this.volumeSliders.contrast = { x: contrastSliderX, y: contrastSliderY, width: 200, height: 20 };
    const contrastValue = (this.settings.contrast - 0.0) / 2.0;
    UIHelpers.drawSlider(ctx, contrastSliderX, contrastSliderY, 200, 20, contrastValue, 'contrast');

    // 8. Botón Back (esquina superior izquierda, tamaño 2.5x)
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
    // Verificar si se hizo clic en los sliders de volumen
    if (this.handleSliderClick(x, y)) {
      return 'slider';
    }

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

    // Verificar clic en Música (toggle ON/OFF)
    if (
      x >= this.buttons.musica.x &&
      x <= this.buttons.musica.x + this.buttons.musica.width &&
      y >= this.buttons.musica.y &&
      y <= this.buttons.musica.y + this.buttons.musica.height
    ) {
      this.settings.music = !this.settings.music;
      console.log(`Música: ${this.settings.music ? "Encendida" : "Apagada"}`);
      
      // Controlar la música real
      if (this.menuMusic) {
        if (this.settings.music) {
          // Encender música
          this.menuMusic.muted = false;
          if (this.menuMusic.paused) {
            this.menuMusic.play().catch(err => console.log('Error reproduciendo música:', err));
          }
        } else {
          // Apagar música
          this.menuMusic.muted = true;
        }
      }
      
      // Actualizar configuración global
      if (window.gameConfig) {
        window.gameConfig.musicEnabled = this.settings.music;
      }
      
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
      
      // Actualizar la configuración global
      if (window.gameConfig) {
        window.gameConfig.soundEffectsEnabled = this.settings.soundEffects;
      }
      
      // Reproducir un sonido de prueba si se activaron
      if (this.settings.soundEffects && window.playSoundEffect) {
        window.playSoundEffect('laserSound');
      }
      
      return "efectos_sonido";
    }

    // Verificar clic en HUD
    if (
      x >= this.buttons.hud.x &&
      x <= this.buttons.hud.x + this.buttons.hud.width &&
      y >= this.buttons.hud.y &&
      y <= this.buttons.hud.y + this.buttons.hud.height
    ) {
      console.log("Botón HUD presionado - Abriendo configuración de HUD");
      const hudConfigState = this.stateManager.states["hudConfig"];
      if (hudConfigState) {
        hudConfigState.previousState = "settings";
      }
      this.stateManager.setState("hudConfig");
      return "hud";
    }

    return null;
  }

  // Manejar clics en sliders de volumen
  handleSliderClick(x, y) {
    // Slider de música
    if (this.settings.music) {
      const musicSlider = this.volumeSliders.music;
      if (x >= musicSlider.x && x <= musicSlider.x + musicSlider.width &&
          y >= musicSlider.y - 10 && y <= musicSlider.y + musicSlider.height + 10) {
        musicSlider.isDragging = true;
        
        const newVolume = Math.max(0, Math.min(1, (x - musicSlider.x) / musicSlider.width));
        
        if (this.menuMusic) {
          this.menuMusic.volume = newVolume;
        }
        
        const gameMusic = document.getElementById('gameMusic');
        if (gameMusic) {
          gameMusic.volume = newVolume;
        }
        
        return true;
      }
    }
    
    // Slider de efectos
    if (this.settings.soundEffects) {
      const effectsSlider = this.volumeSliders.effects;
      if (x >= effectsSlider.x && x <= effectsSlider.x + effectsSlider.width &&
          y >= effectsSlider.y - 10 && y <= effectsSlider.y + effectsSlider.height + 10) {
        effectsSlider.isDragging = true;
        
        const newVolume = Math.max(0, Math.min(1, (x - effectsSlider.x) / effectsSlider.width));
        
        if (window.gameConfig) {
          window.gameConfig.effectsVolume = newVolume;
        }
        
        return true;
      }
    }
    
    // Slider de contraste
    const contrastSlider = this.volumeSliders.contrast;
    if (x >= contrastSlider.x && x <= contrastSlider.x + contrastSlider.width &&
        y >= contrastSlider.y - 10 && y <= contrastSlider.y + contrastSlider.height + 10) {
      contrastSlider.isDragging = true;
      
      const newValue = Math.max(0, Math.min(1, (x - contrastSlider.x) / contrastSlider.width));
      
      // Convertir el valor del slider (0-1) a contraste (0.0-2.0)
      this.settings.contrast = newValue * 2.0;
      
      UIHelpers.applyContrast(this.settings.contrast);
      
      if (window.gameConfig) {
        window.gameConfig.contrast = this.settings.contrast;
      }
      
      return true;
    }
    
    return false;
  }

  // Manejar movimiento del mouse para arrastre fluido
  handleMouseMove(x, y) {
    // Arrastrar slider de música
    if (this.volumeSliders.music.isDragging) {
      const musicSlider = this.volumeSliders.music;
      const newVolume = Math.max(0, Math.min(1, (x - musicSlider.x) / musicSlider.width));
      
      if (this.menuMusic) {
        this.menuMusic.volume = newVolume;
      }
      
      const gameMusic = document.getElementById('gameMusic');
      if (gameMusic) {
        gameMusic.volume = newVolume;
      }
    }
    
    // Arrastrar slider de efectos
    if (this.volumeSliders.effects.isDragging) {
      const effectsSlider = this.volumeSliders.effects;
      const newVolume = Math.max(0, Math.min(1, (x - effectsSlider.x) / effectsSlider.width));
      
      if (window.gameConfig) {
        window.gameConfig.effectsVolume = newVolume;
      }
    }
    
    // Arrastrar slider de contraste
    if (this.volumeSliders.contrast.isDragging) {
      const contrastSlider = this.volumeSliders.contrast;
      const newValue = Math.max(0, Math.min(1, (x - contrastSlider.x) / contrastSlider.width));
      
      // Convertir el valor del slider (0-1) a contraste (0.0-2.0)
      this.settings.contrast = newValue * 2.0;
      
      UIHelpers.applyContrast(this.settings.contrast);
      
      if (window.gameConfig) {
        window.gameConfig.contrast = this.settings.contrast;
      }
    }
  }

  // Soltar el mouse para dejar de arrastrar
  handleMouseUp() {
    this.volumeSliders.music.isDragging = false;
    this.volumeSliders.effects.isDragging = false;
    this.volumeSliders.contrast.isDragging = false;
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
