import { formatCaseExpirationDate } from '~/utils/kanban'
import type { KanbanTaskItem } from '~/types/kanban'

export interface CaseApiPayload {
  message: string
  expiration_date: string
  id_project?: number
  status: number
  priority?: string
  severity?: string
}

export function toCaseMovePayload(task: KanbanTaskItem, status: number): CaseApiPayload {
  return {
    message: task.title,
    expiration_date: task.date.replace(/-/g, ''),
    id_project: task.projectId,
    status,
    priority: task.priority,
    severity: task.severity
  }
}

export interface CaseSaveInput {
  description: string
  projectId?: number
  priority?: string
  severity?: string
  expirationDate: Date
  status: number
}

export function toCaseSavePayload(input: CaseSaveInput): CaseApiPayload {
  return {
    message: input.description,
    expiration_date: formatCaseExpirationDate(input.expirationDate),
    id_project: input.projectId,
    status: input.status,
    priority: input.priority,
    severity: input.severity
  }
}
