// Estado del menú principal
import { loader } from "../../engine/loader.js";

class MenuState {
  constructor(canvas, stateManager) {
    this.canvas = canvas;
    this.stateManager = stateManager;
    this.musicStarted = false;
    this.audioReady = false;
    // Definir áreas de botones
    this.buttons = {
      play: { x: 0, y: 0, width: 0, height: 0 },
      settings: { x: 0, y: 0, width: 0, height: 0 },
      sound: { x: 0, y: 0, width: 0, height: 0 },
    };
  }

  enter() {
    console.log("Entrando al menú principal");
    this.musicStarted = false;
    this.menuMusic = document.getElementById('menuMusic');
    
    if (this.menuMusic) {
      console.log('Elemento de audio encontrado');
      this.menuMusic.volume = 0.5;
    } else {
      console.error('No se encontró el elemento de audio menuMusic');
    }
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
      
      // Si está silenciado, dibujar una X roja sobre el botón
      if (this.menuMusic && this.menuMusic.muted) {
        ctx.strokeStyle = "#ff0000";
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        
        // Dibujar X
        const padding = 10;
        ctx.beginPath();
        ctx.moveTo(soundX + padding, soundY + padding);
        ctx.lineTo(soundX + newWidth - padding, soundY + newHeight - padding);
        ctx.moveTo(soundX + newWidth - padding, soundY + padding);
        ctx.lineTo(soundX + padding, soundY + newHeight - padding);
        ctx.stroke();
        
        // Dibujar círculo rojo alrededor
        ctx.strokeStyle = "#ff0000";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(soundX + newWidth/2, soundY + newHeight/2, newWidth/2 + 5, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  // Manejar clics en los botones
  handleClick(x, y) {
    // Iniciar música en el primer clic (requerido por los navegadores)
    if (!this.musicStarted && this.menuMusic) {
      console.log('=== REPRODUCIENDO MÚSICA ===');
      this.menuMusic.play()
        .then(() => {
          console.log('✓ Música reproduciendo correctamente');
          console.log('Volume:', this.menuMusic.volume);
          console.log('Paused:', this.menuMusic.paused);
          console.log('Duration:', this.menuMusic.duration);
        })
        .catch(err => {
          console.error('✗ Error al reproducir:', err);
        });
      this.musicStarted = true;
    }
    
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
      if (this.menuMusic) {
        this.menuMusic.muted = !this.menuMusic.muted;
        console.log('Muted:', this.menuMusic.muted);
      }
      return "sound";
    }

    return null;
  }

  exit() {
    console.log("Saliendo del menú principal");
    // La música continúa en otros estados del menú (levelSelect, settings)
    // Solo se pausa cuando se entra a un nivel
  }
}

export default MenuState;
