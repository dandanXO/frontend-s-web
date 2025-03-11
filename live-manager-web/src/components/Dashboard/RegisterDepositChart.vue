<template>
  <div class="card">
    <Chart type="line" :data="chartData" :options="chartOptions" class="h-[30rem]" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

onMounted(() => {
  chartData.value = setChartData()
  chartOptions.value = setChartOptions()
})

const chartData = ref()
const chartOptions = ref()

const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement)

  return {
    labels: ['10/3', '11/3', '12/3', '13/3', '14/3', '15/3', '16/3'],
    datasets: [
      {
        label: '注册人数统计',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: '#5470c6',
        tension: 0.4,
      },
      {
        label: '首存人数统计',
        data: [28, 48, 40, 19, 86, 27, 90],
        fill: false,
        borderColor: '#91cc75',
        tension: 0.4,
      },
    ],
  }
}
const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--p-text-color')
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color')
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color')

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          color: textColor,
          font: {
            family: 'Inter', // Set the font family here
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
          font: {
            family: 'Inter', // Set the font family here
          },
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        ticks: {
          color: textColorSecondary,
          font: {
            family: 'Inter', // Set the font family here
          },
        },
        grid: {
          color: surfaceBorder,
        },
      },
    },
  }
}
</script>
