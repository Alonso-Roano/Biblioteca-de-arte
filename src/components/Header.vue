<template>
  <nav class="bg-[#5d20d3] border-gray-200  w-screen pr-3">
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <!-- Logo -->
      <a href="#" class="flex items-center space-x-3">
        <img src="/public/image/icon-white.svg" class="h-8" alt="Logo" />
        <img src="/public/image/babel-white.svg" class="h-8" alt="Logo" />
      </a>

      <!-- Botón de menú en móviles -->
      <button @click="toggleMobileMenu" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-[#5d20d3] rounded-lg md:hidden bg-[#fefcff] cursor-pointer">
        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M1 1h15M1 7h15M1 13h15" />
        </svg>
      </button>

      <!-- Menú principal -->
      <div :class="{
        'hidden': !mobileMenuOpen && isMobile,
        'absolute top-15 right-0 w-48 md:flex md:static md:w-auto md:bg-transparent': !isMobile
      }" class="items-center justify-between w-full md:flex md:w-auto">
        <ul
          class="flex flex-col font-medium p-2 md:p-0 mt-4 rounded-lg md:space-x-8 
                   md:flex-row md:mt-0 md:border-0">
          <li><a href="/" :class="getActiveClass('/')"
              class="block px-4 py-2 text-md  rounded-sm">Inicio</a>
          </li>
          <li><a href="/Libros" :class="getActiveClass('/Libros')"
              class=" block px-4 py-2 text-md  rounded-sm">Libros</a>
          </li>
          <li><a href="/#nosotros" :class="getActiveClass('/#nosotros')"
              class=" block px-4 py-2 text-md  rounded-sm">Nosotros</a>
          </li>
          <li><a href="/#contacto" :class="getActiveClass('/#contacto')"
              class=" block px-4 py-2 text-md  rounded-sm">Contacto</a>
          </li>
          <li v-if="user?.rol == 'Admin'"><a href="/dashboard" :class="getActiveClass('/#contacto')"
              class=" block px-4 py-2 text-md  rounded-sm">Dashboard</a>
          </li>

          <!-- Menú de usuario si está autenticado -->
          <template v-if="isAuthenticated && isMobile">
            <li>
              <a href="#" :class="getActiveClass('/perfil')"
                class="block px-4 py-2 text-md  rounded-sm">Perfil</a>
            </li>
            <li>
              <button @click="logout"
                class="block px-4 py-2 text-md  rounded-sm text-[#fff] hover:bg-[#4d10c3] my-1 md:my-0 w-full text-left cursor-pointer">
                Cerrar sesión
              </button>
            </li>
          </template>

          <!-- Botón de login dentro del menú en móviles -->
          <template v-if="!isAuthenticated && isMobile">
            <li>
              <a href="/login" :class="getActiveClass('/login')"
                class="block px-4 py-2 text-md  rounded-sm w-full text-left cursor-pointer">
                Iniciar sesión
            </a>
            </li>
          </template>

        </ul>
      </div>

      <!-- Botón de login fuera del menú -->
      <template v-if="!isAuthenticated && !isMobile">
        <a href="/login" class="block px-4 py-2 text-md text-[#5d20d3] bg-[#fff] hover:bg-[#eee] rounded my-1 md:my-0 cursor-pointer">
          Iniciar sesión
        </a>
      </template>

      <!-- Menú de usuario si está autenticado -->
      <template v-if="isAuthenticated && !isMobile">
        <div class="relative flex items-center">
          <button @click="toggleDropdown"
            class="flex text-sm bg-[#71e1e1] rounded-full focus:ring-4 focus:ring-[#71e1e1]">
            <img class="w-8 h-8 rounded-full" :src="`/public/icons/`+user?.perfil" alt="user photo">
          </button>

          <div v-if="dropdownOpen"
            class="absolute right-6 top-7 mt-2 w-48 rounded-lg shadow-lg bg-[#71e1e1] z-50">
            <div class="px-4 py-3">
              <span class="block text-sm text-[#000] ">{{ user?.nombre }}</span>
              <span class="block text-sm text-[#555] truncate ">{{ user?.email }}</span>
            </div>
            <ul class="py-2">
              <li>
                <a href="/perfil"
                  class="block px-4 py-2 text-sm text-[#000] hover:bg-[#65d5d5]  rounded-lg">Perfil</a>
              </li>
              <li>
                <a href="/Libro/creados"
                  class="block px-4 py-2 text-sm text-[#000] hover:bg-[#65d5d5]  rounded-lg">Libros</a>
              </li>
              <li>
                <a href="/likes"
                  class="block px-4 py-2 text-sm text-[#000] hover:bg-[#65d5d5]  rounded-lg">Likes</a>
              </li>
              <li>
                <button @click="logout"
                  class="w-full text-left block px-4 py-2 text-sm text-[#000] hover:bg-[#65d5d5]  rounded-lg">
                  Cerrar sesión
                </button>
              </li>
            </ul>
          </div>
        </div>
      </template>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();
authStore.initializeAuth();

const user = ref(authStore.user);

watch(() => authStore.user, (newUser) => {
  user.value = newUser;
}, { deep: true });

const mobileMenuOpen = ref(false);
const dropdownOpen = ref(false);

const isAuthenticated = computed(() => authStore.status === "authorized");

const isMobile = ref(window.innerWidth < 768);

const updateScreenSize = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
  window.addEventListener("resize", updateScreenSize);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateScreenSize);
});

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};


const logout = () => {
  authStore.logout();
};

import { useRoute } from "vue-router"; 

const route = useRoute();
const getActiveClass = (path: string) => {
  return window.location.pathname === path ? "text-[#5d20d3] bg-[#fff] rounded my-1 md:my-0" : "text-[#fff] hover:bg-[#4d10c3] my-1 md:my-0";
};
</script>
