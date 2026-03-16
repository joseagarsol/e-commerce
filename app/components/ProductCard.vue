<script setup lang="ts">
// Props para el futuro
/*
defineProps<{
  title: string
  price: string
  image: string
}>()
*/
</script>

<template>
  <div class="group flex flex-col gap-4">
    <div class="relative overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-900 aspect-[3/4]">
      <NuxtImg
        src="/product-tshirt.png"
        alt="Camiseta Oversize Premium"
        class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <!-- Badge opcional -->
      <div class="absolute top-3 left-3">
        <span class="px-2 py-1 text-[10px] uppercase tracking-widest bg-white/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-white backdrop-blur-sm rounded-sm font-medium">
          Novedad
        </span>
      </div>
    </div>

    <div class="flex justify-between items-start px-1">
      <div class="flex flex-col gap-0.5">
        <h3 class="text-sm font-light uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
          Camiseta Oversize Premium
        </h3>
        <p class="text-xs font-serif italic text-zinc-500 dark:text-zinc-400">
          85,00 €
        </p>
      </div>

      <UPopover>
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
                v-for="size in ['S', 'M', 'L']"
                :key="size"
                :label="size"
                variant="outline"
                size="xs"
                color="neutral"
              />
            </div>
          </div>
        </template>
      </UPopover>
    </div>
  </div>
</template>
