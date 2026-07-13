<script setup lang="ts">
defineProps<{
  title: string
  itemCount: number
  itemLabel: string
  actionLabel?: string
  actionIcon?: string
  actionTo?: string
}>()

const emit = defineEmits<{
  action: []
}>()
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-4">
    <div>
      <SectionTitle :title="title" />
      <p class="text-sm text-muted mt-1">
        {{ itemCount }} {{ itemLabel }}{{ itemCount !== 1 ? 's' : '' }} registrado{{ itemCount !== 1 ? 's' : '' }}
      </p>
    </div>
    <UButton
      v-if="actionLabel"
      color="primary"
      :icon="actionIcon"
      :label="actionLabel"
      :to="actionTo"
      class="cursor-pointer"
      @click="!actionTo && emit('action')"
    />
  </div>
</template>
