<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { apiRequest } from '@/api/apiClient'
import endpoints from '@/api/endpoints'
import Cookies from 'js-cookie'
import { useAuthStore } from '@/stores/authStore'
import { deleteComentario, removeComentario } from '@/composables/comentarioFunctions'

const route = useRoute()
const router = useRouter()
const store = useAuthStore();

const producto = ref<any>(null)
const comentarios = ref<any[]>([])
const nuevoComentario = ref({ texto: '' })
const leGusta = ref(false)
const likes = ref(false)
const limit = ref(3)
const isLoadingMore = ref(false);
const total = ref(0)
const loading = ref(true)
const hasMoreResults = ref(true);
const toast = ref()

const obraId = route.params.slug as string

const fetchObra = async () => {
  try {
    const response = await apiRequest<Obra>("obra.filtrar", { filterField: "slug", filterValue: obraId})
    producto.value = response.data.items[0];
    if(!response.data.items[0]) router.push("/Galeria")
  } catch (error) {
    console.error("Error al obtener la obra:", error)
  }
}

const fetchComentarios = async () => {
  try {
    const response = <any> await apiRequest<Comentario[]>("comentario.datos", { filterField: "idObra", filterValue: producto.value.id, page: 1, limit: limit.value, orderBy: "fechaComentario", orderDirection: "desc"})
    comentarios.value = response.data.items
    total.value = response.data.total;
  } catch (error) {
    console.error("Error al obtener comentarios:", error)
  }
}

const enviarComentario = async () => {
  try {
    if (!nuevoComentario.value.texto.trim()) return

    const payload = {
      idObra: producto.value.id,
      texto: nuevoComentario.value.texto,
      isDeleted: false,
      idPersona: store.Idpersona,
      fechaComentario: new Date().toISOString() 
    }

    await apiRequest('comentario.crear', {}, payload)
    nuevoComentario.value.texto = ''
    limit.value = 3;
    await fetchComentarios()
  } catch (error) {
    console.error('Error al enviar comentario:', error)
  }
}

const loadMore = async () => {
  if (isLoadingMore.value || !hasMoreResults.value) return;

  try {
    isLoadingMore.value = true;
    limit.value += 3;

    await fetchComentarios();
    
    if (comentarios.value.length < limit.value) {
      hasMoreResults.value = false;
    }

  } catch (error) {
    console.error("Error al cargar más obras:", error);
    hasMoreResults.value = false;
  } finally {
    isLoadingMore.value = false;
  }
};

const toggleMeGusta = async () => {
  try {
    await apiRequest("like.toggle", { libroId: producto.value.id, token: Cookies.get("token")})
    await verificarLike();
  } catch (error) {
    console.error('Error al dar like:', error)
  }
}

const verificarLike = async () => {
  try {
  const response = await apiRequest<LikeInfo>("like.likesInfo", { libroId: producto.value.id })
  likes.value = response;
  haveLike();
  } catch (error) {
    console.error('Error al verificar like:', error)
  }
}

const regresar = () => {
  router.back()
}

const deleteComentarios = async (id:number) =>{
  deleteComentario(id);
  await removeComentario(toast.value)
  limit.value = 3;
  await fetchComentarios();
}

const baseUrl = import.meta.env.VITE_APP_URL;

const getImageUrl = (path: any) => {
  return path ? `${baseUrl}${path}` : 'https://via.placeholder.com/400x300?text=Imagen+no+disponible';
};

const haveLike = () =>{
  leGusta.value=false;
  likes.value.usuariosQueDieronLikeId.forEach((element:any) => {
    if(store.user?.id == element){
      leGusta.value = true;
      return;
    }
  });
}

