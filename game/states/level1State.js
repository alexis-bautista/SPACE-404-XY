// Estado del Nivel 1 con efecto Parallax
import { loader } from "../../engine/loader.js";
import BaseLevel from "./baseLevel.js";

class Level1State extends BaseLevel {
  constructor(canvas, stateManager) {
    super(canvas, stateManager, 1);

    // Capas parallax específicas del Nivel 1
    this.layers = [
      {
        name: "fondo",
        image: null,
        x: 0,
        y: 0,
        speed: 0.2,
      },
      {
        name: "edificio1",
        image: null,
        x: 100,
        y: 0,
        speed: 0.5,
      },
      {
        name: "edificio2",
        image: null,
        x: 400,
        y: 0,
        speed: 0.6,
      },
      {
        name: "edificio3",
        image: null,
        x: 700,
        y: 0,
        speed: 0.7,
      },
    ];
  }

  // Sobrescribir método de carga de assets específicos del Nivel 1
  async loadLevelAssets() {
    try {
      console.log("Iniciando carga de assets del Nivel 1...");

      await loader.loadImages({
        escenario_n1: "assets/images/escenarios/escenario_n1.jpg",
        edificio1_n1: "assets/images/escenarios/edificio1_n1.png",
        edificio2_n1: "assets/images/escenarios/edificio2_n1.png",
        edificio3_n1: "assets/images/escenarios/edificio3_n1.png",
        nave_terrestre: "assets/images/naves/nave_terrestre.png",
        nave_extraterrestre_n1:
          "assets/images/naves/nave_extraterrestre_n1.png",
        bala: "assets/images/naves/bala.gif",
        bala_enemiga: "assets/images/naves/bala_enemiga.png",
      });

      this.layers[0].image = loader.getImage("escenario_n1");
      this.layers[1].image = loader.getImage("edificio1_n1");
      this.layers[2].image = loader.getImage("edificio2_n1");
      this.layers[3].image = loader.getImage("edificio3_n1");

      this.naveTerrestre.image = loader.getImage("nave_terrestre");

      console.log("Assets del Nivel 1 cargados correctamente");
      this.assetsLoaded = true;
      this.isLoading = false;
    } catch (error) {
      console.error("Error cargando assets del Nivel 1:", error);
      this.isLoading = false;
    }
  }

  // Sobrescribir renderizado de capas parallax específicas del Nivel 1
  renderParallaxLayers(ctx) {
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

    for (let i = 1; i < this.layers.length; i++) {
      const layer = this.layers[i];
      if (layer.image) {
        const scale = 0.8;
        const width = layer.image.width * scale;
        const height = layer.image.height * scale;
        const yPos = this.canvas.height - height;

        ctx.drawImage(layer.image, layer.x, yPos, width, height);
      }
    }
  }
}

export default Level1State;
