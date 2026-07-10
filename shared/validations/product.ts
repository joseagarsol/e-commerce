import { z } from 'zod'

export const stockBySizeSchema = z.record(
  z.string(),
  z.number({ message: 'La cantidad debe ser un número' })
    .int()
    .nonnegative({ message: 'La cantidad no puede ser negativa' })
).refine(
  val => Object.keys(val || {}).length > 0,
  { message: 'Debes seleccionar al menos una talla y especificar su cantidad' }
)

export const createProductSchema = (hasSizesVal: boolean) => z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'El nombre del producto debe tener al menos 3 caracteres'),
  slug: z.string().min(1, 'El slug debe tener al menos 1 caracter'),
  description: z.string().min(5, 'La descripción debe tener al menos 5 caracteres'),
  price: z.number({ message: 'El precio debe ser un número' }).positive('El precio del producto debe ser mayor que 0'),
  images: z.array(z.string().min(1, 'La ruta de la imagen no puede estar vacía')).min(1, 'Debes subir al menos una imagen de la prenda'),
  stock: z.number({ message: 'El stock debe ser un número' }).int().nonnegative('El stock no puede ser negativo'),
  collectionId: z.string().min(1, 'Debes seleccionar una colección'),
  availableSizes: z.array(z.enum(['XS', 'S', 'M', 'L', 'XL'])).nullable().optional(),
  stockBySize: hasSizesVal ? stockBySizeSchema : stockBySizeSchema.nullable()
})

export type ProductSchemaOutput = z.output<ReturnType<typeof createProductSchema>>
