<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LayoutDashboard from '@/components/dashboard/LayoutDashboard.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { Button, Dialog, InputText, Checkbox, Toast } from 'primevue'
import { apiRequest } from '@/api/apiClient'
import { Icon } from "@iconify/vue"

const showModalEdit = ref(false)
const books = ref([])
const loading = ref(true)
const bookIdDelete = ref<string | number>("")
const confirmDeleteModal = ref(false)

const showModalView = ref(false)
const bookView = ref({
  titulo: '',
  descripcion: '',
  slug: '',
  fechaPublicacion: '',
  autorNombre: '',
  color: '',
  etiquetaIds: []
})

const viewBook = (book: any) => {
  bookView.value = { ...book }
  showModalView.value = true
}

const showModal = ref(false)
const newBook = ref({
  titulo: '',
  descripcion: '',
  slug: '',
  fechaPublicacion: new Date().toISOString(),
  autorId: 0,
  color: '#ffffff',
  etiquetaIds: []
})

const bookEdit = ref({
  id: 0,
  titulo: '',
  descripcion: '',
  slug: '',
  fechaPublicacion: '',
  autorId: 0,
  color: '#ffffff',
  etiquetaIds: []
})

const etiquetas = ref([
  { id: 1, nombre: 'Fantasía' },
  { id: 2, nombre: 'Ciencia Ficción' },
  { id: 3, nombre: 'Romántico' }
])

const autores = ref([])

const fetchEtiquetas = async () => {
  try {
    etiquetas.value = await apiRequest("etiqueta.listar"); 
  } catch (error) {
    console.log(error)
  }
}
const fetchAutores = async () => {
  try {
    autores.value = await apiRequest("usuario.listar"); 
  } catch (error) {
    console.log(error)
  }
}

const toast = ref()

const fetchBooks = async () => {
  try {
    books.value = await apiRequest("libro.listar")
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  fetchEtiquetas();
  fetchAutores();
  fetchBooks();
})

const createBook = async () => {
  if (!newBook.value.titulo || !newBook.value.descripcion || !newBook.value.slug || !newBook.value.autorId) {
    toast.value.add({
      severity: 'warn',
      summary: 'Campos incompletos',
      detail: 'Todos los campos son obligatorios',
      life: 3000,
    })
    return
  }

  try {
    const autor = autores.value.find(a => a.id === newBook.value.autorId)
    const response: any = await apiRequest("libro.crear", {}, { 
      ...newBook.value, 
      autorNombre: autor?.nombre
    })
    console.log(response);
      toast.value.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Libro creado correctamente',
        life: 3000,
      })
      showModal.value = false
      fetchBooks()
  } catch (error) {
    toast.value.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo crear el libro',
      life: 3000,
    })
  }
}

const editBook = (book: any) => {
  bookEdit.value = { ...book }
  showModalEdit.value = true
}

const updateBook = async () => {
  try {
    const response: any = await apiRequest("libro.actualizar", { id: bookEdit.value.id }, { ...bookEdit.value })
    if (response.id) {
      toast.value.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Libro editado correctamente',
        life: 3000,
      })
      showModalEdit.value = false
      fetchBooks()
    } else {
      throw new Error('Error al actualizar el libro')
    }
  } catch (error) {
    toast.value.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo actualizar el libro',
      life: 3000,
    })
  }
}

const deleteBook = (id: any) => {
  bookIdDelete.value = id
  confirmDeleteModal.value = true
}

