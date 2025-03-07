<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LayoutDashboard from '@/components/dashboard/LayoutDashboard.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { Button, Dialog, Toast } from 'primevue'
import { apiRequest } from '@/api/apiClient'
import { Icon } from "@iconify/vue"

const showModalView = ref(false)
const likes = ref([]) 
const loading = ref(true)
const libroIdView = ref<number | null>(null)
const confirmDeleteModal = ref(false)

const toast = ref()

const getLibroTitulo = (libroId: number) => {
  const libro = likes.value?.find((like: any) => like.libroId === libroId)
  return libro ? libro.tituloLibro : undefined
}

const getUsuariosQueDieronLike = (libroId: number) => {
  const libro = likes.value?.find(like => like.libroId === libroId)
  return libro ? libro.usuariosQueDieronLike.join(', ') : '' 
}

const fetchLikes = async () => {
  try {
    likes.value = await apiRequest("like.allLikesInfo")
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  fetchLikes()
})

const deleteAllLikes = async () => {
  try {
    await apiRequest("like.deleteAll")
    toast.value.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Todos los likes fueron eliminados',
      life: 3000,
    })
    fetchLikes()
  } catch (error) {
    toast.value.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron eliminar los likes',
      life: 3000,
    })
  } finally {
    confirmDeleteModal.value = false
  }
}
</script>

<template>
  <LayoutDashboard>
    <template #content>
      <div class="py-4 m-2">
        <div class="flex w-full justify-between mb-1.5">
          <h2 class="block text-2xl text-gray-600 p-2 font-semibold">Likes</h2>
          <div @click="confirmDeleteModal = true"
            class="flex items-center gap-0.5 rounded-md py-0.5 px-1 bg-red-500 text-white w-fit font-semibold ml-1 my-1 cursor-pointer">
            <Icon icon="mdi:delete" width="24" height="24" />
            <button>Eliminar todos los Likes</button>
          </div>
        </div>

        <!-- Tabla de Likes -->
        <DataTable :value="likes" tableStyle="min-width: 50rem" paginator :rows="5"
          :rowsPerPageOptions="[5, 10, 20, 50]">
          <Column field="tituloLibro" header="Título del Libro"></Column>
          <Column field="totalLikes" header="Total Likes"></Column>
          <Column header="Usuarios que dieron Like">
            <template #body="props">
              <span class="block">
                <!-- Mostrar los usuarios que dieron like, si existen -->
                {{ getUsuariosQueDieronLike(props.data.libroId) }}
              </span>
            </template>
          </Column>
        </DataTable>
      </div>

      <!-- Modal para eliminar todos los likes -->
      <Dialog v-model:visible="confirmDeleteModal" header="Confirmar Eliminación de Likes" :modal="true">
        <div class="p-4 text-gray-600">
          <p>¿Estás seguro de que deseas eliminar todos los likes?</p>
          <div class="flex justify-end gap-2 mt-4">
            <Button label="Cancelar" severity="secondary" @click="confirmDeleteModal = false" />
            <Button label="Eliminar Todos" severity="danger" @click="deleteAllLikes" />
          </div>
        </div>
      </Dialog>

      <Toast ref="toast" />
    </template>
  </LayoutDashboard>
</template>
