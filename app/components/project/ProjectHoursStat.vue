<script setup lang="ts">
defineProps<{
  label: string
  value: number
  tone: 'success' | 'warning' | 'error'
}>()

const toneClasses = {
  success: 'bg-success/10 border-success/20',
  warning: 'bg-warning/10 border-warning/20',
  error: 'bg-error/10 border-error/20'
} as const
</script>

<template>
  <div
    class="rounded-lg border p-4 text-center"
    :class="toneClasses[tone]"
  >
    <p class="text-sm text-muted mb-2">
      {{ label }}
    </p>
    <p class="text-3xl font-bold text-highlighted">
      {{ value }}
    </p>
  </div>
</template>
