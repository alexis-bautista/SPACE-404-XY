// Utilidades compartidas para UI - Reduce duplicación de código
import { loader } from "../../engine/loader.js";

export const UIHelpers = {
  // Dibujar rectángulo con esquinas redondeadas
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
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 2;
    ctx.stroke();
  },

  // Renderizar botón desde imagen
  renderButton(ctx, imageName, x, y) {
    const btn = loader.getImage(imageName);
    if (btn) {
      ctx.drawImage(btn, x, y);
      return { x, y, width: btn.width, height: btn.height };
    }
    return null;
  },

  // Renderizar botón centrado
  renderCenteredButton(ctx, imageName, centerX, y) {
    const btn = loader.getImage(imageName);
    if (btn) {
      const x = centerX - btn.width / 2;
      ctx.drawImage(btn, x, y);
      return { x, y, width: btn.width, height: btn.height };
    }
    return null;
  },

  // Verificar si un punto está dentro de un botón
  isPointInButton(x, y, button) {
    return button && x >= button.x && x <= button.x + button.width && 
           y >= button.y && y <= button.y + button.height;
  },

  // Crear y dibujar botón personalizado con gradiente
  drawCustomButton(ctx, text, x, y, width, height, colors = { start: 'rgba(60, 80, 140, 0.9)', end: 'rgba(40, 60, 120, 0.9)', border: '#6af' }) {
    const gradient = ctx.createLinearGradient(x, y, x, y + height);
    gradient.addColorStop(0, colors.start);
    gradient.addColorStop(1, colors.end);
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);
    
    ctx.strokeStyle = colors.border;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
    
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 18px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(text, x + width / 2, y + height / 2 + 7);
    
    return { x, y, width, height };
  },

  // Dibujar slider de volumen mejorado
  drawSlider(ctx, x, y, width, height, value, type = 'volume') {
    const colors = type === 'contrast' 
      ? { progress: ['#fc0', '#fa0', '#f80'], border: '#fc0', handle: '#fa0' }
      : { progress: ['#5df', '#4bd', '#39c'], border: '#6ef', handle: '#4bd' };

    // Sombra de la barra
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;
    
    // Fondo del slider
    const bgGradient = ctx.createLinearGradient(x, y, x, y + height);
    bgGradient.addColorStop(0, 'rgba(30, 30, 40, 0.9)');
    bgGradient.addColorStop(0.5, 'rgba(20, 20, 30, 0.95)');
    bgGradient.addColorStop(1, 'rgba(30, 30, 40, 0.9)');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(x, y, width, height);
    
    // Resetear sombra
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    
    // Barra de progreso
    const fillWidth = width * value;
    if (fillWidth > 0) {
      const progressGradient = ctx.createLinearGradient(x, y, x, y + height);
      colors.progress.forEach((color, i) => {
        progressGradient.addColorStop(i / (colors.progress.length - 1), color);
      });
      ctx.fillStyle = progressGradient;
      ctx.fillRect(x, y, fillWidth, height);
      
      // Brillo superior
      const shineGradient = ctx.createLinearGradient(x, y, x, y + height / 3);
      shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
      shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = shineGradient;
      ctx.fillRect(x, y, fillWidth, height / 3);
    }
    
    // Borde del slider
    ctx.strokeStyle = colors.border;
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);
    
    // Handle
    this.drawSliderHandle(ctx, x + fillWidth, y + height / 2, 14, colors.handle);
    
    // Porcentaje
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 3;
    ctx.fillStyle = type === 'contrast' ? '#ffd700' : '#fff';
    ctx.font = 'bold 16px system-ui';
    ctx.textAlign = 'left';
    const percent = type === 'contrast' ? Math.round(value * 200) : Math.round(value * 100);
    ctx.fillText(percent + '%', x + width + 12, y + height / 2 + 6);
    
    // Resetear sombra final
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  },

  // Dibujar handle del slider
  drawSliderHandle(ctx, x, y, radius, color) {
    // Sombra del handle
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
    
    // Handle exterior
    const handleGradient = ctx.createRadialGradient(x - 3, y - 3, 0, x, y, radius);
    handleGradient.addColorStop(0, '#fff');
    handleGradient.addColorStop(0.7, '#f0f0f0');
    handleGradient.addColorStop(1, '#d0d0d0');
    ctx.fillStyle = handleGradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Resetear sombra
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    
    // Anillo interior
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, radius - 5, 0, Math.PI * 2);
    ctx.stroke();
    
    // Centro
    const centerGradient = ctx.createRadialGradient(x, y, 0, x, y, radius - 6);
    centerGradient.addColorStop(0, color === '#fa0' ? '#fc0' : '#6ef');
    centerGradient.addColorStop(1, color);
    ctx.fillStyle = centerGradient;
    ctx.beginPath();
    ctx.arc(x, y, radius - 7, 0, Math.PI * 2);
    ctx.fill();
  },

  // Manejar clic en slider
  handleSliderInteraction(x, y, slider, onUpdate) {
    if (!slider || !slider.x) return false;
    
    const { x: sliderX, y: sliderY, width, height } = slider;
    if (x >= sliderX && x <= sliderX + width && 
        y >= sliderY - 10 && y <= sliderY + height + 10) {
      const newValue = Math.max(0, Math.min(1, (x - sliderX) / width));
      if (onUpdate) onUpdate(newValue);
      return true;
    }
    return false;
  },

  // Aplicar filtro de contraste al canvas
  applyContrast(contrastLevel) {
    const canvas = document.getElementById('game');
    if (canvas) {
      canvas.style.filter = `contrast(${Math.round(contrastLevel * 100)}%)`;
    }
  }
};
