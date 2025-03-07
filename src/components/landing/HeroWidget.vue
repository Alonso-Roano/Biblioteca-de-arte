<script setup lang="ts">
import Button from '../common/Button.vue'
</script>
<template>
  <div
    id="hero"
    class="flex flex-col pt-6 px-6 lg:px-20 overflow-hidden"
    style="
      background:
        linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)),
        radial-gradient(
          77.36% 256.97% at 77.36% 57.52%,
          rgb(217, 172, 255, 0.4) 0%,
          rgb(195, 227, 250, 0.4) 100%
        );
      clip-path: ellipse(150% 87% at 93% 13%);
    "
  >
    <div class="mx-6 md:mx-20 mt-0 md:mt-6 flex flex-col gap-4">
      <h1 class="text-6xl font-bold font-sans text-gray-900 leading-tight">
        <span class="font-light block">Bienvenido a Primatic</span> Optimiza tu Entrenamiento,
        Maximiza tu Progreso
      </h1>
      <p class="font-normal text-2xl leading-normal md:mt-4 text-gray-500 w-7/12">
        Primatic es una innovadora aplicación web diseñada para la gestión inteligente de
        entrenamientos y el seguimiento del progreso físico...
      </p>
      <Button class="mt-3"> <template #text> Empezar </template> </Button>
    </div>
    <div class="flex justify-center md:justify-end">
      <img src="/demo/images/landing/screen-1.png" alt="Hero Image" class="w-9/12 md:w-auto" />
    </div>
  </div>
</template>
