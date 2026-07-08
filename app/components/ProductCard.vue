<script setup lang="ts">
import type { CartItem, Product, Size } from '~/types/product'

interface Props {
  product: Product
}

const props = defineProps<Props>()

const toast = useToast()
const route = useRoute()
const cartStore = useCartStore()
const targetLink = computed(() => `/collections/${route.params.collection || props.product.collectionSlug || 'all'}/${props.product.slug}`)

const handleAddToCart = (size: Size | null = null) => {
  const cartItem: CartItem = {
    ...props.product,
    selectedSize: size,
    quantity: 1
  }
  cartStore.addProduct(cartItem)

  toast.add({
    title: 'Producto añadido a la cesta',
    icon: 'i-lucide-circle-check',
    color: 'primary',
    progress: false
  })
}

const isSizeSoldOut = (size: Size) => {
  const qtyInCart = cartStore.getItemQuantity(props.product.id, size)
  const stockAvailable = props.product.stockBySize?.[size] ?? 0
  return stockAvailable <= qtyInCart
}

const isProductSoldOut = () => {
  const qtyInCart = cartStore.getItemQuantity(props.product.id, null)
  return props.product.stock <= qtyInCart
}
</script>

<template>
  <div class="group flex flex-col gap-4">
    <div class="relative overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-900 aspect-[3/4]">
      <NuxtLink :to="targetLink">
        <NuxtImg
          :src="props.product.images[0] || '/product-tshirt.png'"
          :alt="props.product.name"
          class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          format="webp"
          quality="80"
          loading="lazy"
          sizes="xs:100vw sm:50vw md:33vw lg:25vw"
        />
      </NuxtLink>
      <div class="absolute top-3 left-3">
        <UBadge
          label="Novedad"
        />
      </div>
    </div>

    <div class="flex justify-between items-start px-1">
      <div class="flex flex-col gap-0.5">
        <NuxtLink :to="targetLink">
          <h3 class="text-sm font-light uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
            {{ props.product.name }}
          </h3>
        </NuxtLink>
        <p class="text-xs font-serif italic text-zinc-500 dark:text-zinc-400">
          {{ formatCurrency(props.product.price) }}
        </p>
      </div>

      <UPopover v-if="props.product.availableSizes">
        <UButton
          icon="i-lucide-circle-plus"
          size="sm"
          variant="ghost"
          color="neutral"
          class="lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300"
        />
        <template #content>
          <div class="p-4 w-48 text-center">
            <p class="text-xs uppercase tracking-widest mb-3">
              Seleccionar Talla
            </p>
            <div class="grid grid-cols-3 gap-2">
              <UButton
                v-for="size in props.product.availableSizes"
                :key="size"
                :label="size"
                variant="outline"
                size="xs"
                color="neutral"
                :disabled="isSizeSoldOut(size)"
                @click="handleAddToCart(size)"
              />
            </div>
          </div>
        </template>
      </UPopover>
      <UButton
        v-else
        icon="i-lucide-circle-plus"
        size="sm"
        variant="ghost"
        color="neutral"
        class="lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300"
        :disabled="isProductSoldOut()"
        @click="handleAddToCart()"
      />
    </div>
  </div>
</template>
