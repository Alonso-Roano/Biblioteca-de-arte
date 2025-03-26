<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useArtistProfileStore } from '@/stores/ArtistProfileStore'
import ObraFormEdit from '@/components/Modals/Obra/ObraFormEdit.vue'
import { updateObra, ObraEdit } from '@/composables/obraFunctions'
import { deleteObra, removeObra } from '@/composables/obraFunctions'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import ConfirmDialog from 'primevue/confirmdialog'
import Button from 'primevue/button'

const confirm = useConfirm()


const artistStore = useArtistProfileStore()
const toast = useToast()

const baseUrl = import.meta.env.VITE_APP_URL;

const getImageUrl = (path:any) => {
  return `${baseUrl}${path}`;
};

const editVisible = ref(false)
const selectedObra = ref({})

const openEditModal = (obra: any) => {
  selectedObra.value = { ...obra }
  editVisible.value = true
}

const closeEditModal = () => {
  editVisible.value = false
}

const handleSave = async () => {
  try {
    const result = await updateObra(toast)
    if (result) {
      toast.add({
        severity: 'Editsuccess',
        summary: 'Éxito',
        detail: 'Obra actualizada correctamente',
        life: 3000
      })
      editVisible.value = false
      artistStore.fetchObrasArtista()
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo actualizar la obra',
      life: 3000
    })
  }
}

const handleDelete = (id: number) => {
  confirm.require({
    message: '¿Estás seguro de eliminar esta obra?',
    header: 'Confirmación',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Eliminar',
    rejectLabel: 'Cancelar',
    acceptClass: 'p-button-danger',
    accept: async () => {
      deleteObra(id)
      const result = await removeObra(toast)
      if (result) {
        artistStore.fetchObrasArtista()
      }
    },
    reject: () => {
    }
  })
}

onMounted(() => {
  artistStore.fetchObrasArtista()
})
</script>

<template>
  <div>
    <h2 class="text-lg font-semibold mb-4">Mis Obras</h2>

    <div v-if="artistStore.loading">
      <p>Cargando obras...</p>
    </div>

    <div v-else-if="artistStore.obras.length === 0">
      <p>Aún no tienes una obra subida</p>
    </div>

    <div v-else class="grid md:grid-cols-2 gap-6">
      <div
        v-for="obra in artistStore.obras"
        :key="obra.id"
        class="border rounded-lg overflow-hidden shadow-sm bg-white"
      >
        <img
          :src="getImageUrl(obra.imagenUrl) || 'https://via.placeholder.com/400x200?text=Sin+imagen'"
          alt="Imagen de la obra"
          class="w-full h-48 object-cover"
        />

        <div class="p-4 space-y-2">
          <h3 class="text-lg font-semibold text-[#F4811B]">{{ obra.titulo }}</h3>
          <p class="text-sm text-gray-600">
            {{ obra.descripcion || 'Sin descripción.' }}
          </p>
          <p class="text-sm text-gray-800 font-medium">
            Precio: ${{ obra.precio.toFixed(2) }}
          </p>
          <div class="flex gap-2 mt-2">
            <Button
              icon="pi pi-pencil"
              class="p-button-sm"
              :style="{ backgroundColor: '#F4811B', borderColor: '#F4811B', color: '#fff' }"
              @click="() => openEditModal(obra)"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-sm"
              severity="danger"
              @click="() => handleDelete(obra.id)"
            />
          </div>
        </div>
      </div>
    </div>

    <ObraFormEdit
      :Obra="selectedObra"
      :visible="editVisible"
      @save="handleSave"
      @cancel="closeEditModal"
      @update:visible="editVisible = $event"
    />
    <ConfirmDialog />
  </div>
</template>
