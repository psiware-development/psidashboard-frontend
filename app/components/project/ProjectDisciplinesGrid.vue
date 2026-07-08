<script setup lang="ts">
import type { ProjectDiscipline } from '~/types/project'

defineProps<{
  disciplines: ProjectDiscipline[]
  loading?: boolean
}>()
</script>

<template>
  <section class="space-y-4">
    <SectionTitle title="Disciplinas" />

    <div
      v-if="loading"
      class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
    >
      <USkeleton
        v-for="index in 5"
        :key="index"
        class="h-40 rounded-lg"
      />
    </div>

    <div
      v-else
      class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
    >
      <ProjectDisciplineCard
        v-for="discipline in disciplines"
        :key="discipline.key"
        :discipline="discipline"
      />
    </div>
  </section>
</template>
