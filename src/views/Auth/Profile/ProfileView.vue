<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useProfileStore } from '@/stores/ProfileStore.ts'
import { useToast } from 'primevue/usetoast'

import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import LikeList from '@/views/Auth/Profile/components/LikeList.vue'

const tabs = ['Editar Perfil', 'Mis Likes', 'Mis Comentarios']
const currentTab = ref('Editar Perfil')

const profileStore = useProfileStore()
const toast = useToast()

const nombre = ref('')
const apellido = ref('')
const edad = ref<number | null>(null)
const nuevaContraseña = ref('')



onMounted(() => {
  profileStore.fetchProfile()
})

watch(currentTab, (tab) => {
if (tab === 'Mis Comentarios') {
    profileStore.fetchUserComments()
  }
})

watch(
  () => profileStore.profile,
  (perfil) => {
    if (perfil) {
      nombre.value = perfil.nombres
      apellido.value = perfil.apellidos
      edad.value = perfil.edad

    }
  },
  { immediate: true },
)

const validarFormulario = () => {
  if (!nombre.value || !apellido.value || edad.value === null) {
    toast.add({
      severity: 'warn',
      summary: 'Formulario incompleto',
      detail: 'Por favor completa todos los campos.',
      life: 3000,
    })
    return false
  }
  return true
}

const guardarCambios = async () => {
  if (!validarFormulario()) return

  try {
    await profileStore.updateProfile({
      nombres: nombre.value,
      apellidos: apellido.value,
      edad: edad.value!,
      ...(nuevaContraseña.value ? { contraseña: nuevaContraseña.value } : {}),
    })

    toast.add({
      severity: 'success',
      summary: 'Perfil actualizado',
      detail: 'Los cambios se han guardado correctamente.',
      life: 3000,
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo actualizar el perfil.',
      life: 3000,
    })
  }
}
</script>

<template>
  <Toast />
  <div class="flex flex-col min-h-[calc(100vh-160px)] w-full bg-[#EEE9DF]">
    <div class="flex-grow px-4">
      <div class="max-w-4xl mx-auto my-10 p-6 bg-white rounded-2xl shadow-md">
        <div class="flex border-b border-gray-200 mb-6">
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="currentTab = tab"
            class="px-4 py-2 font-medium text-sm transition-all duration-200"
            :class="{
              'border-b-2 border-[#F4811B] text-[#F4811B]': currentTab === tab,
              'text-gray-500 hover:text-[#C25500]': currentTab !== tab,
            }"
          >
            {{ tab }}
          </button>
        </div>

        <div>
          <div v-if="currentTab === 'Editar Perfil'">
            <h2 class="text-lg font-semibold mb-4">Editar Perfil</h2>
            <form class="space-y-5" @submit.prevent="guardarCambios">
              <div>
                <label class="block text-sm font-medium mb-1">Nombre</label>
                <InputText v-model="nombre" class="w-full" />
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">Apellido</label>
                <InputText v-model="apellido" class="w-full" />
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">Edad</label>
                <InputNumber v-model="edad" class="w-full" inputStyle="width: 100%" />
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">Nueva Contraseña</label>
                <InputText
                  v-model="nuevaContraseña"
                  type="password"
                  class="w-full"
                  placeholder="Escribe tu nueva contraseña"
                />
              </div>

              <Button
                type="submit"
                label="Guardar Cambios"
                :style="{ backgroundColor: '#F4811B', borderColor: '#F4811B', color: '#fff' }"
                severity="warning"
              />
            </form>
          </div>

          <div v-else-if="currentTab === 'Mis Likes'">
            <LikeList/>
          </div>

          <div v-else-if="currentTab === 'Mis Comentarios'">
            <h2 class="text-lg font-semibold mb-4">Mis Comentarios</h2>

            <div v-if="profileStore.userComments.length === 0">
              <p>No has comentado aún </p>
            </div>

            <ul v-else class="space-y-4">
              <li
                v-for="comentario in profileStore.userComments"
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

        </div>
      </div>
    </div>
  </div>
</template>
