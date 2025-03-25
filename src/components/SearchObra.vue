<template>
  <div class="w-full max-w-4xl mx-auto my-6 bg-[#EDE7DD] p-6 flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
    <label for="searchType" class="text-gray-800 font-semibold w-full sm:w-auto text-center sm:text-left">
      Buscar por:
    </label>

    <select v-model="searchType" id="searchType"
      class="border border-gray-400 rounded-xl p-3 text-gray-800 bg-white shadow-sm focus:ring-2 focus:ring-[#C25500] outline-none w-full sm:w-auto">
      <option value="titulo">Título</option>
      <option value="autor">Artista</option>
      <option value="categorias">Categoría</option>
      <option value="todos">Todos</option>
    </select>

    <input v-model="searchQuery" type="text" placeholder="Escribe aquí..."
      class="border border-gray-400 rounded-xl p-3 text-gray-800 bg-white shadow-sm focus:ring-2 focus:ring-[#C25500] outline-none w-full flex-grow"
      @keyup.enter="searchWorks">

    <button @click="searchWorks" :disabled="isLoading || !searchQuery.trim()"
      class="bg-[#C25500] text-white font-semibold px-5 py-3 rounded-xl hover:bg-[#A04400] transition shadow-md hover:shadow-lg w-full sm:w-auto text-center flex items-center justify-center gap-2">
      <MagnifyingGlassIcon class="h-5 w-5" />
      {{ isLoading ? 'Buscando...' : 'Buscar' }}
    </button>
  </div>

  <!-- Visualización de búsqueda actual -->
  <div v-if="searchQuery" class="max-w-4xl mx-auto mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
    <div class="flex flex-wrap items-center gap-3">
      <span class="text-gray-700 font-medium">Búsqueda actual:</span>
      <span class="bg-[#EDE7DD] px-3 py-1 rounded-full text-sm flex items-center gap-1">
        <span class="text-[#C25500] font-medium">{{ getSearchTypeName(searchType) }}:</span>
        "{{ searchQuery }}"
      </span>
      <span v-if="searchResults.length" class="ml-auto bg-gray-100 px-3 py-1 rounded-full text-sm">
        {{ searchResults.length }} resultado{{ searchResults.length !== 1 ? 's' : '' }}
      </span>
      <button @click="resetSearch" class="ml-auto text-[#C25500] hover:underline flex items-center gap-1 text-sm">
        <ArrowPathIcon class="h-4 w-4" />
        Limpiar
      </button>
    </div>

    <!-- Historial rápido (opcional) -->
    <div v-if="searchHistory.length" class="mt-3 pt-3 border-t border-gray-100">
      <h4 class="text-sm text-gray-500 mb-2">Búsquedas recientes:</h4>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="(search, index) in searchHistory"
          :key="index"
          @click="applyHistorySearch(search)"
          class="text-xs bg-gray-50 hover:bg-[#EDE7DD] px-2 py-1 rounded-full border border-gray-200 flex items-center gap-1"
        >
          <ArrowPathIcon class="h-3 w-3 text-gray-400" />
          {{ getSearchTypeName(search.type) }}: "{{ search.query }}"
        </button>
      </div>
    </div>
  </div>

<!-- Resultados -->
<div v-if="searchResults.length > 0" class="max-w-6xl mx-auto">
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <div v-for="work in searchResults" :key="work.slug" class="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
      <img
        :src="work.imagenUrl || 'https://via.placeholder.com/400x300?text=Imagen+no+disponible'"
        :alt="work.titulo"
        class="w-full h-64 object-cover"
      />
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
              <!-- Botón para ver más detalles -->
      <router-link
        :to="`/obra/${work.id}`"
        class="mt-4 inline-block bg-[#C25500] text-white font-semibold px-4 py-2 rounded-xl hover:bg-[#A04400] transition-shadow shadow-md hover:shadow-lg text-center"
      >
        Ver más detalles
      </router-link>
      </div>
    </div>
  </div>

  <!-- Botón "Cargar más" más grande -->
  <button
    v-if="searchResults.length >= pagination.take"
    @click="loadMore"
    :disabled="isLoading"
    class="mt-8 mx-auto bg-[#EDE7DD] hover:bg-[#E0D5C3] text-[#C25500] font-semibold text-lg px-6 py-3 rounded-lg flex items-center gap-3"
  >
    <ArrowPathIcon v-if="isLoading" class="h-5 w-5 animate-spin" />
    {{ isLoading ? 'Cargando...' : 'Cargar más' }}
  </button>
