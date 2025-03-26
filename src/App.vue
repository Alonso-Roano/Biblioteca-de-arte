<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from "@/components/NavBar.vue";
import FooterComp from "@/components/FooterComp.vue";

const route = useRoute();

const hideHeader = computed(() => {
  return ['login', 'register', 'dashboard', "dashboard-users", "dashboard-obra", "dashboard-categoria", "dashboard-likes", "dashboard-perfil", "registerArtist", "dashboard-artist", "dashboard-logAction", "dashboard-logError", "dashboard-exposicion", "dashboard-comentario"].includes(route.name as string);
});
</script>

<template>
  <div class="flex flex-col min-h-screen w-screen">
    <NavBar v-if="!hideHeader" />
    <RouterView />
    <FooterComp v-if="!hideHeader"></FooterComp>
  </div>
</template>
