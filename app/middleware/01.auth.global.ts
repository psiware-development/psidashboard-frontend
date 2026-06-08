import { publicPages } from "~/utils/publicPages";

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  // Rutas públicas que no requieren autenticación
  const publicRoutes = publicPages;
  const isPublicRoute = publicRoutes.includes(to.path)

  // En rutas públicas NO intentamos fetch de usuario (puede 401 y disparar redirect)
  // Solo hacemos la excepción de /login para redirigir a home si ya está logueado.
  if (isPublicRoute && to.path !== '/login') {
    return true
  }
  
  // Si ya tenemos usuario en el store, no hacemos fetch
  let isLoggedIn = false;
  if (!authStore.user) {
    isLoggedIn = await authStore.fetchUser();
  } else {
    isLoggedIn = authStore.isLoggedIn;
  }
  
  // Si no está logueado y la ruta no es pública, redirigir a login
  if (!isLoggedIn && !publicRoutes.includes(to.path)) {
    return navigateTo('/login');
  }
  
  // Si está logueado y va a login, redirigir a home
  if (isLoggedIn && to.path === '/login') {
    return navigateTo('/');
  }
});