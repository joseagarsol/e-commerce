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

const items = computed<BreadcrumbItem[]>(() => {
  const pathSegments = route.path.split('/').filter(Boolean)

  const breadcrumbs: BreadcrumbItem[] = []

  let currentPath = ''
  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`

    const label = segmentMap[segment]
      ? segmentMap[segment]
      : segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')

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
