<script setup lang="ts">
// En el futuro aquí vendrá la lógica de filtros y fetch de productos
</script>

<template>
  <div class="py-12 px-5 md:py-16 md:px-12">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <div class="space-y-2">
        <h1 class="font-serif italic font-light text-4xl md:text-5xl text-zinc-900 dark:text-white leading-tight">
          Todos los Productos
        </h1>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 max-w-md tracking-wide">
          Explora nuestra selección completa de piezas esenciales y cápsulas limitadas.
        </p>
      </div>

      <div class="flex items-center gap-4">
        <span class="text-[10px] uppercase tracking-[0.2em] text-zinc-400">Filtrar por:</span>
        <USelectMenu
          :items="['Novedades', 'Precio: Menor a Mayor', 'Precio: Mayor a Menor']"
          placeholder="Relevancia"
          variant="none"
          class="border-b border-zinc-200 dark:border-zinc-800 text-xs uppercase tracking-widest w-full"
          :search-input="false"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
      <ProductCard
        v-for="n in 8"
        :key="n"
      />
    </div>
  </div>
</template>
