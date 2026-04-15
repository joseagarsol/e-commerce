<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z
  .object({
    name: z.string('El nombre es requerido')
      .min(6, 'El nombre debe tener al menos 6 caracteres')
      .max(20, 'El nombre debe tener menos de 20 caracteres'),
    email: z.email('Email inválido'),
    password: z.string('La contraseña es requerida')
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .max(60, 'La contraseña debe tener menos de 60 caracteres')
      .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
      .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
      .regex(/[0-9]/, 'Debe contener al menos un número')
      .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial'),
    password_confirmation: z.string('La confirmación de la contraseña es requerida')
  })
  .refine(data => data.password === data.password_confirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['password_confirmation']
  })

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  name: undefined,
  email: undefined,
  password: undefined,
  password_confirmation: undefined
})

const showPassword = ref(false)
const showPasswordConfirmation = ref(false)

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  console.log(event.data)
}
</script>

<template>
  <div class="min-h-screen flex">
    <div class="hidden lg:flex relative w-0 flex-1 bg-gray-900">
      <img
        class="absolute inset-0 h-full w-full object-cover opacity-60"
        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
        alt="E-commerce experience"
      >
      <div class="absolute inset-0 bg-gradient-to-tr from-primary-900/80 to-transparent mix-blend-multiply" />
      <div class="absolute inset-0 flex flex-col justify-center px-16 text-white">
        <UIcon
          name="i-lucide-shopping-bag"
          class="w-16 h-16 mb-6 opacity-90"
        />
        <h1 class="text-4xl font-extrabold tracking-tight mb-4 leading-tight">
          La mejor experiencia <br> de compra
        </h1>
        <p class="text-lg opacity-80 max-w-lg">
          Sumérgete en un catálogo lleno de calidad, estilo e innovación. Regístrate y compruébalo.
        </p>
      </div>
    </div>
    <div class="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:w-1/2">
      <UCard
        class="w-full max-w-md shadow-xl"
      >
        <template #header>
          <div class="text-center sm:text-left">
            <h2 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Crea tu cuenta
            </h2>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Únete a nosotros y descubre increíbles ofertas diarias.
            </p>
          </div>
        </template>

        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          :validate-on="['change', 'input']"
          @submit="onSubmit"
        >
          <UFormField
            label="Nombre"
            name="name"
          >
            <UInput
              v-model="state.name"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Email"
            name="email"
          >
            <UInput
              v-model="state.email"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Contraseña"
            name="password"
          >
            <UInput
              v-model="state.password"
              :type="showPassword ? 'text' : 'password'"
              :ui="{ trailing: 'pe-1' }"
              class="w-full"
            >
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="link"
                  size="sm"
                  :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                  :aria-pressed="showPassword"
                  aria-controls="password"
                  @click="showPassword = !showPassword"
                />
              </template>
            </UInput>
          </UFormField>
          <UFormField
            label="Confirmar contraseña"
            name="password_confirmation"
          >
            <UInput
              v-model="state.password_confirmation"
              :type="showPasswordConfirmation ? 'text' : 'password'"
              :ui="{ trailing: 'pe-1' }"
              class="w-full"
            >
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="link"
                  size="sm"
                  :icon="showPasswordConfirmation ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  :aria-label="showPasswordConfirmation ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                  :aria-pressed="showPasswordConfirmation"
                  aria-controls="password_confirmation"
                  @click="showPasswordConfirmation = !showPasswordConfirmation"
                />
              </template>
            </UInput>
          </UFormField>
          <UButton
            type="submit"
            label="Registrarse"
            color="primary"
            block
          />
        </UForm>
        <template #footer>
          <p class="text-center text-sm text-gray-600 dark:text-gray-400">
            ¿Ya tienes una cuenta?
            <NuxtLink
              to="/login"
              class="font-medium text-primary hover:underline"
            >
              Inicia sesión
            </NuxtLink>
          </p>
        </template>
      </UCard>
    </div>
  </div>
</template>
