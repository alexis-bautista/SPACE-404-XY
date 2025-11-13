// Estado del Nivel 3 con efecto Parallax - Escenario Final
import { loader } from "../../engine/loader.js";
import BaseLevel from "./baseLevel.js";

class Level3State extends BaseLevel {
  constructor(canvas, stateManager) {
    super(canvas, stateManager, 3);

    // Dimensiones de enemigos diferentes para el nivel 3
    this.enemyWidth = 120;
    this.enemyHeight = 60;

    // Capas parallax específicas del Nivel 3
    this.layers = [
      {
        name: "fondo",
        image: null,
        x: 0,
        y: 0,
        speed: 0.1,
      },
      {
        name: "carro",
        image: null,
        x: 50,
        y: 0,
        speed: 0.3,
        scale: 0.4,
      },
      {
        name: "nave_escenario",
        image: null,
        x: 500,
        y: 0,
        speed: 0.5,
        scale: 0.8,
      },
      {
        name: "ovnis",
        image: null,
        x: 350,
        y: 0,
        speed: 0.7,
        scale: 0.8,
      },
    ];
  }

  // Configuración de dificultad del Nivel 3 (menos enemigos pero más resistentes)
  configureDifficulty(difficulty) {
    switch (difficulty) {
      case "facil":
        this.maxEnemies = 8;
        this.enemySpawnInterval = 3;
        this.enemyShootCooldown = 1.8;
        this.enemyHealth = 5;
        this.enemyDamage = 10;
        break;
      case "medio":
        this.maxEnemies = 12;
        this.enemySpawnInterval = 2.5;
        this.enemyShootCooldown = 1.5;
        this.enemyHealth = 8;
        this.enemyDamage = 15;
        break;
      case "dificil":
        this.maxEnemies = 15;
        this.enemySpawnInterval = 2;
        this.enemyShootCooldown = 1.2;
        this.enemyHealth = 12;
        this.enemyDamage = 20;
        break;
      default:
        this.maxEnemies = 12;
        this.enemySpawnInterval = 2.5;
        this.enemyShootCooldown = 1.5;
        this.enemyHealth = 8;
        this.enemyDamage = 15;
    }
    console.log(
      `Nivel 3 - Dificultad: ${difficulty} - ${this.maxEnemies} enemigos con ${this.enemyHealth} HP (muy resistentes)`
    );
  }

  // Carga de assets específicos del Nivel 3
  async loadLevelAssets() {
    try {
      console.log("Iniciando carga de assets del Nivel 3...");

      await loader.loadImages({
        escenario_n3: "assets/images/escenarios/escenario_n3.jpg",
        carro_n3: "assets/images/escenarios/carro.png",
        nave_escenario_n3: "assets/images/escenarios/nave_escenario.png",
        ovnis_n3: "assets/images/escenarios/ovnis.png",
        nave_terrestre: "assets/images/naves/nave_terrestre.png",
        nave_extraterrestre_n3:
          "assets/images/naves/nave_extraterrestre_n3.png",
        bala: "assets/images/naves/bala.gif",
        bala_enemiga: "assets/images/naves/bala_enemiga.png",
      });

      this.layers[0].image = loader.getImage("escenario_n3");
      this.layers[1].image = loader.getImage("carro_n3");
      this.layers[2].image = loader.getImage("nave_escenario_n3");
      this.layers[3].image = loader.getImage("ovnis_n3");

      this.naveTerrestre.image = loader.getImage("nave_terrestre");

      console.log("Assets del Nivel 3 cargados correctamente");
      this.assetsLoaded = true;
      this.isLoading = false;
    } catch (error) {
      console.error("Error cargando assets del Nivel 3:", error);
      this.isLoading = false;
    }
  }

