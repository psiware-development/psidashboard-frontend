<script setup lang="ts">
defineProps<{
  projectId: number
  downloadingReport?: boolean
}>()

defineEmits<{
  downloadReport: []
}>()
</script>

<template>
  <UCard>
    <div class="grid gap-3 sm:grid-cols-2">
      <UButton
        block
        color="primary"
        variant="soft"
        label="Estadísticas mensuales"
        :to="`/project/${projectId}/monthly-stats`"
      />
      <UButton
        block
        color="primary"
        variant="soft"
        label="Working on"
        :to="`/project/${projectId}/working-on`"
      />
      <UButton
        block
        color="primary"
        label="Descargar reporte"
        icon="i-lucide-download"
        :loading="downloadingReport"
        @click="$emit('downloadReport')"
      />
      <UButton
        block
        color="neutral"
        variant="outline"
        label="Consolidar horas"
        icon="i-lucide-clock"
        :to="`/project/${projectId}/reporte-consolidado`"
      />
    </div>
  </UCard>
</template>
