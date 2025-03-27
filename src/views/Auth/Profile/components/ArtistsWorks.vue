<script setup lang="ts">
import { ref, onMounted , computed} from 'vue'
import { useArtistProfileStore } from '@/stores/ArtistProfileStore'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import MultiSelect from 'primevue/multiselect'
import FileUpload from 'primevue/fileupload'
import ConfirmDialog from 'primevue/confirmdialog'
import { fetchObras, Obras, createObra, removeObra, updateObra, newObra } from '@/composables/obraFunctions.ts'
import { fetchCategorias, Categorias } from '@/composables/categoriaFunctions.ts'
import type { RefSymbol } from '@vue/reactivity'

export interface Categoria {
  id: string | number
  nombre: string
  descripcionCategoria?: string
  nombreCorto?: string
}

export interface Obra {
  id?: string | number
  titulo: string
  descripcion: string
  precio: number | null
  artistaId: string | number
  categoriaIds?: (string | number)[]
  categorias?: Categoria[]
  imagen?: File | null
  imagenUrl?: string
}

const artistStore = useArtistProfileStore()
const toast = useToast()
const confirm = useConfirm()

const modalVisible = ref(false)
const obras = ref<Obra[]>([])
const categorias = ref<Categoria[]>([])
const obraActual = ref<Obra | null>(null)
const imagePreview = ref<string | null>(null)
const loading = ref(false)


const newObra = ref<Obra>({
  titulo: '',
  descripcion: '',
  precio: null,
  artistaId: artistStore.artistProfile?.id || '',
  categoriaIds: [],
  imagen: null
})

onMounted(async () => {
  await cargarDatosIniciales()
  artistStore.fetchColeccionesArtista()
})

const artistaId = computed(() => artistStore.artistProfile?.id || '')


const cargarDatosIniciales = async () => {
  loading.value = true
  try {
    const [cats, obs] = await Promise.all([
      fetchCategorias(),
      fetchObras()
    ])

    categorias.value = Categorias.value
    console.log(categorias.value);

    obras.value = Obras.value
  } catch (error) {
    console.error("Error al cargar datos:", error)
    mostrarError("No se pudieron cargar los datos")
  } finally {
    loading.value = false
  }
}

const mostrarError = (mensaje: string) => {
  toast.add({
    severity: 'error',
    summary: 'Error',
    detail: mensaje,
    life: 3000
  })
}

const mostrarExito = (mensaje: string) => {
  toast.add({
    severity: 'success',
    summary: 'Éxito',
    detail: mensaje,
    life: 3000
  })
}


const limpiarFormulario = () => {
  newObra.value = {
    id: "",
    titulo: "",
    descripcion: "",
    precio: null,
    artistaId: artistStore.artistProfile?.id || "",
    categoriaIds: [],
    imagen: null
  }
  imagePreview.value = null
}

const abrirCrearModal = () => {
  resetearFormulario()
  modalVisible.value = true
}

const abrirEditarModal = (obra: Obra) => {
  obraActual.value = obra
  newObra.value = {
    ...obra,
    categoriaIds: obra.categorias?.map(c => c.id) || [],
    imagen: null
  }

  if (obra.imagenUrl) {
    imagePreview.value = getImageUrl(obra.imagenUrl)
  }

  modalVisible.value = true
}

const resetearFormulario = () => {
  newObra.value = {
    titulo: '',
    descripcion: '',
    precio: null,
    artistaId: artistaId.value,
    categoriaIds: [],
    imagen: null
  }
  imagePreview.value = null
  obraActual.value = null
}


const validarFormulario = (): boolean => {
  if (!newObra.value.titulo.trim()) {
    mostrarError('El título es obligatorio')
    return false
  }

  if (newObra.value.precio === null || newObra.value.precio <= 0) {
    mostrarError('El precio debe ser mayor que cero')
    return false
  }

  if (!newObra.value.categoriaIds?.length) {
    mostrarError('Selecciona al menos una categoría')
    return false
  }

  return true
}


const guardarObra = async () => {
  if (!validarFormulario()) return

  loading.value = true

  try {
    const formData = new FormData()

    formData.append('titulo', newObra.value.titulo)
    formData.append('descripcion', newObra.value.descripcion)
    formData.append('precio', String(newObra.value.precio))
    formData.append('artistaId', String(artistaId.value))



    // Agregar categorías
    newObra.value.categoriaIds?.forEach(id => {
      formData.append('categoriaIds', String(id))
    })

    // Agregar imagen si existe
    if (newObra.value.imagen) {
      formData.append('imagen', newObra.value.imagen)
    }



    for (let [key, value] of formData.entries()) {
      console.log(key, value)
    }


    const isEditing = !!obraActual.value?.id
    let response

    if (isEditing) {
      formData.append('id', String(obraActual?.value?.id))
      response = await updateObra(formData)
    } else {

      response = await createObra(toast, newObra)
    }

    if (response) {
      mostrarExito(isEditing ? 'Obra actualizada' : 'Obra creada')
      await cargarDatosIniciales()
      modalVisible.value = false
    }
  } catch (error) {
    console.error("Error al guardar obra:", error)
    mostrarError('No se pudo guardar la obra')
  } finally {
    loading.value = false
  }

}

