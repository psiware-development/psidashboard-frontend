import { kanbanColumns, kanbanStatusMap } from '~/types/kanban'
import type { KanbanTaskItem } from '~/types/kanban'

export function mapCaseToKanbanTask(task: {
  id: number
  message?: string
  expirationDate?: string
  status: string
  priority?: string
  severity?: string
  project?: { id?: number, description?: string }
}): KanbanTaskItem {
  return {
    id: task.id,
    title: task.message || 'Sin titulo',
    date: task.expirationDate ?? '',
    type: task.project?.description || 'General',
    projectId: task.project?.id,
    status: kanbanStatusMap[task.status] ?? 1,
    priority: task.priority,
    severity: task.severity
  }
}

export function buildKanbanColumns(tasks: KanbanTaskItem[]) {
  return kanbanColumns.map(title => ({
    title,
    tasks: tasks.filter(task => kanbanStatusMap[title] === task.status)
  }))
}

export function formatKanbanDate(value?: string): string {
  if (!value) {
    return '-'
  }

  const parts = value.split('-')

  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`
  }

  if (value.length === 8) {
    return `${value.slice(6, 8)}/${value.slice(4, 6)}/${value.slice(0, 4)}`
  }

  return value
}

export function formatCaseExpirationDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}
