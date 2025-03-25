<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { apiRequest } from '@/api/apiClient'
import endpoints from '@/api/endpoints'

const route = useRoute()
const router = useRouter()

const producto = ref<any>(null)
const comentarios = ref<any[]>([])
const nuevoComentario = ref({ texto: '' })
const leGusta = ref(false)

// ✅ ID de la obra desde la ruta (como string, por si es un slug)
const obraId = route.params.id as string

// Para obtener datos de la obra
const fetchObra = async () => {
  try {
    const response = await apiRequest<Obra>("obra.obtener", { id: obraId })
    producto.value = response
  } catch (error) {
    console.error("Error al obtener la obra:", error)
  }
}


// Para obtener comentarios
const fetchComentarios = async () => {
  try {
    const response = await apiRequest<Comentario[]>("comentario.listar", { id: obraId })
    comentarios.value = response
  } catch (error) {
    console.error("Error al obtener comentarios:", error)
  }
}


// ✅ Enviar comentario
const enviarComentario = async () => {
  try {
    if (!nuevoComentario.value.texto.trim()) return

    const payload = {
      obraId,
      texto: nuevoComentario.value.texto,
    }

    await apiRequest('comentario.crear', '/api/Comentario', payload)
    nuevoComentario.value.texto = ''
    await fetchComentarios()
  } catch (error) {
    console.error('Error al enviar comentario:', error)
  }
}

// ✅ Alternar "Me gusta"
const toggleMeGusta = async () => {
  try {
await apiRequest("like.toggle", { libroId: obraId })

  } catch (error) {
    console.error('Error al dar like:', error)
  }
}

// ✅ Verificar si le gusta
const verificarLike = async () => {
  try {
const response = await apiRequest<LikeInfo>("like.likesInfo", { libroId: obraId })
leGusta.value = response.usuarioDioLike
  } catch (error) {
    console.error('Error al verificar like:', error)
  }
}

// ✅ Regresar a inicio
const regresar = () => {
  router.push('/')
}

onMounted(async () => {
  await fetchObra()
  await fetchComentarios()
  await verificarLike()
})
</script>



<template>
  <div class="min-h-screen flex flex-col items-center bg-[#F6EDD9] p-6">
    <!-- Título -->
    <header class="w-full max-w-6xl text-center mb-8">
      <h1 class="font-montserrat text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">{{ producto?.nombre }}</h1>
      <p class="text-lg sm:text-xl text-gray-600 mt-2">{{ producto?.categoria }}</p>
    </header>

    <!-- Contenedor Principal -->
    <div class="relative flex flex-col sm:flex-row max-w-6xl w-full bg-white shadow-lg rounded-xl overflow-hidden" style="border-radius: 20px;">
      <!-- Imagen del producto  -->
      <div class="w-full sm:w-1/2 h-full">
        <img
          :src="producto?.imagen"
          :alt="producto?.nombre"
          class="w-full h-full object-cover shadow-right"
        />
      </div>

      <!-- Información del producto -->
      <div class="w-full sm:w-1/2 p-6 md:p-8 flex flex-col justify-center mt-6 sm:mt-0 relative">
        <!-- Botón de "Me gusta" -->
        <button 
          @click="toggleMeGusta" 
          class="absolute top-4 right-4 text-3xl transition-transform transform active:scale-90"
        >
          <Icon :icon="leGusta ? 'mdi:heart' : 'mdi:heart-outline'" 
                :class="leGusta ? 'text-red-500' : 'text-gray-400'" />
        </button>

        <h2 class="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800">{{ producto?.nombre }}</h2>
        <span class="text-2xl sm:text-3xl font-bold text-[#F4811B]">${{ producto?.precio.toFixed(2) }}</span>
        <p class="text-lg sm:text-xl text-gray-600 mt-4 leading-relaxed">
          {{ producto?.descripcion }}
        </p>

        <div class="mt-6">
          <p class="text-lg sm:text-xl font-semibold text-gray-500 mt-2">Stock disponible: {{ producto?.stock }}</p>
        </div>

        <div class="flex mt-8 gap-6">
          <button
            @click="regresar"
            class="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 px-6 rounded-full text-lg"
          >
            Volver
          </button>
        </div>
      </div>
    </div>

    <!-- Sección de Comentarios -->
    <div class="w-full max-w-6xl mt-8 bg-white p-6 rounded-xl shadow-md">
      <h3 class="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 mb-4">Comentarios y opiniones</h3>

      <!-- Área para comentarios -->
      <div class="mb-6">
        <textarea
          v-model="nuevoComentario.texto"
          class="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4811B] text-lg sm:text-xl"
          rows="4"
          placeholder="Deja tu comentario aquí..."
        ></textarea>
      </div>

      <!-- Botón para enviar comentario -->
      <div class="flex justify-end mb-6">
        <button
          @click="enviarComentario"
          class="bg-[#F4811B] hover:bg-[#d77315] text-white py-2 px-4 rounded-full flex items-center justify-center sm:w-auto"
        >
          <Icon icon="mdi:send" class="text-white mr-2" /> Enviar comentario
        </button>
      </div>

      <!-- Mostrar comentarios -->
      <div class="mt-6">
        <h4 class="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Comentarios recientes:</h4>
        <div v-for="(comentario, index) in comentarios" :key="index" class="mb-4 p-4 bg-gray-50 rounded-lg shadow-md border border-gray-200">
          <p class="text-lg sm:text-xl font-semibold text-gray-800">{{ comentario.usuario }} <span class="text-sm text-gray-500">- {{ comentario.fecha }}</span></p>
          <p class="text-lg sm:text-xl font-semibold text-gray-800 mt-2">{{ comentario.texto }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilo para sombra en el lado derecho de la imagen */
.shadow-right {
  box-shadow: 10px 0px 20px rgba(0, 0, 0, 0.6);
}

/* Estilo para los comentarios */
.comment-container {
  background-color: #EEE9DF;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.comment-text {
  font-size: 1rem;
  color: #4b5563;
  line-height: 1.5;
}
</style>
