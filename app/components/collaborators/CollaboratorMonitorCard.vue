<script setup lang="ts">
import type { CollaboratorStatus } from '~/types/collaborator'
import DonutChart from './DonutChart.vue'
import CollaboratorMonitorKPIs from './CollaboratorMonitorKPIs.vue'
import CollaboratorMonitorBreakdown from './CollaboratorMonitorBreakdown.vue'

const props = defineProps<{
  status: CollaboratorStatus
}>()

const user = computed(() => props.status.user)

const chartData = computed(() => {
  return Object.entries(props.status.projects || {})
    .map(([name, projStatus]) => ({
      label: name,
      value: projStatus.current_real_hours,
      color: projStatus.project?.color || '#cccccc'
    }))
    .filter(item => item.value > 0)
})

const isChartEmpty = computed(() => chartData.value.length === 0)

const finalChartData = computed(() => {
  if (isChartEmpty.value) {
    return [{ label: 'Sin horas registradas', value: 1, color: '#e5e7eb' }]
  }
  return chartData.value
})

const totalHours = computed(() => {
  return props.status.stats.general?.total_hours ?? 0
})

const totalHoursLabel = computed(() => {
  return `${totalHours.value.toFixed(1)}h`
})
</script>

<template>
  <div class="flex flex-col bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden group">
    <!-- Profile details -->
    <div class="p-5 flex items-center justify-center gap-4 border-b border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-950/20">
      <UAvatar
        :src="user?.image"
        :alt="user?.fullname as string"
        :label="(user?.fullname as string).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)"
        size="lg"
        class="ring-2 ring-primary-500/20 dark:ring-primary-500/40"
      />
      <div class="overflow-hidden">
        <h3 class="font-semibold text-neutral-900 dark:text-white truncate text-base leading-tight">
          {{ user?.fullname }}
        </h3>
      </div>
    </div>

    <div class="p-5 flex-1 flex flex-col space-y-5">
      <!-- Doughnut Chart -->
      <div>
        <DonutChart
          :data="finalChartData"
          :total-label="totalHoursLabel"
        />
      </div>

      <!-- Project Breakdown -->
      <CollaboratorMonitorBreakdown
        :projects="chartData"
        :total-hours="totalHours"
      />

      <!-- KPIs Section -->
      <div class="pt-2">
        <CollaboratorMonitorKPIs :status="status" />
      </div>
    </div>
  </div>
</template>
