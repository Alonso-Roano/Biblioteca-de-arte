<script setup lang="ts">
import { apiRequest } from '@/api/apiClient';
import { getTextColor } from '@/utils/functions';
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { Icon } from "@iconify/vue"
import Cookies from "js-cookie";

interface Libro {
  id: number;
  titulo: string;
  color: string;
  autorNombre: string;
  descripcion: string;
}

interface LibroPopular {
  id: number;
  titulo: string;
  color: string;
  autorNombre: string;
  slug: string;
}

interface LikeInfo {
  libroId: number;
  totalLikes: number;
  usuariosQueDieronLike: string[];
}

const libro = ref<Libro | null>(null);
const librosPopulares = ref<LibroPopular[]>([]);
const likesInfo = ref<LikeInfo | null>(null);
const route = useRoute();
const router = useRouter();
const store = useAuthStore();

const cargarLibro = async () => {
  try {
    libro.value = await apiRequest("libro.obtenerPorSlug", { slug: route.params.slug });
  } catch (error) {
    console.error("Error cargando el libro:", error);
  }
};

const cargarLikes = async () => {
  if (!libro.value) return;
  try {
    likesInfo.value = await apiRequest("like.likesInfo", { libroId: libro.value.id });
  } catch (error) {
    console.error("Error cargando los likes:", error);
  }
};

const toggleLike = async () => {
  if (!libro.value) return;
  try {
    await apiRequest("like.toggle", { libroId: libro.value.id, token: Cookies.get("token") });
    await cargarLikes();
  } catch (error) {
    console.error("Error al dar/quitar like:", error);
  }
};

const usuarioDioLike = computed(() => {
  return likesInfo.value?.usuariosQueDieronLike.includes(store.user.nombre) ?? false;
});

const cargarLibrosPopulares = async () => {
  try {
    librosPopulares.value = await apiRequest("libro.buscar", { populares: "true" });
  } catch (error) {
    console.error("Error cargando libros populares:", error);
  }
};

const volver = () => {
  router.back();
};

onMounted(async () => {
  await cargarLibro();
  await cargarLibrosPopulares();
  await cargarLikes();
});
</script>

<template>
  <div class="min-h-screen bg-gray-200 flex flex-col p-6">
    <div class="w-full flex justify-between">
      <nav class="text-lg text-gray-600">
        <a href="/Libros"><span>Libros > </span></a>
        <a :href="`/Libros?buscar=autor&value=${libro?.autorNombre}`">
          <span class="font-semibold text-[#5d20d3]">{{ libro?.autorNombre }} > </span>
        </a>
        <span class="text-gray-500">{{ libro?.titulo }}</span>
      </nav>
      <button @click="volver" class="text-[#5d20d3] font-semibold mb-4 hover:underline cursor-pointer">
        &larr; Volver
      </button>
    </div>

    <div class="flex flex-col lg:flex-row relative">
      <div class="w-full lg:w-[70%] bg-white shadow-lg rounded-lg relative p-6">
        <div v-if="libro">
          <h1 class="text-center text-3xl font-bold mb-4 text-[#5d20d3]">{{ libro.titulo }}</h1>
          <p class="text-center text-gray-600 italic mb-4">Por: {{ libro.autorNombre }}</p>
          <div class="text-gray-800 leading-relaxed whitespace-pre-wrap min-h-[400px]">
            {{ libro.descripcion }}
          </div>
        </div>
        <div v-else class="text-center text-red-500">Cargando libro...</div>

        <!-- Botón de Like con color dinámico -->
        <button
          @click="toggleLike"
          :class="usuarioDioLike ? 'text-lg text-red-600 hover:text-red-700' : 'text-lg text-red-600 hover:text-red-700'"
          class=" font-bold py-2 px-4 rounded mt-4 transition absolute top-0 right-5 cursor-pointer"
        >
          <Icon :icon="usuarioDioLike ? 'mdi:heart' : 'mdi:heart-outline'" width="40" height="40" />
        </button>
      </div>

      <aside class="w-full lg:w-[30%] ml-0 lg:ml-6 bg-white shadow-lg p-4 rounded-lg h-fit mt-6 lg:mt-0">
        <h2 class="text-lg font-bold text-[#5d20d3] mb-4">Libros Populares</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-4">
          <div v-for="libro in librosPopulares" :key="libro.id" class="mb-6">
            <a class="book-container" :href="`/libro/${libro.slug}`" target="_blank" rel="noreferrer noopener">
              <div class="book" :style="{ backgroundColor: libro.color, color: getTextColor(libro.color) }">
                <div class="front flex flex-col">
                  <div class="mt-5">
                    <h2 class="text-lg font-bold text-center">{{ libro.titulo }}</h2>
                    <p class="text-sm italic text-center">Por: {{ libro.autorNombre }}</p>
                  </div>
                </div>
                <div class="back"></div>
              </div>
            </a>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.text-shadow {
  text-shadow: 0.5px 0.5px 0.5px #000000, -0.5px -0.5px 0.5px #000000, 0.5px -0.5px 0.5px #000000, -0.5px 0.5px 0.5px #000000;
}

.book-container {
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 600px;
}

.book {
  width: 100%;
  height: 100px;
  position: relative;
  transform-style: preserve-3d;
  transform: rotateY(-0deg) rotateX(0deg);
  transition: 1s ease;
  box-shadow: #2227 1px 1px 5px;
}
</style>
