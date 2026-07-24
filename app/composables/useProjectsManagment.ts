import type { AnyProject, ProjectFormPayload } from '~/types/project'

export const useProjectsManagment = () => {
  const toast = useToast()
  const { setupTaigaProject } = useTaigaIntegration()

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

  const isProjectNameTaken = (name: string, excludeId?: number): boolean => {
    const normalizeName = name.trim().toLowerCase()

    return list.items.value.some((p) => {
      if (excludeId !== undefined && p.idProject === excludeId) {
        return false
      }
      return p.description?.trim().toLowerCase() === normalizeName
    })
  }

  const createProject = async (payload: ProjectFormPayload): Promise<boolean> => {
    if (list.items.value.length === 0) {
      await list.fetch()
    }

    if (isProjectNameTaken(payload.description)) {
      toast.add({
        title: 'Ya existe un proyecto con ese nombre.',
        color: 'error'
      })
      return false
    }

    const { initializeTaiga, collaborators, teamMap, ...projectPayload } = payload

    const createdProject = await list.create(projectPayload)
    if (!createdProject || !createdProject.idProject) {
      return false
    }

    if (initializeTaiga) {
      await setupTaigaProject(createdProject.idProject, { teamMap, collaborators })
    }

    return true
  }

  const updateProject = async (id: number, payload: ProjectFormPayload): Promise<boolean> => {
    if (list.items.value.length === 0) {
      await list.fetch()
    }

    if (isProjectNameTaken(payload.description, id)) {
      toast.add({
        title: 'Ya existe un proyecto con ese nombre.',
        color: 'error'
      })
      return false
    }

    return list.update(id, payload)
  }

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
    deleteProject: list.remove,
    isProjectNameTaken
  }
}
