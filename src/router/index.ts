import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ImagesView from '@/views/ImagesView.vue'
import BooksView from '@/views/BooksView.vue'
import BookDetailView from '@/views/BookDetailView.vue'
import ProfileView from '@/views/ProfileView.vue'
import Dashboard from '@/views/Dashboard/Dashboard.vue'
import DashboardUsers from '@/views/Dashboard/DashboardUsers.vue'
import DashboardLibros from '@/views/Dashboard/DashboardLibros.vue'
import DashboardEtiquetas from '@/views/Dashboard/DashboardEtiquetas.vue'
import { useAuthStore } from "@/stores/authStore";
import DashboardLikes from '@/views/Dashboard/DashboardLikes.vue'
import DashboardProfile from '@/views/Dashboard/DashboardProfile.vue'
import LikeView from '@/views/LikeView.vue'
import EditarLibroView from '@/views/EditarLibroView.vue'
import LibrosCreadosView from '@/views/LibrosCreadosView.vue'
import CrearLibroView from '@/views/CrearLibroView.vue'
import ObraColor from '@/views/ObraColor.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    { path: '/images', name: 'images', component: ImagesView, meta: { requiresAuth: true } },
    { path: '/libros', name: 'libros', component: BooksView, meta: { requiresAuth: true } },
    { path: '/obras', name: 'obras', component: ObraColor, meta: { requiresAuth: true } },
    { path: '/libro/:slug', name: 'libro-detalle', component: BookDetailView, props: true, meta: { requiresAuth: true } },
    { path: '/perfil', name: 'profile', component: ProfileView, meta: { requiresAuth: true } },
    { path: '/likes', name: 'likes', component: LikeView, meta: { requiresAuth: true } },
    { path: '/libro/creados', name: 'libro-creados', component: LibrosCreadosView, meta: { requiresAuth: true } },
    { path: '/libro/editar/:idAutor/:slug', name: 'libro-editar', component: EditarLibroView, meta: { requiresAuth: true } },
    { path: '/libro/crear', name: 'libro-crear', component: CrearLibroView, meta: { requiresAuth: true } },
    { path: '/dashboard', name: 'dashboard', component: Dashboard, meta: { requiresAuth: true, requiresAdmin: true } },
    { path: '/dashboard/users', name: 'dashboard-users', component: DashboardUsers, meta: { requiresAuth: true, requiresAdmin: true } },
    { path: '/dashboard/libros', name: 'dashboard-libros', component: DashboardLibros, meta: { requiresAuth: true, requiresAdmin: true } },
    { path: '/dashboard/etiquetas', name: 'dashboard-etiquetas', component: DashboardEtiquetas, meta: { requiresAuth: true, requiresAdmin: true } },
    { path: '/dashboard/likes', name: 'dashboard-likes', component: DashboardLikes, meta: { requiresAuth: true, requiresAdmin: true } },
    { path: '/dashboard/perfil', name: 'dashboard-perfil', component: DashboardProfile, meta: { requiresAuth: true, requiresAdmin: true } },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  authStore.initializeAuth();

  if (to.meta.requiresAuth && authStore.status !== "authorized") {
    next({ name: "login" });
  } else if (to.meta.requiresAdmin && authStore.user?.rol !== "Admin") {
    next({ name: "home" });
  } else if ((to.name === "login" || to.name === "register") && authStore.status === "authorized") {
    next({ name: "home" });
  }else if (to.name === "libro-editar") {
    const idAutor = to.params.idAutor;
    const userId = authStore.user?.id;
    if (idAutor !== userId?.toString()) {
      next({ name: "home" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
