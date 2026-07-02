import type { ProjectTrackingData } from '~/types/project'
import {
  buildDisciplines,
  buildIssueRows,
  buildTaskRows,
  buildTeamMembers,
  buildUserStoryRows,
  getDeclaredHours,
  getPlannedHours
} from '~/utils/projectTransform'
import {
  formatHoursGreen,
  formatHoursRed,
  formatHoursYellow,
  getCurrentMonthName,
  getProjectProgress
} from '~/utils/projectUtils'

export const useProjectTracking = (projectId: MaybeRef<string | number>) => {
  const authStore = useAuthStore()
  const { $api } = useNuxtApp()

  const loading = ref(true)
  const error = ref<string | null>(null)
  const forbidden = ref(false)
  const downloadingReport = ref(false)
  const projectData = ref<ProjectTrackingData | null>(null)

  const isFixedProject = computed(() => projectData.value?.project?.fixed === true)
  const projectName = computed(() => projectData.value?.project?.description ?? '')
  const projectIdValue = computed(() => projectData.value?.project?.idProject ?? Number(toValue(projectId)))

  const plannedHours = computed(() =>
    projectData.value ? getPlannedHours(projectData.value) : 0
  )

  const declaredHours = computed(() =>
    projectData.value ? getDeclaredHours(projectData.value) : 0
  )

  const progress = computed(() =>
    getProjectProgress(declaredHours.value, plannedHours.value)
  )

  const currentMonth = computed(() => getCurrentMonthName())

  const hoursDetail = computed(() => ({
    declared: formatHoursGreen(declaredHours.value, plannedHours.value),
    remaining: formatHoursYellow(declaredHours.value, plannedHours.value),
    additional: formatHoursRed(declaredHours.value, plannedHours.value)
  }))

  const teamMembers = computed(() =>
    projectData.value ? buildTeamMembers(projectData.value) : []
  )

  const disciplines = computed(() =>
    projectData.value ? buildDisciplines(projectData.value, declaredHours.value) : []
  )

  const userStories = computed(() =>
    projectData.value ? buildUserStoryRows(projectData.value) : []
  )

  const issues = computed(() =>
    projectData.value ? buildIssueRows(projectData.value) : []
  )

  const tasks = computed(() =>
    projectData.value ? buildTaskRows(projectData.value) : []
  )

  const timeline = computed(() => projectData.value?.timeline?.timeline ?? [])

  const fixedStats = computed(() => projectData.value?.stats ?? null)

  const showUserNameInTimeline = computed(() => {
    const roleId = authStore.currentUser?.mainRole?.idRole
    return roleId === 8 || roleId === 12
  })

  const fetchProject = async () => {
    loading.value = true
    error.value = null
    forbidden.value = false

    try {
      projectData.value = await $api<ProjectTrackingData>(
        `/project/${toValue(projectId)}/tracking`
      )
    } catch (err: unknown) {
      const status = (err as { statusCode?: number, response?: { status?: number } })?.statusCode
        ?? (err as { response?: { status?: number } })?.response?.status

      if (status === 403) {
        forbidden.value = true
        error.value = 'No tenés permisos para ver este proyecto.'
      } else {
        error.value = 'No se pudo cargar el proyecto.'
      }
    } finally {
      loading.value = false
    }
  }

  const downloadReport = async () => {
    if (!projectData.value) {
      return
    }

    downloadingReport.value = true

    try {
      const blob = await $api<Blob>(
        `/project/${projectIdValue.value}/clockify/reports/monthly`,
        { responseType: 'blob' }
      )

      const href = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = href
      link.download = `${projectName.value}.xls`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(href)
    } catch {
      error.value = 'No se pudo descargar el reporte.'
    } finally {
      downloadingReport.value = false
    }
  }

  return {
    loading,
    error,
    forbidden,
    downloadingReport,
    projectData,
    isFixedProject,
    projectName,
    projectIdValue,
    plannedHours,
    declaredHours,
    progress,
    currentMonth,
    hoursDetail,
    teamMembers,
    disciplines,
    userStories,
    issues,
    tasks,
    timeline,
    fixedStats,
    showUserNameInTimeline,
    fetchProject,
    downloadReport
  }
}
