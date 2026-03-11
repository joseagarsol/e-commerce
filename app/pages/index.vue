<script setup lang="ts">
const items = [
  {
    id: 1,
    title: 'Sudadera Oversize Slate',
    category: 'Streetwear',
    price: '120€',
    image: '/product-hoodie.png'
  },
  {
    id: 2,
    title: 'Pantalón Cargo Tailored',
    category: 'Essential',
    price: '150€',
    image: '/product-pants.png'
  },
  {
    id: 3,
    title: 'City Sneaker Beige',
    category: 'Calzado',
    price: '190€',
    image: '/product-sneakers.png'
  },
  {
    id: 4,
    title: 'Matte Crossbody Bag',
    category: 'Accesorios',
    price: '210€',
    image: '/product-bag.png'
  },
  {
    id: 5,
    title: 'Bomber Jacket Olive',
    category: 'Outerwear',
    price: '250€',
    image: '/product-jacket.png'
  },
  {
    id: 6,
    title: 'Heavy Cotton T-Shirt',
    category: 'Essential',
    price: '55€',
    image: '/product-tshirt.png'
  },
  {
    id: 7,
    title: 'Signature Navy Cap',
    category: 'Accesorios',
    price: '45€',
    image: '/product-cap.png'
  },
  {
    id: 8,
    title: 'Modern Square Sunglasses',
    category: 'Accesorios',
    price: '180€',
    image: '/product-sunglasses.png'
  }
]
</script>

<template>
  <main>
    <HomeHeroSection />
    <HomeCategoriesBento />
    <HomeProductCarrousel :items="items" />
    <HomeBrandEssence />
  </main>
</template>
