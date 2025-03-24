import { ref } from 'vue'
import { apiRequest } from '@/api/apiClient'

export const Exposicions = ref([])
export const IdExposicionDelete = ref<string | number>("")
export const newExposicion = ref({ id:"", nombre: "", fechaInicio: "", fechaFin:""})
export const ExposicionEdit = ref({ id:0, nombre: "", fechaInicio: "", fechaFin:""})
export const ExposicionView = ref({id:"", nombre: "", fechaInicio: "", fechaFin:""})

export const fetchExposicions = async (params:any = null) => {
  try {
    const Exposiciona = <any> await apiRequest("exposicion.filtrar",params)
    Exposicions.value = Exposiciona.data
  } catch (error) {
    console.log(error)
  }
}

export const createExposicion = async (toast: any) => {
  if (!newExposicion.value.nombre || !newExposicion.value.fechaFin || !newExposicion.value.fechaInicio) {
    toast.add({ severity: 'warn', summary: 'Campos incompletos', detail: 'Todos los campos son obligatorios', life: 3000 })
    return
  }

  try {
    const response = <any> await apiRequest("exposicion.crear", {}, { ...newExposicion.value, isDeleted: false })
    if (response.success) {
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Log creado correctamente', life: 3000 })
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el Log', life: 3000 })
      throw new Error('Error al crear Log')
    }
    await fetchExposicions({page:1,limit:5});
    return true
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el Log', life: 3000 })
    return false
  }
}

export const editExposicion = (Exposicion: any) => {
  console.log(Exposicion)
  ExposicionEdit.value = { ...Exposicion, nombre: Exposicion.nombre }
}

export const updateExposicion = async (toast: any) => {
  if (!newExposicion.value.nombre || !newExposicion.value.fechaFin || !newExposicion.value.fechaInicio) {
    const usuario = ExposicionEdit.value
    const res = <any> await apiRequest("exposicion.actualizar", { id: ExposicionEdit.value.id }, usuario)
    if (res.nombre) {
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario Editado correctamente', life: 3000 })
    }
    await fetchExposicions({page:1,limit:5});
    return true 
  } else {
    toast.add({ severity: 'warn', summary: 'Campos incompletos', detail: 'Todos los campos son obligatorios', life: 3000 })
    return false
  }
}

export const deleteExposicion = (id: any) => {
  IdExposicionDelete.value = id
}

export const removeExposicion = async (toast: any) => {
  try {
    const idExposicion = IdExposicionDelete.value
    const response = <any> await apiRequest("exposicion.eliminar", { id: idExposicion })
    if (response.message) {
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Exposiciona eliminado correctamente', life: 3000 })
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el Exposiciona', life: 3000 })
    }
    await fetchExposicions({page:1,limit:5});
    return true 
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el Exposiciona', life: 3000 })
    return false
  }
}