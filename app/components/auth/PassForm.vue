<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

interface Props {
  userEmail: string
}

const props = defineProps<Props>()
const emit = defineEmits(['handleEmailChange'])

const schema = z.object({
  email: z.email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: props.userEmail,
  password: undefined
})

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  console.log(event.data)
}

const show = ref(false)
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
      <div class="flex items-center gap-2">
        <p>{{ state.email }}</p>
        <UButton
          label="Cambiar"
          color="primary"
          variant="link"
          size="sm"
          class="cursor-pointer"
          @click="emit('handleEmailChange')"
        />
      </div>
    </UFormField>
    <UFormField
      label="Contraseña"
      name="password"
    >
      <UInput
        v-model="state.password"
        :type="show ? 'text' : 'password'"
        :ui="{ trailing: 'pe-1' }"
        class="w-full"
      >
        <template #trailing>
          <UButton
            color="neutral"
            variant="link"
            size="sm"
            :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
            :aria-label="show ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            :aria-pressed="show"
            aria-controls="password"
            @click="show = !show"
          />
        </template>
      </UInput>
    </UFormField>

    <UButton
      type="submit"
      label="Acceder"
      color="primary"
      block
    />
  </UForm>
</template>
