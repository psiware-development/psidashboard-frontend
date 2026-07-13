<script setup lang="ts">
const search = defineModel<string>({ default: '' })

defineProps<{
  searchPlaceholder?: string
  hasActiveFilters: boolean
}>()

const emit = defineEmits<{
  clear: []
}>()
</script>

<template>
  <UCard>
    <div class="flex flex-wrap gap-3">
      <UInput
        v-model="search"
        icon="i-lucide-search"
        :placeholder="searchPlaceholder ?? 'Buscar...'"
        class="flex-1 min-w-[220px]"
      />

      <slot />

      <UButton
        v-if="search || hasActiveFilters"
        color="neutral"
        variant="ghost"
        icon="i-lucide-x"
        label="Limpiar"
        class="cursor-pointer"
        @click="emit('clear')"
      />
    </div>
  </UCard>
</template>
