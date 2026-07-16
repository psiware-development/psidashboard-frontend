<script setup lang="ts">
const route = useRoute()
const userId = computed(() => route.params.id as string)

const {
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
} = useUserWorkingOn(userId)

watch(userName, (name) => {
  if (name) {
    usePageTitle(`${name} - Working on`, 'Working on')
  }
}, { immediate: true })

onMounted(() => {
  fetchWorkingOn()
})
</script>

<template>
  <div class="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 space-y-8">
    <HomeSectionTitle :title="userName || 'Working on'" />

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
      description="No tenés permisos para ver el working on de este usuario."
    />

    <template v-else>
      <div class="grid gap-6 lg:grid-cols-2">
        <div class="space-y-4">
          <ProjectWorkingOnSummary
            :issues="summary.issues"
            :user-stories="summary.userStories"
            :loading="loading"
          />
          <UserWorkingOnBreakdown
            :tasks="tasks"
            :loading="loading"
          />
        </div>

        <HomeTimeline
          :items="timeline"
          :show-user="showUserNameInTimeline"
          :loading="loading"
        />
      </div>

      <UserWorkingOnTable
        v-model:sort-by="sortBy"
        :rows="rows"
        :loading="loading"
      />
    </template>
  </div>
</template>
