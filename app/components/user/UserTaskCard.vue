<script setup lang="ts">
import type { KanbanTaskItem } from '~/utils/kanban'
import { formatKanbanDate } from '~/utils/kanban'

defineProps<{
  task: KanbanTaskItem
}>()

defineEmits<{
  edit: [task: KanbanTaskItem]
}>()

const truncatedTitle = (title: string) =>
  title.length > 100 ? `${title.slice(0, 100)}...` : title
</script>

<template>
  <UCard class="cursor-move">
    <div class="space-y-3">
      <div class="flex items-start justify-between gap-2">
        <div class="flex flex-wrap gap-1">
          <UBadge
            v-if="task.priority"
            color="neutral"
            variant="subtle"
            size="xs"
          >
            {{ task.priority }}
          </UBadge>
          <UBadge
            v-if="task.severity"
            color="warning"
            variant="subtle"
            size="xs"
          >
            {{ task.severity }}
          </UBadge>
        </div>

        <UButton
          icon="i-lucide-pencil"
          size="xs"
          color="neutral"
          variant="ghost"
          @click="$emit('edit', task)"
        />
      </div>

      <p class="text-sm font-medium text-highlighted">
        {{ truncatedTitle(task.title) }}
      </p>

      <div class="flex items-center justify-between gap-2 text-xs text-muted">
        <span>{{ formatKanbanDate(task.date) }}</span>
        <UBadge
          color="primary"
          variant="subtle"
          size="xs"
        >
          {{ task.type }}
        </UBadge>
      </div>
    </div>
  </UCard>
</template>
