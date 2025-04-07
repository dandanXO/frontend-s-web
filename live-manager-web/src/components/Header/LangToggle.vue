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
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const t = useI18n()
const selectedLanguage = ref()
const languages = ref([
  { name: 'English', code: 'en' },
  { name: '中文', code: 'zh' },
])

onMounted(() => {
  const lang = localStorage.getItem('languageLocale')

  const selectedLang = languages.value.find(({ code }) => code === lang)

  if (selectedLang) {
    selectedLanguage.value = selectedLang
  } else {
    selectedLanguage.value = languages.value.find(({ code }) => code === 'zh')
    localStorage.setItem('languageLocale', 'zh')
  }
})

watch(
  () => selectedLanguage.value,
  () => {
    t.locale.value = selectedLanguage.value.code
    localStorage.setItem('languageLocale', selectedLanguage.value.code)
  },
)
</script>
