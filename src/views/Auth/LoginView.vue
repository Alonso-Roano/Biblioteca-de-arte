<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.ts'
import { Icon } from '@iconify/vue'
import Cristo from '../../assets/images/cristoredentor.webp'
import { useToast } from 'primevue/usetoast'
import * as yup from 'yup'
const authStore = useAuthStore()
const router = useRouter()
const errorMessage = ref<null | string>(null)
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const emailError = ref('')
const passwordError = ref('')
const toast = useToast()

const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email('Correo no válido')
    .required('El correo es obligatorio'),
  password: yup
    .string()
    .trim()
    .required('La contraseña es obligatoria')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/,
      'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un carácter especial.'
    )
})

const onSubmit = async () => {
  emailError.value = ''
  passwordError.value = ''

  try {
    const formData = await loginSchema.validate(
      { email: email.value, password: password.value },
      { abortEarly: false }
    )

    await authStore.login(formData.email, formData.password)

    toast.add({
      severity: 'success',
      summary: 'Inicio de sesión exitoso',
      detail: 'Bienvenido de nuevo.',
      life: 3000,
    })

    setTimeout(() => {
      router.push('/')
    }, 2000)

  } catch (err: any) {
    if (err.name === 'ValidationError') {
      err.inner.forEach((error: any) => {
        if (error.path === 'email') emailError.value = error.message
        if (error.path === 'password') passwordError.value = error.message
      })
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error al iniciar sesión',
        detail: 'Error inesperado',
        life: 4000,
      })
    }
  }
}

</script>

<template>
  <Toast />
  <div class="min-h-screen flex flex-col items-center justify-center bg-[#F6EDD9]">
    <header class="pt-6">
      <h1 class="text-center text-5xl font-bold text-black tracking-wide">Galeria</h1>
    </header>
    <div class="flex flex-1 flex-col md:flex-row items-center justify-center px-4 gap-8">
      <div class="w-full max-w-md bg-white rounded-lg shadow-md p-8 flex flex-col">
        <h2 class="text-2xl font-semibold text-center text-gray-700 mb-6">Iniciar Sesión</h2>

        <form @submit.prevent="onSubmit" class="space-y-6">
          <div>
            <label for="email" class="block text-gray-600 text-sm font-medium mb-1">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              v-model="email"
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
                <Icon :icon="showPassword ? 'bi:eye-slash-fill' : 'bi:eye-fill'" class="text-xl" />
              </button>
            </div>
            <p v-if="passwordError" class="text-sm text-red-500 mt-1">{{ passwordError }}</p>
          </div>

          <!--
<div class="flex justify-end">
  <a href="/No_sirve_xd" class="text-sm text-gray-500 hover:text-[#F4811B]">
    ¿Olvidaste tu contraseña?
  </a>
</div>
-->

          <button
            type="submit"
            class="w-full bg-[#F4811B] hover:bg-[#d77315] text-white font-bold py-2 rounded-full transition-colors"
          >
            Iniciar Sesión
          </button>

          <p class="text-center text-sm text-gray-500">
            ¿Aún no tienes cuenta?
            <a href="/register" class="text-[#F4811B] hover:underline">Da click aquí</a>
          </p>
        </form>
      </div>

      <div class="hidden md:block md:w-1/2">
        <img
          :src="Cristo"
          alt="Imagen Login"
          class="w-[90%] h-max-[500px] object-cover rounded-lg shadow-md"
        />
      </div>
    </div>
  </div>
</template>
