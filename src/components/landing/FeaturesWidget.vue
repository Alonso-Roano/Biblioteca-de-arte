<script setup lang="ts">
import CardFeature from './CardFeature.vue'
import TagComponent from '../common/TagComponent.vue'
</script>

<template>
  <div id="features" class="py-6 px-6 lg:px-20 mt-8 mx-0 lg:mx-20">
    <div class="text-center mt-20 mb-6">
      <div class="text-zinc-700 font-semibold mb-2 text-4xl">Gestión y Control de Progreso</div>
      <span class="text-muted-color text-gray-500 text-xl">Todo en un solo lugar...</span>
    </div>
    <div class="">
      <CardFeature img="/images/calendar.avif">
        <template #title> Calendario Integrado de Entrenamientos </template>
        <template #description>
          Programa tus rutinas diarias o semanales, visualiza tu planificación mensual y recibe
          recordatorios automáticos para no perderte ningún entrenamiento.
        </template>
        <template #subtitle> Calendario: </template>
        <template #tags>
          <TagComponent color="text-amber-500 bg-amber-400/20">
            <template #title> Semanal </template>
          </TagComponent>
          <TagComponent color="text-blue-500 bg-blue-400/20">
            <template #title> Mensual </template>
          </TagComponent>
          <TagComponent color="text-green-500 bg-green-400/20">
            <template #title>Anual </template>
          </TagComponent>
        </template>
      </CardFeature>
    </div>

    <div class="text-center mt-20 mb-6">
      <div class="text-zinc-700 font-semibold mb-2 text-4xl">Gestión y Control de Progreso</div>
      <span class="text-muted-color text-gray-500 text-xl">Todo en un solo lugar...</span>
    </div>
    <CardFeature img="/images/run.avif">
      <template #title>Gestión Flexible de Rutinas </template>
      <template #description>
        Crea entrenamientos personalizados sin fecha específica, ideales para viajes o sesiones
        rápidas. Funciona como un banco de ejercicios siempre accesible.
      </template>
      <template #subtitle> Rutinas: </template>
      <template #tags>
        <TagComponent color="text-blue-500 bg-blue-400/20">
          <template #title> Fechas Especificas </template>
        </TagComponent>
        <TagComponent color="text-blue-500 bg-blue-400/20">
          <template #title> Accesibles </template>
        </TagComponent>
      </template>
    </CardFeature>
    <div class="text-center mt-20 mb-6">
      <div class="text-zinc-700 font-semibold mb-2 text-4xl">Gestión y Control de Progreso</div>
      <span class="text-muted-color text-gray-500 text-xl">Todo en un solo lugar...</span>
    </div>

    <CardFeature img="/images/test.avif">
      <template #title>Entrenamientos Recurrentes </template>
      <template #description>
        Configura la repetición de rutinas para periodización deportiva o mantenimiento, como un
        plan de hipertrofia cada 6 semanas o cardio semanal.
      </template>
      <template #subtitle> Gráficas: </template>
      <template #tags>
        <TagComponent color="text-amber-500 bg-amber-400/20">
          <template #title> Semanal </template>
        </TagComponent>
        <TagComponent color="text-blue-500 bg-blue-400/20">
          <template #title> Mensual </template>
        </TagComponent>
        <TagComponent color="text-green-500 bg-green-400/20">
          <template #title>Anual </template>
        </TagComponent>
      </template>
    </CardFeature>
  </div>
</template>
