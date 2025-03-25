<script setup lang="ts">
import { apiRequest } from '@/api/apiClient';
import Search from '@/components/Search.vue';
import { getTextColor } from '@/utils/functions';
import { onMounted, ref } from 'vue';

interface Libro {
  id: number;
  titulo: string;
  color: string;
  autorNombre: string;
  etiquetas: Array<String>[];
  slug:string
}

const libros = ref<Libro[]>([]);
const mensajeNoEncontrado = ref('');
const buscarTag = ref('');
const paginaActual = ref(1);
const librosPorPagina = 10;

const buscarAutor = (autor: string) => { return "/Libros?buscar=autor&value=" + autor; }
const buscarEtiqueta = (etiqueta: string) => { return "/Libros?buscar=etiqueta&value=" + etiqueta; }

const cargarLibros = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const buscar = urlParams.get("buscar") || "todos";
  buscarTag.value = buscar;
  const value = urlParams.get("value") || "";

  try {
    const params: any = {
      skip: (paginaActual.value - 1) * librosPorPagina,
      take: librosPorPagina,
    };

    const formattedValue = value.replace(/%20/g, "_");

    if (buscar !== "todos") {
      params[buscar] = formattedValue;
      const nuevosLibros = await apiRequest("libro.buscar", params);
      if (paginaActual.value === 1) {
        libros.value = nuevosLibros;
      } else {
        libros.value = [...libros.value, ...nuevosLibros];
      }
    } else {
      const nuevosLibros = await apiRequest("libro.listar", params);
      if (paginaActual.value === 1) {
        libros.value = nuevosLibros;
      } else {
        libros.value = [...libros.value, ...nuevosLibros];
      }
    }

    if (libros.value.length === 0) {
      mensajeNoEncontrado.value = `No se encontraron ${buscar} con el valor de "${value}".`;
    } else {
      mensajeNoEncontrado.value = '';
    }
  } catch (error) {
    console.error("Error cargando libros:", error);
  }
};

const cargarMasLibros = () => {
  paginaActual.value++;
  cargarLibros();
};
onMounted(() => {
  cargarLibros();
});
</script>

<template>
  <div class="min-h-screen bg-[#fefcff]">
    <Search />
    <h1 class="text-left m-5 text-3xl font-bold text-[#5d20d3]">Libros buscados por: {{ buscarTag }}</h1>

    <!-- Mostrar mensaje si no se encuentran libros -->
    <div v-if="mensajeNoEncontrado" class="text-center text-red-500 mt-4">
      <p>{{ mensajeNoEncontrado }}</p>
    </div>

    <div v-if="libros.length > 0" class="grid grid-cols-1 place-items-center sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
      <div v-for="libro in libros" :key="libro.titulo" class="mb-10">
        <a class="book-container" :href="`/Libro/${libro.slug}`"  rel="noreferrer noopener">
          <div class="book" :style="{ backgroundColor: libro.color, color: getTextColor(libro.color) }">
            <div class="front flex flex-col justify-between">
              <div class="mt-10">
                <h2 class="text-lg font-bold text-center">{{ libro.titulo }}</h2>
                <a :href="buscarAutor(libro.autorNombre)" class="text-sm italic text-center">Por: {{ libro.autorNombre }}</a>
              </div>

              <div class="flex w-full flex-wrap mx-8">
                <p v-for="etiqueta in libro.etiquetas" class="mx-1">
                  <a :href="buscarEtiqueta(etiqueta)">{{ etiqueta }}</a>
                </p>
              </div>
            </div>
            <div class="back"></div>
          </div>
        </a>
      </div>
    </div>

    <!-- Botón para cargar más libros -->
    <div v-if="libros.length > 0 && mensajeNoEncontrado === ''" class="text-center mt-8">
      <button @click="cargarMasLibros" class="bg-[#5d20d3] text-white px-4 py-2 rounded-lg">
        Cargar más libros
      </button>
    </div>
  </div>
</template>



<style scoped>
button {
  transition: background-color 0.3s;
}

.book-container {
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 600px;
}

@keyframes initAnimation {
  0% {
    transform: rotateY(0deg) rotateX(0deg);
  }

  100% {
    transform: rotateY(-27deg) rotateX(0deg);
  }
}

.book {
  width: 200px;
  height: 300px;
  position: relative;
  transform-style: preserve-3d;
  transform: rotateY(-27deg) rotateX(0deg);
  transition: 1s ease;
  animation: 1s ease 0s 1 initAnimation;
  box-shadow: #2227 1px 1px 10px;
}

.book-container:hover .book,
.book-container:focus .book {
  transform: rotateY(0deg) rotateX(0deg);
}

.book .front {
  position: absolute;
  top: 0;
  left: 0;
  width: 200px;
  height: 300px;
  transform: translateZ(15px);
  border-radius: 0 2px 2px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}

.book .back {
  position: absolute;
  top: 0;
  left: 0;
  content: ' ';
  width: 200px;
  height: 300px;
  transform: translateZ(-15px);
  background-color: #01060f;
  border-radius: 0 2px 2px 0;
}

.book::before {
  position: absolute;
  content: ' ';
  background-color: blue;
  left: 0;
  top: 1px;
  width: 28px;
  height: 298px;
  transform: translateX(184px) rotateY(90deg);
  background: linear-gradient(90deg,
      #fff 0%,
      #f9f9f9 5%,
      #fff 10%,
      #f9f9f9 15%,
      #fff 20%,
      #f9f9f9 25%,
      #fff 30%,
      #f9f9f9 35%,
      #fff 40%,
      #f9f9f9 45%,
      #fff 50%,
      #f9f9f9 55%,
      #fff 60%,
      #f9f9f9 65%,
      #fff 70%,
      #f9f9f9 75%,
      #fff 80%,
      #f9f9f9 85%,
      #fff 90%,
      #f9f9f9 95%,
      #fff 100%);
}
</style>
