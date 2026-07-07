<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const colorMode = useColorMode()

const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})

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
      label: 'Sobre Nosotros',
      to: '/about'
    }
  ],
  [
    {
      label: 'Mi cuenta',
      to: '/profile'
    },
    {
      label: 'Seguimiento de pedidos',
      to: '/orders'
    }
  ]
]
)
const cartCount = computed(() => cartStore.products.length)

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set(value) {
    colorMode.preference = value ? 'dark' : 'light'
  }
})
</script>

<template>
  <UHeader
    mode="slideover"
    class="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-white/10"
    :toggle="{ color: 'primary', variant: 'ghost' }"
    :menu="{ side: 'right' }"
  >
    <template #title>
      <span class="text-lg font-light tracking-widest uppercase text-zinc-900 dark:text-white">Urban Luxury</span>
    </template>

    <UNavigationMenu
      :items="items[0]"
      class="hidden lg:flex tracking-wide hover:text-primary"
    />
    <template #right>
      <UButton
        v-if="!colorMode.forced"
        color="primary"
        variant="ghost"
        class="group"
        :aria-label="isMounted && isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
        @click="() => { isDark = !isDark }"
      >
        <UIcon
          :name="isMounted && isDark ? 'i-lucide-sun' : 'i-lucide-moon'"
          class="size-5 transition-transform group-hover:scale-110 group-active:scale-90"
        />
      </UButton>
      <UPopover :content="{ align: 'end', side: 'bottom', sideOffset: 12 }">
        <UButton
          color="primary"
          variant="ghost"
          class="group"
        >
          <UIcon
            name="i-lucide-user"
            class="size-5 transition-transform group-hover:scale-110 group-active:scale-90"
          />
        </UButton>
        <template #content>
          <AuthLoginRegister />
        </template>
      </UPopover>
      <USlideover
        v-model:open="cartStore.isOpenSlide"
        :close="{
          color: 'neutral',
          icon: 'i-lucide-x',
          variant: 'ghost'
        }"
      >
        <UChip
          :show="isMounted && cartCount > 0"
          :text="isMounted ? cartCount : 0"
          size="2xl"
          :ui="{ base: 'size-4 text-xs text-gray-900' }"
        >
          <UButton
            color="primary"
            variant="ghost"
            class="group"
          >
            <UIcon
              name="i-lucide-shopping-cart"
              class="size-5 transition-transform group-hover:scale-110 group-active:scale-90"
            />
          </UButton>
        </UChip>
        <template #header>
          <CartHeader />
        </template>
        <template #body>
          <CartBody />
        </template>
        <template #footer>
          <CartFooter />
        </template>
      </USlideover>
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
