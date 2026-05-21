const APPLY_PROMO = {
  shipping: 'shipping',
  cartPrice: 'cartPrice'
}

const DISCOUNT_TYPE = {
  percent: 'percent',
  price: 'price'
}

interface Promotion {
  code: string
  description: string
  discountType: typeof DISCOUNT_TYPE[keyof typeof DISCOUNT_TYPE]
  apply: typeof APPLY_PROMO[keyof typeof APPLY_PROMO]
  discount: number
}
export function usePromotions() {
  const promotions: Promotion[] = [
    {
      code: 'FREE-SHIPPING',
      description: 'Envío gratis',
      discountType: DISCOUNT_TYPE.price,
      apply: APPLY_PROMO.shipping,
      discount: 3.99
    },
    {
      code: 'WELCOME',
      description: '10% de descuento',
      discountType: DISCOUNT_TYPE.percent,
      apply: APPLY_PROMO.cartPrice,
      discount: 0.10
    }
  ]

  const errorPromo = useState<string | null>('errorPromo', () => null)
  const promoCode = useState<string>('promoCode', () => '')
  const promo = useState<Promotion | null>('promo', () => null)

  const applyPromotions = () => {
    const promotion = promotions.find(promotion => promotion.code === promoCode.value)
    if (!promotion) {
      errorPromo.value = 'Código de promoción no válido'
      promo.value = null
      return
    }
    errorPromo.value = null
    promo.value = promotion
  }

  const getDiscountedPrice = (price: number, discountType: typeof DISCOUNT_TYPE[keyof typeof DISCOUNT_TYPE], amount: number) => {
    switch (discountType) {
      case DISCOUNT_TYPE.percent:
        return price - (price * amount)
      case DISCOUNT_TYPE.price:
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
