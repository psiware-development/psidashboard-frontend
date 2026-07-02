import type { KpiItem, TimelineItem } from '~/types/dashboard'
import type { User, UserResumeData, UserResumeProjectRow, UserResumeTask, UserStatusResponse } from '~/types/user'
import { buildResumeKpis, buildResumeProjects } from '~/utils/userCases'
import { canAccessUserResume } from '~/utils/userAccess'

export const useUserResume = (userId: MaybeRef<string | number>) => {
  const authStore = useAuthStore()
  const { $api } = useNuxtApp()

  const loading = ref(true)
  const error = ref<string | null>(null)
  const forbidden = ref(false)
  const user = ref<User | null>(null)
  const resume = ref<UserResumeData | null>(null)
  const kpis = ref<KpiItem[]>([])
  const projects = ref<UserResumeProjectRow[]>([])
  const tasks = ref<UserResumeTask[]>([])
  const timeline = ref<TimelineItem[]>([])

  const showUserNameInTimeline = computed(() => {
    const roleId = authStore.currentUser?.mainRole?.idRole
    return roleId === 8 || roleId === 12
  })

  const plannedHours = computed(() =>
    resume.value?.personal_planification?.total_planned_monthly_hours ?? 0
  )

  const realHours = computed(() =>
    resume.value?.personal_planification?.current_real_hours ?? 0
  )

  const totalPlannedProjects = computed(() =>
    projects.value.reduce((total, project) => total + project.total_planned_monthly_hours, 0)
  )

  const totalRealProjects = computed(() =>
    projects.value.reduce((total, project) => total + project.current_real_hours, 0)
  )

  const totalDifference = computed(() =>
    projects.value.reduce(
      (total, project) => total + (project.total_planned_monthly_hours - project.current_real_hours),
      0
    )
  )

  const fetchResume = async () => {
    const id = toValue(userId)
    loading.value = true
    error.value = null
    forbidden.value = false

    if (!canAccessUserResume(authStore.currentUser)) {
      forbidden.value = true
      error.value = 'No tenés permisos para ver este resume.'
      loading.value = false
      return
    }

    try {
      const status = await $api<UserStatusResponse>(`/users/${id}/status`)

      if (!status?.me) {
        await navigateTo('/')
        return
      }

      user.value = status.me
      resume.value = await $api<UserResumeData>(`/users/${id}/resume`)
      kpis.value = buildResumeKpis(resume.value)
      projects.value = buildResumeProjects(resume.value)
      tasks.value = resume.value?.tasks ?? []
      timeline.value = resume.value?.timeline ?? []
    } catch {
      error.value = 'No se pudo cargar el resume del usuario.'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    forbidden,
    user,
    resume,
    kpis,
    projects,
    tasks,
    timeline,
    plannedHours,
    realHours,
    totalPlannedProjects,
    totalRealProjects,
    totalDifference,
    showUserNameInTimeline,
    fetchResume
  }
}

export const useMeData = () => {
  const authStore = useAuthStore()
  const { $api } = useNuxtApp()

  const loading = ref(true)
  const error = ref<string | null>(null)
  const meData = ref<Record<string, unknown> | null>(null)

  const fetchMe = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await $api<{ data?: { user?: Record<string, unknown> } } | Record<string, unknown>>('/users/me')
      const payload = response as { data?: { user?: Record<string, unknown> } }
      meData.value = payload.data?.user ?? (response as Record<string, unknown>)
    } catch {
      error.value = 'No se pudieron cargar tus datos.'
    } finally {
      loading.value = false
    }
  }

  const profileEntries = computed(() => {
    const user = authStore.currentUser
    const data = meData.value ?? {}

    return [
      { label: 'Usuario', value: user?.username ?? String(data.username ?? '-') },
      { label: 'Nombre', value: user?.fullname ?? String(data.fullname ?? '-') },
      { label: 'Email', value: String(data.email ?? '-') },
      { label: 'Rol principal', value: user?.mainRole?.description ?? String((data.mainRole as { description?: string } | undefined)?.description ?? '-') },
      { label: 'Usuario Taiga', value: String(user?.idTaigaUser ?? data.idTaigaUser ?? '-') }
    ]
  })

  return {
    loading,
    error,
    meData,
    profileEntries,
    fetchMe
  }
}
