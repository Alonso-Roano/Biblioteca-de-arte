import { ref } from 'vue'
import { apiRequest } from '@/api/apiClient'

export const Obras = ref([])
export const IdObraDelete = ref<string | number>("")
export const newObra = ref({
  id: "",
  titulo: "",
  descripcion: "",
  precio: 0,
  imagenUrl: "",
  artistaId: null,
  categoriaIds: [],
  imagen: null // Para manejar el archivo de imagen
})
export const ObraEdit = ref({ 
  id: 0, 
  titulo: "", 
  descripcion: "", 
  precio: 0,
  imagenUrl: "",
  artistaId: null,
  categoriaIds: []
})
export const ObraView = ref({
  id: "",
  titulo: "", 
  descripcion: "", 
  precio: 0,
  imagenUrl: "",
  artistaId: null,
  categoriaIds: []
})

export const fetchObras = async (params: any = null) => {
  try {
    const response = await apiRequest("obra.filtrar", params)
    Obras.value = response.data
  } catch (error) {
    console.error("Error fetching obras:", error)
    throw error
  }
}

export const createObra = async (toast: any) => {
  // Validación básica
  if (!newObra.value.titulo || !newObra.value.descripcion || 
      !newObra.value.precio || !newObra.value.artistaId || 
      !newObra.value.categoriaIds || newObra.value.categoriaIds.length === 0) {
    toast.add({ 
      severity: 'warn', 
      summary: 'Campos incompletos', 
      detail: 'Todos los campos son obligatorios', 
      life: 3000 
    })
    return null
  }

  try {
    // Primero creamos la obra sin la imagen
    const obraData = {
      titulo: newObra.value.titulo,
      descripcion: newObra.value.descripcion,
      precio: newObra.value.precio,
      imagenUrl: "", // Se actualizará después de subir la imagen
      artistaId: newObra.value.artistaId,
      categoriaIds: newObra.value.categoriaIds
    }

    const response = await apiRequest("obra.crear", {}, obraData)
    
    if (response && response.id) {
      toast.add({ 
        severity: 'success', 
        summary: 'Éxito', 
        detail: 'Obra creada correctamente', 
        life: 3000 
      })

      // Si hay una imagen, la subimos
      if (newObra.value.imagen) {
        await uploadObraImage(response.id, newObra.value.imagen)
      }

      await fetchObras({ page: 1, limit: 5 })
      return response.id // Retornamos el ID de la obra creada
    } else {
      throw new Error('No se recibió un ID de obra válido')
    }
  } catch (error) {
    console.error("Error creating obra:", error)
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'No se pudo crear la obra', 
      life: 3000 
    })
    return null
  }
}

export const uploadObraImage = async (obraId: number, imageFile: File) => {
  if (!imageFile) return null

  try {
    const formData = new FormData()
    formData.append('idObra', obraId.toString())
    formData.append('archivo', imageFile)

    const response = await apiRequest(
      "obra.SubirImagenObra", 
      { idObra: obraId }, 
      formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    return response
  } catch (error) {
    console.error("Error uploading obra image:", error)
    throw error
  }
}

export const editObra = (obra: any) => {
  ObraEdit.value = { 
    ...obra, 
    titulo: obra.titulo,
    artistaId: obra.artistaId,
    categoriaIds: obra.categorias?.map((c: any) => c.id) || []
  }
}

export const updateObra = async (toast: any) => {
  try {
    const obraData = {
      titulo: ObraEdit.value.titulo,
      descripcion: ObraEdit.value.descripcion,
      precio: ObraEdit.value.precio,
      artistaId: ObraEdit.value.artistaId,
      categoriaIds: ObraEdit.value.categoriaIds
    }

    const response = await apiRequest(
      "obra.actualizar", 
      { id: ObraEdit.value.id }, 
      obraData
    )

    if (response) {
      toast.add({ 
        severity: 'success', 
        summary: 'Éxito', 
        detail: 'Obra actualizada correctamente', 
        life: 3000 
      })

      // Si hay una nueva imagen, la subimos
      if (newObra.value.imagen) {
        await uploadObraImage(ObraEdit.value.id, newObra.value.imagen)
      }

      await fetchObras({ page: 1, limit: 5 })
      return true
    }
  } catch (error) {
    console.error("Error updating obra:", error)
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'No se pudo actualizar la obra', 
      life: 3000 
    })
    return false
  }
}

export const deleteObra = (id: any) => {
  IdObraDelete.value = id
}

export const removeObra = async (toast: any) => {
  try {
    const idObra = IdObraDelete.value
    const response = await apiRequest("obra.eliminar", { id: idObra })
    
    if (response.message) {
      toast.add({ 
        severity: 'success', 
        summary: 'Éxito', 
        detail: 'Obra eliminada correctamente', 
        life: 3000 
      })
    } else {
      toast.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'No se pudo eliminar la obra', 
        life: 3000 
      })
    }
    
    await fetchObras({ page: 1, limit: 5 })
    return true
  } catch (error) {
    console.error("Error deleting obra:", error)
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'No se pudo eliminar la obra', 
      life: 3000 
    })
    return false
  }
}

// Función para resetear el estado de newObra
export const resetNewObra = () => {
  newObra.value = {
    id: "",
    titulo: "",
    descripcion: "",
    precio: 0,
    imagenUrl: "",
    artistaId: null,
    categoriaIds: [],
    imagen: null
  }
}