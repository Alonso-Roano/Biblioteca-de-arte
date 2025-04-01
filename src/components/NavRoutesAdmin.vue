<template>
  <li class="relative group">
    <router-link
      :to="route.path"
      class="flex font-medium text-lg items-center px-4 py-2 rounded-lg transition-all transform hover:scale-110 hover:font-bold"
      active-class="text-[#F4811B]"
      @click="$emit('close-mobile-menu')"
    >
      {{ route.meta.title }}
      <span v-if="hasChildren" class="ml-1">▼</span>
    </router-link>

    <!-- Submenú (si lo hay) - Modificado para disposición flexible -->
    <div
      v-if="hasChildren"
      class="absolute left-0 top-full mt-1 min-w-max bg-white border border-gray-200 rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all"
    >
      <div class="flex flex-wrap"> 
        <div
          v-for="child in filteredChildren"
          :key="child.path"
          class="px-2 py-1"
        >
          <router-link
            :to="child.path"
            class="block px-4 py-2 text-[#D9D9D9] hover:bg-gray-100 whitespace-nowrap rounded transition-colors"
            active-class="bg-blue-100 text-blue-600"
            @click="$emit('close-mobile-menu')"
          >
            {{ child.meta.title }}
          </router-link>
        </div>
      </div>
    </div>
  </li>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  route: {
    type: Object,
    required: true,
  },
})

const hasChildren = computed(() =>
  props.route.children?.some((child) => child.meta?.menu)
)
const filteredChildren = computed(
  () => props.route.children?.filter((child) => child.meta?.menu) || []
)
</script>