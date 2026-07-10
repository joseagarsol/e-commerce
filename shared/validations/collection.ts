import { z } from 'zod'

export const collectionSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  slug: z.string().min(1, 'El slug debe tener al menos 1 caracter'),
  description: z.string().min(5, 'La descripción debe tener al menos 5 caracteres'),
  imageUrl: z.string().min(1, 'La imagen de la colección es requerida')
})

export type CollectionSchemaOutput = z.output<typeof collectionSchema>
