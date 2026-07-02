<script setup lang="ts">
import type { HomeProject } from '~/types/user'
import { getProjectProgress } from '~/utils/projectUtils'

const props = defineProps<{
  project: HomeProject
}>()

const hoursLabel = computed(() => {
  const { declared, quantityHours } = props.project

  if (quantityHours == null) {
    return `${declared ?? 0}/0`
  }

  if (declared == null) {
    return `0/${quantityHours}`
  }

  return `${declared}/${quantityHours}`
})

const progress = computed(() =>
  getProjectProgress(props.project.declared, props.project.quantityHours)
)
</script>

<template>
  <UCard class="h-full">
    <div class="space-y-4">
      <div class="flex items-start justify-between gap-3">
        <NuxtLink
          v-if="project.id"
          :to="`/project/${project.id}/tracking`"
          class="font-semibold text-primary hover:underline line-clamp-2"
        >
          {{ project.name }}
        </NuxtLink>
        <p
          v-else
          class="font-semibold text-highlighted line-clamp-2"
        >
          {{ project.name }}
        </p>

        <UDropdownMenu
          v-if="project.id"
          :items="[[
            { label: 'Working on', to: `/project/${project.id}/working-on` },
            { label: 'Monthly stats', to: `/project/${project.id}/monthly-stats` }
          ]]"
        >
          <UButton
            icon="i-lucide-ellipsis-vertical"
            color="neutral"
            variant="ghost"
            size="xs"
            aria-label="Opciones del proyecto"
          />
        </UDropdownMenu>
      </div>

      <p class="text-2xl font-semibold text-highlighted">
        {{ hoursLabel }}
      </p>

      <USeparator />

      <div class="space-y-2">
        <div class="flex items-center justify-between text-sm">
          <span class="text-muted">Progreso</span>
          <span class="font-medium">{{ progress }}%</span>
        </div>
        <UProgress :model-value="progress" color="primary" size="md" />
        <p class="text-xs text-muted">
          {{ project.roleTeam ?? 'N/A' }}
        </p>
      </div>
    </div>
  </UCard>
</template>
