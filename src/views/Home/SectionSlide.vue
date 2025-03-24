<template>
  <div class="h-auto w-full" :class="currentSection.bgColor">

    <!-- Encabezado y Menú -->
    <div class="px-4 py-4">
      <!-- Título: en móviles text-2xl, en md text-3xl -->
      <h1
        class="text-2xl md:text-3xl font-light font-lexend"
        :class="currentSection.txColor"
      >
        Nuestra E S E N C I A
      </h1>

      <!-- Menú: en pantallas pequeñas (mobile) se apilan, en medianas/hasta grandes se ponen en fila -->
      <div class="flex flex-wrap gap-4 py-4">
        <div
          v-for="(s, i) in props.sections"
          :key="i"
          class="cursor-pointer text-base md:text-xl font-light pb-1"
          :class="{
            [currentSection.StxColor]: activeSection === i,
            'underline decoration-2': activeSection === i,
            [currentSection.txColor]: activeSection !== i,
          }"
          @click="changeSection(i)"
        >
          {{ s.title }}
        </div>
      </div>
    </div>

    <!-- Transición con un SOLO hijo: la sección activa -->
    <transition name="slide-fade" mode="out-in">
      <section
        v-if="currentSection"
        :key="activeSection"
        class="relative px-4 flex flex-col md:flex-row items-start md:items-center justify-between
               w-full transition-all duration-700 ease-in-out pb-10"
      >
        <!-- Fondo de color absoluto (opcional, si deseas superponer algo) -->
        <div
          class="absolute top-0 left-0 w-full h-full -z-10"
          :class="currentSection.bgColor"
        ></div>

        <!-- Contenedor de texto (ocupa 100% en mobile, 50% en pantallas md) -->
        <div class="w-full md:w-1/2 max-w-xl py-4 md:py-8">
          <!-- Texto con responsive font-sizes -->
          <p
            class="text-base sm:text-lg md:text-xl"
            :class="currentSection.txColor"
          >
            {{ currentSection.description }}
          </p>
        </div>

        <!-- Imagen (en mobile ocupa 100% con margin-top, en md: 40% con align a la derecha) -->
        <div class="w-full md:w-2/5 flex justify-center md:justify-end mt-4 md:mt-0">
          <img
            :src="currentSection.image"
            alt="Imagen de sección"
            class="w-[80%] sm:w-[60%] md:w-full h-auto rounded-lg shadow-md"
          />
        </div>
      </section>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface SectionData {
  title: string
  description: string
  image: string
  bgColor: string
  txColor: string
  StxColor: string
}

const props = defineProps<{
  sections: SectionData[]
}>()

const activeSection = ref<number>(0)

const currentSection = computed(() => {
  return props.sections[activeSection.value] || null
})

function changeSection(index: number) {
  activeSection.value = index
}
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}

.slide-fade-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-fade-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.slide-fade-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.slide-fade-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
