import { ref } from 'vue'
import { apiRequest } from '@/api/apiClient'

export const Artists = ref([])
export const IdArtistDelete = ref<string | number>("")
export const newArtist = ref({ nombres: '', email: '', apellidos: '', password: '', confirmPassword:'' })
export const ArtistEdit = ref({ id: '', nombres: '', apellidos: '',edad:'', contraseña: '', idApplicationUser:'' })
export const ArtistView = ref({ name: '', email: '', alias: '' })

export const fetchArtists = async (params:any = null) => {
  try {
    const Artista = <any> await apiRequest("artista.filtrar",params)
    Artists.value = Artista.data
  } catch (error) {
    console.log(error)
  }
}

export const createArtist = async (toast: any) => {
  console.log(newArtist.value)
  if (!newArtist.value.nombres || !newArtist.value.email || !newArtist.value.apellidos || !newArtist.value.password || !newArtist.value.confirmPassword) {
    toast.add({ severity: 'warn', summary: 'Campos incompletos', detail: 'Todos los campos son obligatorios', life: 3000 })
    return
  }

  try {
    const response = <any> await apiRequest("auth.registerArtist", {}, { ...newArtist.value })
    if (response.token) {
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario creado correctamente', life: 3000 })
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el usuario', life: 3000 })
      throw new Error('Error al crear usuario')
    }
    await fetchArtists({page:1,limit:5});
    return true
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el usuario', life: 3000 })
    return false
  }
}

export const editArtist = (Artist: any) => {
  ArtistEdit.value = { ...Artist, nombre: Artist.nombre, alias: Artist.alias }
}

export const updateArtist = async (toast: any) => {
  console.log(ArtistEdit.value)
  if (ArtistEdit.value.nombres && ArtistEdit.value.apellidos && ArtistEdit.value.edad && ArtistEdit.value.contraseña) {
    const usuario = ArtistEdit.value
    const res = <any> await apiRequest("artista.actualizar", { id: ArtistEdit.value.idApplicationUser }, usuario)
    if (res.nombre) {
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario Editado correctamente', life: 3000 })
    }
    await fetchArtists({page:1,limit:5});
    return true 
  } else {
    toast.add({ severity: 'warn', summary: 'Campos incompletos', detail: 'Todos los campos son obligatorios', life: 3000 })
    return false
  }
}

export const deleteArtist = (id: any) => {
  IdArtistDelete.value = id
}

export const removeArtist = async (toast: any) => {
  try {
    const idArtist = IdArtistDelete.value
    const response = <any> await apiRequest("artista.eliminar", { id: idArtist })
    if (response.message) {
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Artista eliminado correctamente', life: 3000 })
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el Artista', life: 3000 })
    }
    await fetchArtists({page:1,limit:5});
    return true 
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el Artista', life: 3000 })
    return false
  }
}