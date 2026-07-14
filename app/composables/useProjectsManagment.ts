import type { AdminProject, AdminProjectFormPayload } from '~/types/project'

export const useProjectsManagment = () => {
  const { $api } = useNuxtApp()
  const toast = useToast()

  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)
  const projects = ref<AdminProject[]>([])

  const search = ref('')
  const filterActive = ref<boolean | undefined>()

  const filteredProjects = computed(() => {
    return projects.value.filter((p) => {
      const matchesSearch = !search.value
        || p.name?.toLowerCase().includes(search.value.toLowerCase())
        || p.description?.toLowerCase().includes(search.value.toLowerCase())

      const matchesActive = filterActive.value === undefined
        || p.active === filterActive.value

      return matchesSearch && matchesActive
    })
  })

  const fetchProjects = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await $api<AdminProject[]>('/projects')
      projects.value = response ?? []
    } catch {
      error.value = 'No se pudo cargar el listado de proyectos.'
    } finally {
      loading.value = false
    }
  }

  const fetchProject = async (id: number): Promise<AdminProject | null> => {
    try {
      return await $api<AdminProject>(`/projects/${id}`)
    } catch {
      return null
    }
  }

  const createProject = async (payload: AdminProjectFormPayload): Promise<boolean> => {
    saving.value = true
    try {
      await $api('/projects', {
        method: 'POST',
        body: {
          name: payload.name,
          description: payload.description || null,
          active: payload.active ?? true,
          id_taiga_project: payload.idTaigaProject || null,
          slug: payload.slug || null
        }
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

  const updateProject = async (id: number, payload: AdminProjectFormPayload): Promise<boolean> => {
    saving.value = true
    try {
      await $api(`/projects/${id}`, {
        method: 'PATCH',
        body: {
          name: payload.name,
          description: payload.description || null,
          active: payload.active ?? true,
          id_taiga_project: payload.idTaigaProject || null,
          slug: payload.slug || null
        }
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
    filteredProjects,
    fetchProjects,
    fetchProject,
    createProject,
    updateProject
  }
}
