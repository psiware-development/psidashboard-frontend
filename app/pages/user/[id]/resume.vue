<script setup lang="ts">
const route = useRoute()
const userId = computed(() => route.params.id as string)

const {
  loading,
  error,
  forbidden,
  user,
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
} = useUserResume(userId)

watch(() => user.value?.fullname, (name) => {
  if (name) {
    usePageTitle(`${name} - Resume`)
  }
}, { immediate: true })

onMounted(() => {
  fetchResume()
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
      description="No tenés permisos para ver este resume."
    />

    <template v-else>
      <UCard>
        <div class="grid gap-6 lg:grid-cols-12 lg:items-center">
          <div class="lg:col-span-3 flex justify-center">
            <UAvatar
              :src="user?.image"
              :alt="user?.fullname"
              size="3xl"
            />
          </div>

          <div class="lg:col-span-6 space-y-3">
            <h1 class="text-2xl font-semibold text-highlighted">
              {{ user?.fullname }}
            </h1>
            <dl class="space-y-2 text-sm">
              <div class="flex gap-2">
                <dt class="text-muted">
                  Main Role:
                </dt>
                <dd>{{ user?.mainRole?.description ?? '-' }}</dd>
              </div>
              <div class="flex gap-2">
                <dt class="text-muted">
                  Usuario Taiga:
                </dt>
                <dd>{{ user?.idTaigaUser ?? '-' }}</dd>
              </div>
            </dl>
          </div>

          <div class="lg:col-span-3">
            <UCard :ui="{ body: 'text-center py-4' }">
              <p class="text-3xl font-bold">
                {{ realHours }}/{{ plannedHours }}
              </p>
              <p class="text-sm text-muted mt-1">
                Horas reales / planificadas
              </p>
            </UCard>
          </div>
        </div>
      </UCard>

      <HomeKpiGrid :kpis="kpis" :loading="loading" />

      <div class="grid gap-6 lg:grid-cols-12">
        <div class="lg:col-span-8">
          <UserResumeContent
            :projects="projects"
            :tasks="tasks"
            :total-planned="totalPlannedProjects"
            :total-real="totalRealProjects"
            :total-difference="totalDifference"
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
    </template>
  </div>
</template>
