<script setup lang="ts">
import type { KpiItem } from '~/types/dashboard'

defineProps<{
  kpis: KpiItem[]
  loading?: boolean
}>()
</script>

<template>
  <section
    v-if="loading || kpis.length > 0"
    class="space-y-4"
  >
    <HomeSectionTitle title="KPIs" />

    <div
      v-if="loading"
      class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3"
    >
      <USkeleton
        v-for="index in 6"
        :key="index"
        class="h-32 rounded-lg"
      />
    </div>

    <div
      v-else
      class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3"
    >
      <HomeKpiCard
        v-for="kpi in kpis"
        :key="kpi.idKPI"
        :kpi="kpi"
      />
    </div>
  </section>
</template>
