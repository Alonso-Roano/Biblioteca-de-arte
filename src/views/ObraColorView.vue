<template>
  <div class="p-8 bg-[#f5edd9] min-h-screen space-y-10 ">

    <h1 class="flex flex-col items-center py-2 px-6 text-5xl font-extrabold text-gray-900 tracking-wide">
        Composicion de color
        <span class="text-xl font-normal mt-2 text-gray-600">
          Verifica cuanta tinta usan tus pinturas
        </span>
      </h1>
    <div class="flex flex-col md:flex-row gap-8">


      <div class="flex-1 bg-white p-6 rounded-lg shadow-md space-y-6">

        <div>
          <label class="block mb-2 font-medium text-gray-700">Cargar Nueva Obra</label>
        <div
  class="border-2 border-dashed border-gray-300 hover:border-blue-400 p-6 text-center rounded-md cursor-pointer transition-all flex flex-col justify-center items-center"
  @dragover.prevent
  @drop="handleFileDrop"
  style="height: 300px;">
  <img src="https://static-00.iconduck.com/assets.00/upload-icon-2048x2048-eu9n5hco.png"
    alt="Upload Icon" class="w-12 h-12 mx-auto mb-2" />
  <p class="text-sm text-gray-600 mb-2">Haz clic o arrastra una imagen</p>
  <input type="file" @change="handleFileUpload" accept="image/*, application/pdf"
    class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
    file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
</div>

        </div>

        <div>
          <label class="block mb-2 font-medium text-gray-700">Tipo de Papel</label>
          <select v-model="selectedSize" @change="calculatePrice"
            class="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring focus:ring-orange-300">
            <option v-for="(size, key) in paperSizes" :key="key" :value="key">
              {{ key }} ({{ size }} cm²)
            </option>
          </select>
        </div>

        <div>
          <label class="block mb-2 font-medium text-gray-700">Tipo de Material</label>
          <select v-model="selectedMaterial" @change="calculatePrice"
            class="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring focus:ring-orange-300">
            <option v-for="(material, key) in materials" :key="key" :value="key">
              {{ material }}
            </option>
          </select>
        </div>

      </div>


      <div class="flex-1 bg-white p-6 rounded-lg shadow-md space-y-6">
        <div v-if="uploadedImage">
          <h3 class="text-lg font-semibold mb-3">Imagen Seleccionada</h3>
          <img :src="uploadedImage" alt="Imagen Cargada"
            class="w-full h-[300px] object-contain rounded-md shadow-md" />
        </div>
        <canvas ref="canvas" style="display: none;"></canvas>

<div v-if="uploadedImage">
  <h3 class="text-lg font-semibold mb-3">Análisis de Colores</h3>
  <div v-for="(label, key) in colors" :key="key" class="mb-4">
    <label class="text-sm font-medium text-gray-700">{{ label }}:</label>
    <div class="relative w-full h-4 bg-gray-200 rounded overflow-hidden mt-1">
      <div class="absolute h-full top-0 left-0" :class="key"
        :style="{ width: colorPercentages[key] + '%' }">
      </div>
      <span class="absolute right-2 top-0 text-xs text-gray-700">
        {{ colorPercentages[key].toFixed(2) }}%
      </span>
    </div>
  </div>


  <div class="mt-6" v-if="totalPrice.value !== undefined">
    <h4 class="text-lg font-semibold text-gray-700">Precio Estimado:</h4>
    <div class="text-xl font-bold text-green-500">
      {{ totalPrice.value.toFixed(2) }} USD
    </div>
  </div>

  <div v-else class="mt-6 text-sm text-gray-500">
    Calculando precio...
  </div>
</div>

      </div>
    </div>


  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import imageColor from '@/assets/images/imageColor.png';
import imageColor2 from '@/assets/images/imageColor2.png';

const localImages = [
  imageColor,
  imageColor2,
];

const selectImage = (img) => {
  uploadedImage.value = img;
  processImage(img);
};

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

const materials = {
  pvc: 'PVC',
  canvas: 'Lona',
  photo: 'Fotográfico',
  paper: 'Papel'
};

const colors = {
  C: 'Cyan',
  M: 'Magenta',
  Y: 'Yellow',
  K: 'Black'
};

const selectedSize = ref('carta');
const selectedMaterial = ref('photo');
const quantity = ref(1);
const colorPercentages = ref({ C: 0, M: 0, Y: 0, K: 0 });
const canvas = ref(null);
const uploadedImage = ref(null);

const materialPrices = {
  pvc: 15,
  canvas: 20,
  photo: 25,
  paper: 10
};

const totalPrice = computed(() => {
  const paperArea = paperSizes[selectedSize.value];
  const materialPrice = materialPrices[selectedMaterial.value];

  if (!paperArea || !materialPrice) {
    return 0;
  }

  const { C, M, Y, K } = colorPercentages.value;
    const colorFactor = ((C / 100) + (M / 100) + (Y / 100) + (K / 100));

  if (isNaN(colorFactor)) {
    return 0;
  }

const unitPrice = materialPrice * (paperArea / 45) * colorFactor;

  return unitPrice * quantity.value;
});

const calculatePrice = () => {
  console.log("Selected Size:", selectedSize.value);
  console.log("Selected Material:", selectedMaterial.value);
  console.log("Quantity:", quantity.value);
  console.log("Color Percentages:", colorPercentages.value);
};

const handleFileUpload = (event) => {
  const input = event.target;
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];
  uploadedImage.value = URL.createObjectURL(file);
  processImage(file);
};

const handleFileDrop = (event) => {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  if (file) {
    uploadedImage.value = URL.createObjectURL(file);
    processImage(file);
  }
};

const processImage = (file) => {
  const img = new Image();
  img.src = uploadedImage.value;
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

    // Calculando los valores de color CMYK
    for (let i = 0; i < data.length; i += 4) {
      const [c, m, y, k] = rgbToCmyk(data[i], data[i + 1], data[i + 2]);
      totalC += c;
      totalM += m;
      totalY += y;
      totalK += k;
    }

    const percentages = {
      C: (totalC / totalPixels) * 100,
      M: (totalM / totalPixels) * 100,
      Y: (totalY / totalPixels) * 100,
      K: (totalK / totalPixels) * 100
    };

    console.log("Calculated Color Percentages:", percentages);

    // Se actualiza los porcentajes de color en el cambio
    colorPercentages.value = percentages;

    // Se calcula el precio usando los colores calculados al cambiar
    calculatePrice();
  };
};



const rgbToCmyk = (r, g, b) => {
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

.image-container {
  width: 100%;
  height: 300px;
  background-color: #f3f4f6;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-container img {
  width: auto;
  height: 100%;
  object-fit: contain;
}

.upload-area {
  border: 2px dashed #F4811B;
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

.C { background-color: cyan; }
.M { background-color: magenta; }
.Y { background-color: yellow; }
.K { background-color: black; }


.containColor {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 5%;
  gap: 20px;
}

.containColor img {
  border-radius: 1rem !important;
}

.img-origin img {
  width: 50%;
}

.img-origin {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
}
</style>
