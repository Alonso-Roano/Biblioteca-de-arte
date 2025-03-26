<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LayoutDashboard from '@/components/dashboard/LayoutDashboard.vue'
import ComentarioList from '@/components/Modals/Comentario/ComentarioList.vue'
import ComentarioFormEdit from '@/components/Modals/Comentario/ComentarioFormEdit.vue'
import ComentarioFormCreate from '@/components/Modals/Comentario/ComentarioFormCreate.vue'
import ConfirmationModal from '@/components/Modals/ConfirmationModal.vue'
import ComentarioaView from '@/components/Modals/Comentario/ComentarioView.vue'
import Toast from 'primevue/toast'
import { Comentarios, IdComentarioDelete, newComentario, ComentarioEdit, ComentarioView, fetchComentarios, createComentario, editComentario, updateComentario, deleteComentario, removeComentario} from '@/composables/comentarioFunctions'

const showModal = ref(false)
const showModalEdit = ref(false)
const confirmDeleteModal = ref(false)
const showModalView = ref(false)
const toast = ref()

const handleCreateComentario = async () => {
  const success = await createComentario(toast.value)
  if (success) {
    showModal.value = false
    newComentario.value = {id:"", nombre: "", descripcionComentario: "", nombreCorto:""}
  }
}

const handleUpdateComentario = async () => {
  const success = await updateComentario(toast.value)
  if (success) {
    showModalEdit.value = false
  }
}

const handleRemoveComentario = async () => {
  const success = await removeComentario(toast.value)
  if (success) {
    confirmDeleteModal.value = false
  }
}
</script>

<template>
  <LayoutDashboard> 
    <template #content>

      <ComentarioList :Comentarios="Comentarios" @add-Comentario="showModal = true" @view-Comentario="ComentarioView = $event; showModalView = true" @edit-Comentario="editComentario($event); showModalEdit = true" @delete-Comentario="deleteComentario($event); confirmDeleteModal = true" />
      
      <!-- Modal de creación -->
      <ComentarioFormCreate v-model:visible="showModal" :Comentario="newComentario"  @save="handleCreateComentario" />

      <!-- Modal de edición -->
      
      <ComentarioFormEdit v-model:visible="showModalEdit" :Comentario="ComentarioEdit"  @save="handleUpdateComentario" />

      <!-- Modal de confirmación de eliminación -->
      <ConfirmationModal v-model:visible="confirmDeleteModal" @confirm="handleRemoveComentario" :texto="'El Comentarioa se borrará. ¿Está seguro?'" />

      <!-- Modal de vista de usuario -->
      <ComentarioaView v-model:visible="showModalView" :Comentario="ComentarioView" />

      <!-- Toast para mensajes -->
      <Toast ref="toast" />
    </template>
  </LayoutDashboard>
</template>