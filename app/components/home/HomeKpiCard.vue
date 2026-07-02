<script setup lang="ts">
import type { KpiItem } from '~/types/dashboard'

defineProps<{
  kpi: KpiItem
}>()
</script>

<template>
  <UCard
    :ui="{
      body: 'flex flex-col items-center justify-center text-center p-4 min-h-32'
    }"
  >
    <p class="text-3xl font-bold text-primary leading-none">
      {{ kpi.value != null ? Math.round(kpi.value) : '-' }}
    </p>
    <p class="mt-2 text-xs text-muted line-clamp-3">
      {{ kpi.description }}
    </p>
  </UCard>
</template>
