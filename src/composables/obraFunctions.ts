import { ref } from 'vue'
import { apiRequest } from '@/api/apiClient'

export const Obras = ref([])
export const IdObraDelete = ref<string | number>("")

export const fetchObras = async (params:any = null) => {
  try {
    const response = <any> await apiRequest("obra.filtrar", params)
    Obras.value = response.data
  } catch (error) {
    console.error("Error fetching obras:", error)
    throw error
  }
}

export const createObra = async (obraData:any, toast:any) => {
  if (!obraData.titulo || !obraData.descripcion || !obraData.precio ||
      !obraData.artistaId || !obraData.categoriaIds?.length) {
    toast.add({
      severity: 'warn',
      summary: 'Campos incompletos',
      detail: 'Todos los campos son obligatorios',
      life: 3000
    })
    return null
  }

  try {
    const obraSend = {...obraData, ImagenUrl:"url"}
    const response = <any> await apiRequest("obra.crear", {}, obraSend)
    console.log(response)
    if (response) {
      if (obraData.imagen) {
        await uploadObraImage(response, obraData.imagen)
      }
      await fetchObras({ page: 1, limit: 5 })
      return response.id
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

export const uploadObraImage = async (obraId:any, imageFile:any) => {
  if (!imageFile) return null

  try {
    const formData = new FormData()
    formData.append('idObra', obraId.toString())
    formData.append('archivo', imageFile)

    return await apiRequest(
      "obra.SubirImagenObra",
      { idObra: obraId },
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
  } catch (error) {
    console.error("Error uploading obra image:", error)
    throw error
  }
}

export const ObraEdit = ref({})

export const updateObra = async (obraData:any, toast:any) => {
  try {
    const response = await apiRequest(
      "obra.actualizar",
      { id: obraData.id },
      obraData
    )

    if (response) {
      toast.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Obra actualizada correctamente',
        life: 3000
      })

      if (obraData.imagen) {
        await uploadObraImage(obraData.id, obraData.imagen)
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

export const deleteObra = (id:any) => {
  IdObraDelete.value = id
}

export const removeObra = async (toast:any) => {
  try {
    const response = <any> await apiRequest("obra.eliminar", { id: IdObraDelete.value })
    if (response?.message) {
      toast.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Obra eliminada correctamente',
        life: 3000
      })
      await fetchObras({ page: 1, limit: 5 })
      return true
    }
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
