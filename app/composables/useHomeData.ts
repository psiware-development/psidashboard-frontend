import type { KpiDescription, KpiItem, TimelineItem, TimelineResponse } from '~/types/dashboard'
import type { HomeProject, UserStatusResponse, WorkingOnItem } from '~/types/user'
import { buildHomeProjects } from '~/utils/homeProjects'
import { buildWorkingOnRows } from '~/utils/workingOn'
import { canViewUserNamesInTimeline } from '~/utils/userAccess'

function buildKpis(
  descriptions?: KpiDescription[],
  values?: Record<string | number, number>
): KpiItem[] {
  if (!descriptions?.length) {
    return []
  }

  return descriptions.map(kpi => ({
    idKPI: kpi.idKPI,
    description: kpi.description,
    value: values?.[kpi.idKPI] ?? null
  }))
}

export const useHomeData = () => {
  const authStore = useAuthStore()
  const { $api } = useNuxtApp()

  const loading = ref(true)
  const error = ref<string | null>(null)
  const status = ref<UserStatusResponse | null>(null)
  const projects = ref<HomeProject[]>([])
  const workingOn = ref<WorkingOnItem[]>([])
  const workingOnRows = ref<ReturnType<typeof buildWorkingOnRows>>([])
  const kpis = ref<KpiItem[]>([])
  const timeline = ref<TimelineItem[]>([])

  const showUserNameInTimeline = computed(() =>
    canViewUserNamesInTimeline(authStore.currentUser)
  )

  const fetchHomeData = async () => {
    const userId = authStore.currentUser?.idUser

    if (!userId) {
      error.value = 'No se pudo identificar al usuario.'
      loading.value = false
      return
    }

    loading.value = true
    error.value = null

    try {
      const [statusResponse, workingOnResponse, timelineResponse] = await Promise.all([
        $api<UserStatusResponse>('/users/me/status'),
        $api<WorkingOnItem[]>('/users/working-on'),
        $api<TimelineResponse>(`/users/${userId}/working-on`)
      ])

      status.value = statusResponse
      projects.value = buildHomeProjects(statusResponse)
      workingOn.value = workingOnResponse ?? []
      workingOnRows.value = buildWorkingOnRows(workingOn.value)
      kpis.value = buildKpis(
        statusResponse.kpis as KpiDescription[] | undefined,
        statusResponse.kpis_values as Record<string | number, number> | undefined
      )
      timeline.value = timelineResponse?.timeline ?? []
    } catch {
      error.value = 'No se pudieron cargar los datos del dashboard.'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    status,
    projects,
    workingOn,
    workingOnRows,
    kpis,
    timeline,
    showUserNameInTimeline,
    fetchHomeData
  }
}
