export default defineNuxtRouteMiddleware((__, from) => {
  const authStore = useAuthStore()

  if (authStore.isAuthenticated) {
    return navigateTo(from.path || '/')
  }
})
