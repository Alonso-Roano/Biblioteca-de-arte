import { ref } from 'vue'
import { apiRequest } from '@/api/apiClient'

export const LogActions = ref([])
export const IdLogActionDelete = ref<string | number>("")
export const newLogAction = ref({ id:"", action: "", details: "" })
export const LogActionEdit = ref({ id:0,  action: "", details: "" })
export const LogActionView = ref({id:"", action: "", details: "" })

export const fetchLogActions = async (params:any = null) => {
  try {
    const LogActiona = <any> await apiRequest("logAction.filtrar",params)
    LogActions.value = LogActiona.data
  } catch (error) {
    console.log(error)
  }
}

export const createLogAction = async (toast: any) => {
  if (!newLogAction.value.action || !newLogAction.value.details) {
    toast.add({ severity: 'warn', summary: 'Campos incompletos', detail: 'Todos los campos son obligatorios', life: 3000 })
    return
  }

  try {
    const response = <any> await apiRequest("logAction.crear", {}, { ...newLogAction.value, isDeleted: false })
    if (response.success) {
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Log creado correctamente', life: 3000 })
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el Log', life: 3000 })
      throw new Error('Error al crear Log')
    }
    await fetchLogActions({page:1,limit:5});
    return true
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el Log', life: 3000 })
    return false
  }
}

export const editLogAction = (LogAction: any) => {
  console.log(LogAction)
  LogActionEdit.value = { ...LogAction, nombre: LogAction.nombre }
}

export const updateLogAction = async (toast: any) => {
  if (LogActionEdit.value.action && LogActionEdit.value.details) {
    const usuario = LogActionEdit.value
    const res = <any> await apiRequest("logAction.actualizar", { id: LogActionEdit.value.id }, usuario)
    if (res.nombre) {
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario Editado correctamente', life: 3000 })
    }
    await fetchLogActions({page:1,limit:5});
    return true 
  } else {
    toast.add({ severity: 'warn', summary: 'Campos incompletos', detail: 'Todos los campos son obligatorios', life: 3000 })
    return false
  }
}

export const deleteLogAction = (id: any) => {
  IdLogActionDelete.value = id
}

export const removeLogAction = async (toast: any) => {
  try {
    const idLogAction = IdLogActionDelete.value
    const response = <any> await apiRequest("logAction.eliminar", { id: idLogAction })
    if (response.message) {
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'LogActiona eliminado correctamente', life: 3000 })
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el LogActiona', life: 3000 })
    }
    await fetchLogActions({page:1,limit:5});
    return true 
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el LogActiona', life: 3000 })
    return false
  }
}