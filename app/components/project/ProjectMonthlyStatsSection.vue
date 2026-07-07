<script setup lang="ts">
import type { ProjectMonthlyStatItem } from '~/types/project'

defineProps<{
  title: string
  items: ProjectMonthlyStatItem[]
  loading?: boolean
}>()
</script>

<template>
  <section class="space-y-4">
    <h2 class="text-xl font-semibold text-center">
      {{ title }}
    </h2>

    <div
      v-if="loading"
      class="grid gap-3 sm:grid-cols-2"
    >
      <USkeleton
        v-for="index in 4"
        :key="index"
        class="h-24 rounded-lg"
      />
    </div>

    <div
      v-else
      class="grid gap-3 sm:grid-cols-2"
    >
      <UCard
        v-for="item in items"
        :key="item.label"
        :ui="{ body: 'py-4' }"
      >
        <p class="text-3xl font-bold text-highlighted">
          {{ item.value }}
        </p>
        <p class="text-sm text-muted mt-2">
          {{ item.label }}
        </p>
      </UCard>
    </div>
  </section>
</template>
