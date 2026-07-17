export const kanbanColumns = ['Iniciado', 'En progreso', 'Cerrado'] as const

export type KanbanColumnTitle = typeof kanbanColumns[number]

export const kanbanStatusMap: Record<string, number> = {
  'Iniciado': 1,
  'En progreso': 3,
  'Cerrado': 5
}

export interface KanbanTaskItem {
  id: number
  title: string
  date: string
  type: string
  projectId?: number
  status: number
  priority?: string
  severity?: string
}
