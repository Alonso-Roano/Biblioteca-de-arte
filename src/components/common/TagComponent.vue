<script setup lang="ts">
import { defineProps } from 'vue'
defineProps({
  color: {
    type: String,
    default: 'text-zinc-500 bg-zinc-400/20',
  },
})
</script>
<template>
  <span :class="[`${color}`, ' rounded-2xl py-1 px-2 cursor-pointer']">
    <slot name="title"> </slot>
  </span>
</template>
