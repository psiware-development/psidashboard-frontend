import type { AnyProject, ProjectFormPayload } from '~/types/project'

export const useProjectsManagment = () => {
  const { $api } = useNuxtApp()
  const toast = useToast()

  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)
  const projects = ref<AnyProject[]>([])

  const search = ref('')
  const filterActive = ref<boolean | undefined>()
  const filterType = ref<'fixed' | 'continuos' | undefined>()

  const filteredProjects = computed(() => {
    return projects.value.filter((p) => {
      const matchesSearch = !search.value
        || p.description?.toLowerCase().includes(search.value.toLowerCase())
        || p.customer?.corporateName?.toLowerCase().includes(search.value.toLowerCase())

      const matchesActive = filterActive.value === undefined
        || p.active === filterActive.value

      const matchesType = filterType.value === undefined
        || (filterType.value === 'fixed' && p.fixed)
        || (filterType.value === 'continuos' && !p.fixed)

      return matchesSearch && matchesActive && matchesType
    })
  })

  const fetchProjects = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await $api<AnyProject[]>('/projects/active')
      projects.value = response ?? []
    } catch {
      error.value = 'No se pudo cargar el listado de proyectos.'
    } finally {
      loading.value = false
    }
  }

  const fetchProject = async (id: number): Promise<AnyProject | null> => {
    try {
      return await $api<AnyProject>(`/projects/${id}`)
    } catch {
      return null
    }
  }

  const createProject = async (payload: ProjectFormPayload): Promise<boolean> => {
    saving.value = true
    try {
      await $api('/projects', {
        method: 'POST',
        body: payload
      })
      toast.add({ title: 'Proyecto creado correctamente', color: 'success' })
      return true
    } catch {
      toast.add({ title: 'Error al crear el proyecto', color: 'error' })
      return false
    } finally {
      saving.value = false
    }
  }

  const updateProject = async (id: number, payload: ProjectFormPayload): Promise<boolean> => {
    saving.value = true
    try {
      await $api(`/projects/${id}`, {
        method: 'PATCH',
        body: payload
      })
      toast.add({ title: 'Proyecto actualizado correctamente', color: 'success' })
      return true
    } catch {
      toast.add({ title: 'Error al actualizar el proyecto', color: 'error' })
      return false
    } finally {
      saving.value = false
    }
  }

  return {
    loading,
    saving,
    error,
    projects,
    search,
    filterActive,
    filterType,
    filteredProjects,
    fetchProjects,
    fetchProject,
    createProject,
    updateProject
  }
}
