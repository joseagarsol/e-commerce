<template>
  <!-- Hero Section con altura dinámica total (h-dvh) -->
  <section class="relative h-dvh w-full overflow-hidden">
    <!-- Fondo: Imagen con Overlay para legibilidad -->
    <div class="absolute inset-0 z-0 bg-zinc-950">
      <NuxtImg
        src="LandingImg_V2.jpg"
        alt="Urban Luxury Hero"
        class="w-full h-full object-cover object-[center_top]"
        placeholder
        loading="eager"
        format="webp"
        quality="100"
      />
      <!-- Overlay direccional para destacar el texto a la izquierda -->
      <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div class="absolute inset-0 bg-black/10 bg-gradient-to-b from-transparent to-black/50" />
    </div>

    <!-- Contenido Central -->
    <div class="relative h-full flex flex-col items-center justify-center text-white dark:text-white px-4 text-center container mx-auto">
      <!-- Temporada -->
      <p class="text-xs md:text-sm font-light tracking-[0.8em] uppercase mb-6 animate-fade-in opacity-0">
        Otoño Invierno 2026
      </p>

      <!-- Título Principal -->
      <h1 class="text-4xl md:text-7xl font-extralight tracking-tighter uppercase leading-[0.9] mb-12 animate-fade-in-up opacity-0">
        Elegancia Callejera<br>
        <span class="font-bold tracking-widest text-primary-400">Redefinida</span>
      </h1>

      <!-- Call to Action -->
      <div class="flex flex-col sm:flex-row gap-6 mt-4 animate-fade-in opacity-0 [animation-delay:800ms]">
        <UButton
          size="xl"
          label="Ver Colección"
          to="/collections/otono-invierno-2025"
          color="primary"
          class="px-10 py-4 uppercase tracking-[0.2em] text-xs transition-all hover:scale-105 text-white"
        />
        <UButton
          size="xl"
          to="/about"
          label="Descubrir más"
          variant="outline"
          color="neutral"
          class="px-10 py-4 uppercase tracking-[0.2em] text-xs transition-all hover:scale-105 hover:bg-white hover:text-zinc-900"
        />
      </div>
      <!-- Premium Marquee Ticker -->
      <div class="mt-16 w-full max-w-4xl overflow-hidden rounded-full border border-white/10 bg-white/5 backdrop-blur-md py-3 md:py-4 text-[10px] md:text-xs tracking-[0.25em] font-light animate-fade-in opacity-0 [animation-delay:1000ms]">
        <UMarquee
          :overlay="false"
          :pause-on-hover="true"
          style="--duration: 30s;"
          class="flex items-center"
        >
          <div class="flex items-center gap-16 md:gap-24 mr-16 md:mr-24">
            <div class="flex items-center gap-3 text-white/70 hover:text-white transition-colors cursor-default">
              <UIcon
                name="i-lucide-globe"
                class="w-4 h-4 text-primary-400"
              />
              <span class="uppercase">Envío gratuito mundial</span>
            </div>
            <div class="flex items-center gap-3 text-white/70 hover:text-white transition-colors cursor-default">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
                <span class="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
              </span>
              <span class="uppercase">Nueva colección FW26 disponible</span>
            </div>
            <div class="flex items-center gap-3 text-white/70 hover:text-white transition-colors cursor-default">
              <UIcon
                name="i-lucide-map-pin"
                class="w-4 h-4 text-primary-400"
              />
              <span class="uppercase">Diseñado en Málaga</span>
            </div>
          </div>
        </UMarquee>
      </div>
    </div>

    <!-- Indicador de Scroll -->
    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 text-white">
      <span class="text-[10px] uppercase tracking-[0.3em] font-light">Explorar</span>
      <div class="w-[1px] h-12 bg-white/30 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-full bg-white animate-scroll-line" />
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scrollLine {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

.animate-fade-in {
  animation: fadeIn 1.5s ease-out forwards;
}

.animate-fade-in-up {
  animation: fadeInUp 1.2s ease-out forwards;
  animation-delay: 400ms;
}

.animate-scroll-line {
  animation: scrollLine 2s infinite cubic-bezier(0.65, 0, 0.35, 1);
}

.opacity-0 {
  opacity: 0;
}
</style>
