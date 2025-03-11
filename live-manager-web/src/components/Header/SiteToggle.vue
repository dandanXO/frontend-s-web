<template>
  <Select
    v-model="selectedLanguage"
    :options="languages"
    optionLabel="name"
    placeholder="Select a language"
    class="w-full md:w-20"
  />
</template>

<script setup>
import { ref } from 'vue'

const selectedLanguage = ref({ name: 'xingfa', code: 'xingfa' })
const languages = ref([
  { name: 'xingfa', code: 'xingfa' },
  { name: 'jolly88', code: 'jolly88' },
])
</script>
