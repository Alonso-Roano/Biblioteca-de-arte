<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import axios from 'axios'
import { Button, Dialog, InputText, Dropdown, Password, Toast } from 'primevue'
import { useAuthStore } from '@/stores/authStore';
import { apiRequest } from '@/api/apiClient';
const store = useAuthStore();

const icons = Array.from({ length: 50 }, (_, i) => `icono_${i + 1}.png`);

const selectedIcon = ref<string | undefined>();

const toast = useToast()
const loading = ref(false)
const user = <any>ref({
  nombre: '',   
  alias: '',
  password: '',
})

const fetchUserInfo = async () => {
  try {
    user.value = store.user;
    selectedIcon.value = store.user?.perfil;
    console.log(user.value)
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo cargar la información',
      life: 3000,
    })
  }
}

const saveChanges = async () => {
  loading.value = true
  try {
    const obj = {
      nombre: user.value.nombre,
      alias: user.value.alias,
      image: selectedIcon.value,
      newPassword: user.value.password,
    }
    console.log('el obj')
    console.log(obj)
    const tokenUser = <any>store.token;
    const res = await apiRequest("auth.update",{token: tokenUser}, obj);
    await store.refreshTokenAsync();
    fetchUserInfo()
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Perfil actualizado', life: 3000 })
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar', life: 3000 })
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchUserInfo()
})
</script>

<template>
  <div class="max-w-lg mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
    <h2 class="text-2xl font-semibold text-gray-700 mb-4">Perfil de Usuario</h2>
    <label class="block text-sm font-medium text-gray-600">Imagen de perfil</label>
    <div class="space-y-4">
      <div class="w-[360px] h-[135px] bg-[#ddd] rounded-sm flex flex-wrap gap-1 justify-evenly p-3 overflow-y-auto">
        <div v-for="icon in icons" :key="icon" class="relative">
          <input type="radio" :id="icon" v-model="selectedIcon" :value="icon"
            class="absolute inset-0 opacity-0 cursor-pointer" />
          <label :for="icon" :class="{
            'border-white': selectedIcon !== icon,
            'border-blue-500': selectedIcon === icon,
            'hover:border-b-neutral-700': selectedIcon !== icon,
          }" class="block w-[60px] h-[60px] rounded-full border-3 transition-all duration-200 ">
            <img :src="`/icons/${icon}`" alt="Icono" class="w-full h-full object-cover rounded-full" />
          </label>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600">Nombre Completo</label>
        <InputText v-model="user.nombre" class="w-full mt-1" /> 
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600">Alias</label>
        <InputText v-model="user.alias" class="w-full mt-1" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600">Contraseña</label>
        <Password v-model="user.password" class="w-full mt-1" />
      </div>
    </div>

    <div class="mt-6 flex justify-center">
      <Button label="Guardar Cambios" icon="pi pi-save" :loading="loading" @click="saveChanges" />
    </div>
  </div>

  <Toast />
</template>

<style scoped>
label {
  transition: border-color 0.3s;
}
</style>