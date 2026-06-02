export interface Promotion {
  code: string
  discountType: 'percent' | 'price'
  apply: 'shipping' | 'cartPrice'
  discount: number
}
