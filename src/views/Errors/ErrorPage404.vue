<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = (): void => {
  router.go(-1)
}

const goHome = (): void => {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4">
    <div class="max-w-lg w-full text-center">
      <div class="text-9xl font-extrabold text-gray-800 animate-bounce">
        404
      </div>

      <h1 class="mt-4 text-3xl font-bold text-gray-900">
        ¡Página no encontrada!
      </h1>
      <p class="mt-4 text-lg text-gray-600">
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </p>

      <div class="mt-8 flex justify-center space-x-4">

        <button
          @click="goHome"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          Ir a inicio
        </button>

        <button
          @click="goBack"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          Regresar
        </button>
      </div>
    </div>
  </div>
</template>


