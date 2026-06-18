<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Product } from '~/types/product'

defineProps<{
  products: Product[] | undefined
}>()

const emit = defineEmits<{
  (e: 'delete', id: string): void
  (e: 'edit', product: Product): void
}>()

const columns: TableColumn<Product>[] = [
  { accessorKey: 'images', header: 'Prenda' },
  { accessorKey: 'name', header: 'Detalles' },
  { accessorKey: 'price', header: 'Precio' },
  { accessorKey: 'stock', header: 'Stock' },
  { accessorKey: 'actions', header: 'Acciones' }
]
</script>

<template>
  <UTable
    :data="products || []"
    :columns="columns"
    class="w-full"
  >
    <template #images-cell="{ row }">
      <NuxtImg
        :src="row.original.images?.[0] || '/product-tshirt.png'"
        class="w-12 h-12 object-cover rounded-md"
      />
    </template>

    <template #name-cell="{ row }">
      <div class="font-medium text-zinc-900 dark:text-white">
        {{ row.original.name }}
      </div>
      <div class="text-xs text-zinc-400 truncate max-w-xs">
        {{ row.original.description }}
      </div>
    </template>

    <template #price-cell="{ row }">
      <span class="font-semibold text-zinc-900 dark:text-white">
        {{ formatCurrency(row.original.price) }}
      </span>
    </template>

    <template #stock-cell="{ row }">
      <UBadge
        :color="row.original.stock === 0 ? 'error' : (row.original.stock <= 5 ? 'warning' : 'success')"
        variant="subtle"
        size="sm"
      >
        {{ row.original.stock === 0 ? 'Agotado' : `${row.original.stock} uds` }}
      </UBadge>
    </template>

    <template #actions-cell="{ row }">
      <div class="flex items-center gap-2">
        <UButton
          icon="i-lucide-pencil"
          color="neutral"
          variant="ghost"
          size="sm"
          class="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          @click="emit('edit', row.original)"
        />
        <UButton
          icon="i-lucide-trash"
          color="error"
          variant="ghost"
          size="sm"
          class="cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          @click="emit('delete', row.original.id)"
        />
      </div>
    </template>
  </UTable>
</template>
