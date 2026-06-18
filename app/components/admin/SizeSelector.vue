<script setup lang="ts">
import type { Size } from '~/types/product'

const model = defineModel<Record<string, number> | null>({
  default: null
})

const ALL_SIZES = ref([
  { label: 'XS', active: false, stock: 0 },
  { label: 'S', active: false, stock: 0 },
  { label: 'M', active: false, stock: 0 },
  { label: 'L', active: false, stock: 0 },
  { label: 'XL', active: false, stock: 0 }
])

const selectedSizesList = computed(() => ALL_SIZES.value.filter(s => s.active))

watch(() => model.value, (newVal) => {
  if (newVal) {
    const currentVal = ALL_SIZES.value.filter(s => s.active).reduce((acc, s) => {
      acc[s.label] = s.stock || 0
      return acc
    }, {} as Record<string, number>)

    if (JSON.stringify(currentVal) !== JSON.stringify(newVal)) {
      ALL_SIZES.value.forEach((size) => {
        const sizeKey = size.label as Size
        if (sizeKey in newVal) {
          size.active = true
          size.stock = newVal[sizeKey] ?? 0
        } else {
          size.active = false
          size.stock = 0
        }
      })
    }
  } else {
    const hasActive = ALL_SIZES.value.some(s => s.active)
    if (hasActive) {
      ALL_SIZES.value.forEach((size) => {
        size.active = false
        size.stock = 0
      })
    }
  }
}, { immediate: true, deep: true })

watch(() => ALL_SIZES.value, (newSizes) => {
  const activeSizes = newSizes.filter(s => s.active)
  const newValue = activeSizes.length === 0
    ? {}
    : activeSizes.reduce((acc, s) => {
        acc[s.label] = s.stock || 0
        return acc
      }, {} as Record<string, number>)

  if (JSON.stringify(model.value) !== JSON.stringify(newValue)) {
    model.value = newValue
  }
}, { deep: true })
</script>

<template>
  <div class="space-y-3">
    <p class="text-sm font-medium text-zinc-700 dark:text-zinc-300">
      Seleccione las tallas que desea añadir
    </p>
    <div class="flex gap-2">
      <UButton
        v-for="size in ALL_SIZES"
        :key="size.label"
        :label="size.label"
        :color="size.active ? 'primary' : 'neutral'"
        class="cursor-pointer"
        @click="size.active = !size.active"
      />
    </div>

    <div class="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            <th class="p-3">
              Talla
            </th>
            <th class="p-3">
              Cantidad
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="selectedSizesList.length === 0">
            <td
              colspan="2"
              class="p-4 text-center text-sm text-zinc-500 dark:text-zinc-400"
            >
              Selecciona las tallas
            </td>
          </tr>
          <tr
            v-for="size in selectedSizesList"
            :key="size.label"
            class="border-b border-zinc-100 dark:border-zinc-800 last:border-none text-sm"
          >
            <td class="p-3 font-medium text-zinc-900 dark:text-white">
              {{ size.label }}
            </td>
            <td class="p-3">
              <UInputNumber
                v-model="size.stock"
                :min="0"
                :step="1"
                placeholder="0"
                class="w-28"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
