<script setup lang="ts">
import type { OrderResponseDTO } from '~~/server/dtos/order.dto'

definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()
const toast = useToast()

const { data: orders } = await useFetch<OrderResponseDTO[]>('/api/orders')

const totalOrders = computed(() => orders.value?.length || 0)
const totalSpent = computed(() => {
  return orders.value?.reduce((sum, order) => sum + order.total, 0) || 0
})

const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}
// Acción de logout
const handleLogout = async () => {
  try {
    await authStore.logout()
    toast.add({
      title: 'Sesión cerrada',
      description: 'Has cerrado sesión correctamente.',
      color: 'success'
    })
    await navigateTo('/login')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}
</script>

<template>
  <div class="py-12 px-5 md:py-16 md:px-12 max-w-4xl mx-auto space-y-10">
    <!-- Encabezado -->
    <div class="space-y-2">
      <h1 class="font-serif italic font-light text-4xl md:text-5xl text-zinc-900 dark:text-white leading-tight">
        Mi Cuenta
      </h1>
      <p class="text-sm text-zinc-500 dark:text-zinc-400 tracking-wide">
        Gestiona tu información de perfil y revisa tu actividad en la tienda.
      </p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Tarjeta de Información del Perfil (Ocupa 2 columnas en pantallas medianas) -->
      <UCard class="md:col-span-2 border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <template #header>
          <h2 class="text-lg font-semibold text-zinc-900 dark:text-white">
            Información del Perfil
          </h2>
        </template>
        <div class="flex items-center gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
          <UAvatar
            :alt="authStore.user?.name"
            size="xl"
            class="bg-primary/10 text-primary-600 font-bold text-lg"
          />
          <div>
            <h3 class="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              {{ authStore.user?.name }}
              <UBadge
                v-if="authStore.isAdmin"
                color="primary"
                variant="soft"
                size="xs"
              >
                Admin
              </UBadge>
            </h3>
            <p class="text-sm text-zinc-400 font-mono">
              {{ authStore.user?.email }}
            </p>
          </div>
        </div>
        <div class="pt-6 space-y-4 text-sm">
          <div class="flex justify-between">
            <span class="text-zinc-400">Rol del usuario</span>
            <span class="font-medium text-zinc-900 dark:text-white capitalize">{{ authStore.user?.role === 'admin' ? 'Administrador' : 'Cliente' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-zinc-400">Miembro desde</span>
            <span class="font-medium text-zinc-900 dark:text-white">{{ formatDate(authStore.user?.createdAt) }}</span>
          </div>
        </div>
      </UCard>
      <!-- Tarjeta de Estadísticas de Compra -->
      <UCard class="border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
        <template #header>
          <h2 class="text-lg font-semibold text-zinc-900 dark:text-white">
            Resumen de Actividad
          </h2>
        </template>
        <div class="space-y-6 py-2">
          <div class="space-y-1">
            <p class="text-xs uppercase tracking-wider text-zinc-400 font-medium">
              Pedidos realizados
            </p>
            <p class="text-3xl font-bold text-zinc-900 dark:text-white">
              {{ totalOrders }}
            </p>
          </div>
          <div class="space-y-1">
            <p class="text-xs uppercase tracking-wider text-zinc-400 font-medium">
              Total invertido
            </p>
            <p class="text-xl font-bold text-primary">
              {{ formatCurrency(totalSpent) }}
            </p>
          </div>
        </div>
      </UCard>
    </div>
    <!-- Panel de Acciones -->
    <div class="flex flex-col sm:flex-row gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
      <UButton
        to="/orders"
        label="Historial de Pedidos"
        color="neutral"
        variant="subtle"
        size="lg"
        icon="i-lucide-receipt"
        class="cursor-pointer"
      />
      <UButton
        v-if="authStore.isAdmin"
        to="/admin"
        label="Panel de Control (Admin)"
        color="primary"
        size="lg"
        icon="i-lucide-layout-dashboard"
        class="cursor-pointer"
      />
      <UButton
        label="Cerrar Sesión"
        color="error"
        variant="ghost"
        size="lg"
        icon="i-lucide-log-out"
        class="cursor-pointer sm:ml-auto"
        @click="handleLogout"
      />
    </div>
  </div>
</template>
