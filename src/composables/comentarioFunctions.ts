import { ref } from 'vue'
import { apiRequest } from '@/api/apiClient'

export const Comentarios = ref([])
export const IdComentarioDelete = ref<string | number>("")
export const newComentario = ref({ id:"", idPersona: 0, idObra: 0, texto: "", fechaComentario: ""})
export const ComentarioEdit = ref({ id:"", texto:""})
export const ComentarioView = ref({ id:"", idPersona: 0, idObra: 0, texto: "", fechaComentario: ""})

export const fetchComentarios = async (params:any = null) => {
  try {
    const Comentarioa = <any> await apiRequest("comentario.filtrar",params)
    Comentarios.value = Comentarioa.data
  } catch (error) {
    console.log(error)
  }
}

export const createComentario = async (toast: any) => {
  if (!newComentario.value.idPersona || !newComentario.value.texto || !newComentario.value.idObra) {
    toast.add({ severity: 'warn', summary: 'Campos incompletos', detail: 'Todos los campos son obligatorios', life: 3000 })
    return
  }

  try {
    const response = <any> await apiRequest("comentario.crear", {}, { ...newComentario.value, isDeleted: false })
    if (response.success) {
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Comentario creado correctamente', life: 3000 })
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear la Comentario', life: 3000 })
      throw new Error('Error al crear Log')
    }
    await fetchComentarios({page:1,limit:5});
    return true
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear la Comentario', life: 3000 })
    return false
  }
}

export const editComentario = (Comentario: any) => {
  console.log(Comentario)
  ComentarioEdit.value = { ...Comentario, nombre: Comentario.nombre }
}

export const updateComentario = async (toast: any) => {
  console.log(ComentarioEdit.value.texto)
  if (ComentarioEdit.value.texto) {
    const usuario = ComentarioEdit.value
    const res = <any> await apiRequest("comentario.actualizar", { id: ComentarioEdit.value.id }, usuario)
    if (res.nombre) {
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Comentario Editado correctamente', life: 3000 })
    }
    await fetchComentarios({page:1,limit:5});
    return true 
  } else {
    toast.add({ severity: 'warn', summary: 'Campos incompletos', detail: 'Todos los campos son obligatorios', life: 3000 })
    return false
  }
}

export const deleteComentario = (id: any) => {
  IdComentarioDelete.value = id
}

export const removeComentario = async (toast: any) => {
  try {
    const idComentario = IdComentarioDelete.value
    const response = <any> await apiRequest("comentario.eliminar", { id: idComentario })
    if (response.message) {
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Comentario eliminada correctamente', life: 3000 })
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la Comentario', life: 3000 })
    }
    await fetchComentarios({page:1,limit:5});
    return true 
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la Comentarioa', life: 3000 })
    return false
  }
}