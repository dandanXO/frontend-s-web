<template>
  <Card style="width: 99%;">
    <template #content>
      <RouterView />
    </template>
  </Card>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>
