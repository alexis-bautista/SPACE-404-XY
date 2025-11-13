// Sistema de precarga de assets (imágenes, audio)

class Loader {
  constructor() {
    this.images = {};
    this.sounds = {};
    this.totalAssets = 0;
    this.loadedAssets = 0;
  }

  // Cargar una imagen
  loadImage(key, src) {
    this.totalAssets++;
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.images[key] = img;
        this.loadedAssets++;
        resolve(img);
      };
      img.onerror = () => {
        console.error(`Error al cargar imagen: ${src}`);
        reject(new Error(`No se pudo cargar: ${src}`));
      };
      img.src = src;
    });
  }

  // Cargar múltiples imágenes
  loadImages(imageMap) {
    const promises = [];
    for (const [key, src] of Object.entries(imageMap)) {
      promises.push(this.loadImage(key, src));
    }
    return Promise.all(promises);
  }

  // Obtener una imagen cargada
  getImage(key) {
    return this.images[key];
  }

  // Obtener progreso de carga (0 a 1)
  getProgress() {
    return this.totalAssets === 0 ? 1 : this.loadedAssets / this.totalAssets;
  }

  // Verificar si todas las imágenes están cargadas
  isComplete() {
    return this.loadedAssets === this.totalAssets;
  }
}

// Exportar instancia única del loader
export const loader = new Loader();
