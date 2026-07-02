import type { ProjectMonthlyStats, ProjectTrackingData } from '~/types/project'
import {
  buildMonthlyStatSections,
  formatMonthLabel,
  formatMonthParam,
  parseMonthInput,
  toMonthInputValue
} from '~/utils/projectWorkingOn'

export const useProjectMonthlyStats = (projectId: MaybeRef<string | number>) => {
  const { $api } = useNuxtApp()

  const loading = ref(true)
  const error = ref<string | null>(null)
  const projectName = ref('')
  const stats = ref<ProjectMonthlyStats | null>(null)
  const selectedMonth = ref(new Date())

  const monthInputValue = computed({
    get: () => toMonthInputValue(selectedMonth.value),
    set: (value: string) => {
      if (value) {
        selectedMonth.value = parseMonthInput(value)
      }
    }
  })

  const monthLabel = computed(() => formatMonthLabel(selectedMonth.value))

  const sections = computed(() =>
    stats.value ? buildMonthlyStatSections(stats.value) : []
  )

  const kpis = computed(() => stats.value?.kpis ?? [])

  const fetchMonthlyStats = async () => {
    loading.value = true
    error.value = null

    try {
      const date = formatMonthParam(selectedMonth.value)
      const [statsResponse, trackingResponse] = await Promise.all([
        $api<ProjectMonthlyStats>(`/project/${toValue(projectId)}/monthly-stats`, {
          query: { date }
        }),
        $api<ProjectTrackingData>(`/project/${toValue(projectId)}/tracking`)
      ])

      stats.value = statsResponse
      projectName.value = trackingResponse.project.description
    } catch {
      error.value = 'No se pudieron cargar las estadísticas mensuales.'
    } finally {
      loading.value = false
    }
  }

  watch(selectedMonth, () => {
    fetchMonthlyStats()
  }, { immediate: true })

  return {
    loading,
    error,
    projectName,
    stats,
    selectedMonth,
    monthInputValue,
    monthLabel,
    sections,
    kpis,
    fetchMonthlyStats
  }
}
