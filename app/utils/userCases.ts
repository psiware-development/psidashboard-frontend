import type { KpiItem } from '~/types/dashboard'
import type { UserResumeData, UserResumeProjectRow } from '~/types/user'

export function buildResumeKpis(resume: UserResumeData | null): KpiItem[] {
  if (!resume?.kpis) {
    return []
  }

  return Object.entries(resume.kpis).map(([id, description]) => ({
    idKPI: Number(id),
    description,
    value: resume.kpis_values?.[id] ?? null
  }))
}

export function buildResumeProjects(resume: UserResumeData | null): UserResumeProjectRow[] {
  if (!resume?.projects) {
    return []
  }

  return Object.entries(resume.projects).map(([name, values]) => ({
    name,
    ...values
  }))
}

export function getMessageProgressValue(status: string): number {
  const statusMap: Record<string, number> = {
    Iniciado: 0,
    Leido: 25,
    'En progreso': 75,
    Cerrado: 100
  }

  return statusMap[status] ?? 0
}

export function getMessageProgressColor(status: string): 'warning' | 'success' | 'primary' | 'neutral' {
  const colorMap: Record<string, 'warning' | 'success' | 'primary' | 'neutral'> = {
    Iniciado: 'warning',
    Leido: 'warning',
    'En progreso': 'success',
    Cerrado: 'primary'
  }

  return colorMap[status] ?? 'neutral'
}

export const kanbanStatusMap: Record<string, number> = {
  Iniciado: 1,
  'En progreso': 3,
  Cerrado: 5
}

export const kanbanColumns = ['Iniciado', 'En progreso', 'Cerrado'] as const

export type KanbanColumnTitle = typeof kanbanColumns[number]

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
