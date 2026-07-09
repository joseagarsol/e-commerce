import type { ProductEntity } from '~~/server/types/database'
import type { Product, Size } from '~~/shared/types/product'

export function mapProductEntityToProduct(
  productEntity: ProductEntity,
  collectionInfo?: { slug: string | null, name: string | null }
): Product {
  return {
    id: productEntity.id,
    name: productEntity.name,
    slug: productEntity.slug,
    description: productEntity.description,
    price: productEntity.price,
    images: productEntity.images,
    stock: productEntity.stock,
    availableSizes: productEntity.availableSizes as Size[] | null,
    stockBySize: productEntity.stockBySize as Partial<Record<Size, number>> | null,
    collectionId: productEntity.collectionId || undefined,
    collectionSlug: collectionInfo?.slug || undefined,
    collectionName: collectionInfo?.name || undefined
  }
}
