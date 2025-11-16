import { UIHelpers } from "../utils/uiHelpers.js";

class HudConfigState {
  constructor(canvas, stateManager) {
    this.canvas = canvas;
    this.stateManager = stateManager;
    this.previousState = null;
    this.pauseStateRef = null; // Referencia al pauseState cuando venimos de ahí
    
    // Posiciones por defecto de los botones
    this.defaultPositions = {
      up: { x: 50, y: 350 },
      down: { x: 50, y: 450 },
      shoot: { x: 860, y: 400 }
    };
    
    // Posiciones actuales (se cargarán del localStorage)
    this.buttonPositions = this.loadPositions();
    
    // Estado de arrastre
    this.draggingButton = null;
    this.dragOffset = { x: 0, y: 0 };
    
    // Tamaños de los botones
    this.buttonSize = {
      up: { width: 60, height: 60 },
      down: { width: 60, height: 60 },
      shoot: { width: 80, height: 80 }
    };
    
    // Botones del menú
    this.menuButtons = {
      restoreBtn: { x: 0, y: 0, width: 0, height: 0, text: '' },
      saveBtn: { x: 0, y: 0, width: 0, height: 0, text: '' },
      backBtn: { x: 0, y: 0, width: 0, height: 0, text: '' }
    };
    
    // Mensaje de guardado
    this.showSavedMessage = false;
  }

  loadPositions() {
    try {
      const saved = localStorage.getItem('hudButtonPositions');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error cargando posiciones HUD:', e);
    }
    // Retornar copia de las posiciones por defecto
    return {
      up: { ...this.defaultPositions.up },
      down: { ...this.defaultPositions.down },
      shoot: { ...this.defaultPositions.shoot }
    };
  }

  savePositions() {
    try {
      localStorage.setItem('hudButtonPositions', JSON.stringify(this.buttonPositions));
      console.log('Posiciones HUD guardadas:', this.buttonPositions);
      
      // Actualizar las posiciones en todos los niveles activos
      this.updateAllLevels();
      
      // Mostrar mensaje de confirmación visual
      this.showSavedMessage = true;
      setTimeout(() => {
        this.showSavedMessage = false;
      }, 2000);
    } catch (e) {
      console.error('Error guardando posiciones HUD:', e);
    }
  }

  enter(previousState) {
    // Si previousState fue establecido directamente, usarlo; sino usar el parámetro
    if (!this.previousState) {
      this.previousState = previousState || 'settings';
    }
    console.log('=== ENTRANDO A HUD CONFIG ===');
    console.log('previousState guardado:', this.previousState);
    console.log('pauseStateRef existe:', !!this.pauseStateRef);
    
    // Recargar posiciones
    this.buttonPositions = this.loadPositions();
  }

  update(deltaTime) {
    // No hay animaciones por ahora
  }

  render(ctx) {
    // Fondo semi-transparente
    ctx.fillStyle = 'rgba(0, 0, 20, 0.85)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Panel principal
    const panelWidth = 700;
    const panelHeight = 500;
    const panelX = (this.canvas.width - panelWidth) / 2;
    const panelY = (this.canvas.height - panelHeight) / 2;

    // Fondo del panel
    const gradient = ctx.createLinearGradient(panelX, panelY, panelX, panelY + panelHeight);
    gradient.addColorStop(0, 'rgba(20, 20, 40, 0.95)');
    gradient.addColorStop(1, 'rgba(10, 10, 20, 0.95)');
    ctx.fillStyle = gradient;
    UIHelpers.drawRoundedRect(ctx, panelX, panelY, panelWidth, panelHeight, 15, gradient);

    // Título
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 32px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('CONFIGURACIÓN DE CONTROLES', this.canvas.width / 2, panelY + 50);

    // Instrucciones
    ctx.font = '18px system-ui';
    ctx.fillStyle = '#aaf';
    ctx.fillText('Arrastra los botones a la posición deseada', this.canvas.width / 2, panelY + 85);

    // Dibujar preview de la pantalla de juego
    this.drawGamePreview(ctx, panelX + 50, panelY + 110, panelWidth - 100, 280);

    // Botones del menú
    this.renderMenuButtons(ctx, panelX, panelY, panelWidth, panelHeight);
    
    // Mensaje de confirmación de guardado
    if (this.showSavedMessage) {
      ctx.fillStyle = 'rgba(0, 200, 0, 0.9)';
      ctx.fillRect(panelX + 200, panelY + 20, 300, 50);
      ctx.strokeStyle = '#0f0';
      ctx.lineWidth = 2;
      ctx.strokeRect(panelX + 200, panelY + 20, 300, 50);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 20px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('¡Posiciones Guardadas!', panelX + 350, panelY + 50);
    }
  }

