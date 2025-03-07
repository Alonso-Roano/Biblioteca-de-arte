<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Icon } from "@iconify/vue";
import IconDashboard from '../icons/IconDashboard.vue'
import IconUsers from '../icons/IconUsers.vue'
import IconMuscle from '../icons/IconMuscle.vue'
import IconExercise from '../icons/IconExercise.vue'
</script>
<template>
  <aside
    id="logo-sidebar"
    class="sticky top-0 left-0 z-20 w-60 pt-2 md:block hidden bg-[#5d20d3] border-r border-gray-200"
    aria-label="Sidebar"
  >
    <div class="h-full px-3 pb-4 overflow-y-auto bg-[#5d20d3]">
      <ul class="space-y-4 font-medium">
        <li class="flex flex-col gap-2">
          <RouterLink
            :to="{ name: 'dashboard' }"
            class="flex items-center font-semibold p-2 mt-1 mb-2 text-[#fff] hover:text-[#5d20d3] rounded-lg hover:bg-gray-100 group"
          >
            <IconDashboard
              class="w-5 h-5 font-semibold text-[#fff] transition duration-75 group-hover:text-gray-900"
            />

            <span class="ms-3">Dashboard</span>
          </RouterLink>
          <RouterLink
            :to="{name:'dashboard-users'}"
            class="flex font-semibold items-center mb-2 p-2 text-[#fff] rounded-lg hover:text-[#5d20d3] hover:bg-gray-100 group"
          >
            <IconUsers
              class="w-5 h-5 text-[#fff] transition duration-75 group-hover:text-gray-900"
            />
            <span class="ms-3">Usuarios</span>
          </RouterLink>
          <RouterLink
            :to="{name:'dashboard-libros'}"
            class="flex font-semibold items-center mb-2 p-2 text-[#fff] rounded-lg hover:text-[#5d20d3] hover:bg-gray-100 group"
          >
            <Icon icon="solar:book-bold" width="24" height="24" class="w-5 h-5 text-[#fff] transition duration-75 group-hover:text-gray-900"/>
            <span class="ms-3">Libros</span>
          </RouterLink>
          <RouterLink
            :to="{name:'dashboard-etiquetas'}"
            class="flex font-semibold items-center mb-2 p-2 text-[#fff] rounded-lg hover:text-[#5d20d3] hover:bg-gray-100 group"
          >
            <Icon icon="mdi:tag" width="24" height="24" class="w-5 h-5 text-[#fff] transition duration-75 group-hover:text-gray-900"/>
            <span class="ms-3">Etiquetas</span>
          </RouterLink>
          <RouterLink
            :to="{name:'dashboard-likes'}"
            class="flex font-semibold items-center mb-2 p-2 text-[#fff] rounded-lg hover:text-[#5d20d3] hover:bg-gray-100 group"
          >
            <Icon icon="mdi:heart" width="24" height="24" class="w-5 h-5 text-[#fff] transition duration-75 group-hover:text-gray-900"/>
            <span class="ms-3">Likes</span>
          </RouterLink>
        </li>
      </ul>
    </div>
  </aside>
</template>
