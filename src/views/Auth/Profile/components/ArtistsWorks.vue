<script setup lang="ts">
import { onMounted } from 'vue'
import { useArtistProfileStore } from '@/stores/ArtistProfileStore'

const artistStore = useArtistProfileStore()

const baseUrl = import.meta.env.VITE_APP_URL;

const getImageUrl = (path:any) => {
  return `${baseUrl}${path}`;
};

onMounted(() => {
  artistStore.fetchObrasArtista()
})
</script>

<template>
  <div>
    <h2 class="text-lg font-semibold mb-4">Mis Obras</h2>

    <div v-if="artistStore.loading">
      <p>Cargando obras...</p>
    </div>

    <div v-else-if="artistStore.obras.length === 0">
      <p>Aún no tienes una obra subida</p>
    </div>

    <div v-else class="grid md:grid-cols-2 gap-6">
      <div
        v-for="obra in artistStore.obras"
        :key="obra.id"
        class="border rounded-lg overflow-hidden shadow-sm bg-white"
      >
      <RouterLink :to="'/DetalleProducto/'+obra.slug">
        
        <img
          :src="getImageUrl(obra.imagenUrl) || 'https://via.placeholder.com/400x200?text=Sin+imagen'"
          alt="Imagen de la obra"
          class="w-full h-48 object-cover"
        />

        <div class="p-4 space-y-2">
          <h3 class="text-lg font-semibold text-[#F4811B]">{{ obra.titulo }}</h3>
          <p class="text-sm text-gray-600">{{ obra.descripcion || 'Sin descripción.' }}</p>
          <p class="text-sm text-gray-800 font-medium">
            Precio: ${{ obra.precio.toFixed(2) }}
          </p>
        </div>
      </RouterLink>
      </div>
    </div>
  </div>
</template>
