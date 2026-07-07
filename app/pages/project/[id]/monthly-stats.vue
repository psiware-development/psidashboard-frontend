<script setup lang="ts">
const route = useRoute()
const projectId = computed(() => route.params.id as string)

const {
  loading,
  error,
  projectName,
  monthInputValue,
  monthLabel,
  sections,
  kpis
} = useProjectMonthlyStats(projectId)

watch(projectName, (name) => {
  if (name) {
    usePageTitle(`${name} - Estadísticas mensuales`)
  }
}, { immediate: true })
</script>

<template>
  <div class="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 space-y-8">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <HomeSectionTitle :title="projectName || 'Estadísticas mensuales'" />
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

    <UCard>
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-sm font-medium text-highlighted mb-2">
            Seleccionar mes
          </p>
          <p class="text-sm text-muted">
            {{ monthLabel }}
          </p>
        </div>

        <UFormField label="Mes">
          <UInput
            v-model="monthInputValue"
            type="month"
            :max="new Date().toISOString().slice(0, 7)"
            class="min-w-48"
          />
        </UFormField>
      </div>
    </UCard>

    <ProjectMonthlyStatsSection
      v-for="section in sections"
      :key="section.title"
      :title="section.title"
      :items="section.items"
      :loading="loading"
    />

    <section
      v-if="loading || kpis.length > 0"
      class="space-y-4"
    >
      <HomeSectionTitle title="KPIs" />

      <div
        v-if="loading"
        class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        <USkeleton
          v-for="index in 4"
          :key="index"
          class="h-32 rounded-lg"
        />
      </div>

      <div
        v-else
        class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6"
      >
        <HomeKpiCard
          v-for="(kpi, index) in kpis"
          :key="index"
          :kpi="{
            idKPI: index,
            description: kpi.kpi.description,
            value: kpi.value
          }"
        />
      </div>
    </section>
  </div>
</template>
