<script setup lang="ts">
useSeoMeta({
  title: 'Términos de Servicio',
  description: 'Revisa las condiciones y términos de uso de la plataforma Urban Luxury.'
})
</script>

<template>
  <div class="py-16 px-5 md:py-24 md:px-12 max-w-3xl mx-auto space-y-8">
    <div class="space-y-2 border-b border-zinc-100 dark:border-zinc-800 pb-6">
      <h1 class="font-serif italic font-light text-4xl md:text-5xl text-zinc-900 dark:text-white leading-tight">
        Términos de Servicio
      </h1>
      <p class="text-xs text-zinc-400 font-mono tracking-widest uppercase">
        Última actualización: 1 de julio de 2026
      </p>
    </div>

    <div class="space-y-6 text-zinc-600 dark:text-zinc-300 leading-relaxed text-sm md:text-base">
      <p>
        Bienvenido a <strong>Urban Luxury</strong>. Al acceder a nuestro sitio web y realizar compras, aceptas estar sujeto a los siguientes Términos y Condiciones. Te recomendamos leerlos atentamente antes de utilizar nuestros servicios.
      </p>

      <section class="space-y-3">
        <h2 class="text-xl font-serif italic text-zinc-900 dark:text-white mt-8">
          1. Condiciones Generales de Compra
        </h2>
        <p>
          Cualquier pedido realizado en Urban Luxury está sujeto a la disponibilidad de las prendas y a la aceptación por nuestra parte. Nos reservamos el derecho de cancelar o rechazar cualquier compra por motivos de stock, inconsistencia de precios o sospecha de fraude.
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-serif italic text-zinc-900 dark:text-white mt-8">
          2. Precios y Pagos
        </h2>
        <p>
          Los precios indicados en el sitio web están en Euros (€) e incluyen los impuestos aplicables (IVA), salvo indicación en contrario. Los costes de envío se desglosarán de forma explícita en el resumen del pedido durante el Checkout antes de formalizar el pago. El pago de las compras se realiza a través de las pasarelas seguras habilitadas.
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-serif italic text-zinc-900 dark:text-white mt-8">
          3. Envíos y Entregas
        </h2>
        <p>
          Los plazos de entrega estimados varían según el método de envío seleccionado durante el proceso de compra (Estándar o Express). No nos hacemos responsables de retrasos derivados de causas de fuerza mayor o incidencias ajenas a nuestra gestión logística.
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-serif italic text-zinc-900 dark:text-white mt-8">
          4. Propiedad Intelectual
        </h2>
        <p>
          Todos los diseños, logotipos, imágenes, textos y elementos visuales contenidos en este sitio web son propiedad exclusiva de Urban Luxury y están protegidos por las leyes de propiedad intelectual internacionales. Queda prohibida su reproducción o distribución sin consentimiento previo.
        </p>
      </section>
    </div>

    <div class="pt-8 border-t border-zinc-100 dark:border-zinc-800 flex justify-center">
      <UButton
        to="/"
        label="Volver a la tienda"
        color="neutral"
        variant="subtle"
        size="md"
        icon="i-lucide-arrow-left"
        class="cursor-pointer"
      />
    </div>
  </div>
</template>
