<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { FetchError } from 'ofetch'

interface Props {
  userEmail: string
}

const toast = useToast()
const authStore = useAuthStore()

const props = defineProps<Props>()
const emit = defineEmits(['handleEmailChange'])

const schema = z.object({
  email: z.email('Email inválido'),
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: props.userEmail,
  password: undefined
})

const isSubmit = ref(false)

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  isSubmit.value = true
  toast.clear()

  try {
    await authStore.login(event.data)
  } catch (error) {
    let description = 'No se pudo iniciar sesión. Por favor, inténtelo de nuevo.'

    if (error instanceof FetchError && error.data.statusMessage) {
      description = error.data.statusMessage
    }

    toast.add({
      title: 'Error al iniciar sesión',
      description,
      color: 'error',
      duration: 0
    })
  } finally {
    isSubmit.value = false
  }
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
      :loading="isSubmit"
    />
  </UForm>
</template>
