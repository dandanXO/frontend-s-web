<template>
    <q-card class="bg-transparent">
      <q-card-section>
        <Bar :data="chartData" :options="chartOptions" />
      </q-card-section>
    </q-card>
  </template>
  
  <script setup>
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
  } from 'chart.js'
  import { Bar } from 'vue-chartjs'
  
  // Register Chart.js components
  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
  
  // Chart Data
  const chartData = {
    labels: ['04/23', '04/24', '04/25', '04/26', '04/27', '04/28', '04/29'],
    datasets: [
      {
        label: 'Profit and Loss',
        data: [-4000, -8000, -6025.43, -11000, -15000, -7000, -8500],
        backgroundColor: '#3b82f6', // Tailwind "blue-500"
        borderRadius: 4,
        barThickness: 20
      }
    ]
  }
  
  // Chart Options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => tooltipItems[0].label,
          label: (context) => {
            const val = context.raw
            return `Profit and loss\n${val.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}`
          }
        },
        backgroundColor: '#fff',
        titleColor: '#000',
        bodyColor: '#000',
        borderColor: '#ccc',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => value.toLocaleString()
        },
        grid: {
          color: '#eee'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .q-card {
    max-width: 700px;
    margin: auto;
  }
  </style>