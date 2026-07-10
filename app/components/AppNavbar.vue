<script setup lang="ts">
const isExpanded = defineModel<boolean>('isExpanded', { default: true })
defineProps<{
  isMobile: boolean
}>()

const authStore = useAuthStore()
</script>

<template>
  <header class="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur px-4 md:px-6">
    <div class="flex items-center gap-3">
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-menu"
        class="focus:outline-none"
        aria-label="Toggle Navigation Sidebar"
        @click="isExpanded = !isExpanded"
      />
      <AppSiteLogo />
    </div>

    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2">
        <NuxtLink
          to="/me"
        >
          <UAvatar
            :src="authStore.currentUser?.image"
            :alt="authStore.displayName"
            size="sm"
          />
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
