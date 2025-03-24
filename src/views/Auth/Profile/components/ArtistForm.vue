<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useArtistProfileStore } from '@/stores/ArtistProfileStore'

import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import Toast from 'primevue/toast'

const artistStore = useArtistProfileStore()
const toast = useToast()

const nombres = ref('')
const apellidos = ref('')
const edad = ref<number | null>(null)
const pais = ref('')
const biografia = ref('')
const contraseña = ref('')

onMounted(() => {
  artistStore.fetchArtistProfile()
})

watch(
  () => artistStore.artistProfile,
  (perfil) => {
    if (perfil) {
      nombres.value = perfil.nombres
      apellidos.value = perfil.apellidos
      edad.value = perfil.edad
      pais.value = perfil.pais
      biografia.value = perfil.bigrafia
    }
  },
  { immediate: true }
)

const guardarCambios = async () => {
  if (!nombres.value || !apellidos.value || edad.value === null || !pais.value || !biografia.value || !contraseña.value) {
    toast.add({
      severity: 'warn',
      summary: 'Campos incompletos',
      detail: 'Por favor completa todos los campos.',
      life: 3000,
    })
    return
  }

  try {
    await artistStore.updateArtistProfile({
      nombres: nombres.value,
      apellidos: apellidos.value,
      edad: edad.value,
      pais: pais.value,
      bigrafia: biografia.value, // corregido el typo
      contraseña: contraseña.value,
    })

    toast.add({
      severity: 'success',
      summary: 'Perfil actualizado',
      detail: 'Los cambios fueron guardados correctamente.',
      life: 3000,
    })
  } catch (err) {
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

  <div class="space-y-5">
    <div>
      <label class="block text-sm font-medium mb-1">Nombre</label>
      <InputText v-model="nombres" class="w-full" />
    </div>

    <div>
      <label class="block text-sm font-medium mb-1">Apellido</label>
      <InputText v-model="apellidos" class="w-full" />
    </div>

    <div>
      <label class="block text-sm font-medium mb-1">Edad</label>
      <InputNumber v-model="edad" class="w-full" inputStyle="width: 100%" />
    </div>

    <div>
      <label class="block text-sm font-medium mb-1">País</label>
      <InputText v-model="pais" class="w-full" />
    </div>

    <div>
      <label class="block text-sm font-medium mb-1">Biografía</label>
      <Textarea v-model="biografia" autoResize rows="4" class="w-full" />
    </div>

    <div>
      <label class="block text-sm font-medium mb-1">Contraseña</label>
      <InputText v-model="contraseña" type="password" class="w-full" />
    </div>

    <Button
      label="Guardar Cambios"
      @click="guardarCambios"
      :style="{ backgroundColor: '#F4811B', borderColor: '#F4811B', color: '#fff' }"
      class="mt-2"
    />
  </div>
</template>
