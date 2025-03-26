<script setup lang="ts">
import { onMounted } from 'vue'
import { useProfileStore } from '@/stores/ProfileStore'

const profileStore = useProfileStore()

onMounted(() => {
  profileStore.fetchUserLikes()
})
</script>

<template>
  <div>
    <h2 class="text-lg font-semibold mb-4">Mis Likes</h2>

    <div v-if="profileStore.userLikes.length === 0">
      <p>No has dado like a nada todavía</p>
    </div>

    <ul v-else class="space-y-4">
      <li
        v-for="(like, index) in profileStore.userLikes"
        :key="index"
      >
      <RouterLink :to="'/DetalleProducto/'+like.slug" class="block p-4 bg-gray-100 rounded-lg shadow-sm">
        <h3 class="font-semibold text-[#F4811B] text-base">
          {{ like.titulo || 'Título desconocido' }}
        </h3>
        <p class="text-sm text-gray-700">
          {{ like.descripcion || 'Sin descripción.' }}
        </p>
      </RouterLink>
      </li>
    </ul>
  </div>
</template>
