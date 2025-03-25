<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LayoutDashboard from '@/components/dashboard/LayoutDashboard.vue'
import ObraList from '@/components/Modals/Obra/ObraList.vue'
import ObraFormEdit from '@/components/Modals/Obra/ObraFormEdit.vue'
import ObraFormCreate from '@/components/Modals/Obra/ObraFormCreate.vue'
import ConfirmationModal from '@/components/Modals/ConfirmationModal.vue'
import ObraaView from '@/components/Modals/Obra/ObraView.vue'
import Toast from 'primevue/toast'
import { Obras, IdObraDelete, newObra, ObraEdit, editObraImagen, ObraView, fetchObras, createObra, editObra, updateObra, deleteObra, removeObra, updateObraImage} from '@/composables/obraFunctions'
import ImagenFormEdit from '@/components/Modals/Obra/ImagenFormEdit.vue'

const showModal = ref(false)
const showModalEdit = ref(false)
const confirmDeleteModal = ref(false)
const showModalView = ref(false)
const showImageEdit = ref(false)
const toast = ref()

const handleCreateObra = async () => {
  const success = await createObra(toast.value)
  if (success) {
    showModal.value = false
    newObra.value = {id: "", titulo: "", descripcion: "", precio: "", artistaId: "", categoriaIds: "", imagen: ""}
  }
}

const handleUpdateObra = async () => {
  const success = await updateObra(toast.value)
  if (success) {
    showModalEdit.value = false
  }
}
const handleUpdateImage = async () => {
  const success = await updateObraImage()
  if (success) {
    showModalEdit.value = false
  }
}

const handleRemoveObra = async () => {
  const success = await removeObra(toast.value)
  if (success) {
    confirmDeleteModal.value = false
  }
}
</script>

<template>
  <LayoutDashboard> 
    <template #content>

      <ObraList :Obras="Obras" @add-Obra="{showModal = true;}" @view-Obra="ObraView = $event; showModalView = true" @edit-Obra="editObra($event); showModalEdit = true" @edit-ObraImagen="editObraImagen($event); showImageEdit = true" @delete-Obra="deleteObra($event); confirmDeleteModal = true" />

      <!-- Modal de creación -->
      <ObraFormCreate v-model:visible="showModal" :Obra="newObra" @save="handleCreateObra" />

      <!-- Modal de edición -->
      
      <ObraFormEdit v-model:visible="showModalEdit" :Obra="ObraEdit"  @save="handleUpdateObra" />

      <ImagenFormEdit v-model:visible="showImageEdit" @save="handleUpdateImage" :Obra="ObraView"/>

      <!-- Modal de confirmación de eliminación -->
      <ConfirmationModal v-model:visible="confirmDeleteModal" @confirm="handleRemoveObra" :texto="'El Obraa se borrará. ¿Está seguro?'" />

      <!-- Modal de vista de usuario -->
      <ObraaView v-model:visible="showModalView" :Obra="ObraView" />

      <!-- Toast para mensajes -->
      <Toast ref="toast" />
    </template>
  </LayoutDashboard>
</template>