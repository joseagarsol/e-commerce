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
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 auto-rows-[300px] md:auto-rows-[350px]">
        <!-- Categoría Principal (Grande - Ocupa 2 columnas y 2 filas en desktop) -->
        <NuxtLink
          to="/collections/mens"
          class="group relative overflow-hidden rounded-xl md:col-span-2 md:row-span-2 flex items-end p-8 md:p-12 cursor-pointer bg-zinc-900"
        >
          <!-- Imagen de fondo alta resolución -->
          <NuxtImg
            src="https://images.unsplash.com/photo-1764593008677-f909daa03c94?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Colección Hombre"
            class="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-[2s] ease-out group-hover:scale-105"
            placeholder
          />
          <!-- Overlay del gradiente -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-90" />
          <!-- Textos y CTA -->
          <div class="relative z-10 flex flex-col gap-3">
            <span class="text-[10px] md:text-xs uppercase tracking-[0.3em] font-light text-white/80">
              Últimas tendencias
            </span>
            <h3 class="text-4xl md:text-6xl font-light text-white tracking-tight">
              Hombre
            </h3>
            <div class="overflow-hidden h-0 group-hover:h-[24px] transition-all duration-500 ease-out mt-2">
              <span class="text-[10px] md:text-xs uppercase tracking-widest text-primary-400 font-medium flex items-center">
                Ver colección
                <UIcon
                  name="i-lucide-arrow-right"
                  class="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-2"
                />
              </span>
            </div>
          </div>
        </NuxtLink>
        <!-- Categoría Secundaria 1 (Cuadrante superior derecho) -->
        <NuxtLink
          to="/collections/womens"
          class="group relative overflow-hidden rounded-xl flex items-end p-6 md:p-8 cursor-pointer bg-zinc-900"
        >
          <NuxtImg
            src="https://images.unsplash.com/photo-1538329972958-465d6d2144ed?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Colección Mujer"
            class="absolute inset-0 w-full h-full object-cover object-[center_20%] transition-transform duration-[2s] ease-out group-hover:scale-105"
            placeholder
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-90" />
          <div class="relative z-10 flex flex-col gap-1">
            <h3 class="text-2xl md:text-4xl font-light text-white">
              Mujer
            </h3>
            <div class="overflow-hidden h-0 group-hover:h-[20px] transition-all duration-500 ease-out mt-2">
              <span class="text-[10px] uppercase tracking-widest text-primary-400 font-medium flex items-center">
                Explorar
                <UIcon
                  name="i-lucide-arrow-right"
                  class="w-3 h-3 ml-2 transition-transform duration-300 group-hover:translate-x-2"
                />
              </span>
            </div>
          </div>
        </NuxtLink>
        <!-- Categoría Secundaria 2 (Cuadrante inferior derecho) -->
        <NuxtLink
          to="/collections/accessories"
          class="group relative overflow-hidden rounded-xl flex items-end p-6 md:p-8 cursor-pointer bg-zinc-900"
        >
          <NuxtImg
            src="https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Accesorios"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
            placeholder
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
          <div class="relative z-10 flex flex-col gap-1">
            <h3 class="text-2xl md:text-3xl font-light text-white">
              Accesorios
            </h3>
            <div class="overflow-hidden h-0 group-hover:h-[20px] transition-all duration-500 ease-out mt-2">
              <span class="text-[10px] uppercase tracking-widest text-primary-400 font-medium flex items-center">
                Complementos
                <UIcon
                  name="i-lucide-arrow-right"
                  class="w-3 h-3 ml-2 transition-transform duration-300 group-hover:translate-x-2"
                />
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </ucontainer>
  </section>
</template>
