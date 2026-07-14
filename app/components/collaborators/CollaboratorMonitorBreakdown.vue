<script setup lang="ts">
interface BreakdownItem {
  label: string
  value: number
  color: string
}

const props = defineProps<{
  projects: BreakdownItem[]
  totalHours: number
}>()

const isEmpty = computed(() => props.projects.length === 0)
</script>

<template>
  <div class="flex-1 overflow-y-auto max-h-36 pr-1 space-y-2">
    <p class="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">
      Distribución de Horas
    </p>
    <template v-if="!isEmpty">
      <div
        v-for="project in projects"
        :key="project.label"
        class="flex items-center justify-between gap-3 text-xs"
      >
        <div class="flex items-center gap-2 truncate">
          <span
            class="w-2.5 h-2.5 rounded-full flex-shrink-0"
            :style="{ backgroundColor: project.color }"
          />
          <span class="text-neutral-600 dark:text-neutral-300 truncate font-medium">
            {{ project.label }}
          </span>
        </div>
        <span class="text-neutral-900 dark:text-white font-semibold flex-shrink-0">
          {{ project.value.toFixed(1) }}h ({{ totalHours > 0 ? ((project.value / totalHours) * 100).toFixed(0) : 0 }}%)
        </span>
      </div>
    </template>
    <template v-else>
      <div class="text-center py-6 text-xs text-neutral-400 dark:text-neutral-500 italic">
        Sin horas registradas este mes.
      </div>
    </template>
  </div>
</template>
