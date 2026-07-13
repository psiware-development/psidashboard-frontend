<script setup lang="ts">
defineProps<{
  loading: boolean
  isEmpty: boolean
  emptyIcon?: string
  emptyText?: string
}>()
</script>

<template>
  <UCard :ui="{ body: 'p-0' }">
    <!-- Loading skeleton -->
    <div
      v-if="loading"
      class="divide-y divide-default"
    >
      <div
        v-for="i in 5"
        :key="i"
        class="flex items-center gap-4 px-6 py-4"
      >
        <div class="flex-1 space-y-2">
          <USkeleton class="h-4 w-48" />
          <USkeleton class="h-3 w-64" />
        </div>
        <USkeleton class="h-6 w-20 rounded-full" />
        <USkeleton class="h-8 w-8" />
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="isEmpty"
      class="flex flex-col items-center justify-center py-16 gap-3"
    >
      <UIcon
        v-if="emptyIcon"
        :name="emptyIcon"
        class="w-10 h-10 text-neutral-300 dark:text-neutral-600"
      />
      <p class="text-sm text-muted">
        {{ emptyText ?? 'No hay registros.' }}
      </p>
    </div>

    <!-- Column headers + rows -->
    <div v-else>
      <slot name="headers" />

      <div class="divide-y divide-default">
        <slot />
      </div>
    </div>
  </UCard>
</template>
