<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LayoutDashboard from '@/components/dashboard/LayoutDashboard.vue'
import LogActionList from '@/components/Modals/LogAction/LogActionList.vue'
import LogActionFormEdit from '@/components/Modals/LogAction/LogActionFormEdit.vue'
import LogActionFormCreate from '@/components/Modals/LogAction/LogActionFormCreate.vue'
import ConfirmationModal from '@/components/Modals/ConfirmationModal.vue'
import LogActionaView from '@/components/Modals/LogAction/LogActionView.vue'
import Toast from 'primevue/toast'
import { LogActions, IdLogActionDelete, newLogAction, LogActionEdit, LogActionView, fetchLogActions, createLogAction, editLogAction, updateLogAction, deleteLogAction, removeLogAction} from '@/composables/logActionFunctions'

const showModal = ref(false)
const showModalEdit = ref(false)
const confirmDeleteModal = ref(false)
const showModalView = ref(false)
const toast = ref()

const handleCreateLogAction = async () => {
  const success = await createLogAction(toast.value)
  if (success) {
    showModal.value = false
    newLogAction.value = { id:'', action:'', details:'' }
  }
}

const handleUpdateLogAction = async () => {
  const success = await updateLogAction(toast.value)
  if (success) {
    showModalEdit.value = false
  }
}

const handleRemoveLogAction = async () => {
  const success = await removeLogAction(toast.value)
  if (success) {
    confirmDeleteModal.value = false
  }
}
</script>

<template>
  <LayoutDashboard> 
    <template #content>

      <LogActionList :LogActions="LogActions" @add-LogAction="showModal = true" @view-LogAction="LogActionView = $event; showModalView = true" @edit-LogAction="editLogAction($event); showModalEdit = true" @delete-LogAction="deleteLogAction($event); confirmDeleteModal = true" />
      
      <!-- Modal de creación -->
      <LogActionFormCreate v-model:visible="showModal" :LogAction="newLogAction"  @save="handleCreateLogAction" />

      <!-- Modal de edición -->
      
      <LogActionFormEdit v-model:visible="showModalEdit" :LogAction="LogActionEdit"  @save="handleUpdateLogAction" />

      <!-- Modal de confirmación de eliminación -->
      <ConfirmationModal v-model:visible="confirmDeleteModal" @confirm="handleRemoveLogAction" :texto="'El LogActiona se borrará. ¿Está seguro?'" />

      <!-- Modal de vista de usuario -->
      <LogActionaView v-model:visible="showModalView" :LogAction="LogActionView" />

      <!-- Toast para mensajes -->
      <Toast ref="toast" />
    </template>
  </LayoutDashboard>
</template>