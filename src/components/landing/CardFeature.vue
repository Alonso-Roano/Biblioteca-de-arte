<script setup lang="ts">
import IconQuestion from '../icons/IconQuestion.vue'
import { defineProps } from 'vue'
defineProps<{ img: string }>()
</script>
<template>
  <div
    class="grid relative grid-cols-1 lg:grid-cols-2 gap-8 overflow-hidden bg-zinc-100 p-4 rounded-md lg:max-h-[260px] max-w-3xl mx-auto"
  >
    <IconQuestion
      class="size-7 absolute right-4 cursor-pointer lg:top-4 bottom-4 text-zinc-500 p-1 rounded-xl bg-zinc-400/20"
    />
    <div class="lg:max-h-[calc(260px-32px)] w-auto">
      <img :src="img" class="w-full h-full object-cover object-center rounded-md" alt="" />
    </div>
    <div class=" ">
      <h3 class="font-semibold text-zinc-800/90 text-2xl line-clamp-2">
        <slot name="title"> </slot>
      </h3>
      <p class="text-lg font-medium text-gray-500 pt-3 line-clamp-3">
        <slot name="description"> </slot>
      </p>
      <span class="text-zinc-500 block font-semibold"> <slot name="subtitle"></slot></span>
      <div class="mt-2 flex items-center gap-2">
        <slot name="tags"> </slot>
      </div>
    </div>
  </div>
</template>
