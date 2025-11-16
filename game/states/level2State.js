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

  configureDifficulty(difficulty) {
    const configs = {
      facil: { maxEnemies: 15, spawnInterval: 2.5, shootCooldown: 1.8, health: 3, damage: 8 },
      medio: { maxEnemies: 25, spawnInterval: 2, shootCooldown: 1.3, health: 4, damage: 12 },
      dificil: { maxEnemies: 35, spawnInterval: 1.5, shootCooldown: 1, health: 6, damage: 18 }
    };
    
    const config = configs[difficulty] || configs.medio;
    Object.assign(this, {
      maxEnemies: config.maxEnemies,
      enemySpawnInterval: config.spawnInterval,
      enemyShootCooldown: config.shootCooldown,
      enemyHealth: config.health,
      enemyDamage: config.damage
    });
    
    console.log(`Nivel 2 - ${difficulty} - ${this.maxEnemies} enemigos con ${this.enemyHealth} HP`);
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

  renderParallaxLayers(ctx) {
    // Fondo
    if (this.layers[0].image) {
      ctx.drawImage(this.layers[0].image, 0, 0, this.canvas.width, this.canvas.height);
    }

    // Sol con brillo
    if (this.sol) {
      ctx.save();
      const glow = ctx.createRadialGradient(this.sol.x, this.sol.y, 0, this.sol.x, this.sol.y, this.sol.radius * 1.5);
      glow.addColorStop(0, this.sol.color);
      glow.addColorStop(0.5, this.sol.glowColor);
      glow.addColorStop(1, "rgba(255, 215, 0, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(this.sol.x, this.sol.y, this.sol.radius * 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = this.sol.color;
      ctx.beginPath();
      ctx.arc(this.sol.x, this.sol.y, this.sol.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Tierra y Luna
    [1, 2].forEach(i => {
      const layer = this.layers[i];
      if (layer?.image) {
        const scale = layer.scale || 1;
        ctx.drawImage(layer.image, layer.x, layer.y, layer.image.width * scale, layer.image.height * scale);
      }
    });
  }

  enemyShoot(enemy) {
    this.enemyBullets.push({
      x: enemy.x,
      y: enemy.y + enemy.height / 2 - this.enemyBulletHeight / 2,
      width: this.enemyBulletWidth,
      height: this.enemyBulletHeight,
      speed: -this.enemyBulletSpeed,
      scale: 3,
      image: loader.getImage("bala_enemiga"),
      isPoison: Math.random() < 0.3 // 30% veneno
    });
  }

  // Sobrescribir renderizado de balas enemigas para mostrar balas venenosas en morado
  renderMainElements(ctx) {
    // Renderizar balas del jugador
    this.bullets.forEach((bullet) => {
      if (bullet.image) {
        ctx.drawImage(
          bullet.image,
          bullet.x,
          bullet.y,
          bullet.width,
          bullet.height
        );
      } else {
        ctx.fillStyle = "#ff0";
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      }
    });

    // Renderizar balas enemigas (con soporte para balas venenosas)
    const balaEnemigaImg = loader.getImage("bala_enemiga");

    this.enemyBullets.forEach((bullet) => {
      if (bullet.isPoison) {
        // Bala venenosa - morado/púrpura con efecto eléctrico
        ctx.save();
        
        // Efecto de energía eléctrica pulsante
        const pulse = Math.sin(Date.now() / 100) * 0.3 + 0.7;
        const gradient = ctx.createRadialGradient(
          bullet.x + bullet.width / 2,
          bullet.y + bullet.height / 2,
          0,
          bullet.x + bullet.width / 2,
          bullet.y + bullet.height / 2,
          bullet.width * pulse
        );
        gradient.addColorStop(0, '#a0f');
        gradient.addColorStop(0.4, '#80d');
        gradient.addColorStop(1, 'rgba(128, 0, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(
          bullet.x - 10,
          bullet.y - 10,
          bullet.width + 20,
          bullet.height + 20
        );
        
        // Bala venenosa sólida (morado)
        const coreGradient = ctx.createLinearGradient(
          bullet.x, bullet.y,
          bullet.x + bullet.width, bullet.y + bullet.height
        );
        coreGradient.addColorStop(0, '#d0f');
        coreGradient.addColorStop(0.5, '#a0d');
        coreGradient.addColorStop(1, '#80c');
        ctx.fillStyle = coreGradient;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        
        // Chispas eléctricas (líneas aleatorias)
        ctx.strokeStyle = '#f0f';
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
          const offsetX = (Math.random() - 0.5) * 20;
          const offsetY = (Math.random() - 0.5) * 20;
          ctx.beginPath();
          ctx.moveTo(bullet.x + bullet.width / 2, bullet.y + bullet.height / 2);
          ctx.lineTo(
            bullet.x + bullet.width / 2 + offsetX,
            bullet.y + bullet.height / 2 + offsetY
          );
          ctx.stroke();
        }
        
        // Borde brillante
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(bullet.x, bullet.y, bullet.width, bullet.height);
        
        ctx.restore();
      } else if (balaEnemigaImg) {
        // Bala normal
        ctx.drawImage(
          balaEnemigaImg,
          bullet.x,
          bullet.y,
          bullet.width,
          bullet.height
        );
      } else {
        // Fallback bala normal
        ctx.fillStyle = "#f00";
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      }
    });

    // Renderizar nave del jugador
    if (this.naveTerrestre.image && !this.naveTerrestre.isDestroyed) {
      const healthPercent =
        this.naveTerrestre.health / this.naveTerrestre.maxHealth;
      if (healthPercent < 0.3 && Math.floor(Date.now() / 200) % 2 === 0) {
        ctx.globalAlpha = 0.5;
      }

      ctx.drawImage(
        this.naveTerrestre.image,
        this.naveTerrestre.x,
        this.naveTerrestre.y,
        this.naveTerrestre.width,
        this.naveTerrestre.height
      );

      ctx.globalAlpha = 1.0;
    }

    // Renderizar enemigos
    this.enemies.forEach((enemy) => {
      if (enemy.image) {
        if (enemy.isFalling) {
          ctx.save();
          ctx.translate(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
          ctx.rotate(Math.PI / 4);
          ctx.drawImage(
            enemy.image,
            -enemy.width / 2,
            -enemy.height / 2,
            enemy.width,
            enemy.height
          );
          ctx.restore();
        } else {
          ctx.drawImage(
            enemy.image,
            enemy.x,
            enemy.y,
            enemy.width,
            enemy.height
          );

          const healthPercent = enemy.health / enemy.maxHealth;
          this.renderHealthBar(
            ctx,
            enemy.x,
            enemy.y - 10,
            enemy.width,
            5,
            healthPercent
          );
        }
      } else {
        ctx.fillStyle = "#f00";
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      }
    });
  }
}

export default Level2State;
