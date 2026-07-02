import type { TimelineItem } from '~/types/dashboard'
import type { ProjectWorkingOnResponse, ProjectWorkingOnTask } from '~/types/project'
import type { UserStatusResponse } from '~/types/user'
import {
  buildProjectWorkingOnRows,
  countWorkingOnByType,
  sortProjectWorkingOnRows,
  type ProjectWorkingOnSort
} from '~/utils/projectWorkingOn'
import { canAccessUserResource } from '~/utils/userAccess'

export const useUserWorkingOn = (userId: MaybeRef<string | number>) => {
  const authStore = useAuthStore()
  const { $api } = useNuxtApp()

  const loading = ref(true)
  const error = ref<string | null>(null)
  const forbidden = ref(false)
  const userName = ref('')
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
    const id = toValue(userId)
    loading.value = true
    error.value = null
    forbidden.value = false

    if (!canAccessUserResource(authStore.currentUser, id)) {
      forbidden.value = true
      error.value = 'No tenés permisos para ver este working on.'
      loading.value = false
      return
    }

    try {
      const [workingOnResponse, statusResponse] = await Promise.all([
        $api<ProjectWorkingOnResponse>(`/users/${id}/working-on`),
        $api<UserStatusResponse>(`/users/${id}/status`)
      ])

      tasks.value = workingOnResponse.tasks ?? []
      timeline.value = workingOnResponse.timeline ?? []
      userName.value = statusResponse.me.fullname || statusResponse.me.username
    } catch {
      error.value = 'No se pudo cargar el working on del usuario.'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    forbidden,
    userName,
    tasks,
    timeline,
    summary,
    rows,
    sortBy,
    showUserNameInTimeline,
    fetchWorkingOn
  }
}
