import type { HomeProject, UserStatusResponse } from '~/types/user'

export function buildHomeProjects(status: UserStatusResponse): HomeProject[] {
  const planificationProjects = status.projects ?? {}
  const clockifyDeclaredHours = status.clockify?.declared ?? {}
  const planification = status.planification ?? {}
  const teams = status.teams ?? {}
  const planned: HomeProject[] = []

  for (const key in planificationProjects) {
    if (!Object.hasOwn(planificationProjects, key)) {
      continue
    }

    const element = planificationProjects[key] as { id?: number, name?: string }
    let roleID: number | null = null
    let roleTeam = 'N/A'

    for (const team in teams) {
      if (team === key) {
        const teamData = teams[team]
        if (teamData) {
          roleID = teamData.idRole
          roleTeam = teamData.description
        }
      }
    }

    planned.push({
      id: element?.id,
      name: key,
      quantityHours: planification[element.name ?? key] as number | undefined,
      declared: null,
      roleID,
      roleTeam
    })
  }

  for (const key in clockifyDeclaredHours) {
    if (!Object.hasOwn(clockifyDeclaredHours, key)) {
      continue
    }

    const declaredHours = clockifyDeclaredHours[key]
    const existing = planned.find(project => project.name === key)

    if (existing) {
      existing.declared = declaredHours
    } else {
      planned.push({
        name: key,
        quantityHours: null,
        declared: declaredHours,
        roleID: null,
        roleTeam: 'N/A'
      })
    }
  }

  return planned
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter(project => (project.declared ?? 0) > 0 || (project.quantityHours ?? 0) > 0)
}
