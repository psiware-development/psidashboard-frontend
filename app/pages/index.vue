<script setup lang="ts">
usePageTitle('Mis proyectos')

const {
  loading,
  error,
  projects,
  workingOnRows,
  kpis,
  timeline,
  showUserNameInTimeline,
  fetchHomeData
} = useHomeData()

onMounted(() => {
  fetchHomeData()
})
</script>

<template>
  <div class="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6">
    <UAlert
      v-if="error"
      color="error"
      variant="subtle"
      :title="error"
      class="mb-6"
    />

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div class="lg:col-span-9 space-y-10">
        <KpiGrid
          :kpis="kpis"
          :loading="loading"
        />
        <HomeProjectsGrid
          :projects="projects"
          :loading="loading"
        />
        <HomeWorkingOnTable
          :rows="workingOnRows"
          :loading="loading"
        />
      </div>

      <aside class="lg:col-span-3">
        <HomeTimeline
          :items="timeline"
          :show-user="showUserNameInTimeline"
          :loading="loading"
        />
      </aside>
    </div>
  </div>
</template>
