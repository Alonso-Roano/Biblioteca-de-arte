import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiRequest } from '@/api/apiClient'
import { useAuthStore } from '@/stores/authStore.ts'

interface UserProfile {
  id: number
  nombres: string
  apellidos: string
  edad: number
  avatarURL: string | null
  idApplicationUser: string | null
}

interface ApiResponse {
  success: boolean
  message: string
  data: UserProfile
}

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<UserProfile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const authStore = useAuthStore()
  const userId = authStore.user?.id
  const successMessage = ref<string | null>(null)
  const userComments = ref<any[]>([])
  const userLikes = ref<any[]>([])
  const IdPersona = authStore.Idpersona

  const fetchUserLikes = async () => {
    const authStore = useAuthStore()
    const token = authStore.token

    if (!token) {
      console.warn('No hay token disponible.')
      return
    }

    try {
      loading.value = true
      const response = await apiRequest<{ success: boolean; message: string; data: any[] }>(
        'like.usuario',
        { token }
      )
      if (response.success) {
        userLikes.value = response.data
      } else {
        console.warn('Error:', response.message)
      }
    } catch (err) {
      console.error('Error en fetchUserLikes:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchUserComments = async () => {

    if (!userId) {
      console.warn('No hay usuario autenticado para obtener comentarios.')
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
            idObra: number
          }[]
          total: number
        }
      }>('comentario.filtrar', {
        orderDirection: 'asc',
        filterField: 'idPersona',
        filterValue: IdPersona ?? ''
      })

      if (response.success) {
        userComments.value = response.data.items
      } else {
        console.warn('No se pudieron obtener los comentarios:', response.message)
      }
    } catch (err) {
      console.error('Error al obtener comentarios del usuario:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchProfile = async () => {

    if (!userId) {
      error.value = 'No hay usuario autenticado.'
      return
    }
    try {
      loading.value = true
      const data = await apiRequest<ApiResponse>('usuario.obtener', { id: userId })

      if (data.success) {
        profile.value = data.data
      } else {
        error.value = data.message || 'Error al obtener el perfil.'
      }
    } catch (err: any) {
      console.error('Error en fetchProfile:', err)
      error.value = 'Hubo un error al obtener el perfil.'
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (updated: { nombres: string; apellidos: string; edad: number; contraseña?: string }) => {
    if (!userId) {
      error.value = 'No hay usuario autenticado.'
      return
    }
    try {
      loading.value = true
      await apiRequest('usuario.actualizar', { id: userId }, updated)

      if (profile.value) {
        profile.value = { ...profile.value, ...updated }
      }
      successMessage.value = 'Perfil actualizado correctamente.'
      error.value = null
    } catch (err: any) {
      console.error('Error al actualizar perfil:', err)
      error.value = 'No se pudo actualizar el perfil.'
    } finally {
      loading.value = false
    }
  }

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    userLikes,
    fetchUserLikes,
    userComments,
    fetchUserComments
  }
})
