<template>
  <div>
    <AppHeader />
    <UMain>
      <UContainer class="py-12 px-5 md:px-12">
        <AppBreadcrumb class="mb-8" />
        <slot />
      </UContainer>
    </UMain>
    <AppFooter />
  </div>
</template>