onMounted(async () => {
  loading.value = true
  await fetchObra()
  await fetchComentarios()
  await verificarLike()
  loading.value = false
})
</script>
<template>
  <div v-if="loading" class="flex justify-center items-center h-screen bg-[#F6EDD9]">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
  <div v-else class="min-h-screen flex flex-col items-center bg-[#F6EDD9] p-6">
    <!-- Título -->
    <header class="w-full max-w-6xl text-center mb-8">
      <h1 class="font-montserrat text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">{{ producto?.titulo }}</h1>
      <p class="text-lg sm:text-xl text-gray-600 mt-2">{{ producto?.categoria }}</p>
    </header>

    <!-- Contenedor Principal -->
    <div class="relative flex flex-col sm:flex-row max-w-6xl w-full bg-white shadow-lg rounded-xl overflow-hidden" style="border-radius: 20px;">
      <!-- Imagen del producto  -->
      <div class="w-full sm:w-1/2 h-full">
        <img
          :src="getImageUrl(producto?.imagenUrl)"
          :alt="producto?.titulo"
          class="w-full h-full object-cover shadow-right"
        />
      </div>

      <!-- Información del producto -->
      <div class="w-full sm:w-1/2 p-6 md:p-8 flex flex-col justify-center mt-6 sm:mt-0 relative">
        <!-- Botón de "Me gusta" -->
        <button v-if="store.user?.rol == 'Admin' || store.user?.rol == 'Usuario'"
          @click="toggleMeGusta" 
          class="absolute top-4 right-12 text-3xl transition-transform rounded-full transform active:scale-90 "
        >
        <Icon :icon="leGusta ? 'mdi:heart' : 'mdi:heart-outline'" 
        :class="leGusta ? 'text-red-500' : 'text-red-500'" />
        </button>
        <button v-else 
          class="absolute top-4 right-12 text-3xl transition-transform rounded-full transform "
        >
          <Icon :icon="leGusta ? 'mdi:heart' : 'mdi:heart-outline'" 
                :class="leGusta ? 'text-red-500' : 'text-red-500'" />
        </button>
        <p class="absolute top-4 right-4 text-xl font-bold text-red-900 transition-transform rounded-full transform ">({{ likes.totalLikes }})</p>

        <h2 class="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800">{{ producto?.nombre }}</h2>
        <span class="text-2xl sm:text-3xl font-bold text-[#F4811B]">${{ producto?.precio.toFixed(2) }}</span>
        <p class="text-lg sm:text-xl text-gray-600 mt-4 leading-relaxed">
          {{ producto?.descripcion }}
        </p>

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
      <h3 v-if="store.user?.rol == 'Admin' || store.user?.rol == 'Usuario'" class="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 mb-4">Comentarios y opiniones</h3>

      <!-- Área para comentarios -->
      <div v-if="store.user?.rol == 'Admin' || store.user?.rol == 'Usuario'" class="mb-6">
        <textarea
          v-model="nuevoComentario.texto"
          class="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4811B] text-lg sm:text-xl"
          rows="4"
          placeholder="Deja tu comentario aquí..."
        ></textarea>
      </div>

      <!-- Botón para enviar comentario -->
      <div v-if="store.user?.rol == 'Admin' || store.user?.rol == 'Usuario'" class="flex justify-end mb-6">
        <button
          @click="enviarComentario"
          class="bg-[#F4811B] hover:bg-[#d77315] text-white py-2 px-4 rounded-full flex items-center justify-center sm:w-auto"
        >
          <Icon icon="mdi:send" class="text-white mr-2" /> Enviar comentario
        </button>
      </div>

      <!-- Mostrar comentarios -->
      <div class="mt-6">
        <h4 class="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Comentarios recientes ({{ total }}):</h4>
        <div v-for="(comentario, index) in comentarios" :key="index" class="mb-4 p-4 bg-gray-50 rounded-lg shadow-md border border-gray-200">
          <p class="text-lg sm:text-lg font-semibold text-gray-800">{{  comentario.personaNombre +" - "+ new Date(comentario.fechaComentario).toLocaleString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}</p>
          <p class="text-lg sm:text-lg text-gray-800 mt-2">{{ comentario.texto }}</p>
        </div>
        <button v-if="hasMoreResults" @click="loadMore" :disabled="isLoadingMore"
          class="mt-8 mx-auto bg-[#EDE7DD] hover:bg-[#E0D5C3] text-[#C25500] font-semibold text-lg px-6 py-3 rounded-lg flex items-center gap-3">
          <ArrowPathIcon v-if="isLoadingMore" class="h-5 w-5 animate-spin" />
          {{ isLoadingMore ? 'Cargando...' : 'Cargar más' }}
        </button>
      </div>
    </div>
  </div>
  <Toast ref="toast" />
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
