<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Icon } from "@iconify/vue";
import IconDashboard from '../icons/IconDashboard.vue'
import IconUsers from '../icons/IconUsers.vue'
</script>
<template>
  <aside
    id="logo-sidebar"
    class="sticky top-0 left-0 z-20 w-60 pt-2 md:block hidden bg-[#F4811B] border-r border-gray-200"
    aria-label="Sidebar"
  >
    <div class="h-full px-3 pb-4 overflow-y-auto bg-[#F4811B]">
      <ul class="space-y-4 font-medium">
        <li class="flex flex-col gap-2">
          <RouterLink
            :to="{ name: 'dashboard' }"
            class="flex items-center font-semibold p-2 mt-1 mb-2 text-[#fff] hover:text-[#F4811B] rounded-lg hover:bg-gray-100 group"
          >
            <IconDashboard
              class="w-5 h-5 font-semibold text-[#fff] hover:text-[#F4811B] transition duration-75 group-hover:text-[#F4811B]"
            />

            <span class="ms-3">Dashboard</span>
          </RouterLink>
          <RouterLink
            :to="{name:'dashboard-users'}"
            class="flex font-semibold items-center mb-2 p-2 text-[#fff] rounded-lg hover:text-[#F4811B] hover:bg-gray-100 group"
          >
            <IconUsers
              class="w-5 h-5 text-[#fff] hover:text-[#F4811B] transition duration-75 group-hover:text-[#F4811B]"
            />
            <span class="ms-3">Usuarios</span>
          </RouterLink>
          <RouterLink
            :to="{name:'dashboard-artist'}"
            class="flex font-semibold items-center mb-2 p-2 text-[#fff] rounded-lg hover:text-[#F4811B] hover:bg-gray-100 group"
          >
          <Icon icon="ri:brush-line" width="24" height="24" class="w-5 h-5 text-[#fff] hover:text-[#F4811B] transition duration-75 group-hover:text-[#F4811B]"/>
            <span class="ms-3">Artistas</span>
          </RouterLink>
          <!--
          <RouterLink
            :to="{name:'dashboard-obra'}"
            class="flex font-semibold items-center mb-2 p-2 text-[#fff] rounded-lg hover:text-[#F4811B] hover:bg-gray-100 group"
          >
            <Icon icon="material-symbols:image-outline-rounded" width="24" height="24" class="w-5 h-5 text-[#fff] hover:text-[#F4811B] transition duration-75 group-hover:text-[#F4811B]"/>
            <span class="ms-3">Obras</span>
          </RouterLink>
          -->
          <RouterLink
            :to="{name:'dashboard-exposicion'}"
            class="flex font-semibold items-center mb-2 p-2 text-[#fff] rounded-lg hover:text-[#F4811B] hover:bg-gray-100 group"
          >
            <Icon icon="foundation:folder" width="24" height="24" class="w-5 h-5 text-[#fff] hover:text-[#F4811B] transition duration-75 group-hover:text-[#F4811B]"/>
            <span class="ms-3">Exposiciones</span>
          </RouterLink>
          <RouterLink
            :to="{name:'dashboard-categoria'}"
            class="flex font-semibold items-center mb-2 p-2 text-[#fff] rounded-lg hover:text-[#F4811B] hover:bg-gray-100 group"
          >
            <Icon icon="mdi:tag" width="24" height="24" class="w-5 h-5 text-[#fff] hover:text-[#F4811B] transition duration-75 group-hover:text-[#F4811B]"/>
            <span class="ms-3">Categorias</span>
          </RouterLink>
          
          <RouterLink
            :to="{name:'dashboard-likes'}"
            class="flex font-semibold items-center mb-2 p-2 text-[#fff] rounded-lg hover:text-[#F4811B] hover:bg-gray-100 group"
          >
            <Icon icon="mdi:heart" width="24" height="24" class="w-5 h-5 text-[#fff] hover:text-[#F4811B] transition duration-75 group-hover:text-[#F4811B]"/>
            <span class="ms-3">Likes</span>
          </RouterLink>
          <RouterLink
            :to="{name:'dashboard-logAction'}"
            class="flex font-semibold items-center mb-2 p-2 text-[#fff] rounded-lg hover:text-[#F4811B] hover:bg-gray-100 group"
          >
            <Icon icon="tdesign:system-log-filled" width="24" height="24" class="w-5 h-5 text-[#fff] hover:text-[#F4811B] transition duration-75 group-hover:text-[#F4811B]"/>
            <span class="ms-3">Acciones de log</span>
          </RouterLink>
          <RouterLink
            :to="{name:'dashboard-logError'}"
            class="flex font-semibold items-center mb-2 p-2 text-[#fff] rounded-lg hover:text-[#F4811B] hover:bg-gray-100 group"
          >
            <Icon icon="tdesign:system-log" width="24" height="24" class="w-5 h-5 text-[#fff] hover:text-[#F4811B] transition duration-75 group-hover:text-[#F4811B]"/>
            <span class="ms-3">Errores de log</span>
          </RouterLink>
        </li>
      </ul>
    </div>
  </aside>
</template>
