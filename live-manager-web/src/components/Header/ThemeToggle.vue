<template>
  <Button
    icon="pi pi-sun"
    aria-label="Submit"
    severity="secondary"
    outlined
    @click="toggleDarkMode"
  />
</template>

<script setup>
import { useUserStore } from '@/stores/userStore'

const store = useUserStore()

const toggleDarkMode = () => {
  store.toggleDarkMode()
}
</script>

<style lang="scss"></style>
