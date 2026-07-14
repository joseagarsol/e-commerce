<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: {
    type: Object as () => NuxtError,
    required: true
  }
})

const handleError = () => clearError({ redirect: '/' })

useSeoMeta({
  title: () => props.error?.status === 404 ? 'Página No Encontrada - Urban Luxury' : 'Error en la Aplicación - Urban Luxury',
  robots: 'noindex, nofollow'
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
    <AppHeader />

    <UMain class="flex-grow flex items-center justify-center py-16 md:py-24 px-5">
      <UContainer class="text-center max-w-xl mx-auto flex flex-col items-center gap-6">
        <h1 class="font-serif italic font-light text-[8rem] md:text-[12rem] text-zinc-200 dark:text-zinc-800 tracking-tighter leading-none select-none">
          {{ error?.status || 500 }}
        </h1>

        <div class="space-y-4">
          <h2 class="font-serif italic font-light text-3xl md:text-4xl text-zinc-900 dark:text-white leading-tight">
            {{ error?.status === 404 ? 'Página No Encontrada' : 'Algo ha salido mal' }}
          </h2>
          <p class="text-zinc-500 dark:text-zinc-400 font-light leading-relaxed max-w-md mx-auto">
            {{ error?.status === 404
              ? 'Lo sentimos, la página que buscas no existe o ha sido trasladada. Puedes volver al inicio o explorar nuestras colecciones.'
              : error?.message || 'Ha ocurrido un error inesperado en la tienda. Por favor, inténtalo de nuevo.' }}
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center w-full mt-6">
          <UButton
            label="Volver al Inicio"
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="solid"
            size="xl"
            class="w-full sm:w-auto justify-center cursor-pointer font-serif italic"
            @click="handleError"
          />
          <UButton
            label="Ver Colecciones"
            to="/collections"
            color="neutral"
            variant="outline"
            size="xl"
            class="w-full sm:w-auto justify-center cursor-pointer font-serif italic"
          />
        </div>

        <div
          v-if="error?.stack"
          class="mt-12 w-full text-left bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-lg border border-zinc-100 dark:border-zinc-800 max-h-60 overflow-y-auto"
        >
          <p class="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-3">
            Detalles de Depuración (Dev Mode)
          </p>
          <pre class="text-xs font-mono text-zinc-600 dark:text-zinc-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">{{ error.stack }}</pre>
        </div>
      </UContainer>
    </UMain>

    <AppFooter />
  </div>
</template>
