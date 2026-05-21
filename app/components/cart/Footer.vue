<script setup lang="ts">
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
</script>

<template>
  <div class="flex flex-col w-full gap-4">
    <div class="flex w-full justify-between items-center">
      <p class="text-lg font-medium text-gray-900 dark:text-white">
        Total
      </p>
      <p class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ formatCurrency(cartStore.subtotal) }}
      </p>
    </div>
    <UButton
      to="/checkout"
      color="primary"
      variant="solid"
      label="Proceder al pago"
      block
      @click="cartStore.isOpenSlide = false"
    />
    <div class="flex gap-2 items-center justify-center">
      <UIcon
        name="i-simple-icons-applepay"
        class="size-10"
      />
      <UIcon
        name="i-simple-icons-googlepay"
        class="size-10"
      />
      <UIcon
        name="i-simple-icons-paypal"
        class="size-10"
      />
      <UIcon
        name="i-simple-icons-mastercard"
        class="size-10"
      />
      <UIcon
        name="i-simple-icons-visa"
        class="size-10"
      />
    </div>
  </div>
</template>
