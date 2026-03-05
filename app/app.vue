<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items: NavigationMenuItem[] = [
  {
    label: 'Novedades',
    to: '/'
  },
  {
    label: 'Colecciones',
    to: '/collections'
  },
  {
    label: 'Archivo',
    to: '/archive'
  },
  {
    label: 'Sobre Nosotros',
    to: '/about'
  }
]
const cartCount = ref(3)
</script>

<template>
  <UApp>
    <UHeader class="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
      <template #title>
        Urban Luxury
      </template>

      <UNavigationMenu
        :items="items"
        class="tracking-wide hover:text-primary"
      />
      <template #right>
        <UButton
          color="primary"
          icon="i-lucide-user"
          variant="ghost"
          class="transition-transform hover:scale-110 active:scale-90"
        />
        <UChip
          :show="cartCount > 0"
          :text="cartCount"
          size="md"
        >
          <UButton
            color="primary"
            icon="i-lucide-shopping-cart"
            variant="ghost"
            class="transition-transform hover:scale-110 active:scale-90"
          />
        </UChip>
      </template>
    </UHeader>
    <NuxtPage />
  </UApp>
</template>
