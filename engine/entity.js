// Clase base de entidad con update/render

class Entity {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  update(dt) {
    // Lógica de actualización (a implementar en clases hijas)
  }

  render(ctx) {
    // Lógica de renderizado (a implementar en clases hijas)
  }

  // Verificar colisión con otra entidad
  collidesWith(other) {
    return (
      this.x < other.x + other.width &&
      this.x + this.width > other.x &&
      this.y < other.y + other.height &&
      this.y + this.height > other.y
    );
  }
}

export default Entity;
