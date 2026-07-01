<script setup lang="ts">
import confetti from 'canvas-confetti'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const orderId = computed(() => route.query.orderId as string)

onMounted(() => {
  confetti({
    particleCount: 150,
    spread: 75,
    origin: { y: 0.65 }
  })
})
</script>

<template>
  <div class="py-16 px-5 md:py-24 md:px-12 max-w-2xl mx-auto text-center space-y-8">
    <div class="inline-flex items-center justify-center p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 dark:text-emerald-400 rounded-full">
      <UIcon
        name="i-lucide-circle-check"
        class="size-16 animate-bounce"
      />
    </div>

    <div class="space-y-3">
      <h1 class="font-serif italic font-light text-4xl md:text-5xl text-zinc-900 dark:text-white leading-tight">
        ¡Gracias por tu pedido!
      </h1>
      <p class="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
        Tu pedido ha sido recibido y ya se está preparando. Te enviaremos un correo con la confirmación muy pronto.
      </p>
    </div>

    <UCard class="shadow-sm border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 max-w-md mx-auto">
      <div class="text-left space-y-3 font-mono text-sm text-zinc-600 dark:text-zinc-400">
        <div class="flex justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
          <span>ID del Pedido:</span>
          <span class="font-semibold text-zinc-900 dark:text-white">{{ orderId || 'N/A' }}</span>
        </div>
        <div class="flex justify-between pt-1">
          <span>Estado del pago:</span>
          <span class="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <span class="size-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            Confirmado / Pagado
          </span>
        </div>
      </div>
    </UCard>

    <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
      <UButton
        to="/"
        label="Volver a la tienda"
        color="neutral"
        variant="subtle"
        size="lg"
        icon="i-lucide-arrow-left"
        class="cursor-pointer"
      />
      <UButton
        to="/orders"
        label="Ver mis pedidos"
        color="primary"
        size="lg"
        icon="i-lucide-receipt"
        class="cursor-pointer"
      />
    </div>
  </div>
</template>
