<template>
  <div class="flex flex-col md:flex-row items-center gap-2 bg-white p-4 shadow-md w-full md:w-full mx-auto">
    <label for="searchType" class="text-purple-700 font-semibold">Buscar por:</label>

    <select v-model="searchType" id="searchType" class="border border-gray-400 rounded-md p-2 text-gray-700">
      <option value="todos">Todos</option>
      <option value="titulo">Titulo</option>
      <option value="autor">Autor</option>
      <option value="etiqueta">Género</option>
    </select>

    <input v-model="searchQuery" type="text" placeholder="Escribe aquí..." class="border border-gray-400 rounded-md p-2 flex-grow text-gray-700">

    <a
      :href="searchUrl"
      class="bg-orange-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-orange-600 transition"
    >
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

<style scoped>
div {
  background-color: #fefcff;
}
select, input {
  background-color: #ffffff;
}
a {
  background-color: #f59f01;
  text-align: center;
}
</style>
