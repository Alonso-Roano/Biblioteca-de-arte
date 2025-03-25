<template>
  <!-- Barra de navegación -->
  <Toast/>
  <nav class="w-screen bg-[#F4811B] border-gray-200">
    <div class="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
      <!-- Nombre de la página actual -->
      <div class="inline-block text-xl font-light text-[#fff] border-b border-[#fff] pb-1">
        {{ currentPageTitle }}
      </div>

      <!-- Logo  -->
      <div class="text-2xl font-bold text-[#fff]">
        Galeria Dashboard
      </div>

      <!-- Botón hamburguesa (siempre visible) -->
      <button
        class="p-2 w-10 h-10 flex items-center justify-center text-sm text-[#fff] rounded-lg cursor-pointer"
        @click="MenuOpen = !MenuOpen"
      >
        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M1 1h15M1 7h15M1 13h15"
          />
        </svg>
      </button>
    </div>
  </nav>

  <!-- Overlay del menú -->
  <transition name="fade">
    <div
      v-if="MenuOpen"
      class="fixed inset-0 z-50 flex flex-col bg-white/80 backdrop-blur-md"
    >
      <div class="flex-1 flex flex-col items-center justify-center">
        <ul class="space-y-6 font-semibold text-gray-800 uppercase tracking-wider text-center flex flex-wrap w-full md:w-1/2 justify-evenly">
          <NavRoutesAdmin
            v-for="(route, index) in menuRoutes"
            :key="route.path"
            :route="route"
            :index="index"
            :total-items="menuRoutes.length"
            @close-mobile-menu="MenuOpen = false"
          />
        </ul>
      </div>

      <div class="py-4 px-8 flex items-center justify-between bg-transparent">
        <div class="text-sm md:text-base text-gray-700">
          
        </div>

        <button
          v-if="!user"
          class="px-4 py-2 border border-gray-400 text-gray-700 rounded hover:bg-gray-100"
          @click="handlelogin"
        >
           Iniciar Sesíon
        </button>

        <button
          v-if="user"
          class="px-4 py-2 border border-gray-400 text-gray-700 rounded hover:bg-gray-100"
          @click="handleLogout"
        >
          Cerrar Sesión
        </button>

        <div class="text-sm md:text-base text-gray-700">
          
        </div>
      </div>

      <button
        class="absolute top-4 right-4 text-2xl text-gray-800"
        @click="MenuOpen = false"
        aria-label="Cerrar menú"
      >
        &times;
      </button>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter, useRoute } from 'vue-router'
import NavRoutes from '@/components/NavRoutes.vue'
import { useToast } from 'primevue/usetoast'
import NavRoutesAdmin from '../NavRoutesAdmin.vue'
const toast = useToast()

const authStore = useAuthStore()
authStore.initializeAuth()

const user = ref(authStore.user)
watch(
  () => authStore.user,
  (newUser) => {
    user.value = newUser
  },
  { deep: true }
)

const router = useRouter()
const route = useRoute()

const MenuOpen = ref(false)

const currentPageTitle = computed(() => route.meta?.title || 'Página Actual')

const userRol = computed(() => authStore.user?.rol)

const menuRoutes = computed(() => {
  return router.options.routes.filter((r) => r.meta?.requiresAdmin === true)
})

const handleLogout = () => {
  logout()
  MenuOpen.value = false
}

const handlelogin = () => {
  router.push('/login')
  MenuOpen.value = false
}

const logout = () => {
  authStore.logout()
  router.push('/login')
  user.value = null

  toast.add({
    severity: 'info',
    summary: 'Sesión cerrada',
    detail: 'Has cerrado sesión exitosamente.',
    life: 3000
  })
}

watch(() => route.path, () => {
  MenuOpen.value = false
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>