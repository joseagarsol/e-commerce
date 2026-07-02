<script setup lang="ts">
import type { Collection } from '~/types/collection'

const { data: collections, error } = await useFetch<Collection[]>('/api/collections')
</script>

<template>
  <section class="py-12 px-5 md:py-16 md:px-12">
    <UContainer>
      <h2 class="font-serif italic font-light text-4xl md:text-5xl text-zinc-900 dark:text-white leading-tight">
        Colecciones
      </h2>

      <div
        v-if="error"
        class="text-center py-20 mt-12 border border-dashed border-red-200 dark:border-red-900/30 rounded-lg bg-red-50/50 dark:bg-red-950/10"
      >
        <p class="text-xl text-red-600 dark:text-red-400 font-light font-serif italic">
          Hubo un problema al cargar las colecciones.
        </p>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
          Por favor, inténtalo de nuevo más tarde o recarga la página.
        </p>
      </div>

      <div
        v-else-if="collections && collections.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
      >
        <NuxtLink
          v-for="collection in collections"
          :key="collection.id"
          :to="'/collections/'+collection.id"
          class="group collection-card flex flex-col gap-6 h-full"
        >
          <div class="relative overflow-hidden rounded-md shadow-lg aspect-[3/4]">
            <NuxtImg
              :src="collection.imageUrl || '/collection-essentials.png'"
              :alt="`Colección ${collection.name}`"
              class="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
          </div>
          <div>
            <p class="text-center text-3xl font-serif font-normal text-zinc-900 dark:text-white tracking-wide">
              {{ collection.name }}
            </p>
          </div>
          <div class="flex justify-center mt-auto">
            <UButton
              label="Ver Colección"
              color="neutral"
              variant="outline"
              size="xl"
              class="cursor-pointer hover:bg-zinc-900 hover:text-white group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-zinc-900 transition-colors duration-300"
            />
          </div>
        </NuxtLink>
      </div>

      <div
        v-else
        class="text-center py-20 mt-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg"
      >
        <p class="text-xl text-zinc-500 dark:text-zinc-400 font-light font-serif italic">
          No hay colecciones disponibles en este momento.
        </p>
        <p class="text-sm text-zinc-400 dark:text-zinc-500 mt-2">
          ¡Vuelve pronto para descubrir nuestras novedades!
        </p>
      </div>
    </UContainer>
  </section>
</template>
