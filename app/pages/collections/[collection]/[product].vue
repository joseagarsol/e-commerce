<script setup lang="ts">
definePageMeta({
  layout: 'store'
})

const isWishlisted = ref(false)

const items = [
  '/collection-spring-summer.png',
  '/collection-autumn-winter.png',
  '/collection-essentials.png'
]

const product = {
  name: 'Camiseta oversize blanco mujer',
  price: 100,
  currency: '€',
  description: 'Esta lujosa camiseta oversize redefine el estilo cotidiano con su silueta moderna y relajada. Confeccionada con un algodón de peso medio que ofrece una caída impecable, es la pieza esencial definitiva para un look sofisticado y minimalista.',
  images: items,
  stock: 20
}

const getStockBadge = (stock: number) => {
  if (stock <= 5) {
    return {
      color: 'error' as const,
      label: `Últimas ${stock} unidades`,
      icon: 'i-lucide-octagon-x'
    }
  }
  if (stock <= 25) {
    return {
      color: 'warning' as const,
      label: 'Últimas 25 unidades',
      icon: 'i-lucide-triangle-alert'
    }
  }
  return null
}

const stockBadge = getStockBadge(product.stock)

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

const sizes = ['XS', 'S', 'M', 'L', 'XL']
const selectedSize = ref(sizes[0])
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
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
          v-for="(item, index) in items"
          :key="index"
          class="size-11 opacity-25 hover:opacity-100 transition-opacity"
          :class="{ 'opacity-100': activeIndex === index }"
          @click="select(index)"
        >
          <img
            :src="item"
            width="44"
            height="44"
            class="rounded-lg"
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
          {{ product.price }}{{ product.currency }}
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
        <p class="text-sm text-zinc-900 dark:text-white tracking-wide">
          Talla: {{ selectedSize }}
        </p>
        <div class="flex flex-row gap-2">
          <UButton
            v-for="size in sizes"
            :key="size"
            :variant="selectedSize === size ? 'solid' : 'subtle'"
            :label="size"
            size="xl"
            class="w-16 justify-center"
            @click="selectedSize = size"
          />
        </div>
      </div>
      <div class="flex flex-row gap-2">
        <UButton
          label="Añadir a la cesta"
          size="xl"
          trailing-icon="i-lucide-shopping-cart"
          variant="outline"
          class="w-fit"
        />
        <UButton
          size="xl"
          variant="ghost"
          :color="isWishlisted ? 'error' : 'neutral'"
          class="w-fit"
          @click="isWishlisted = !isWishlisted"
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
          <span>Envío gratuito en pedidos superiores a 150€</span>
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
