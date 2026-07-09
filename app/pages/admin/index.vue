<script setup lang="ts">
import type { Product } from '~/types/product'
import type { Promotion } from '~/types/promotion'
import type { OrderResponseDTO } from '~~/server/dtos/order.dto'
import { FetchError } from 'ofetch'

const toast = useToast()

const isConfirmDeleteOpen = ref(false)
const isDeleting = ref(false)
const itemToDelete = ref<{ type: 'product' | 'collection' | 'coupon', id: string } | null>(null)

definePageMeta({
  middleware: 'admin'
})

const { data: adminData, refresh } = await useAsyncData('admin-dashboard', async () => {
  const headers = useRequestHeaders(['cookie'])
  const [products, collections, coupons, orders] = await Promise.all([
    $fetch<Product[]>('/api/products', { headers }),
    $fetch<Collection[]>('/api/collections', { headers }),
    $fetch<Promotion[]>('/api/discount-codes', { headers }),
    $fetch<OrderResponseDTO[]>('/api/orders', { headers })
  ])
  return { products, collections, coupons, orders }
})

const products = computed(() => adminData.value?.products ?? [])
const collections = computed(() => adminData.value?.collections ?? [])
const coupons = computed(() => adminData.value?.coupons ?? [])
const orders = computed(() => adminData.value?.orders ?? [])

const tabs = [
  { label: 'Prendas', icon: 'i-lucide-shirt', slot: 'products' },
  { label: 'Colecciones', icon: 'i-lucide-folder-open', slot: 'collections' },
  { label: 'Cupones de Descuento', icon: 'i-lucide-tag', slot: 'coupons' },
  { label: 'Pedidos', icon: 'i-lucide-shopping-cart', slot: 'orders' }
]

const selectedProduct = ref<Product | null>(null)
const selectedCollection = ref<Collection | null>(null)
const selectedCoupon = ref<Promotion | null>(null)

const confirmDelete = (type: 'product' | 'collection' | 'coupon', id: string) => {
  itemToDelete.value = { type, id }
  isConfirmDeleteOpen.value = true
}

const executeDelete = async () => {
  if (!itemToDelete.value) return
  isDeleting.value = true
  const { type, id } = itemToDelete.value
  try {
    let url = ''
    let entityName = ''
    if (type === 'product') {
      url = `/api/products/${id}`
      entityName = 'prenda'
    } else if (type === 'collection') {
      url = `/api/collections/${id}`
      entityName = 'colección'
    } else if (type === 'coupon') {
      url = `/api/discount-codes/${id}`
      entityName = 'cupón'
    }

    await $fetch(url, { method: 'DELETE' })
    await refresh()

    toast.add({
      title: 'Eliminado con éxito',
      description: `La ${entityName} ha sido eliminada correctamente de la base de datos.`,
      color: 'success'
    })
  } catch (error) {
    console.error(`Error al eliminar ${type}:`, error)
    let errorMessage = 'No se pudo eliminar de la base de datos.'
    if (error instanceof FetchError && error.data?.statusMessage) {
      errorMessage = error.data.statusMessage
    }
    toast.add({
      title: 'Error al eliminar',
      description: errorMessage,
      color: 'error'
    })
  } finally {
    isDeleting.value = false
    isConfirmDeleteOpen.value = false
    itemToDelete.value = null
  }
}

const handleDeleteProduct = (id: string) => confirmDelete('product', id)
const handleDeleteCollection = (id: string) => confirmDelete('collection', id)
const handleDeleteCoupon = (id: string) => confirmDelete('coupon', id)

const handleEditProduct = (product: Product) => {
  isAddProductOpen.value = true
  selectedProduct.value = product
}

const handleEditCollection = (collection: Collection) => {
  isAddCollectionOpen.value = true
  selectedCollection.value = collection
}

const handleEditCoupon = (coupon: Promotion) => {
  isAddCouponOpen.value = true
  selectedCoupon.value = coupon
}

