import { FetchError } from 'ofetch'
import type { Promotion } from '~/types/promotion'
import type { ApiResponse } from '~/types/api'

export function usePromotions() {
  const errorPromo = useState<string | null>('errorPromo', () => null)
  const promoCode = useState<string>('promoCode', () => '')
  const promo = useState<Promotion | null>('promo', () => null)

  const applyPromotions = async () => {
    if (!promoCode.value.trim()) {
      errorPromo.value = 'Introduce un código de descuento'
      promo.value = null
      return
    }

    try {
      errorPromo.value = null
      const response = await $fetch<ApiResponse<Promotion>>('/api/discount-codes/validate', {
        method: 'POST',
        body: {
          code: promoCode.value
        }
      })

      if (response.success && response.data) {
        const coupon = response.data

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
    discountType: Promotion['discountType'],
    amount: number
  ) => {
    switch (discountType) {
      case 'percent':
        return price - (price * amount)
      case 'price':
        return price - amount
      default:
        return price
    }
  }

  return {
    applyPromotions,
    getDiscountedPrice,
    errorPromo,
    promoCode,
    promo
  }
}
