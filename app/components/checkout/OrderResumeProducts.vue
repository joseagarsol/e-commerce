<script setup lang="ts">
const { applyPromotions, errorPromo, promoCode, promo } = usePromotions()
const cartStore = useCartStore()

interface Props {
  shippingPrice: number
  getDiscountedShipping: (shippingPrice: number) => number
  finalPrice: number
}

defineProps<Props>()
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden">
    <div class="flex flex-col flex-1 overflow-y-auto p-4 sm:pl-6 sm:pr-4 gap-6">
      <div
        v-for="product in cartStore.products"
        :key="`${product.id}-${product.selectedSize}`"
        class="flex justify-between items-center"
      >
        <div class="flex flex-row items-center gap-4">
          <UChip
            size="3xl"
            :ui="{ base: 'size-5 text-md text-gray-900' }"
          >
            <template #content>
              {{ product.quantity }}
            </template>
            <NuxtImg
              :src="product.images?.[0] || '/product-tshirt.png'"
              :alt="product.name"
              class="w-22 object-contain rounded-md shadow-md"
            />
          </UChip>
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
          </div>
        </div>
        <div>
          <div class="flex flex-row gap-2 items-center">
            <p class="font-semibold text-zinc-900 dark:text-white">
              {{ formatCurrency(product.price * product.quantity) }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-6 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-800 shrink-0">
      <div class="flex flex-col gap-2">
        <UInput
          v-model="promoCode"
          placeholder="Código de descuento"
          class="w-full transition-all duration-300"
          size="xl"
          :color="errorPromo ? 'error' : (promo && promoCode === promo.code ? 'success' : 'neutral')"
          :ui="{ trailing: 'pointer-events-auto' }"
        >
          <template #trailing>
            <UButton
              v-if="!promo || promoCode !== promo.code"
              color="neutral"
              variant="ghost"
              label="Aplicar"
              size="sm"
              @click="applyPromotions()"
            />
            <UIcon
              v-else
              name="i-lucide-check-circle-2"
              class="text-green-500 mr-2 size-5"
            />
          </template>
        </UInput>

        <p
          v-if="errorPromo"
          class="text-red-500 dark:text-red-400 text-sm flex items-center gap-1.5 px-1 font-medium transition-all"
        >
          <UIcon
            name="i-lucide-alert-circle"
            class="size-4"
          />
          {{ errorPromo }}
        </p>
        <p
          v-else-if="promo && promoCode === promo.code"
          class="text-green-600 dark:text-green-400 text-sm flex items-center gap-1.5 px-1 font-medium transition-all"
        >
          <UIcon
            name="i-lucide-tag"
            class="size-4"
          />
          Cupón '{{ promo.code }}' aplicado
        </p>
      </div>

      <div class="flex flex-col gap-3">
        <div class="flex justify-between text-sm">
          <p class="text-gray-500 dark:text-gray-400">
            Subtotal <span class="text-xs ml-1">({{ cartStore.totalProducts }} artículos)</span>
          </p>
          <p class="font-medium text-gray-900 dark:text-white">
            {{ formatCurrency(cartStore.subtotal) }}
          </p>
        </div>

        <div class="flex justify-between text-sm">
          <p class="text-gray-500 dark:text-gray-400">
            Envío
          </p>
          <p class="font-medium text-gray-900 dark:text-white">
            {{ getDiscountedShipping(shippingPrice || 0) === 0 ? 'Gratis' : formatCurrency(getDiscountedShipping(shippingPrice || 0)) }}
          </p>
        </div>

        <div
          v-if="promo && promo.apply === 'cartPrice'"
          class="flex justify-between text-sm text-green-600 dark:text-green-400 font-medium"
        >
          <p class="flex items-center gap-1.5">
            <UIcon
              name="i-lucide-badge-percent"
              class="size-4"
            /> Descuento aplicado
          </p>
          <p>
            -{{ formatCurrency(cartStore.subtotal - finalPrice + getDiscountedShipping(shippingPrice || 0)) }}
          </p>
        </div>
      </div>

      <div class="flex justify-between items-end pt-5 border-t border-gray-200 dark:border-gray-800">
        <p class="text-lg font-medium text-gray-900 dark:text-white">
          Total
        </p>
        <div class="text-right">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
            IVA incluido
          </p>
          <p class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            {{ formatCurrency(finalPrice) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
