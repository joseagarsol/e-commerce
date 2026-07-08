export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL'

export interface Product {
  id: string
  name: string
  slug: string
  price: number
  description: string
  images: string[]
  stock: number
  availableSizes: Size[] | null
  stockBySize: Partial<Record<Size, number>> | null
  collectionId?: string
  collectionSlug?: string
  collectionName?: string
}

export interface CartItem extends Product {
  selectedSize: Size | null
  quantity: number
}
