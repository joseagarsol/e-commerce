<script setup lang="ts">
import type { FormSubmitEvent, SelectItem } from '@nuxt/ui'
import type { Collection } from '~/types/collection'
import type { Product } from '~/types/product'
import * as z from 'zod'

interface AddProductModalProps {
  collections: Collection[]
  product: Product | null
}

const props = defineProps<AddProductModalProps>()

const emit = defineEmits<{
  (e: 'success' | 'cancel'): void
}>()

const isSubmitting = ref(false)

const schema = z.object({
  name: z.string()
    .min(3, 'El nombre del producto debe tener al menos 3 caracteres'),
  description: z.string()
    .min(5, 'La descripción debe tener al menos 5 caracteres'),
  price: z.number({ message: 'El precio debe ser un número' })
    .positive('El precio del producto debe ser mayor que 0'),
  images: z.array(z.string()).min(1, 'Debes subir al menos una imagen de la prenda'),
  stock: z.number({ message: 'El stock debe ser un número' })
    .int().nonnegative('El stock no puede ser negativo'),
  collectionId: z.string()
    .min(1, 'Debes seleccionar una colección')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  name: props.product?.name || '',
  description: props.product?.description || '',
  price: props.product?.price || undefined,
  images: props.product?.images || [],
  stock: props.product?.stock || undefined,
  collectionId: props.product?.collectionId || ''
})

const selectItems = computed<SelectItem[]>(() => {
  return props.collections.map((collection) => {
    return {
      label: collection.name,
      value: collection.id
    }
  })
})

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  if (isSubmitting.value) return
  isSubmitting.value = true

  try {
    const payload = {
      name: event.data.name,
      description: event.data.description,
      price: event.data.price,
      images: event.data.images,
      stock: event.data.stock,
      collectionId: event.data.collectionId
    }

    if (props.product) {
      await $fetch(`/api/products/${props.product.id}`, {
        method: 'PUT',
        body: payload
      })

      if (filesToDelete.value.length > 0) {
        await Promise.all(
          filesToDelete.value.map(filename =>
            $fetch('/api/upload/delete', {
              method: 'POST',
              body: { filename }
            })
          )
        ).catch(err => console.error('Error al limpiar R2:', err))

        filesToDelete.value = []
      }

      alert('¡Prenda actualizada con éxito!')
    } else {
      await $fetch('/api/products', {
        method: 'POST',
        body: payload
      })

      state.name = ''
      state.description = ''
      state.price = undefined
      state.images = []
      state.stock = undefined
      state.collectionId = undefined

      alert('¡Prenda guardada con éxito!')
    }

    emit('success')
  } catch (error) {
    console.error('Error al guardar el producto:', error)
    alert('No se pudo guardar la prenda en la base de datos')
  } finally {
    isSubmitting.value = false
  }
}

watch(() => props.product, (newProduct) => {
  state.name = newProduct?.name || ''
  state.description = newProduct?.description || ''
  state.price = newProduct?.price || undefined
  state.images = newProduct?.images || []
  state.stock = newProduct?.stock || undefined
  state.collectionId = newProduct?.collectionId || ''
})

const filesToDelete = ref<string[]>([])
const newUploadedUrls = ref<string[]>([])

const onImageUploaded = (newUrls: string | string[]) => {
  const urls = Array.isArray(newUrls) ? newUrls : [newUrls]
  if (urls.length > 0) {
    state.images = [...(state.images || []), ...urls]
    newUploadedUrls.value = []
  }
}

const removeExistingImage = (index: number) => {
  if (state.images) {
    const imageUrl = state.images[index]

    if (imageUrl && props.product?.images.includes(imageUrl)) {
      const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1)
      filesToDelete.value.push(filename)
    }

    state.images.splice(index, 1)
  }
}
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    :validate-on="['change']"
    class="space-y-5"
    @submit="onSubmit"
  >
    <UFormField
      label="Nombre de la prenda"
      name="name"
    >
      <UInput
        v-model="state.name"
        placeholder="Ej. Camiseta Lino Premium"
        class="w-full"
      />
    </UFormField>

    <UFormField
      label="Descripción"
      name="description"
    >
      <UTextarea
        v-model="state.description"
        placeholder="Introduce una breve descripción de los materiales y el corte..."
        class="w-full"
        :rows="3"
      />
    </UFormField>

    <div class="grid grid-cols-2 gap-4">
      <UFormField
        label="Precio (€)"
        name="price"
      >
        <UInputNumber
          v-model="state.price"
          :step="0.01"
          placeholder="49.90"
          orientation="vertical"
          class="w-full"
        />
      </UFormField>

      <UFormField
        :label="product ? 'Stock Actual' : 'Stock Inicial'"
        name="stock"
      >
        <UInputNumber
          v-model="state.stock"
          :step="1"
          placeholder="10"
          orientation="vertical"
          class="w-full"
        />
      </UFormField>
    </div>

    <UFormField
      label="Colección"
      name="collectionId"
    >
      <USelect
        v-model="state.collectionId"
        :items="selectItems"
        placeholder="Selecciona una colección"
        class="w-full"
      />
    </UFormField>

    <UFormField
      label="Imágenes de la prenda"
      name="images"
    >
      <div class="space-y-4 w-full">
        <div
          v-if="state.images && state.images.length > 0"
          class="grid grid-cols-3 sm:grid-cols-5 gap-3"
        >
          <div
            v-for="(url, index) in state.images"
            :key="url"
            class="relative group aspect-square rounded-md overflow-hidden border border-zinc-200 dark:border-zinc-800"
          >
            <img
              :src="url"
              class="w-full h-full object-cover"
            >
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <UButton
                icon="i-lucide-x"
                color="error"
                variant="solid"
                size="xs"
                class="rounded-full cursor-pointer"
                @click="removeExistingImage(index)"
              />
            </div>
          </div>
        </div>
        <AdminImageUploader
          :model-value="newUploadedUrls"
          multiple
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
        label="Guardar Prenda"
        color="primary"
        class="cursor-pointer"
        :loading="isSubmitting"
      />
    </div>
  </UForm>
</template>
