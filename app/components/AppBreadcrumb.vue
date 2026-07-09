<script setup lang="ts">
import { computed } from 'vue'
import type { BreadcrumbItem } from '@nuxt/ui'

const route = useRoute()

const segmentMap: Record<string, string> = {
  products: 'Productos',
  collections: 'Colecciones',
  cart: 'Cesta',
  checkout: 'Pago'
}

const { data: collection } = useAsyncData<Collection | null>(
  'breadcrumb-collection',
  () => {
    const c = route.params.collection as string | undefined
    return c ? $fetch<Collection>(`/api/collections/${c}`) : Promise.resolve(null)
  },
  { watch: [() => route.params.collection] }
)

const { data: product } = useAsyncData<Product | null>(
  'breadcrumb-product',
  () => {
    const p = route.params.product as string | undefined
    return p ? $fetch<Product>(`/api/products/${p}`) : Promise.resolve(null)
  },
  { watch: [() => route.params.product] }
)

const items = computed<BreadcrumbItem[]>(() => {
  const pathSegments = route.path.split('/').filter(Boolean)

  const breadcrumbs: BreadcrumbItem[] = []

  let currentPath = ''
  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`

    let label = segmentMap[segment]
      ? segmentMap[segment]
      : segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')

    if (segment === route.params.collection && collection.value?.name) {
      label = collection.value.name
    }

    if (segment === route.params.product && product.value?.name) {
      label = product.value.name
    }

    breadcrumbs.push({
      label,
      to: currentPath
    })
  })

  return breadcrumbs
})
</script>

<template>
  <UBreadcrumb
    :items="items"
    class="w-full"
  />
</template>
