import type {
  ProjectMonthlyStats,
  ProjectWorkingOnRow,
  ProjectWorkingOnTask
} from '~/types/project'
import { formatDate } from '~/utils/dateUtils'

const severityOrder: Record<string, number> = {
  Critical: 0,
  Important: 1
}

const statusOrder: Record<string, number> = {
  'in-progress': 2,
  'en-progreso': 2,
  'ready-for-validation': 3,
  'publicado-en-qa': 3,
  'qa-ok': 4
}

export type ProjectWorkingOnSort = 'severity' | 'creationDate' | 'creationDateAsc'

export function buildProjectWorkingOnRows(tasks: ProjectWorkingOnTask[]): ProjectWorkingOnRow[] {
  return tasks.map(task => ({
    id: `${task.project?.idProject ?? '0'}-${task.ref}`,
    ref: `${task.type} ${task.ref}`,
    type: task.type,
    link: task.link,
    projectId: task.project?.idProject,
    projectName: task.project?.description,
    userId: task.user?.idUser,
    userName: task.user?.fullname,
    userImage: task.user?.image,
    subject: task.subject,
    severity: task.severity,
    status: task.status,
    points: task.type?.toLowerCase() === 'issue' ? '-' : String(task.points ?? '-'),
    hours: formatWorkingOnHours(task.realHours, task.lastHours),
    createdDate: formatDate(task.createdDate),
    inProgressDate: formatDate(task.inProgressDate),
    qaDate: formatDate(task.qaDate),
    qaOkDate: formatDate(task.qaOkDate)
  }))
}

export function sortProjectWorkingOnRows(
  rows: ProjectWorkingOnRow[],
  tasks: ProjectWorkingOnTask[],
  sortBy: ProjectWorkingOnSort
): ProjectWorkingOnRow[] {
  const taskMap = new Map(tasks.map(task => [`${task.project?.idProject ?? '0'}-${task.ref}`, task]))

  return [...rows].sort((rowA, rowB) => {
    const taskA = taskMap.get(rowA.id)
    const taskB = taskMap.get(rowB.id)

    if (!taskA || !taskB) {
      return 0
    }

    if (sortBy === 'severity') {
      return compareBySeverity(taskA, taskB)
    }

    const diff = new Date(taskB.createdDate ?? 0).getTime() - new Date(taskA.createdDate ?? 0).getTime()
    return sortBy === 'creationDateAsc' ? -diff : diff
  })
}

function compareBySeverity(a: ProjectWorkingOnTask, b: ProjectWorkingOnTask): number {
  const score = (task: ProjectWorkingOnTask) => {
    if (task.severity && severityOrder[task.severity] != null) {
      return severityOrder[task.severity]!
    }

    if (task.status && statusOrder[task.status] != null) {
      return statusOrder[task.status]!
    }

    return 99
  }

  return score(a) - score(b)
}

function formatWorkingOnHours(realHours?: number, lastHours?: number): string {
  if (!realHours || realHours === 0) {
    return '-'
  }

  if (lastHours) {
    return `${realHours} (+${lastHours})`
  }

  return String(realHours)
}

export function countWorkingOnByType(tasks: ProjectWorkingOnTask[]) {
  return {
    issues: tasks.filter(task => task.type === 'Issue').length,
    userStories: tasks.filter(task => task.type !== 'Issue').length
  }
}

export function formatMonthParam(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear())
  return `${month}${year}`
}

export function formatMonthLabel(date: Date): string {
  const formatted = date.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

export function parseMonthInput(value: string): Date {
  const [yearPart, monthPart] = value.split('-')
  const year = Number(yearPart) || new Date().getFullYear()
  const month = Number(monthPart) || 1
  return new Date(year, month - 1, 1)
}

export function toMonthInputValue(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${date.getFullYear()}-${month}`
}

export function buildMonthlyStatSections(stats: ProjectMonthlyStats) {
  return [
    {
      title: 'General',
      items: [
        { label: 'Contador de USs', value: stats.general?.backlog_uss_count ?? '-' },
        { label: 'Median MTTR issues (días)', value: stats.general?.median_mttr_issues_days ?? '-' },
        { label: 'Horas en bugs', value: stats.general?.real_hours_bugs ?? '-' },
        { label: 'Horas totales', value: stats.general?.total_hours ?? '-' },
        { label: 'Backlog USs points', value: stats.general?.backlog_uss_points ?? '-' },
        { label: 'Contador de bugs', value: stats.general?.bug_count ?? '-' },
        { label: 'Puntos quemados', value: stats.general?.total_delivered_points ?? '-' }
      ]
    },
    {
      title: 'Tickets',
      items: [
        { label: 'Promedio días en progreso', value: roundMetric(stats.tickets?.avg_in_progress_days) },
        { label: 'Promedio días QA', value: roundMetric(stats.tickets?.avg_qa_days) },
        { label: 'Promedio QA OK', value: roundMetric(stats.tickets?.avg_qa_ok_days) },
        { label: 'Listos', value: stats.tickets?.tickets_done ?? '-' },
        { label: 'En progreso', value: stats.tickets?.tickets_in_progress ?? '-' },
        { label: 'QA', value: stats.tickets?.tickets_qa ?? '-' },
        { label: 'QA OK', value: stats.tickets?.tickets_qa_ok ?? '-' },
        { label: 'Trabajados', value: stats.tickets?.worked_tickets ?? '-' }
      ]
    },
    {
      title: 'Metrics',
      items: [
        {
          label: 'Defect density',
          value: stats.metrics?.defect_density === 'Infinity'
            ? 'Infinity'
            : roundMetric(Number(stats.metrics?.defect_density))
        },
        { label: 'Rework rate', value: roundMetric(Number(stats.metrics?.rework_rate)) }
      ]
    }
  ]
}

function roundMetric(value?: number): string | number {
  if (value == null || Number.isNaN(value)) {
    return '-'
  }

  return Math.round(value * 1000) / 1000
}
