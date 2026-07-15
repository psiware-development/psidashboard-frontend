import type { TimelineItem } from '~/types/dashboard'
import type { Customer } from '~/types/customer'

export interface ProjectPlanification {
  total?: number
  quantityHours?: number
  users?: Record<string, { quantity_hours: number }>
}

export interface ProjectTeamMemberRaw {
  user?: {
    idUser: number
    fullname: string
    image?: string
    email?: string
  }
  role?: {
    description: string
  }
}

export interface ProjectClockifyTask {
  idTask?: number
  description?: string
  realTime?: number
  realStartDate?: string
  classification?: string
  needRefinement?: boolean
  user?: {
    idUser: number
    fullname: string
    image?: string
  }
  userStory?: {
    ref?: string | number
    link?: string
  }
  issue?: {
    ref?: string | number
    link?: string
  }
  project?: {
    id?: number
    description?: string
  }
}

export interface ProjectDisciplineRaw {
  real_hours?: number
  id?: number
}

export interface ProjectUserStory {
  id?: number
  ref?: string | number
  subject?: string
  status?: string
  points?: number
  realHoursDeclared?: number
  milestone?: string
  link?: string
  epic?: { color?: string }
  assignedUser?: {
    idUser?: number
    fullname?: string
    image?: string
  }
}

export interface ProjectIssue {
  id?: number
  ref?: string | number
  subject?: string
  description?: string
  realHoursDeclared?: number
  link?: string
  user?: {
    idUser?: number
    fullname?: string
    image?: string
  }
}

export interface ProjectFixedStats {
  total_planned_hours?: number
  total_real_hours?: number
  total_points?: number
  budget_points?: number
  estimate_remaining_hours?: number
}

export interface ProjectTrackingData {
  project: AnyProject
  planification?: ProjectPlanification
  clockify?: ProjectClockifyTask[] | Record<string, ProjectClockifyTask[]>
  disciplines?: Record<string, ProjectDisciplineRaw | number>
  team?: ProjectTeamMemberRaw[]
  taiga?: {
    user_stories?: ProjectUserStory[]
    issues?: ProjectIssue[]
  }
  timeline?: {
    timeline: TimelineItem[]
  }
  stats?: ProjectFixedStats
}

export interface ProjectTeamMember {
  id: number
  name: string
  role: string
  image?: string
  declared: number
  assigned: number
}

export interface ProjectDiscipline {
  key: string
  label: string
  hours: number
  percentage: number
}

export interface ProjectUserStoryRow {
  sprint: string
  subject: string
  status?: string
  points: string | number
  realHours: string | number
  ratio: { value: string, tone: 'success' | 'warning' | 'error' | 'neutral' }
  assignedUser?: ProjectUserStory['assignedUser']
  link?: string
  epicColor?: string
}

export interface ProjectIssueRow {
  issue: string
  description: string
  realHours: string | number
  user?: ProjectIssue['user']
  link?: string
}

export interface ProjectTaskRow {
  taigaRef: string
  taigaLink?: string
  description: string
  user?: ProjectClockifyTask['user']
  classification: string
  date: string
  hours: number
  needRefinement: boolean
}

export interface ProjectWorkingOnTask {
  ref: string | number
  type: string
  link?: string
  subject: string
  severity?: string
  status?: string
  points?: string | number
  realHours?: number
  lastHours?: number
  createdDate?: string
  inProgressDate?: string
  qaDate?: string
  qaOkDate?: string
  project?: {
    idProject: number
    description: string
  }
  user?: {
    idUser: number
    fullname: string
    image?: string
  }
}

export interface ProjectWorkingOnResponse {
  tasks: ProjectWorkingOnTask[]
  timeline: TimelineItem[]
}

export interface ProjectWorkingOnRow {
  id: string
  ref: string
  type: string
  link?: string
  projectId?: number
  projectName?: string
  userId?: number
  userName?: string
  userImage?: string
  subject: string
  severity?: string
  status?: string
  points: string
  hours: string
  createdDate: string
  inProgressDate: string
  qaDate: string
  qaOkDate: string
}

export interface ProjectMonthlyStatItem {
  label: string
  value: string | number
}

export interface ProjectMonthlyKpi {
  value: number | null
  kpi: {
    description: string
  }
}

export interface ProjectMonthlyStats {
  general?: Record<string, number | string>
  tickets?: Record<string, number>
  metrics?: Record<string, number | string>
  kpis?: ProjectMonthlyKpi[]
  database?: unknown
}

export interface Project {
  idProject: number
  description: string
  active: boolean
  customer: Customer
  clockifyID?: string
  projectType: number
  color?: string
  fixed: boolean
  fromCyP: boolean
  continuos: boolean
  internal: boolean
}

export interface ProjectFixed extends Project {
  fixed: true
  taigaProjectID?: number
  taigaSlug?: string
  totalRealHours?: number
  totalPoints?: number
  plannedQuantityHours?: number
  plannedMilestonesPerMonth?: number
  currentBudget?: number
  taigaConfigurationVerificationId?: number
  taigaConfigurationValidationId?: number
}

export interface ProjectContinuos extends Project {
  fixed: false
}

export type AnyProject = ProjectFixed | ProjectContinuos

export interface ProjectFormPayload {
  description: string
  active: boolean
  idCustomer: number
  projectType: number
  fixed: boolean
  continuos: boolean
  fromCyP: boolean
  internal: boolean
  clockifyID?: string
  color?: string
  // Campos Taiga — solo aplican cuando fixed = true
  taigaProjectID?: number | null
  taigaSlug?: string | null
  taigaConfigurationVerificationId?: number | null
  taigaConfigurationValidationId?: number | null
  // Planificación — solo aplican cuando fixed = true
  plannedQuantityHours?: number | null
  plannedMilestonesPerMonth?: number | null
  currentBudget?: number | null
}
