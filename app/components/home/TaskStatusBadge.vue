<script setup lang="ts">
import { getTaskStatus } from '~/utils/taskStatus'

const props = defineProps<{
  status?: string
}>()

const taskStatus = computed(() => getTaskStatus(props.status))
</script>

<template>
  <UBadge
    :style="{
      backgroundColor: taskStatus.background,
      color: taskStatus.color
    }"
    variant="solid"
    size="sm"
    class="whitespace-nowrap"
  >
    {{ taskStatus.label }}
  </UBadge>
</template>
