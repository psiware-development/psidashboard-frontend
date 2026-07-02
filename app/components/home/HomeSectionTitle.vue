<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <h2 class="text-2xl md:text-3xl font-semibold text-center text-highlighted tracking-tight">
    {{ title }}
  </h2>
</template>
