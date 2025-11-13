// Sistema de gestión de estados (menu, juego, pausa, gameover)

class StateManager {
  constructor() {
    this.states = {};
    this.currentState = null;
  }

  // Registrar un nuevo estado
  addState(name, state) {
    this.states[name] = state;
  }

  // Cambiar a un estado específico
  setState(name) {
    if (this.currentState && this.currentState.exit) {
      this.currentState.exit();
    }

    this.currentState = this.states[name];

    if (this.currentState && this.currentState.enter) {
      this.currentState.enter();
    }
  }

  // Actualizar el estado actual
  update(dt) {
    if (this.currentState && this.currentState.update) {
      this.currentState.update(dt);
    }
  }

  // Renderizar el estado actual
  render(ctx) {
    if (this.currentState && this.currentState.render) {
      this.currentState.render(ctx);
    }
  }

  // Obtener el estado actual
  getCurrentState() {
    return this.currentState;
  }
}

export default StateManager;
