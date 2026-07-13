<script setup lang="ts">
import type { SelectMenuItem } from '@nuxt/ui'

definePageMeta({
  layout: 'store'
})

const route = useRoute()
const slug = route.params.collection as string

const { data: collection } = await useFetch<Collection>('/api/collections/' + slug)
const { data: products } = await useFetch<Product[]>('/api/products?collection=' + slug)

useSeoMeta({
  title: () => collection.value?.name ?? 'Colección',
  description: () => collection.value?.description || `Explora nuestra selección completa de la colección ${collection.value?.name || ''}.`,
  ogTitle: () => `${collection.value?.name ?? 'Colección'} - Urban Luxury`,
  ogDescription: () => collection.value?.description || `Explora nuestra selección completa de la colección ${collection.value?.name || ''}.`,
  ogImage: () => collection.value?.imageUrl || '/LandingImg_V2.jpg'
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Inicio', 'item': 'https://urbanluxury.com' },
          { '@type': 'ListItem', 'position': 2, 'name': 'Colecciones', 'item': 'https://urbanluxury.com/collections' },
          { '@type': 'ListItem', 'position': 3, 'name': collection.value?.name, 'item': `https://urbanluxury.com/collections/${slug}` }
        ]
      }))
    }
  ]
})

const orderBy = ref<'novedades' | 'precio-asc' | 'precio-desc'>('novedades')

const filters = ref<SelectMenuItem[]>([
  { label: 'Novedades', id: 'novedades' },
  { label: 'Precio: Menor a Mayor', id: 'precio-asc' },
  { label: 'Precio: Mayor a Menor', id: 'precio-desc' }
])

if (!collection.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'La colección solicitada no existe',
    fatal: true
  })
}

const collectionName = computed(() => collection.value?.name)

const productList = computed(() => {
  if (!collection.value || !products.value) return []

  const list = [...products.value]

  if (orderBy.value === 'precio-asc') {
    return list.sort((a, b) => a.price - b.price)
  }

  if (orderBy.value === 'precio-desc') {
    return list.sort((a, b) => b.price - a.price)
  }

  return list
})
</script>

<template>
  <div>
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <div class="space-y-2">
        <h1 class="font-serif italic font-light text-4xl md:text-5xl text-zinc-900 dark:text-white leading-tight">
          {{ collectionName }}
        </h1>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 max-w-md tracking-wide">
          Explora nuestra selección completa de la colección {{ collectionName }}.
        </p>
      </div>

      <div class="flex items-center gap-4">
        <span class="text-[10px] uppercase tracking-[0.2em] text-zinc-400">Filtrar por:</span>
        <USelectMenu
          v-model="orderBy"
          value-key="id"
          label-key="label"
          :items="filters"
          placeholder="Relevancia"
          variant="none"
          class="border-b border-zinc-200 dark:border-zinc-800 text-xs uppercase tracking-widest w-full"
          :search-input="false"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
      <ProductCard
        v-for="product in productList"
        :key="product.id"
        :product="product"
      />
    </div>
  </div>
</template>
