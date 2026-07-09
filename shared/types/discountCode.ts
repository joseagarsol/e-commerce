export interface DiscountCode {
  id: string
  code: string
  discountType: 'percent' | 'price'
  apply: 'shipping' | 'cartPrice'
  discount: number
}
