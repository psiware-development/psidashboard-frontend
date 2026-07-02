<script setup lang="ts">
const route = useRoute()
const projectId = computed(() => route.params.id as string)
const numericProjectId = computed(() => Number(projectId.value))

const {
  loading,
  error,
  forbidden,
  downloadingReport,
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
} = useProjectTracking(projectId)

watch(projectName, (name) => {
  if (name) {
    usePageTitle(name)
  }
}, { immediate: true })

onMounted(() => {
  fetchProject()
})
</script>

<template>
  <div class="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 space-y-8">
    <UAlert
      v-if="error"
      color="error"
      variant="subtle"
      :title="error"
    />

    <UAlert
      v-if="forbidden"
      color="warning"
      variant="subtle"
      title="Acceso restringido"
      description="No tenés permisos para ver este proyecto."
    />

    <template v-else>
      <HomeSectionTitle :title="projectName || 'Proyecto'" />

      <ProjectFixedOverview
        v-if="isFixedProject && !loading"
        :stats="fixedStats"
        :project-id="numericProjectId"
        :planned-hours="plannedHours"
        :declared-hours="declaredHours"
        :progress="progress"
        :downloading-report="downloadingReport"
        @download-report="downloadReport"
      />

      <template v-else>
        <div class="grid gap-6 lg:grid-cols-12">
          <div class="lg:col-span-5 space-y-4">
            <ProjectSummaryPanel
              :planned-hours="plannedHours"
              :declared-hours="declaredHours"
              :progress="progress"
              :current-month="currentMonth"
              :loading="loading"
            />

            <div class="grid gap-3 sm:grid-cols-3">
              <ProjectHoursStat
                label="Horas declaradas"
                :value="hoursDetail.declared"
                tone="success"
              />
              <ProjectHoursStat
                label="Horas restantes"
                :value="hoursDetail.remaining"
                tone="warning"
              />
              <ProjectHoursStat
                label="Horas adicionales"
                :value="hoursDetail.additional"
                tone="error"
              />
            </div>

            <ProjectActionsPanel
              :project-id="numericProjectId"
              :downloading-report="downloadingReport"
              @download-report="downloadReport"
            />
          </div>

          <div class="lg:col-span-7">
            <ProjectTeamGrid
              :members="teamMembers"
              :loading="loading"
            />
          </div>
        </div>

        <ProjectDisciplinesGrid
          :disciplines="disciplines"
          :loading="loading"
        />
      </template>

      <div class="grid gap-6 lg:grid-cols-12">
        <div class="lg:col-span-8">
          <ProjectActivityPanel
            v-if="!isFixedProject"
            :user-stories="userStories"
            :issues="issues"
            :tasks="tasks"
            :loading="loading"
          />
        </div>

        <aside class="lg:col-span-4">
          <HomeTimeline
            :items="timeline"
            :show-user="showUserNameInTimeline"
            :loading="loading"
          />
        </aside>
      </div>

      <ProjectTeamGrid
        v-if="isFixedProject"
        :members="teamMembers"
        :loading="loading"
      />
    </template>
  </div>
</template>
