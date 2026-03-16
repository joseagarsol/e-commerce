<template>
  <UContainer>
    <div class="py-12 md:py-24">
      <section class="min-h-[60vh] flex flex-col items-center justify-center text-center px-5 mb-24">
        <h1 class="font-serif italic font-light text-5xl md:text-7xl text-zinc-900 dark:text-white leading-tight mb-6 tracking-wide">
          Redefiniendo la <br class="hidden md:block"> Elegancia Callejera
        </h1>
        <p class="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto text-lg md:text-xl font-light tracking-wide leading-relaxed">
          Urban Luxury nace de la colisión entre la energía del asfalto y la sofisticación de la alta costura. Diseñamos piezas para aquellos que buscan la excelencia en el día a día.
        </p>
      </section>

      <section class="max-w-7xl mx-auto px-5 mb-32">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
          <div class="relative aspect-[4/5] rounded-lg overflow-hidden order-2 md:order-1">
            <NuxtImg
              src="/brand-essence.png"
              alt="Visión de la marca Urban Luxury"
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-linear hover:scale-110"
            />
          </div>
          <div class="flex flex-col gap-6 order-1 md:order-2">
            <h2 class="text-xs uppercase tracking-[0.3em] font-medium text-zinc-400">
              Nuestro Origen
            </h2>
            <h3 class="font-serif italic text-3xl md:text-4xl text-zinc-900 dark:text-white leading-tight">
              Nacidos en Málaga,<br>pensados para el mundo.
            </h3>
            <p class="text-zinc-500 dark:text-zinc-400 font-light leading-loose">
              Lo que comenzó como un pequeño proyecto experimental en el sur de España, rápidamente evolucionó hacia una visión más ambiciosa. Queríamos crear la ropa que nosotros mismos deseábamos usar: prendas con la comodidad del streetwear pero confeccionadas con la atención al detalle de una casa de lujo.
            </p>
            <p class="text-zinc-500 dark:text-zinc-400 font-light leading-loose">
              Cada colección es un testimonio de nuestra devoción por los patrones perfectos, los tejidos premium y la estética minimalista. No seguimos tendencias, creamos básicos elevados que perduran en el tiempo.
            </p>
            <div class="mt-4 group">
              <UButton
                label="Ver Colecciones"
                to="/collections"
                color="neutral"
                variant="outline"
                size="lg"
              />
            </div>
          </div>
        </div>
      </section>

      <section class="bg-zinc-50 dark:bg-zinc-900/50 py-24 px-5">
        <div class="max-w-7xl mx-auto">
          <h2 class="text-center font-serif italic text-3xl text-zinc-900 dark:text-white mb-16">
            Nuestros Pilares
          </h2>
          <USeparator class="mt-12 mb-12" />
          <div class="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div class="flex flex-col gap-4">
              <span class="font-serif text-4xl text-zinc-300 dark:text-zinc-800">01</span>
              <h4 class="text-sm uppercase tracking-widest font-medium text-zinc-900 dark:text-white">
                Diseño Atemporal
              </h4>
              <p class="text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
                Renunciamos a la moda efímera. Nuestras siluetas están diseñadas para trascender temporadas y convertirse en el núcleo fundamental de tu armario.
              </p>
            </div>
            <div class="flex flex-col gap-4">
              <span class="font-serif text-4xl text-zinc-300 dark:text-zinc-800">02</span>
              <h4 class="text-sm uppercase tracking-widest font-medium text-zinc-900 dark:text-white">
                Materiales Premium
              </h4>
              <p class="text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
                Seleccionamos meticulosamente cada tejido, priorizando algodones de alto gramaje y fibras sostenibles que garantizan durabilidad y un tacto excepcional.
              </p>
            </div>
            <div class="flex flex-col gap-4">
              <span class="font-serif text-4xl text-zinc-300 dark:text-zinc-800">03</span>
              <h4 class="text-sm uppercase tracking-widest font-medium text-zinc-900 dark:text-white">
                Producción Ética
              </h4>
              <p class="text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
                Trabajamos exclusivamente con talleres locales y fabricantes europeos que aseguran unas condiciones laborales justas y un impacto medioambiental reducido.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </UContainer>
</template>
