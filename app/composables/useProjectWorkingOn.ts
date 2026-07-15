import type { TimelineItem } from '~/types/dashboard'
import type { ProjectTrackingData, ProjectWorkingOnResponse, ProjectWorkingOnTask } from '~/types/project'
import {
  buildProjectWorkingOnRows,
  countWorkingOnByType,
  sortProjectWorkingOnRows,
  type ProjectWorkingOnSort
} from '~/utils/projectWorkingOn'

export const useProjectWorkingOn = (projectId: MaybeRef<string | number>) => {
  const authStore = useAuthStore()
  const { $api } = useNuxtApp()

  const loading = ref(true)
  const error = ref<string | null>(null)
  const projectName = ref('')
  const tasks = ref<ProjectWorkingOnTask[]>([])
  const timeline = ref<TimelineItem[]>([])
  const sortBy = ref<ProjectWorkingOnSort>('severity')

  const summary = computed(() => countWorkingOnByType(tasks.value))

  const rows = computed(() => {
    const built = buildProjectWorkingOnRows(tasks.value)
    return sortProjectWorkingOnRows(built, tasks.value, sortBy.value)
  })

  const showUserNameInTimeline = computed(() => {
    const roleId = authStore.currentUser?.mainRole?.idRole
    return roleId === 8 || roleId === 12
  })

  const fetchWorkingOn = async () => {
    loading.value = true
    error.value = null

    try {
      const [workingOnResponse, trackingResponse] = await Promise.all([
        $api<{ data: ProjectWorkingOnResponse } | ProjectWorkingOnResponse>(
          `/projects/${toValue(projectId)}/working-on`
        ),
        $api<ProjectTrackingData>(`/projects/${toValue(projectId)}/tracking`)
      ])

      const payload = 'data' in workingOnResponse && workingOnResponse.data?.tasks
        ? workingOnResponse.data
        : workingOnResponse as ProjectWorkingOnResponse

      tasks.value = payload.tasks ?? []
      timeline.value = payload.timeline ?? []
      projectName.value = trackingResponse.project.description
    } catch {
      error.value = 'No se pudo cargar el working on del proyecto.'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    projectName,
    tasks,
    timeline,
    summary,
    rows,
    sortBy,
    showUserNameInTimeline,
    fetchWorkingOn
  }
}
