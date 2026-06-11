export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated || !authStore.isAdmin) {
    return navigateTo('/')
  }
})
