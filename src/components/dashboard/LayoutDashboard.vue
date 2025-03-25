<script setup lang="ts">
import HeaderAdmin from '@/components/dashboard/HeaderAdmin.vue'
import SidebarAdmin from '@/components/dashboard/SidebarAdmin.vue'
</script>
<template>
  <main class="flex flex-col min-h-dvh">
    <HeaderAdmin />
    <div class="flex grow">
      <SidebarAdmin />
      <div class="w-full h-auto">
        <div class=" bg-[#f5edd9] p-4 h-full pr-8 relative">
          <slot name="content"> </slot>
        </div>
      </div>
    </div>
  </main>
</template>
