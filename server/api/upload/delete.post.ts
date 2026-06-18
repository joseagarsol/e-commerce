import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { z } from 'zod'

const schema = z.object({
  filename: z.string().min(1, 'El nombre del archivo es obligatorio')
})

export default defineEventHandler(async (event) => {
  try {
    const accountId = process.env.R2_ACCOUNT_ID
    const accessKeyId = process.env.R2_ACCESS_KEY_ID
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
    const bucketName = process.env.R2_BUCKET_NAME
    const publicUrl = process.env.R2_PUBLIC_URL

    if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !publicUrl) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Configuración de Cloudflare R2 incompleta en el servidor'
      })
    }

    const body = await readBody(event)
    const { filename } = schema.parse(body)

    const s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    })

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: filename
    })

    await s3Client.send(command)

    return {
      success: true
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const flattened = z.flattenError(error)

      throw createError({
        statusCode: 400,
        statusMessage: 'Parámetros de subida inválidos',
        data: flattened.fieldErrors
      })
    }

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Error al eliminar la imagen del servidor'
    })
  }
})
