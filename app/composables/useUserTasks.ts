import type { ActiveUser, UserTaskCase } from '~/types/user'
import { buildKanbanColumns } from '~/utils/kanban'
import { kanbanColumns, kanbanStatusMap } from '~/types/kanban'
import type { KanbanColumnTitle, KanbanTaskItem } from '~/types/kanban'
import { canAccessUserResource } from '~/utils/userAccess'

export const useUserTasks = (userId: MaybeRef<string | number>) => {
  const authStore = useAuthStore()
  const toast = useToast()
  const { $api } = useNuxtApp()

  const loading = ref(true)
  const error = ref<string | null>(null)
  const forbidden = ref(false)
  const user = ref<ActiveUser | null>(null)
  const columns = ref(buildKanbanColumns([]))
  const showTaskModal = ref(false)
  const selectedTask = ref<KanbanTaskItem | null>(null)
  const savingTask = ref(false)

  const fetchTasks = async () => {
    const id = toValue(userId)

    if (!canAccessUserResource(authStore.currentUser, id)) {
      forbidden.value = true
      error.value = 'No tenés permisos para el tablero de este usuario.'
      return
    }

    try {
      const tasks = await $api<UserTaskCase[]>(`/cases/tasks/${id}/pending`)
      const mapped = (tasks ?? []).map(mapCaseToKanbanTask)
      columns.value = buildKanbanColumns(mapped)
    } catch {
      error.value = 'No se pudieron cargar las tareas.'
    }
  }

  const loadBoard = async () => {
    const id = toValue(userId)
    loading.value = true
    error.value = null
    forbidden.value = false
    user.value = null

    if (!canAccessUserResource(authStore.currentUser, id)) {
      forbidden.value = true
      error.value = 'No tenés permisos para el tablero de este usuario.'
      loading.value = false
      return
    }

    try {
      const users = await $api<ActiveUser[]>('/users/active')
      user.value = users.find(item => item.idUser === Number(id)) ?? null

      if (!user.value) {
        error.value = `No existe un usuario con id: ${id}`
        return
      }

      await fetchTasks()
    } catch {
      error.value = 'No se pudo cargar el tablero de tareas.'
    } finally {
      loading.value = false
    }
  }

  const moveTask = async (task: KanbanTaskItem, columnTitle: KanbanColumnTitle) => {
    const status = kanbanStatusMap[columnTitle]

    if (!status || task.status === status) {
      return
    }

    const id = toValue(userId)
    if (!canAccessUserResource(authStore.currentUser, id)) {
      toast.add({
        title: 'No tenés permisos para realizar esta acción',
        color: 'error'
      })
      return
    }

    try {
      await $api(`/cases/${task.id}`, {
        method: 'PATCH',
        body: {
          message: task.title,
          expiration_date: task.date.replace(/-/g, ''),
          id_project: task.projectId,
          status,
          priority: task.priority,
          severity: task.severity
        }
      })

      toast.add({
        title: 'Tarea actualizada',
        color: 'success'
      })

      await fetchTasks()
    } catch {
      toast.add({
        title: 'Error al actualizar la tarea',
        color: 'error'
      })
      await fetchTasks()
    }
  }

  const onDragEnd = async (event: { item?: HTMLElement, to?: HTMLElement, from?: HTMLElement }) => {
    const taskId = event.item?.dataset.id
    const toColumn = event.to?.closest('[data-column]')?.getAttribute('data-column') as KanbanColumnTitle | null
    const fromColumn = event.from?.closest('[data-column]')?.getAttribute('data-column') as KanbanColumnTitle | null

    if (!taskId || !toColumn || !fromColumn || toColumn === fromColumn) {
      await fetchTasks()
      return
    }

    const task = columns.value
      .flatMap(column => column.tasks)
      .find(item => String(item.id) === taskId)

    if (!task) {
      await fetchTasks()
      return
    }

    await moveTask(task, toColumn)
  }

  const openCreateModal = () => {
    selectedTask.value = null
    showTaskModal.value = true
  }

  const openEditModal = (task: KanbanTaskItem) => {
    selectedTask.value = task
    showTaskModal.value = true
  }

  const saveTask = async (payload: {
    description: string
    projectId?: number
    priority?: string
    severity?: string
    expirationDate: Date
    userId?: number
  }) => {
    savingTask.value = true
    const id = toValue(userId)
    const targetUserId = payload.userId ?? Number(id)

    if (!canAccessUserResource(authStore.currentUser, targetUserId)) {
      toast.add({
        title: 'No tenés permisos para realizar esta acción',
        color: 'error'
      })
      savingTask.value = false
      return
    }

    try {
      const body = {
        message: payload.description,
        expiration_date: formatCaseExpirationDate(payload.expirationDate),
        id_project: payload.projectId,
        priority: payload.priority,
        severity: payload.severity,
        status: selectedTask.value?.status ?? 1
      }

      if (selectedTask.value) {
        await $api(`/cases/${selectedTask.value.id}`, {
          method: 'PATCH',
          body
        })
        toast.add({ title: 'Tarea editada', color: 'success' })
      } else {
        await $api(`/cases/tasks/create/${targetUserId}`, {
          method: 'POST',
          body: { ...body, status: 1 }
        })
        toast.add({ title: 'Tarea creada', color: 'success' })
      }

      showTaskModal.value = false
      selectedTask.value = null
      await fetchTasks()
    } catch {
      toast.add({
        title: 'Ocurrió un error al guardar la tarea',
        color: 'error'
      })
    } finally {
      savingTask.value = false
    }
  }

  return {
    loading,
    error,
    forbidden,
    user,
    columns,
    kanbanColumns,
    showTaskModal,
    selectedTask,
    savingTask,
    loadBoard,
    fetchTasks,
    onDragEnd,
    openCreateModal,
    openEditModal,
    saveTask
  }
}
