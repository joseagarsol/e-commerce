<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { useAuthStore } from '~/stores/auth'
import { FetchError } from 'ofetch'

definePageMeta({
  middleware: 'guest'
})

const authStore = useAuthStore()
const toast = useToast()

const schema = z.object({
  email: z.email(),
  password: z.string('La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined

})

const showPassword = ref(false)
const isSubmit = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isSubmit.value = true
  toast.clear()

  try {
    await authStore.login(event.data)
    await navigateTo('/')
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

async function loginAs(email: string, pass: string) {
  isSubmit.value = true
  toast.clear()

  try {
    state.email = email
    state.password = pass

    await authStore.login({ email, password: pass })

    toast.add({
      title: 'Acceso Demo Exitoso',
      description: `Has iniciado sesión como ${email.includes('admin') ? 'Administrador' : 'Cliente'}`,
      color: 'success'
    })

    if (email.includes('admin')) {
      await navigateTo('/admin')
    } else {
      await navigateTo('/')
    }
  } catch (error) {
    let description = 'No se pudo iniciar sesión en modo demo.'
    if (error instanceof FetchError && error.data?.statusMessage) {
      description = error.data.statusMessage
    }

    toast.add({
      title: 'Error de acceso demo',
      description,
      color: 'error',
      duration: 0
    })
  } finally {
    isSubmit.value = false
  }
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
          Sumérgete en un catálogo lleno de calidad, estilo e innovación. Accede a tu cuenta y continúa tu experiencia.
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
              Inicia Sesión
            </h2>
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
          <UButton
            type="submit"
            label="Acceder"
            color="primary"
            block
            :loading="isSubmit"
          />
        </UForm>

        <div class="relative my-6">
          <div
            class="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div class="w-full border-t border-zinc-200 dark:border-zinc-800" />
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-white dark:bg-zinc-900 px-2 text-zinc-500 font-medium">
              Acceso Rápido Demo
            </span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <UButton
            color="neutral"
            variant="subtle"
            icon="i-lucide-shield-check"
            label="Admin Demo"
            size="md"
            block
            class="cursor-pointer"
            :disabled="isSubmit"
            @click="loginAs('admin@urbanluxury.com', 'admin12345')"
          />
          <UButton
            color="neutral"
            variant="subtle"
            icon="i-lucide-user"
            label="Cliente Demo"
            size="md"
            block
            class="cursor-pointer"
            :disabled="isSubmit"
            @click="loginAs('cliente@urbanluxury.com', 'cliente12345')"
          />
        </div>

        <template #footer>
          <p class="text-center text-sm text-gray-600 dark:text-gray-400">
            ¿Aún no estás registrado?
            <NuxtLink
              to="/register"
              class="font-medium text-primary hover:underline"
            >
              Regístrate
            </NuxtLink>
          </p>
        </template>
      </UCard>
    </div>
  </div>
</template>
