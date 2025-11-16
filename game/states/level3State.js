// Estado del Nivel 3 con efecto Parallax - Escenario Final
import { loader } from "../../engine/loader.js";
import BaseLevel from "./baseLevel.js";

class Level3State extends BaseLevel {
  constructor(canvas, stateManager) {
    super(canvas, stateManager, 3);

    // Dimensiones de enemigos diferentes para el nivel 3
    this.enemyWidth = 120;
    this.enemyHeight = 60;

    // Sistema de asteroides
    this.asteroids = [];
    this.asteroidSpawnTimer = 0;
    this.asteroidSpawnInterval = 3; // Cada 3 segundos aparece un asteroide
    this.maxAsteroids = 5; // Máximo de asteroides en pantalla

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

  // Configuración de dificultad del Nivel 3
  configureDifficulty(difficulty) {
    const configs = {
      facil: { maxEnemies: 8, spawnInterval: 3, shootCooldown: 1.8, health: 5, damage: 10 },
      medio: { maxEnemies: 12, spawnInterval: 2.5, shootCooldown: 1.5, health: 8, damage: 15 },
      dificil: { maxEnemies: 15, spawnInterval: 2, shootCooldown: 1.2, health: 12, damage: 20 }
    };
    
    const config = configs[difficulty] || configs.medio;
    this.maxEnemies = config.maxEnemies;
    this.enemySpawnInterval = config.spawnInterval;
    this.enemyShootCooldown = config.shootCooldown;
    this.enemyHealth = config.health;
    this.enemyDamage = config.damage;
    
    console.log(`Nivel 3 - ${difficulty} - ${this.maxEnemies} enemigos con ${this.enemyHealth} HP`);
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
      isPoison: Math.random() < 0.2 // 20% veneno
    });
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

  // Spawn de enemigos con escudos (30% de probabilidad)
  spawnEnemy() {
    const minY = 50;
    const maxY = this.canvas.height - this.enemyHeight - 50;
    const randomY = minY + Math.random() * (maxY - minY);
    
    const hasShield = Math.random() < 0.3; // 30% tienen escudo

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
      hasShield: hasShield,
      shieldHealth: hasShield ? 3 : 0, // El escudo absorbe 3 disparos
      maxShieldHealth: 3,
      isDestroyed: false,
      isFalling: false,
      fallSpeed: 0,
      fallAcceleration: 400,
    };

