<script setup lang="ts">
import LayoutDashboard from '@/components/dashboard/LayoutDashboard.vue'
import ProfileComponent from '@/components/ProfileComponent.vue'
import ProfileView from '../Auth/Profile/ProfileView.vue';
</script>
<template>
  <LayoutDashboard>
    <template #content>
      <div class=" flex justify-center items-center">
        <ProfileView />
      </div>
    </template>
  </LayoutDashboard>
</template>
