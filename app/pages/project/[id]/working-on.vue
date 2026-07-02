<script setup lang="ts">
const route = useRoute()
const projectId = computed(() => route.params.id as string)

const {
  loading,
  error,
  projectName,
  summary,
  rows,
  timeline,
  sortBy,
  showUserNameInTimeline,
  fetchWorkingOn
} = useProjectWorkingOn(projectId)

watch(projectName, (name) => {
  if (name) {
    usePageTitle(`${name} - Working on`)
  }
}, { immediate: true })

onMounted(() => {
  fetchWorkingOn()
})
</script>

<template>
  <div class="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 space-y-8">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <HomeSectionTitle :title="projectName || 'Working on'" />
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-arrow-left"
        label="Volver al proyecto"
        :to="`/project/${projectId}/tracking`"
      />
    </div>

    <UAlert
      v-if="error"
      color="error"
      variant="subtle"
      :title="error"
    />

    <div class="grid gap-6 lg:grid-cols-2">
      <ProjectWorkingOnSummary
        :issues="summary.issues"
        :user-stories="summary.userStories"
        :loading="loading"
      />

      <HomeTimeline
        :items="timeline"
        :show-user="showUserNameInTimeline"
        :loading="loading"
      />
    </div>

    <ProjectWorkingOnTable
      v-model:sort-by="sortBy"
      :rows="rows"
      :loading="loading"
    />
  </div>
</template>
