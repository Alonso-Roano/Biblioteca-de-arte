import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiRequest } from '@/api/apiClient'
import { useAuthStore } from '@/stores/authStore.ts'

interface ArtistProfile {
  id: number
  nombres: string
  apellidos: string
  edad: number
  pais: string
  bigrafia: string
  contraseña: string
}

export const useArtistProfileStore = defineStore('artistProfile', () => {
  const artistProfile = ref<ArtistProfile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const artistaComentarios = ref<any[]>([])
  const obras = ref<any[]>([])
  const colecciones = ref<any[]>([])

  const fetchArtistProfile = async () => {
    const authStore = useAuthStore()
    const userId = authStore.user?.id
    const IdArtista = authStore.IdArtista as string | number

    if (!userId) {
      console.warn('No hay ID de usuario.')
      return
    }

    if (!userId) {
      console.warn('No hay ID de usuario.')
      return
    }

    try {
      loading.value = true
      const response = await apiRequest<{
        success: boolean
        message: string
        data: ArtistProfile
      }>('artista.obtener', { id: IdArtista })

      if (response.success) {
        artistProfile.value = response.data
        error.value = null
      } else {
        error.value = response.message || 'Error al obtener datos del artista.'
      }
    } catch (err) {
      console.error('Error al cargar perfil del artista:', err)
      error.value = 'No se pudo cargar el perfil.'
    } finally {
      loading.value = false
    }
  }

  const updateArtistProfile = async (updated: Omit<ArtistProfile, 'id'>) => {
    if (!artistProfile.value) return

    try {
      loading.value = true

      await apiRequest('artista.actualizar', { id: artistProfile.value.id }, updated)

      artistProfile.value = {
        ...artistProfile.value,
        ...updated,
      }
    } catch (err) {
      console.error('Error al actualizar perfil de artista:', err)
      error.value = 'No se pudo actualizar el perfil.'
    } finally {
      loading.value = false
    }
  }

  const fetchArtistaComentarios = async () => {
    const authStore = useAuthStore()
    const userId = authStore.user?.id

    if (!userId) {
      console.warn('No hay ID de artista')
      return
    }

    try {
      loading.value = true
      const response = await apiRequest<{
        success: boolean
        message: string
        data: {
          items: {
            id: number
            texto: string
            fechaComentario: string
          }[]
          total: number
        }
      }>('comentario.filtrar', {
        orderDirection: 'asc',
        filterField: 'idArtista',
        filterValue: userId
      })

      if (response.success) {
        artistaComentarios.value = response.data.items
      } else {
        console.warn('Error al obtener comentarios del artista:', response.message)
      }
    } catch (err) {
      console.error('Error en fetchArtistaComentarios:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchObrasArtista = async () => {
    const authStore = useAuthStore()
    const artistaId = authStore.IdArtista

    if (!artistaId) {
      console.warn('No hay ID de artista')
      return
    }

    try {
      loading.value = true

      const response = await apiRequest<{
        success: boolean
        message: string
        data: {
          items: {
            id: number
            titulo: string
            descripcion: string
            fechaCreacion: string
          }[]
          total: number
        }
      }>('obra.filtrar', {
        orderDirection: 'asc',
        filterField: 'idArtista',
        filterValue: artistaId,
      })

      if (response.success) {
        obras.value = response.data.items
      } else {
        console.warn('Error al obtener obras del artista:', response.message)
      }
    } catch (err) {
      console.error('Error en fetchObrasArtista:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchColeccionesArtista = async () => {
    const authStore = useAuthStore()
    const artistaId = authStore.user?.id

    if (!artistaId) {
      console.warn('No hay ID de artista para exposiciones')
      return
    }

    try {
      loading.value = true

      const response = await apiRequest<{
        success: boolean
        message: string
        data: {
          items: {
            id: number
            nombre: string
            descripcion: string
            fechaCreacion: string
          }[]
          total: number
        }
      }>('exposicion.filtrar', {
        orderDirection: 'asc',
        filterField: 'idArtista',
        filterValue: artistaId,
      })

      if (response.success) {
        colecciones.value = response.data.items
      } else {
        console.warn('Error al obtener colecciones del artista:', response.message)
      }
    } catch (err) {
      console.error('Error en fetchColeccionesArtista:', err)
    } finally {
      loading.value = false
    }
  }


  return {
    artistProfile,
    loading,
    error,
    fetchArtistProfile,
    updateArtistProfile,
    artistaComentarios,
    fetchArtistaComentarios,
    obras,
    fetchObrasArtista,
    colecciones,
    fetchColeccionesArtista
  }
})
