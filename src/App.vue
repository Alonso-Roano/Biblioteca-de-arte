<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

const route = useRoute();

const hideHeader = computed(() => {
  return ['login', 'register', 'dashboard', "dashboard-users", "dashboard-libros", "dashboard-etiquetas", "dashboard-likes", "dashboard-perfil"].includes(route.name as string);
});
</script>

<template>
  <div class="flex flex-col min-h-screen w-screen">
    <Header v-if="!hideHeader" />
    <RouterView />
    <Footer v-if="!hideHeader"></Footer>
  </div>
</template>
