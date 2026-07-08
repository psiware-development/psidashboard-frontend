<script setup lang="ts">
defineProps<{
  to: string
  icon: string
  label: string
  isExpanded: boolean
}>()
</script>

<template>
  <NuxtLink
    :to="to"
    class="flex items-center rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-all duration-200 group py-2.5"
    :class="isExpanded ? 'px-3 gap-3 w-full' : 'justify-center px-0 w-10 mx-auto'"
    active-class="bg-primary/10 text-primary hover:bg-primary/15 dark:bg-primary/10 dark:text-primary dark:hover:bg-primary/15"
  >
    <UIcon
      :name="icon"
      class="w-5 h-5 flex-shrink-0 text-neutral-400 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors"
    />
    <span
      v-if="isExpanded"
      class="text-sm font-medium transition-opacity duration-200"
    >
      {{ label }}
    </span>
  </NuxtLink>
</template>
