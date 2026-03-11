<script setup lang="ts">
defineProps<{
  items: Array<{
    id: number
    title: string
    category: string
    price: string
    image: string
  }>
}>()
</script>

<template>
  <!-- Sección de Productos Destacados -->
  <section class="px-5 py-24">
    <div class="flex flex-col gap-2 md:flex-row md:justify-between">
      <div class="flex flex-col gap-2">
        <h2 class="font-serif italic font-light text-4xl md:text-5xl text-zinc-900 dark:text-white leading-tight">
          Nuestras Novedades
        </h2>
        <p class="font-sans font-light text-[10px] md:text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 mt-1">
          Curated collection · Otoño Invierno 2026
        </p>
      </div>
      <div class="flex items-end">
        <UButton
          color="primary"
          variant="link"
          size="sm"
          trailing-icon="i-lucide-move-right"
          class="tracking-[0.2em] text-xs cursor-pointer"
        >
          Ver todas las colecciones
        </UButton>
      </div>
    </div>
    <UCarousel
      v-slot="{ item }"
      loop
      wheel-gestures
      :items="items"
      :ui="{ item: 'basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4 pt-8' }"
      class="mt-6 -mx-2"
    >
      <div class="mx-2 flex flex-col cursor-pointer product-card group">
        <div class="relative overflow-hidden rounded-lg aspect-[4/5] bg-zinc-100 dark:bg-zinc-900 mb-4">
          <NuxtImg
            :src="item.image"
            :alt="item.title"
            class="w-full h-full object-cover transition-transform duration-700 ease-out"
            loading="lazy"
          >
            <!-- Overlay interactivo -->
            <div class="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 flex flex-col justify-end p-4 product-overlay">
              <UButton
                color="neutral"
                class="w-full justify-center shadow-xl truncate tracking-widest uppercase text-[10px] transform translate-y-2 opacity-0 transition-all duration-300 ease-out product-button"
              >
                Ver detalles
              </UButton>
            </div>
          </nuxtimg>
        </div>
        <div class="text-center md:text-left">
          <p class="text-[10px] uppercase tracking-widest text-neutral-500 mb-1">
            {{ item.category }}
          </p>
          <h3 class="text-sm font-medium tracking-wide dark:text-white mb-1">
            {{ item.title }}
          </h3>
          <p class="text-sm font-light text-primary">
            {{ item.price }}
          </p>
        </div>
      </div>
    </UCarousel>
  </section>
</template>

<style scoped>
.product-card:hover img {
  transform: scale(1.05);
}

.product-card:hover .product-overlay {
  opacity: 1 !important;
}

.product-card:hover .product-button {
  opacity: 1 !important;
}
</style>
