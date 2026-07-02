<template>
  <NuxtLink
    to="/"
    class="inline-flex items-center shrink-0"
    aria-label="Ir al inicio"
  >
    <img
      v-if="!imageMissing"
      src="/images/logo.png"
      alt="PSI Dashboard"
      class="h-8 w-auto object-contain"
      @error="imageMissing = true"
    >
    <span
      v-else
      class="font-semibold text-highlighted"
    >
      PSI Dashboard
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
const imageMissing = ref(false)
</script>