const confirmarEliminacion = (obra: Obra) => {
  confirm.require({
    message: `¿Seguro que quieres eliminar "${obra.titulo}"?`,
    header: 'Confirmar eliminación',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        const success = await removeObra(obra.id!)
        if (success) {
          obras.value = obras.value.filter(o => o.id !== obra.id)
          mostrarExito('Obra eliminada')
        }
      } catch (error) {
        console.error("Error al eliminar obra:", error)
        mostrarError('No se pudo eliminar la obra')
      }
    }
  })
}

const handleFileUpload = (event: { files: File[] }) => {
  const file = event.files[0]
  if (file) {
    if (!file.type.startsWith('image/')) {
      mostrarError('El archivo debe ser una imagen')
      return
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB
      mostrarError('La imagen no debe exceder 2MB')
      return
    }

    newObra.value.imagen = file

    // Crear preview
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

  const baseUrl = import.meta.env.VITE_APP_URL;

const getImageUrl = (path:any) => {
  return `${baseUrl}${path}`;
};


</script>


<template>
  <div class="container mx-auto px-4 py-6">
    <ConfirmDialog />

    <!-- Header y botón de nueva obra -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Mis Obras</h1>
      <Button
        label="Nueva Obra"
        icon="pi pi-plus"
        @click="abrirCrearModal"
        class="bg-orange-500 hover:bg-orange-600 border-orange-500"
      />
    </div>

    <!-- Modal de obra -->
    <Dialog
      v-model:visible="modalVisible"
      :header="obraActual ? 'Editar Obra' : 'Nueva Obra'"
      :style="{ width: '500px' }"
      :modal="true"
      @onSuccess="artistStore.fetchColeccionesArtista"
    >
      <div class="space-y-4">
        <div class="space-y-2">
          <InputText v-model="newObra.titulo" class="w-full" placeholder="Título"/>
        </div>

        <div class="space-y-2">
          <InputText v-model="newObra.descripcion" class="w-full" placeholder="Descripción" />
        </div>

        <div class="space-y-2">
          <InputNumber
            v-model="newObra.precio"
            mode="currency"
            placeholder="Precio"
            currency="MXN"
            locale="es-MX"
            class="w-full"

          />
        </div>

        <div class="space-y-2">
          <MultiSelect
            v-model="newObra.categoriaIds"
            :options="categorias"
            optionLabel="nombre"
            optionValue="id"
            placeholder="Selecciona categorías"
            class="w-full"
          />
        </div>

        <div class="space-y-2">
          <FileUpload
            mode="basic"
            accept="image/*"
            :maxFileSize="2000000"
            @select="handleFileUpload"
            chooseLabel="Seleccionar imagen"
            class="w-full"
          />

          <div v-if="imagePreview" class="mt-2">
            <img
              :src="imagePreview"
              alt="Vista previa"
              class="max-h-40 object-contain rounded border w-full"
            />
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-4">
          <Button
            label="Cancelar"
            icon="pi pi-times"
            severity="secondary"
            @click="modalVisible = false"
          />
          <Button
            label="Guardar"
            icon="pi pi-check"
            :loading="loading"
            @click="guardarObra"
            class="bg-orange-500 hover:bg-orange-600 border-orange-500"
          />
        </div>
      </div>
    </Dialog>

    <!-- Estado de carga -->
    <div v-if="loading && obras.length === 0" class="text-center py-12">
      <ProgressSpinner />
      <p class="mt-2 text-gray-600">Cargando obras...</p>
    </div>

    <!-- Lista vacía -->
    <div v-else-if="obras.length === 0" class="text-center py-12 border rounded-lg bg-gray-50">
      <i class="pi pi-image text-4xl text-gray-400" />
      <p class="mt-2 text-gray-600">No tienes obras registradas</p>
      <Button
        label="Crear primera obra"
        icon="pi pi-plus"
        @click="abrirCrearModal"
        class="mt-4 bg-orange-500 hover:bg-orange-600 border-orange-500"
      />
    </div>

    <!-- Grid de obras -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="obra in obras"
        :key="obra.id"
        class="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
      >
        <div class="h-48 bg-gray-100 overflow-hidden">
          <img
            :src="getImageUrl(obra.imagenUrl) || 'https://via.placeholder.com/400x200?text=Sin+imagen'"
            :alt="obra.titulo"
            class="w-full h-full object-cover"
          />
        </div>

        <div class="p-4">
          <h3 class="font-semibold text-lg text-orange-500">{{ obra.titulo }}</h3>
          <p class="text-gray-600 mt-1 line-clamp-2">{{ obra.descripcion || 'Sin descripción' }}</p>

          <div class="mt-3 flex items-center justify-between">
            <span class="font-medium">
              {{ new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(obra.precio || 0) }}
            </span>

            <div class="flex gap-2">
              <Button
                icon="pi pi-pencil"
                severity="secondary"
                size="small"
                @click="abrirEditarModal(obra)"
              />
              <Button
                icon="pi pi-trash"
                severity="danger"
                size="small"
                @click="confirmarEliminacion(obra)"
              />
            </div>
          </div>

          <div v-if="obra.categorias?.length" class="mt-3 flex flex-wrap gap-1">
            <Tag
              v-for="cat in obra.categorias"
              :key="cat.id"
              :value="cat.nombre"
              severity="info"
              size="small"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
