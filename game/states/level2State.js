// Estado del Nivel 2 con efecto Parallax - Escenario Espacial
import { loader } from "../../engine/loader.js";
import BaseLevel from "./baseLevel.js";

class Level2State extends BaseLevel {
  constructor(canvas, stateManager) {
    super(canvas, stateManager, 2);

    // Capas parallax específicas del Nivel 2 (espacio con planetas)
    this.layers = [
      {
        name: "fondo",
        image: null,
        x: 0,
        y: 0,
        speed: 0.1,
      },
      {
        name: "tierra",
        image: null,
        x: 150,
        y: 100,
        speed: 0.3,
        scale: 0.6,
      },
      {
        name: "luna",
        image: null,
        x: 600,
        y: 150,
        speed: 0.4,
        scale: 0.4,
      },
    ];

    // Sol (elemento decorativo específico del nivel 2)
    this.sol = {
      x: 800,
      y: 50,
      radius: 60,
      color: "#FDB813",
      glowColor: "#FFD700",
    };
  }

  // Configuración de dificultad específica del Nivel 2 (más difícil)
  configureDifficulty(difficulty) {
    switch (difficulty) {
      case "facil":
        this.maxEnemies = 15;
        this.enemySpawnInterval = 2.5;
        this.enemyShootCooldown = 1.8;
        this.enemyHealth = 3;
        this.enemyDamage = 8;
        break;
      case "medio":
        this.maxEnemies = 25;
        this.enemySpawnInterval = 2;
        this.enemyShootCooldown = 1.3;
        this.enemyHealth = 4;
        this.enemyDamage = 12;
        break;
      case "dificil":
        this.maxEnemies = 35;
        this.enemySpawnInterval = 1.5;
        this.enemyShootCooldown = 1;
        this.enemyHealth = 6;
        this.enemyDamage = 18;
        break;
      default:
        this.maxEnemies = 25;
        this.enemySpawnInterval = 2;
        this.enemyShootCooldown = 1.3;
        this.enemyHealth = 4;
        this.enemyDamage = 12;
    }
    console.log(
      `Nivel 2 - Dificultad: ${difficulty} - ${this.maxEnemies} enemigos con ${this.enemyHealth} HP`
    );
  }

  // Carga de assets específicos del Nivel 2
  async loadLevelAssets() {
    try {
      console.log("Iniciando carga de assets del Nivel 2...");

      await loader.loadImages({
        escenario_n2: "assets/images/escenarios/escenario_n2.jpg",
        tierra_n2: "assets/images/escenarios/tierra.png",
        luna_n2: "assets/images/escenarios/luna.png",
        nave_terrestre: "assets/images/naves/nave_terrestre.png",
        nave_extraterrestre_n2:
          "assets/images/naves/nave_extraterrestre_n2.png",
        bala: "assets/images/naves/bala.gif",
        bala_enemiga: "assets/images/naves/bala_enemiga.png",
      });

      this.layers[0].image = loader.getImage("escenario_n2");
      this.layers[1].image = loader.getImage("tierra_n2");
      this.layers[2].image = loader.getImage("luna_n2");

      this.naveTerrestre.image = loader.getImage("nave_terrestre");

      console.log("Assets del Nivel 2 cargados correctamente");
      this.assetsLoaded = true;
      this.isLoading = false;
    } catch (error) {
      console.error("Error cargando assets del Nivel 2:", error);
      this.isLoading = false;
    }
  }

  // Renderizado de capas parallax específicas del Nivel 2
  renderParallaxLayers(ctx) {
    // Renderizar el fondo espacial
    const fondoLayer = this.layers[0];
    if (fondoLayer.image) {
      ctx.drawImage(
        fondoLayer.image,
        fondoLayer.x,
        fondoLayer.y,
        this.canvas.width,
        this.canvas.height
      );
    }

    // Dibujar el Sol con efecto de brillo
    if (this.sol) {
      // Efecto de brillo (glow)
      ctx.save();
      const gradient = ctx.createRadialGradient(
        this.sol.x,
        this.sol.y,
        0,
        this.sol.x,
        this.sol.y,
        this.sol.radius * 1.5
      );
      gradient.addColorStop(0, this.sol.color);
      gradient.addColorStop(0.5, this.sol.glowColor);
      gradient.addColorStop(1, "rgba(255, 215, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.sol.x, this.sol.y, this.sol.radius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Sol sólido
      ctx.fillStyle = this.sol.color;
      ctx.beginPath();
      ctx.arc(this.sol.x, this.sol.y, this.sol.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Renderizar Tierra
    const tierraLayer = this.layers[1];
    if (tierraLayer && tierraLayer.image) {
      const scale = tierraLayer.scale || 0.6;
      const width = tierraLayer.image.width * scale;
      const height = tierraLayer.image.height * scale;

      ctx.drawImage(
        tierraLayer.image,
        tierraLayer.x,
        tierraLayer.y,
        width,
        height
      );
    }

    // Renderizar Luna
    const lunaLayer = this.layers[2];
    if (lunaLayer && lunaLayer.image) {
      const scale = lunaLayer.scale || 0.4;
      const width = lunaLayer.image.width * scale;
      const height = lunaLayer.image.height * scale;

      ctx.drawImage(lunaLayer.image, lunaLayer.x, lunaLayer.y, width, height);
    }
  }
}

export default Level2State;
