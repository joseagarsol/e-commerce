import type { CollectionEntity } from '~~/server/types/database'

export function mapCollectionEntityToCollection(collectionEntity: CollectionEntity): Collection {
  return {
    id: collectionEntity.id,
    name: collectionEntity.name,
    slug: collectionEntity.slug,
    description: collectionEntity.description,
    imageUrl: collectionEntity.imageUrl
  }
}
