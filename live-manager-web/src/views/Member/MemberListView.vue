<template>
  <Card>
    <template #content>
      <RouterView />
    </template>
  </Card>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>
