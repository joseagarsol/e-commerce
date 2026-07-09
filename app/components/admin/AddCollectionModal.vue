<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

interface AddCollectionModalProps {
  collection?: Collection | null
}

const props = defineProps<AddCollectionModalProps>()

const emit = defineEmits<{
  (e: 'success' | 'cancel'): void
}>()

const schema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  slug: z.string().min(1, 'El slug debe tener al menos 1 caracter'),
  description: z.string().min(5, 'La descripción debe tener al menos 5 caracteres'),
  imageUrl: z.string().min(1, 'Debes subir una imagen')
})

type Schema = z.output<typeof schema>

const isSubmitting = ref(false)
const toast = useToast()

const state = reactive<Partial<Schema>>({
  name: props.collection?.name || '',
  slug: props.collection?.slug || '',
  description: props.collection?.description || '',
  imageUrl: props.collection?.imageUrl || ''
})

watch(() => props.collection, (newCollection) => {
  state.name = newCollection?.name || ''
  state.slug = newCollection?.slug || ''
  state.description = newCollection?.description || ''
  state.imageUrl = newCollection?.imageUrl || ''
})

const fileToDelete = ref<string | null>(null)
const newUploadedUrl = ref<string>('')

const onImageUploaded = (newUrls: string | string[]) => {
  const url = Array.isArray(newUrls) ? newUrls[0] : newUrls
  if (url) {
    state.imageUrl = url
    newUploadedUrl.value = ''
  }
}

watch(() => state.name, (newName) => {
  if (newName) {
    state.slug = crearSlug(newName)
  }
}, { immediate: true })

const removeExistingImage = () => {
  if (state.imageUrl) {
    if (props.collection?.imageUrl === state.imageUrl) {
      const filename = state.imageUrl.substring(state.imageUrl.lastIndexOf('/') + 1)
      fileToDelete.value = filename
    }

    state.imageUrl = ''
  }
}

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  if (isSubmitting.value) return
  isSubmitting.value = true

  try {
    const payload = {
      name: event.data.name,
      slug: event.data.slug,
      description: event.data.description,
      imageUrl: event.data.imageUrl
    }

    if (props.collection) {
      const response = await $fetch(`/api/collections/${props.collection.id}`, {
        method: 'PUT',
        body: payload
      })

      if (fileToDelete.value) {
        await $fetch('/api/upload/delete', {
          method: 'POST',
          body: { filename: fileToDelete.value }
        }).catch(err => console.error('Error al limpiar R2:', err))

        fileToDelete.value = null
      }

      toast.add({
        title: 'Colección actualizada',
        description: response.message,
        color: 'success'
      })
    } else {
      const response = await $fetch('/api/collections', {
        method: 'POST',
        body: payload
      })

      state.name = ''
      state.slug = ''
      state.description = ''
      state.imageUrl = ''

      toast.add({
        title: 'Colección guardada',
        description: response.message,
        color: 'success'
      })
    }

    emit('success')
  } catch (error) {
    console.error('Error al guardar la colección:', error)
    toast.add({
      title: 'Error al guardar',
      description: 'No se pudo guardar la colección en la base de datos',
      color: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    class="space-y-5"
    :validate-on="['blur']"
    @submit="onSubmit"
  >
    <UFormField
      label="Nombre de la colección"
      name="name"
    >
      <UInput
        v-model="state.name"
        placeholder="Ej. Colección Primavera Verano"
        class="w-full"
      />
    </UFormField>

    <UFormField
      label="Slug"
      name="slug"
    >
      <UInput
        v-model="state.slug"
        placeholder="El slug se introduce automáticamente"
        class="w-full"
        disabled
      />
    </UFormField>

    <UFormField
      label="Descripción"
      name="description"
    >
      <UTextarea
        v-model="state.description"
        placeholder="Introduce una breve descripción de la colección..."
        class="w-full"
        :rows="3"
      />
    </UFormField>

    <UFormField
      label="Imagen de la colección"
      name="imageUrl"
    >
      <div class="space-y-4 w-full">
        <!-- Previsualización de la imagen actual si existe -->
        <div
          v-if="state.imageUrl"
          class="relative w-40 h-40 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 group"
        >
          <img
            :src="state.imageUrl"
            class="w-full h-full object-cover"
          >
          <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <UButton
              icon="i-lucide-trash"
              color="error"
              variant="solid"
              size="sm"
              class="rounded-full cursor-pointer"
              @click="removeExistingImage"
            />
          </div>
        </div>

        <!-- Cargador de imágenes (solo se muestra si no hay imagen asignada) -->
        <AdminImageUploader
          v-else
          :model-value="newUploadedUrl"
          @update:model-value="onImageUploaded"
        />
      </div>
    </UFormField>

    <div class="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
      <UButton
        label="Cancelar"
        color="neutral"
        variant="ghost"
        class="cursor-pointer"
        @click="emit('cancel')"
      />
      <UButton
        type="submit"
        label="Guardar Colección"
        color="primary"
        class="cursor-pointer"
        :loading="isSubmitting"
      />
    </div>
  </UForm>
</template>
