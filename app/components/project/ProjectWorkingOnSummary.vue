<script setup lang="ts">
defineProps<{
  issues: number
  userStories: number
  loading?: boolean
}>()
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2">
    <UCard :ui="{ body: 'text-center py-6' }">
      <USkeleton v-if="loading" class="h-16 mx-auto max-w-24" />
      <template v-else>
        <p class="text-4xl font-bold text-primary">{{ issues }}</p>
        <p class="text-sm text-muted mt-2">Issues</p>
      </template>
    </UCard>

    <UCard :ui="{ body: 'text-center py-6' }">
      <USkeleton v-if="loading" class="h-16 mx-auto max-w-24" />
      <template v-else>
        <p class="text-4xl font-bold text-primary">{{ userStories }}</p>
        <p class="text-sm text-muted mt-2">US</p>
      </template>
    </UCard>
  </div>
</template>
