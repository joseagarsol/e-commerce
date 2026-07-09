<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

defineProps<{
  orders: Order[] | undefined
}>()

const emit = defineEmits<{
  (e: 'updateStatus', id: string, newStatus: string): void
}>()

const columns: TableColumn<Order>[] = [
  { accessorKey: 'id', header: 'ID Pedido' },
  { accessorKey: 'customer', header: 'Cliente' },
  { accessorKey: 'total', header: 'Total' },
  { accessorKey: 'createdAt', header: 'Fecha' },
  { accessorKey: 'status', header: 'Estado' }
]

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const statusOptions = [
  { label: 'Pagado', value: 'paid' },
  { label: 'Enviado', value: 'shipped' },
  { label: 'Cancelado', value: 'cancelled' },
  { label: 'Pendiente', value: 'pending' }
]
</script>

<template>
  <UTable
    :data="orders || []"
    :columns="columns"
    class="w-full"
  >
    <template #id-cell="{ row }">
      <span class="font-mono text-xs text-zinc-400">{{ row.original.id.substring(0, 8) }}...</span>
    </template>

    <template #customer-cell="{ row }">
      <div class="text-sm font-medium text-zinc-900 dark:text-white">
        {{ row.original.customer.name }} {{ row.original.customer.lastName }}
      </div>
      <div class="text-xs text-zinc-400">
        {{ row.original.customer.email }}
      </div>
    </template>

    <template #total-cell="{ row }">
      <span class="font-semibold text-zinc-900 dark:text-white">
        {{ formatCurrency(row.original.total) }}
      </span>
    </template>

    <template #createdAt-cell="{ row }">
      <span class="text-xs text-zinc-500">
        {{ formatDate(row.original.createdAt) }}
      </span>
    </template>

    <template #status-cell="{ row }">
      <USelect
        :model-value="row.original.status"
        :items="statusOptions"
        size="sm"
        class="w-32"
        @update:model-value="(val) => emit('updateStatus', row.original.id, val)"
      />
    </template>
  </UTable>
</template>
