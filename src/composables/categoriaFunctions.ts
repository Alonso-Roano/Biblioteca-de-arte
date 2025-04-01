import { ref } from 'vue'
import { apiRequest } from '@/api/apiClient'

export const Categorias = ref([])
export const ListCategories = ref([])
export const IdCategoriaDelete = ref<string | number>("")
export const newCategoria = ref({ id:"", nombre: "", descripcionCategoria: "", nombreCorto:""})
export const CategoriaEdit = ref({ id:0, nombre: "", descripcionCategoria: "", nombreCorto:""})
export const CategoriaView = ref({id:"", nombre: "", descripcionCategoria: "", nombreCorto:""})

export const fetchCategorias = async (params:any = null) => {
  try {
    const Categoriaa = <any> await apiRequest("categoria.filtrar",params)
    Categorias.value = Categoriaa.data
  } catch (error) {
    console.log(error)
  }
}
export const fetchCategorias2 = async (params: any = {}) => {
  try {
    const response = <any> await apiRequest('categoria.listar', params)
    console.log('Respuesta de la API (fetchCategorias2):', response)
    ListCategories.value = response.data || []
  } catch (error) {
    console.error('Error al obtener categorías:', error)
  }
}

export const createCategoria = async (toast: any) => {
  if (!newCategoria.value.nombre || !newCategoria.value.descripcionCategoria || !newCategoria.value.nombreCorto) {
    toast.add({ severity: 'warn', summary: 'Campos incompletos', detail: 'Todos los campos son obligatorios', life: 3000 })
    return
  }

  try {
    const response = <any> await apiRequest("categoria.crear", {}, { ...newCategoria.value, isDeleted: false })
    if (response.success) {
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Categoria creado correctamente', life: 3000 })
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear la categoria', life: 3000 })
      throw new Error('Error al crear Log')
    }
    await fetchCategorias({page:1,limit:5});
    return true
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear la categoria', life: 3000 })
    return false
  }
}

export const editCategoria = (Categoria: any) => {
  console.log(Categoria)
  CategoriaEdit.value = { ...Categoria, nombre: Categoria.nombre }
}

export const updateCategoria = async (toast: any) => {
  if (!newCategoria.value.nombre || !newCategoria.value.descripcionCategoria || !newCategoria.value.nombreCorto) {
    const usuario = CategoriaEdit.value
    const res = <any> await apiRequest("categoria.actualizar", { id: CategoriaEdit.value.id }, usuario)
    if (res.nombre) {
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Categoria Editado correctamente', life: 3000 })
    }
    await fetchCategorias({page:1,limit:5});
    return true
  } else {
    toast.add({ severity: 'warn', summary: 'Campos incompletos', detail: 'Todos los campos son obligatorios', life: 3000 })
    return false
  }
}

export const deleteCategoria = (id: any) => {
  IdCategoriaDelete.value = id
}

export const removeCategoria = async (toast: any) => {
  try {
    const idCategoria = IdCategoriaDelete.value
    const response = <any> await apiRequest("categoria.eliminar", { id: idCategoria })
    if (response.message) {
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Categoria eliminada correctamente', life: 3000 })
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la Categoria', life: 3000 })
    }
    await fetchCategorias({page:1,limit:5});
    return true
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la Categoriaa', life: 3000 })
    return false
  }
}
