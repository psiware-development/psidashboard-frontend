<script setup lang="ts">
import draggable from 'vuedraggable'
import type { KanbanTaskItem } from '~/utils/userCases'

const columns = defineModel<Array<{ title: string, tasks: KanbanTaskItem[] }>>('columns', {
  required: true
})

defineProps<{
  loading?: boolean
}>()

const emit = defineEmits<{
  dragEnd: [event: { item?: HTMLElement, to?: HTMLElement, from?: HTMLElement }]
  editTask: [task: KanbanTaskItem]
}>()
</script>

<template>
  <div
    v-if="loading"
    class="grid gap-4 md:grid-cols-3"
  >
    <USkeleton
      v-for="index in 3"
      :key="index"
      class="h-96 rounded-lg"
    />
  </div>

  <div
    v-else
    class="flex flex-wrap justify-center gap-4"
  >
    <div
      v-for="column in columns"
      :key="column.title"
      class="w-full max-w-[320px] rounded-lg border border-default bg-muted/30 p-3"
      :data-column="column.title"
    >
      <div class="mb-3 rounded-lg bg-primary/15 px-3 py-3 text-center text-sm font-semibold">
        {{ column.title }}
      </div>

      <draggable
        v-model="column.tasks"
        item-key="id"
        group="tasks"
        :animation="200"
        ghost-class="opacity-50"
        class="flex min-h-32 flex-col gap-3"
        @end="emit('dragEnd', $event)"
      >
        <template #item="{ element }">
          <div :data-id="element.id">
            <UserTaskCard
              :task="element"
              @edit="emit('editTask', $event)"
            />
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>
