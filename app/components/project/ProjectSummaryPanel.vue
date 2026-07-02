<script setup lang="ts">
defineProps<{
  plannedHours: number
  declaredHours: number
  progress: number
  currentMonth: string
  loading?: boolean
}>()
</script>

<template>
  <UCard>
    <div v-if="loading" class="space-y-4">
      <USkeleton class="h-8 w-32" />
      <USkeleton class="h-24 w-full" />
      <USkeleton class="h-4 w-full" />
    </div>

    <div v-else class="space-y-6">
      <div>
        <p class="text-4xl font-bold text-highlighted">
          {{ plannedHours }}
        </p>
        <p class="text-sm text-primary font-medium">
          Horas planificadas
        </p>
        <p class="text-sm text-muted mt-2">
          Mes: <span class="font-semibold text-highlighted">{{ currentMonth }}</span>
        </p>
      </div>

      <USeparator />

      <div class="space-y-2">
        <div class="flex items-center justify-between text-sm">
          <span class="text-muted">Progreso</span>
          <span class="font-semibold">{{ progress }}%</span>
        </div>
        <UProgress :model-value="progress" color="primary" size="md" />
        <p class="text-sm text-muted">
          Declaradas: <span class="font-semibold text-highlighted">{{ declaredHours }}</span>
        </p>
      </div>
    </div>
  </UCard>
</template>
