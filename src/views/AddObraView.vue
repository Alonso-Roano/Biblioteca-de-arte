<template>
  <div class="flex flex-col min-h-[calc(100vh-160px)] w-full bg-[#EEE9DF]">
    <h1 class="flex flex-col items-center py-2 px-6 text-5xl font-extrabold text-gray-900 tracking-wide">
        Agregar nueva obra
        <span class="text-xl font-normal mt-2 text-gray-600">
          Agrega una nueva obra a tu catalogo
        </span>
      </h1>
    <div class="flex flex-col md:flex-row gap-8"></div>
    <div class="flex justify-center items-center flex-1 ">
      
      <div class="flex flex-col lg:flex-row gap-10 w-full py-4 max-w-3xl items-center justify-center">
        <div class="bg-white shadow-lg rounded-2xl p-6 w-[300px]">
          <h2 class="text-lg font-semibold mb-4 text-center">Crear Obra de Arte</h2>
          <div class="mb-4">
            <label for="titulo" class="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input
              type="text"
              id="titulo"
              v-model="titulo"
              class="w-full px-3 py-2 border rounded-md"
              placeholder="Ingresa el título"
            />
          </div>
          <div class="mb-4">
            <label for="descripcion" class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              id="descripcion"
              v-model="descripcion"
              class="w-full px-3 py-2 border rounded-md"
              placeholder="Ingresa la descripción"
            ></textarea>
          </div>

          <!-- Dropdown para Categorías -->
          <div class="mb-4">
            <label for="categoria" class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <Dropdown
              id="categoria"
              v-model="selectedCategoria"
              :options="ListCategories"
              optionLabel="nombre"
              placeholder="Selecciona una categoría"
            />
          </div>

          <div class="mb-4">
            <label for="precio" class="block text-sm font-medium text-gray-700 mb-1">Precio</label>
            <input
              type="text"
              id="precio"
              v-model="precio"
              class="w-full px-3 py-2 border rounded-md"
              placeholder="Ingresa el precio"
            />
          </div>

          <!-- Zona de carga de imagen -->
          <div
            class="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-gray-50 transition mb-4"
            @click="$el.querySelector('input[type=file]').click()"
          >
            <img
              src="https://static-00.iconduck.com/assets.00/upload-icon-2048x2048-eu9n5hco.png"
              alt="Upload Icon"
              class="w-8 h-8 mb-2 opacity-50"
            />
            <p class="text-sm text-gray-500 text-center">Arrastra o selecciona una imagen</p>
            <input type="file" class="hidden" @change="handleFileUpload" accept="image/*, application/pdf" />
          </div>


          <button
            @click="handleSubmit"
            class="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-md transition"
          >
            Enviar
          </button>
        </div>

        <!-- Sección de previsualización y análisis de colores -->
        <div class="flex flex-col items-center lg:items-start justify-center flex-1 py-4 gap-6">
          <img v-if="uploadedImage" :src="uploadedImage" alt="Uploaded Image" class="rounded-xl max-w-xs shadow-md" />
          <div v-else class="flex gap-4">
            <img src="/image/imageColor.png" class="max-w-xs w-full rounded-xl shadow-md" />
            <img src="/image/imageColor2.png" class="max-w-xs w-full rounded-xl shadow-md" />
          </div>
          <div v-if="uploadedImage" class="w-full max-w-sm space-y-4">
            <div v-for="(label, key) in colors" :key="key">
              <label class="text-sm font-medium text-gray-700">{{ label }}:</label>
              <div class="w-full h-4 bg-gray-200 rounded mt-1 overflow-hidden">
                <div
                  class="h-full transition-all duration-300"
                  :class="{
                    'bg-cyan-500': key === 'C',
                    'bg-pink-500': key === 'M',
                    'bg-yellow-400': key === 'Y',
                    'bg-black': key === 'K'
                  }"
                  :style="{ width: colorPercentages[key] + '%' }"
                ></div>
              </div>
              <p class="text-xs text-gray-500 mt-1">{{ colorPercentages[key].toFixed(2) }}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <canvas ref="canvas" style="display: none;"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useToast } from 'primevue/usetoast';
import { createObra, newObra } from '@/composables/obraFunctions.ts';
import { useAuthStore } from '@/stores/authStore.ts'
import Dropdown from 'primevue/dropdown';
import { fetchCategorias2, ListCategories } from '@/composables/categoriaFunctions.ts';


const authStore = useAuthStore()
const IdArtista = authStore.IdArtista as string | number
const toast = useToast();
const uploadedImage = ref<string | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);

const titulo = ref('');
const descripcion = ref('');
const precio = ref(0);
const selectedCategoria = ref<any>(null);

const colors = {
  C: 'Cyan',
  M: 'Magenta',
  Y: 'Yellow',
  K: 'Black'
};

const colorPercentages = ref({ C: 0, M: 0, Y: 0, K: 0 });

onMounted(() => {
  fetchCategorias2();
});

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];
  uploadedImage.value = URL.createObjectURL(file);

  newObra.value.imagen = file;

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

const rgbToCmyk = (r: number, g: number, b: number): number[] => {
  const rf = r / 255, gf = g / 255, bf = b / 255;
  const k = 1 - Math.max(rf, gf, bf);
  return [
    (1 - rf - k) / (1 - k) || 0,
    (1 - gf - k) / (1 - k) || 0,
    (1 - bf - k) / (1 - k) || 0,
    k
  ];
};

const handleSubmit = async () => {
  newObra.value.isDeleted = false;
  newObra.value.titulo = titulo.value;
  newObra.value.descripcion = descripcion.value;
  newObra.value.precio = precio.value;
  newObra.value.artistaId = IdArtista;
  newObra.value.categoriaIds = selectedCategoria.value ? [selectedCategoria.value.id] : [];
  newObra.value.imagenUrl = uploadedImage.value || '';

  const obraId = await createObra(toast);
  if (obraId) {
    console.log("Obra creada con ID:", obraId);
  }
};
</script>
