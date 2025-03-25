<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Search from '@/components/SearchObra.vue';
import { apiRequest } from '@/api/apiClient';

const router = useRouter();
const img = ref<Array<{ id: string; imagenUrl: string; titulo: string }>>([]);
const isSearching = ref(false);

const fetchObras = async () => {
  try {
    const response = await apiRequest("obra.buscar",{populares:true});
    img.value = response ?? [];
  } catch (error) {
    console.error("Error al obtener las obras:", error);
  }
};

// Función para redirigir a la vista de detalles
const verDetalles = (id: string) => {
  router.push({ path: `/DetalleProducto/${id}` });
};

onMounted(fetchObras);

const baseUrl = import.meta.env.VITE_APP_URL;

const getImageUrl = (path: any) => {
  return path ? `${baseUrl}${path}` : 'https://via.placeholder.com/400x300?text=Imagen+no+disponible';
};

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

    <div class="w-full mx-auto my-6">
      <Search @update:isSearching="isSearching = $event" />
    </div>

    <!-- Ocultar la galería cuando se está buscando -->
    <div v-if="!isSearching" class="flex flex-col items-center px-6 relative">
      <div v-for="(section, sectionIndex) in sections" :key="sectionIndex" :class="{
        'grid grid-cols-1 sm:grid-cols-2 gap-30 z-10': section.length === 2,
        'grid grid-cols-1 gap-6 z-10': section.length === 1,
        'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 z-10': section.length === 3,
        'mt-12': sectionIndex > 0
      }">
        <div v-for="work in section" :key="work.slug"
        class="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
        <img :src="getImageUrl(work.imagenUrl) || 'https://via.placeholder.com/400x300?text=Imagen+no+disponible'" :alt="work.titulo"
          class="w-full h-64 object-cover" />
        <div class="p-6">
          <h3 class="font-bold text-2xl text-gray-800 mb-2">{{ work.titulo }}</h3>
          <p class="text-base text-gray-600 mb-4">
            <span class="font-medium">Artista:</span> {{ work.artistaNombre || 'Desconocido' }}
          </p>
          <p class="text-[#C25500] font-bold text-xl">
            {{ work.precio ? `$${work.precio.toLocaleString()}` : 'Precio no disponible' }}
          </p>
          <p v-if="work.descripcion" class="text-gray-500 text-base mt-3 line-clamp-3">
            {{ work.descripcion }}
          </p>
          <button @click="verDetalles(work.slug)"
            class="mt-4 bg-[#C25500] text-white font-semibold px-4 py-2 rounded-xl hover:bg-[#A04400] transition-shadow shadow-md hover:shadow-lg">
            Ver más detalles
          </button>
        </div>
      </div>
      </div>

      <!-- Fondo decorativo -->
      <div class="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div class="absolute top-[10%] left-0 w-[20rem] h-16 sm:w-[110rem] sm:h-35 bg-[#C25500]"></div>
        <div class="absolute top-[30%] left-0 w-[90%] h-16 sm:w-[70rem] sm:h-35 bg-neutral-900"></div>
        <div class="absolute top-[47%] right-0 w-2/3 h-16 sm:h-35 bg-orange-500"></div>
        <div class="absolute bottom-[20%] right-0 w-[85%] h-16 sm:w-[65rem] sm:h-35 bg-[#C25500]"></div>
        <div class="absolute bottom-0 left-0 w-[90%] h-16 sm:w-[85rem] sm:h-35 bg-[#552306]"></div>
      </div>
    </div>
  </div>
</template>