  drawGamePreview(ctx, x, y, width, height) {
    // Fondo oscuro simulando la pantalla de juego
    ctx.fillStyle = 'rgba(10, 10, 30, 0.9)';
    ctx.fillRect(x, y, width, height);
    
    ctx.strokeStyle = '#4af';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    // Texto informativo
    ctx.font = '14px system-ui';
    ctx.fillStyle = '#888';
    ctx.textAlign = 'center';
    ctx.fillText('Vista previa de la pantalla', x + width / 2, y + 20);

    // Escalar las posiciones de los botones al preview
    const scaleX = width / this.canvas.width;
    const scaleY = height / this.canvas.height;

    // Dibujar cada botón táctil en su posición
    ['up', 'down', 'shoot'].forEach(btnName => {
      const pos = this.buttonPositions[btnName];
      const size = this.buttonSize[btnName];
      
      const btnX = x + (pos.x * scaleX);
      const btnY = y + (pos.y * scaleY);
      const btnW = size.width * scaleX;
      const btnH = size.height * scaleY;

      // Fondo del botón
      const isDragging = this.draggingButton === btnName;
      ctx.fillStyle = isDragging ? 'rgba(100, 200, 255, 0.6)' : 'rgba(80, 120, 200, 0.5)';
      ctx.beginPath();
      ctx.arc(btnX + btnW/2, btnY + btnH/2, btnW/2, 0, Math.PI * 2);
      ctx.fill();

      // Borde
      ctx.strokeStyle = isDragging ? '#fff' : '#8af';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Icono/texto
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px system-ui';
      ctx.textAlign = 'center';
      const labels = { up: '↑', down: '↓', shoot: '●' };
      ctx.fillText(labels[btnName], btnX + btnW/2, btnY + btnH/2 + 5);
    });
  }

  renderMenuButtons(ctx, panelX, panelY, panelWidth, panelHeight) {
    const btnY = panelY + panelHeight - 70;
    const btnSpacing = 20;

    // Botón Restablecer
    const restoreBtn = {
      x: panelX + 80,
      y: btnY,
      width: 180,
      height: 45,
      text: 'Restablecer'
    };

    // Botón Guardar
    const saveBtn = {
      x: panelX + panelWidth / 2 - 90,
      y: btnY,
      width: 180,
      height: 45,
      text: 'Guardar'
    };

    // Botón Atrás
    const backBtn = {
      x: panelX + panelWidth - 260,
      y: btnY,
      width: 180,
      height: 45,
      text: 'Atrás'
    };

    [restoreBtn, saveBtn, backBtn].forEach(btn => {
      // Fondo
      const gradient = ctx.createLinearGradient(btn.x, btn.y, btn.x, btn.y + btn.height);
      gradient.addColorStop(0, 'rgba(60, 80, 140, 0.9)');
      gradient.addColorStop(1, 'rgba(40, 60, 120, 0.9)');
      UIHelpers.drawRoundedRect(ctx, btn.x, btn.y, btn.width, btn.height, 8, gradient);

      // Borde
      ctx.strokeStyle = '#6af';
      ctx.lineWidth = 2;
      ctx.strokeRect(btn.x, btn.y, btn.width, btn.height);

      // Texto
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 18px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(btn.text, btn.x + btn.width / 2, btn.y + btn.height / 2 + 7);
    });

    this.menuButtons = { restoreBtn, saveBtn, backBtn };
  }

