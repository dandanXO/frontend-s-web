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

const selectedLanguage = ref({ name: '中文', code: 'ZH' })
const languages = ref([
  { name: 'English', code: 'EN' },
  { name: '中文', code: 'ZH' },
])
</script>
