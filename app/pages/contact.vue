<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

useSeoMeta({
  title: 'Contacto',
  description: 'Ponte en contacto con el equipo de Urban Luxury.'
})

const schema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Dirección de correo inválida'),
  message: z.string().min(10, 'El mensaje debe detallarse más (mínimo 10 caracteres)')
})

type Schema = z.output<typeof schema>

const state = reactive({
  name: '',
  email: '',
  message: ''
})

const isSending = ref(false)
const toast = useToast()

const onSubmit = async (__event: FormSubmitEvent<Schema>) => {
  isSending.value = true

  // Simulamos el envío del formulario de contacto
  setTimeout(() => {
    isSending.value = false

    toast.add({
      title: 'Mensaje enviado',
      description: 'Gracias por ponerte en contacto. Te responderemos en un plazo de 24 horas.',
      color: 'success'
    })

    state.name = ''
    state.email = ''
    state.message = ''
  }, 1000)
}
</script>

<template>
  <div class="py-16 px-5 md:py-24 md:px-12 max-w-2xl mx-auto space-y-10">
    <div class="space-y-2 border-b border-zinc-100 dark:border-zinc-800 pb-6 text-center">
      <h1 class="font-serif italic font-light text-4xl md:text-5xl text-zinc-900 dark:text-white leading-tight">
        Ponte en Contacto
      </h1>
      <p class="text-sm text-zinc-500 dark:text-zinc-400">
        ¿Tienes dudas con tu pedido o deseas consultarnos algo? Escríbenos.
      </p>
    </div>

    <UCard class="border border-zinc-100 dark:border-zinc-800 shadow-md">
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-5"
        @submit="onSubmit"
      >
        <UFormField
          label="Nombre completo"
          name="name"
        >
          <UInput
            v-model="state.name"
            placeholder="Introduce tu nombre"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Correo electrónico"
          name="email"
        >
          <UInput
            v-model="state.email"
            type="email"
            placeholder="ejemplo@correo.com"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Mensaje"
          name="message"
        >
          <UTextarea
            v-model="state.message"
            placeholder="Escribe tu consulta detalladamente aquí..."
            class="w-full"
            :rows="5"
          />
        </UFormField>

        <UButton
          type="submit"
          label="Enviar Mensaje"
          color="primary"
          block
          size="lg"
          :loading="isSending"
          class="cursor-pointer"
        />
      </UForm>
    </UCard>
  </div>
</template>
