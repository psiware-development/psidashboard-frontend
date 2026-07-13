<script setup lang="ts">
const route = useRoute()
const userId = computed(() => route.params.id as string)

const {
  loading,
  error,
  forbidden,
  user,
  columns,
  showTaskModal,
  selectedTask,
  savingTask,
  loadBoard,
  onDragEnd,
  openCreateModal,
  openEditModal,
  saveTask
} = useUserTasks(userId)

usePageTitle('Tareas')

onMounted(() => {
  loadBoard()
})
</script>

<template>
  <div class="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <SectionTitle title="Tareas" />
      <UButton
        v-if="user && !forbidden"
        color="primary"
        label="Crear tarea"
        @click="openCreateModal"
      />
    </div>

    <UAlert
      v-if="error"
      color="error"
      variant="subtle"
      :title="error"
    />

    <UAlert
      v-if="forbidden"
      color="warning"
      variant="subtle"
      title="Acceso restringido"
      :description="`No tenés permisos para el tablero del usuario ${userId}.`"
    />

    <UserKanbanBoard
      v-else-if="user"
      v-model:columns="columns"
      :loading="loading"
      @drag-end="onDragEnd"
      @edit-task="openEditModal"
    />

    <UserTaskFormModal
      v-model:open="showTaskModal"
      :task="selectedTask"
      :saving="savingTask"
      @save="saveTask"
    />
  </div>
</template>