const handleSuccessAction = () => {
  isAddProductOpen.value = false
  selectedProduct.value = null
  refresh()
}

const handleSuccessCollectionAction = () => {
  isAddCollectionOpen.value = false
  selectedCollection.value = null
  refresh()
}

const handleSuccessCouponAction = () => {
  isAddCouponOpen.value = false
  selectedCoupon.value = null
  refresh()
}

const handleUpdateOrderStatus = async (id: string, newStatus: string) => {
  try {
    await $fetch(`/api/orders/${id}/status`, {
      method: 'PUT',
      body: { status: newStatus }
    })
    await refresh()
    toast.add({
      title: 'Estado actualizado',
      description: 'El estado del pedido se ha actualizado correctamente.',
      color: 'success'
    })
  } catch (error) {
    console.error('Error updating order status:', error)
    toast.add({
      title: 'Error de actualización',
      description: 'No se pudo actualizar el estado del pedido en la base de datos.',
      color: 'error'
    })
  }
}

const isAddProductOpen = ref(false)
const isAddCollectionOpen = ref(false)
const isAddCouponOpen = ref(false)

watch(isAddProductOpen, (isOpen) => {
  if (!isOpen) {
    selectedProduct.value = null
  }
})

watch(isAddCollectionOpen, (isOpen) => {
  if (!isOpen) {
    selectedCollection.value = null
  }
})

watch(isAddCouponOpen, (isOpen) => {
  if (!isOpen) {
    selectedCoupon.value = null
  }
})
</script>

