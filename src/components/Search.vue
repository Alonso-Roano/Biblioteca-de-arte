<template>
  <div class="w-full max-w-4xl mx-auto my-6 bg-[#EDE7DD] p-6 flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
    <label for="searchType" class="text-gray-800 font-semibold w-full sm:w-auto text-center sm:text-left">
      Buscar por:
    </label>

    <select v-model="searchType" id="searchType"
      class="border border-gray-400 rounded-xl p-3 text-gray-800 bg-white shadow-sm focus:ring-2 focus:ring-[#C25500] outline-none w-full sm:w-auto">
      <option value="todos">Todos</option>
      <option value="titulo">Título</option>
      <option value="autor">Autor</option>
      <option value="etiqueta">Género</option>
    </select>

    <input v-model="searchQuery" type="text" placeholder="Escribe aquí..."
      class="border border-gray-400 rounded-xl p-3 text-gray-800 bg-white shadow-sm focus:ring-2 focus:ring-[#C25500] outline-none w-full flex-grow">

    <a :href="searchUrl"
      class="bg-[#C25500] text-white font-semibold px-5 py-3 rounded-xl hover:bg-[#A04400] transition shadow-md hover:shadow-lg w-full sm:w-auto text-center">
      Buscar
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const searchType = ref("todos");
const searchQuery = ref("");

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  searchType.value = params.get("buscar") || "todos";
  searchQuery.value = params.get("value") || "";
});

const searchUrl = computed(() => {
  const query = encodeURIComponent(searchQuery.value);
  return `/Libros?buscar=${searchType.value}&value=${query}`;
});
defineOptions({
  name: 'SearchComponent',
});
</script>
