<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { apiRequest } from '@/api/apiClient';
import axios from "axios";


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

interface Exposicion {
  id: string;
  nombre: string;
  obras: string;
  fechaInicio: string;
  fechaFin: string;
}

const exposiciones = ref<Exposicion[]>([]);
const obras = ref<Artwork[]>([]);
const exposicionSeleccionadaId = ref<string | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);
const isLoadingObras = ref(false);

// Función para obtener todas las exposiciones
const fetchExposiciones = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    const response = await apiRequest("exposicion.listar");

    if (!response || !response.data) {
      throw new Error("La respuesta del servidor no contiene datos");
    }

    exposiciones.value = Array.isArray(response.data) ? response.data : [];
    console.log("Exposiciones cargadas:", exposiciones.value.length);
  } catch (err) {
    console.error("Error fetching exposiciones:", err);
    error.value = err.message || "Error al cargar las exposiciones";
  } finally {
    isLoading.value = false;
  }
};

// Función para obtener obras de una exposición específica
const fetchObrasPorExposicion = async (id: string) => {
  try {
    isLoadingObras.value = true;
    error.value = null;
    exposicionSeleccionadaId.value = id;

    const response = await axios.get(`https://localhost:7044/api/Obra/exposicion/listar/${id}`);


    if (!response) {
      throw new Error("No se recibió respuesta del servidor");
    }

    // Manejo flexible de la respuesta
    obras.value = Array.isArray(response.data) ? response.data :
                 Array.isArray(response) ? response : [];

    console.log("Obras cargadas:", obras.value.length);

    if (obras.value.length === 0) {
      console.warn("No se encontraron obras para esta exposición");
    }
  } catch (err) {
    console.error("Error fetching obras:", err);
    error.value = err.message || "Error al cargar las obras";
  } finally {
    isLoadingObras.value = false;
  }
};

// Función para volver al listado de exposiciones
const volverAExposiciones = () => {
  exposicionSeleccionadaId.value = null;
  obras.value = [];
  error.value = null;
};

// Obtener exposiciones al cargar el componente
onMounted(() => {
  fetchExposiciones();
});
const baseUrl = import.meta.env.VITE_APP_URL;

const getImageUrl = (path: any) => {
  return path ? `${baseUrl}${path}` : 'https://via.placeholder.com/400x300?text=Imagen+no+disponible';
};

// Computed para organizar las obras en secciones visuales
const sections = computed(() => {
  const pattern = [2, 1, 2, 3];
  let index = 0;
  const result = [];

  while (index < obras.value.length) {
    for (const size of pattern) {
      if (index >= obras.value.length) break;
      result.push(obras.value.slice(index, index + size));
      index += size;
    }
  }
  return result;
});

// Computed para obtener el nombre de la exposición seleccionada
const nombreExposicionSeleccionada = computed(() => {
  if (!exposicionSeleccionadaId.value) return '';
  const expo = exposiciones.value.find(e => e.id === exposicionSeleccionadaId.value);
  return expo ? expo.nombre : 'Exposición desconocida';
});
</script>

<template>
  <div class="bg-[#EDE7DD] min-h-screen relative">
    <!-- Fondo decorativo -->
    <div class="absolute top-0 left-0 w-full h-full pointer-events-none z-0 opacity-20">
      <div class="absolute top-[10%] left-0 w-[20rem] h-16 sm:w-[110rem] sm:h-35 bg-[#C25500] transform -rotate-6"></div>
      <div class="absolute top-[30%] left-0 w-[90%] h-16 sm:w-[70rem] sm:h-35 bg-neutral-900 transform rotate-3"></div>
      <div class="absolute top-[47%] right-0 w-2/3 h-16 sm:h-35 bg-orange-500 transform -rotate-12"></div>
      <div class="absolute bottom-[20%] right-0 w-[85%] h-16 sm:w-[65rem] sm:h-35 bg-[#C25500] transform rotate-6"></div>
      <div class="absolute bottom-0 left-0 w-[90%] h-16 sm:w-[85rem] sm:h-35 bg-[#552306] transform -rotate-3"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Título principal -->
      <h1 class="flex flex-col items-center py-10 px-6 text-5xl font-extrabold text-gray-900 tracking-wide">
        {{ exposicionSeleccionadaId ? nombreExposicionSeleccionada : 'Exposiciones' }}
        <span class="text-xl font-normal mt-2 text-gray-600">
          {{ exposicionSeleccionadaId ? 'Obras de esta exposición' : 'Explora nuestra colección de obras de arte' }}
        </span>
      </h1>

      <!-- Botón de volver cuando hay exposición seleccionada -->
      <div v-if="exposicionSeleccionadaId" class="px-6 pt-2 pb-6">
        <button @click="volverAExposiciones"
                class="flex items-center text-orange-600 hover:text-orange-800 transition-colors">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Volver a todas las exposiciones
        </button>
      </div>

      <!-- Estado de carga general -->
      <div v-if="isLoading && !exposicionSeleccionadaId" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        <span class="ml-4 text-gray-700">Cargando exposiciones...</span>
      </div>
