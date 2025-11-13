// Clase base para los niveles del juego
import { loader } from "../../engine/loader.js";

class BaseLevel {
  constructor(canvas, stateManager, levelNumber) {
    this.canvas = canvas;
    this.stateManager = stateManager;
    this.levelNumber = levelNumber;
    this.isLoading = true;
    this.assetsLoaded = false;

    // Game state variables
    this.levelProgress = 0;
    this.playerHealth = 100;
    this.levelCompleted = false;

    // Botón de menú
    this.menuButton = {
      x: 20,
      y: 20,
      width: 0,
      height: 0,
      scale: 2.5,
    };

    // Configuración de barras HUD
    this.bars = {
      progress: {
        x: 0,
        y: 20,
        width: 200,
        height: 20,
        backgroundColor: "rgba(50, 50, 50, 0.8)",
        fillColor: "#4bd",
        borderColor: "#fff",
      },
      health: {
        x: 0,
        y: 60,
        width: 200,
        height: 20,
        backgroundColor: "rgba(50, 50, 50, 0.8)",
        fillColor: "#0f0",
        borderColor: "#fff",
      },
    };

    // Calcular posición X de las barras (esquina superior derecha)
    this.bars.progress.x = this.canvas.width - this.bars.progress.width - 15;
    this.bars.health.x = this.canvas.width - this.bars.health.width - 15;

    // Capas parallax (se sobrescribe en cada nivel)
    this.layers = [];

    // Nave del jugador
    this.naveTerrestre = {
      image: null,
      x: 100,
      y: 200,
      width: 100,
      height: 100,
      speed: 300,
      velocityY: 0,
      health: 100,
      maxHealth: 100,
      isDestroyed: false,
      isFalling: false,
      fallSpeed: 0,
      fallAcceleration: 400,
    };

    // Sistema de balas del jugador
    this.bullets = [];
    this.bulletSpeed = 500;
    this.bulletWidth = 50;
    this.bulletHeight = 10;
    this.canShoot = true;
    this.shootCooldown = 0.2;
    this.shootTimer = 0;

    // Sistema de enemigos
    this.enemies = [];
    this.enemySpeed = 150;
    this.enemyVerticalSpeed = 100;
    this.enemyWidth = 80;
    this.enemyHeight = 80;
    this.maxEnemies = 10;
    this.enemySpawnTimer = 0;
    this.enemySpawnInterval = 2;
    this.enemiesSpawned = 0;
    this.enemiesDestroyed = 0;
    this.enemyHealth = 3;
    this.enemyDamage = 10;

    // Sistema de balas enemigas
    this.enemyBullets = [];
    this.enemyBulletSpeed = 400;
    this.enemyBulletWidth = 70;
    this.enemyBulletHeight = 30;
    this.enemyShootCooldown = 1.5;

    // Control de teclas
    this.keys = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowRight: false,
    };

    // Box2D - Sistema de física
    this.world = null;
    this.physicsBodies = new Map();
    this.SCALE = 30;
    this.physicsInitialized = false;

