<template>
  <div class="card flex justify-center">
    <Breadcrumb :home="home" :model="items" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const home = ref({
  icon: 'pi pi-home',
})
const items = ref([{ label: '仪表板' }])
</script>
