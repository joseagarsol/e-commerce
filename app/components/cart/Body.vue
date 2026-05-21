<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import type { CartItem } from '~/types/product'

const cartStore = useCartStore()

const freeShipping = ref(25)

const calculateFreeShipping = computed(() => {
  return freeShipping.value - cartStore.subtotal
})

const isDisabledAddButton = (product: CartItem) => {
  if (product.selectedSize && product.stockBySize) {
    return product.quantity >= (product.stockBySize[product.selectedSize] ?? 0)
  }
  return product.quantity >= product.stock
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <UAlert
      v-if="cartStore.products.length > 0 && calculateFreeShipping > 0"
      variant="soft"
      color="warning"
      icon="i-lucide-info"
    >
      <template #title>
        ¡Estás a solo {{ calculateFreeShipping.toFixed(2) }}€ del <b>ENVÍO GRATIS</b>!
      </template>
    </UAlert>
    <UAlert
      v-if="cartStore.products.length > 0 && calculateFreeShipping <= 0"
      variant="soft"
      color="success"
      icon="i-lucide-party-popper"
    >
      <template #title>
        ¡Enhorabuena! Has conseguido el <b>ENVÍO GRATIS</b>
      </template>
    </UAlert>
    <div
      v-if="cartStore.products.length === 0"
      class="flex flex-col items-center justify-center h-full gap-2"
    >
      <p class="text-2xl font-semibold dark:text-gray-400 text-center">
        Tu cesta de compra está vacía
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400 text-center">
        Cuando añadas productos a tu cesta de la compra, aparecerán aquí.
      </p>
    </div>
    <div
      v-for="product in cartStore.products"
      :key="`${product.id}-${product.selectedSize}`"
      class="flex justify-between items-center"
    >
      <div class="flex flex-row items-center gap-4">
        <NuxtImg
          :src="product.images?.[0] || '/product-tshirt.png'"
          :alt="product.name"
          class="w-22 object-contain rounded-md shadow-md"
        />
        <div class="flex flex-col">
          <h3 class="text-base font-semibold text-gray-900 dark:text-white leading-tight">
            {{ product.name }}
          </h3>
          <p
            v-if="product.selectedSize"
            class="text-sm text-gray-500 dark:text-gray-400 mb-2 mt-0.5"
          >
            Talla: <span class="font-medium text-gray-700 dark:text-gray-300">{{ product.selectedSize }}</span>
          </p>
          <div class="flex items-center justify-between w-24 border rounded-md p-1">
            <UButton
              variant="ghost"
              size="xs"
              icon="i-lucide-minus"
              :disabled="product.quantity <= 1"
              aria-label="Quitar producto"
              @click="cartStore.removeProduct(product.id, product.selectedSize)"
            />
            <p class="text-base font-semibold text-gray-900 dark:text-white">
              {{ product.quantity }}
            </p>
            <UButton
              variant="ghost"
              size="xs"
              icon="i-lucide-plus"
              :disabled="isDisabledAddButton(product)"
              aria-label="Añadir producto"
              @click="cartStore.addProduct(product)"
            />
          </div>
        </div>
      </div>
      <div>
        <div class="flex flex-row gap-2 items-center">
          <p class="text-lg font-bold text-gray-900 dark:text-white">
            {{ formatCurrency(product.price * product.quantity) }}
          </p>
          <UButton
            color="neutral"
            variant="link"
            icon="i-lucide-trash-2"
            aria-label="Eliminar producto de la cesta"
            @click="cartStore.removeProductFromCart(product.id, product.selectedSize)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
