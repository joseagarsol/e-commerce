<script setup lang="ts">
useSeoMeta({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Urban Luxury` : 'Urban Luxury | Elegancia Callejera Redefinida'
  },
  ogTitle: 'Urban Luxury | Elegancia Callejera Redefinida',
  description: 'Descubre nuestra colección Otoño Invierno 2026. Urban Luxury une la estética del asfalto con la sofisticación de la alta costura. Diseñado en Málaga.',
  ogDescription: 'Descubre nuestra colección Otoño Invierno 2026. Urban Luxury une la estética del asfalto con la sofisticación de la alta costura. Diseñado en Málaga.',
  ogImage: '/LandingImg_V2.jpg',
  ogUrl: 'https://urbanluxury.com',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Urban Luxury | Streetwear Premium',
  twitterDescription: 'Alta costura callejera y minimalismo. Descubre las últimas tendencias.',
  twitterImage: '/LandingImg_V2.jpg'
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