<template>
  <div class="py-12 px-5 md:py-16 md:px-12 max-w-7xl mx-auto space-y-12">
    <div class="space-y-2">
      <h1 class="font-serif italic font-light text-4xl md:text-5xl text-zinc-900 dark:text-white leading-tight">
        Panel de Control
      </h1>
      <p class="text-sm text-zinc-500 dark:text-zinc-400 tracking-wide">
        Gestiona el stock, colecciones y códigos de descuento de tu e-commerce.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <UCard class="shadow-sm border border-zinc-100 dark:border-zinc-800">
        <div class="flex items-center gap-4">
          <div class="flex items-center justify-center p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-900 dark:text-white">
            <UIcon
              name="i-lucide-shirt"
              class="size-6"
            />
          </div>
          <div>
            <p class="text-xs uppercase tracking-widest text-zinc-400 font-medium">
              Prendas en Stock
            </p>
            <p class="text-3xl font-bold text-zinc-900 dark:text-white mt-1">
              {{ products?.length || 0 }}
            </p>
          </div>
        </div>
      </UCard>

      <UCard class="shadow-sm border border-zinc-100 dark:border-zinc-800">
        <div class="flex items-center gap-4">
          <div class="flex items-center justify-center p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-900 dark:text-white">
            <UIcon
              name="i-lucide-folder-open"
              class="size-6"
            />
          </div>
          <div>
            <p class="text-xs uppercase tracking-widest text-zinc-400 font-medium">
              Colecciones activas
            </p>
            <p class="text-3xl font-bold text-zinc-900 dark:text-white mt-1">
              {{ collections?.length || 0 }}
            </p>
          </div>
        </div>
      </UCard>

      <UCard class="shadow-sm border border-zinc-100 dark:border-zinc-800">
        <div class="flex items-center gap-4">
          <div class="flex items-center justify-center p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-900 dark:text-white">
            <UIcon
              name="i-lucide-tag"
              class="size-6"
            />
          </div>
          <div>
            <p class="text-xs uppercase tracking-widest text-zinc-400 font-medium">
              Cupones Activos
            </p>
            <p class="text-3xl font-bold text-zinc-900 dark:text-white mt-1">
              {{ coupons?.length || 0 }}
            </p>
          </div>
        </div>
      </UCard>
    </div>

    <UTabs
      :items="tabs"
      class="w-full"
    >
      <template #products>
        <div class="py-6 space-y-6">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold text-zinc-900 dark:text-white">
              Listado de Prendas
            </h2>
            <UModal
              v-model:open="isAddProductOpen"
              title="Añadir Nueva Prenda"
              :close="{
                color: 'neutral',
                variant: 'outline',
                class: 'rounded-full cursor-pointer'
              }"
            >
              <UButton
                label="Añadir Prenda"
                icon="i-lucide-plus"
                size="md"
                class="cursor-pointer"
                @click="() => { isAddProductOpen = true }"
              />
              <template #body>
                <AdminAddProductModal
                  :collections="collections || []"
                  :product="selectedProduct"
                  @success="handleSuccessAction"
                  @cancel="isAddProductOpen = false"
                />
              </template>
            </UModal>
          </div>
          <AdminProductsTable
            :products="products"
            @delete="handleDeleteProduct"
            @edit="handleEditProduct"
          />
        </div>
      </template>

      <template #collections>
        <div class="py-6 space-y-6">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold text-zinc-900 dark:text-white">
              Colecciones Disponibles
            </h2>
            <UModal
              v-model:open="isAddCollectionOpen"
              title="Añadir Nueva Colección"
              :close="{
                color: 'neutral',
                variant: 'outline',
                class: 'rounded-full cursor-pointer'
              }"
            >
              <UButton
                label="Nueva Colección"
                icon="i-lucide-plus"
                size="md"
                class="cursor-pointer"
                @click="() => { isAddCollectionOpen = true }"
              />
              <template #body>
                <AdminAddCollectionModal
                  :collection="selectedCollection"
                  @success="handleSuccessCollectionAction"
                  @cancel="isAddCollectionOpen = false"
                />
              </template>
            </UModal>
          </div>
          <AdminCollectionsTable
            :collections="collections"
            @delete="handleDeleteCollection"
            @edit="handleEditCollection"
          />
        </div>
      </template>

      <template #coupons>
        <div class="py-6 space-y-6">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold text-zinc-900 dark:text-white">
              Códigos de Descuento
            </h2>
            <UModal
              v-model:open="isAddCouponOpen"
              title="Añadir Nuevo Cupón"
              :close="{
                color: 'neutral',
                variant: 'outline',
                class: 'rounded-full cursor-pointer'
              }"
            >
              <UButton
                label="Nuevo Cupón"
                icon="i-lucide-plus"
                size="md"
                class="cursor-pointer"
                @click="() => { isAddCouponOpen = true }"
              />
              <template #body>
                <AdminAddCouponModal
                  :coupon="selectedCoupon"
                  @success="handleSuccessCouponAction"
                  @cancel="isAddCouponOpen = false"
                />
              </template>
            </UModal>
          </div>
          <AdminDiscountCodesTable
            :coupons="coupons"
            @delete="handleDeleteCoupon"
            @edit="handleEditCoupon"
          />
        </div>
      </template>
      <template #orders>
        <div class="py-6 space-y-6">
          <AdminOrdersTable
            :orders="orders"
            @update-status="handleUpdateOrderStatus"
          />
        </div>
      </template>
    </UTabs>

    <!-- Modal de Confirmación de Eliminación -->
    <UModal
      v-model:open="isConfirmDeleteOpen"
      title="Confirmar eliminación"
      description="¿Estás seguro de que deseas eliminar este elemento de forma permanente? Esta acción no se puede deshacer."
      :close="{
        color: 'neutral',
        variant: 'outline',
        class: 'rounded-full cursor-pointer'
      }"
    >
      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton
            label="Cancelar"
            color="neutral"
            variant="ghost"
            class="cursor-pointer"
            @click="() => { isConfirmDeleteOpen = false }"
          />
          <UButton
            label="Eliminar"
            color="error"
            :loading="isDeleting"
            class="cursor-pointer"
            @click="executeDelete"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
