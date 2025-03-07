<script setup lang="ts">
import { defineProps } from 'vue'

defineProps({
  bg: {
    type: String,
    default: 'bg-slate-800',
  },
  text: {
    type: String,
    default: 'text-white',
  },
  hover: {
    type: String,
    default: 'hover:bg-slate-700',
  },
  font: {
    type: String,
    default: 'font-medium',
  },
  css: {
    type: String,
    default: '',
  },
})
</script>
<template>
  <div
    :class="[
      `${bg} ${text} ${hover} ${font} ${css}`,
      ' w-fit cursor-pointer px-4 py-1.5 rounded-xl  duration-300',
    ]"
  >
    <slot name="icon"> </slot>
    <slot name="text"> </slot>
  </div>
</template>
