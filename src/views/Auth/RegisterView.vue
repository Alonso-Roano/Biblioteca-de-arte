<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore.ts';
import { Icon } from "@iconify/vue";
import Cristo from '@/assets/images/cristoredentor.webp'

const authStore = useAuthStore();
const router = useRouter();
const errorMessage = ref<null | string>(null);
const username = ref('');
const email = ref('');
const alias = ref('');
const password = ref('');
const showPassword = ref(false);

const onSubmit = async () => {
  try {
    await authStore.register( username.value, email.value, alias.value, password.value );
    errorMessage.value = null;
    router.push('/login');
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
  }
};
</script>

<template>
  <!-- Contenedor principal -->
  <div class="min-h-screen flex flex-col bg-[#F6EDD9]">
    <!-- Encabezado -->
    <header class="py-6">
      <h1 class="text-center text-5xl font-bold text-black tracking-wide">Galería</h1>
    </header>

    <div class="flex flex-1 flex-col md:flex-row items-center justify-center px-4 gap-8 pb-8">
      <div class="hidden md:block md:w-[35%]">
        <img
          :src="Cristo"
          alt="Registro"
          class="w-[90%] h-auto object-cover rounded-lg shadow-md mx-auto"
        />
      </div>

      <div class="w-full max-w-md bg-white rounded-lg shadow-md p-8 flex flex-col">
        <h2 class="text-2xl font-semibold text-center text-gray-700 mb-6">Regístrate</h2>

        <form @submit.prevent="onSubmit" class="space-y-6">
          <div>
            <label for="username" class="block text-gray-600 text-sm font-medium mb-1">
              Nombre de Usuario
            </label>
            <input
              id="username"
              v-model="username"
              type="text"
              class="w-full border-b border-gray-300 focus:border-[#F4811B] focus:outline-none py-2 text-gray-700"
              placeholder="Tu nombre de usuario"
            />
          </div>

          <div>
            <label for="alias" class="block text-gray-600 text-sm font-medium mb-1">
              Alias (opcional)
            </label>
            <input
              id="alias"
              v-model="alias"
              type="text"
              class="w-full border-b border-gray-300 focus:border-[#F4811B] focus:outline-none py-2 text-gray-700"
              placeholder="Ej. tu apodo o nickname"
            />
          </div>

          <div>
            <label for="email" class="block text-gray-600 text-sm font-medium mb-1">
              Correo Electrónico
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="w-full border-b border-gray-300 focus:border-[#F4811B] focus:outline-none py-2 text-gray-700"
              placeholder="Escribe tu correo"
            />
          </div>

          <div>
            <label for="password" class="block text-gray-600 text-sm font-medium mb-1">
              Contraseña
            </label>
            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                class="w-full border-b border-gray-300 focus:border-[#F4811B] focus:outline-none py-2 text-gray-700 pr-10"
                placeholder="********"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-0 top-1/2 -translate-y-1/2 mr-1 text-gray-500"
              >
                <Icon
                  :icon="showPassword ? 'bi:eye-slash-fill' : 'bi:eye-fill'"
                  class="text-xl"
                />
              </button>
            </div>
          </div>

          <button
            type="submit"
            class="w-full bg-[#F4811B] hover:bg-[#d77315] text-white font-bold py-2 rounded-full transition-colors"
          >
            Crear Cuenta
          </button>

          <p v-if="errorMessage" class="text-red-500 text-center text-sm mt-2">
            {{ errorMessage }}
          </p>

          <p class="text-center text-sm text-gray-500">
            ¿Ya tienes cuenta?
            <a href="/login" class="text-[#F4811B] hover:underline">Inicia sesión</a>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
