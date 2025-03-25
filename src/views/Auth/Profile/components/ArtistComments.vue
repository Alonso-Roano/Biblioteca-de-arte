<script setup lang="ts">
import { onMounted } from 'vue'
import { useArtistProfileStore } from '@/stores/ArtistProfileStore'

const artistStore = useArtistProfileStore()

onMounted(() => {
  artistStore.fetchArtistaComentarios()
})
</script>

<template>
  <div>
    <h2 class="text-lg font-semibold mb-4">Mis Comentarios</h2>

    <div v-if="artistStore.loading">
      <p>Cargando comentarios...</p>
    </div>

    <div v-else-if="artistStore.artistaComentarios.length === 0">
      <p>No has comentado aún </p>
    </div>

    <ul v-else class="space-y-4">
      <li
        v-for="comentario in artistStore.artistaComentarios"
        :key="comentario.id"
        class="p-4 bg-gray-100 rounded-lg shadow-sm"
      >
        <p class="text-sm text-gray-700 mb-1">
          {{ comentario.texto }}
        </p>
        <p class="text-xs text-gray-500">
          Fecha: {{ new Date(comentario.fechaComentario).toLocaleDateString() }}
        </p>
      </li>
    </ul>
  </div>
</template>
