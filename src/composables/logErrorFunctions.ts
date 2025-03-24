import { ref } from 'vue'
import { apiRequest } from '@/api/apiClient'

export const LogErrors = ref([])
export const IdLogErrorDelete = ref<string | number>("")
export const newLogError = ref({ id:"", source: "", message: "", stackTrace: "" })
export const LogErrorEdit = ref({ id:0, source: "", message: "", stackTrace: ""})
export const LogErrorView = ref({id:"", source: "", message: "", stackTrace: ""})

export const fetchLogErrors = async (params:any = null) => {
  try {
    const LogErrora = <any> await apiRequest("logError.filtrar",params)
    LogErrors.value = LogErrora.data
  } catch (error) {
    console.log(error)
  }
}

export const createLogError = async (toast: any) => {
  if (!newLogError.value.source || !newLogError.value.stackTrace || !newLogError.value.message) {
    toast.add({ severity: 'warn', summary: 'Campos incompletos', detail: 'Todos los campos son obligatorios', life: 3000 })
    return
  }

  try {
    const response = <any> await apiRequest("logError.crear", {}, { ...newLogError.value, isDeleted: false })
    if (response.success) {
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Log creado correctamente', life: 3000 })
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el Log', life: 3000 })
      throw new Error('Error al crear Log')
    }
    await fetchLogErrors({page:1,limit:5});
    return true
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el Log', life: 3000 })
    return false
  }
}

export const editLogError = (LogError: any) => {
  console.log(LogError)
  LogErrorEdit.value = { ...LogError, nombre: LogError.nombre }
}

export const updateLogError = async (toast: any) => {
  if (!newLogError.value.source || !newLogError.value.stackTrace || !newLogError.value.message) {
    const usuario = LogErrorEdit.value
    const res = <any> await apiRequest("logError.actualizar", { id: LogErrorEdit.value.id }, usuario)
    if (res.nombre) {
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario Editado correctamente', life: 3000 })
    }
    await fetchLogErrors({page:1,limit:5});
    return true 
  } else {
    toast.add({ severity: 'warn', summary: 'Campos incompletos', detail: 'Todos los campos son obligatorios', life: 3000 })
    return false
  }
}

export const deleteLogError = (id: any) => {
  IdLogErrorDelete.value = id
}

export const removeLogError = async (toast: any) => {
  try {
    const idLogError = IdLogErrorDelete.value
    const response = <any> await apiRequest("logError.eliminar", { id: idLogError })
    if (response.message) {
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'LogErrora eliminado correctamente', life: 3000 })
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el LogErrora', life: 3000 })
    }
    await fetchLogErrors({page:1,limit:5});
    return true 
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el LogErrora', life: 3000 })
    return false
  }
}