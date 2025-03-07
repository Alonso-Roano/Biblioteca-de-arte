<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { onMounted, ref } from 'vue'
import IconUsers from '@/components/icons/IconUsers.vue'
import { Icon } from '@iconify/vue/dist/iconify.js'
const authStore = useAuthStore()
const user = authStore.user
const menuState = ref(false)
const routines = ref()
const routinesCount = ref(1)
const users = ref(1)
const muscles = ref(1)
const exercises = ref(1)
const loading = ref(true)
const metrics = ref()
import LayoutDashboard from '@/components/dashboard/LayoutDashboard.vue'
import { apiRequest } from '@/api/apiClient'

onMounted(async () => {
  fetchMetrics();
  try {
    loading.value = false
  } catch (error) {
    console.log(error)
  }
})

const fetchMetrics = async () => {
  try {
    metrics.value = await apiRequest("auth.metrics")
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <LayoutDashboard>
    <template #content>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-6">
        <div class="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center text-center">
          <IconUsers class="w-12 h-12 text-gray-500 mb-4" />
          <h3 class="text-xl font-semibold text-gray-800">Usuarios</h3>
          <p class="text-4xl font-bold text-green-600">{{ metrics?.totalUsuarios }}</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center text-center">
          <Icon icon="solar:book-bold" class="w-12 h-12 text-gray-500 mb-4" />
          <h3 class="text-xl font-semibold text-gray-800">Libros</h3>
          <p class="text-4xl font-bold text-indigo-600">{{ metrics?.totalLibros }}</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center text-center">
          <Icon icon="mdi:tag" class="w-12 h-12 text-gray-500 mb-4" />
          <h3 class="text-xl font-semibold text-gray-800">Etiquetas</h3>
          <p class="text-4xl font-bold text-yellow-600">{{ metrics?.totalEtiquetas }}</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center text-center">
          <Icon icon="mdi:heart" class="w-12 h-12 text-gray-500 mb-4" />
          <h3 class="text-xl font-semibold text-gray-800">Likes</h3>
          <p class="text-4xl font-bold text-red-600">{{ metrics?.totalLikes }}</p>
        </div>
      </div>
    </template>
  </LayoutDashboard>
</template>
