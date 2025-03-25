import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiRequest } from '@/api/apiClient'
// import { useAuthStore } from '@/stores/authStore'

export const useObraStore = defineStore('obra', () => {
  const loading = ref(false)
  const error = ref(null)

  const crearObra = async (obraData) => {
    try {
      loading.value = true
      const response = await apiRequest("obra.crearObra", {}, obraData )
      if (response.success) {
        return response.data.id
      } else {
        throw new Error(response.message || 'Error al crear la obra')
      }
    } catch (err) {
      error.value = err.message
      console.error('Error al crear obra:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const subirImagenObra = async (idObra, imagen) => {
    try {
      const formData = new FormData()
      formData.append('file', imagen)

      const response = await apiRequest('obra.crearImagenObra', { id: idObra }, formData)
      if (!response.success) {
        throw new Error(response.message || 'Error al subir la imagen')
      }
    } catch (err) {
      error.value = err.message
      console.error('Error al subir imagen:', err)
    }
  }

  return { crearObra, subirImagenObra, loading, error }
})
