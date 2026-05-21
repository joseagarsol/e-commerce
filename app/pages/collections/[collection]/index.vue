<script setup lang="ts">
import type { Product } from '~/types/product'

definePageMeta({
  layout: 'store'
})

const route = useRoute()
const slug = route.params.collection as string

const parseSlug = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

const mockProducts: Product[] = [
  {
    id: 'tshirt-essential',
    name: 'T-Shirt Essential',
    price: 35.00,
    description: 'Camiseta básica de algodón 100% orgánico, perfecta para el día a día.',
    images: ['/product-tshirt.png'],
    stock: 50,
    availableSizes: ['S', 'M', 'L', 'XL'],
    stockBySize: { S: 10, M: 20, L: 15, XL: 5 }
  },
  {
    id: 'hoodie-urban',
    name: 'Hoodie Urban',
    price: 65.00,
    description: 'Sudadera con capucha y bolsillo canguro. Interior peinado suave.',
    images: ['/product-hoodie.png'],
    stock: 30,
    availableSizes: ['S', 'M', 'L', 'XL'],
    stockBySize: { S: 0, M: 10, L: 10, XL: 10 }
  },
  {
    id: 'jacket-premium',
    name: 'Jacket Premium',
    price: 120.00,
    description: 'Chaqueta ligera resistente al agua con forro interior.',
    images: ['/product-jacket.png'],
    stock: 15,
    availableSizes: ['S', 'M', 'L'],
    stockBySize: { S: 5, M: 5, L: 5 }
  },
  {
    id: 'pants-casual',
    name: 'Pants Casual',
    price: 55.00,
    description: 'Pantalones de corte relajado, máxima comodidad.',
    images: ['/product-pants.png'],
    stock: 40,
    availableSizes: ['S', 'M', 'L', 'XL'],
    stockBySize: { S: 10, M: 10, L: 10, XL: 10 }
  },
  {
    id: 'sneakers-classic',
    name: 'Sneakers Classic',
    price: 85.00,
    description: 'Zapatillas deportivas estilo retro.',
    images: ['/product-sneakers.png'],
    stock: 25,
    availableSizes: ['S', 'M', 'L'],
    stockBySize: { S: 5, M: 10, L: 10 }
  },
  {
    id: 'bag-explorer',
    name: 'Bag Explorer',
    price: 45.00,
    description: 'Bolsa de viaje espaciosa y resistente.',
    images: ['/product-bag.png'],
    stock: 20,
    availableSizes: ['M'],
    stockBySize: { M: 20 }
  },
  {
    id: 'cap-sport',
    name: 'Cap Sport',
    price: 25.00,
    description: 'Gorra ajustable con logo bordado.',
    images: ['/product-cap.png'],
    stock: 60,
    availableSizes: null,
    stockBySize: null
  },
  {
    id: 'sunglasses-retro',
    name: 'Sunglasses Retro',
    price: 35.00,
    description: 'Gafas de sol polarizadas estilo vintage.',
    images: ['/product-sunglasses.png'],
    stock: 15,
    availableSizes: null,
    stockBySize: null
  }
]
</script>

<template>
  <div>
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <div class="space-y-2">
        <h1 class="font-serif italic font-light text-4xl md:text-5xl text-zinc-900 dark:text-white leading-tight">
          {{ parseSlug }}
        </h1>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 max-w-md tracking-wide">
          Explora nuestra selección completa de la colección {{ parseSlug }}.
        </p>
      </div>

      <div class="flex items-center gap-4">
        <span class="text-[10px] uppercase tracking-[0.2em] text-zinc-400">Filtrar por:</span>
        <USelectMenu
          :items="['Novedades', 'Precio: Menor a Mayor', 'Precio: Mayor a Menor']"
          placeholder="Relevancia"
          variant="none"
          class="border-b border-zinc-200 dark:border-zinc-800 text-xs uppercase tracking-widest w-full"
          :search-input="false"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
      <ProductCard
        v-for="product in mockProducts"
        :key="product.id"
        :product="product"
      />
    </div>
  </div>
</template>
