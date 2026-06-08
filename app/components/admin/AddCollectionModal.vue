<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const emit = defineEmits<{
  (e: 'success'): void
}>()

const schema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().min(5, 'La descripción debe tener al menos 5 caracteres'),
  imageUrl: z.string().min(1, 'Debes subir una imagen')
})

type Schema = z.output<typeof schema>

const isSubmitting = ref(false)

const state = reactive<Partial<Schema>>({
  name: '',
  description: '',
  imageUrl: ''
})

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  if (isSubmitting.value) return
  isSubmitting.value = true

  try {
    const payload = {
      name: event.data.name,
      description: event.data.description,
      imageUrl: event.data.imageUrl
    }

    await $fetch('/api/collections', {
      method: 'POST',
      body: payload
    })

    state.name = ''
    state.description = ''
    state.imageUrl = ''

    emit('success')
    alert('¡Colección guardada con éxito!')
  } catch (error) {
    console.error('Error al guardar la colección:', error)
    alert('No se pudo guardar la colección en la base de datos')
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
      <AdminImageUploader v-model="state.imageUrl" />
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
        label="Guardar Colección"
        color="primary"
        class="cursor-pointer"
        :loading="isSubmitting"
      />
    </div>
  </UForm>
</template>