<!-- Mensaje de error general -->
<div v-else-if="error" class="flex flex-col items-center text-center py-10 px-6 bg-red-50 border border-red-300 rounded-lg shadow-md">
  <svg class="w-12 h-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M8 8h8m-4 12a9 9 0 100-18 9 9 0 000 18z"></path>
  </svg>
  <div class="text-red-600 text-2xl font-semibold mb-2">{{ error }}</div>
  <p class="text-gray-600 text-lg mb-4">No se encontraron obras en esta exposición o ocurrió un problema al cargar los datos.</p>
  <button @click="exposicionSeleccionadaId ? fetchObrasPorExposicion(exposicionSeleccionadaId) : fetchExposiciones()"
          class="px-5 py-2.5 bg-orange-500 text-white font-medium text-lg rounded-lg hover:bg-orange-600 transition-all">
    Reintentar
  </button>
</div>


      <!-- Listado de exposiciones -->
      <div v-if="!exposicionSeleccionadaId && !isLoading && !error"
           class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
        <div v-for="exposicion in exposiciones" :key="exposicion.id"
             class="relative group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden cursor-pointer"
             @click="fetchObrasPorExposicion(exposicion.id)">

          <div class="p-6">
            <h3 class="text-gray-900 text-2xl font-extrabold mb-2">{{ exposicion.nombre }}</h3>
            <div class="flex items-center gap-3 text-gray-600 text-sm mb-2">
              <svg class="w-5 h-5 text-[#C25500]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16a4 4 0 100-8 4 4 0 000 8zM2 8a6 6 0 1112 0A6 6 0 012 8zm10.93 5.93A5.97 5.97 0 0016 8a6 6 0 10-12 0 5.97 5.97 0 003.07 5.93l-.57 3.57A1 1 0 008 18h4a1 1 0 00.97-.76l.57-3.57z"></path>
              </svg>
              <span class="font-medium">{{ exposicion.obras }} obras</span>
            </div>
            <p class="text-sm text-gray-600 mb-2">
              Exposición:
              <span class="font-semibold text-gray-800">{{ exposicion.fechaInicio }}</span> -
              <span class="font-semibold text-gray-800">{{ exposicion.fechaFin }}</span>
            </p>
          </div>

          <div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r bg-[#C25500] transition-opacity duration-300 opacity-75 group-hover:opacity-100"></div>
        </div>
      </div>

      <!-- Sección de obras cuando hay exposición seleccionada -->
      <div v-if="exposicionSeleccionadaId" class="mt-4">
        <!-- Estado de carga de obras -->
        <div v-if="isLoadingObras" class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <span class="ml-4 text-gray-700">Cargando obras...</span>
        </div>

        <!-- Mensaje cuando no hay obras -->
        <div v-else-if="obras.length === 0 && !error" class="text-center py-10">
          <div class="text-gray-500 text-xl">No se encontraron obras en esta exposición</div>
        </div>

        <!-- Listado de obras -->
        <div v-else class="flex flex-col items-center px-6 relative pb-20 w-full max-w-7xl mx-auto">
          <div v-for="(section, sectionIndex) in sections" :key="sectionIndex" class="grid gap-10 z-10 w-full" :class="{
            'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4': section.length >= 3,
            'grid-cols-1 sm:grid-cols-2 md:grid-cols-2': section.length === 2,
            'grid-cols-1 max-w-2xl': section.length === 1,
            'mt-12': sectionIndex > 0
          }">
          
            <div v-for="(artwork, index) in section" :key="index"
                 class="relative group overflow-hidden rounded-2xl cursor-pointer bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">

                 <RouterLink :to="'/DetalleProducto/'+artwork.slug">
              <div class="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                <img :src="getImageUrl(artwork.imagenUrl) || '/placeholder-artwork.jpg'" :alt="artwork.titulo"
                     class="w-full h-[400px] sm:h-[500px] md:h-[550px] object-cover transition-transform duration-500 group-hover:scale-110">
              </div>

              <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 flex flex-col justify-end p-6 transition-opacity duration-300">
                <div class="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 class="text-white text-2xl font-extrabold mb-1">{{ artwork.titulo }}</h3>
                  <div class="flex items-center justify-between">
                    <span class="text-orange-300 font-semibold text-xl">{{ artwork.precio }} €</span>
                    <span v-if="artwork.disponibilidad"
                          class="bg-green-500 text-white text-sm px-3 py-1 rounded-full font-medium">
                      Disponible
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
                  <span class="text-orange-600 font-bold text-lg">{{ artwork.precio }} €</span>
                </div>
                <div class="mt-3 flex items-center justify-between text-base text-gray-500">
                  <span>{{ artwork.tecnica }}</span>
                  <span>{{ artwork.añoCreacion }}</span>
                </div>
              </div>
            </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
