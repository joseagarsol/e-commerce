import { FetchError } from 'ofetch'
import { useCartStore } from '@/stores/cart'

export function usePromotions() {
  const errorPromo = useState<string | null>('errorPromo', () => null)
  const promoCode = useState<string>('promoCode', () => '')
  const promo = useState<DiscountCode | null>('promo', () => null)
  const cartStore = useCartStore()

  const applyPromotions = async () => {
    if (!promoCode.value.trim()) {
      errorPromo.value = 'Introduce un código de descuento'
      promo.value = null
      return
    }

    try {
      errorPromo.value = null
      const response = await $fetch('/api/discount-codes/validate', {
        method: 'POST',
        body: {
          code: promoCode.value
        }
      })

      if (response.success && response.data) {
        const coupon = response.data

        if (coupon.apply === 'shipping' && cartStore.subtotal >= 25) {
          errorPromo.value = 'El envío ya es gratuito para este pedido'
          promo.value = null
          return
        }

        promo.value = coupon
      }
    } catch (error) {
      promo.value = null

      if (error instanceof FetchError && error.data?.statusMessage) {
        errorPromo.value = error.data.statusMessage
      } else {
        errorPromo.value = 'Código de promoción no válido'
      }
    }
  }

  const getDiscountedPrice = (
    price: number,
    discountType: DiscountCode['discountType'],
    amount: number
  ) => {
    let discountedPrice = price
    switch (discountType) {
      case 'percent':
        discountedPrice = price - (price * amount)
        break
      case 'price':
        discountedPrice = price - amount
        break
      default:
        discountedPrice = price
    }
    return Math.max(0, discountedPrice)
  }

  return {
    applyPromotions,
    getDiscountedPrice,
    errorPromo,
    promoCode,
    promo
  }
}
