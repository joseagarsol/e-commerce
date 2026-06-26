import type { orders, orderItems } from '../db/schema'

type OrderEntity = typeof orders.$inferSelect
type OrderItemEntity = typeof orderItems.$inferSelect

export interface CreateOrderInputDTO {
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

export interface OrderItemDTO {
  productId: string
  quantity: number
  size: string | null
  price: number
}

export interface OrderResponseDTO {
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
  items: OrderItemDTO[]
}

export function mapOrderToDTO(order: OrderEntity, items: OrderItemEntity[] = []): OrderResponseDTO {
  return {
    id: order.id,
    createdAt: order.createdAt,
    status: order.status as OrderResponseDTO['status'],
    total: order.total,
    shipping: {
      method: order.shippingMethod,
      price: order.shippingPrice
    },
    paymentMethod: order.paymentMethod,
    customer: {
      name: order.name,
      lastName: order.lastName,
      email: order.email
    },
    address: {
      street: order.address,
      postalCode: order.postalCode,
      city: order.city,
      province: order.province
    },
    items: items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      size: item.size,
      price: item.price
    }))
  }
}
