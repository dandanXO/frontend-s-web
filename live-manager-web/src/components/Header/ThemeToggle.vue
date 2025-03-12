<template>
  <Button
    :icon="theme === 'light' ? 'pi pi-sun' : 'pi pi-moon'"
    aria-label="Submit"
    severity="secondary"
    @click="toggleDarkMode"
  />
</template>

<script setup>
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'

const store = useUserStore()
const { theme } = storeToRefs(store)

const toggleDarkMode = () => {
  store.toggleDarkMode()
}
</script>

<style lang="scss"></style>
