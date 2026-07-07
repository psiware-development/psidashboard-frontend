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
    <UCard :ui="{ body: 'p-0 sm:p-0 overflow-x-auto' }">
      <div
        v-if="loading"
        class="p-4 space-y-2"
      >
        <USkeleton
          v-for="index in 4"
          :key="index"
          class="h-10"
        />
      </div>

      <UTable
        v-else-if="projects.length > 0"
        :data="projects"
        :columns="[
          { accessorKey: 'name', header: 'Proyecto' },
          { accessorKey: 'total_planned_monthly_hours', header: 'Horas planificadas' },
          { accessorKey: 'current_real_hours', header: 'Horas reales' },
          { accessorKey: 'difference', header: 'Diferencia' }
        ]"
        class="min-w-[640px]"
      >
        <template #difference-cell="{ row }">
          {{ row.original.total_planned_monthly_hours - row.original.current_real_hours }}
        </template>
      </UTable>

      <p
        v-else
        class="p-4 text-sm text-muted text-center"
      >
        No hay proyectos para mostrar.
      </p>

      <div
        v-if="!loading && projects.length > 0"
        class="grid grid-cols-4 gap-4 border-t border-default bg-muted/30 px-4 py-3 text-sm font-semibold"
      >
        <span>Total</span>
        <span>{{ totalPlanned }}</span>
        <span>{{ totalReal }}</span>
        <span>{{ totalDifference }}</span>
      </div>
    </UCard>

    <section class="space-y-4">
      <HomeSectionTitle title="Tareas" />

      <UCard :ui="{ body: 'p-0 sm:p-0 overflow-x-auto' }">
        <div
          v-if="loading"
          class="p-4 space-y-2"
        >
          <USkeleton
            v-for="index in 4"
            :key="index"
            class="h-10"
          />
        </div>

        <UTable
          v-else-if="tasks.length > 0"
          :data="tasks"
          :columns="[
            { accessorKey: 'project', header: 'Proyecto' },
            { accessorKey: 'taiga', header: 'Taiga' },
            { accessorKey: 'description', header: 'Descripción (Clockify)' },
            { accessorKey: 'classification', header: 'Clasificación' },
            { accessorKey: 'date', header: 'Fecha' },
            { accessorKey: 'hours', header: 'Horas' },
            { accessorKey: 'status', header: 'Estado' }
          ]"
          class="min-w-[960px]"
        >
          <template #project-cell="{ row }">
            <NuxtLink
              v-if="row.original.project?.id"
              :to="`/project/${row.original.project.id}/tracking`"
              class="text-primary hover:underline"
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
              class="text-primary hover:underline"
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

          <template #date-cell="{ row }">
            {{ formatDate(row.original.realStartDate) }}
          </template>

          <template #hours-cell="{ row }">
            {{ row.original.realTime ?? '-' }}
          </template>

          <template #status-cell="{ row }">
            <UIcon
              :name="row.original.needRefinement ? 'i-lucide-triangle-alert' : 'i-lucide-circle-check'"
              :class="row.original.needRefinement ? 'text-warning' : 'text-success'"
            />
          </template>
        </UTable>

        <p
          v-else
          class="p-4 text-sm text-muted text-center"
        >
          No hay tareas para mostrar.
        </p>
      </UCard>
    </section>
  </div>
</template>
