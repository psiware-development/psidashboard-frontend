<script setup lang="ts">
import type { ProjectUserStoryRow } from '~/types/project'
import type { TableColumn } from '@nuxt/ui'

defineProps<{
  rows: ProjectUserStoryRow[]
}>()

const columns: TableColumn<ProjectUserStoryRow>[] = [
  { accessorKey: 'sprint', header: 'Sprint' },
  { accessorKey: 'subject', header: 'US' },
  { accessorKey: 'status', header: 'Estado' },
  { accessorKey: 'points', header: 'Puntos' },
  { accessorKey: 'realHours', header: 'Horas Reales' },
  { accessorKey: 'ratio', header: 'Ratio' },
  { accessorKey: 'assignedUser', header: 'Responsable' }
]

const ratioColor = {
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
  neutral: 'text-muted'
} as const
</script>

<template>
  <UTable :data="rows" :columns="columns">
    <template #sprint-cell="{ row }">
      <a
        v-if="row.original.link"
        :href="row.original.link"
        target="_blank"
        rel="noopener noreferrer"
        class="font-semibold text-primary hover:underline"
      >
        {{ row.original.sprint }}
      </a>
      <span v-else>{{ row.original.sprint }}</span>
    </template>

    <template #subject-cell="{ row }">
      <div class="flex items-center gap-2 min-w-[220px]">
        <span
          v-if="row.original.epicColor"
          class="size-3 rounded-full shrink-0"
          :style="{ backgroundColor: row.original.epicColor }"
        />
        <span class="line-clamp-2">{{ row.original.subject }}</span>
      </div>
    </template>

    <template #status-cell="{ row }">
      <TaskStatusBadge :status="row.original.status" />
    </template>

    <template #ratio-cell="{ row }">
      <span :class="ratioColor[row.original.ratio.tone]">
        {{ row.original.ratio.value }}
      </span>
    </template>

    <template #assignedUser-cell="{ row }">
      <div v-if="row.original.assignedUser" class="flex items-center gap-2">
        <UAvatar
          :src="row.original.assignedUser.image"
          :alt="row.original.assignedUser.fullname"
          size="xs"
        />
        <span class="truncate">{{ row.original.assignedUser.fullname }}</span>
      </div>
      <span v-else>-</span>
    </template>
  </UTable>
</template>
