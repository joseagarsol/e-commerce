<script setup lang="ts">
useSeoMeta({
  title: 'Política de Envíos y Devoluciones',
  description: 'Consulta los métodos de entrega, plazos de envío y condiciones de devolución en Urban Luxury.'
})
</script>

<template>
  <div class="py-16 px-5 md:py-24 md:px-12 max-w-3xl mx-auto space-y-8">
    <div class="space-y-2 border-b border-zinc-100 dark:border-zinc-800 pb-6">
      <h1 class="font-serif italic font-light text-4xl md:text-5xl text-zinc-900 dark:text-white leading-tight">
        Envíos y Devoluciones
      </h1>
      <p class="text-xs text-zinc-400 font-mono tracking-widest uppercase">
        Última actualización: 1 de julio de 2026
      </p>
    </div>

    <div class="space-y-6 text-zinc-600 dark:text-zinc-300 leading-relaxed text-sm md:text-base">
      <p>
        Queremos asegurarnos de que tu experiencia de compra sea excelente. A continuación te detallamos las condiciones, costes y plazos de entrega para nuestros envíos, así como nuestro procedimiento de devoluciones.
      </p>

      <section class="space-y-3">
        <h2 class="text-xl font-serif italic text-zinc-900 dark:text-white mt-8">
          1. Métodos y Costes de Envío
        </h2>
        <p>
          Ofrecemos diferentes opciones para adaptarnos a tus necesidades:
        </p>
        <ul class="list-disc pl-5 space-y-2">
          <li><strong>Envío Estándar (3.99€):</strong> Entrega en 2-3 días laborables. Gratuito para pedidos superiores a 25€ (o con cupones aplicables).</li>
          <li><strong>Envío Express (9.99€):</strong> Entrega rápida en 24-48 horas laborables.</li>
          <li><strong>Recogida en Tienda (Gratis):</strong> Puedes recoger tu pedido en nuestra tienda física de Málaga en un plazo de 24 horas laborables.</li>
        </ul>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-serif italic text-zinc-900 dark:text-white mt-8">
          2. Zonas de Entrega
        </h2>
        <p>
          Actualmente realizamos envíos nacionales e internacionales a España, Francia e Italia. Todos nuestros pedidos se empaquetan con cajas biodegradables y empaques sostenibles para proteger el medio ambiente.
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-serif italic text-zinc-900 dark:text-white mt-8">
          3. Política de Devoluciones
        </h2>
        <p>
          Dispones de un plazo de <strong>30 días naturales</strong> desde la recepción de tu pedido para solicitar cualquier cambio o devolución de forma gratuita. Para poder realizar la devolución, el artículo debe estar sin usar, con su etiqueta original intacta y en el mismo empaque en el que fue entregado.
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
