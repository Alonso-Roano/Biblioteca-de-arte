<script setup lang="ts">
import { ref } from 'vue'
import ArtistForm from '@/views/Auth/Profile/components/ArtistForm.vue'
import LikeList from '@/views/Auth/Profile/components/LikeList.vue'
import ArtistComments from '@/views/Auth/Profile/components/ArtistComments.vue'
import ArtistsWorks from '@/views/Auth/Profile/components/ArtistsWorks.vue'
import ArtistCollections from '@/views/Auth/Profile/components/ArtistCollections.vue'

const tabs = ['Editar Perfil', 'Mis Obras', 'Mis Exposiciones']
const currentTab = ref('Editar Perfil')
</script>

<template>
  <div class="flex flex-col min-h-[calc(100vh-160px)] w-full bg-[#EEE9DF]">
    <div class="flex-grow px-4">
      <div class="max-w-4xl mx-auto my-10 p-6 bg-white rounded-2xl shadow-md">
        <div class="flex border-b border-gray-200 mb-6">
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="currentTab = tab"
            class="px-4 py-2 font-medium text-sm transition-all duration-200"
            :class="{
              'border-b-2 border-[#F4811B] text-[#F4811B]': currentTab === tab,
              'text-gray-500 hover:text-[#C25500]': currentTab !== tab,
            }"
          >
            {{ tab }}
          </button>
        </div>

        <div>
          <div v-if="currentTab === 'Editar Perfil'">
            <h2 class="text-lg font-semibold mb-4">Editar Perfil</h2>
            <ArtistForm />
          </div>
          <div v-else-if="currentTab === 'Mis Obras'">
            <ArtistsWorks />
          </div>

          <div v-else-if="currentTab === 'Mis Exposiciones'">
            <ArtistCollections />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