const removeBook = async () => {
  try {
    const response: any = await apiRequest("libro.eliminar", { id: bookIdDelete.value })
    if (response.message) {
      toast.value.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Libro eliminado correctamente',
        life: 3000,
      })
      fetchBooks()
    } else {
      throw new Error('Error al eliminar el libro')
    }
  } catch (error) {
    toast.value.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo eliminar el libro',
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
          <h2 class="block text-2xl text-gray-600 p-2 font-semibold">Libros</h2>
          <div @click="showModal = true"
            class="flex items-center gap-0.5 rounded-md py-0.5 px-1 bg-blue-500 text-white w-fit font-semibold ml-1 my-1 cursor-pointer">
            <Icon icon="akar-icons:plus" width="24" height="24" />
            <button>Añadir</button>
          </div>
        </div>
        <!-- Tabla de libros -->
        <DataTable :value="books" tableStyle="min-width: 50rem" paginator :rows="5"
          :rowsPerPageOptions="[5, 10, 20, 50]">
          <Column field="titulo" header="Título"></Column>
          <Column field="descripcion" header="Descripción"></Column>
          <Column field="slug" header="Slug"></Column>
          <Column field="color" header="Color">
            <template #body="props">
              <div :style="{ backgroundColor: props.data.color, width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #ccc' }">
              </div>
            </template>
          </Column>

          <Column header="Acciones">
            <template #body="props">
              <span class="block">
                <Button icon="pi pi-eye" variant="text" rounded aria-label="Ver" @click="viewBook(props.data)">
                  <Icon icon="akar-icons:info-fill" width="24" height="24" />
                </Button>
                <Button icon="pi pi-pencil" variant="text" severity="info" rounded aria-label="Editar"
                  @click="editBook(props.data)" >
                  <Icon icon="mdi:pencil-outline" width="24" height="24" />
                </Button>
                <Button icon="pi pi-trash" severity="danger" variant="text" rounded aria-label="Eliminar"
                  @click="deleteBook(props.data.id)" >
                  <Icon icon="material-symbols:delete" width="24" height="24" />
                </Button>
              </span>
            </template>
          </Column>
        </DataTable>
      </div>

      <Dialog v-model:visible="showModalView" header="Detalles del Libro" :modal="true" style="background-color: #fff;">
  <div class="flex flex-col gap-4">
    <div>
      <label class="block text-gray-600">Título</label>
      <InputText v-model="bookView.titulo" class="w-full" disabled />
    </div>
    <div>
      <label class="block text-gray-600">Descripción</label>
      <InputText v-model="bookView.descripcion" class="w-full" disabled />
    </div>
    <div>
      <label class="block text-gray-600">Slug</label>
      <InputText v-model="bookView.slug" class="w-full" disabled />
    </div>
    <div>
      <label class="block text-gray-600">Fecha de Publicación</label>
      <InputText v-model="bookView.fechaPublicacion" class="w-full" disabled />
    </div>
    <div>
      <label class="block text-gray-600">Autor</label>
      <InputText v-model="bookView.autorNombre" class="w-full" disabled />
    </div>
    <div>
      <label class="block text-gray-600">Color</label>
      <div :style="{ backgroundColor: bookView.color, width: '100%', height: '24px', borderRadius: '4px', border: '1px solid #ccc' }">
      </div>
    </div>
    <div>
      <label class="block text-gray-600">Etiquetas</label>
      <div class="flex flex-wrap gap-2">
        <span v-for="etiquetaId in bookView.etiquetaIds" :key="etiquetaId" class="px-2 py-1 bg-blue-200 rounded">
          {{ etiquetas.find(e => e.id === etiquetaId)?.nombre || 'Etiqueta desconocida' }}
        </span>
      </div>
    </div>
    <div class="flex justify-end">
      <Button label="Cerrar" severity="secondary" @click="showModalView = false" />
    </div>
  </div>
</Dialog>
      <!-- Modal de creación -->
      <Dialog v-model:visible="showModal" header="Crear Libro" :modal="true">
        <div class="flex flex-col gap-4">
          <div>
            <label class="block text-gray-600">Título</label>
            <InputText v-model="newBook.titulo" class="w-full" />
          </div>
          <div>
            <label class="block text-gray-600">Descripción</label>
            <InputText v-model="newBook.descripcion" class="w-full" />
          </div>
          <div>
            <label class="block text-gray-600">Slug</label>
            <InputText v-model="newBook.slug" class="w-full" />
          </div>
          <div>
            <label class="block text-gray-600">Autor</label>
            <select v-model="newBook.autorId" class="w-full p-inputtext">
              <option v-for="autor in autores" :key="autor.id" :value="autor.id">
                {{ autor.nombre }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-gray-600">Color</label>
            <InputText type="color" v-model="newBook.color" class="w-full" />
          </div>
          <div>
            <label class="block text-gray-600">Etiquetas</label>
            <div class="flex gap-3" v-for="etiqueta in etiquetas">
              <Checkbox  :key="etiqueta.id" :value="etiqueta.id" v-model="newBook.etiquetaIds">
              </Checkbox>
              <p>{{ etiqueta.nombre }}</p>
            </div>
          </div>
          <div class="flex justify-end gap-2">
            <Button label="Cancelar" severity="secondary" @click="showModal = false" />
            <Button label="Crear" severity="success" @click="createBook" />
          </div>
        </div>
      </Dialog>

      <!-- Modal de edición -->
      <Dialog v-model:visible="showModalEdit" header="Editar Libro" :modal="true">
        <div class="flex flex-col gap-4">
          <div>
            <label class="block text-gray-600">Título</label>
            <InputText v-model="bookEdit.titulo" class="w-full" />
          </div>
          <div>
            <label class="block text-gray-600">Descripción</label>
            <InputText v-model="bookEdit.descripcion" class="w-full" />
          </div>
          <div>
            <label class="block text-gray-600">Slug</label>
            <InputText v-model="bookEdit.slug" class="w-full" />
          </div>
          <div>
            <label class="block text-gray-600">Autor</label>
            <select v-model="bookEdit.autorId" class="w-full p-inputtext">
              <option v-for="autor in autores" :key="autor.id" :value="autor.id">
                {{ autor.nombre }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-gray-600">Color</label>
            <InputText type="color" v-model="bookEdit.color" class="w-full" />
          </div>
          <div>
            <label class="block text-gray-600">Etiquetas</label>
            <div class="flex gap-3" v-for="etiqueta in etiquetas">
              <Checkbox  :key="etiqueta.id" :value="etiqueta.id" v-model="newBook.etiquetaIds">
              </Checkbox>
              <p>{{ etiqueta.nombre }}</p>
            </div>
          </div>
          <div class="flex justify-end gap-2">
            <Button label="Cancelar" severity="secondary" @click="showModalEdit = false" />
            <Button label="Guardar" severity="success" @click="updateBook" />
          </div>
        </div>
      </Dialog>

      <!-- Modal para eliminación -->
      <Dialog v-model:visible="confirmDeleteModal" header="Confirmar Eliminación" :modal="true">
        <div class="p-4 text-gray-600">
          <p>¿Estás seguro de que deseas eliminar este libro?</p>
          <div class="flex justify-end gap-2 mt-4">
            <Button label="Cancelar" severity="secondary" @click="confirmDeleteModal = false" />
            <Button label="Eliminar" severity="danger" @click="removeBook" />
          </div>
        </div>
      </Dialog>
      <Toast ref="toast" />
    </template>
  </LayoutDashboard>
</template>
