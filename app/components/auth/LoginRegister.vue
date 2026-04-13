<script setup lang="ts">
const userEmail = ref<string | undefined>(undefined)
</script>

<template>
  <div class="p-4 min-w-[350px]">
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
</template>
