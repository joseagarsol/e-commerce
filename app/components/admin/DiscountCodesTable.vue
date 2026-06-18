<script setup lang="ts">
import type { Promotion } from '~/types/promotion'
import type { TableColumn } from '@nuxt/ui'

defineProps<{
  coupons: Promotion[] | undefined
}>()

const emit = defineEmits<{
  (e: 'delete', id: string): void
  (e: 'edit', coupon: Promotion): void
}>()

const columns: TableColumn<Promotion>[] = [
  { accessorKey: 'code', header: 'Código de Descuento' },
  { accessorKey: 'discount', header: 'Descuento' },
  { accessorKey: 'apply', header: 'Se aplica a' },
  { accessorKey: 'actions', header: 'Acciones' }
]
</script>

<template>
  <UTable
    :data="coupons || []"
    :columns="columns"
    class="w-full"
  >
    <template #code-cell="{ row }">
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-700 font-mono text-xs font-semibold rounded-md tracking-wider">
          <UIcon
            name="i-lucide-tag"
            class="w-3.5 h-3.5 opacity-60"
          />
          {{ row.original.code }}
        </div>
      </div>
    </template>

    <template #discount-cell="{ row }">
      <div class="font-semibold text-zinc-950 dark:text-zinc-50 text-sm">
        <span v-if="row.original.discountType === 'percent'">
          {{ row.original.discount }}%
        </span>
        <span v-else>
          {{ row.original.discount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) }}
        </span>
      </div>
    </template>

    <template #apply-cell="{ row }">
      <div>
        <span
          v-if="row.original.apply === 'cartPrice'"
          class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50"
        >
          <UIcon
            name="i-lucide-shopping-cart"
            class="w-3 h-3"
          />
          Total de la compra
        </span>
        <span
          v-else
          class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50"
        >
          <UIcon
            name="i-lucide-truck"
            class="w-3 h-3"
          />
          Envío gratuito
        </span>
      </div>
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
