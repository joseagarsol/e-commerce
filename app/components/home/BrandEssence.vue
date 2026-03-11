<template>
  <!-- Sección Esencia de la Marca -->
  <section class="py-24 md:py-32 bg-[#F7F7F5] dark:bg-zinc-950 overflow-hidden">
    <UContainer>
      <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
        <!-- Text Content -->
        <div class="w-full lg:w-1/2 flex flex-col justify-center order-2 lg:order-1 pt-8 lg:pt-0">
          <h2 class="text-xs font-semibold tracking-[0.4em] uppercase text-primary mb-6">
            Nuestra Filosofía
          </h2>
          <p class="text-3xl md:text-5xl md:leading-[1.15] font-light text-zinc-900 dark:text-white mb-8">
            En la intersección del asfalto y la <span class="font-medium italic text-zinc-500 dark:text-zinc-400">alta costura</span>.
          </p>
          <p class="text-sm md:text-base text-zinc-600 dark:text-zinc-300 font-light leading-relaxed mb-10 max-w-lg tracking-wide">
            Urban Luxury nace con la visión de cuestionar los códigos tradicionales. Hemos diseñado cada prenda eliminando lo superfluo y centrándonos en siluetas limpias, tejidos premium y una estética minimalista. No es solo vestirse; es una declaración de intenciones pensada para quienes dictan sus propias reglas en la ciudad.
          </p>
          <div>
            <UButton
              color="primary"
              variant="outline"
              size="xl"
              class="uppercase tracking-[0.2em] text-xs px-8 py-4 transition-all hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-zinc-900 dark:border-white dark:text-white"
              trailing-icon="i-lucide-arrow-right"
            >
              Conoce la marca
            </UButton>
          </div>
        </div>

        <!-- Image Content -->
        <div class="w-full lg:w-1/2 order-1 lg:order-2">
          <div class="relative w-full aspect-[4/5] md:aspect-[3/4] lg:h-[700px] overflow-hidden rounded-md bg-zinc-200 dark:bg-zinc-800 shadow-2xl">
            <NuxtImg
              src="/brand-essence.png"
              alt="Urban Luxury Brand Essence"
              class="w-full h-full object-cover transition-transform duration-1000 ease-in-out hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </UContainer>
  </section>
</template>
