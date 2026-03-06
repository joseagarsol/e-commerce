<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items: NavigationMenuItem[] = [
  {
    label: 'Privacidad',
    to: '/privacy'
  },
  {
    label: 'Términos',
    to: '/terms'
  },
  {
    label: 'Envíos',
    to: '/shipping'
  },
  {
    label: 'Contacto',
    to: '/contact'
  }
]
</script>

<template>
  <UFooter class="border-t border-white/5 bg-background/50">
    <template #left>
      <p class="text-lg font-light tracking-widest uppercase">
        Urban Luxury
      </p>
    </template>

    <UNavigationMenu
      :items="items"
      variant="link"
      class="text-sm text-neutral-400 hover:text-primary transition-colors"
    />

    <template #right>
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-instagram"
        aria-label="Instagram"
        class="hover:scale-110 transition-transform"
      />
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-simple-icons-x"
        aria-label="X (Twitter)"
        class="hover:scale-110 transition-transform"
      />
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-rss"
        aria-label="RSS Feed"
        class="hover:scale-110 transition-transform"
      />
    </template>
    <template #bottom>
      <UContainer>
        <div class="flex justify-center lg:justify-start opacity-50 pb-6">
          <p class="text-xs tracking-tight">
            © {{ new Date().getFullYear() }} Urban Luxury. Diseñado para la elegancia urbana.
          </p>
        </div>
      </UContainer>
    </template>
  </UFooter>
</template>
