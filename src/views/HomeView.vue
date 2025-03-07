<script setup lang="ts">
import { apiRequest } from '@/api/apiClient';
import { getTextColor } from '@/utils/functions';
import { onMounted, ref } from 'vue';

interface Libro {
  id: number,
  titulo: string,
  color: string,
  autorNombre: string
  etiquetas:Array<String>[]
  slug:string
}

const libros = ref<Libro[]>([]);

onMounted(async () => {
  try {
    const params = {
      populares: "true",
    };
    libros.value = await apiRequest("libro.buscar", params);
  } catch (error) {
    console.error("Error cargando libros:", error);
  }
});
</script>

<template>
  <!-- hero seciton -->
  <div class="relative w-full h-[400px] bg-[#5d20d3]" id="home">
    <div class="absolute inset-0 ">
      <img src="/public/image/biblioteca-wallpaper.jpg" alt="Background Image"
        class="object-cover object-center w-full h-full" />
    </div>
    <div class="absolute inset-9 flex flex-col md:flex-row items-center justify-between">
      <div class="md:w-1/2 mb-4 md:mb-0">
        <h1 class="text-grey-700 font-medium text-4xl md:text-5xl leading-tight mb-2 text-[#fefcff] text-shadow">
          Babel: La Biblioteca del Mundo Digital
        </h1>
        <p class="font-regular text-xl mb-8 mt-4 text-[#fefcff] text-shadow">
          Descubre un universo infinito de palabras. Crea, comparte y lee libros escritos por mentes curiosas de todo el
          mundo. Únete a la comunidad donde cada historia tiene su lugar y cada idea puede tomar vuelo. Bienvenido a tu
          próxima aventura literaria.
        </p>

        <a href="#contactUs"
          class="px-6 py-3 bg-[#f59f01] text-white font-medium rounded-full hover:bg-[#f5a001e5]  transition duration-200">Inicia
          ahora</a>
      </div>
    </div>
  </div>

  <!-- our services section -->
  <section class="py-10" id="services">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-gray-800 mb-8 text-center">Lo que ofrecemos</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <img src="/public/image/crea.jpg" alt="Lee libros" class="w-full h-64 object-cover">
          <div class="p-6 text-center">
            <h3 class="text-xl font-medium text-gray-800 mb-2">Lee libros</h3>
            <p class="text-gray-700 text-base">
              Explora un sinfín de historias escritas por autores de todo el mundo. Desde fantasía épica hasta relatos
              cortos, encuentra el libro perfecto para ti.
            </p>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <img src="/public/image/Lee.jpg" alt="Crea libros" class="w-full h-64 object-cover">
          <div class="p-6 text-center">
            <h3 class="text-xl font-medium text-gray-800 mb-2">Crea libros</h3>
            <p class="text-gray-700 text-base">
              Da vida a tus historias y publícalas para que otros las disfruten. Nuestra plataforma te ofrece
              herramientas intuitivas para escribir y compartir tus libros.
            </p>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <img src="/public/image/like.jpg" alt="Da like" class="w-full h-64 object-cover">
          <div class="p-6 text-center">
            <h3 class="text-xl font-medium text-gray-800 mb-2">Da like</h3>
            <p class="text-gray-700 text-base">
              Apoya a tus autores favoritos dando like a sus libros. Tu feedback ayuda a impulsar a nuevos escritores y
              a crear una comunidad literaria vibrante.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>


  <!-- about us -->
  <section class="bg-[#5d20d3]" id="nosotros">
    <div class="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
        <div class="max-w-lg">
          <h2 class="text-3xl font-bold text-[#fff] mb-8 text-center">Acerca de Nosotros</h2>
          <p class="mt-4 text-lg text-[#fff]">
            En Babel, creemos que las historias conectan a las personas y que cada voz merece ser escuchada. Somos una
            plataforma abierta donde escritores de todo el mundo pueden compartir sus palabras. Nuestra misión es
            ofrecer un espacio inclusivo para crear, explorar y disfrutar de la literatura.
            <br>
            Babel no es solo una biblioteca digital; es una comunidad que fomenta la creatividad y el intercambio de
            ideas. Aquí, cada historia tiene el poder de transformar, y todos son bienvenidos a ser parte de esta
            experiencia literaria global.
          </p>
        </div>
        <div class="mt-12 md:mt-0">
          <img src="/public/image/biblioteca.jpg" alt="About Us Image" class="object-cover rounded-lg shadow-md">
        </div>
      </div>
    </div>
  </section>

  <!-- why us  -->
  <section class="text-gray-700 body-font mt-10">
    <div class="flex justify-center text-3xl font-bold text-gray-800 text-center">
      ¿Por qué elegir Babel?
    </div>
    <div class="container px-5 py-12 mx-auto">
      <div class="flex flex-wrap text-center justify-center">

        <div class="p-4 md:w-1/4 sm:w-1/2">
          <div class="px-4 py-6 transform transition duration-500 hover:scale-110">
            <div class="flex justify-center">
              <img src="/public/image/gears.png" class="w-32 mb-3">
            </div>
            <h2 class="title-font font-regular text-2xl text-gray-900">Plataforma Intuitiva</h2>
            <p class="text-gray-600 text-base mt-2">Una interfaz sencilla y moderna que facilita la lectura, escritura y
              publicación de libros sin complicaciones.</p>
          </div>
        </div>

        <div class="p-4 md:w-1/4 sm:w-1/2">
          <div class="px-4 py-6 transform transition duration-500 hover:scale-110">
            <div class="flex justify-center">
              <img src="/public/image/brain.png" class="w-32 mb-3">
            </div>
            <h2 class="title-font font-regular text-2xl text-gray-900">Comunidad Creativa</h2>
            <p class="text-gray-600 text-base mt-2">Interactúa con otros escritores y lectores, recibe feedback y haz
              crecer tu audiencia literaria.</p>
          </div>
        </div>

        <div class="p-4 md:w-1/4 sm:w-1/2">
          <div class="px-4 py-6 transform transition duration-500 hover:scale-110">
            <div class="flex justify-center">
              <img src="/public/image/book.png" class="w-32 mb-3">
            </div>
            <h2 class="title-font font-regular text-2xl text-gray-900">Escribe y Publica</h2>
            <p class="text-gray-600 text-base mt-2">Publica tus historias y capítulos en tiempo real, permitiendo a los
              lectores seguir tu progreso.</p>
          </div>
        </div>

      </div>
    </div>
  </section>


  <!-- gallery -->
  <section class="text-gray-700 body-font bg-[#5d20d3]" id="gallery">
    <div class="flex justify-center text-3xl font-bold text-[#fff] text-center py-10">
      Libros populares
    </div>

    <div class="grid grid-cols-1 place-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">

      <div v-for="libro in libros" :key="libro.titulo" class="mb-10">
        <a class="book-container" :href="`/Libro/${libro.slug}`" rel="noreferrer noopener">
          <div class="book" :style="{ backgroundColor: libro.color, color: getTextColor(libro.color)}">
            <div class="front flex flex-col justify-between">
              <div class="mt-10">
                <h2 class="text-lg font-bold text-center">{{ libro.titulo }}</h2>
              <p class="text-sm italic text-center">Por: {{ libro.autorNombre }}</p>
              </div>
              
              <div class="flex w-full flex-wrap mx-8">
                <p v-for="etiqueta in libro.etiquetas" class="mx-1">
                {{ etiqueta }}
              </p>
              </div>
              
            </div>
            <div class="back"></div>
          </div>
        </a>
      </div>

      <!-- Repeat this div for each image -->
    </div>

  </section>

  <!-- Visit us section -->
  <section class="bg-gray-100">
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:py-20 lg:px-8">
      <div class="max-w-2xl lg:max-w-4xl mx-auto text-center">
        <h2 class="flex justify-center text-3xl font-bold text-gray-800 text-center" id="contacto">Contactanos</h2>
        <p class="mt-3 text-lg text-gray-500">Ayudanos a mejorar</p>
      </div>
      <div class="mt-8 lg:mt-20">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div class="max-w-full mx-auto rounded-lg overflow-hidden">
              <div class="border-t border-gray-200 px-6 py-4">
                <h3 class="text-lg font-bold text-gray-900">Contacto</h3>
                <p class="mt-1 text-gray-600"><a ><b>Telefono:</b> +52 235 103 5581</a></p>
                <p class="mt-1 text-gray-600"><a ><b>Correo:</b> carlosroano201@gmail.com</a></p>
              </div>
              <div class="px-6 py-4">
                <h3 class="text-lg font-medium text-gray-900">Direccion</h3>
                <p class="mt-1 text-gray-600"> Carretera Cancún-Aeropuerto, S.M 299-Km. 11.5, 77565 Q.R.</p>
              </div>
              <div class="border-t border-gray-200 px-6 py-4">
                <h3 class="text-lg font-medium text-gray-900">Horario</h3>
                <p class="mt-1 text-gray-600">Lunes - Domingo : 7am - 10pm</p>
              </div>
            </div>
          </div>
          <div class="rounded-lg overflow-hidden order-none sm:order-first">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.57907840087!2d-86.84949872564434!3d21.04952168706695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f4e81c385c4677f%3A0x539479cfc0929edb!2s%7C%20Universidad%20Tecnol%C3%B3gica%20de%20Canc%C3%BAn%20%7C%20BIS!5e0!3m2!1ses-419!2smx!4v1741049013610!5m2!1ses-419!2smx"
              width="600" height="450" style="border:0;" loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"></iframe>

          </div>

        </div>
      </div>
    </div>
  </section>
  
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
  transform: rotateY(0deg)  rotateX(0deg);
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