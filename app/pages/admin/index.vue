<script setup lang="ts">
import type { Product } from '~/types/product'
import type { Collection } from '~/types/collection'
import type { Promotion } from '~/types/promotion'

const [
  { data: products },
  { data: collections },
  { data: coupons }
] = await Promise.all([
  useFetch<Product[]>('/api/products'),
  useFetch<Collection[]>('/api/collections'),
  useFetch<Promotion[]>('/api/discount-codes')
])

const tabs = [
  { label: 'Prendas', icon: 'i-lucide-shirt', slot: 'products' },
  { label: 'Colecciones', icon: 'i-lucide-folder-open', slot: 'collections' },
  { label: 'Cupones de Descuento', icon: 'i-lucide-tag', slot: 'coupons' }
]

const handleDeleteProduct = async (id: string) => {
  if (!confirm('¿Estás seguro de que deseas eliminar esta prenda de forma permanente?')) return
  try {
    await $fetch(`/api/products/${id}`, {
      method: 'DELETE'
    })
    await refreshNuxtData()
  } catch (error) {
    console.error('Error deleting product:', error)
    alert('No se pudo eliminar el producto de la base de datos')
  }
}
</script>

<template>
  <div class="py-12 px-5 md:py-16 md:px-12 max-w-7xl mx-auto space-y-12">
    <div class="space-y-2">
      <h1 class="font-serif italic font-light text-4xl md:text-5xl text-zinc-900 dark:text-white leading-tight">
        Panel de Control
      </h1>
      <p class="text-sm text-zinc-500 dark:text-zinc-400 tracking-wide">
        Gestiona el stock, colecciones y códigos de descuento de tu e-commerce.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <UCard class="shadow-sm border border-zinc-100 dark:border-zinc-800">
        <div class="flex items-center gap-4">
          <div class="flex items-center justify-center p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-900 dark:text-white">
            <UIcon
              name="i-lucide-shirt"
              class="size-6"
            />
          </div>
          <div>
            <p class="text-xs uppercase tracking-widest text-zinc-400 font-medium">
              Prendas en Stock
            </p>
            <p class="text-3xl font-bold text-zinc-900 dark:text-white mt-1">
              {{ products?.length || 0 }}
            </p>
          </div>
        </div>
      </UCard>

      <UCard class="shadow-sm border border-zinc-100 dark:border-zinc-800">
        <div class="flex items-center gap-4">
          <div class="flex items-center justify-center p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-900 dark:text-white">
            <UIcon
              name="i-lucide-folder-open"
              class="size-6"
            />
          </div>
          <div>
            <p class="text-xs uppercase tracking-widest text-zinc-400 font-medium">
              Colecciones activas
            </p>
            <p class="text-3xl font-bold text-zinc-900 dark:text-white mt-1">
              {{ collections?.length || 0 }}
            </p>
          </div>
        </div>
      </UCard>

      <UCard class="shadow-sm border border-zinc-100 dark:border-zinc-800">
        <div class="flex items-center gap-4">
          <div class="flex items-center justify-center p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-900 dark:text-white">
            <UIcon
              name="i-lucide-tag"
              class="size-6"
            />
          </div>
          <div>
            <p class="text-xs uppercase tracking-widest text-zinc-400 font-medium">
              Cupones Activos
            </p>
            <p class="text-3xl font-bold text-zinc-900 dark:text-white mt-1">
              {{ coupons?.length || 0 }}
            </p>
          </div>
        </div>
      </UCard>
    </div>

    <UTabs
      :items="tabs"
      class="w-full"
    >
      <template #products>
        <div class="py-6 space-y-6">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold text-zinc-900 dark:text-white">
              Listado de Prendas
            </h2>
            <UButton
              label="Añadir Prenda"
              icon="i-lucide-plus"
              size="md"
            />
          </div>
          <AdminProductsTable
            :products="products"
            @delete="handleDeleteProduct"
          />
        </div>
      </template>

      <template #collections>
        <div class="py-6 space-y-6">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold text-zinc-900 dark:text-white">
              Colecciones Disponibles
            </h2>
            <UButton
              label="Nueva Colección"
              icon="i-lucide-plus"
              size="md"
            />
          </div>
          <p class="text-sm text-zinc-400 italic">
            Gestión de colecciones en desarrollo...
          </p>
        </div>
      </template>

      <template #coupons>
        <div class="py-6 space-y-6">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold text-zinc-900 dark:text-white">
              Códigos de Descuento
            </h2>
            <UButton
              label="Crear Cupón"
              icon="i-lucide-plus"
              size="md"
            />
          </div>
          <p class="text-sm text-zinc-400 italic">
            Gestión de cupones en desarrollo...
          </p>
        </div>
      </template>
    </UTabs>
  </div>
</template>
