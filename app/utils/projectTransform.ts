import type {
  ProjectClockifyTask,
  ProjectDiscipline,
  ProjectIssueRow,
  ProjectTaskRow,
  ProjectTeamMember,
  ProjectTrackingData,
  ProjectUserStoryRow
} from '~/types/project'
import { getUsRatio } from '~/utils/projectUtils'

const DISCIPLINE_CONFIG = [
  { key: 'Desarrollo', label: 'DEV' },
  { key: 'Soporte', label: 'Soporte' },
  { key: 'UX/UI', label: 'UX/UI' },
  { key: 'Scrum', label: 'Scrum' },
  { key: 'DevOps', label: 'DevOps' }
] as const

function flattenClockify(
  clockify?: ProjectClockifyTask[] | Record<string, ProjectClockifyTask[]>
): ProjectClockifyTask[] {
  if (!clockify) {
    return []
  }

  if (Array.isArray(clockify)) {
    return clockify
  }

  return Object.values(clockify).flat()
}

export function getDeclaredHours(data: ProjectTrackingData): number {
  if (data.project.fixed && data.stats?.total_real_hours != null) {
    return data.stats.total_real_hours
  }

  return flattenClockify(data.clockify).reduce(
    (sum, task) => sum + (task.realTime ?? 0),
    0
  )
}

export function getPlannedHours(data: ProjectTrackingData): number {
  if (data.project.fixed && data.stats?.total_planned_hours != null) {
    return data.stats.total_planned_hours
  }

  return data.planification?.total ?? data.planification?.quantityHours ?? 0
}

export function buildTeamMembers(data: ProjectTrackingData): ProjectTeamMember[] {
  const team = data.team ?? []
  const clockifyTasks = flattenClockify(data.clockify)

  return team
    .map((member) => {
      const fullname = member.user?.fullname ?? ''
      const declared = clockifyTasks
        .filter(task => task.user?.fullname === fullname)
        .reduce((sum, task) => sum + (task.realTime ?? 0), 0)

      const assigned = data.planification?.users?.[fullname]?.quantity_hours ?? 0

      return {
        id: member.user?.idUser ?? 0,
        name: fullname,
        role: member.role?.description ?? '',
        image: member.user?.image,
        declared,
        assigned
      }
    })
    .filter(member => member.declared > 0 || member.assigned > 0)
}

export function buildDisciplines(data: ProjectTrackingData, totalDeclared: number): ProjectDiscipline[] {
  return DISCIPLINE_CONFIG.map(({ key, label }) => {
    const raw = data.disciplines?.[key]
    const hours = typeof raw === 'number'
      ? raw
      : raw?.real_hours ?? 0

    const percentage = totalDeclared > 0
      ? Math.round((hours * 100) / totalDeclared)
      : 0

    return {
      key,
      label,
      hours,
      percentage
    }
  })
}

export function buildUserStoryRows(data: ProjectTrackingData): ProjectUserStoryRow[] {
  const stories = data.taiga?.user_stories ?? []

  return [...stories]
    .sort((a, b) => (b.realHoursDeclared ?? 0) - (a.realHoursDeclared ?? 0))
    .map(story => ({
      sprint: story.milestone ?? '-',
      subject: story.subject ?? '-',
      status: story.status,
      points: story.points ?? '-',
      realHours: story.realHoursDeclared ?? '-',
      ratio: getUsRatio(story.realHoursDeclared, story.points),
      assignedUser: story.assignedUser,
      link: story.link,
      epicColor: story.epic?.color
    }))
}

export function buildIssueRows(data: ProjectTrackingData): ProjectIssueRow[] {
  const issues = data.taiga?.issues ?? []

  return issues.map(issue => ({
    issue: `#${issue.ref ?? '-'} - ${issue.subject ?? ''}`,
    description: issue.description ?? '-',
    realHours: issue.realHoursDeclared ?? '-',
    user: issue.user,
    link: issue.link
  }))
}

export function buildTaskRows(data: ProjectTrackingData): ProjectTaskRow[] {
  return flattenClockify(data.clockify)
    .sort((a, b) => new Date(b.realStartDate ?? 0).getTime() - new Date(a.realStartDate ?? 0).getTime())
    .map(task => ({
      taigaRef: task.userStory
        ? `#${task.userStory.ref}`
        : task.issue
          ? `#${task.issue.ref}`
          : '-',
      taigaLink: task.userStory?.link ?? task.issue?.link,
      description: task.description ?? '-',
      user: task.user,
      classification: task.classification ?? '-',
      date: task.realStartDate
        ? new Date(task.realStartDate).toLocaleString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        : '-',
      hours: task.realTime ?? 0,
      needRefinement: task.needRefinement ?? false
    }))
}
