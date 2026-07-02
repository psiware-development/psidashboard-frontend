export interface KpiDescription {
  idKPI: number
  description: string
  scope?: string
}

export interface KpiItem {
  idKPI: number
  description: string
  value: number | null
}

export interface TimelineUser {
  idUser: number
  fullname: string
  image?: string
}

export interface TimelineEntity {
  ref?: string | number
  subject?: string
  link?: string
  status?: string
}

export interface TimelineItem {
  id?: string | number
  datetime: string
  type: string
  comment?: string
  project: {
    description: string
    idProject?: number
  }
  user?: TimelineUser
  userStory?: TimelineEntity
  issue?: TimelineEntity
}

export interface TimelineResponse {
  timeline: TimelineItem[]
}

export interface WorkingOnRow {
  ref: string
  type: string
  link?: string
  project: string
  projectId: number
  subject: string
  severity?: string
  status?: string
  points: string
  assignedDate: string
}
