<script setup lang="ts">
import { defineProps } from 'vue'
defineProps({
  size: {
    default: 'size-5',
  },
})
</script>
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :class="`${size}`" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M2 8a1 1 0 0 1 1-1h18a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1m0 4a1 1 0 0 1 1-1h18a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1m1 3a1 1 0 1 0 0 2h12a1 1 0 1 0 0-2z"
    />
  </svg>
</template>
