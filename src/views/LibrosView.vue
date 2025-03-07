<script setup lang="ts">
import { onMounted, ref } from "vue";
import { apiRequest } from "@/api/apiClient";

interface Libro{
    id:number,
    titulo:string
}

const libros = ref<Libro[]>([]);

onMounted(async () => {
  try {
    libros.value = await apiRequest("libro.listar");
  } catch (error) {
    console.error("Error cargando libros:", error);
  }
});
</script>

<template>
  <ul>
    <li v-for="libro in libros" :key="libro.id">{{ libro.titulo }}</li>
  </ul>
</template>