  handleMouseDown(x, y) {
    // Verificar si se hizo clic en algún botón del menú
    if (!this.menuButtons || !this.menuButtons.restoreBtn) {
      return null;
    }
    
    const { restoreBtn, saveBtn, backBtn } = this.menuButtons;
    
    if (UIHelpers.isPointInButton(x, y, restoreBtn)) {
      this.restoreDefaults();
      return 'restore';
    }
    
    if (UIHelpers.isPointInButton(x, y, saveBtn)) {
      this.savePositions();
      return 'save';
    }
    
    if (UIHelpers.isPointInButton(x, y, backBtn)) {
      console.log('=== BOTÓN ATRÁS PRESIONADO ===');
      console.log('previousState:', this.previousState);
      console.log('pauseStateRef:', this.pauseStateRef);
      
      // Si venimos de pause-settings, configurar el submenú antes de cambiar de estado
      if (this.previousState === 'pause-settings') {
        console.log('Regresando a pause-settings');
        const pauseState = this.stateManager.states['pause'];
        if (pauseState) {
          console.log('Estableciendo subMenuState = settings');
          pauseState.subMenuState = 'settings';
        }
        this.previousState = null; // Limpiar para la próxima vez
        this.stateManager.setState('pause');
      } else {
        // En cualquier otro caso (settings del menú principal)
        console.log('Regresando a:', this.previousState || 'settings');
        this.previousState = null; // Limpiar para la próxima vez
        this.stateManager.setState(this.previousState || 'settings');
      }
      return 'back';
    }

    // Verificar si se hizo clic en algún botón táctil en el preview
    const panelWidth = 700;
    const panelHeight = 500;
    const panelX = (this.canvas.width - panelWidth) / 2;
    const panelY = (this.canvas.height - panelHeight) / 2;
    const previewX = panelX + 50;
    const previewY = panelY + 110;
    const previewWidth = panelWidth - 100;
    const previewHeight = 280;

    // Convertir coordenadas del preview a coordenadas del canvas
    if (x >= previewX && x <= previewX + previewWidth &&
        y >= previewY && y <= previewY + previewHeight) {
      
      const scaleX = this.canvas.width / previewWidth;
      const scaleY = this.canvas.height / previewHeight;
      
      const gameX = (x - previewX) * scaleX;
      const gameY = (y - previewY) * scaleY;

      // Verificar cada botón
      for (const btnName of ['up', 'down', 'shoot']) {
        const pos = this.buttonPositions[btnName];
        const size = this.buttonSize[btnName];
        
        if (gameX >= pos.x && gameX <= pos.x + size.width &&
            gameY >= pos.y && gameY <= pos.y + size.height) {
          this.draggingButton = btnName;
          this.dragOffset = {
            x: gameX - pos.x,
            y: gameY - pos.y
          };
          return 'drag';
        }
      }
    }

    return null;
  }

  handleMouseMove(x, y) {
    if (!this.draggingButton) return;

    const panelWidth = 700;
    const panelHeight = 500;
    const panelX = (this.canvas.width - panelWidth) / 2;
    const panelY = (this.canvas.height - panelHeight) / 2;
    const previewX = panelX + 50;
    const previewY = panelY + 110;
    const previewWidth = panelWidth - 100;
    const previewHeight = 280;

    const scaleX = this.canvas.width / previewWidth;
    const scaleY = this.canvas.height / previewHeight;
    
    const gameX = (x - previewX) * scaleX;
    const gameY = (y - previewY) * scaleY;

    // Actualizar posición del botón
    const size = this.buttonSize[this.draggingButton];
    this.buttonPositions[this.draggingButton] = {
      x: Math.max(0, Math.min(this.canvas.width - size.width, gameX - this.dragOffset.x)),
      y: Math.max(0, Math.min(this.canvas.height - size.height, gameY - this.dragOffset.y))
    };
  }

  handleMouseUp() {
    this.draggingButton = null;
  }

  handleClick(x, y) {
    return this.handleMouseDown(x, y);
  }

  restoreDefaults() {
    this.buttonPositions = {
      up: { ...this.defaultPositions.up },
      down: { ...this.defaultPositions.down },
      shoot: { ...this.defaultPositions.shoot }
    };
    console.log('Posiciones HUD restablecidas a valores por defecto');
  }

  exit() {
    console.log('Saliendo de configuración de HUD');
  }

  // Actualizar posiciones en todos los niveles
  updateAllLevels() {
    const levels = ['level1', 'level2', 'level3'];
    levels.forEach(levelName => {
      const level = this.stateManager.states[levelName];
      if (level && level.touchControls && level.touchControls.buttons) {
        console.log(`Actualizando posiciones en ${levelName}`);
        level.touchControls.buttons.up.x = this.buttonPositions.up.x;
        level.touchControls.buttons.up.y = this.buttonPositions.up.y;
        level.touchControls.buttons.down.x = this.buttonPositions.down.x;
        level.touchControls.buttons.down.y = this.buttonPositions.down.y;
        level.touchControls.buttons.shoot.x = this.buttonPositions.shoot.x;
        level.touchControls.buttons.shoot.y = this.buttonPositions.shoot.y;
      }
    });
  }

  // Método estático para obtener las posiciones guardadas
  static getSavedPositions() {
    try {
      const saved = localStorage.getItem('hudButtonPositions');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error cargando posiciones HUD:', e);
    }
    return {
      up: { x: 50, y: 350 },
      down: { x: 50, y: 450 },
      shoot: { x: 860, y: 400 }
    };
  }
}

export default HudConfigState;
