<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { Icon } from "@iconify/vue";

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
    router.push('/');
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
  }
};
</script>

<template>
  <div class="flex items-center justify-center h-screen"
    style="background: linear-gradient(90deg, #5d20d3 0%, rgba(178,169,242,1) 16%, rgba(255,255,255,1) 55%, rgba(255,255,255,1) 100%);">
    <div class="flex w-full max-w-7xl justify-center items-center rounded-lg overflow-hidden gap-x-20">
      <!-- Imagen lateral -->
      <div class="hidden lg:flex items-center justify-center shadow-lg bg-gray-50/10 backdrop-blur-md"
        style="width: 580px; height: 535px; border-radius: 8px;">
        <img src="/public/image/biblioteca.jpg" alt="Imagen de registro"
          style="width: 500px; height: 500px; object-fit: cover;" />
      </div>

      <!-- Formulario de inicio de sesión -->
      <div class="w-full lg:w-1/2 p-8 lg:p-5 flex flex-col justify-center">
        <!-- Logo y título -->
        <RouterLink to="/" class="flex gap-2 justify-center items-center">
          <img src="/public/image/babel-purple.svg" alt="" class=" h-[75px]">
        </RouterLink>

        <div class="text-center mb-6">
          <h2 class="text-3xl font-bold text-[#5d20d3] mt-4">Registrarse</h2>
        </div>

        <!-- Campos de username, correo, alias y contraseña -->
        <form @submit.prevent="onSubmit" class="space-y-6">
          <div v-if="errorMessage" class="text-red-500 text-center">{{ errorMessage }}</div>

          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">
              Nombre de usuario <span class="text-red-500">*</span>
            </label>
            <input id="username" v-model="username" type="text"
              class="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d20d3] outline-none"
              placeholder="Nombre de usuario" required />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Correo electrónico <span class="text-red-500">*</span>
            </label>
            <input id="email" v-model="email" type="email"
              class="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d20d3] outline-none"
              placeholder="Correo electrónico" required />
          </div>

          <div>
            <label for="alias" class="block text-sm font-medium text-gray-700">
              Alias <span class="text-red-500">*</span>
            </label>
            <input id="alias" v-model="alias" type="text"
              class="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d20d3] outline-none"
              placeholder="Alias" required />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Contraseña <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'"
                class="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d20d3] outline-none"
                placeholder="Contraseña" required />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span v-if="showPassword"><Icon icon="qlementine-icons:eye-crossed-16" width="24" height="24" class="text-[#5d20d3]" /></span>
                
                <span v-else><Icon icon="mdi:eye" width="24" height="24" class="text-[#5d20d3]" /></span>
              </button>
            </div>
          </div>

          <button type="submit"
            class="w-full py-2 bg-[#5d20d3] text-white font-semibold rounded-lg hover:bg-[#5448A1] transition-colors">
            Registrarse
          </button>
        </form>

        <!-- Registro -->
        <div class="text-center mt-6 text-gray-700">
          ¿Ya tienes cuenta?
          <RouterLink to="/login" class="text-[#5d20d3] font-semibold hover:underline">
            Iniciar sesion
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
