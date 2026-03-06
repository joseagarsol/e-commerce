<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items = ref<NavigationMenuItem[][]> ([
  [
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
  ],
  [
    {
      label: 'Mi cuenta',
      to: '/account'
    },
    {
      label: 'Seguimiento de pedidos',
      to: '/orders'
    }
  ]
]
)
const cartCount = ref(3)
</script>

<template>
  <UHeader
    mode="slideover"
    class="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/10"
    :toggle="{ color: 'primary', variant: 'ghost' }"
    :menu="{ side: 'right' }"
  >
    <template #title>
      <span class="text-lg font-light tracking-widest uppercase">Urban Luxury</span>
    </template>

    <UNavigationMenu
      :items="items[0]"
      class="hidden lg:flex tracking-wide hover:text-primary"
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

    <template #content="{ close }">
      <div class="flex items-center justify-between p-4 border-b border-white/10">
        <span class="text-lg font-light tracking-widest uppercase">Urban Luxury</span>
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-x"
          @click="close"
        />
      </div>
      <div class="flex flex-col justify-between h-full">
        <div class="flex flex-col p-4">
          <UNavigationMenu
            :items="items[0]"
            orientation="vertical"
            class="py-4"
          />
        </div>
        <div class="flex flex-col p-4">
          <USeparator />
          <UNavigationMenu
            :items="items[1]"
            orientation="vertical"
            class="py-4"
          />
        </div>
      </div>
    </template>
  </UHeader>
</template>
