<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import LayoutDashboard from '@/components/dashboard/LayoutDashboard.vue'
import UserList from '@/components/Modals/User/UserList.vue'
import UserFormEdit from '@/components/Modals/User/UserFormEdit.vue'
import UserFormCreate from '@/components/Modals/User/UserFormCreate.vue'
import ConfirmationModal from '@/components/Modals/ConfirmationModal.vue'
import UserView from '@/components/Modals/User/UserView.vue'
import Toast from 'primevue/toast'
import { Users, IdUserDelete, newUser, userEdit, userView, fetchUsers, createUser, editUser, updateUser, deleteUser, removeUser} from '@/composables/userFunctions'

const showModal = ref(false)
const showModalEdit = ref(false)
const confirmDeleteModal = ref(false)
const showModalView = ref(false)
const toast = ref()

const handleCreateUser = async () => {
  const success = await createUser(toast.value)
  if (success) {
    showModal.value = false
    newUser.value = { nombres: '', email: '', apellidos: '', password: '', confirmPassword: '' }
  }
}

const handleUpdateUser = async () => {
  const success = await updateUser(toast.value)
  if (success) {
    showModalEdit.value = false
  }
}

const handleRemoveUser = async () => {
  const success = await removeUser(toast.value)
  if (success) {
    confirmDeleteModal.value = false
  }
}
</script>

<template>
  <LayoutDashboard> 
    <template #content>

      <UserList :users="Users" @add-user="showModal = true" @view-user="userView = $event; showModalView = true" @edit-user="editUser($event); showModalEdit = true" @delete-user="deleteUser($event); confirmDeleteModal = true" />
      
      <!-- Modal de creación -->
      <UserFormCreate v-model:visible="showModal" :user="newUser"  @save="handleCreateUser" />

      <!-- Modal de edición -->
      
      <UserFormEdit v-model:visible="showModalEdit" :user="userEdit"  @save="handleUpdateUser" />

      <!-- Modal de confirmación de eliminación -->
      <ConfirmationModal v-model:visible="confirmDeleteModal" @confirm="handleRemoveUser" :texto="'El usuario se borrará. ¿Está seguro?'" />

      <!-- Modal de vista de usuario -->
      <UserView v-model:visible="showModalView" :user="userView" />


      <!-- Toast para mensajes -->
      <Toast ref="toast" />
    </template>
  </LayoutDashboard>
</template>