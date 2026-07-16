<script setup lang="ts">
const { crumbs } = useBreadcrumb()
</script>

<template>
  <nav
    v-if="crumbs.length > 1"
    aria-label="Breadcrumb"
    class="flex items-center gap-1.5 text-sm"
  >
    <template
      v-for="(crumb, index) in crumbs"
      :key="index"
    >
      <UIcon
        v-if="index > 0"
        name="i-lucide-chevron-right"
        class="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-600 shrink-0"
      />

      <span
        v-if="index === crumbs.length - 1"
        class="text-neutral-700 dark:text-neutral-300 font-medium truncate max-w-[200px]"
        aria-current="page"
      >
        {{ crumb.label }}
      </span>

      <NuxtLink
        v-else
        :to="crumb.to"
        class="text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors truncate max-w-[160px]"
      >
        {{ crumb.label }}
      </NuxtLink>
    </template>
  </nav>
</template>
