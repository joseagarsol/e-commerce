<script setup lang="ts">
import type { FormSubmitEvent, SelectItem } from '@nuxt/ui'
import type { Promotion } from '~/types/promotion'
import * as z from 'zod'

interface AddCouponModalProps {
  coupon?: Promotion | null
}

const props = defineProps<AddCouponModalProps>()

const emit = defineEmits<{
  (e: 'success' | 'cancel'): void
}>()

const isSubmitting = ref(false)
const toast = useToast()

const schema = z.object({
  code: z.string()
    .min(3, { error: 'El código debe tener al menos 3 caracteres' })
    .regex(/^[A-Z0-9_-]+$/,
      { error: 'El código solo puede contener letras mayúsculas, números, guiones y guiones bajos' }),
  discountType: z.enum(['percent', 'price'], {
    error: 'Debes seleccionar un tipo de descuento'
  }),
  apply: z.enum(['shipping', 'cartPrice'], {
    error: 'Debes seleccionar a qué se aplica'
  }),
  discount: z.number({ error: 'El descuento debe ser un número' })
    .positive({ error: 'El descuento debe ser mayor que 0' })
}).refine((data) => {
  if (data.discountType === 'percent') {
    return data.discount <= 100
  }
  return true
}, {
  error: 'El descuento porcentual no puede superar el 100%',
  path: ['discount']
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  code: props.coupon?.code || '',
  discountType: props.coupon?.discountType || 'percent',
  apply: props.coupon?.apply || 'cartPrice',
  discount: props.coupon?.discount || undefined
})

const discountTypeItems: SelectItem[] = [
  { label: 'Porcentaje (%)', value: 'percent' },
  { label: 'Precio Fijo (€)', value: 'price' }
]

const applyItems: SelectItem[] = [
  { label: 'Total de la compra', value: 'cartPrice' },
  { label: 'Gastos de envío', value: 'shipping' }
]

watch(() => state.code, (newVal) => {
  if (newVal) {
    state.code = newVal.toUpperCase().replace(/[^A-Z0-9_-]/g, '')
  }
})

watch(() => props.coupon, (newCoupon) => {
  state.code = newCoupon?.code || ''
  state.discountType = newCoupon?.discountType || 'percent'
  state.apply = newCoupon?.apply || 'cartPrice'
  state.discount = newCoupon?.discount || undefined
})

const discountLabel = computed(() => {
  return state.discountType === 'percent' ? 'Valor del descuento (%)' : 'Valor del descuento (€)'
})

const discountPlaceholder = computed(() => {
  return state.discountType === 'percent' ? 'Ej. 15' : 'Ej. 10.00'
})

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  if (isSubmitting.value) return
  isSubmitting.value = true

  try {
    const payload = {
      code: event.data.code,
      discountType: event.data.discountType,
      apply: event.data.apply,
      discount: event.data.discount
    }

    if (props.coupon) {
      await $fetch(`/api/discount-codes/${props.coupon.id}`, {
        method: 'PUT',
        body: payload
      })
      toast.add({
        title: 'Cupón actualizado',
        description: '¡Cupón actualizado con éxito!',
        color: 'success'
      })
    } else {
      await $fetch('/api/discount-codes', {
        method: 'POST',
        body: payload
      })
      state.code = ''
      state.discountType = 'percent'
      state.apply = 'cartPrice'
      state.discount = undefined
      toast.add({
        title: 'Cupón creado',
        description: '¡Cupón creado con éxito!',
        color: 'success'
      })
    }

    emit('success')
  } catch (error) {
    console.error('Error al guardar el cupón:', error)
    toast.add({
      title: 'Error al guardar',
      description: 'No se pudo guardar el cupón en la base de datos',
      color: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    :validate-on="['change']"
    class="space-y-5"
    @submit="onSubmit"
  >
    <UFormField
      label="Código del cupón"
      name="code"
    >
      <UInput
        v-model="state.code"
        placeholder="Ej. SUMMER2026"
        class="w-full font-mono uppercase tracking-wider"
      />
    </UFormField>

    <div class="grid grid-cols-2 gap-4">
      <UFormField
        label="Tipo de descuento"
        name="discountType"
      >
        <USelect
          v-model="state.discountType"
          :items="discountTypeItems"
          class="w-full"
        />
      </UFormField>

      <UFormField
        :label="discountLabel"
        name="discount"
      >
        <UInputNumber
          v-model="state.discount"
          :step="state.discountType === 'percent' ? 1 : 0.01"
          :placeholder="discountPlaceholder"
          orientation="vertical"
          class="w-full"
        />
      </UFormField>
    </div>

    <UFormField
      label="Se aplica a"
      name="apply"
    >
      <USelect
        v-model="state.apply"
        :items="applyItems"
        class="w-full"
      />
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
        :label="coupon ? 'Guardar Cambios' : 'Crear Cupón'"
        color="primary"
        class="cursor-pointer"
        :loading="isSubmitting"
      />
    </div>
  </UForm>
</template>
