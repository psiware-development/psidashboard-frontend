import type { User } from './user'
import type { AnyProject } from './project'

export interface PersonalPlanification {
  total_diff_nominal: number
  current_real_hours: number
  current_expected_hours: number
  total_planned_monthly_hours: number
}

export interface CollaboratorProjectStatus {
  total_diff_nominal: number
  current_real_hours: number
  current_expected_hours: number
  total_planned_monthly_hours: number
  project: AnyProject
}

export interface CollaboratorGeneralStats {
  average_mttr_critical_issues: number
  backlog_uss_points: number
  real_hours_bugs: number
  median_mttr_issues_days: number
  mttr_issues: Record<string, unknown>
  issues_ratio_hours: string | number
  bug_count: number
  ratio_uss_points_hours: string | number
  total_delivered_points: number
  backlog_uss_count: number
  total_hours: number
}

export interface CollaboratorTicketsStats {
  tickets_qa: number
  avg_qa_days: number
  tickets_done: number
  avg_in_progress_days: number
  tickets_qa_ok: number
  avg_qa_ok_days: number
  worked_tickets: number
  tickets_in_progress: number
}

export interface CollaboratorMetrics {
  defect_density: string | number
  rework_rate: string | number
}

export interface CollaboratorKPI {
  kpi: {
    idKPI: number
    description: string
    scope: string
  }
  value: string | number
}

export interface CollaboratorStats {
  general: CollaboratorGeneralStats
  database: Record<string, unknown>
  tickets: CollaboratorTicketsStats
  metrics: CollaboratorMetrics
  kpis: Record<string, CollaboratorKPI>
}

export interface CollaboratorStatus {
  personal_planification: PersonalPlanification
  github: unknown[]
  projects: Record<string, CollaboratorProjectStatus>
  stats: CollaboratorStats
  taiga: unknown[]
  timeline: unknown[]
  user: User
  tasks: unknown[]
}

export type CollaboratorsStatusResponse = Record<string, CollaboratorStatus>
