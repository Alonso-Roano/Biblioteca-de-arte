<script setup lang="ts">
import { computed } from 'vue';
import Search from '@/components/Search.vue';

const img = [
  { src: '/src/assets/images/Desert.png', alt: 'Desert' },
  { src: '/src/assets/images/Arquite.png', alt: 'Arquite' },
  { src: '/src/assets/images/lens.png', alt: 'Lens Reflection' },
  { src: '/src/assets/images/image2.png', alt: 'Flower Garden' },
  { src: '/src/assets/images/image1.png', alt: 'Sunset Field' },
  { src: '/src/assets/images/image4.png', alt: 'City Lights' },
  { src: '/src/assets/images/image5.png', alt: 'Luxury Resort' },
  { src: '/src/assets/images/image3.png', alt: 'Outdoor Lounge' },
  { src: '/src/assets/images/Desert.png', alt: 'Desert' },
  { src: '/src/assets/images/Arquite.png', alt: 'Arquite' },
  { src: '/src/assets/images/lens.png', alt: 'Lens Reflection' },
  { src: '/src/assets/images/image2.png', alt: 'Flower Garden' },
  { src: '/src/assets/images/image1.png', alt: 'Sunset Field' },
  { src: '/src/assets/images/image4.png', alt: 'City Lights' },
  { src: '/src/assets/images/image5.png', alt: 'Luxury Resort' },
  { src: '/src/assets/images/image3.png', alt: 'Outdoor Lounge' },


];

const sections = computed(() => {
  const pattern = [2, 1, 2, 3];
  let index = 0;
  const result = [];

  while (index < img.length) {
    for (const size of pattern) {
      if (index >= img.length) break;
      result.push(img.slice(index, index + size));
      index += size;
    }
  }
  return result;
});
</script>

<template>
  <div class="bg-[#EDE7DD] min-h-screen">
    <h1 class="flex flex-col items-center py-10 px-6 text-5xl font-extrabold text-gray-900 tracking-wide">
      GALERIA
    </h1>
    <div class="w-full max-w-4xl mx-auto my-6">

    <Search/>
    </div>

    <div class="flex flex-col items-center  px-6 relative">
      <div v-for="(section, sectionIndex) in sections" :key="sectionIndex" :class="{
        'grid grid-cols-1 sm:grid-cols-2 gap-6 z-10': section.length === 2,
        'grid grid-cols-1 gap-6 z-10': section.length === 1,
        'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 z-10': section.length === 3,
        'mt-12': sectionIndex > 0
      }">
        <div v-for="(image, index) in section" :key="index" class="relative group overflow-hidden rounded-xl p-4">
          <img :src="image.src" :alt="image.alt"
            class="w-full max-w-[70%] h-auto object-cover transition-transform transform group-hover:scale-105">
          <div
            class="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <span class="text-white text-lg font-semibold">{{ image.alt }}</span>
          </div>
        </div>
      </div>

      <!-- Líneas de fondo -->
      <div class="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div class="absolute top-[10%] left-0 w-[20rem] h-16 sm:w-[110rem] sm:h-35 bg-[#C25500]"></div>
        <div class="absolute top-[30%] left-0 w-[90%] h-16 sm:w-[70rem] sm:h-35 bg-neutral-900"></div>
        <div class="absolute top-[47%] right-0 w-2/3 h-16 sm:h-35 bg-orange-500"></div>
        <div class="absolute bottom-[20%] right-0 w-[85%] h-16 sm:w-[65rem] sm:h-35 bg-[#C25500]"></div>
        <div class="absolute bottom-0 left-0 w-[90%] h-16 sm:w-[85rem] sm:h-35 bg-[#552306]"></div>
      </div>
    </div>
  </div>
</template>
