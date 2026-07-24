<script setup lang="ts">
import type { ProjectWorkingOnRow } from '~/types/project'
import type { AppTableColumn } from '~/components/AppTable.vue'

defineProps<{
  rows: ProjectWorkingOnRow[]
  loading?: boolean
}>()

const columns: AppTableColumn<ProjectWorkingOnRow>[] = [
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
</script>

<template>
  <section class="space-y-4">
    <h2 class="text-xl font-semibold">
      Tareas en progreso
    </h2>

    <AppTable
      :data="rows"
      :columns="columns"
      :loading="loading"
      empty-icon="i-lucide-list-checks"
      empty-text="No hay tareas en progreso para este proyecto."
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
    </AppTable>
  </section>
</template>
