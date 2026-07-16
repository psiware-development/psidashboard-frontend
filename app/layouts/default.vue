<template>
  <div class="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
    <AppNavbar
      v-model:is-expanded="isExpanded"
      :is-mobile="isMobile"
    />

    <div class="flex flex-1 relative">
      <AppSidebar
        v-model:is-expanded="isExpanded"
        :is-mobile="isMobile"
      />

      <main class="flex-1 min-w-0 transition-all duration-300">
        <div class="px-4 md:px-6 pt-4 pb-2">
          <AppBreadcrumb />
        </div>
        <div class="p-4 md:p-6">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const isExpanded = ref(true)
const isMobile = ref(false)

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768
  if (isMobile.value) {
    isExpanded.value = false
  } else {
    isExpanded.value = true
  }
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>
