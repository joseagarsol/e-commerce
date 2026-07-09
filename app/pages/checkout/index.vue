<script lang="ts" setup>
import * as z from 'zod'
import type { RadioGroupItem, FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  middleware: 'auth'
})

const cartStore = useCartStore()
const { getDiscountedPrice, promo } = usePromotions()
const toast = useToast()

const baseSchema = z.object({
  email: z.email('El campo email no es correcto'),
  country: z.string('El campo país es requerido').min(1, 'El campo país es requerido'),
  name: z.string('El campo nombre es requerido')
    .min(4, 'El nombre debe tener al menos 4 caracteres')
    .max(20, 'El nombre debe tener como máximo 20 caracteres'),
  lastName: z.string('El campo apellido es requerido')
    .min(4, 'El apellido debe tener al menos 4 caracteres')
    .max(20, 'El apellido debe tener como máximo 20 caracteres'),
  company: z.optional(z.string()),
  address: z.string('El campo dirección es requerido')
    .min(5, 'La dirección debe tener al menos 5 caracteres')
    .max(100, 'La dirección debe tener como máximo 100 caracteres'),
  address2: z.optional(z.string()),
  postalCode: z.string('El campo código postal es requerido')
    .min(5, 'El código postal debe tener al menos 5 caracteres')
    .max(5, 'El código postal debe tener como máximo 5 caracteres'),
  city: z.string('El campo ciudad es requerido').min(1, 'El campo ciudad es requerido'),
  province: z.string('El campo provincia es requerido').min(1, 'El campo provincia es requerido'),
  teléfono: z.string('El campo teléfono es requerido')
    .min(9, 'El teléfono debe tener al menos 9 caracteres'),
  shippingPrice: z.number()
})

const schema = baseSchema.and(z.discriminatedUnion('paymentMethod', [
  z.object({
    paymentMethod: z.literal('credit-card'),
    cardNumber: z.string('El número de tarjeta es requerido')
      .min(15, 'El número de tarjeta debe tener al menos 15 dígitos')
      .max(16, 'El número de tarjeta debe tener como máximo 16 dígitos'),
    cardExpiry: z.string('La fecha es requerida')
      .length(4, 'Formato inválido')
      .refine((val) => {
        const month = parseInt(val.slice(0, 2))
        return month >= 1 && month <= 12
      }, 'Mes inválido'),
    cardCvc: z.string('El CVC es requerido')
      .min(3, 'CVC inválido')
      .max(4, 'CVC inválido'),
    cardName: z.string('El titular es requerido')
      .min(2, 'Nombre muy corto')
  }),
  z.object({
    paymentMethod: z.literal('paypal'),
    cardNumber: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCvc: z.string().optional(),
    cardName: z.string().optional()
  }),
  z.object({
    paymentMethod: z.literal('google-pay'),
    cardNumber: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCvc: z.string().optional(),
    cardName: z.string().optional()
  }),
  z.object({
    paymentMethod: z.literal('apple-pay'),
    cardNumber: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCvc: z.string().optional(),
    cardName: z.string().optional()
  })
]))

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined,
  country: undefined,
  name: undefined,
  lastName: undefined,
  company: undefined,
  address: undefined,
  address2: undefined,
  postalCode: undefined,
  city: undefined,
  province: undefined,
  teléfono: undefined,
  shippingPrice: 3.99,
  paymentMethod: 'credit-card',
  cardNumber: undefined,
  cardExpiry: undefined,
  cardCvc: undefined,
  cardName: undefined
})

const shippingMethods = ref<RadioGroupItem[]>([
  {
    id: 'express',
    value: 9.99,
    label: 'Envío Express',
    description: 'Entrega en 24-48 horas'
  },
  {
    id: 'standard',
    value: 3.99,
    label: 'Envío Standard',
    description: 'Entrega en 2-3 días'
  },
  {
    id: 'pickup',
    value: 0,
    label: 'Recogida en tienda',
    description: 'Recogida en tienda'
  }
])

