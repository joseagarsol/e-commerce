<script setup lang="ts">
import OrderResumeProducts from './OrderResumeProducts.vue'

interface Props {
  shippingPrice: number
  getDiscountedShipping: (shippingPrice: number) => number
  finalPrice: number
}

defineProps<Props>()

const cartStore = useCartStore()
const open = ref(true)
</script>

<template>
  <UCollapsible v-model="open">
    <UButton
      color="neutral"
      variant="subtle"
      class="w-full rounded-none py-4 px-3 border-none"
      :class="{ 'border-b border-gray-200 dark:border-gray-800': open }"
    >
      <div class="flex justify-between items-center w-full">
        <div class="flex items-center gap-1">
          <p class="text-lg font-bold">
            Resumen del pedido
          </p>
          <UIcon
            name="i-lucide-chevron-down"
            class="size-5"
          />
        </div>

        <p class="text-primary font-medium">
          {{ formatCurrency(cartStore.subtotal) }}
        </p>
      </div>
    </UButton>
    <template #content>
      <div class="px-4 py-6 bg-elevated">
        <OrderResumeProducts
          :shipping-price="shippingPrice"
          :get-discounted-shipping="getDiscountedShipping"
          :final-price="finalPrice"
        />
      </div>
    </template>
  </UCollapsible>
</template>
