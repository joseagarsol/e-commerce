<script setup lang="ts">
import * as z from 'zod'

const modelValue = defineModel<string | string[]>({ default: '' })

const props = withDefaults(defineProps<{
  multiple?: boolean
}>(), {
  multiple: false
})

const filesArray = ref<File[]>([])
const singleFile = ref<File | null>(null)

const isUploading = ref(false)
const errorMessages = ref<string[]>([])

const MAX_FILE_SIZE = 2 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const fileToUrlMap = new Map<File, string>()

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
    .instanceof(File, { message: 'Por favor, seleccione un fichero de imagen' })
    .refine(file => file.size <= MAX_FILE_SIZE, {
      message: `El tamaño del fichero no debe superar ${formatBytes(MAX_FILE_SIZE)}`
    })
    .refine(file => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: 'Por favor, suba un archivo de imagen válido (JPEG, PNG o WebP).'
    })
})

watch(filesArray, async (newFiles, oldFiles = []) => {
  const addedFiles = newFiles.filter(file => !oldFiles.includes(file))

  if (addedFiles.length === 0) {
    syncMultipleModelValue()
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

      const uploadRes = await fetch(response.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      })

      if (!uploadRes.ok) {
        throw new Error(`Error al subir el archivo ${file.name} al almacenamiento (HTTP ${uploadRes.status})`)
      }

      fileToUrlMap.set(file, response.fileUrl)
    })

    await Promise.all(uploadPromises)
    syncMultipleModelValue()
  } catch (error) {
    if (error instanceof z.ZodError) {
      const flattened = z.flattenError(error as z.ZodError<z.infer<typeof schema>>)
      errorMessages.value = flattened.fieldErrors.file || []
    }
    console.error('Error al subir los ficheros: ', error)
    filesArray.value = newFiles.filter(file => fileToUrlMap.has(file))
  } finally {
    isUploading.value = false
  }
})

const syncMultipleModelValue = () => {
  modelValue.value = filesArray.value
    .map(file => fileToUrlMap.get(file))
    .filter((url): url is string => !!url)
}

watch(singleFile, async (newFile) => {
  if (!newFile) {
    modelValue.value = ''
    return
  }

  isUploading.value = true
  errorMessages.value = []

  try {
    schema.parse({ file: newFile })

    const response = await $fetch('/api/upload/presigned', {
      method: 'POST',
      body: {
        filename: newFile.name,
        contentType: newFile.type
      }
    })

    const uploadRes = await fetch(response.uploadUrl, {
      method: 'PUT',
      body: newFile,
      headers: {
        'Content-Type': newFile.type
      }
    })

    if (!uploadRes.ok) {
      throw new Error(`Error al subir la imagen al almacenamiento (HTTP ${uploadRes.status})`)
    }

    modelValue.value = response.fileUrl
  } catch (error) {
    if (error instanceof z.ZodError) {
      const flattened = z.flattenError(error as z.ZodError<z.infer<typeof schema>>)
      errorMessages.value = flattened.fieldErrors.file || []
    }
    console.error('Error al subir la imagen de colección: ', error)
    singleFile.value = null
  } finally {
    isUploading.value = false
  }
})

watch(modelValue, (newVal) => {
  if (Array.isArray(newVal) && newVal.length === 0) {
    filesArray.value = []
    fileToUrlMap.clear()
  } else if (typeof newVal === 'string' && newVal === '') {
    singleFile.value = null
  }
})
</script>

<template>
  <div class="space-y-2">
    <UFileUpload
      v-if="props.multiple"
      v-model="filesArray"
      position="inside"
      color="primary"
      highlight
      layout="list"
      :file-delete="false"
      multiple
      icon="i-lucide-image"
      label="Deja tus imágenes aquí"
      description="PNG, JPG o WebP (max. 2MB)"
      class="w-full min-h-48"
      :disabled="isUploading"
    />
    <UFileUpload
      v-else
      v-model="singleFile"
      position="inside"
      color="primary"
      highlight
      :file-delete="false"
      layout="list"
      icon="i-lucide-image"
      label="Deja tu imagen aquí"
      description="PNG, JPG o WebP (max. 2MB)"
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
      <span>Subiendo archivo a la nube...</span>
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
