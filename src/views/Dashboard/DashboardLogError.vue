<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LayoutDashboard from '@/components/dashboard/LayoutDashboard.vue'
import LogErrorList from '@/components/Modals/LogError/LogErrorList.vue'
import LogErrorFormEdit from '@/components/Modals/LogError/LogErrorFormEdit.vue'
import LogErrorFormCreate from '@/components/Modals/LogError/LogErrorFormCreate.vue'
import ConfirmationModal from '@/components/Modals/ConfirmationModal.vue'
import LogErroraView from '@/components/Modals/LogError/LogErrorView.vue'
import Toast from 'primevue/toast'
import { LogErrors, IdLogErrorDelete, newLogError, LogErrorEdit, LogErrorView, fetchLogErrors, createLogError, editLogError, updateLogError, deleteLogError, removeLogError} from '@/composables/logErrorFunctions'

const showModal = ref(false)
const showModalEdit = ref(false)
const confirmDeleteModal = ref(false)
const showModalView = ref(false)
const toast = ref()

const handleCreateLogError = async () => {
  const success = await createLogError(toast.value)
  if (success) {
    showModal.value = false
    newLogError.value = { id:'', source: "", message: "", stackTrace: "" }
  }
}

const handleUpdateLogError = async () => {
  const success = await updateLogError(toast.value)
  if (success) {
    showModalEdit.value = false
  }
}

const handleRemoveLogError = async () => {
  const success = await removeLogError(toast.value)
  if (success) {
    confirmDeleteModal.value = false
  }
}
</script>

<template>
  <LayoutDashboard> 
    <template #content>

      <LogErrorList :LogErrors="LogErrors" @add-LogError="showModal = true" @view-LogError="LogErrorView = $event; showModalView = true" @edit-LogError="editLogError($event); showModalEdit = true" @delete-LogError="deleteLogError($event); confirmDeleteModal = true" />
      
      <!-- Modal de creación -->
      <LogErrorFormCreate v-model:visible="showModal" :LogError="newLogError"  @save="handleCreateLogError" />

      <!-- Modal de edición -->
      
      <LogErrorFormEdit v-model:visible="showModalEdit" :LogError="LogErrorEdit"  @save="handleUpdateLogError" />

      <!-- Modal de confirmación de eliminación -->
      <ConfirmationModal v-model:visible="confirmDeleteModal" @confirm="handleRemoveLogError" :texto="'El LogErrora se borrará. ¿Está seguro?'" />

      <!-- Modal de vista de usuario -->
      <LogErroraView v-model:visible="showModalView" :LogError="LogErrorView" />

      <!-- Toast para mensajes -->
      <Toast ref="toast" />
    </template>
  </LayoutDashboard>
</template>