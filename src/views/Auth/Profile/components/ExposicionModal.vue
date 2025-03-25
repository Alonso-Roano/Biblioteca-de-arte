<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Calendar from 'primevue/calendar'
import Button from 'primevue/button'
import MultiSelect from 'primevue/multiselect'

import { useArtistProfileStore } from '@/stores/ArtistProfileStore'

const props = defineProps<{
  modelValue: boolean
  exposicion?: {
    id: number
    nombre: string
    fechaInicio: string
    fechaFin: string
  } | null
}>()

const emit = defineEmits(['update:modelValue', 'onSuccess'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const isEditing = computed(() => !!props.exposicion)

const nombre = ref('')
const fechaInicio = ref<Date | null>(null)
const fechaFin = ref<Date | null>(null)
const obrasSeleccionadas = ref<any[]>([])
const artistStore = useArtistProfileStore()
const toast = useToast()

const limpiarFormulario = () => {
  nombre.value = ''
  fechaInicio.value = null
  fechaFin.value = null
  obrasSeleccionadas.value = []
}

watch(
  () => props.exposicion,
  (newVal) => {
    if (newVal) {
      nombre.value = newVal.nombre
      fechaInicio.value = new Date(newVal.fechaInicio)
      fechaFin.value = new Date(newVal.fechaFin)
    } else {
      limpiarFormulario()
    }
  },
  { immediate: true }
)

const guardar = async () => {
  if (!nombre.value || !fechaInicio.value || !fechaFin.value) {
    toast.add({
      severity: 'warn',
      summary: 'Campos incompletos',
      detail: 'Completa todos los campos.',
      life: 3000
    })
    return
  }

  const datos = {
    nombre: nombre.value,
    fechaInicio: fechaInicio.value.toISOString(),
    fechaFin: fechaFin.value.toISOString()
  }

  let result
  if (isEditing.value) {
    result = await artistStore.editarExposicionYAsignarObras(props.exposicion!.id, datos, obrasSeleccionadas.value.map(o => o.id))
  } else {
    result = await artistStore.crearExposicionYAsignarObras(datos, obrasSeleccionadas.value.map(o => o.id))
  }

  if (result.success) {
    toast.add({
      severity: 'success',
      summary: isEditing.value ? 'Exposición actualizada' : 'Exposición creada',
      detail: 'Los cambios se guardaron correctamente.',
      life: 3000
    })
    emit('onSuccess')
    visible.value = false
  } else {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo guardar la exposición.',
      life: 3000
    })
  }
}
</script>

<template>
  <Dialog v-model:visible="visible" modal :header="isEditing ? 'Editar Exposición' : 'Crear Exposición'" class="w-[90vw] md:w-[30rem]">
    <div class="space-y-4">
      <div>
        <label class="block mb-1 text-sm font-medium">Nombre</label>
        <InputText v-model="nombre" class="w-full" />
      </div>

      <div>
        <label class="block mb-1 text-sm font-medium">Fecha de Inicio</label>
        <Calendar v-model="fechaInicio" showIcon class="w-full" />
      </div>

      <div>
        <label class="block mb-1 text-sm font-medium">Fecha de Fin</label>
        <Calendar v-model="fechaFin" showIcon class="w-full" />
      </div>

      <div>
        <label class="block mb-1 text-sm font-medium">Obras a incluir</label>
        <MultiSelect
          v-model="obrasSeleccionadas"
          :options="artistStore.obras"
          optionLabel="titulo"
          placeholder="Selecciona obras"
          class="w-full"
        />
      </div>

      <div class="flex justify-end gap-2 pt-4">
        <Button label="Cancelar" severity="secondary" @click="visible = false" />
        <Button
          :label="isEditing ? 'Guardar Cambios' : 'Crear'"
          :style="{ backgroundColor: '#F4811B', borderColor: '#F4811B', color: '#fff' }"
          @click="guardar"
        />
      </div>
    </div>
  </Dialog>
</template>
