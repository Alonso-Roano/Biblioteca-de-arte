<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LayoutDashboard from '@/components/dashboard/LayoutDashboard.vue'
import ExposicionList from '@/components/Modals/Exposicion/ExposicionList.vue'
import ExposicionFormEdit from '@/components/Modals/Exposicion/ExposicionFormEdit.vue'
import ExposicionFormCreate from '@/components/Modals/Exposicion/ExposicionFormCreate.vue'
import ConfirmationModal from '@/components/Modals/ConfirmationModal.vue'
import ExposicionaView from '@/components/Modals/Exposicion/ExposicionView.vue'
import Toast from 'primevue/toast'
import { Exposicions, IdExposicionDelete, newExposicion, ExposicionEdit, ExposicionView, fetchExposicions, createExposicion, editExposicion, updateExposicion, deleteExposicion, removeExposicion} from '@/composables/exposicionFunctions'

const showModal = ref(false)
const showModalEdit = ref(false)
const confirmDeleteModal = ref(false)
const showModalView = ref(false)
const toast = ref()

const handleCreateExposicion = async () => {
  const success = await createExposicion(toast.value)
  if (success) {
    showModal.value = false
    newExposicion.value = { id:'', action:'', details:'' }
  }
}

const handleUpdateExposicion = async () => {
  const success = await updateExposicion(toast.value)
  if (success) {
    showModalEdit.value = false
  }
}

const handleRemoveExposicion = async () => {
  const success = await removeExposicion(toast.value)
  if (success) {
    confirmDeleteModal.value = false
  }
}
</script>

<template>
  <LayoutDashboard> 
    <template #content>

      <ExposicionList :Exposicions="Exposicions" @add-Exposicion="showModal = true" @view-Exposicion="ExposicionView = $event; showModalView = true" @edit-Exposicion="editExposicion($event); showModalEdit = true" @delete-Exposicion="deleteExposicion($event); confirmDeleteModal = true" />
      
      <!-- Modal de creación -->
      <ExposicionFormCreate v-model:visible="showModal" :Exposicion="newExposicion"  @save="handleCreateExposicion" />

      <!-- Modal de edición -->
      
      <ExposicionFormEdit v-model:visible="showModalEdit" :Exposicion="ExposicionEdit"  @save="handleUpdateExposicion" />

      <!-- Modal de confirmación de eliminación -->
      <ConfirmationModal v-model:visible="confirmDeleteModal" @confirm="handleRemoveExposicion" :texto="'El Exposiciona se borrará. ¿Está seguro?'" />

      <!-- Modal de vista de usuario -->
      <ExposicionaView v-model:visible="showModalView" :Exposicion="ExposicionView" />

      <!-- Toast para mensajes -->
      <Toast ref="toast" />
    </template>
  </LayoutDashboard>
</template>