interface OrderItem {
  productId: string
  quantity: number
  size: string | null
  price: number
  productName?: string
  productImage?: string
  collectionId?: string | null
  productSlug?: string
  collectionSlug?: string
}

export interface Order {
  id: string
  createdAt: string
  status: 'pending' | 'paid' | 'shipped' | 'cancelled'
  total: number
  shipping: {
    method: string
    price: number
  }
  paymentMethod: string
  customer: {
    name: string
    lastName: string
    email: string
  }
  address: {
    street: string
    postalCode: string
    city: string
    province: string
  }
  items: OrderItem[]
}

export interface CreateOrderEntity {
  billingAddress: {
    email: string
    name: string
    lastName: string
    address: string
    postalCode: string
    city: string
    province: string
  }
  shipping: {
    method: string
    price: number
  }
  payment: {
    method: string
  }
  cartItems: Array<{
    id: string
    price: number
    quantity: number
    selectedSize: string | null
  }>
  totalPrice: number
}
