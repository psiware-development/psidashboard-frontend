<script setup lang="ts">
import type { TimelineItem } from '~/types/dashboard'
import { formatRelativeDate } from '~/utils/dateUtils'

const props = defineProps<{
  item: TimelineItem
  showUser?: boolean
}>()

const entity = computed(() => props.item.userStory ?? props.item.issue)

const entityLabel = computed(() => {
  if (!entity.value?.ref) {
    return null
  }

  return `#${entity.value.ref}${entity.value.subject ? ` - ${entity.value.subject}` : ''}`
})

const sourceLabel = computed(() => {
  switch (props.item.type) {
    case 'CLOCKIFY_INPUT_HOURS': return 'Clockify'
    case 'GITHUB': return 'GitHub'
    default: return 'Taiga'
  }
})
</script>

<template>
  <li class="relative pl-10 pb-6 last:pb-0">
    <span class="absolute left-3 top-1 size-3 rounded-full border-2 border-primary bg-default z-10" />

    <div class="space-y-2">
      <div class="flex items-center justify-between gap-2">
        <UBadge
          color="neutral"
          variant="subtle"
          size="xs"
        >
          {{ sourceLabel }}
        </UBadge>
        <span class="text-xs text-muted whitespace-nowrap">
          {{ formatRelativeDate(item.datetime) }}
        </span>
      </div>

      <div
        v-if="showUser && item.user"
        class="flex items-center gap-2 min-w-0"
      >
        <UAvatar
          :src="item.user.image"
          :alt="item.user.fullname"
          size="xs"
        />
        <span class="text-sm font-semibold truncate">
          {{ item.user.fullname }}
        </span>
      </div>

      <p class="text-sm font-semibold truncate">
        {{ item.project.description }}
      </p>

      <div
        v-if="entityLabel"
        class="flex items-start justify-between gap-2"
      >
        <a
          v-if="entity?.link"
          :href="entity.link"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm font-medium text-primary hover:underline line-clamp-1"
        >
          {{ entityLabel }}
        </a>
        <span
          v-else
          class="text-sm font-medium text-primary line-clamp-1"
        >
          {{ entityLabel }}
        </span>

        <TaskStatusBadge
          v-if="entity?.status"
          :status="entity.status"
        />
      </div>

      <p
        v-if="item.comment"
        class="text-sm text-muted"
      >
        {{ item.comment }}
      </p>
    </div>
  </li>
</template>
