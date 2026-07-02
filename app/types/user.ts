export interface UserRole {
  role: string
}

export interface User {
  idUser: number
  username: string
  fullname?: string
  email?: string
  roleSM?: boolean
  roleAdmin?: boolean
  admin?: boolean
  mainRole?: {
    idRole: number
    description?: string
  }
  roles?: UserRole[]
  image?: string
  idTaigaUser?: number | string
}

export interface UserStatusResponse {
  me: User
  projects?: Record<string, unknown>
  planification?: Record<string, unknown>
  clockify?: {
    declared?: Record<string, number>
  }
  teams?: Record<string, { idRole: number, description: string }>
  kpis?: unknown
  kpis_values?: unknown
}

export interface WorkingOnItem {
  ref: string | number
  type: string
  subject: string
  status?: string
  points?: string | number
  severity?: string
  createdDate?: string
  link?: string
  project: {
    idProject: number
    description: string
  }
}

export interface HomeProject {
  id?: number
  name: string
  quantityHours?: number | null
  declared?: number | null
  roleID?: number | null
  roleTeam?: string
}

export interface ActiveUser {
  idUser: number
  fullname: string
  username?: string
  image?: string
  mainRole?: {
    idRole: number
    description?: string
  }
}

export interface UserMessage {
  id: number
  message: string
  status: string
  userSender?: { fullname: string }
  userReceiver?: { fullname: string }
}

export interface UserTaskCase {
  id: number
  message?: string
  expirationDate?: string
  status: string
  priority?: string
  severity?: string
  project?: {
    id?: number
    description?: string
  }
}

export interface UserResumeProjectRow {
  name: string
  total_planned_monthly_hours: number
  current_real_hours: number
}

export interface UserResumeTask {
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

export interface UserResumeData {
  kpis?: Record<string, string>
  kpis_values?: Record<string, number | null>
  projects?: Record<string, Omit<UserResumeProjectRow, 'name'>>
  personal_planification?: {
    total_planned_monthly_hours?: number
    current_real_hours?: number
  }
  tasks?: UserResumeTask[]
  timeline?: import('~/types/dashboard').TimelineItem[]
}

export interface SignupResponse {
  token: string
  data: {
    user: User
  }
}
