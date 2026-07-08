<script setup lang="ts">
import type { TimelineItem } from '~/types/dashboard'

const props = defineProps<{
  items: TimelineItem[]
  showUser?: boolean
  loading?: boolean
}>()

const sortedItems = computed(() =>
  [...props.items].sort(
    (a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
  )
)
</script>

<template>
  <section class="space-y-4">
    <SectionTitle title="Timeline" />

    <UCard
      :ui="{
        body: 'max-h-[700px] overflow-y-auto'
      }"
    >
      <div
        v-if="loading"
        class="space-y-4"
      >
        <USkeleton
          v-for="index in 4"
          :key="index"
          class="h-20 rounded-lg"
        />
      </div>

      <p
        v-else-if="sortedItems.length === 0"
        class="text-sm text-muted text-center"
      >
        No hay actividad reciente.
      </p>

      <ul
        v-else
        class="relative before:absolute before:left-[13px] before:top-2 before:bottom-2 before:w-0.5 before:bg-elevated"
      >
        <HomeTimelineItem
          v-for="(item, index) in sortedItems"
          :key="item.id ?? `${item.datetime}-${index}`"
          :item="item"
          :show-user="showUser"
        />
      </ul>
    </UCard>
  </section>
</template>