  // Spawn de enemigos con movimiento más complejo (Nivel 3)
  spawnEnemy() {
    const minY = 50;
    const maxY = this.canvas.height - this.enemyHeight - 50;
    const randomY = minY + Math.random() * (maxY - minY);

    const enemy = {
      x: this.canvas.width,
      y: randomY,
      width: this.enemyWidth,
      height: this.enemyHeight,
      speed: this.enemySpeed,
      verticalSpeed: this.enemyVerticalSpeed,
      image: loader.getImage("nave_extraterrestre_n3"),
      horizontalDirection: -1,
      verticalDirection: Math.random() > 0.5 ? 1 : -1,
      targetX: this.naveTerrestre.x + 150,
      minX: this.naveTerrestre.x + 100,
      maxX: this.canvas.width - 100,
      changeDirectionTimer: 0,
      changeDirectionInterval: 2 + Math.random() * 3,
      shootTimer: Math.random() * this.enemyShootCooldown,
      canShoot: true,
      health: this.enemyHealth,
      maxHealth: this.enemyHealth,
      isDestroyed: false,
      isFalling: false,
      fallSpeed: 0,
      fallAcceleration: 400,
    };

    this.enemies.push(enemy);
    this.enemiesSpawned++;
    console.log(
      `Enemigo spawneado ${this.enemiesSpawned}/${
        this.maxEnemies
      } en Y=${Math.round(randomY)} - HP: ${this.enemyHealth}`
    );
  }

  // Actualización de enemigos con movimiento en todas las direcciones
  updateEnemies(dt) {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];

      if (enemy.isFalling) {
        enemy.fallSpeed += enemy.fallAcceleration * dt;
        enemy.y += enemy.fallSpeed * dt;

        if (enemy.y > this.canvas.height) {
          this.enemies.splice(i, 1);
          console.log(
            `Enemigo eliminado (cayó). Enemigos restantes: ${this.enemies.length}`
          );
        }
        continue;
      }

      // Movimiento horizontal (puede ir hacia adelante y atrás)
      enemy.changeDirectionTimer += dt;
      if (enemy.changeDirectionTimer >= enemy.changeDirectionInterval) {
        enemy.horizontalDirection *= -1;
        enemy.changeDirectionTimer = 0;
        enemy.changeDirectionInterval = 2 + Math.random() * 3;
      }

      enemy.x += enemy.horizontalDirection * enemy.speed * dt;

      // Limitar movimiento horizontal
      if (enemy.x < enemy.minX) {
        enemy.x = enemy.minX;
        enemy.horizontalDirection = 1;
      }
      if (enemy.x > enemy.maxX) {
        enemy.x = enemy.maxX;
        enemy.horizontalDirection = -1;
      }

      // Movimiento vertical
      enemy.y += enemy.verticalDirection * enemy.verticalSpeed * dt;

      const minY = 0;
      const maxY = this.canvas.height - enemy.height;
      if (enemy.y < minY) {
        enemy.y = minY;
        enemy.verticalDirection = 1;
      }
      if (enemy.y > maxY) {
        enemy.y = maxY;
        enemy.verticalDirection = -1;
      }

      // Sistema de disparo
      if (!enemy.isFalling) {
        enemy.shootTimer += dt;
        if (enemy.shootTimer >= this.enemyShootCooldown) {
          this.enemyShoot(enemy);
          enemy.shootTimer = 0;
        }
      }

      // Eliminar enemigos que salieron de la pantalla por la izquierda
      if (enemy.x + enemy.width < 0) {
        this.enemies.splice(i, 1);
      }
    }
  }

  // Renderizado de capas parallax específicas del Nivel 3
  renderParallaxLayers(ctx) {
    // Renderizar el fondo
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

    // Renderizar carro (parte inferior izquierda)
    const carroLayer = this.layers[1];
    if (carroLayer && carroLayer.image) {
      const scale = carroLayer.scale || 0.4;
      const width = carroLayer.image.width * scale;
      const height = carroLayer.image.height * scale;
      const yPos = this.canvas.height - height;

      ctx.drawImage(carroLayer.image, carroLayer.x, yPos, width, height);
    }

    // Renderizar nave_escenario (centro-derecha)
    const naveEscenarioLayer = this.layers[2];
    if (naveEscenarioLayer && naveEscenarioLayer.image) {
      const scale = naveEscenarioLayer.scale || 0.8;
      const width = naveEscenarioLayer.image.width * scale;
      const height = naveEscenarioLayer.image.height * scale;

      ctx.drawImage(
        naveEscenarioLayer.image,
        naveEscenarioLayer.x,
        naveEscenarioLayer.y,
        width,
        height
      );
    }

    // Renderizar ovnis (parte superior centro)
    const ovnisLayer = this.layers[3];
    if (ovnisLayer && ovnisLayer.image) {
      const scale = ovnisLayer.scale || 0.8;
      const width = ovnisLayer.image.width * scale;
      const height = ovnisLayer.image.height * scale;

      ctx.drawImage(
        ovnisLayer.image,
        ovnisLayer.x,
        ovnisLayer.y,
        width,
        height
      );
    }
  }
}

export default Level3State;
