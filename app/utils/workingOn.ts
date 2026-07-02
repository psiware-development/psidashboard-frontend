import type { WorkingOnRow } from '~/types/dashboard'
import type { WorkingOnItem } from '~/types/user'
import { formatDate } from '~/utils/dateUtils'

export function buildWorkingOnRows(items: WorkingOnItem[]): WorkingOnRow[] {
  return [...items]
    .map((item) => {
      return {
        ref: `#${item.ref}`,
        type: item.type,
        link: item.link,
        project: item.project.description,
        projectId: item.project.idProject,
        subject: item.subject,
        severity: item.severity,
        status: item.status,
        points: String(item.points ?? 'Sin Puntos'),
        assignedDate: formatDate(item.createdDate)
      }
    })
    .sort((a, b) => {
      const dateA = parseDate(a.assignedDate)
      const dateB = parseDate(b.assignedDate)
      return dateB.getTime() - dateA.getTime()
    })
}

function parseDate(value: string): Date {
  const [day, month, year] = value.split('-').map(Number)

  if (!day || !month || !year) {
    return new Date(0)
  }

  return new Date(year, month - 1, day)
}
