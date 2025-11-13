// Estado de pantalla de carga
import { loader } from "../../engine/loader.js";

class LoadingState {
  constructor(canvas) {
    this.canvas = canvas;
  }

  enter() {
    console.log("Cargando assets...");
  }

  update(dt) {
    // La carga es asíncrona, no necesita actualización aquí
  }

  render(ctx) {
    // Pantalla de carga
    ctx.fillStyle = "#0f0f10";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = "#eee";
    ctx.font = "24px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("Cargando...", this.canvas.width / 2, this.canvas.height / 2);

    // Barra de progreso
    const progress = loader.getProgress();
    const barWidth = 400;
    const barHeight = 30;
    const barX = (this.canvas.width - barWidth) / 2;
    const barY = this.canvas.height / 2 + 20;

    ctx.strokeStyle = "#eee";
    ctx.strokeRect(barX, barY, barWidth, barHeight);
    ctx.fillStyle = "#4bd";
    ctx.fillRect(barX, barY, barWidth * progress, barHeight);
  }

  exit() {
    console.log("Carga completada");
  }
}

export default LoadingState;
