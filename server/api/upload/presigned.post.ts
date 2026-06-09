import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { z } from 'zod'

const uploadRequestSchema = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1)
})

export default defineEventHandler(async (event) => {
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

  try {
    const body = await readBody(event)
    const { filename, contentType } = uploadRequestSchema.parse(body)

    const s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    })

    const uniqueKey = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: uniqueKey,
      ContentType: contentType
    })

    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 300,
      signableHeaders: new Set(['content-type'])
    })

    const fileUrl = `${publicUrl}/${uniqueKey}`

    return {
      success: true,
      uploadUrl,
      fileUrl
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

    console.error('Error al generar la URL pre-firmada:', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Error al generar la firma de subida'
    })
  }
})