</div>


  <!-- Estado vacío -->
  <div v-else-if="searchQuery && !isLoading" class="max-w-4xl mx-auto mt-8 text-center py-12">
    <div class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <MagnifyingGlassIcon class="h-10 w-10 text-gray-400" />
    </div>
    <h3 class="text-xl font-medium text-gray-700">No se encontraron resultados</h3>
    <p class="text-gray-500 mt-2">Intenta con otros términos de búsqueda</p>
    <button @click="resetSearch" class="mt-4 text-[#C25500] hover:underline flex items-center justify-center gap-1 mx-auto">
      <ArrowPathIcon class="h-4 w-4" />
      Reiniciar búsqueda
    </button>
  </div>

  <!-- Estado de carga -->
  <div v-if="isLoading" class="max-w-4xl mx-auto mt-8 text-center py-12">
    <div class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <ArrowPathIcon class="h-10 w-10 text-[#C25500] animate-spin" />
    </div>
    <h3 class="text-xl font-medium text-gray-700">Buscando obras...</h3>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { apiRequest } from '@/api/apiClient';
import { MagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';

// Estados reactivos
const emit = defineEmits(['update:isSearching']);
const searchQuery = ref('');
const searchType = ref('titulo');
const searchResults = ref<any[]>([]);
const isLoading = ref(false);
const isPopular = ref(false);
const searchHistory = ref<Array<{type: string, query: string}>>([]);
const pagination = ref({
  skip: 0,
  take: 20
});

// Mapeo de nombres para tipos de búsqueda
const searchTypeNames: Record<string, string> = {
  titulo: 'Título',
  artista: 'Artista',
  categorias: 'Categoría',
  todos: 'Todos'
};

// Obtener nombre legible del tipo de búsqueda
const getSearchTypeName = (type: string) => {
  return searchTypeNames[type] || type;
};

// Función de búsqueda principal
const searchWorks = async () => {
  if (!searchQuery.value.trim()) return;

  try {
    isLoading.value = true;
    pagination.value.skip = 0;

    // Agregar al historial
    addToSearchHistory(searchType.value, searchQuery.value);

    const params = {
      [searchType.value === 'todos' ? 'titulo' : searchType.value]: searchQuery.value,
      populares: isPopular.value,
      skip: pagination.value.skip,
      take: pagination.value.take
    };

    const response = await apiRequest("obra.buscar", params);
    searchResults.value = response;
    emit('update:isSearching', searchResults.value.length > 0);
  } catch (error) {
    console.error("Error al buscar obras:", error);
    searchResults.value = [];
    emit('update:isSearching', false);
  } finally {
    isLoading.value = false;
  }
};

// Cargar más resultados
const loadMore = async () => {
  if (isLoading.value) return;

  try {
    isLoading.value = true;
    pagination.value.skip += pagination.value.take;

    const params = {
      [searchType.value === 'todos' ? 'titulo' : searchType.value]: searchQuery.value,
      populares: isPopular.value,
      skip: pagination.value.skip,
      take: pagination.value.take
    };

    const response = await apiRequest("obra.buscar", params);
    searchResults.value = [...searchResults.value, ...response];

  } catch (error) {
    console.error("Error al cargar más obras:", error);
  } finally {
    isLoading.value = false;
  }
};

// Resetear búsqueda
const resetSearch = () => {
  searchQuery.value = '';
  searchResults.value = [];
  pagination.value.skip = 0;
  isPopular.value = false;
  emit('update:isSearching', false);
};

// Manejar historial de búsquedas
const addToSearchHistory = (type: string, query: string) => {
  // Evitar duplicados
  if (searchHistory.value.some(item => item.type === type && item.query === query)) {
    return;
  }

  // Limitar a 5 búsquedas recientes
  searchHistory.value = [
    { type, query },
    ...searchHistory.value.slice(0, 4)
  ];
};

// Aplicar búsqueda del historial
const applyHistorySearch = (search: {type: string, query: string}) => {
  searchType.value = search.type;
  searchQuery.value = search.query;
  searchWorks();
};
</script>
