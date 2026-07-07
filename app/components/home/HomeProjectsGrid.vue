<script setup lang="ts">
import type { HomeProject } from '~/types/user'

defineProps<{
  projects: HomeProject[]
  loading?: boolean
}>()
</script>

<template>
  <section class="space-y-4">
    <HomeSectionTitle title="Mis proyectos" />

    <div
      v-if="loading"
      class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      <USkeleton
        v-for="index in 3"
        :key="index"
        class="h-56 rounded-lg"
      />
    </div>

    <p
      v-else-if="projects.length === 0"
      class="text-center text-sm text-muted"
    >
      No hay proyectos para mostrar.
    </p>

    <div
      v-else
      class="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:overflow-visible"
    >
      <div
        v-for="project in projects"
        :key="project.name"
        class="min-w-[280px] shrink-0 snap-start lg:min-w-0 lg:shrink"
      >
        <HomeProjectCard :project="project" />
      </div>
    </div>
  </section>
</template>
