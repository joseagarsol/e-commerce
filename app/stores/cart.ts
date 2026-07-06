import { defineStore } from 'pinia'
import type { CartItem } from '~/types/product'

export const useCartStore = defineStore('cart', () => {
  const mockProducts: CartItem[] = []
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

  const clearCart = () => {
    products.value = []
  }

  return {
    products,
    subtotal,
    isOpenSlide,
    totalProducts,
    addProduct,
    removeProduct,
    getItemQuantity,
    removeProductFromCart,
    clearCart
  }
}, {
  persist: true
})
