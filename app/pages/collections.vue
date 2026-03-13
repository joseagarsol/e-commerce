<script setup lang="ts">
const collections = [
  {
    title: 'Primavera Verano 2026',
    image: '/collection-spring-summer.png',
    link: '/collections/primavera-verano-2026'
  },
  {
    title: 'Otoño Invierno 2025',
    image: '/collection-autumn-winter.png',
    link: '/collections/otono-invierno-2025'
  },
  {
    title: 'Esenciales',
    image: '/collection-essentials.png',
    link: '/collections/esenciales'
  }
]
</script>

<template>
  <section class="py-12 px-5 md:py-16 md:px-12">
    <h2 class="font-serif italic font-light text-4xl md:text-5xl text-zinc-900 dark:text-white leading-tight">
      Colecciones
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
      <NuxtLink
        v-for="collection in collections"
        :key="collection.link"
        :to="collection.link"
        class="group collection-card flex flex-col gap-6"
      >
        <div class="relative overflow-hidden rounded-md shadow-lg aspect-[3/4]">
          <NuxtImg
            :src="collection.image"
            :alt="`Colección ${collection.title}`"
            class="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform duration-1000 ease-out"
          />
        </div>
        <div>
          <p class="text-center text-3xl font-serif font-normal text-zinc-900 dark:text-white tracking-wide">
            {{ collection.title }}
          </p>
        </div>
        <div class="flex justify-center">
          <UButton
            label="Ver Colección"
            color="neutral"
            variant="outline"
            size="lg"
            class="group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-zinc-900 transition-colors duration-300"
          />
        </div>
      </NuxtLink>
    </div>
  </section>
</template>
