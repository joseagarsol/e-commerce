<script setup lang="ts">
const userEmail = ref<string | undefined>(undefined)
const authStore = useAuthStore()
const toast = useToast()
const isSubmitting = ref(false)

async function loginAs(email: string, pass: string) {
  if (isSubmitting.value) return
  isSubmitting.value = true

  try {
    await authStore.login({ email, password: pass })

    toast.add({
      title: 'Acceso Demo Exitoso',
      description: `Has iniciado sesión como ${email.includes('admin') ? 'Administrador' : 'Cliente'}`,
      color: 'success'
    })
  } catch (error) {
    console.error('Error login demo:', error)
    toast.add({
      title: 'Error al iniciar sesión',
      description: 'No se pudo iniciar sesión con la cuenta demo.',
      color: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="p-4 min-w-[350px]">
    <div v-if="!authStore.isAuthenticated">
      <p class="font-light tracking-wide leading-relaxed ">
        Inicio de sesión / Registro
      </p>
      <USeparator class="my-3" />
      <AuthLoginForm
        v-if="!userEmail"
        @handle-user-email="(email) => userEmail = email"
      />
      <AuthPassForm
        v-else
        :user-email="userEmail"
        @handle-email-change="() => userEmail = undefined"
      />

      <div class="mt-6 space-y-4">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <span class="w-full border-t border-zinc-200 dark:border-zinc-800" />
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-white dark:bg-zinc-900 px-2 text-zinc-500 font-medium">
              Acceso Rápido Demo
            </span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <UButton
            color="neutral"
            variant="subtle"
            icon="i-lucide-shield-check"
            label="Admin"
            size="md"
            block
            class="cursor-pointer"
            :disabled="isSubmitting"
            @click="loginAs('admin@urbanluxury.com', 'admin12345')"
          />
          <UButton
            color="neutral"
            variant="subtle"
            icon="i-lucide-user"
            label="Cliente"
            size="md"
            block
            class="cursor-pointer"
            :disabled="isSubmitting"
            @click="loginAs('cliente@urbanluxury.com', 'cliente12345')"
          />
        </div>
      </div>
    </div>
    <div
      v-else
      class="flex flex-col gap-4"
    >
      <div class="flex items-center gap-3 px-1 py-1.5">
        <UAvatar
          :alt="authStore.user?.name"
          size="md"
          class="bg-primary/10 text-primary-600 font-semibold"
        />
        <div class="flex flex-col min-w-0">
          <span class="text-sm font-semibold truncate text-gray-900 dark:text-white">
            {{ authStore.user?.name }}
          </span>
          <span class="text-xs text-gray-500 truncate dark:text-gray-400">
            {{ authStore.user?.email }}
          </span>
        </div>
        <UBadge
          v-if="authStore.isAdmin"
          color="neutral"
          variant="subtle"
          size="xs"
          class="ml-auto"
        >
          Admin
        </UBadge>
      </div>

      <USeparator />

      <div class="flex flex-col gap-1">
        <UButton
          to="/profile"
          variant="ghost"
          color="neutral"
          block
          class="justify-start gap-3"
        >
          <template #leading>
            <UIcon
              name="i-lucide-user"
              class="size-4"
            />
          </template>
          Mi Perfil
        </UButton>

        <UButton
          to="/orders"
          variant="ghost"
          color="neutral"
          block
          class="justify-start gap-3"
        >
          <template #leading>
            <UIcon
              name="i-lucide-shopping-bag"
              class="size-4"
            />
          </template>
          Mis Pedidos
        </UButton>

        <UButton
          v-if="authStore.isAdmin"
          to="/admin"
          variant="ghost"
          color="primary"
          block
          class="justify-start gap-3 font-medium"
        >
          <template #leading>
            <UIcon
              name="i-lucide-layout-dashboard"
              class="size-4"
            />
          </template>
          Panel de Control
        </UButton>
      </div>

      <USeparator />

      <UButton
        variant="ghost"
        color="error"
        block
        class="justify-start gap-3"
        @click="authStore.logout()"
      >
        <template #leading>
          <UIcon
            name="i-lucide-log-out"
            class="size-4"
          />
        </template>
        Cerrar sesión
      </UButton>
    </div>
  </div>
</template>
