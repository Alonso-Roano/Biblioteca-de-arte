<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { apiRequest } from '@/api/apiClient'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore';

const store = useAuthStore();

const libro = ref({
  id: 0,
  titulo: '',
  color: '#ffffff',
  descripcion: '',
  etiquetaIds: [] as number[],  
  aspNetUserId: store.user?.id,  
  autorNombre: store.user?.nombre, 
})

const route = useRoute()
const router = useRouter()

const etiquetas = ref([])

const fetchEtiquetas = async () => {
  try {
    etiquetas.value = await apiRequest("etiqueta.listar") 
  } catch (error) {
    console.log(error)
  }
}

const actualizarLibro = async () => {
  try {
    const response = await apiRequest("libro.crearUser",{}, libro.value)
    if (response.titulo) {
      router.push('/Libros') 
    }
  } catch (error) {
    console.error("Error actualizando el libro:", error)
  }
}


onMounted(() => {
  fetchEtiquetas()
})
</script>

<template>
  <div class="min-h-screen bg-gray-200 flex flex-col p-6">
    <!-- Breadcrumb y botón Volver fuera del contenedor principal -->
    <div class="w-full flex justify-between">
      <nav class="text-lg text-gray-600">
        <a href="/Libros"><span>Libros > </span></a>
        <a :href="`/Libros?buscar=autor&value=${libro?.autorNombre}`">
          <span class="font-semibold text-[#5d20d3]">Editar > </span>
        </a>
        <span class="text-gray-500">{{ libro?.titulo }}</span>
      </nav>
      <button @click="router.back()" class="text-[#5d20d3] font-semibold mb-4 hover:underline cursor-pointer">
        &larr; Volver
      </button>
    </div>

    <div class="flex flex-col lg:flex-row gap-5">
      <!-- Hoja para escribir la descripción -->
      <div class="w-full lg:w-[70%] bg-white shadow-lg rounded-lg p-6">
        <h2 class="text-xl font-bold text-[#5d20d3] mb-4">Descripción</h2>
        <textarea v-model="libro.descripcion" class="w-full h-80 p-4 border border-gray-300 rounded-md" placeholder="Escribe la descripción aquí..."></textarea>
      </div>

      <!-- Sidebar para ingresar los datos -->
      <div class="w-full lg:w-[30%] bg-white shadow-lg p-6 rounded-lg">
        <h2 class="text-2xl font-bold text-[#5d20d3] mb-4">Editar Libro</h2>
        <form @submit.prevent="actualizarLibro">
          <div class="mb-4">
            <label for="titulo" class="block text-gray-600">Título</label>
            <input v-model="libro.titulo" id="titulo" type="text" class="w-full p-2 border border-gray-300 rounded-md" required />
          </div>
          <div class="mb-4">
            <label for="color" class="block text-gray-600">Color de la portada</label>
            <input v-model="libro.color" id="color" type="color" class="w-full p-2" />
          </div>

          <!-- Mostrar el color seleccionado -->
          <div class="mb-4">
            <label class="block text-gray-600">Vista Previa del Color</label>
            <div :style="{ backgroundColor: libro.color }" class="w-full h-20 rounded-md border mt-2"></div>
          </div>

          <!-- Selector de Etiquetas -->
          <div class="mb-4">
            <label class="block text-gray-600">Etiquetas</label>
            <div class="flex gap-3" v-for="etiqueta in etiquetas" :key="etiqueta.id">
              <input 
                type="checkbox" 
                :id="'etiqueta-' + etiqueta.id"
                :value="etiqueta.id" 
                v-model="libro.etiquetaIds" 
                class="p-checkbox"
              />
              <label :for="'etiqueta-' + etiqueta.id" class="text-gray-600">{{ etiqueta.nombre }}</label>
            </div>
          </div>

          <div class="mb-4">
            <button type="submit" class="w-full bg-[#5d20d3] text-white p-2 rounded-md">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
