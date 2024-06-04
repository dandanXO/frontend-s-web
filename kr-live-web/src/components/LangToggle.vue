<template>
    <button @click="toggleLang">Toggle Lang ({{ lang }})</button>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useI18n } from "vue-i18n";
  import { i18nStore } from "src/router/language";
  
  const { setLanguage } = i18nStore();
  const { t } = useI18n();
  
  const lang = ref('kr');

  const toggleLang = () => {
    if(lang.value === 'kr') {
        lang.value = 'en';
        setLanguage('en');
    } else {
        lang.value = 'kr';
        setLanguage('kr');
    }
  }
 
  </script>
  
  <style lang="scss" scoped>
  </style>