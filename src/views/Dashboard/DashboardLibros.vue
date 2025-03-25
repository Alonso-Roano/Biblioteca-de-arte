<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LayoutDashboard from '@/components/dashboard/LayoutDashboard.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { Button, Dialog, InputText, Checkbox, Toast } from 'primevue'
import { apiRequest } from '@/api/apiClient'
import { Icon } from "@iconify/vue"

import { useAuthStore } from '@/stores/authStore'
import { useObraStore } from '@/stores/ObraStore'

const authStore = useAuthStore()
const obraStore = useObraStore()

// const showModalEdit = ref(false)
const books = ref([])
const loading = ref(true)
// const confirmDeleteModal = ref(false)

const obraModal = ref(false)
const obra = ref({
  isDeleted: false,
  titulo: '',
  descripcion: '',
  precio: 0,
  imagenUrl: '',
  artistaId: 0,
  categoriaIds: []
})

// const showModal = ref(false)

const toast = ref()

const categorias = ref([])
const categoriasSeleccionadas = ref([])

// const handleFileChange = (e) => {
//   obra.value.imagenUrl = e.target.files[0]
// }

const handleSubmit = async () => {

  const artistaId = authStore.IdArtista;
  // console.log(artistaId);

  if (!artistaId) {
    alert('Faltan datos requeridos')
    return
  }

  const obraData = {
    titulo: obra.value.titulo,
    descripcion: obra.value.descripcion,
    precio: parseFloat(obra.value.precio.toFixed(2)),
    artistaId,
    imagenUrl: obra.value.imagenUrl,
    categoriaIds: [...categoriasSeleccionadas.value],
    isDeleted: false
  }

  const idObra = await obraStore.crearObra(obraData)

  if (idObra) {
    await obraStore.subirImagenObra(idObra, obra.value.imagenUrl)
    alert('Obra creada exitosamente')
  }
}

const fetchCategorias = async () => {
  try {
    categorias.value = await apiRequest("categoria.listar")
    // console.log(categorias.value);

  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  fetchCategorias()
})

</script>

<template>
  <LayoutDashboard>
    <template #content>
      <div class="py-4 m-2">
        <div class="flex w-full justify-between mb-1.5">
          <h2 class="block text-2xl text-gray-600 p-2 font-semibold">Libros</h2>
          <div @click="obraModal = true"
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
              <div
                :style="{ backgroundColor: props.data.color, width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #ccc' }">
              </div>
            </template>
          </Column>

          <Column header="Acciones">
            <template #body="props">
              <span class="block">
                <!-- <Button icon="pi pi-eye" variant="text" rounded aria-label="Ver" @click="viewBook(props.data)">
                  <Icon icon="akar-icons:info-fill" width="24" height="24" />
                </Button>
                <Button icon="pi pi-pencil" variant="text" severity="info" rounded aria-label="Editar"
                  @click="editBook(props.data)" >
                  <Icon icon="mdi:pencil-outline" width="24" height="24" />
                </Button>
                <Button icon="pi pi-trash" severity="danger" variant="text" rounded aria-label="Eliminar"
                  @click="deleteBook(props.data.id)" >
                  <Icon icon="material-symbols:delete" width="24" height="24" />
                </Button> -->
              </span>
            </template>
          </Column>
        </DataTable>
      </div>

      <Dialog v-model:visible="obraModal" header="Crear obra" :modal="true" style="background-color: #fff;">
        <form @submit.prevent="handleSubmit">
          <div class="flex flex-col gap-4">
          <div>
            <label class="block text-gray-600">Título</label>
            <InputText v-model="obra.titulo" class="w-full" />
          </div>
          <div>
            <label class="block text-gray-600">Descripción</label>
            <InputText v-model="obra.descripcion" class="w-full" />
          </div>
          <div>
            <label class="block text-gray-600">Precio</label>
            <input type="number" v-model="obra.precio" class="w-full" />
          </div>
          <div>
            <label class="block text-gray-600">Imagen</label>
            <InputText v-model="obra.imagenUrl" class="w-full" />
          </div>
          <h3>Categorías:</h3>
          <label v-for="categoria in categorias.data" :key="categoria.id">
            <input type="checkbox" :value="categoria.id" v-model="categoriasSeleccionadas" />
            {{ categoria.nombre }}
          </label>
          <div class="flex justify-end">
            <Button label="Crear" severity="secondary" type="submit" @click="obraModal = false" />
            <Button label="Cerrar" severity="secondary" @click="obraModal = false" />
          </div>
        </div>
        </form>
      </Dialog>
      <!-- Modal de creación -->
      <!-- <Dialog v-model:visible="showModal" header="Crear Libro" :modal="true">
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
      </Dialog> -->

      <!-- Modal de edición -->
      <!-- <Dialog v-model:visible="showModalEdit" header="Editar Libro" :modal="true">
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
      </Dialog> -->

      <!-- Modal para eliminación -->
      <!-- <Dialog v-model:visible="confirmDeleteModal" header="Confirmar Eliminación" :modal="true">
        <div class="p-4 text-gray-600">
          <p>¿Estás seguro de que deseas eliminar este libro?</p>
          <div class="flex justify-end gap-2 mt-4">
            <Button label="Cancelar" severity="secondary" @click="confirmDeleteModal = false" />
            <Button label="Eliminar" severity="danger" @click="removeBook" />
          </div>
        </div>
      </Dialog> -->
      <Toast ref="toast" />
    </template>
  </LayoutDashboard>
</template>
