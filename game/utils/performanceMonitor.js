// Monitor de rendimiento para verificar FPS y tiempos de carga

class PerformanceMonitor {
  constructor() {
    this.fps = 0;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fpsUpdateInterval = 1000; // Actualizar FPS cada segundo
    this.fpsHistory = [];
    this.maxHistoryLength = 60; // Guardar último minuto de datos
    
    // Métricas de carga
    this.loadTimes = {};
    this.isEnabled = true;
    
    // Configuración de visualización
    this.position = { x: 10, y: 50 };
    this.showDetailed = false;
  }

  update(currentTime) {
    if (!this.isEnabled) return;

    this.frameCount++;
    const deltaTime = currentTime - this.lastTime;

    if (deltaTime >= this.fpsUpdateInterval) {
      this.fps = Math.round((this.frameCount * 1000) / deltaTime);
      this.fpsHistory.push(this.fps);
      
      if (this.fpsHistory.length > this.maxHistoryLength) {
        this.fpsHistory.shift();
      }

      this.frameCount = 0;
      this.lastTime = currentTime;
    }
  }

  render(ctx) {
    if (!this.isEnabled) return;

    const { x, y } = this.position;
    const boxWidth = this.showDetailed ? 250 : 150;
    const boxHeight = this.showDetailed ? 180 : 100;

    // Fondo semi-transparente
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(x, y, boxWidth, boxHeight);
    
    // Borde
    const borderColor = this.fps >= 45 ? '#0f0' : this.fps >= 30 ? '#ff0' : '#f00';
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, boxWidth, boxHeight);

    // FPS actual
    ctx.fillStyle = borderColor;
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`${this.fps} FPS`, x + 10, y + 30);

    // Estado
    ctx.font = '12px monospace';
    ctx.fillStyle = '#fff';
    const status = this.fps >= 45 ? '✓ ÓPTIMO' : this.fps >= 30 ? '⚠ ACEPTABLE' : '✗ BAJO';
    ctx.fillText(status, x + 10, y + 50);

    // Controles
    ctx.font = '10px monospace';
    ctx.fillStyle = '#aaa';
    ctx.fillText('F3: Toggle | F4: Detalles', x + 10, y + boxHeight - 30);
    ctx.fillText('Ctrl+F5: Reporte', x + 10, y + boxHeight - 15);

    if (this.showDetailed) {
      // FPS mínimo
      const minFps = this.fpsHistory.length > 0 ? Math.min(...this.fpsHistory) : this.fps;
      ctx.fillText(`Min: ${minFps} FPS`, x + 10, y + 70);

      // FPS promedio
      const avgFps = this.fpsHistory.length > 0 
        ? Math.round(this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length)
        : this.fps;
      ctx.fillText(`Avg: ${avgFps} FPS`, x + 10, y + 90);

      // Gráfica pequeña
      this.renderGraph(ctx, x + 10, y + 100, boxWidth - 20, 30);
    }
  }

  renderGraph(ctx, x, y, width, height) {
    if (this.fpsHistory.length < 2) return;

    ctx.strokeStyle = 'rgba(100, 200, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);

    // Línea de referencia 45 FPS
    const fps45Y = y + height - (45 / 60) * height;
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
    ctx.beginPath();
    ctx.moveTo(x, fps45Y);
    ctx.lineTo(x + width, fps45Y);
    ctx.stroke();

    // Gráfica de FPS
    ctx.strokeStyle = '#0cf';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const step = width / (this.maxHistoryLength - 1);
    const maxFps = 60;

    this.fpsHistory.forEach((fps, index) => {
      const px = x + (index * step);
      const py = y + height - (Math.min(fps, maxFps) / maxFps) * height;
      
      if (index === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    });

    ctx.stroke();
  }

  // Marcar inicio de carga
  startLoad(name) {
    this.loadTimes[name] = {
      start: performance.now(),
      end: null,
      duration: null
    };
  }

  // Marcar fin de carga
  endLoad(name) {
    if (this.loadTimes[name]) {
      this.loadTimes[name].end = performance.now();
      this.loadTimes[name].duration = this.loadTimes[name].end - this.loadTimes[name].start;
      
      console.log(`📊 [Performance] ${name}: ${this.loadTimes[name].duration.toFixed(2)}ms`);
      
      // Advertir si la carga es lenta
      if (this.loadTimes[name].duration > 100) {
        console.warn(`⚠️ [Performance] ${name} tardó ${this.loadTimes[name].duration.toFixed(2)}ms (>100ms puede causar bloqueos)`);
      }
    }
  }

  // Obtener reporte completo
  getReport() {
    const minFps = this.fpsHistory.length > 0 ? Math.min(...this.fpsHistory) : this.fps;
    const avgFps = this.fpsHistory.length > 0 
      ? Math.round(this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length)
      : this.fps;

    return {
      current: this.fps,
      min: minFps,
      avg: avgFps,
      history: [...this.fpsHistory],
      loadTimes: {...this.loadTimes},
      meetsRequirement: minFps >= 45
    };
  }

  // Imprimir reporte en consola
  printReport() {
    const report = this.getReport();
    console.log('\n═══════════════════════════════════════');
    console.log('📊 REPORTE DE RENDIMIENTO');
    console.log('═══════════════════════════════════════');
    console.log(`FPS Actual:   ${report.current}`);
    console.log(`FPS Mínimo:   ${report.min} ${report.min >= 45 ? '✓' : '✗'}`);
    console.log(`FPS Promedio: ${report.avg}`);
    console.log(`Cumple requisito (≥45 FPS): ${report.meetsRequirement ? '✓ SÍ' : '✗ NO'}`);
    console.log('───────────────────────────────────────');
    console.log('TIEMPOS DE CARGA:');
    
    Object.entries(report.loadTimes).forEach(([name, data]) => {
      if (data.duration !== null) {
        const status = data.duration < 100 ? '✓' : '⚠️';
        console.log(`  ${status} ${name}: ${data.duration.toFixed(2)}ms`);
      }
    });
    console.log('═══════════════════════════════════════\n');
  }

  toggle() {
    this.isEnabled = !this.isEnabled;
    console.log(`Monitor de rendimiento: ${this.isEnabled ? 'ACTIVADO' : 'DESACTIVADO'}`);
  }

  toggleDetailed() {
    this.showDetailed = !this.showDetailed;
  }
}

export default PerformanceMonitor;
