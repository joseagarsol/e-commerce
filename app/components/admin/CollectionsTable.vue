<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

defineProps<{
  collections: Collection[] | undefined
}>()

const emit = defineEmits<{
  (e: 'delete', id: string): void
  (e: 'edit', collection: Collection): void
}>()

const columns: TableColumn<Collection>[] = [
  { accessorKey: 'imageUrl', header: 'Colección' },
  { accessorKey: 'name', header: 'Nombre' },
  { accessorKey: 'slug', header: 'Slug' },
  { accessorKey: 'description', header: 'Descripción' },
  { accessorKey: 'actions', header: 'Acciones' }
]
</script>

<template>
  <UTable
    :data="collections || []"
    :columns="columns"
    class="w-full"
  >
    <template #imageUrl-cell="{ row }">
      <NuxtImg
        :src="row.original.imageUrl || '/collection-cover.png'"
        class="w-12 h-12 object-cover rounded-md"
        width="48"
        height="48"
        format="webp"
        quality="70"
        loading="lazy"
      />
    </template>

    <template #name-cell="{ row }">
      <div class="font-medium text-zinc-900 dark:text-white">
        {{ row.original.name }}
      </div>
    </template>

    <template #description-cell="{ row }">
      <div class="text-xs text-zinc-400 truncate max-w-xs">
        {{ row.original.description }}
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
