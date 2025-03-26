<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { apiRequest } from '@/api/apiClient';

const router = useRouter();
interface Artwork {
  id: string;
  imagenUrl: string;
  titulo: string;
  artista: string;
  descripcion: string;
  tecnica: string;
  dimensiones: string;
  añoCreacion: string;
  comentarios: string;
  like: string;
  precio: string;
  exposiciones: string;
  categoria: string;
  disponibilidad: boolean;
}
interface exposicion {
  id: string;
  nombre: string;
  obras: string;
  fechaInicio: string;
  fechaFin: string;
}

const Expo = ref<exposicion[]>([]);
const img = ref<Artwork[]>([]);
const isSearching = ref(false);
const isLoading = ref(true);
const error = ref<string | null>(null);

const fetchExposiciones = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    const response = await apiRequest("exposicion.listar");
    Expo.value = response?.data ?? [];
    console.log(Expo.value);
  } catch (err) {
    console.error("Error al obtener las exposiciones:", err);
    error.value = "No se pudo cargar la información de las exposiciones";
  } finally {
    isLoading.value = false;
  }
};

// para ver detalles
const obraSeleccionada = ref<string | null>(null);

const verDetalles = async (id: string) => {
  try {
    isLoading.value = true;
    error.value = null;
    obraSeleccionada.value = id;
    const response = await apiRequest("obra.exposicion", { id }); // Enviamos la ID a la API
    img.value = response?.data ?? [];
    // guardar en la variable global la obra seleccionada para usarla en el DetalleProducto
  } catch (err) {
    console.error("Error al obtener los detalles de la obra:", err);
    error.value = "No se pudo cargar la información de la exposición";
  } finally {
    isLoading.value = false;
  }
};


onMounted(fetchExposiciones);

const sections = computed(() => {
  const pattern = [2, 1, 2, 3];
  let index = 0;
  const result = [];

  while (index < img.value.length) {
    for (const size of pattern) {
      if (index >= img.value.length) break;
      result.push(img.value.slice(index, index + size));
      index += size;
    }
  }
  return result;
});
</script>

