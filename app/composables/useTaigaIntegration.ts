import type { TaigaTeamMapPayload } from '~/types/project'

export interface SetupTaigaOptions {
  teamMap?: TaigaTeamMapPayload
  collaborators?: number[]
}

export const useTaigaIntegration = () => {
  const { $api } = useNuxtApp()
  const authStore = useAuthStore()
  const toast = useToast()

  const initializeProject = async (idProject: number): Promise<boolean> => {
    const authToken = authStore.accessToken || ''
    try {
      await $api(`/projects/${idProject}/initialize-taiga?auth_token=${encodeURIComponent(authToken)}`, {
        method: 'POST'
      })
      return true
    } catch (error) {
      console.error('Error initializing Taiga project:', error)
      toast.add({
        title: 'Advertencia',
        description: 'No se pudo inicializar el proyecto en Taiga.',
        color: 'warning'
      })
      return false
    }
  }

  const assignTeam = async (
    idProject: number,
    teamMap?: TaigaTeamMapPayload,
    collaborators?: number[]
  ): Promise<boolean> => {
    const rawTeamMap: TaigaTeamMapPayload = teamMap || (collaborators && collaborators.length > 0 ? { team: collaborators } : {})
    const payloadTeamMap: Record<string, string[]> = {}
    for (const [role, members] of Object.entries(rawTeamMap)) {
      payloadTeamMap[role] = members.map(id => String(id))
    }

    if (Object.keys(payloadTeamMap).length === 0) {
      return true
    }

    try {
      await $api(`/projects/${idProject}/create-team`, {
        method: 'POST',
        body: payloadTeamMap
      })
      return true
    } catch (error) {
      console.error('Error creating Taiga team:', error)
      toast.add({
        title: 'Advertencia',
        description: 'No se pudieron asignar los colaboradores en Taiga.',
        color: 'warning'
      })
      return false
    }
  }

  const setupTaigaProject = async (
    idProject: number,
    options: SetupTaigaOptions
  ): Promise<void> => {
    const initialized = await initializeProject(idProject)
    if (initialized) {
      await assignTeam(idProject, options.teamMap, options.collaborators)
    }
  }

  return {
    initializeProject,
    assignTeam,
    setupTaigaProject
  }
}
