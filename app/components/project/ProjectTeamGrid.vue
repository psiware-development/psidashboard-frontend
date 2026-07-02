<script setup lang="ts">
import type { ProjectTeamMember } from '~/types/project'

defineProps<{
  members: ProjectTeamMember[]
  loading?: boolean
}>()
</script>

<template>
  <section class="space-y-4">
    <HomeSectionTitle :title="`Team (${members.length})`" />

    <div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <USkeleton v-for="index in 4" :key="index" class="h-48 rounded-lg" />
    </div>

    <p v-else-if="members.length === 0" class="text-center text-sm text-muted">
      No hay integrantes con horas asignadas o declaradas.
    </p>

    <div
      v-else
      class="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory lg:grid lg:grid-cols-3 xl:grid-cols-4 lg:overflow-visible"
    >
      <div
        v-for="member in members"
        :key="member.id"
        class="min-w-[220px] shrink-0 snap-start lg:min-w-0 lg:shrink"
      >
        <ProjectTeamMemberCard :member="member" />
      </div>
    </div>
  </section>
</template>
