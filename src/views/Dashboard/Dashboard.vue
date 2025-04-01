<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { onMounted, ref } from 'vue'
import IconUsers from '@/components/icons/IconUsers.vue'
import { Icon } from '@iconify/vue/dist/iconify.js'
import LayoutDashboard from '@/components/dashboard/LayoutDashboard.vue'
import { fetchUsers, Users } from '@/composables/userFunctions'
import { Artists, fetchArtists } from '@/composables/artistaFunctions'
import { fetchObras, Obras } from '@/composables/obraFunctions'
import { Exposicions, fetchExposicions } from '@/composables/exposicionFunctions'
import { Categorias, fetchCategorias } from '@/composables/categoriaFunctions'
import { Comentarios, fetchComentarios } from '@/composables/comentarioFunctions'
import { fetchLogActions, LogActions } from '@/composables/logActionFunctions'
import { fetchLogErrors, LogErrors } from '@/composables/logErrorFunctions'

const loading = ref(true)
const metrics = ref({
  totalUsers: 0,
  totalArtists: 0,
  totalObras: 0,
  totalExposiciones: 0,
  totalCategorias: 0,
  totalComentarios: 0,
  totalLikes: 0,
  totalLogActions: 0,
  totalLogErrors: 0
})

const fetchAllMetrics = async () => {
  try {
    loading.value = true
    
    // Fetch all metrics in parallel
    await Promise.all([
      fetchUsers({page:1, limit:1}),
      fetchArtists({page:1, limit:1}),
      fetchObras({page:1, limit:1}),
      fetchExposicions({page:1, limit:1}),
      fetchCategorias({page:1, limit:1}),
      fetchComentarios({page:1, limit:1}),
      fetchLogActions({page:1, limit:1}),
      fetchLogErrors({page:1, limit:1})
    ])
    
    // Update metrics
    metrics.value = {
      totalUsers: Users.value?.total || 0,
      totalArtists: Artists.value?.total || 0,
      totalObras: Obras.value?.total || 0,
      totalExposiciones: Exposicions.value?.total || 0,
      totalCategorias: Categorias.value?.total || 0,
      totalComentarios: Comentarios.value?.total || 0,
      totalLikes:  0,
      totalLogActions: LogActions.value?.total || 0,
      totalLogErrors: LogErrors.value?.total || 0
    }
    
  } catch (error) {
    console.error("Error fetching metrics:", error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchAllMetrics()
})
</script>

<template>
  <LayoutDashboard>
    <template #content>
      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>

      <!-- Content -->
      <div v-else>
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Resumen General</h1>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <!-- Usuarios -->
          <RouterLink 
            :to="{ name: 'dashboard-users' }"
            class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center cursor-pointer hover:bg-gray-50"
          >
            <div class="p-3 rounded-full bg-orange-100 mb-4">
              <IconUsers class="w-8 h-8 text-orange-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-1">Usuarios</h3>
            <p class="text-3xl font-bold text-orange-600">{{ metrics.totalUsers }}</p>
          </RouterLink>

          <!-- Artistas -->
          <RouterLink 
            :to="{ name: 'dashboard-artist' }"
            class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center cursor-pointer hover:bg-gray-50"
          >
            <div class="p-3 rounded-full bg-blue-100 mb-4">
              <Icon icon="ri:brush-line" class="w-8 h-8 text-blue-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-1">Artistas</h3>
            <p class="text-3xl font-bold text-blue-600">{{ metrics.totalArtists }}</p>
          </RouterLink>

          <!-- Obras -->
          <RouterLink 
            :to="{ name: 'dashboard-obra' }"
            class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center cursor-pointer hover:bg-gray-50"
          >
            <div class="p-3 rounded-full bg-purple-100 mb-4">
              <Icon icon="material-symbols:image-outline-rounded" class="w-8 h-8 text-purple-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-1">Obras</h3>
            <p class="text-3xl font-bold text-purple-600">{{ metrics.totalObras }}</p>
          </RouterLink>

          <!-- Exposiciones -->
          <RouterLink 
            :to="{ name: 'dashboard-exposicion' }"
            class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center cursor-pointer hover:bg-gray-50"
          >
            <div class="p-3 rounded-full bg-green-100 mb-4">
              <Icon icon="foundation:folder" class="w-8 h-8 text-green-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-1">Exposiciones</h3>
            <p class="text-3xl font-bold text-green-600">{{ metrics.totalExposiciones }}</p>
          </RouterLink>

          <!-- Categorias -->
          <RouterLink 
            :to="{ name: 'dashboard-categoria' }"
            class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center cursor-pointer hover:bg-gray-50"
          >
            <div class="p-3 rounded-full bg-yellow-100 mb-4">
              <Icon icon="mdi:tag" class="w-8 h-8 text-yellow-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-1">Categorías</h3>
            <p class="text-3xl font-bold text-yellow-600">{{ metrics.totalCategorias }}</p>
          </RouterLink>

          <!-- Comentarios -->
          <RouterLink 
            :to="{ name: 'dashboard-comentario' }"
            class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center cursor-pointer hover:bg-gray-50"
          >
            <div class="p-3 rounded-full bg-indigo-100 mb-4">
              <Icon icon="material-symbols:comment-rounded" class="w-8 h-8 text-indigo-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-1">Comentarios</h3>
            <p class="text-3xl font-bold text-indigo-600">{{ metrics.totalComentarios }}</p>
          </RouterLink>

          <!-- Acciones de log -->
          <RouterLink 
            :to="{ name: 'dashboard-logAction' }"
            class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center cursor-pointer hover:bg-gray-50"
          >
            <div class="p-3 rounded-full bg-gray-100 mb-4">
              <Icon icon="tdesign:system-log-filled" class="w-8 h-8 text-gray-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-1">Acciones de log</h3>
            <p class="text-3xl font-bold text-gray-600">{{ metrics.totalLogActions }}</p>
          </RouterLink>

          <!-- Errores de log -->
          <RouterLink 
            :to="{ name: 'dashboard-logError' }"
            class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center cursor-pointer hover:bg-gray-50"
          >
            <div class="p-3 rounded-full bg-gray-100 mb-4">
              <Icon icon="tdesign:system-log" class="w-8 h-8 text-gray-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-1">Errores de log</h3>
            <p class="text-3xl font-bold text-gray-600">{{ metrics.totalLogErrors }}</p>
          </RouterLink>
        </div>
      </div>
    </template>
  </LayoutDashboard>
</template>

<style scoped>
.router-link-active {
  transform: scale(0.98);
}
</style>