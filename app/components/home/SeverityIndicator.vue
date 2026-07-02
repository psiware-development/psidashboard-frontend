<script setup lang="ts">
import { getSeverityColor } from '~/utils/taskStatus'

const props = defineProps<{
  severity?: string
}>()

const color = computed(() => getSeverityColor(props.severity))
</script>

<template>
  <div class="flex flex-col items-center gap-1">
    <span class="text-sm">{{ severity ?? '-' }}</span>
    <span
      class="size-5 rounded-full"
      :style="{ backgroundColor: color }"
    />
  </div>
</template>
