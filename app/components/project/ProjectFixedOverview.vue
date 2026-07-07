<script setup lang="ts">
import type { ProjectFixedStats } from '~/types/project'

defineProps<{
  stats: ProjectFixedStats | null
  projectId: number
  plannedHours: number
  declaredHours: number
  progress: number
  downloadingReport?: boolean
}>()

defineEmits<{
  downloadReport: []
}>()
</script>

<template>
  <div class="grid gap-6 lg:grid-cols-2">
    <UCard>
      <div class="space-y-4">
        <h3 class="font-semibold text-lg">
          Horas
        </h3>
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <p class="text-3xl font-bold">
              {{ stats?.total_planned_hours ?? plannedHours }}
            </p>
            <p class="text-sm text-muted">
              Horas planificadas
            </p>
          </div>
          <div>
            <p class="text-3xl font-bold">
              {{ stats?.total_real_hours ?? declaredHours }}
            </p>
            <p class="text-sm text-muted">
              Horas declaradas
            </p>
          </div>
        </div>
        <UProgress
          :model-value="progress"
          color="primary"
        />
      </div>
    </UCard>

    <UCard>
      <div class="space-y-4">
        <h3 class="font-semibold text-lg">
          Puntos
        </h3>
        <p class="text-3xl font-bold">
          {{ stats?.total_points ?? 0 }} / {{ stats?.budget_points ?? 0 }}
        </p>
        <p class="text-sm text-muted">
          Puntos planificados / según presupuesto
        </p>
        <p class="text-sm">
          Horas estimadas según puntos faltantes:
          <span class="font-semibold">{{ stats?.estimate_remaining_hours ?? 0 }}</span>
        </p>
      </div>
    </UCard>

    <div class="lg:col-span-2">
      <ProjectActionsPanel
        :project-id="projectId"
        :downloading-report="downloadingReport"
        @download-report="$emit('downloadReport')"
      />
    </div>
  </div>
</template>
