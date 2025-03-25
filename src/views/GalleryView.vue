<script setup lang="ts">
const img = [
  { src: '/src/assets/images/Desert.png', alt: 'Desert' },
  { src: '/src/assets/images/Arquite.png', alt: 'Arquite' },
  { src: '/src/assets/images/lens.png', alt: 'Lens Reflection' },
  { src: '/src/assets/images/image2.png', alt: 'Flower Garden' },
  { src: '/src/assets/images/image1.png', alt: 'Sunset Field' },
  { src: '/src/assets/images/image4.png', alt: 'City Lights' },
  { src: '/src/assets/images/image5.png', alt: 'Luxury Resort' },
  { src: '/src/assets/images/image3.png', alt: 'Outdoor Lounge' },
];
</script>

<template>
  <div class="bg-[#EDE7DD]">
    <h1
      class="flex flex-col items-center py-10 px-6 relative text-5xl font-extrabold text-gray-900 mb-12 tracking-wide">
      GALERIA
    </h1>
    <div class="min-h-screen flex flex-col items-center py-10 px-6 relative">
      <div class="grid grid-cols-2 gap-6 z-10">
        <div v-for="(image, index) in img.slice(0, 2)" :key="index"
          class="relative group overflow-hidden rounded-xl p-[1rem]">
          <img :src="image.src" :alt="image.alt"
            class="w-3/5 h-auto object-cover transition-transform transform group-hover:scale-105">
          <div
            class="absolute inset-0 h-full bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <span class="text-white text-lg font-semibold">{{ image.alt }}</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 mt-12 z-10">
        <div v-for="(image, index) in img.slice(2, 3)" :key="index"
          class="relative group overflow-hidden rounded-xl ml-[-28rem]">
          <!-- Aquí se aplica ml-4 para moverla a la izquierda -->
          <img :src="image.src" :alt="image.alt"
            class="w-3/5 h-auto object-cover transition-transform transform group-hover:scale-105">
          <div
            class="absolute inset-0 h-full bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <span class="text-white text-lg font-semibold">{{ image.alt }}</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-6 mt-12 place-items-end z-10">
        <div v-for="(image, index) in img.slice(3, 5)" :key="index"
          class="relative group overflow-hidden rounded-xl p-[1rem]">
          <img :src="image.src" :alt="image.alt"
            class="w-4/5 h-auto object-cover transition-transform transform group-hover:scale-105">
          <div
            class="absolute inset-0 h-full bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <span class="text-white text-lg font-semibold">{{ image.alt }}</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-6 mt-12 place-items-end z-10">
        <div v-for="(image, index) in img.slice(5)" :key="index"
          class="relative group overflow-hidden rounded-xl p-[1rem]">
          <img :src="image.src" :alt="image.alt"
            class="w-5/6 h-auto object-cover transition-transform transform group-hover:scale-105">
          <div
            class="absolute inset-0 h-full bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <span class="text-white text-lg font-semibold">{{ image.alt }}</span>
          </div>
        </div>
      </div>

      <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div class="absolute top-[10%] left-0 w-[110rem]  h-35 bg-[#C25500]"></div>
        <div class="absolute top-[30%] left-0 w-[70rem] h-35 bg-neutral-900"></div>
        <div class="absolute top-[47%] right-[0%] w-2/3 h-35 bg-orange-500"></div>
        <div class="absolute bottom-[20%] right-[0%] w-[65rem] h-35 bg-[#C25500]"></div>
        <div class="absolute bottom-[0%] left-0 w-[85rem] h-35 bg-[#552306]"></div>
      </div>
    </div>
  </div>
</template>
