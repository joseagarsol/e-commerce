<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const emit = defineEmits(['handleUserEmail'])

const schema = z.object({
  email: z.email('Email inválido')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (event.data.email === 'jose@jose.com') {
    emit('handleUserEmail', event.data.email)
    return
  }
  navigateTo('/register')
}
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    class="space-y-4"
    :validate-on="['change', 'input']"
    @submit="onSubmit"
  >
    <UFormField
      label="Email"
      name="email"
    >
      <UInput
        v-model="state.email"
        class="w-full"
      />
    </UFormField>

    <UButton
      type="submit"
      label="Continuar"
      color="primary"
      block
    />
  </UForm>
  <USeparator
    label="O si lo prefieres"
    class="my-6"
  />
  <div class="flex flex-col gap-3">
    <UButton
      icon="i-simple-icons-google"
      variant="subtle"
      label="Continuar con Google"
      color="error"
      block
    />
    <UButton
      icon="i-simple-icons-apple"
      variant="subtle"
      label="Continuar con Apple"
      color="info"
      block
    />
  </div>
</template>
