<script setup lang="ts">
import type { Product } from '~/types/product'

const { data: products } = await useFetch<Product[]>('/api/products')
</script>

<template>
  <main>
    <HomeHeroSection />
    <HomeCategoriesBento />
    <HomeProductCarrousel :items="products || []" />
    <HomeBrandEssence />
  </main>
</template>
