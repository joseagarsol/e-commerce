import type { OrderEntity, OrderItemsEntity } from '~~/server/types/database'

type OrderItemsWithDetails = OrderItemsEntity & {
  productName?: string | null
  productImages?: string[] | null
  collectionId?: string | null
  productSlug?: string | null
  collectionSlug?: string | null
}

export function mapOrderEntityToOrder(
  orderEntity: OrderEntity,
  items: OrderItemsWithDetails[] = []
): Order {
  return {
    id: orderEntity.id,
    createdAt: orderEntity.createdAt,
    status: orderEntity.status as Order['status'],
    total: orderEntity.total,
    shipping: {
      method: orderEntity.shippingMethod,
      price: orderEntity.shippingPrice
    },
    paymentMethod: orderEntity.paymentMethod,
    customer: {
      name: orderEntity.name,
      lastName: orderEntity.lastName,
      email: orderEntity.email
    },
    address: {
      street: orderEntity.address,
      postalCode: orderEntity.postalCode,
      city: orderEntity.city,
      province: orderEntity.province
    },
    items: items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      size: item.size,
      price: item.price,
      productName: item.productName ?? undefined,
      productImage: item.productImages && Array.isArray(item.productImages) && item.productImages.length > 0
        ? item.productImages[0]
        : undefined,
      collectionId: item.collectionId ?? undefined,
      productSlug: item.productSlug ?? undefined,
      collectionSlug: item.collectionSlug ?? undefined
    }))
  }
}
