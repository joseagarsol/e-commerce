<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import type { Product, CartItem, Size } from '~/types/product'

definePageMeta({
  layout: 'store'
})

const route = useRoute()
const productId = route.params.product as string

const { data: product } = await useFetch<Product>(`/api/products/${productId}`)

if (!product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'El producto solicitado no existe',
    fatal: true
  })
}

const activeProduct = product.value

const cartStore = useCartStore()

const isWishlisted = ref(false)

const carousel = useTemplateRef('carousel')
const activeIndex = ref(0)

function onClickPrev() {
  activeIndex.value--
}

function onClickNext() {
  activeIndex.value++
}

function onSelect(index: number) {
  activeIndex.value = index
}

function select(index: number) {
  activeIndex.value = index

  carousel.value?.emblaApi?.scrollTo(index)
}

const selectedSize = ref<Size | null>(activeProduct.availableSizes?.[0] ?? null)

const stockBadge = computed(() => {
  const currentStock = activeProduct.stockBySize && selectedSize.value
    ? activeProduct.stockBySize[selectedSize.value] ?? 0
    : activeProduct.stock

  if (currentStock === 0) {
    return {
      color: 'error' as const,
      label: 'Agotado',
      icon: 'i-lucide-octagon-x'
    }
  }
  if (currentStock <= 5) {
    return {
      color: 'error' as const,
      label: `Últimas ${currentStock} unidades`,
      icon: 'i-lucide-octagon-x'
    }
  }
  if (currentStock <= 25) {
    return {
      color: 'warning' as const,
      label: 'Últimas 25 unidades',
      icon: 'i-lucide-triangle-alert'
    }
  }
  return null
})

const handleAddToCart = () => {
  const cartItem: CartItem = {
    ...activeProduct,
    selectedSize: selectedSize.value,
    quantity: 1
  }

  cartStore.addProduct(cartItem)
  cartStore.isOpenSlide = true
}

const isSoldOut = computed(() => {
  const qtyInCart = cartStore.getItemQuantity(activeProduct.id, selectedSize.value)

  // Producto con tallas
  if (activeProduct.stockBySize) {
    if (!selectedSize.value) return true
    const stockAvailable = activeProduct.stockBySize[selectedSize.value] ?? 0
    return stockAvailable <= qtyInCart
  }
  // Producto sin tallas
  return activeProduct.stock <= qtyInCart
})
</script>

<template>
  <div
    v-if="product"
    class="grid grid-cols-1 md:grid-cols-2 gap-8"
  >
    <div class="product-image">
      <UCarousel
        ref="carousel"
        v-slot="{ item }"
        :items="product.images"
        :prev="{ onClick: onClickPrev }"
        :next="{ onClick: onClickNext }"
        class="w-full mx-auto"
        @select="onSelect"
      >
        <NuxtImg
          :src="item"
          class="w-full rounded-lg aspect-4/5 object-cover"
          loading="lazy"
          :zoom="true"
        />
      </UCarousel>
      <div class="flex justify-center gap-1 pt-4 mx-auto">
        <div
          v-for="(item, index) in product.images"
          :key="index"
          class="size-11 opacity-25 hover:opacity-100 transition-opacity"
          :class="{ 'opacity-100': activeIndex === index }"
          @click="select(index)"
        >
          <img
            :src="item"
            width="44"
            height="44"
            class="rounded-lg aspect-4/5 object-cover"
            loading="lazy"
          >
        </div>
      </div>
    </div>
    <div class="product-info flex flex-col gap-8">
      <h1 class="text-4xl font-serif font-normal text-zinc-900 dark:text-white tracking-wide">
        {{ product.name }}
      </h1>
      <div class="flex flex-col gap-3">
        <p class="text-2xl text-zinc-900 dark:text-white font-medium tracking-tight">
          {{ formatCurrency(product.price) }}
        </p>
        <p class="text-zinc-600 dark:text-zinc-400 text-base leading-relaxed max-w-lg">
          {{ product.description }}
        </p>
      </div>
      <UBadge
        v-if="stockBadge"
        :color="stockBadge.color"
        :label="stockBadge.label"
        variant="subtle"
        size="md"
        class="w-fit"
        :icon="stockBadge.icon"
      />
      <div class="flex flex-col gap-4">
        <p
          v-if="selectedSize"
          class="text-sm text-zinc-900 dark:text-white tracking-wide"
        >
          Talla: {{ selectedSize }}
        </p>
        <div class="flex flex-row gap-2">
          <UButton
            v-for="size in product.availableSizes"
            :key="size"
            :variant="selectedSize === size ? 'solid' : 'subtle'"
            :label="size"
            size="xl"
            class="w-16 justify-center"
            @click="() => { selectedSize = size }"
          />
        </div>
      </div>
      <div class="flex flex-row gap-2">
        <UButton
          :label="isSoldOut ? 'Agotado' : 'Añadir a la cesta'"
          size="xl"
          :icon="isSoldOut ? 'i-lucide-octagon-x' : 'i-lucide-shopping-cart'"
          variant="outline"
          class="w-fit"
          :disabled="isSoldOut"
          @click="handleAddToCart"
        />
        <UButton
          size="xl"
          variant="ghost"
          :color="isWishlisted ? 'error' : 'neutral'"
          class="w-fit"
          @click="() => { isWishlisted = !isWishlisted }"
        >
          <svg
            v-if="isWishlisted"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-6 shrink-0"
          >
            <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676a.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
          </svg>
          <UIcon
            v-else
            name="i-lucide-heart"
            class="size-6 shrink-0"
          />
        </UButton>
      </div>
      <div class="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-3">
        <div class="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
          <UIcon
            name="i-lucide-truck"
            class="size-5"
          />
          <span>Envío gratuito en pedidos superiores a 25€</span>
        </div>
        <div class="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
          <UIcon
            name="i-lucide-refresh-cw"
            class="size-5"
          />
          <span>Devoluciones fáciles y gratuitas</span>
        </div>
      </div>
    </div>
  </div>
</template>
