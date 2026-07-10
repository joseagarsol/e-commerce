<script setup lang="ts">
import type { FormSubmitEvent, SelectItem } from '@nuxt/ui'
import type * as z from 'zod'
import { createProductSchema } from '~~/shared/validations/product'

interface AddProductModalProps {
  collections: Collection[]
  product: Product | null
}

const props = defineProps<AddProductModalProps>()

const emit = defineEmits<{
  (e: 'success' | 'cancel'): void
}>()

const isSubmitting = ref(false)
const hasSizes = ref(!!props.product?.stockBySize)
const toast = useToast()

const schema = (hasSizesVal: boolean) => createProductSchema(hasSizesVal)

type Schema = z.output<ReturnType<typeof schema>>

const state = reactive<Partial<Schema>>({
  name: props.product?.name || '',
  slug: props.product?.slug || '',
  description: props.product?.description || '',
  price: props.product?.price || undefined,
  images: props.product?.images || [],
  stock: props.product?.stock || undefined,
  collectionId: props.product?.collectionId || '',
  stockBySize: props.product?.stockBySize || null
})

watch(() => state.stockBySize, (newStockBySize) => {
  if (hasSizes.value && newStockBySize) {
    state.stock = Object.values(newStockBySize).reduce((acc: number, qty) => acc + (qty || 0), 0)
  }
}, { deep: true })

watch(hasSizes, (newHasSizes) => {
  if (newHasSizes) {
    state.stockBySize = state.stockBySize || {}
    state.stock = Object.values(state.stockBySize).reduce((acc: number, qty) => acc + (qty || 0), 0)
  } else {
    state.stockBySize = null
    state.stock = undefined
  }
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
      slug: event.data.slug,
      description: event.data.description,
      price: event.data.price,
      images: event.data.images,
      stock: event.data.stock,
      collectionId: event.data.collectionId,
      availableSizes: hasSizes.value && state.stockBySize ? Object.keys(state.stockBySize) : null,
      stockBySize: hasSizes.value ? state.stockBySize : null
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

      toast.add({
        title: 'Prenda actualizada',
        description: '¡Prenda actualizada con éxito!',
        color: 'success'
      })
    } else {
      await $fetch('/api/products', {
        method: 'POST',
        body: payload
      })

      state.name = ''
      state.slug = ''
      state.description = ''
      state.price = undefined
      state.images = []
      state.stock = undefined
      state.collectionId = undefined
      state.stockBySize = null
      hasSizes.value = false

      toast.add({
        title: 'Prenda guardada',
        description: '¡Prenda guardada con éxito!',
        color: 'success'
      })
    }

    emit('success')
  } catch (error) {
    console.error('Error al guardar el producto:', error)
    toast.add({
      title: 'Error al guardar',
      description: 'No se pudo guardar la prenda en la base de datos',
      color: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}

watch(() => props.product, (newProduct) => {
  state.name = newProduct?.name || ''
  state.slug = newProduct?.slug || ''
  state.description = newProduct?.description || ''
  state.price = newProduct?.price || undefined
  state.images = newProduct?.images || []
  state.stock = newProduct?.stock || undefined
  state.collectionId = newProduct?.collectionId || ''
  state.stockBySize = newProduct?.stockBySize || null
  hasSizes.value = !!newProduct?.stockBySize
})

watch(() => state.name, (newName) => {
  if (newName) {
    state.slug = crearSlug(newName)
  }
}, { immediate: true })

const formRef = useTemplateRef('formRef')
const filesToDelete = ref<string[]>([])
const newUploadedUrls = ref<string[]>([])

const onImageUploaded = async (newUrls: string | string[]) => {
  const urls = Array.isArray(newUrls) ? newUrls : [newUrls]
  if (urls.length > 0) {
    state.images = [...(state.images || []), ...urls]
    newUploadedUrls.value = []
    await nextTick()
    formRef.value?.validate({ name: 'images' })
  }
}

const removeExistingImage = async (index: number) => {
  if (state.images) {
    const imageUrl = state.images[index]

    if (imageUrl && props.product?.images.includes(imageUrl)) {
      const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1)
      filesToDelete.value.push(filename)
    }

    state.images.splice(index, 1)
    await nextTick()
    formRef.value?.validate({ name: 'images' })
  }
}
</script>

<template>
  <UForm
    ref="formRef"
    :schema="schema(hasSizes)"
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
        v-if="!hasSizes"
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

    <div>
      <USwitch
        v-model="hasSizes"
        label="Este producto tiene tallas"
      />
    </div>

    <div v-if="hasSizes">
      <UFormField
        name="stockBySize"
      >
        <AdminSizeSelector v-model="state.stockBySize" />
      </UFormField>
    </div>

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
