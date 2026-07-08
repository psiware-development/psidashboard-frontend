<script setup lang="ts">
import type { WorkingOnRow } from '~/types/dashboard'
import type { TableColumn } from '@nuxt/ui'

defineProps<{
  rows: WorkingOnRow[]
  loading?: boolean
}>()

const columns: TableColumn<WorkingOnRow>[] = [
  { accessorKey: 'ref', header: 'Tarea' },
  { accessorKey: 'project', header: 'Proyecto' },
  { accessorKey: 'subject', header: 'Descripción' },
  { accessorKey: 'severity', header: 'Severidad' },
  { accessorKey: 'assignedDate', header: 'Fecha Asignación' },
  { accessorKey: 'status', header: 'Estado' },
  { accessorKey: 'points', header: 'Puntos' }
]
</script>

<template>
  <section class="space-y-4">
    <SectionTitle title="Working on" />

    <div
      v-if="loading"
      class="space-y-2"
    >
      <USkeleton
        v-for="index in 5"
        :key="index"
        class="h-10 rounded-lg"
      />
    </div>

    <p
      v-else-if="rows.length === 0"
      class="text-center text-sm text-muted"
    >
      No tiene tareas en progreso.
    </p>

    <UCard
      v-else
      :ui="{ body: 'p-0 sm:p-0 overflow-x-auto' }"
    >
      <UTable
        :data="rows"
        :columns="columns"
      >
        <template #ref-cell="{ row }">
          <a
            v-if="row.original.link"
            :href="row.original.link"
            target="_blank"
            rel="noopener noreferrer"
            class="font-semibold text-primary hover:underline"
          >
            {{ row.original.ref }}
          </a>
          <span
            v-else
            class="font-semibold text-primary"
          >
            {{ row.original.ref }}
          </span>
        </template>

        <template #project-cell="{ row }">
          <NuxtLink
            :to="`/project/${row.original.projectId}/tracking`"
            class="font-semibold text-primary hover:underline"
          >
            {{ row.original.project }}
          </NuxtLink>
        </template>

        <template #subject-cell="{ row }">
          <span class="line-clamp-2">{{ row.original.subject }}</span>
        </template>

        <template #severity-cell="{ row }">
          <SeverityIndicator :severity="row.original.severity" />
        </template>

        <template #status-cell="{ row }">
          <TaskStatusBadge :status="row.original.status" />
        </template>
      </UTable>
    </UCard>
  </section>
</template>
