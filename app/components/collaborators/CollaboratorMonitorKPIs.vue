<script setup lang="ts">
import type { CollaboratorStatus } from '~/types/collaborator'

const props = defineProps<{
  status: CollaboratorStatus
}>()

const formatNumber = (val: string | number | undefined, suffix = ''): string => {
  if (val === undefined || val === null || val === 'NaN') return '-'
  const num = Number(val)
  if (isNaN(num)) return '-'
  return `${num.toLocaleString(undefined, { maximumFractionDigits: 1 })}${suffix}`
}

const diffPlanificacion = computed(() => {
  return props.status.personal_planification?.total_diff_nominal ?? 0
})

const diffClass = computed(() => {
  if (diffPlanificacion.value > 0) return 'text-emerald-600 dark:text-emerald-400 font-semibold'
  if (diffPlanificacion.value < 0) return 'text-rose-600 dark:text-rose-400 font-semibold'
  return 'text-neutral-500 dark:text-neutral-400'
})

const formattedDiff = computed(() => {
  const val = diffPlanificacion.value
  return val > 0 ? `+${val}h` : `${val}h`
})
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
    <!-- Tickets Done -->
    <div class="flex flex-col p-2 bg-white">
      <span class="text-[10px] uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500 mb-0.5">
        Tickets Done
      </span>
      <span class="text-base font-bold text-neutral-850 dark:text-neutral-200">
        {{ status.stats.tickets?.tickets_done ?? '-' }}
      </span>
    </div>

    <!-- Issues Ratio -->
    <div class="flex flex-col p-2 bg-white">
      <span class="text-[10px] uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500 mb-0.5">
        Issues Ratio
      </span>
      <span class="text-base font-bold text-neutral-850 dark:text-neutral-200">
        {{ formatNumber(status.stats.general?.issues_ratio_hours, 'h') }}
      </span>
    </div>

    <!-- Worked Tickets -->
    <div class="flex flex-col p-2 bg-white">
      <span class="text-[10px] uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500 mb-0.5">
        Worked Tickets
      </span>
      <span class="text-base font-bold text-neutral-850 dark:text-neutral-200">
        {{ status.stats.tickets?.worked_tickets ?? '-' }}
      </span>
    </div>

    <!-- Ratio Hs/Point -->
    <div class="flex flex-col p-2 bg-white">
      <span class="text-[10px] uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500 mb-0.5">
        Ratio (Hs/Pt)
      </span>
      <span class="text-base font-bold text-neutral-850 dark:text-neutral-200">
        {{ formatNumber(status.stats.general?.ratio_uss_points_hours) }}
      </span>
    </div>

    <!-- Delivered Points -->
    <div class="flex flex-col p-2 bg-white">
      <span class="text-[10px] uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500 mb-0.5">
        Delivered Pts
      </span>
      <span class="text-base font-bold text-neutral-850 dark:text-neutral-200">
        {{ status.stats.general?.total_delivered_points ?? '-' }}
      </span>
    </div>

    <!-- Diff Planificación -->
    <div class="flex flex-col p-2 bg-white">
      <span class="text-[10px] uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500 mb-0.5">
        Diff Planif
      </span>
      <span
        class="text-base font-bold"
        :class="diffClass"
      >
        {{ formattedDiff }}
      </span>
    </div>
  </div>
</template>
