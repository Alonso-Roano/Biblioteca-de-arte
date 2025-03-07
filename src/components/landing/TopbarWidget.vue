<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Button from '../common/Button.vue'
import ButtonHeader from '../common/ButtonHeader.vue'
import ButtonHeaderAuthComponent from '../common/ButtonHeaderAuthComponent.vue'
import IconPrimatic from '../icons/IconPrimatic.vue'
import { useAuthStore } from '@/stores/authStore'
import { onMounted, ref } from 'vue'
import IconProfile from '../icons/IconProfile.vue'
import IconLogout from '../icons/IconLogout.vue'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import router from '@/router'
import IconArrow from '../icons/IconArrow.vue'

const authStore = useAuthStore()
const isAuth = ref(false)
const user = ref({
  Name: '',
  Email: '',
  Fullname: '',
  Rol: '',
})

const toggleMenu = () => {
  const menu = document.querySelector('.menu')
  const arrow = document.querySelector('.iconArrow')
  menu?.classList.toggle('start')
  arrow?.classList.toggle('rot')
}
onMounted(() => {
  if (user.value.Rol === 'Admin') {
    router.push({ name: 'dashboard' })
  }
})
const Logout = () => {
  toggleMenu()
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  location.reload()
  router.push({ name: 'home' })
}
</script>

<style>
.menu.start {
  animation: showMenu 200ms cubic-bezier(0.075, 0.82, 0.165, 1) 1 forwards;
}
.iconArrow.rot {
  animation: rota 200ms cubic-bezier(0.075, 0.82, 0.165, 1) 1 forwards;
}
@keyframes showMenu {
  100% {
    visibility: visible;
    opacity: 100%;
    height: auto;
  }
}
@keyframes rota {
  100% {
    rotate: 270deg;
  }
}
</style>
<template>
  <div class="sticky top-0 font-sans z-20 bg-slate-900/90 backdrop-blur text-white">
    <div class="py-6 lg:px-20 flex items-center justify-between">
      <a class="flex items-center gap-2 justify-center" href="#">
        <span class="text-surface-900 font-medium text-xl leading-normal">PRIMATIC</span>
        <IconPrimatic />
      </a>

      <div class="">
        <div v-if="isAuth">
          <ul class="list-none flex items-center select-none cursor-pointer gap-5">
            <li class="">
              <RouterLink :to="{ name: 'home' }">
                <ButtonHeaderAuthComponent>
                  <template #text> Inicio </template>
                </ButtonHeaderAuthComponent>
              </RouterLink>
            </li>
            <li>
              <RouterLink :to="{ name: 'calendar' }">
                <ButtonHeaderAuthComponent>
                  <template #text>Calendario</template>
                </ButtonHeaderAuthComponent>
              </RouterLink>
            </li>
            <li>
              <RouterLink :to="{ name: 'log' }">
                <ButtonHeaderAuthComponent>
                  <template #text>Bitacora</template>
                </ButtonHeaderAuthComponent>
              </RouterLink>
            </li>
            <li>
              <RouterLink :to="{ name: 'search' }">
                <ButtonHeaderAuthComponent>
                  <template #text>Busqueda</template>
                </ButtonHeaderAuthComponent>
              </RouterLink>
            </li>
          </ul>
        </div>
        <div v-else>
          <ul class="list-none flex items-center select-none cursor-pointer gap-10">
            <li class="">
              <ButtonHeader id="home">
                <template #text> Inicio </template>
              </ButtonHeader>
            </li>
            <li>
              <ButtonHeader id="hero">
                <template #text>Hero</template>
              </ButtonHeader>
            </li>
            <li>
              <ButtonHeader id="features">
                <template #text>Caracteristicas</template>
              </ButtonHeader>
            </li>
            <li>
              <ButtonHeader id="highlights">
                <template #text>Contacto</template>
              </ButtonHeader>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="isAuth" class="py-4 lg:py-0 mt-4 lg:mt-0 relative">
        <div class="cursor-pointer" :onclick="toggleMenu">
          <div
            class="flex items-center justify-center gap-2 hover:bg-slate-700/60 bg-slate-700/20 rounded-md px-3 py-2"
          >
            <span
              class="w-fit cursor-pointer uppercase font-semibold block px-3 py-1 rounded-full duration-300 text-blue-400 bg-blue-900/80"
            >
              {{ user.Fullname.slice(0, 1) }}
            </span>
            <div class="max-w-[70px]">
              <span class="text-sm font-semibold block truncate capitalize">{{
                user.Fullname
              }}</span>

              <span class="text-xs text-zinc-400 block truncate">{{ user.Email }}</span>
            </div>
            <IconArrow class="iconArrow size-4 rotate-90" />
          </div>
        </div>
        <div
          class="z-10 shadow opacity-0 invisible menu absolute w-full rounded-sm mt-1 border-[0.5px] border-zinc-200 bg-white h-0 pb-1"
        >
          <ul class="text-black">
            <RouterLink
              :to="{ name: 'profile' }"
              class="flex gap-2 items-center group hover:bg-slate-100 py-1.5 px-2 mb-0.5 mt-1 mx-1 rounded-sm"
            >
              <span class="block">
                <IconProfile size="" class="size-3 text-slate-400 group-hover:text-slate-500" />
              </span>
              <span class="block text-slate-600 text-sm"> Perfil </span>
            </RouterLink>
            <li
              :onclick="Logout"
              class="flex cursor-pointer gap-2 items-center group hover:bg-slate-100 py-1.5 px-2 my-0.5 mx-1 rounded-sm"
            >
              <span class="block">
                <IconLogout size="" class="size-3 text-slate-400 group-hover:text-slate-500" />
              </span>
              <span class="block text-slate-600 text-sm truncate"> Cerrar Sesión </span>
            </li>
          </ul>
        </div>
      </div>
      <div
        v-else
        class="flex border-t lg:border-t-0 border-surface py-4 lg:py-0 mt-4 lg:mt-0 gap-2"
      >
        <RouterLink to="/inicio-sesion">
          <Button
            text="text-blue-400"
            hover="hover:bg-blue-700/30 hover:text-blue-500"
            font="font-semibold"
            bg="bg-blue-900/80"
          >
            <template #text> Iniciar Sesión </template>
          </Button>
        </RouterLink>
        <RouterLink :to="{ name: 'register' }">
          <Button
            text="text-white/90"
            hover="hover:bg-blue-700"
            font="font-semibold"
            bg="bg-blue-700/80"
          >
            <template #text> Registrarse </template>
          </Button>
        </RouterLink>
      </div>
    </div>
  </div>
  <Toast />
</template>
