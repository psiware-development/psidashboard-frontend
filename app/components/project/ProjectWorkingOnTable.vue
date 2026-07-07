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
  { accessorKey: 'userName', header: 'Usuario' },
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
          :variant="sortBy === 'severity' ? 'solid' : 'outline'"
          label="Severidad"
          @click="sortBy = 'severity'"
        />
        <UButton
          size="sm"
          :color="sortBy === 'creationDate' || sortBy === 'creationDateAsc' ? 'primary' : 'neutral'"
          :variant="sortBy === 'creationDate' || sortBy === 'creationDateAsc' ? 'solid' : 'outline'"
          :label="sortBy === 'creationDateAsc' ? 'Creación ↑' : 'Creación ↓'"
          @click="toggleCreationSort"
        />
      </div>
    </div>

    <div
      v-if="loading"
      class="space-y-2"
    >
      <USkeleton
        v-for="index in 6"
        :key="index"
        class="h-10 rounded-lg"
      />
    </div>

    <p
      v-else-if="rows.length === 0"
      class="text-center text-sm text-muted"
    >
      No hay tareas en progreso para este proyecto.
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
            class="font-semibold text-primary hover:underline whitespace-nowrap"
          >
            {{ row.original.ref }}
          </a>
          <span
            v-else
            class="whitespace-nowrap"
          >{{ row.original.ref }}</span>
        </template>

        <template #userName-cell="{ row }">
          <NuxtLink
            v-if="row.original.userId"
            :to="`/user/${row.original.userId}/working-on`"
            class="inline-flex items-center gap-2 hover:underline"
          >
            <UAvatar
              :src="row.original.userImage"
              :alt="row.original.userName"
              size="xs"
            />
            <span>{{ row.original.userName }}</span>
          </NuxtLink>
          <span v-else>-</span>
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
    </UCard>
  </section>
</template>
