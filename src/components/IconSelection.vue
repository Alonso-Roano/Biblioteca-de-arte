<script setup lang="ts">
import { ref } from 'vue';

const icons = Array.from({ length: 50 }, (_, i) => `icono_${i + 1}.png`);

const selectedIcon = ref<string | null>(null);
</script>

<template>
  <div class="w-[360px] h-[200px] bg-[#ddd] rounded-sm flex flex-wrap gap-1 justify-evenly p-3 overflow-y-auto">
    <div
      v-for="icon in icons"
      :key="icon"
      class="relative"
    >
      <input
        type="radio"
        :id="icon"
        v-model="selectedIcon"
        :value="icon"
        class="absolute inset-0 opacity-0 cursor-pointer"
      />
      <label
        :for="icon"
        :class="{
          'border-white': selectedIcon !== icon,
          'border-blue-500': selectedIcon === icon,
          'hover:border-b-neutral-700': selectedIcon !== icon,
        }"
        class="block w-[60px] h-[60px] rounded-full border-3 transition-all duration-200 "
      >
        <img
          :src="`/icons/${icon}`"
          alt="Icono"
          class="w-full h-full object-cover rounded-full"
        />
      </label>
    </div>
  </div>
</template>

<style scoped>
label {
  transition: border-color 0.3s;
}
</style>
