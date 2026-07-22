<script setup lang="ts">
import type { UserResumeProjectRow, UserResumeTask } from '~/types/user'
import { formatDate } from '~/utils/dateUtils'

defineProps<{
  projects: UserResumeProjectRow[]
  tasks: UserResumeTask[]
  totalPlanned: number
  totalReal: number
  totalDifference: number
  loading?: boolean
}>()
</script>

<template>
  <div class="space-y-8">
    <div>
      <AppTable
        :data="projects"
        :columns="[
          { accessorKey: 'name', header: 'Proyecto' },
          { accessorKey: 'total_planned_monthly_hours', header: 'Horas planificadas' },
          { accessorKey: 'current_real_hours', header: 'Horas reales' },
          {
            accessorKey: 'difference',
            header: 'Diferencia',
            sortFn: (a, b) => (a.total_planned_monthly_hours - a.current_real_hours) - (b.total_planned_monthly_hours - b.current_real_hours)
          }
        ]"
        :loading="loading"
        empty-icon="i-lucide-folder"
        empty-text="No hay proyectos para mostrar."
        class="min-w-[640px]"
      >
        <template #difference-cell="{ row }">
          {{ row.original.total_planned_monthly_hours - row.original.current_real_hours }}
        </template>
      </AppTable>

      <div
        v-if="!loading && projects.length > 0"
        class="grid grid-cols-4 gap-4 border-t border-default bg-muted/30 px-4 py-3 text-sm font-semibold rounded-b-lg"
      >
        <span>Total</span>
        <span>{{ totalPlanned }}</span>
        <span>{{ totalReal }}</span>
        <span>{{ totalDifference }}</span>
      </div>
    </div>

    <section class="space-y-4">
      <SectionTitle title="Tareas" />

      <AppTable
        :data="tasks"
        :columns="[
          {
            accessorKey: 'project',
            header: 'Proyecto',
            sortFn: (a, b) => (a.project?.description ?? '').localeCompare(b.project?.description ?? '', 'es')
          },
          {
            accessorKey: 'taiga',
            header: 'Taiga',
            sortFn: (a, b) => (Number(a.userStory?.ref ?? a.issue?.ref ?? 0) - Number(b.userStory?.ref ?? b.issue?.ref ?? 0))
          },
          { accessorKey: 'description', header: 'Descripción (Clockify)' },
          { accessorKey: 'classification', header: 'Clasificación' },
          { accessorKey: 'realStartDate', header: 'Fecha' },
          { accessorKey: 'realTime', header: 'Horas' },
          { accessorKey: 'needRefinement', header: 'Estado' }
        ]"
        :loading="loading"
        empty-icon="i-lucide-list-checks"
        empty-text="No hay tareas para mostrar."
        class="min-w-[960px]"
      >
        <template #project-cell="{ row }">
          <NuxtLink
            v-if="row.original.project?.id"
            :to="`/project/${row.original.project.id}/tracking`"
            class="text-primary hover:underline font-medium"
          >
            {{ row.original.project.description }}
          </NuxtLink>
          <span v-else>{{ row.original.project?.description ?? '-' }}</span>
        </template>

        <template #taiga-cell="{ row }">
          <a
            v-if="row.original.userStory?.link || row.original.issue?.link"
            :href="row.original.userStory?.link ?? row.original.issue?.link"
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary hover:underline font-semibold"
          >
            #{{ row.original.userStory?.ref ?? row.original.issue?.ref }}
          </a>
          <span v-else>-</span>
        </template>

        <template #description-cell="{ row }">
          {{ row.original.description ?? '-' }}
        </template>

        <template #classification-cell="{ row }">
          {{ row.original.classification ?? '-' }}
        </template>

        <template #realStartDate-cell="{ row }">
          {{ formatDate(row.original.realStartDate) }}
        </template>

        <template #realTime-cell="{ row }">
          {{ row.original.realTime ?? '-' }}
        </template>

        <template #needRefinement-cell="{ row }">
          <UIcon
            :name="row.original.needRefinement ? 'i-lucide-triangle-alert' : 'i-lucide-circle-check'"
            :class="row.original.needRefinement ? 'text-warning' : 'text-success'"
            class="size-5"
          />
        </template>
      </AppTable>
    </section>
  </div>
</template>
