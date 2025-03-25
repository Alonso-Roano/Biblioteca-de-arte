<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LayoutDashboard from '@/components/dashboard/LayoutDashboard.vue'
import ArtistList from '@/components/Modals/Artista/ArtistaList.vue'
import ArtistFormEdit from '@/components/Modals/Artista/ArtistaFormEdit.vue'
import ArtistFormCreate from '@/components/Modals/Artista/ArtistaFormCreate.vue'
import ConfirmationModal from '@/components/Modals/ConfirmationModal.vue'
import ArtistaView from '@/components/Modals/Artista/ArtistaView.vue'
import Toast from 'primevue/toast'
import { Artists, IdArtistDelete, newArtist, ArtistEdit, ArtistView, fetchArtists, createArtist, editArtist, updateArtist, deleteArtist, removeArtist} from '@/composables/artistaFunctions'

const showModal = ref(false)
const showModalEdit = ref(false)
const confirmDeleteModal = ref(false)
const showModalView = ref(false)
const toast = ref()

const handleCreateArtist = async () => {
  const success = await createArtist(toast.value)
  if (success) {
    showModal.value = false
    newArtist.value = { nombres: '', email: '', apellidos: '', password: '', confirmPassword: '' }
  }
}

const handleUpdateArtist = async () => {
  const success = await updateArtist(toast.value)
  if (success) {
    showModalEdit.value = false
  }
}

const handleRemoveArtist = async () => {
  const success = await removeArtist(toast.value)
  if (success) {
    confirmDeleteModal.value = false
  }
}
</script>

<template>
  <LayoutDashboard> 
    <template #content>

      <ArtistList :artists="Artists" @add-Artist="showModal = true" @view-Artist="ArtistView = $event; showModalView = true" @edit-Artist="editArtist($event); showModalEdit = true" @delete-Artist="deleteArtist($event); confirmDeleteModal = true" />
      
      <!-- Modal de creación -->
      <ArtistFormCreate v-model:visible="showModal" :artist="newArtist"  @save="handleCreateArtist" />

      <!-- Modal de edición -->
      
      <ArtistFormEdit v-model:visible="showModalEdit" :artist="ArtistEdit"  @save="handleUpdateArtist" />

      <!-- Modal de confirmación de eliminación -->
      <ConfirmationModal v-model:visible="confirmDeleteModal" @confirm="handleRemoveArtist" :texto="'El Artista se borrará. ¿Está seguro?'" />

      <!-- Modal de vista de usuario -->
      <ArtistaView v-model:visible="showModalView" :artist="ArtistView" />

      <!-- Toast para mensajes -->
      <Toast ref="toast" />
    </template>
  </LayoutDashboard>
</template>