export default defineNuxtRouteMiddleware((__, from) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated || !authStore.isAdmin) {
    return navigateTo(from.path || '/')
  }
})