const paymentMethods = ref<RadioGroupItem[]>([
  {
    id: 'credit-card',
    value: 'credit-card',
    label: 'Tarjeta de crédito'
  },
  {
    id: 'paypal',
    value: 'paypal',
    label: 'PayPal'
  },
  {
    id: 'google-pay',
    value: 'google-pay',
    label: 'Google Pay'
  },
  {
    id: 'apple-pay',
    value: 'apple-pay',
    label: 'Apple Pay'
  }
])

const countries = [
  { label: 'España', value: 'ES' },
  { label: 'Francia', value: 'FR' },
  { label: 'Italia', value: 'IT' }
]
const cities = [
  { label: 'Madrid', value: 'madrid', country: 'ES' },
  { label: 'Barcelona', value: 'barcelona', country: 'ES' },
  { label: 'Valencia', value: 'valencia', country: 'ES' },
  { label: 'Sevilla', value: 'sevilla', country: 'ES' },
  { label: 'Zaragoza', value: 'zaragoza', country: 'ES' },
  { label: 'Málaga', value: 'malaga', country: 'ES' },
  { label: 'Murcia', value: 'murcia', country: 'ES' },
  { label: 'Palma de Mallorca', value: 'palma-de-mallorca', country: 'ES' },
  { label: 'Las Palmas de Gran Canaria', value: 'las-palmas', country: 'ES' },
  { label: 'Bilbao', value: 'bilbao', country: 'ES' },
  { label: 'Roma', value: 'roma', country: 'IT' },
  { label: 'Milán', value: 'milan', country: 'IT' },
  { label: 'Nápoles', value: 'napoles', country: 'IT' },
  { label: 'Turín', value: 'turin', country: 'IT' },
  { label: 'Palermo', value: 'palermo', country: 'IT' },
  { label: 'Génova', value: 'genova', country: 'IT' },
  { label: 'Bolonia', value: 'bolonia', country: 'IT' },
  { label: 'Florencia', value: 'florencia', country: 'IT' },
  { label: 'Bari', value: 'bari', country: 'IT' },
  { label: 'Catania', value: 'catania', country: 'IT' },
  { label: 'París', value: 'paris', country: 'FR' },
  { label: 'Marsella', value: 'marsella', country: 'FR' },
  { label: 'Lyon', value: 'lyon', country: 'FR' },
  { label: 'Toulouse', value: 'toulouse', country: 'FR' },
  { label: 'Niza', value: 'niza', country: 'FR' },
  { label: 'Nantes', value: 'nantes', country: 'FR' },
  { label: 'Estrasburgo', value: 'estrasburgo', country: 'FR' },
  { label: 'Montpellier', value: 'montpellier', country: 'FR' },
  { label: 'Burdeos', value: 'burdeos', country: 'FR' },
  { label: 'Lille', value: 'lille', country: 'FR' }
]
const mmAAFormatter = computed({
  get() {
    const value = state.cardExpiry || ''
    if (value.length === 0) return ''
    if (value.length <= 2) return value

    const month = value.slice(0, 2)
    const year = value.slice(2, 4)
    return `${month} / ${year}`
  },
  set(newValue) {
    let clearedValue = newValue.replace(/\D/g, '')

    if (clearedValue.length > 4) {
      clearedValue = clearedValue.slice(0, 4)
    }

    state.cardExpiry = clearedValue
  }
})

const cardNumberFormatter = computed({
  get() {
    const value = state.cardNumber || ''
    return value.replace(/(.{4})/g, '$1 ').trim()
  },
  set(newValue) {
    state.cardNumber = newValue.replace(/\D/g, '').slice(0, 16)
  }
})

const citiesByCountry = computed(() => {
  if (!state.country) return []
  return cities.filter(city => city.country === state.country)
})

watch(() => state.country, () => {
  state.city = undefined
})

const getDiscountedShipping = (price: number) => {
  let shippingPrice = price

  if (cartStore.subtotal >= 25) {
    shippingPrice = Math.max(0, shippingPrice - 3.99)
  }

  if (promo.value?.apply === 'shipping') {
    return getDiscountedPrice(shippingPrice, promo.value.discountType, promo.value.discount)
  }
  return shippingPrice
}

