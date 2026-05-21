import { defineStore } from 'pinia'
import type { CartItem } from '~/types/product'

export const useCartStore = defineStore('cart', () => {
  const mockProducts: CartItem[] = [
    {
      id: 'UIDAD2322',
      name: 'Camiseta Mujer oversize Blanco',
      images: [
        '/collection-essentials.png'
      ],
      price: 15.99,
      description: 'Camiseta Mujer oversize Blanco',
      stock: 10,
      availableSizes: ['S', 'M', 'L'],
      stockBySize: {
        S: 2,
        M: 3,
        L: 5
      },
      selectedSize: 'M',
      quantity: 1
    },
    {
      id: 'UIDAD2323',
      name: 'Sudadera Mujer Rojo',
      images: [
        '/collection-autumn-winter.png'
      ],
      price: 32.99,
      description: 'Sudadera Mujer Rojo',
      stock: 10,
      availableSizes: ['S', 'M', 'L'],
      stockBySize: {
        S: 2,
        M: 3,
        L: 5
      },
      selectedSize: 'S',
      quantity: 2
    },
    {
      id: 'UIDAD2324',
      name: 'Pantalón Mujer beige',
      images: [
        '/collection-spring-summer.png'
      ],
      price: 35.99,
      description: 'Pantalón Mujer beige',
      stock: 10,
      availableSizes: ['S', 'M', 'L'],
      stockBySize: {
        S: 2,
        M: 3,
        L: 5
      },
      selectedSize: 'L',
      quantity: 1
    },
    {
      id: 'UIDAD2325',
      name: 'Mochila Urbana Negra',
      images: ['/product-bag.png'],
      price: 29.99,
      description: 'Mochila resistente al agua ideal para el día a día',
      stock: 15,
      availableSizes: null,
      stockBySize: null,
      selectedSize: null,
      quantity: 1
    },
    {
      id: 'UIDAD2326',
      name: 'Gorra Vintage Azul',
      images: ['/product-cap.png'],
      price: 12.99,
      description: 'Gorra estilo vintage con logo bordado',
      stock: 20,
      availableSizes: ['S', 'M', 'L'],
      stockBySize: { S: 5, M: 10, L: 5 },
      selectedSize: 'M',
      quantity: 2
    },
    {
      id: 'UIDAD2327',
      name: 'Sudadera con Capucha Gris',
      images: ['/product-hoodie.png'],
      price: 39.99,
      description: 'Sudadera de algodón muy cómoda',
      stock: 12,
      availableSizes: ['S', 'M', 'L', 'XL'],
      stockBySize: { S: 2, M: 4, L: 4, XL: 2 },
      selectedSize: 'L',
      quantity: 1
    },
    {
      id: 'UIDAD2328',
      name: 'Chaqueta Vaquera Clásica',
      images: ['/product-jacket.png'],
      price: 49.99,
      description: 'Chaqueta vaquera de corte clásico',
      stock: 8,
      availableSizes: ['S', 'M', 'L'],
      stockBySize: { S: 2, M: 3, L: 3 },
      selectedSize: 'M',
      quantity: 1
    },
    {
      id: 'UIDAD2329',
      name: 'Pantalón Cargo Verde',
      images: ['/product-pants.png'],
      price: 34.99,
      description: 'Pantalón cargo con múltiples bolsillos',
      stock: 10,
      availableSizes: ['S', 'M', 'L'],
      stockBySize: { S: 3, M: 4, L: 3 },
      selectedSize: 'S',
      quantity: 3
    },
    {
      id: 'UIDAD2331',
      name: 'Gafas de Sol Polarizadas',
      images: ['/product-sunglasses.png'],
      price: 19.99,
      description: 'Gafas de sol con protección UV',
      stock: 25,
      availableSizes: null,
      stockBySize: null,
      selectedSize: null,
      quantity: 1
    },
    {
      id: 'UIDAD2332',
      name: 'Camiseta Básica Negra',
      images: ['/product-tshirt.png'],
      price: 9.99,
      description: 'Camiseta de manga corta 100% algodón',
      stock: 30,
      availableSizes: ['S', 'M', 'L', 'XL'],
      stockBySize: { S: 5, M: 10, L: 10, XL: 5 },
      selectedSize: 'XL',
      quantity: 4
    },
    {
      id: 'UIDAD2333',
      name: 'Camiseta Básica Azul',
      images: ['/product-tshirt.png'],
      price: 9.99,
      description: 'Camiseta de manga corta 100% algodón',
      stock: 30,
      availableSizes: ['S', 'M', 'L', 'XL'],
      stockBySize: { S: 5, M: 10, L: 10, XL: 5 },
      selectedSize: 'M',
      quantity: 1
    },
    {
      id: 'UIDAD2334',
      name: 'Mochila Escolar Roja',
      images: ['/product-bag.png'],
      price: 24.99,
      description: 'Mochila espaciosa con compartimento para portátil',
      stock: 12,
      availableSizes: null,
      stockBySize: null,
      selectedSize: null,
      quantity: 1
    }
  ]
  const products = ref<CartItem[]>(mockProducts)

  const totalProducts = computed(() => {
    return products.value.reduce((total, product) =>
      total + product.quantity, 0)
  })

  const isOpenSlide = ref(false)

  const subtotal = computed(() => {
    return products.value.reduce((total, product) =>
      total + (product.price * product.quantity), 0)
  })

  const addProduct = (item: CartItem) => {
    const existing = products.value.find(p => p.id === item.id && p.selectedSize === item.selectedSize)

    // Obtener stock disponible de este item para evitar exceder
    let stockAvailable = item.stock
    if (item.selectedSize && item.stockBySize) {
      stockAvailable = item.stockBySize[item.selectedSize] ?? 0
    }

    if (existing) {
      if (existing.quantity < stockAvailable) {
        existing.quantity++
      }
    } else {
      if (stockAvailable > 0) {
        products.value.push({ ...item })
      }
    }
  }

  const removeProduct = (id: string, size: string | null = null) => {
    const product = products.value.find(p => p.id === id && p.selectedSize === size)
    if (product) {
      if (product.quantity === 1) {
        products.value = products.value.filter(p => !(p.id === id && p.selectedSize === size))
      } else {
        product.quantity--
      }
    }
  }

  const getItemQuantity = (id: string, size: string | null = null) => {
    const item = products.value.find(p => p.id === id && p.selectedSize === size)
    return item ? item.quantity : 0
  }

  const removeProductFromCart = (id: string, size: string | null = null) => {
    products.value = products.value.filter(p => !(p.id === id && p.selectedSize === size))
  }

  return {
    products,
    subtotal,
    isOpenSlide,
    totalProducts,
    addProduct,
    removeProduct,
    getItemQuantity,
    removeProductFromCart
  }
})
