<script setup lang="ts">
import LayoutDashboard from '@/components/dashboard/LayoutDashboard.vue'
import ProfileComponent from '@/components/ProfileComponent.vue'
</script>
<template>
  <LayoutDashboard>
    <template #content>
      <div class=" flex justify-center items-center">
        <ProfileComponent />
      </div>
    </template>
  </LayoutDashboard>
</template>
