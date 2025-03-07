<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LayoutDashboard from '@/components/dashboard/LayoutDashboard.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { Button, Dialog, InputText, Toast } from 'primevue'
import { apiRequest } from '@/api/apiClient'
import { Icon } from "@iconify/vue"

const showModalEdit = ref(false)
const etiquetas = ref([])
const loading = ref(true)
const etiquetaIdDelete = ref<number | null>(null)
const confirmDeleteModal = ref(false)

const showModal = ref(false)
const newEtiqueta = ref({
  nombre: ''
})

const etiquetaEdit = ref({
  id: 0,
  nombre: ''
})

const fetchEtiquetas = async () => {
  try {
    etiquetas.value = await apiRequest("etiqueta.listar")
  } catch (error) {
    console.log(error)
  }
}

const toast = ref()

onMounted(() => {
  fetchEtiquetas()
})

const createEtiqueta = async () => {
  if (!newEtiqueta.value.nombre) {
    toast.value.add({
      severity: 'warn',
      summary: 'Campos incompletos',
      detail: 'El nombre de la etiqueta es obligatorio',
      life: 3000,
    })
    return
  }

  try {
    await apiRequest("etiqueta.crear", {}, { ...newEtiqueta.value })
    toast.value.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Etiqueta creada correctamente',
      life: 3000,
    })
    showModal.value = false
    fetchEtiquetas()
  } catch (error) {
    toast.value.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo crear la etiqueta',
      life: 3000,
    })
  }
}

const editEtiqueta = (etiqueta: any) => {
  etiquetaEdit.value = { ...etiqueta }
  showModalEdit.value = true
}

const updateEtiqueta = async () => {
  try {
    await apiRequest("etiqueta.actualizar", { id: etiquetaEdit.value.id }, { ...etiquetaEdit.value })
    toast.value.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Etiqueta editada correctamente',
      life: 3000,
    })
    showModalEdit.value = false
    fetchEtiquetas()
  } catch (error) {
    toast.value.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo actualizar la etiqueta',
      life: 3000,
    })
  }
}

const deleteEtiqueta = (id: number) => {
  etiquetaIdDelete.value = id
  confirmDeleteModal.value = true
}

const removeEtiqueta = async () => {
  if (etiquetaIdDelete.value === null) return

  try {
    await apiRequest("etiqueta.eliminar", { id: etiquetaIdDelete.value })
    toast.value.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Etiqueta eliminada correctamente',
      life: 3000,
    })
    fetchEtiquetas()
  } catch (error) {
    toast.value.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo eliminar la etiqueta',
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
          <h2 class="block text-2xl text-gray-600 p-2 font-semibold">Etiquetas</h2>
          <div @click="showModal = true"
            class="flex items-center gap-0.5 rounded-md py-0.5 px-1 bg-blue-500 text-white w-fit font-semibold ml-1 my-1 cursor-pointer">
            <Icon icon="akar-icons:plus" width="24" height="24" />
            <button>Añadir</button>
          </div>
        </div>

        <!-- Tabla de etiquetas -->
        <DataTable :value="etiquetas" tableStyle="min-width: 50rem" paginator :rows="5"
          :rowsPerPageOptions="[5, 10, 20, 50]">
          <Column field="nombre" header="Nombre"></Column>
          <Column header="Acciones">
            <template #body="props">
              <span class="block">
                <Button icon="pi pi-pencil" variant="text" severity="info" rounded aria-label="Editar"
                  @click="editEtiqueta(props.data)">
                  <Icon icon="mdi:pencil-outline" width="24" height="24" />
                </Button>
                <Button icon="pi pi-trash" severity="danger" variant="text" rounded aria-label="Eliminar"
                  @click="deleteEtiqueta(props.data.id)">
                  <Icon icon="material-symbols:delete" width="24" height="24" />
                </Button>
              </span>
            </template>
          </Column>
        </DataTable>
      </div>

      <!-- Modal de creación -->
      <Dialog v-model:visible="showModal" header="Crear Etiqueta" :modal="true">
        <div class="flex flex-col gap-4">
          <div>
            <label class="block text-gray-600">Nombre</label>
            <InputText v-model="newEtiqueta.nombre" class="w-full" />
          </div>
          <div class="flex justify-end gap-2">
            <Button label="Cancelar" severity="secondary" @click="showModal = false" />
            <Button label="Crear" severity="success" @click="createEtiqueta" />
          </div>
        </div>
      </Dialog>

      <!-- Modal de edición -->
      <Dialog v-model:visible="showModalEdit" header="Editar Etiqueta" :modal="true">
        <div class="flex flex-col gap-4">
          <div>
            <label class="block text-gray-600">Nombre</label>
            <InputText v-model="etiquetaEdit.nombre" class="w-full" />
          </div>
          <div class="flex justify-end gap-2">
            <Button label="Cancelar" severity="secondary" @click="showModalEdit = false" />
            <Button label="Guardar" severity="success" @click="updateEtiqueta" />
          </div>
        </div>
      </Dialog>

      <!-- Modal para eliminación -->
      <Dialog v-model:visible="confirmDeleteModal" header="Confirmar Eliminación" :modal="true">
        <div class="p-4 text-gray-600">
          <p>¿Estás seguro de que deseas eliminar esta etiqueta?</p>
          <div class="flex justify-end gap-2 mt-4">
            <Button label="Cancelar" severity="secondary" @click="confirmDeleteModal = false" />
            <Button label="Eliminar" severity="danger" @click="removeEtiqueta" />
          </div>
        </div>
      </Dialog>

      <Dialog v-model:visible="showModalView" header="Detalles de Etiqueta" :modal="true">
        <div class="p-4 text-gray-600">
          <p><strong>Nombre:</strong> {{ etiquetaView.nombre }}</p>
          <div class="flex justify-end mt-4">
            <Button label="Cerrar" severity="secondary" @click="showModalView = false" />
          </div>
        </div>
      </Dialog>
      <Toast ref="toast" />
    </template>
  </LayoutDashboard>
</template>
