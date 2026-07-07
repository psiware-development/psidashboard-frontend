<script setup lang="ts">
import type { ProjectIssueRow, ProjectTaskRow, ProjectUserStoryRow } from '~/types/project'

defineProps<{
  userStories: ProjectUserStoryRow[]
  issues: ProjectIssueRow[]
  tasks: ProjectTaskRow[]
  loading?: boolean
}>()

const tabs = [
  { label: 'Historias de usuario', value: 'uss', slot: 'uss' },
  { label: 'Issues', value: 'issues', slot: 'issues' },
  { label: 'Tareas declaradas', value: 'tasks', slot: 'tasks' }
]

const activeTab = ref('uss')
</script>

<template>
  <section class="space-y-4">
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

      <UTabs
        v-else
        v-model="activeTab"
        default-value="uss"
        :items="tabs"
        class="w-full"
      >
        <template #uss>
          <div class="p-2">
            <ProjectUserStoriesTable
              v-if="userStories.length > 0"
              :rows="userStories"
            />
            <p
              v-else
              class="p-4 text-sm text-muted text-center"
            >
              No hay historias de usuario.
            </p>
          </div>
        </template>

        <template #issues>
          <div class="p-2">
            <ProjectIssuesTable
              v-if="issues.length > 0"
              :rows="issues"
            />
            <p
              v-else
              class="p-4 text-sm text-muted text-center"
            >
              No hay issues.
            </p>
          </div>
        </template>

        <template #tasks>
          <div class="p-2">
            <ProjectClockifyTasksTable
              v-if="tasks.length > 0"
              :rows="tasks"
            />
            <p
              v-else
              class="p-4 text-sm text-muted text-center"
            >
              No hay tareas declaradas.
            </p>
          </div>
        </template>
      </UTabs>
    </UCard>
  </section>
</template>
