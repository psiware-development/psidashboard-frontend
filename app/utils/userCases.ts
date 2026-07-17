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
