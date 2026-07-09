<script setup lang="ts">
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
