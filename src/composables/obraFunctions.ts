import { ref } from 'vue'
import { apiRequest } from '@/api/apiClient'

export const Obras = ref([])
export const ObraImage = ref({imagen:""})
export const IdObraDelete = ref<string | number>("")
export const newObra = ref({id: "", titulo: "", descripcion: "", precio: "", artistaId: "", categoriaIds: "", exposicionIds:[], imagen: ""})
export const ObraEdit = ref({ id:0, ImagenUrl:"", source: "", message: "", stackTrace: ""})
export const ObraView = ref({id:"", source: "", message: "", stackTrace: ""})

export const fetchObras = async (params:any = null) => {
  try {
    const response = <any> await apiRequest("obra.filtrar", params)
    Obras.value = response.data
  } catch (error) {
    console.error("Error fetching obras:", error)
    throw error
  }
}

export const createObra = async ( toast:any) => {
  if (!newObra.value.titulo || !newObra.value.descripcion || !newObra.value.precio ||
      !newObra.value.artistaId || !newObra.value.categoriaIds?.length) {
    toast.add({
      severity: 'warn',
      summary: 'Campos incompletos',
      detail: 'Todos los campos son obligatorios',
      life: 3000
    })
    return null
  }

  try {
    const obraSend = {...newObra.value, ImagenUrl:"url"}
    const response = <any> await apiRequest("obra.crear", {}, obraSend)
    console.log(response)
    if (response) {
      toast.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Obra creada correctamente',
        life: 3000
      })
      if (newObra.value.imagen) {
        await uploadObraImage(response, newObra.value.imagen)
      }
      if(newObra.value.exposicionIds){
        await addExposicionesToObra(response,newObra.value.exposicionIds,toast)
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

export const updateObraImage = async () => {
  if (!ObraImage) return null

  try {
    const formData = new FormData()
    formData.append('idObra', ObraView.value.id.toString())
    formData.append('archivo', ObraImage.value.imagen)

    await apiRequest(
      "obra.ActualizarImagenObra",
      { idObra: ObraView.value.id },
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    await fetchObras({ page: 1, limit: 5 })
    return;
  } catch (error) {
    console.error("Error uploading obra image:", error)
    throw error
  }
}

export const editObra = (LogError: any) => {
  console.log(LogError)
  ObraEdit.value = { ...LogError, nombre: LogError.nombre }
}

export const addExposicionesToObra = async (obraId: string | number, exposicionesIds: Array<string | number>, toast: any = null) => {
  if (!obraId || !exposicionesIds?.length) {
    toast?.add({
      severity: 'warn',
      summary: 'Datos incompletos',
      detail: 'Se requiere el ID de la obra y al menos un ID de exposición',
      life: 3000
    });
    return false;
  }

  try {
    const requests = exposicionesIds.map((idExposicion:any) =>
      apiRequest("obra.exposicionCrear", { idObra: obraId, idExposicion })
    );

    await Promise.all(requests);

    toast?.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Exposiciones asignadas correctamente',
      life: 3000
    });

    return true;
  } catch (error) {
    console.error("Error asignando exposiciones:", error);
    toast?.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron asignar las exposiciones',
      life: 3000
    });
    return false;
  }
}

export const editObraImagen = (LogError: any) => {
  ObraView.value = { ...LogError }
}

export const updateObra = async (toast: any) => {
  if (!ObraEdit.value.source || !ObraEdit.value.stackTrace || !ObraEdit.value.message) {
    const usuario = ObraEdit.value
    const res = <any> await apiRequest("obra.actualizar", { id: ObraEdit.value.id }, usuario)
    if (res) {
      toast.add({ severity: 'Editsuccess', summary: 'Éxito', detail: 'Usuario Editado correctamente', life: 3000 })
    }
    await fetchObras({page:1,limit:5});
    return true
  } else {
    toast.add({ severity: 'warn', summary: 'Campos incompletos', detail: 'Todos los campos son obligatorios', life: 3000 })
    return false
  }
}

export const deleteObra = (id:any) => {
  IdObraDelete.value = id
}

export const removeObra = async (toast:any) => {
  try {
    const imagen = <any> await apiRequest("obra.EliminarImagenObra", {idObra:IdObraDelete.value} )
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
