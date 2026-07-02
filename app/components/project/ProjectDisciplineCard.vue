<script setup lang="ts">
import type { ProjectDiscipline } from '~/types/project'

defineProps<{
  discipline: ProjectDiscipline
}>()
</script>

<template>
  <UCard>
    <div class="space-y-3 text-center">
      <p class="text-xl font-semibold text-highlighted">
        {{ discipline.label }}
      </p>

      <USeparator class="border-primary/30" />

      <p class="text-left text-sm text-muted">
        Horas en total
      </p>

      <div class="flex items-end justify-between gap-3">
        <p>
          <span class="text-3xl font-bold text-primary">{{ discipline.hours }}</span>
          <span class="text-sm text-primary ml-1">hs</span>
        </p>
        <p>
          <span class="text-xl font-bold text-primary">{{ discipline.percentage }}</span>
          <span class="text-sm text-primary ml-1">%</span>
        </p>
      </div>
    </div>
  </UCard>
</template>
