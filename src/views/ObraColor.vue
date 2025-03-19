<template>
  <div>
    <div class="paper-sizes">
      <h2>Selecciona un Tamaño de Papel</h2>
      <select v-model="selectedSize" @change="calculatePrice">
        <option v-for="(size, key) in paperSizes" :key="key" :value="key">
          {{ key }} ({{ size }} cm²)
        </option>
      </select>
    </div>
    <div class="contenedorPadre">
      <div class="upload-area">
        <div class="upload-icon">
          <img src="https://static-00.iconduck.com/assets.00/upload-icon-2048x2048-eu9n5hco.png" alt="Upload Icon" />
        </div>
        <p>Click to upload or drag and drop</p>
        <input type="file" @change="handleFileUpload" accept="image/*, application/pdf" />
      </div>
      <canvas ref="canvas" style="display:none;"></canvas>
      <div>
        <div v-for="(label, key) in colors" :key="key" class="cmyk">
          <label>{{ label }}:</label>
          <div class="progress-bar" v-if="colorPercentages[key] > 0">
            <div class="progress-fill" :class="key" :style="{ width: colorPercentages[key] + '%' }"></div>
            <span>{{ colorPercentages[key].toFixed(2) }}%</span>
          </div>
        </div>
        <div>
          <label for="quantity">¿Cuántas unidades quieres cotizar?</label>
          <input type="number" v-model.number="quantity" min="1" @input="calculatePrice" />
        </div>
        <div id="price-display">Precio total: ${{ totalPrice.toFixed(2) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const paperSizes = {
  carta: 601.44,
  legal: 767.76,
  tabloide: 1204.08,
  bond: 601.44,
  oficio: 712.8,
  A4: 623.7,
  A5: 310.8,
  B5: 440,
  C5: 370.38,
  half_letter: 302.4,
  executive: 491.88,
  ledger: 1204.08,
  index_card: 96.32,
  postcard: 155.04,
  greeting_card: 151.2,
  etiqueta: 45
};

const colors = {
  C: 'Cyan',
  M: 'Magenta',
  Y: 'Yellow',
  K: 'Black'
};

const selectedSize = ref<keyof typeof paperSizes>('carta');
const quantity = ref(1);
const colorPercentages = ref({ C: 0, M: 0, Y: 0, K: 0 });
const canvas = ref<HTMLCanvasElement | null>(null);
const totalPrice = computed(() => {
  const paperArea = paperSizes[selectedSize.value];
  const { C, M, Y, K } = colorPercentages.value;
  const unitPrice = ((C / 100) + (M / 100) + (Y / 100) + (K / 100 * 0.7)) * (paperArea / 45);
  return unitPrice * quantity.value;
});

const calculatePrice = () => {
  // Se recalcula automáticamente gracias a computed()
};

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];
  const img = new Image();
  img.src = URL.createObjectURL(file);
  img.onload = () => {
    if (!canvas.value) return;
    const ctx = canvas.value.getContext('2d');
    if (!ctx) return;

    canvas.value.width = img.width;
    canvas.value.height = img.height;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.value.width, canvas.value.height);
    const data = imageData.data;
    const totalPixels = canvas.value.width * canvas.value.height;

    let totalC = 0, totalM = 0, totalY = 0, totalK = 0;

    for (let i = 0; i < data.length; i += 4) {
      const [c, m, y, k] = rgbToCmyk(data[i], data[i + 1], data[i + 2]);
      totalC += c;
      totalM += m;
      totalY += y;
      totalK += k;
    }

    colorPercentages.value = {
      C: (totalC / totalPixels) * 100,
      M: (totalM / totalPixels) * 100,
      Y: (totalY / totalPixels) * 100,
      K: (totalK / totalPixels) * 100
    };
  };
};

const rgbToCmyk = (r: number, g: number, b: number): [number, number, number, number] => {
  const rf = r / 255, gf = g / 255, bf = b / 255;
  const k = 1 - Math.max(rf, gf, bf);
  return [
    (1 - rf - k) / (1 - k) || 0,
    (1 - gf - k) / (1 - k) || 0,
    (1 - bf - k) / (1 - k) || 0,
    k
  ];
};
</script>

<style scoped>
.body {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.upload-area {
  border: 2px dashed #007BFF;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  background-color: #f9f9f9;
}
.progress-bar {
  width: 100%;
  height: 25px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  transition: width 0.3s ease-in-out;
}
.C { background-color: #00bcd4; }
.M { background-color: #e91e63; }
.Y { background-color: #ffeb3b; }
.K { background-color: #000; }
</style>
