<script setup lang="ts">
const userEmail = ref<string | undefined>(undefined)
const authStore = useAuthStore()
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
          to="/user/profile"
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
