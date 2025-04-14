<template>
  <div class="roles-main">
    <el-card class="box-card" shadow="never">
      {{ route.name }}
    </el-card>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
