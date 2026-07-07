<script setup lang="ts">
import type { ProjectWorkingOnTask } from '~/types/project'
import { getTaskStatus } from '~/utils/taskStatus'

const props = defineProps<{
  tasks: ProjectWorkingOnTask[]
  loading?: boolean
}>()

const statusCounts = computed(() => {
  const counts = new Map<string, number>()

  for (const task of props.tasks) {
    const label = getTaskStatus(task.status).label
    counts.set(label, (counts.get(label) ?? 0) + 1)
  }

  return [...counts.entries()].sort((a, b) => b[1] - a[1])
})

const projectCounts = computed(() => {
  const counts = new Map<string, number>()

  for (const task of props.tasks) {
    const label = task.project?.description ?? 'Sin proyecto'
    counts.set(label, (counts.get(label) ?? 0) + 1)
  }

  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6)
})
</script>

<template>
  <div class="grid gap-4 lg:grid-cols-2">
    <UCard>
      <template #header>
        <h3 class="font-semibold">
          Por estado
        </h3>
      </template>

      <div
        v-if="loading"
        class="space-y-2"
      >
        <USkeleton
          v-for="index in 4"
          :key="index"
          class="h-8"
        />
      </div>

      <ul
        v-else-if="statusCounts.length > 0"
        class="space-y-2"
      >
        <li
          v-for="[label, count] in statusCounts"
          :key="label"
          class="flex items-center justify-between text-sm"
        >
          <span>{{ label }}</span>
          <UBadge
            color="neutral"
            variant="subtle"
          >
            {{ count }}
          </UBadge>
        </li>
      </ul>

      <p
        v-else
        class="text-sm text-muted"
      >
        Sin tareas para mostrar.
      </p>
    </UCard>

    <UCard>
      <template #header>
        <h3 class="font-semibold">
          Por proyecto
        </h3>
      </template>

      <div
        v-if="loading"
        class="space-y-2"
      >
        <USkeleton
          v-for="index in 4"
          :key="index"
          class="h-8"
        />
      </div>

      <ul
        v-else-if="projectCounts.length > 0"
        class="space-y-2"
      >
        <li
          v-for="[label, count] in projectCounts"
          :key="label"
          class="flex items-center justify-between gap-3 text-sm"
        >
          <span class="line-clamp-1">{{ label }}</span>
          <UBadge
            color="neutral"
            variant="subtle"
          >
            {{ count }}
          </UBadge>
        </li>
      </ul>

      <p
        v-else
        class="text-sm text-muted"
      >
        Sin tareas para mostrar.
      </p>
    </UCard>
  </div>
</template>
