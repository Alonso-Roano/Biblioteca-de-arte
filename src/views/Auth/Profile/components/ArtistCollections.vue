<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useArtistProfileStore } from '@/stores/ArtistProfileStore'
import Button from 'primevue/button'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import ExposicionModal from '@/views/Auth/Profile/components/ExposicionModal.vue'

const artistStore = useArtistProfileStore()
const modalVisible = ref(false)
const exposicionActual = ref(null)
const confirm = useConfirm()
const toast = useToast()

const abrirCrearModal = () => {
  exposicionActual.value = null
  modalVisible.value = true
}

const abrirEditarModal = (expo: any) => {
  exposicionActual.value = expo
  modalVisible.value = true
}

const confirmarEliminacion = (expo: any) => {
  confirm.require({
    message: `¿Seguro que quieres eliminar la exposición "${expo.nombre}"?`,
    header: 'Confirmar Eliminación',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Eliminar',
    rejectLabel: 'Cancelar',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const result = await artistStore.eliminarExposicion(expo.id)
      if (result.success) {
        toast.add({
          severity: 'success',
          summary: 'Exito',
          detail: 'Exposición eliminada correctamente.',
          life: 3000
        })
      } else {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar la exposición.',
          life: 3000
        })
      }
    }
  })
}

onMounted(() => {
  artistStore.fetchColeccionesArtista()
})
</script>

<template>
  <div>
    <ConfirmDialog />

    <div class="flex mb-4 items-center justify-between">
      <h2 class="text-lg font-semibold mb-4">Mis Exposiciones</h2>
      <div>
        <Button label="Nueva exposición" @click="abrirCrearModal" :style="{ backgroundColor: '#F4811B', borderColor: '#F4811B', color: '#fff' }" />
      </div>
    </div>

    <ExposicionModal
      v-model="modalVisible"
      :exposicion="exposicionActual"
      @onSuccess="artistStore.fetchColeccionesArtista"
    />

    <div v-if="artistStore.loading">
      <p>Cargando exposiciones...</p>
    </div>

    <div v-else-if="artistStore.colecciones.length === 0">
      <p>Aún no tienes exposiciones registradas</p>
    </div>

    <ul v-else class="space-y-4">
      <li
        v-for="expo in artistStore.colecciones"
        :key="expo.id"
        class="p-4 bg-gray-100 rounded-lg shadow-sm"
      >
        <h3 class="font-semibold text-[#F4811B] text-base">{{ expo.nombre }}</h3>
        <p class="text-sm text-gray-700">
          Fecha: {{ new Date(expo.fechaInicio).toLocaleDateString() }} — {{ new Date(expo.fechaFin).toLocaleDateString() }}
        </p>
        <div class="flex justify-end gap-2 mt-2">
          <Button
            icon="pi pi-pencil"
            class="p-button-sm"
            :style="{ backgroundColor: '#F4811B', borderColor: '#F4811B', color: '#fff' }"
            @click="() => abrirEditarModal(expo)"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-sm"
            severity="danger"
            @click="() => confirmarEliminacion(expo)"
          />
        </div>

      </li>
    </ul>
  </div>
</template>
