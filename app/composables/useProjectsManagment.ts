import type { AnyProject, ProjectFormPayload } from '~/types/project'

export const useProjectsManagment = () => {
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

  const createProject = (payload: ProjectFormPayload) => list.create(payload)
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
