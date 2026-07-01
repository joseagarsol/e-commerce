<script setup lang="ts">
useSeoMeta({
  title: 'Política de Privacidad',
  description: 'Conoce cómo tratamos y protegemos tus datos personales en Urban Luxury.'
})
</script>

<template>
  <div class="py-16 px-5 md:py-24 md:px-12 max-w-3xl mx-auto space-y-8">
    <div class="space-y-2 border-b border-zinc-100 dark:border-zinc-800 pb-6">
      <h1 class="font-serif italic font-light text-4xl md:text-5xl text-zinc-900 dark:text-white leading-tight">
        Política de Privacidad
      </h1>
      <p class="text-xs text-zinc-400 font-mono tracking-widest uppercase">
        Última actualización: 1 de julio de 2026
      </p>
    </div>

    <div class="space-y-6 text-zinc-600 dark:text-zinc-300 leading-relaxed text-sm md:text-base">
      <p>
        En <strong>Urban Luxury</strong>, valoramos la confianza que depositas en nosotros al compartir tus datos personales. Esta Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos y protegemos tu información cuando visitas nuestro sitio web o realizas una compra.
      </p>

      <section class="space-y-3">
        <h2 class="text-xl font-serif italic text-zinc-900 dark:text-white mt-8">
          1. Información que recopilamos
        </h2>
        <p>
          Recopilamos información necesaria para gestionar tus pedidos y ofrecerte la mejor experiencia de compra posible:
        </p>
        <ul class="list-disc pl-5 space-y-1">
          <li><strong>Datos de contacto e identidad:</strong> Nombre, apellidos, dirección de correo electrónico, número de teléfono y dirección de envío.</li>
          <li><strong>Información de la cuenta:</strong> Historial de pedidos, credenciales de inicio de sesión y preferencias de compra.</li>
          <li><strong>Datos de pago:</strong> Método de pago utilizado (tarjeta, PayPal, etc.). Toda la información de pago se procesa de forma encriptada a través de pasarelas seguras.</li>
        </ul>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-serif italic text-zinc-900 dark:text-white mt-8">
          2. Uso de tus datos
        </h2>
        <p>
          Utilizamos tu información personal exclusivamente para los siguientes fines:
        </p>
        <ul class="list-disc pl-5 space-y-1">
          <li>Procesar, preparar y enviar los pedidos realizados en el Checkout.</li>
          <li>Gestionar tu cuenta de usuario y permitirte acceder al historial de compras.</li>
          <li>Comunicarte actualizaciones sobre el estado de tus envíos o resolver cualquier incidencia.</li>
          <li>Cumplir con las obligaciones legales y fiscales de facturación.</li>
        </ul>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-serif italic text-zinc-900 dark:text-white mt-8">
          3. Conservación y seguridad de los datos
        </h2>
        <p>
          Tus datos se almacenan en servidores seguros y solo se conservan durante el tiempo estrictamente necesario para cumplir con los fines para los que fueron recopilados, o conforme lo exija la legislación aplicable. Implementamos medidas técnicas y organizativas para proteger tus datos frente a accesos no autorizados o pérdidas accidentales.
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-serif italic text-zinc-900 dark:text-white mt-8">
          4. Tus derechos
        </h2>
        <p>
          Tienes derecho a acceder, rectificar, limitar el tratamiento o solicitar la eliminación de tus datos personales en cualquier momento. Para ejercer estos derechos o realizar cualquier consulta sobre privacidad, puedes ponerte en contacto con nosotros a través de nuestro formulario o correo electrónico.
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