<template>
  <div class="bg-[#EDE7DD] min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="flex flex-col items-center py-10 px-6 text-5xl font-extrabold text-gray-900 tracking-wide">
        Exposiciones
        <span class="text-xl font-normal mt-2 text-gray-600">Explora nuestra colección de obras de arte</span>
      </h1>

      <div v-if="!isSearching" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
        <div v-for="(exposicion) in Expo" :key="exposicion.id"
          class="relative group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
          @click="verDetalles(exposicion.id)">

          <div class="p-6">
            <h3 class="text-gray-900 text-2xl font-extrabold mb-2">{{ exposicion.nombre }}</h3>
            <div class="flex items-center gap-3 text-gray-600 text-sm mb-2">
              <svg class="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M8 16a4 4 0 100-8 4 4 0 000 8zM2 8a6 6 0 1112 0A6 6 0 012 8zm10.93 5.93A5.97 5.97 0 0016 8a6 6 0 10-12 0 5.97 5.97 0 003.07 5.93l-.57 3.57A1 1 0 008 18h4a1 1 0 00.97-.76l.57-3.57z">
                </path>
              </svg>
              <span class="font-medium">{{ exposicion.obras }} obras</span>
            </div>
            <p class="text-sm text-gray-600 mb-2">
              Exposición:
              <span class="font-semibold text-gray-800">{{ exposicion.fechaInicio }}</span> -
              <span class="font-semibold text-gray-800">{{ exposicion.fechaFin }}</span>
            </p>
          </div>

          <!-- Línea decorativa inferior -->
          <div
            class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-700 transition-opacity duration-300 opacity-75 group-hover:opacity-100">
          </div>
        </div>
      </div>

      <!-- Sección de obras (solo si hay una exposición seleccionada) -->
      <div v-if="obraSeleccionada" class="mt-10">
        <h2 class="text-3xl font-bold text-center text-gray-900">Obras de la exposición</h2>

        <!-- Estados condicionales unificados -->
        <div class="flex flex-col items-center px-6 relative pb-20 w-full max-w-7xl mx-auto">
          <!-- Estado de carga -->
          <div v-if="isLoading" class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>

          <!-- Mensaje de error -->
          <div v-else-if="error" class="text-center py-10">
            <div class="text-red-500 text-xl font-medium">{{ error }}</div>
            <button @click="verDetalles(obraSeleccionada!)"
              class="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition">
              Reintentar
            </button>
          </div>

          <!-- Sin resultados -->
          <div v-else-if="img.length === 0" class="text-center py-10">
            <div class="text-gray-500 text-xl">No se encontraron obras en esta exposición</div>
          </div>

          <!-- Listado de obras -->
          <div v-else-if="!isSearching">
            <div v-for="(section, sectionIndex) in sections" :key="sectionIndex" class="grid gap-10 z-10" :class="{
              'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4': section.length >= 3,
              'grid-cols-1 sm:grid-cols-2 md:grid-cols-2': section.length === 2,
              'grid-cols-1 max-w-2xl': section.length === 1,
              'mt-12': sectionIndex > 0
            }">
              <div v-for="(artwork, index) in section" :key="index"
                class="relative group overflow-hidden rounded-2xl cursor-pointer bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">

                <div class="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                  <img :src="artwork.imagenUrl" :alt="artwork.titulo"
                    class="w-full h-[400px] sm:h-[500px] md:h-[550px] object-cover transition-transform duration-500 group-hover:scale-110">
                </div>

                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 flex flex-col justify-end p-6 transition-opacity duration-300">
                  <div class="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 class="text-white text-2xl font-extrabold mb-1">{{ artwork.titulo }}</h3>
                    <p class="text-gray-300 text-lg mb-2">Por {{ artwork.artista }}</p>
                    <div class="flex items-center justify-between">
                      <span class="text-orange-300 font-semibold text-xl">{{ artwork.precio }}</span>
                      <span v-if="artwork.disponibilidad"
                        class="bg-green-500 text-white text-sm px-3 py-1 rounded-full font-medium">
                        Disponible
                      </span>
                      <span v-else class="bg-red-500 text-white text-sm px-3 py-1 rounded-full font-medium">
                        Vendido
                      </span>
                    </div>
                  </div>
                </div>

                <div class="p-5 bg-white">
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="text-xl font-semibold text-gray-900 line-clamp-1">{{ artwork.titulo }}</h3>
                      <p class="text-gray-600 text-base">{{ artwork.artista }}</p>
                    </div>
                    <span class="text-orange-600 font-bold text-lg">{{ artwork.precio }}</span>
                  </div>
                  <div class="mt-3 flex items-center justify-between text-base text-gray-500">
                    <span>{{ artwork.tecnica }}</span>
                    <span>{{ artwork.añoCreacion }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Fondo decorativo mejorado -->
        </div>
      </div>
        <div class="absolute top-0 left-0 w-full h-full pointer-events-none z-0 opacity-20">
          <div class="absolute top-[10%] left-0 w-[20rem] h-16 sm:w-[110rem] sm:h-35 bg-[#C25500] transform -rotate-6"></div>
          <div class="absolute top-[30%] left-0 w-[90%] h-16 sm:w-[70rem] sm:h-35 bg-neutral-900 transform rotate-3"></div>
          <div class="absolute top-[47%] right-0 w-2/3 h-16 sm:h-35 bg-orange-500 transform -rotate-12"></div>
          <div class="absolute bottom-[20%] right-0 w-[85%] h-16 sm:w-[65rem] sm:h-35 bg-[#C25500] transform rotate-6"></div>
          <div class="absolute bottom-0 left-0 w-[90%] h-16 sm:w-[85rem] sm:h-35 bg-[#552306] transform -rotate-3"></div>
        </div>
    </div>
  </div>
</template>
