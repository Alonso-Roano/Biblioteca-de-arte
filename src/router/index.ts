import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/Auth/LoginView.vue'
import RegisterView from '@/views/Auth/RegisterView.vue'
import Dashboard from '@/views/Dashboard/Dashboard.vue'
import DashboardUsers from '@/views/Dashboard/DashboardUsers.vue'
import DashboardEtiquetas from '@/views/Dashboard/DashboardCategoria.vue'
import { useAuthStore } from "@/stores/authStore";
import DashboardLikes from '@/views/Dashboard/DashboardLikes.vue'
import DashboardProfile from '@/views/Dashboard/DashboardProfile.vue'
import ErrorPage404 from '@/views/Errors/ErrorPage404.vue'
import GalleryView from '@/views/GalleryView.vue'
import DetalleProducto from '../views/DetalleProducto.vue'
import ExposureView from '../views/ExposureView.vue'
import ProfileView from '@/views/Auth/Profile/ProfileView.vue'
import ProfileArtist from '@/views/Auth/Profile/ProfileArtist.vue'
import DashboardArtists from '@/views/Dashboard/DashboardArtists.vue'
import DashboardLogAction from '@/views/Dashboard/DashboardLogAction.vue'
import DashboardLogError from '@/views/Dashboard/DashboardLogError.vue'
import DashboardExposicion from '@/views/Dashboard/DashboardExposicion.vue'
import DashboardObra from '@/views/Dashboard/DashboardObra.vue'
import DashboardComentario from '@/views/Dashboard/DashboardComentario.vue'
import ObraColorView from '@/views/ObraColorView.vue'
import AddObraView from '@/views/AddObraView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { menu: true, title: 'Inicio' },
      component: HomeView,
    },
    {
      path: '/galeria',
      name: 'galeria',
      meta: { menu: true, title: 'Galeria' },
      component: GalleryView,
    },
    {
      path: '/Exposiciones',
      name: 'Exposiciones',
      meta: { menu: true, title: 'Exposiciones' },
      component: ExposureView
    },
    {
      path:'/color',
      name:'Composición de color',
      meta: { menu: true, requiresAuth: true, title: 'Composicion de color', roles: ['Artista'] },
      component: ObraColorView
    },
    {
      path:'/AddObra',
      name:'Agregar Obra',
      meta: { menu: true, requiresAuth: true, requiresArtist:true, title: 'Agregar Obra', roles: ['Artista'] },
      component: AddObraView
    },
    {
      path: '/login',
      name: 'login',
      meta: { title: 'Login' },
      component: LoginView,
    },
    {
      path: '/DetalleProducto/:slug',
      name: 'Detalle de producto',
      meta: { requiresAuth: true, title: 'Detalle de producto' },
      component: DetalleProducto,
    },
    {
      path: '/register',
      name: 'register',
      meta: { menu: false, title: 'Register' },
      component: RegisterView,
    },
    {
      path: '/myprofile',
      name: 'myprofile',
      meta: { menu: true, requiresAuth: true, title: 'Mi perfil', roles: ['Usuario','Admin'] },
      component: ProfileView,
    },
    {
      path: '/myprofileArtist',
      name: 'myprofileArtist',
      meta: { menu: true, requiresAuth: true, requiresArtist:true, title: 'Mi perfil de Artista', roles: ['Artista'] },
      component: ProfileArtist,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { menu: true, requiresAuth: true, requiresAdmin: true, title: "Dashboard", roles: ['Admin'] },
    },
    {
      path: '/dashboard/users',
      name: 'dashboard-users',
      component: DashboardUsers,
      meta: { requiresAuth: true, requiresAdmin: true, title: "Usuarios" },
    },
    {
      path: '/dashboard/artist',
      name: 'dashboard-artist',
      component: DashboardArtists,
      meta: { requiresAuth: true, requiresAdmin: true, title: "Artistas" },
    },
    {
      path: '/dashboard/logAction',
      name: 'dashboard-logAction',
      component: DashboardLogAction,
      meta: { requiresAuth: true, requiresAdmin: true, title: "Registro de Acciones" },
    },
    {
      path: '/dashboard/logError',
      name: 'dashboard-logError',
      component: DashboardLogError,
      meta: { requiresAuth: true, requiresAdmin: true, title: "Registro de Errores" },
    },
    {
      path: '/dashboard/exposicion',
      name: 'dashboard-exposicion',
      component: DashboardExposicion,
      meta: { requiresAuth: true, requiresAdmin: true, title: "Exposiciones" },
    },
    {
      path: '/dashboard/categoria',
      name: 'dashboard-categoria',
      component: DashboardEtiquetas,
      meta: { requiresAuth: true, requiresAdmin: true, title: "Categorías" },
    },
    {
      path: '/dashboard/likes',
      name: 'dashboard-likes',
      component: DashboardLikes,
      meta: { requiresAuth: true, requiresAdmin: true, title: "Likes" },
    },
    {
      path: '/dashboard/obra',
      name: 'dashboard-obra',
      component: DashboardObra,
      meta: { requiresAuth: true, requiresAdmin: true, title: "Obras" },
    },
    {
      path: '/dashboard/comentarios',
      name: 'dashboard-comentario',
      component: DashboardComentario,
      meta: { requiresAuth: true, requiresAdmin: true, title: "Comentarios" },
    },
    {
      path: '/dashboard/perfil',
      name: 'dashboard-perfil',
      component: DashboardProfile,
      meta: { requiresAuth: true, requiresAdmin: true, title: "Perfil" },
    },
    {
      path: '/:pathMatch(.*)',
      name: 'Not found',
      component: ErrorPage404,
      meta: { menu: false, title: '404' },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  authStore.initializeAuth()

  if (to.meta.requiresAuth && authStore.status !== 'authorized') {
    next({ name: 'login' })
  } else if (to.meta.requiresAdmin && authStore.user?.rol !== 'Admin') {
    next({ name: 'home' })
  } else if (to.meta.requiresUser && (authStore.user?.rol !== 'Usuario')) {
    next({ name: 'home' })
  } else if (to.meta.requiresArtist && authStore.user?.rol !== 'Artista') {
    next({ name: 'home' })
  } else if ((to.name === 'login' || to.name === 'register') && authStore.status === 'authorized') {
    next({ name: 'home' })
  } else {
    next()
  }
})
export default router
