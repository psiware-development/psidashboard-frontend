import type { AnyProject, ProjectFormPayload, TaigaTeamMapPayload } from '~/types/project'

export const useProjectsManagment = () => {
  const { $api } = useNuxtApp()
  const authStore = useAuthStore()
  const toast = useToast()

  const filterActive = ref<boolean | undefined>()
  const filterType = ref<number | undefined>()

  const list = useList<AnyProject>({
    endpoints: {
      list: '/projects/active',
      item: '/projects',
      create: '/projects'
    },
    idField: 'idProject',
    filterFn: (p, search) => {
      const matchesSearch = !search
        || p.description?.toLowerCase().includes(search.toLowerCase())
        || p.customer?.corporateName?.toLowerCase().includes(search.toLowerCase())

      const matchesActive = filterActive.value === undefined
        || p.active === filterActive.value

      const matchesType = filterType.value === undefined
        || p.projectType === filterType.value

      return matchesSearch && matchesActive && matchesType
    },
    messages: {
      fetchError: 'No se pudo cargar el listado de proyectos.',
      createSuccess: 'Proyecto creado correctamente.',
      createError: 'Error al crear el proyecto.',
      updateSuccess: 'Proyecto actualizado correctamente.',
      updateError: 'Error al actualizar el proyecto.',
      deleteSuccess: 'Proyecto eliminado correctamente.',
      deleteError: 'Error al eliminar el proyecto.'
    }
  })

  const createProject = async (payload: ProjectFormPayload): Promise<boolean> => {
    const { initializeTaiga, collaborators, teamMap, ...projectPayload } = payload

    const createdProject = await list.create(projectPayload)
    if (!createdProject || !createdProject.idProject) {
      return false
    }

    const idProject = createdProject.idProject

    if (initializeTaiga) {
      const authToken = authStore.accessToken || ''
      try {
        await $api(`/projects/${idProject}/initialize-taiga?auth_token=${encodeURIComponent(authToken)}`, {
          method: 'POST'
        })
      } catch (taigaError) {
        console.error('Error initializing Taiga project:', taigaError)
        toast.add({
          title: 'Advertencia',
          description: 'El proyecto se creó, pero no se pudo inicializar en Taiga.',
          color: 'warning'
        })
      }

      const payloadTeamMap: TaigaTeamMapPayload = teamMap || (collaborators && collaborators.length > 0 ? { team: collaborators } : {})

      if (Object.keys(payloadTeamMap).length > 0) {
        try {
          await $api(`/projects/${idProject}/create-team`, {
            method: 'POST',
            body: payloadTeamMap
          })
        } catch (teamError) {
          console.error('Error creating Taiga team:', teamError)
          toast.add({
            title: 'Advertencia',
            description: 'El proyecto se creó, pero no se pudieron asignar los colaboradores en Taiga.',
            color: 'warning'
          })
        }
      }
    }

    return true
  }

  const updateProject = (id: number, payload: ProjectFormPayload) => list.update(id, payload)

  return {
    loading: list.loading,
    saving: list.saving,
    deleting: list.deleting,
    error: list.error,
    projects: list.items,
    search: list.search,
    filterActive,
    filterType,
    filteredProjects: list.filteredItems,
    fetchProjects: list.fetch,
    fetchProject: list.fetchOne,
    createProject,
    updateProject,
    deleteProject: list.remove
  }
}
