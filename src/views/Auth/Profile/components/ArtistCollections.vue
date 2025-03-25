<script setup lang="ts">
import { onMounted } from 'vue'
import { useArtistProfileStore } from '@/stores/ArtistProfileStore'

const artistStore = useArtistProfileStore()

onMounted(() => {
  artistStore.fetchColeccionesArtista()
})
</script>

<template>
  <div>
    <h2 class="text-lg font-semibold mb-4">Mis Exposiciones</h2>

    <div v-if="artistStore.loading">
      <p>Cargando exposiciones...</p>
    </div>

    <div v-else-if="artistStore.colecciones.length === 0">
      <p>Aún no tienes exposiciones registradas </p>
    </div>

    <ul v-else class="space-y-4">
      <li
        v-for="expo in artistStore.colecciones"
        :key="expo.id"
        class="p-4 bg-gray-100 rounded-lg shadow-sm"
      >
        <h3 class="font-semibold text-[#F4811B] text-base">{{ expo.nombre }}</h3>
        <p class="text-sm text-gray-700">
          Fecha: {{ new Date(expo.fechaInicio).toLocaleDateString() }} — {{ new Date(expo.fechaFin).toLocaleDateString() }}
        </p>
      </li>
    </ul>
  </div>
</template>