const finalPrice = computed(() => {
  const shipping = getDiscountedShipping(state.shippingPrice || 0)
  const total = cartStore.subtotal + shipping

  if (promo.value?.apply === 'cartPrice') {
    return getDiscountedPrice(total, promo.value.discountType, promo.value.discount)
  }

  return total
})

const isSubmitting = ref(false)

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  if (isSubmitting.value) return
  isSubmitting.value = true

  try {
    const payload: CreateOrderEntity = {
      billingAddress: {
        email: event.data.email,
        name: event.data.name,
        lastName: event.data.lastName,
        address: event.data.address,
        postalCode: event.data.postalCode,
        city: event.data.city,
        province: event.data.province
      },
      shipping: {
        method: state.shippingPrice === 0 ? 'pickup' : state.shippingPrice === 9.99 ? 'express' : 'standard',
        price: getDiscountedShipping(state.shippingPrice || 0)
      },
      payment: {
        method: state.paymentMethod || 'credit-card'
      },
      cartItems: cartStore.products.map(item => ({
        id: item.id,
        price: item.price,
        quantity: item.quantity,
        selectedSize: item.selectedSize
      })),
      totalPrice: finalPrice.value
    }

    const response = await $fetch('/api/orders', {
      method: 'POST',
      body: payload
    })

    state.email = undefined
    state.country = undefined
    state.name = undefined
    state.lastName = undefined
    state.company = undefined
    state.address = undefined
    state.address2 = undefined
    state.postalCode = undefined
    state.city = undefined
    state.province = undefined
    state.teléfono = undefined
    state.shippingPrice = 3.99
    state.paymentMethod = 'credit-card'
    state.cardNumber = undefined
    state.cardExpiry = undefined
    state.cardCvc = undefined
    state.cardName = undefined

    cartStore.clearCart()

    if (response.success) {
      await navigateTo({
        path: '/checkout/success',
        query: { orderId: response.orderId }
      })
    }
  } catch (error) {
    console.error('Error al guardar el pedido:', error)
    toast.add({
      title: 'Error al realizar el pedido',
      description: 'No se pudo guardar el pedido en la base de datos. Por favor, inténtelo de nuevo.',
      color: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="py-12 px-5 md:py-16 md:px-12">
    <CheckoutMobileOrderResume
      class="lg:hidden mb-4"
      :shipping-price="state.shippingPrice || 0"
      :get-discounted-shipping="getDiscountedShipping"
      :final-price="finalPrice"
    />
    <UContainer>
      <div class="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div class="flex flex-col flex-1 min-w-0">
          <ClientOnly>
            <UForm
              id="checkout-form"
              :schema="schema"
              :state="state"
              :validate-on="['change', 'input']"
              class="w-full space-y-8"
              @submit="onSubmit"
            >
              <!-- Sección: Contacto -->
              <div class="space-y-4">
                <USeparator
                  label="Contacto"
                  icon="i-lucide-mail"
                />
                <UFormField
                  name="email"
                >
                  <UInput
                    id="email"
                    v-model="state.email"
                    name="email"
                    type="email"
                    placeholder="Correo electrónico"
                    size="md"
                    class="w-full"
                    autocomplete="email"
                  />
                </UFormField>
              </div>
              <!-- Sección: Envío -->
              <div class="space-y-4">
                <USeparator
                  label="Dirección de envío"
                  icon="i-lucide-map-pin"
                />
                <div class="grid grid-cols-6 gap-4">
                  <div class="col-span-6">
                    <UFormField name="country">
                      <USelect
                        id="country"
                        v-model="state.country"
                        name="country"
                        :items="countries"
                        placeholder="País"
                        class="w-full text-base"
                        autocomplete="country"
                      />
                    </UFormField>
                  </div>
                  <div class="col-span-6 sm:col-span-3">
                    <UFormField name="name">
                      <UInput
                        id="name"
                        v-model="state.name"
                        name="name"
                        placeholder="Nombre"
                        class="w-full"
                        autocomplete="given-name"
                      />
                    </UFormField>
                  </div>
                  <div class="col-span-6 sm:col-span-3">
                    <UFormField name="lastName">
                      <UInput
                        id="lastName"
                        v-model="state.lastName"
                        name="lastName"
                        placeholder="Apellidos"
                        class="w-full"
                        autocomplete="family-name"
                      />
                    </UFormField>
                  </div>
                  <div class="col-span-6">
                    <UFormField name="company">
                      <UInput
                        id="company"
                        v-model="state.company"
                        name="company"
                        placeholder="Empresa (opcional)"
                        class="w-full"
                        autocomplete="organization"
                      />
                    </UFormField>
                  </div>
                  <div class="col-span-6">
                    <UFormField name="address">
                      <UInput
                        id="address"
                        v-model="state.address"
                        name="address"
                        placeholder="Dirección"
                        class="w-full"
                        autocomplete="street-address"
                      />
                    </UFormField>
                  </div>
                  <div class="col-span-6">
                    <UFormField name="address2">
                      <UInput
                        id="address2"
                        v-model="state.address2"
                        name="address2"
                        placeholder="Apartamento, piso, etc. (opcional)"
                        class="w-full"
                        autocomplete="address-line2"
                      />
                    </UFormField>
                  </div>
                  <div class="col-span-6 sm:col-span-2">
                    <UFormField name="postalCode">
                      <UInput
                        id="postalCode"
                        v-model="state.postalCode"
                        name="postalCode"
                        placeholder="Código Postal"
                        class="w-full"
                        autocomplete="postal-code"
                      />
                    </UFormField>
                  </div>
                  <div class="col-span-6 sm:col-span-2">
                    <UFormField name="province">
                      <UInput
                        id="province"
                        v-model="state.province"
                        name="province"
                        placeholder="Provincia"
                        class="w-full"
                        autocomplete="address-level1"
                      />
                    </UFormField>
                  </div>
                  <div class="col-span-6 sm:col-span-2">
                    <UFormField name="city">
                      <USelect
                        id="city"
                        v-model="state.city"
                        name="city"
                        placeholder="Ciudad"
                        :items="citiesByCountry"
                        class="w-full text-base"
                        autocomplete="address-level2"
                      />
                    </UFormField>
                  </div>
                  <div class="col-span-6">
                    <UFormField name="teléfono">
                      <UInput
                        id="telefono"
                        v-model="state.teléfono"
                        name="telefono"
                        type="tel"
                        placeholder="Teléfono"
                        class="w-full"
                        autocomplete="tel"
                      />
                    </UFormField>
                  </div>
                </div>
              </div>

              <!-- Sección: Método de envío -->
              <div class="space-y-4">
                <USeparator
                  label="Método de envío"
                  icon="i-lucide-truck"
                />
                <UAlert
                  v-if="cartStore.subtotal >= 25"
                  variant="soft"
                  color="success"
                  icon="i-lucide-party-popper"
                  title="¡Envío gratuito estándar aplicado por superar los 25€ de compra! (o 3,99€ de descuento en Envío Express)"
                />
                <URadioGroup
                  v-model="state.shippingPrice"
                  color="primary"
                  variant="table"
                  :items="shippingMethods"
                >
                  <template #description="{ item }">
                    <span class="flex justify-between w-full gap-4">
                      <span>{{ item.description }}</span>
                      <span class="flex items-center gap-2">
                        <span
                          v-if="Number(item.value) > 0 && getDiscountedShipping(Number(item.value)) < Number(item.value)"
                          class="line-through text-gray-400 dark:text-gray-500 font-normal text-sm"
                        >
                          {{ formatCurrency(Number(item.value)) }}
                        </span>
                        <span class="font-semibold text-zinc-900 dark:text-white">
                          {{ item.value === 0 || getDiscountedShipping(Number(item.value)) === 0 ? 'Gratis' : formatCurrency(getDiscountedShipping(Number(item.value))) }}
                        </span>
                      </span>
                    </span>
                  </template>
                </URadioGroup>
              </div>

              <!-- Sección: Pago -->
              <div class="space-y-4">
                <USeparator
                  label="Método de pago"
                  icon="i-lucide-credit-card"
                />
                <URadioGroup
                  v-model="state.paymentMethod"
                  color="primary"
                  variant="table"
                  :items="paymentMethods"
                >
                  <template #label="{ item }">
                    <span class="flex justify-between w-full">
                      <span>{{ item.label }}</span>
                      <UIcon
                        v-if="item.value === 'credit-card'"
                        name="i-lucide-credit-card"
                        class="size-6"
                      />
                      <UIcon
                        v-if="item.value === 'paypal'"
                        name="i-simple-icons-paypal"
                        class="size-6"
                      />
                      <UIcon
                        v-if="item.value === 'google-pay'"
                        name="i-simple-icons-googlepay"
                        class="size-8"
                      />
                      <UIcon
                        v-if="item.value === 'apple-pay'"
                        name="i-simple-icons-applepay"
                        class="size-8"
                      />
                    </span>
                  </template>
                  <template #description="{ item }">
                    <ClientOnly>
                      <div
                        v-if="state.paymentMethod === 'credit-card' && item.value === 'credit-card'"
                        class="grid grid-cols-2 gap-4 my-4"
                      >
                        <div class="col-span-2">
                          <UFormField name="cardNumber">
                            <UInput
                              id="cardNumber"
                              v-model="cardNumberFormatter"
                              name="cardNumber"
                              type="tel"
                              placeholder="Número de tarjeta"
                              class="w-full"
                              autocomplete="cc-number"
                            />
                          </UFormField>
                        </div>
                        <div>
                          <UFormField name="cardExpiry">
                            <UInput
                              id="cardExpiry"
                              v-model="mmAAFormatter"
                              name="cardExpiry"
                              type="tel"
                              placeholder="Fecha de vencimiento (MM/AA)"
                              class="w-full"
                              autocomplete="cc-exp"
                            />
                          </UFormField>
                        </div>
                        <div>
                          <UFormField name="cardCvc">
                            <UInput
                              id="cardCvc"
                              v-model="state.cardCvc"
                              name="cardCvc"
                              type="tel"
                              placeholder="CVC"
                              class="w-full"
                              autocomplete="cc-csc"
                            />
                          </UFormField>
                        </div>
                        <div class="col-span-2">
                          <UFormField name="cardName">
                            <UInput
                              id="cardName"
                              v-model="state.cardName"
                              name="cardName"
                              placeholder="Nombre del titular"
                              class="w-full"
                              autocomplete="cc-name"
                            />
                          </UFormField>
                        </div>
                      </div>
                    </ClientOnly>
                  </template>
                </URadioGroup>
              </div>
              <div class="lg:hidden ">
                <UButton
                  type="submit"
                  color="primary"
                  variant="solid"
                  :label="`Pagar ${formatCurrency(finalPrice)}`"
                  size="xl"
                  block
                />
              </div>
            </UForm>
          </ClientOnly>
        </div>
        <UCard
          variant="subtle"
          class="sticky top-20 w-full lg:w-100 xl:w-[450px] shrink-0 hidden lg:flex flex-col"
          :ui="{ root: 'max-h-[calc(100vh-12rem)]', body: 'flex flex-col flex-1 overflow-hidden p-0 sm:p-0' }"
        >
          <template #header>
            <div class="flex flex-row justify-between">
              <p class="text-2xl font-semibold dark:text-gray-400">
                Resumen del pedido
              </p>
            </div>
          </template>
          <CheckoutOrderResumeProducts
            :shipping-price="state.shippingPrice || 0"
            :get-discounted-shipping="getDiscountedShipping"
            :final-price="finalPrice"
          />
          <template #footer>
            <UButton
              type="submit"
              form="checkout-form"
              color="primary"
              variant="solid"
              :label="`Pagar ${formatCurrency(finalPrice)}`"
              size="xl"
              block
            />
          </template>
        </UCard>
      </div>
    </UContainer>
  </section>
</template>
