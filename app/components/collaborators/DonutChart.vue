<script setup lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps<{
  data: Array<{
    label: string
    value: number
    color?: string
  }>
  totalLabel?: string
}>()

const chartData = computed(() => {
  return {
    labels: props.data.map(item => item.label),
    datasets: [
      {
        data: props.data.map(item => item.value),
        backgroundColor: props.data.map(item => item.color || '#9ca3af'),
        hoverOffset: 4
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context: { raw?: number | unknown, label: string }) => {
          const rawVal = typeof context.raw === 'number' ? context.raw : 0
          return ` ${context.label}: ${rawVal.toFixed(1)}h`
        }
      }
    }
  },
  cutout: '70%'
}
</script>

<template>
  <div class="relative w-full h-48 flex items-center justify-center">
    <Doughnut
      :data="chartData"
      :options="chartOptions"
    />
    <div
      v-if="totalLabel"
      class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
    >
      <span class="text-xs text-neutral-400 dark:text-neutral-500 font-medium uppercase tracking-wider">Horas</span>
      <span class="text-xl font-bold text-neutral-900 dark:text-white">{{ totalLabel }}</span>
    </div>
  </div>
</template>