    this.enemies.push(enemy);
    this.enemiesSpawned++;
    console.log(
      `Enemigo spawneado ${this.enemiesSpawned}/${this.maxEnemies} en Y=${Math.round(randomY)} - HP: ${this.enemyHealth}${hasShield ? ' [ESCUDO]' : ''}`
    );
  }

  // Spawn de asteroides desde la derecha
  spawnAsteroid() {
    if (this.asteroids.length >= this.maxAsteroids) return;

    const randomY = Math.random() * (this.canvas.height - 80);
    const size = 40 + Math.random() * 40; // Tamaño entre 40-80px
    const speed = 100 + Math.random() * 150; // Velocidad horizontal variable

    const asteroid = {
      x: this.canvas.width + size, // Aparece a la derecha de la pantalla
      y: randomY,
      width: size,
      height: size,
      speed: speed,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 3,
      damage: 8, // Daño al jugador
    };

    this.asteroids.push(asteroid);
    console.log(`Asteroide spawneado en Y=${Math.round(randomY)}`);
  }

  // Actualizar asteroides
  updateAsteroids(dt) {
    // Spawn de nuevos asteroides
    this.asteroidSpawnTimer += dt;
    if (this.asteroidSpawnTimer >= this.asteroidSpawnInterval) {
      this.spawnAsteroid();
      this.asteroidSpawnTimer = 0;
    }

    // Mover asteroides de derecha a izquierda
    for (let i = this.asteroids.length - 1; i >= 0; i--) {
      const asteroid = this.asteroids[i];
      
      asteroid.x -= asteroid.speed * dt;
      asteroid.rotation += asteroid.rotationSpeed * dt;

      // Verificar colisión con el jugador
      if (!this.naveTerrestre.isFalling && this.checkAABBCollision(asteroid, this.naveTerrestre)) {
        this.naveTerrestre.health -= asteroid.damage;
        this.playerHealth = this.naveTerrestre.health;
        this.asteroids.splice(i, 1);
        
        if (window.playSoundEffect) {
          window.playSoundEffect('impactSound');
        }

        console.log(`¡Impacto de asteroide! -${asteroid.damage} HP | Salud: ${this.naveTerrestre.health}`);

        if (this.naveTerrestre.health <= 0) {
          this.naveTerrestre.isFalling = true;
          this.naveTerrestre.fallSpeed = 0;
          this.playerHealth = 0;
        }
        continue;
      }

      // Eliminar asteroides fuera de pantalla (por la izquierda)
      if (asteroid.x + asteroid.width < 0) {
        this.asteroids.splice(i, 1);
      }
    }
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

  // Actualización general del nivel 3
  update(dt) {
    super.update(dt); // Llamar al update de BaseLevel
    this.updateAsteroids(dt); // Agregar sistema de asteroides
  }

  renderParallaxLayers(ctx) {
    if (this.layers[0].image) {
      ctx.drawImage(this.layers[0].image, 0, 0, this.canvas.width, this.canvas.height);
    }

    // Renderizar capas con escala
    [1, 2, 3].forEach(i => {
      const layer = this.layers[i];
      if (!layer?.image) return;
      
      const scale = layer.scale || 1;
      const width = layer.image.width * scale;
      const height = layer.image.height * scale;
      const y = i === 1 ? this.canvas.height - height : layer.y;
      
      ctx.drawImage(layer.image, layer.x, y, width, height);
    });
  }

  renderPoisonBullet(ctx, bullet) {
    ctx.save();
    const pulse = Math.sin(Date.now() / 100) * 0.3 + 0.7;
    const cx = bullet.x + bullet.width / 2;
    const cy = bullet.y + bullet.height / 2;
    
    // Aura eléctrica
    const aura = ctx.createRadialGradient(cx, cy, 0, cx, cy, bullet.width * pulse);
    aura.addColorStop(0, '#a0f');
    aura.addColorStop(0.4, '#80d');
    aura.addColorStop(1, 'rgba(128, 0, 255, 0)');
    ctx.fillStyle = aura;
    ctx.fillRect(bullet.x - 10, bullet.y - 10, bullet.width + 20, bullet.height + 20);
    
    // Núcleo
    const core = ctx.createLinearGradient(bullet.x, bullet.y, bullet.x + bullet.width, bullet.y + bullet.height);
    core.addColorStop(0, '#d0f');
    core.addColorStop(0.5, '#a0d');
    core.addColorStop(1, '#80c');
    ctx.fillStyle = core;
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    
    // Chispas
    ctx.strokeStyle = '#f0f';
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + (Math.random() - 0.5) * 20, cy + (Math.random() - 0.5) * 20);
      ctx.stroke();
    }
    
    // Borde
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(bullet.x, bullet.y, bullet.width, bullet.height);
    ctx.restore();
  }

  renderShield(ctx, enemy) {
    const alpha = (enemy.shieldHealth / enemy.maxShieldHealth) * 0.6 + 0.2;
    const pulse = Math.sin(Date.now() / 200) * 0.2 + 0.8;
    const cx = enemy.x + enemy.width / 2;
    const cy = enemy.y + enemy.height / 2;
    
    ctx.save();
    ctx.globalAlpha = alpha * pulse;
    
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, enemy.width * 0.7);
    gradient.addColorStop(0, 'rgba(0, 150, 255, 0.3)');
    gradient.addColorStop(0.7, 'rgba(0, 200, 255, 0.6)');
    gradient.addColorStop(1, 'rgba(0, 255, 255, 0.8)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, enemy.width * 0.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0ff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  renderAsteroid(ctx, asteroid) {
    ctx.save();
    ctx.translate(asteroid.x + asteroid.width / 2, asteroid.y + asteroid.height / 2);
    ctx.rotate(asteroid.rotation);
    ctx.fillStyle = '#5a4a3a';
    ctx.strokeStyle = '#3a2a1a';
    ctx.lineWidth = 2;
    
    // Polígono irregular
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const variance = 0.7 + Math.random() * 0.3;
      const radius = (asteroid.width / 2) * variance;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Detalles
    ctx.fillStyle = '#4a3a2a';
    ctx.beginPath();
    ctx.arc(-asteroid.width * 0.15, -asteroid.height * 0.1, asteroid.width * 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(asteroid.width * 0.1, asteroid.height * 0.15, asteroid.width * 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  renderMainElements(ctx) {
    // Balas del jugador
    this.bullets.forEach(b => {
      b.image ? ctx.drawImage(b.image, b.x, b.y, b.width, b.height) : 
                (ctx.fillStyle = "#ff0", ctx.fillRect(b.x, b.y, b.width, b.height));
    });

    // Balas enemigas
    const balaImg = loader.getImage("bala_enemiga");
    this.enemyBullets.forEach(b => {
      if (b.isPoison) this.renderPoisonBullet(ctx, b);
      else if (balaImg) ctx.drawImage(balaImg, b.x, b.y, b.width, b.height);
      else (ctx.fillStyle = "#f00", ctx.fillRect(b.x, b.y, b.width, b.height));
    });

    // Nave del jugador
    if (this.naveTerrestre.image && !this.naveTerrestre.isDestroyed) {
      const hp = this.naveTerrestre.health / this.naveTerrestre.maxHealth;
      if (hp < 0.3 && Math.floor(Date.now() / 200) % 2 === 0) ctx.globalAlpha = 0.5;
      ctx.drawImage(this.naveTerrestre.image, this.naveTerrestre.x, this.naveTerrestre.y, 
                    this.naveTerrestre.width, this.naveTerrestre.height);
      ctx.globalAlpha = 1.0;
    }

    // Enemigos
    this.enemies.forEach(e => {
      if (!e.image) return (ctx.fillStyle = "#f00", ctx.fillRect(e.x, e.y, e.width, e.height));
      
      if (e.isFalling) {
        ctx.save();
        ctx.translate(e.x + e.width / 2, e.y + e.height / 2);
        ctx.rotate(Math.PI / 4);
        ctx.drawImage(e.image, -e.width / 2, -e.height / 2, e.width, e.height);
        ctx.restore();
      } else {
        ctx.drawImage(e.image, e.x, e.y, e.width, e.height);
        if (e.hasShield && e.shieldHealth > 0) this.renderShield(ctx, e);
        this.renderHealthBar(ctx, e.x, e.y - 10, e.width, 5, e.health / e.maxHealth);
      }
    });

    // Asteroides
    this.asteroids.forEach(a => this.renderAsteroid(ctx, a));
  }
}

export default Level3State;
