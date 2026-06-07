<script setup lang="ts">
import type { FormSubmitEvent, SelectItem } from '@nuxt/ui'
import type { Collection } from '~/types/collection'
import * as z from 'zod'

interface AddProductModalProps {
  collections: Collection[]
}

const props = defineProps<AddProductModalProps>()

const emit = defineEmits<{
  (e: 'success'): void
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
  name: '',
  description: '',
  price: undefined,
  images: [],
  stock: undefined,
  collectionId: ''
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

    emit('success')
    alert('¡Prenda guardada con éxito!')
  } catch (error) {
    console.error('Error al guardar el producto:', error)
    alert('No se pudo guardar la prenda en la base de datos')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    :validate-on="['blur']"
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
        label="Stock Inicial"
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
      <AdminImageUploader v-model="state.images" />
    </UFormField>

    <div class="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
      <UButton
        label="Cancelar"
        color="neutral"
        variant="ghost"
        class="cursor-pointer"
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
