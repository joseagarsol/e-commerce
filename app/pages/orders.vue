<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

useSeoMeta({
  title: 'Mis Pedidos',
  robots: 'noindex, nofollow'
})

const { data: orders, error, pending } = await useFetch('/api/orders')
</script>

<template>
  <div class="py-12 px-5 md:py-16 md:px-12 max-w-5xl mx-auto space-y-10">
    <div class="space-y-2 mb-4">
      <h1 class="font-serif italic font-light text-4xl md:text-5xl text-zinc-900 dark:text-white leading-tight">
        Mis Pedidos
      </h1>
      <p class="text-sm text-zinc-500 dark:text-zinc-400 tracking-wide">
        Consulta el estado y los detalles de tus últimas compras.
      </p>
    </div>
    <div
      v-if="pending"
      class="space-y-6"
    >
      <UCard
        v-for="i in 3"
        :key="i"
        class="border border-zinc-100 dark:border-zinc-800"
      >
        <div class="space-y-4">
          <div class="flex justify-between">
            <USkeleton class="h-6 w-48" />
            <USkeleton class="h-6 w-24" />
          </div>
          <USkeleton class="h-10 w-full" />
        </div>
      </UCard>
    </div>
    <div
      v-else-if="error"
      class="text-center py-10"
    >
      <p class="text-zinc-500 dark:text-zinc-400">
        Hubo un problema al cargar tus pedidos. Por favor, inténtalo de nuevo.
      </p>
    </div>
    <div
      v-else-if="!orders || orders.length === 0"
      class="text-center py-16 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl space-y-4"
    >
      <div class="inline-flex p-4 bg-zinc-50 dark:bg-zinc-900 text-zinc-400 rounded-full">
        <UIcon
          name="i-lucide-package-open"
          class="size-12"
        />
      </div>
      <div class="space-y-1">
        <p class="text-lg font-medium text-zinc-900 dark:text-white">
          Aún no tienes pedidos
        </p>
        <p class="text-sm text-zinc-500 dark:text-zinc-400">
          Tu historial de compras aparecerá aquí en cuanto realices un pedido.
        </p>
      </div>
      <UButton
        to="/"
        label="Explorar catálogo"
        color="primary"
        class="cursor-pointer"
      />
    </div>
    <div
      v-else
      class="space-y-6"
    >
      <UCard
        v-for="order in orders"
        :key="order.id"
        class="border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all shadow-sm"
      >
        <template #header>
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div class="space-y-1">
              <p class="text-xs text-zinc-400 font-mono tracking-widest uppercase">
                Pedido: {{ order.id }}
              </p>
              <p class="text-xs text-zinc-500">
                <NuxtTime
                  :datetime="new Date(order.createdAt.replace(' ', 'T') + 'Z')"
                  locale="es-ES"
                  year="numeric"
                  month="long"
                  day="numeric"
                  hour="2-digit"
                  minute="2-digit"
                />
              </p>
            </div>
            <UBadge
              :color="getStatusBadge(order.status).color"
              variant="soft"
              size="md"
            >
              {{ getStatusBadge(order.status).label }}
            </UBadge>
          </div>
        </template>
        <div class="space-y-4 py-2">
          <div class="text-sm font-semibold text-zinc-400 uppercase tracking-widest pb-3 border-b border-zinc-100 dark:border-zinc-800">
            Productos
          </div>
          <div>
            <div
              v-for="(item, index) in order.items"
              :key="item.productId"
              class="relative py-4 flex gap-4 items-center text-sm"
            >
              <!-- Imagen del producto -->
              <NuxtLink
                v-if="item.collectionSlug"
                :to="`/collections/${item.collectionSlug}/${item.productSlug}`"
                class="relative overflow-hidden rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 size-16 sm:size-20 flex-shrink-0 group cursor-pointer block"
              >
                <NuxtImg
                  :src="item.productImage || '/product-tshirt.png'"
                  :alt="item.productName || 'Producto'"
                  class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  format="webp"
                  quality="80"
                  loading="lazy"
                />
              </NuxtLink>
              <div
                v-else
                class="relative overflow-hidden rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 size-16 sm:size-20 flex-shrink-0"
              >
                <NuxtImg
                  :src="item.productImage || '/product-tshirt.png'"
                  :alt="item.productName || 'Producto'"
                  class="w-full h-full object-cover"
                  format="webp"
                  quality="80"
                  loading="lazy"
                />
              </div>
              <div class="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <NuxtLink
                    v-if="item.collectionId"
                    :to="`/collections/${item.collectionSlug}/${item.productSlug}`"
                    class="font-medium text-zinc-900 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors truncate block text-sm sm:text-base cursor-pointer"
                  >
                    {{ item.productName || `Producto (${item.productId.substring(0, 8)})` }}
                  </NuxtLink>
                  <div
                    v-else
                    class="font-medium text-zinc-900 dark:text-white truncate block text-sm sm:text-base"
                  >
                    {{ item.productName || `Producto (${item.productId.substring(0, 8)})` }}
                  </div>
                  <p class="text-xs text-zinc-400 mt-0.5">
                    Ref: {{ item.productId.substring(0, 8) }}
                  </p>
                </div>

                <div class="flex items-center gap-3 mt-2">
                  <span
                    v-if="item.size"
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                  >
                    Talla: {{ item.size }}
                  </span>
                  <span class="text-xs text-zinc-500 dark:text-zinc-400">
                    Cant: <span class="font-semibold text-zinc-700 dark:text-zinc-300">{{ item.quantity }}</span>
                  </span>
                </div>
              </div>
              <div class="text-right flex flex-col justify-center pl-2 flex-shrink-0">
                <p class="text-zinc-950 dark:text-white font-semibold text-sm sm:text-base">
                  {{ formatCurrency(item.price * item.quantity) }}
                </p>
                <p
                  v-if="item.quantity > 1"
                  class="text-xs text-zinc-400 mt-0.5"
                >
                  {{ item.quantity }} x {{ formatCurrency(item.price) }}
                </p>
              </div>
              <div
                v-if="index < order.items.length - 1"
                class="absolute bottom-0 right-0 left-20 sm:left-24 border-b border-dashed border-zinc-200/60 dark:divide-zinc-800/60"
              />
            </div>
          </div>
        </div>
        <template #footer>
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm pt-2">
            <div class="text-zinc-500 space-y-1">
              <p><span class="font-medium text-zinc-400">Dirección de entrega:</span> {{ order.address.street }}, {{ order.address.city }} ({{ order.address.postalCode }})</p>
              <p><span class="font-medium text-zinc-400">Envío:</span> {{ order.shipping.method === 'pickup' ? 'Recogida en tienda' : order.shipping.method === 'express' ? 'Envío Express' : 'Envío Estándar' }} ({{ formatCurrency(order.shipping.price) }})</p>
            </div>
            <div class="w-full sm:w-auto text-right pt-3 sm:pt-0">
              <p class="text-xs text-zinc-400 font-medium uppercase tracking-wider">
                Total de la compra
              </p>
              <p class="text-2xl font-bold text-zinc-900 dark:text-white mt-0.5">
                {{ formatCurrency(order.total) }}
              </p>
            </div>
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>
