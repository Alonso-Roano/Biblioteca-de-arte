<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore.ts';
import { Icon } from "@iconify/vue";
import Cristo from '@/assets/images/cristoredentor.webp'
import { useToast } from 'primevue/usetoast'

const authStore = useAuthStore();
const router = useRouter();
const errorMessage = ref<null | string>(null);
const nombres = ref('');
const apellidos = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showPasswordConfirm = ref(false);
const artista = ref(false);
const nombresError = ref('')
const apellidosError = ref('')
const emailError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')
const toast = useToast();

const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const validatePassword = (password: string): boolean => {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{10,}$/
  return re.test(password)
}

const onSubmit = async () => {
  nombresError.value = ''
  apellidosError.value = ''
  emailError.value = ''
  passwordError.value = ''
  confirmPasswordError.value = ''

  let valid = true

  if (!nombres.value.trim()) {
    nombresError.value = 'El nombre es obligatorio.'
    valid = false
  }

  if (!apellidos.value.trim()) {
    apellidosError.value = 'El apellido es obligatorio.'
    valid = false
  }

  if (!email.value || !validateEmail(email.value)) {
    emailError.value = 'Por favor ingresa un correo electrónico válido.'
    valid = false
  }

  if (!password.value || !validatePassword(password.value)) {
    passwordError.value =
      'Debe tener mínimo 10 caracteres, una mayúscula, una minúscula y un carácter especial.'
    valid = false
  }

  if (confirmPassword.value !== password.value) {
    confirmPasswordError.value = 'Las contraseñas no coinciden.'
    valid = false
  }

  if (!valid) return

  try {
    await authStore.register(
      nombres.value,
      apellidos.value,
      email.value,
      password.value,
      confirmPassword.value,
      artista.value
    )
    errorMessage.value = null

    toast.add({
      severity: 'success',
      summary: 'Registro exitoso',
      detail: 'Tu cuenta ha sido creada correctamente.',
      life: 3000
    })

    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Ocurrió un error inesperado.'
    toast.add({
      severity: 'error',
      summary: 'Error al registrar',
      detail: errorMessage.value,
      life: 4000
    })
  }
}

</script>

<template>
  <Toast />
  <div class="min-h-screen flex flex-col bg-[#F6EDD9]">
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
              Nombre
            </label>
            <input
              id="username"
              v-model="nombres"
              type="text"
              class="w-full border-b border-gray-300 focus:border-[#F4811B] focus:outline-none py-2 text-gray-700"
              placeholder="Tu nombre de usuario"
            />
            <p v-if="nombresError" class="text-sm text-red-500 mt-1">{{ nombresError }}</p>
          </div>
          <div>
            <label for="username" class="block text-gray-600 text-sm font-medium mb-1">
              Apellido
            </label>
            <input
              id="username"
              v-model="apellidos"
              type="text"
              class="w-full border-b border-gray-300 focus:border-[#F4811B] focus:outline-none py-2 text-gray-700"
              placeholder="Tu nombre de usuario"
            />
            <p v-if="apellidosError" class="text-sm text-red-500 mt-1">{{ apellidosError }}</p>
          </div>

          <div>
            <label for="email" class="block text-gray-600 text-sm font-medium mb-1">
              Correo electrónico
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="w-full border-b border-gray-300 focus:border-[#F4811B] focus:outline-none py-2 text-gray-700"
              placeholder="Escribe tu correo"
            />
            <p v-if="emailError" class="text-sm text-red-500 mt-1">{{ emailError }}</p>
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
            <p v-if="passwordError" class="text-sm text-red-500 mt-1">{{ passwordError }}</p>
          </div>

          <div>
            <label for="password" class="block text-gray-600 text-sm font-medium mb-1">
              Confirma tu contraseña
            </label>
            <div class="relative">
              <input
                :type="showPasswordConfirm ? 'text' : 'password'"
                id="password"
                v-model="confirmPassword"
                class="w-full border-b border-gray-300 focus:border-[#F4811B] focus:outline-none py-2 text-gray-700 pr-10"
                placeholder="********"
              />
              <button
                type="button"
                @click="showPasswordConfirm = !showPasswordConfirm"
                class="absolute right-0 top-1/2 -translate-y-1/2 mr-1 text-gray-500"
              >
                <Icon
                  :icon="showPasswordConfirm ? 'bi:eye-slash-fill' : 'bi:eye-fill'"
                  class="text-xl"
                />
              </button>
            </div>
            <p v-if="confirmPasswordError" class="text-sm text-red-500 mt-1">{{ confirmPasswordError }}</p>
          </div>
          <div class="flex items-center">
            <input id="artista" v-model="artista" type="checkbox" class="mr-2" />
            <label for="artista" class="text-gray-600 text-sm font-medium">
              Registrarse como artista
            </label>
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