    // Inicializar Box2D
    this.initBox2D();
  }

  // ========== SISTEMA DE FÍSICA BOX2D ==========

  initBox2D() {
    try {
      if (typeof Box2D === "undefined") {
        console.warn(
          "Box2D no está disponible. Usando colisiones AABB simples."
        );
        this.physicsInitialized = false;
        return;
      }

      const b2Vec2 = Box2D.Common.Math.b2Vec2;
      const b2World = Box2D.Dynamics.b2World;
      const b2BodyDef = Box2D.Dynamics.b2BodyDef;
      const b2Body = Box2D.Dynamics.b2Body;
      const b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
      const b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
      const b2ContactListener = Box2D.Dynamics.b2ContactListener;

      this.b2Vec2 = b2Vec2;
      this.b2World = b2World;
      this.b2BodyDef = b2BodyDef;
      this.b2Body = b2Body;
      this.b2FixtureDef = b2FixtureDef;
      this.b2PolygonShape = b2PolygonShape;

      const gravity = new b2Vec2(0, 20);
      this.world = new b2World(gravity, true);

      const contactListener = new b2ContactListener();
      contactListener.BeginContact = (contact) => {
        this.handleBox2DCollision(contact);
      };

      this.world.SetContactListener(contactListener);

      this.physicsInitialized = true;
      console.log("Box2D inicializado correctamente");
    } catch (error) {
      console.error("Error al inicializar Box2D:", error);
      this.physicsInitialized = false;
    }
  }

  createPhysicsBody(x, y, width, height, type, userData) {
    if (!this.physicsInitialized) return null;

    const bodyDef = new this.b2BodyDef();

    if (type === "dynamic") {
      bodyDef.type = this.b2Body.b2_dynamicBody;
    } else if (type === "kinematic") {
      bodyDef.type = this.b2Body.b2_kinematicBody;
    } else {
      bodyDef.type = this.b2Body.b2_staticBody;
    }

    bodyDef.position.Set(
      (x + width / 2) / this.SCALE,
      (y + height / 2) / this.SCALE
    );

    bodyDef.userData = userData;

    const body = this.world.CreateBody(bodyDef);

    const fixtureDef = new this.b2FixtureDef();
    fixtureDef.density = 1.0;
    fixtureDef.friction = 0.0;
    fixtureDef.restitution = 0.0;

    const shape = new this.b2PolygonShape();
    shape.SetAsBox(width / 2 / this.SCALE, height / 2 / this.SCALE);
    fixtureDef.shape = shape;

    body.CreateFixture(fixtureDef);

    return body;
  }

  handleBox2DCollision(contact) {
    const bodyA = contact.GetFixtureA().GetBody();
    const bodyB = contact.GetFixtureB().GetBody();

    const dataA = bodyA.GetUserData();
    const dataB = bodyB.GetUserData();

    if (!dataA || !dataB) return;

    if (
      (dataA.type === "playerBullet" && dataB.type === "enemy") ||
      (dataA.type === "enemy" && dataB.type === "playerBullet")
    ) {
      const bullet = dataA.type === "playerBullet" ? dataA : dataB;
      const enemy = dataA.type === "enemy" ? dataA : dataB;
      this.handlePlayerBulletHitsEnemy(bullet, enemy);
    }

    if (
      (dataA.type === "enemyBullet" && dataB.type === "player") ||
      (dataA.type === "player" && dataB.type === "enemyBullet")
    ) {
      const bullet = dataA.type === "enemyBullet" ? dataA : dataB;
      this.handleEnemyBulletHitsPlayer(bullet);
    }
  }

  handlePlayerBulletHitsEnemy(bullet, enemy) {
    bullet.shouldRemove = true;

    if (enemy.entity && !enemy.entity.isFalling) {
      enemy.entity.health--;
      console.log(
        `¡Impacto! Enemigo salud: ${enemy.entity.health}/${enemy.entity.maxHealth}`
      );

      if (enemy.entity.health <= 0) {
        enemy.entity.isFalling = true;
        enemy.entity.fallSpeed = 0;
        this.enemiesDestroyed++;

        if (enemy.body) {
          enemy.body.SetType(this.b2Body.b2_dynamicBody);
        }

        console.log(
          `¡Enemigo destruido! ${this.enemiesDestroyed}/${this.maxEnemies}`
        );
      }
    }
  }

  handleEnemyBulletHitsPlayer(bullet) {
    bullet.shouldRemove = true;

    if (this.naveTerrestre && !this.naveTerrestre.isFalling) {
      this.naveTerrestre.health -= this.enemyDamage;
      this.playerHealth = this.naveTerrestre.health;

      console.log(
        `¡Nave terrestre impactada! Salud: ${this.naveTerrestre.health}/${this.naveTerrestre.maxHealth}`
      );

      if (this.naveTerrestre.health <= 0) {
        this.naveTerrestre.isFalling = true;
        this.naveTerrestre.fallSpeed = 0;
        this.playerHealth = 0;

        const playerBody = this.physicsBodies.get("player");
        if (playerBody) {
          playerBody.SetType(this.b2Body.b2_dynamicBody);
        }

        console.log("¡Nave terrestre destruida!");
      }
    }
  }

  syncPhysicsToEntities() {
    if (!this.physicsInitialized) return;

    this.bullets.forEach((bullet, index) => {
      const body = this.physicsBodies.get(`playerBullet_${index}`);
      if (body) {
        const pos = body.GetPosition();
        bullet.x = pos.x * this.SCALE - bullet.width / 2;
        bullet.y = pos.y * this.SCALE - bullet.height / 2;

        if (bullet.shouldRemove) {
          this.world.DestroyBody(body);
          this.physicsBodies.delete(`playerBullet_${index}`);
        }
      }
    });

    this.enemies.forEach((enemy, index) => {
      const body = this.physicsBodies.get(`enemy_${index}`);
      if (body) {
        const pos = body.GetPosition();
        enemy.x = pos.x * this.SCALE - enemy.width / 2;
        enemy.y = pos.y * this.SCALE - enemy.height / 2;
      }
    });

    this.enemyBullets.forEach((bullet, index) => {
      const body = this.physicsBodies.get(`enemyBullet_${index}`);
      if (body) {
        const pos = body.GetPosition();
        bullet.x = pos.x * this.SCALE - bullet.width / 2;
        bullet.y = pos.y * this.SCALE - bullet.height / 2;

        if (bullet.shouldRemove) {
          this.world.DestroyBody(body);
          this.physicsBodies.delete(`enemyBullet_${index}`);
        }
      }
    });

    this.bullets = this.bullets.filter((b) => !b.shouldRemove);
    this.enemyBullets = this.enemyBullets.filter((b) => !b.shouldRemove);
  }

  // ========== CONFIGURACIÓN DE DIFICULTAD ==========

  configureDifficulty(difficulty) {
    switch (difficulty) {
      case "facil":
        this.maxEnemies = 10;
        this.enemySpawnInterval = 3;
        this.enemyShootCooldown = 2;
        this.enemyHealth = 2;
        this.enemyDamage = 5;
        break;
      case "medio":
        this.maxEnemies = 20;
        this.enemySpawnInterval = 2;
        this.enemyShootCooldown = 1.5;
        this.enemyHealth = 3;
        this.enemyDamage = 10;
        break;
      case "dificil":
        this.maxEnemies = 30;
        this.enemySpawnInterval = 1.5;
        this.enemyShootCooldown = 1;
        this.enemyHealth = 5;
        this.enemyDamage = 15;
        break;
      default:
        this.maxEnemies = 20;
        this.enemySpawnInterval = 2;
        this.enemyShootCooldown = 1.5;
        this.enemyHealth = 3;
        this.enemyDamage = 10;
    }
    console.log(
      `Nivel ${this.levelNumber} - Dificultad: ${difficulty} - ${this.maxEnemies} enemigos con ${this.enemyHealth} HP`
    );
  }

  // ========== CICLO DE VIDA DEL ESTADO ==========

  enter() {
    console.log(`Entrando al Nivel ${this.levelNumber}`);
    this.isLoading = true;
    this.assetsLoaded = false;

    const settingsState = this.stateManager.states["settings"];
    if (settingsState) {
      const difficulty = settingsState.getSettings().difficulty;
      this.configureDifficulty(difficulty);
    } else {
      this.configureDifficulty("medio");
    }

    this.loadLevelAssets();
  }

  // Método abstracto - debe ser sobrescrito en cada nivel
  async loadLevelAssets() {
    throw new Error("loadLevelAssets() debe ser implementado en la subclase");
  }

  exit() {
    console.log(`Saliendo del Nivel ${this.levelNumber}`);
  }

  // ========== ACTUALIZACIÓN DEL JUEGO ==========

  update(dt) {
    if (this.physicsInitialized && this.world) {
      const velocityIterations = 8;
      const positionIterations = 3;
      this.world.Step(dt, velocityIterations, positionIterations);
      this.world.ClearForces();
      this.syncPhysicsToEntities();
    }

    if (this.naveTerrestre.isDestroyed) {
      this.updateNaveTerrestre(dt);
      return;
    }

    if (!this.canShoot) {
      this.shootTimer -= dt;
      if (this.shootTimer <= 0) {
        this.canShoot = true;
      }
    }

    if (this.keys.ArrowRight && this.canShoot) {
      this.shoot();
    }

    this.updateNaveTerrestre(dt);
    this.updateBullets(dt);
    this.updateEnemySpawn(dt);
    this.updateEnemies(dt);
    this.updateEnemyBullets(dt);
    this.checkCollisions();
    this.updateProgress();
  }

  updateNaveTerrestre(dt) {
    if (this.naveTerrestre.isFalling) {
      this.naveTerrestre.fallSpeed += this.naveTerrestre.fallAcceleration * dt;
      this.naveTerrestre.y += this.naveTerrestre.fallSpeed * dt;

      if (this.naveTerrestre.y > this.canvas.height) {
        this.naveTerrestre.isDestroyed = true;
        console.log("Game Over - Nave terrestre destruida");

        const gameOverState = this.stateManager.states["gameOver"];
        if (gameOverState) {
          gameOverState.setBackgroundState(this, `level${this.levelNumber}`);
          this.stateManager.setState("gameOver");
        }
      }
      return;
    }

    this.naveTerrestre.velocityY = 0;

    if (this.keys.ArrowUp) {
      this.naveTerrestre.velocityY = -this.naveTerrestre.speed;
    }
    if (this.keys.ArrowDown) {
      this.naveTerrestre.velocityY = this.naveTerrestre.speed;
    }

    this.naveTerrestre.y += this.naveTerrestre.velocityY * dt;

    const minY = 0;
    const maxY = this.canvas.height - this.naveTerrestre.height;

    if (this.naveTerrestre.y < minY) {
      this.naveTerrestre.y = minY;
    }
    if (this.naveTerrestre.y > maxY) {
      this.naveTerrestre.y = maxY;
    }
  }

  shoot() {
    const bullet = {
      x: this.naveTerrestre.x + this.naveTerrestre.width,
      y:
        this.naveTerrestre.y +
        this.naveTerrestre.height / 2 -
        this.bulletHeight / 2,
      width: this.bulletWidth,
      height: this.bulletHeight,
      speed: this.bulletSpeed,
      scale: 2,
      image: loader.getImage("bala"),
    };

    this.bullets.push(bullet);

    this.canShoot = false;
    this.shootTimer = this.shootCooldown;

    console.log("¡Disparo! Balas activas:", this.bullets.length);
  }

  updateBullets(dt) {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      bullet.x += bullet.speed * dt;

      if (bullet.x > this.canvas.width) {
        this.bullets.splice(i, 1);
      }
    }
  }

  updateEnemySpawn(dt) {
    if (this.enemiesSpawned >= this.maxEnemies) {
      return;
    }

    this.enemySpawnTimer += dt;

    if (this.enemySpawnTimer >= this.enemySpawnInterval) {
      this.spawnEnemy();
      this.enemySpawnTimer = 0;
    }
  }

  // Método abstracto - puede ser sobrescrito en cada nivel para comportamiento específico
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
      image: loader.getImage(`nave_extraterrestre_n${this.levelNumber}`),
      verticalDirection: Math.random() > 0.5 ? 1 : -1,
      verticalAmplitude: 100,
      verticalCenter: randomY,
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
      } en Y=${Math.round(randomY)}`
    );
  }

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

      if (enemy.x > this.naveTerrestre.x + this.naveTerrestre.width + 50) {
        enemy.x -= enemy.speed * dt;
      }

      enemy.y += enemy.verticalDirection * enemy.verticalSpeed * dt;

      const distanceFromCenter = Math.abs(enemy.y - enemy.verticalCenter);
      if (distanceFromCenter > enemy.verticalAmplitude / 2) {
        enemy.verticalDirection *= -1;
      }

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

      if (!enemy.isFalling) {
        enemy.shootTimer += dt;
        if (enemy.shootTimer >= this.enemyShootCooldown) {
          this.enemyShoot(enemy);
          enemy.shootTimer = 0;
        }
      }

      if (enemy.x + enemy.width < 0) {
        this.enemies.splice(i, 1);
      }
    }
  }

  enemyShoot(enemy) {
    const bullet = {
      x: enemy.x,
      y: enemy.y + enemy.height / 2 - this.enemyBulletHeight / 2,
      width: this.enemyBulletWidth,
      height: this.enemyBulletHeight,
      speed: -this.enemyBulletSpeed,
      scale: 3,
      image: loader.getImage("bala_enemiga"),
    };

    this.enemyBullets.push(bullet);
  }

  updateEnemyBullets(dt) {
    for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
      const bullet = this.enemyBullets[i];
      bullet.x += bullet.speed * dt;

      if (bullet.x + bullet.width < 0) {
        this.enemyBullets.splice(i, 1);
      }
    }
  }

  // ========== DETECCIÓN DE COLISIONES ==========

  checkCollisions() {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];

      for (let j = this.enemies.length - 1; j >= 0; j--) {
        const enemy = this.enemies[j];

        if (enemy.isFalling) continue;

        if (this.checkAABBCollision(bullet, enemy)) {
          this.bullets.splice(i, 1);

          enemy.health--;
          console.log(
            `¡Impacto! Enemigo recibió daño. Salud restante: ${enemy.health}/${enemy.maxHealth}`
          );

          if (enemy.health <= 0) {
            enemy.isFalling = true;
            enemy.fallSpeed = 0;
            this.enemiesDestroyed++;
            console.log(
              `¡Enemigo destruido! Total destruidos: ${this.enemiesDestroyed}/${this.maxEnemies}`
            );
          }

          break;
        }
      }
    }

    for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
      const bullet = this.enemyBullets[i];

      if (this.naveTerrestre.isFalling) continue;

      if (this.checkAABBCollision(bullet, this.naveTerrestre)) {
        this.enemyBullets.splice(i, 1);

        this.naveTerrestre.health -= this.enemyDamage;
        this.playerHealth = this.naveTerrestre.health;

        console.log(
          `¡Nave terrestre impactada! Salud restante: ${this.naveTerrestre.health}/${this.naveTerrestre.maxHealth}`
        );

        if (this.naveTerrestre.health <= 0) {
          this.naveTerrestre.isFalling = true;
          this.naveTerrestre.fallSpeed = 0;
          this.playerHealth = 0;
          console.log("¡Nave terrestre destruida! Iniciando caída...");
        }
      }
    }
  }

  checkAABBCollision(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  updateProgress() {
    if (this.maxEnemies > 0) {
      this.levelProgress = (this.enemiesDestroyed / this.maxEnemies) * 100;
    }

    if (this.enemiesDestroyed >= this.maxEnemies && !this.levelCompleted) {
      this.levelCompleted = true;
      console.log("¡Nivel completado!");

      const levelCompleteState = this.stateManager.states["levelComplete"];
      if (levelCompleteState) {
        levelCompleteState.setBackgroundState(
          this,
          `level${this.levelNumber}`,
          this.levelNumber
        );
        this.stateManager.setState("levelComplete");
      }
    }
  }

  // ========== RENDERIZADO ==========

  render(ctx) {
    if (this.isLoading) {
      this.renderLoading(ctx);
      return;
    }

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.renderParallaxLayers(ctx);
    this.renderMainElements(ctx);
    this.renderHUD(ctx);
  }

  renderLoading(ctx) {
    const fondoCarga = loader.getImage("fondo_carga");
    if (fondoCarga) {
      ctx.drawImage(fondoCarga, 0, 0, this.canvas.width, this.canvas.height);
    } else {
      ctx.fillStyle = "#0f0f10";
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    ctx.save();
    ctx.translate(this.canvas.width / 2, this.canvas.height / 2);

    const time = Date.now() / 1000;
    ctx.rotate(time * 2);

    for (let i = 0; i < 8; i++) {
      ctx.save();
      ctx.rotate((Math.PI * 2 * i) / 8);
      ctx.beginPath();
      ctx.arc(30, 0, 5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(75, 187, 221, ${1 - i * 0.12})`;
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();

    ctx.fillStyle = "#eee";
    ctx.font = "24px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(
      `Cargando Nivel ${this.levelNumber}...`,
      this.canvas.width / 2,
      this.canvas.height / 2 + 80
    );

    const progress = loader.getProgress();
    const barWidth = 400;
    const barHeight = 20;
    const barX = (this.canvas.width - barWidth) / 2;
    const barY = this.canvas.height / 2 + 120;

    ctx.strokeStyle = "#eee";
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
    ctx.fillStyle = "#4bd";
    ctx.fillRect(barX, barY, barWidth * progress, barHeight);
  }

  // Método abstracto - debe ser sobrescrito en cada nivel
  renderParallaxLayers(ctx) {
    throw new Error(
      "renderParallaxLayers() debe ser implementado en la subclase"
    );
  }

  renderMainElements(ctx) {
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

    this.enemyBullets.forEach((bullet) => {
      if (bullet.image) {
        ctx.drawImage(
          bullet.image,
          bullet.x,
          bullet.y,
          bullet.width,
          bullet.height
        );
      } else {
        ctx.fillStyle = "#f00";
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      }
    });

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
            6,
            healthPercent
          );
        }
      } else {
        ctx.fillStyle = "#f00";
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      }
    });
  }

  renderHUD(ctx) {
    const menuImg = loader.getImage("menu");
    if (menuImg) {
      const scaledWidth = menuImg.width * this.menuButton.scale;
      const scaledHeight = menuImg.height * this.menuButton.scale;

      ctx.drawImage(
        menuImg,
        this.menuButton.x,
        this.menuButton.y,
        scaledWidth,
        scaledHeight
      );

      this.menuButton.width = scaledWidth;
      this.menuButton.height = scaledHeight;
    }

    this.drawProgressBar(
      ctx,
      this.bars.progress.x,
      this.bars.progress.y,
      this.bars.progress.width,
      this.bars.progress.height,
      this.levelProgress,
      this.bars.progress.backgroundColor,
      this.bars.progress.fillColor,
      this.bars.progress.borderColor,
      "Progreso"
    );

    this.drawProgressBar(
      ctx,
      this.bars.health.x,
      this.bars.health.y,
      this.bars.health.width,
      this.bars.health.height,
      this.playerHealth,
      this.bars.health.backgroundColor,
      this.bars.health.fillColor,
      this.bars.health.borderColor,
      "Vida"
    );
  }

  drawProgressBar(
    ctx,
    x,
    y,
    width,
    height,
    percentage,
    bgColor,
    fillColor,
    borderColor,
    label
  ) {
    percentage = Math.max(0, Math.min(100, percentage));

    ctx.fillStyle = bgColor;
    ctx.fillRect(x, y, width, height);

    const fillWidth = (width * percentage) / 100;
    ctx.fillStyle = fillColor;
    ctx.fillRect(x, y, fillWidth, height);

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    ctx.fillStyle = "#fff";
    ctx.font = "bold 12px system-ui";
    ctx.textAlign = "left";
    ctx.fillText(`${label}:`, x, y - 5);

    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 11px system-ui";
    ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
    ctx.shadowBlur = 3;
    ctx.fillText(
      `${Math.round(percentage)}%`,
      x + width / 2,
      y + height / 2 + 4
    );
    ctx.shadowBlur = 0;
  }

  renderHealthBar(ctx, x, y, width, height, healthPercent) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(x, y, width, height);

    let barColor;
    if (healthPercent > 0.6) {
      barColor = "#0f0";
    } else if (healthPercent > 0.3) {
      barColor = "#ff0";
    } else {
      barColor = "#f00";
    }

    const healthWidth = width * healthPercent;
    ctx.fillStyle = barColor;
    ctx.fillRect(x, y, healthWidth, height);

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);
  }

  // ========== MANEJO DE EVENTOS ==========

  handleClick(x, y) {
    if (
      x >= this.menuButton.x &&
      x <= this.menuButton.x + this.menuButton.width &&
      y >= this.menuButton.y &&
      y <= this.menuButton.y + this.menuButton.height
    ) {
      console.log("Botón de menú presionado - Pausando juego");
      const pauseState = this.stateManager.states["pause"];
      if (pauseState) {
        pauseState.setBackgroundState(this, `level${this.levelNumber}`);
        this.stateManager.setState("pause");
      }
      return "menu";
    }
  }

  handleKeyDown(key) {
    if (key === "ArrowUp" || key === "ArrowDown" || key === "ArrowRight") {
      this.keys[key] = true;
    }

    if (key === "Escape") {
      console.log("Pausando juego");
      const pauseState = this.stateManager.states["pause"];
      if (pauseState) {
        pauseState.setBackgroundState(this, `level${this.levelNumber}`);
        this.stateManager.setState("pause");
      }
    }
  }

  handleKeyUp(key) {
    if (key === "ArrowUp" || key === "ArrowDown" || key === "ArrowRight") {
      this.keys[key] = false;
    }
  }

  // ========== REINICIO DEL NIVEL ==========

  restart() {
    console.log(`Reiniciando Nivel ${this.levelNumber}`);
    this.isLoading = true;
    this.assetsLoaded = false;

    this.levelProgress = 0;
    this.playerHealth = 100;
    this.levelCompleted = false;

    this.naveTerrestre.x = 100;
    this.naveTerrestre.y = 200;
    this.naveTerrestre.velocityY = 0;
    this.naveTerrestre.health = 100;
    this.naveTerrestre.isDestroyed = false;
    this.naveTerrestre.isFalling = false;
    this.naveTerrestre.fallSpeed = 0;

    this.bullets = [];
    this.canShoot = true;
    this.shootTimer = 0;

    this.enemies = [];
    this.enemySpawnTimer = 0;
    this.enemiesSpawned = 0;
    this.enemiesDestroyed = 0;
    this.enemyBullets = [];

    this.keys.ArrowUp = false;
    this.keys.ArrowDown = false;
    this.keys.ArrowRight = false;

    const settingsState = this.stateManager.states["settings"];
    if (settingsState) {
      const difficulty = settingsState.getSettings().difficulty;
      this.configureDifficulty(difficulty);
    }

    this.loadLevelAssets();
  }
}

export default BaseLevel;
