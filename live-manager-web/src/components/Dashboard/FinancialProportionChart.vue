<template>
  <div class="card flex justify-center">
    <Chart
      type="pie"
      :data="chartData"
      :options="chartOptions"
      style="height: 250px; display: flex; justify-content: center"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

onMounted(() => {
  chartData.value = setChartData()
  chartOptions.value = setChartOptions()
})

const chartData = ref()
const chartOptions = ref({})

const setChartData = () => {
  const documentStyle = getComputedStyle(document.body)

  return {
    labels: [
      '[存款：5001.00]',
      '[存款：4057.00]',
      '[存款：7873.91]',
      '[存款：4342.50]',
      '[存款：3132.21]',
      '[存款：12279.00]',
    ],
    datasets: [
      {
        data: [13.63, 11.06, 21.46, 11.84, 8.54, 33.47],
        backgroundColor: ['#3ba272', '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'],
        hoverBackgroundColor: ['#3ba272', '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'],
      },
    ],
  }
}

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--p-text-color')

  return {
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          color: textColor,
          font: {
            family: 'Inter', // Set the font family here
          },
        },
      },
    },
  }
}
</script>
