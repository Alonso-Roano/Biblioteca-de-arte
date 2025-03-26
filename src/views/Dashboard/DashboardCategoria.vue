<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LayoutDashboard from '@/components/dashboard/LayoutDashboard.vue'
import CategoriaList from '@/components/Modals/Categorias/CategoriaList.vue'
import CategoriaFormEdit from '@/components/Modals/Categorias/CategoriaFormEdit.vue'
import CategoriaFormCreate from '@/components/Modals/Categorias/CategoriaFormCreate.vue'
import ConfirmationModal from '@/components/Modals/ConfirmationModal.vue'
import CategoriaaView from '@/components/Modals/Categorias/CategoriaView.vue'
import Toast from 'primevue/toast'
import { Categorias, IdCategoriaDelete, newCategoria, CategoriaEdit, CategoriaView, fetchCategorias, createCategoria, editCategoria, updateCategoria, deleteCategoria, removeCategoria} from '@/composables/categoriaFunctions'

const showModal = ref(false)
const showModalEdit = ref(false)
const confirmDeleteModal = ref(false)
const showModalView = ref(false)
const toast = ref()

const handleCreateCategoria = async () => {
  const success = await createCategoria(toast.value)
  if (success) {
    showModal.value = false
    newCategoria.value = {id:"", nombre: "", descripcionCategoria: "", nombreCorto:""}
  }
}

const handleUpdateCategoria = async () => {
  const success = await updateCategoria(toast.value)
  if (success) {
    showModalEdit.value = false
  }
}

const handleRemoveCategoria = async () => {
  const success = await removeCategoria(toast.value)
  if (success) {
    confirmDeleteModal.value = false
  }
}
</script>

<template>
  <LayoutDashboard> 
    <template #content>

      <CategoriaList :Categorias="Categorias" @add-Categoria="showModal = true" @view-Categoria="CategoriaView = $event; showModalView = true" @edit-Categoria="editCategoria($event); showModalEdit = true" @delete-Categoria="deleteCategoria($event); confirmDeleteModal = true" />
      
      <!-- Modal de creación -->
      <CategoriaFormCreate v-model:visible="showModal" :Categoria="newCategoria"  @save="handleCreateCategoria" />

      <!-- Modal de edición -->
      
      <CategoriaFormEdit v-model:visible="showModalEdit" :Categoria="CategoriaEdit"  @save="handleUpdateCategoria" />

      <!-- Modal de confirmación de eliminación -->
      <ConfirmationModal v-model:visible="confirmDeleteModal" @confirm="handleRemoveCategoria" :texto="'El Categoriaa se borrará. ¿Está seguro?'" />

      <!-- Modal de vista de usuario -->
      <CategoriaaView v-model:visible="showModalView" :Categoria="CategoriaView" />

      <!-- Toast para mensajes -->
      <Toast ref="toast" />
    </template>
  </LayoutDashboard>
</template>