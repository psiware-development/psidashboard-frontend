<script setup lang="ts">
import type { ProjectTeamMember } from '~/types/project'

const props = defineProps<{
  member: ProjectTeamMember
}>()

const billablePercent = computed(() => {
  if (!props.member.assigned) {
    return 0
  }

  return Math.round((props.member.declared / props.member.assigned) * 100)
})
</script>

<template>
  <UCard class="h-full text-center">
    <div class="space-y-3">
      <UAvatar
        :src="member.image"
        :alt="member.name"
        size="3xl"
        class="mx-auto"
      />

      <div>
        <p class="font-semibold text-highlighted">
          {{ member.name }}
        </p>
        <p class="text-sm text-muted">
          {{ member.role }}
        </p>
      </div>

      <p class="text-2xl font-bold text-muted">
        {{ member.declared }}/{{ member.assigned }}
      </p>

      <p class="text-sm">
        Hs facturables:
        <span :class="billablePercent >= 80 ? 'text-success' : 'text-error'">
          {{ billablePercent }}%
        </span>
      </p>
    </div>
  </UCard>
</template>
