<script setup lang="ts">
import type { Collection } from '~/types/collection'

const { data: collections } = await useFetch<Collection[]>('/api/collections')
</script>

<template>
  <!-- Sección Bento Grid de Categorías -->
  <section class="py-24 md:py-32">
    <UContainer>
      <!-- Encabezado de la sección -->
      <div class="flex flex-col gap-2 mb-12">
        <h2 class="font-serif italic font-light text-4xl md:text-5xl text-zinc-900 dark:text-white leading-tight">
          Colecciones
        </h2>
        <p class="font-sans font-light text-[10px] md:text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 mt-1">
          Descubre nuestros universos
        </p>
      </div>
      <!-- Bento Grid Container -->
      <div
        v-if="collections && collections.length"
        class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 auto-rows-[300px] md:auto-rows-[350px]"
      >
        <!-- Colección Principal (Grande - Ocupa 2 columnas y 2 filas en desktop) -->
        <NuxtLink
          v-for="(col, index) in collections.slice(0, 3)"
          :key="col.id"
          :to="`/collections/${col.slug}`"
          :class="[
            'group relative overflow-hidden rounded-xl flex items-end cursor-pointer bg-zinc-900',
            index === 0 ? 'md:col-span-2 md:row-span-2 p-8 md:p-12' : 'p-6 md:p-8'
          ]"
        >
          <!-- Imagen de fondo alta resolución -->
          <NuxtImg
            :src="col.imageUrl || '/product-tshirt.png'"
            :alt="col.name"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
            :class="index === 0 ? 'object-top' : (index === 1 ? 'object-[center_20%]' : 'object-center')"
            placeholder
          />
          <!-- Overlay del gradiente -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-90" />
          <!-- Textos y CTA -->
          <div class="relative z-10 flex flex-col gap-3">
            <span
              v-if="index === 0"
              class="text-[10px] md:text-xs uppercase tracking-[0.3em] font-light text-white/80"
            >
              Últimas tendencias
            </span>
            <h3
              :class="[
                'font-light text-white tracking-tight',
                index === 0 ? 'text-4xl md:text-6xl' : 'text-2xl md:text-4xl'
              ]"
            >
              {{ col.name }}
            </h3>
            <div class="overflow-hidden h-0 group-hover:h-[24px] transition-all duration-500 ease-out mt-2">
              <span class="text-[10px] md:text-xs uppercase tracking-widest text-primary-400 font-medium flex items-center">
                {{ index === 0 ? 'Ver colección' : 'Explorar' }}
                <UIcon
                  name="i-lucide-arrow-right"
                  class="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-2"
                />
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </UContainer>
  </section>
</template>
