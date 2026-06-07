<script setup lang="ts">
import * as z from 'zod'

const modelValue = defineModel<string[]>({ default: () => [] })

const files = ref<File[]>([])
const isUploading = ref(false)
const errorMessages = ref<string[]>([])

const fileToUrlMap = new Map<File, string>()

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

const schema = z.object({
  file: z
    .instanceof(File, { error: 'Por favor, seleccione un fichero de imagen' })
    .refine(file => file.size <= MAX_FILE_SIZE, {
      error: `El tamaño del fichero no debe superar ${formatBytes(MAX_FILE_SIZE)}`
    })
    .refine(file => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      error: 'Por favor, suba un archivo de imagen válido (JPEG, PNG o WebP).'
    })
})

watch(files, async (newFiles, oldFiles = []) => {
  const addedFiles = newFiles.filter(file => !oldFiles.includes(file))

  if (addedFiles.length === 0) {
    syncModelValue()
    return
  }

  isUploading.value = true
  errorMessages.value = []

  try {
    const uploadPromises = addedFiles.map(async (file) => {
      schema.parse({ file })

      const response = await $fetch('/api/upload/presigned', {
        method: 'POST',
        body: {
          filename: file.name,
          contentType: file.type
        }
      })

      await fetch(response.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      })

      fileToUrlMap.set(file, response.fileUrl)
    })

    await Promise.all(uploadPromises)

    syncModelValue()
  } catch (error) {
    if (error instanceof z.ZodError) {
      const flattened = z.flattenError(error as z.ZodError<z.infer<typeof schema>>)
      errorMessages.value = flattened.fieldErrors.file || []
    }
    console.error('Error al subir los ficheros: ', error)

    files.value = newFiles.filter(file => fileToUrlMap.has(file))
  } finally {
    isUploading.value = false
  }
})

const syncModelValue = () => {
  modelValue.value = files.value
    .map(file => fileToUrlMap.get(file))
    .filter((url): url is string => !!url)
}
</script>

<template>
  <div>
    <UFileUpload
      v-model="files"
      position="inside"
      color="primary"
      highlight
      layout="list"
      multiple
      icon="i-lucide-image"
      label="Deja tu imagen aquí"
      description="PNG, JPG o WebP (max. 10MB)"
      class="w-full min-h-48"
      :disabled="isUploading"
    />
    <div
      v-if="isUploading"
      class="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 justify-center py-2 bg-zinc-50 dark:bg-zinc-900/30 rounded-lg border border-zinc-100 dark:border-zinc-800"
    >
      <UIcon
        name="i-lucide-loader-2"
        class="size-4 animate-spin text-primary"
      />
      <span>Subiendo archivos a la nube...</span>
    </div>
    <div
      v-if="errorMessages.length > 0"
      class="mt-2 text-xs text-red-500 space-y-1"
    >
      <p
        v-for="err in errorMessages"
        :key="err"
      >
        {{ err }}
      </p>
    </div>
  </div>
</template>
