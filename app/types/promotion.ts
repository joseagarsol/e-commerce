export interface Promotion {
  id: string
  code: string
  discountType: 'percent' | 'price'
  apply: 'shipping' | 'cartPrice'
  discount: number
}
