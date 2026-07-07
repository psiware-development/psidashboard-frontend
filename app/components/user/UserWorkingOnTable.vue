<script setup lang="ts">
import type { ProjectWorkingOnRow } from '~/types/project'
import type { ProjectWorkingOnSort } from '~/utils/projectWorkingOn'
import type { TableColumn } from '@nuxt/ui'

defineProps<{
  rows: ProjectWorkingOnRow[]
  loading?: boolean
}>()

const sortBy = defineModel<ProjectWorkingOnSort>('sortBy', { default: 'severity' })

const columns: TableColumn<ProjectWorkingOnRow>[] = [
  { accessorKey: 'ref', header: 'ID' },
  { accessorKey: 'projectName', header: 'Proyecto' },
  { accessorKey: 'subject', header: 'Descripción' },
  { accessorKey: 'status', header: 'Estado' },
  { accessorKey: 'points', header: 'Puntos' },
  { accessorKey: 'hours', header: 'Horas' },
  { accessorKey: 'createdDate', header: 'Creada' },
  { accessorKey: 'inProgressDate', header: 'En progreso' },
  { accessorKey: 'qaDate', header: 'En QA' },
  { accessorKey: 'qaOkDate', header: 'QA Ok' }
]

const toggleCreationSort = () => {
  sortBy.value = sortBy.value === 'creationDate' ? 'creationDateAsc' : 'creationDate'
}
</script>

<template>
  <section class="space-y-4">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 class="text-xl font-semibold">
        Tareas en progreso
      </h2>

      <div class="flex flex-wrap gap-2">
        <UButton
          size="sm"
          :color="sortBy === 'severity' ? 'primary' : 'neutral'"
          variant="soft"
          label="Severidad"
          @click="sortBy = 'severity'"
        />
        <UButton
          size="sm"
          :color="sortBy === 'creationDate' || sortBy === 'creationDateAsc' ? 'primary' : 'neutral'"
          variant="soft"
          :icon="sortBy === 'creationDateAsc' ? 'i-lucide-arrow-up' : 'i-lucide-arrow-down'"
          label="Creación"
          @click="toggleCreationSort"
        />
      </div>
    </div>

    <UCard :ui="{ body: 'p-0 sm:p-0 overflow-x-auto' }">
      <div
        v-if="loading"
        class="p-4 space-y-2"
      >
        <USkeleton
          v-for="index in 5"
          :key="index"
          class="h-10"
        />
      </div>

      <UTable
        v-else-if="rows.length > 0"
        :data="rows"
        :columns="columns"
        class="min-w-[960px]"
      >
        <template #ref-cell="{ row }">
          <a
            v-if="row.original.link"
            :href="row.original.link"
            target="_blank"
            rel="noopener noreferrer"
            class="font-semibold text-primary hover:underline whitespace-nowrap"
          >
            {{ row.original.ref }}
          </a>
          <span
            v-else
            class="whitespace-nowrap"
          >{{ row.original.ref }}</span>
        </template>

        <template #projectName-cell="{ row }">
          <NuxtLink
            v-if="row.original.projectId"
            :to="`/project/${row.original.projectId}/working-on`"
            class="hover:underline"
          >
            {{ row.original.projectName }}
          </NuxtLink>
          <span v-else>{{ row.original.projectName ?? '-' }}</span>
        </template>

        <template #subject-cell="{ row }">
          <div class="flex items-start gap-2 min-w-[220px]">
            <SeverityIndicator
              v-if="row.original.severity"
              :severity="row.original.severity"
            />
            <span class="line-clamp-2">{{ row.original.subject }}</span>
          </div>
        </template>

        <template #status-cell="{ row }">
          <TaskStatusBadge :status="row.original.status" />
        </template>
      </UTable>

      <p
        v-else
        class="p-4 text-sm text-muted text-center"
      >
        No hay tareas en progreso.
      </p>
    </UCard>
  </section>
</template>
