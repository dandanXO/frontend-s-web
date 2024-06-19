<template>
  <q-page-sticky position="bottom-right" :offset="[50, 50]" style="z-index:999999">
    <q-btn fab v-if="showLangToggle" color="primary" @click="toggleLang">{{ lang }}</q-btn>
  </q-page-sticky>
</template>

<script setup>
import { ref } from "vue";
import { i18nStore } from "src/router/language";

const showLangToggle = ref(process.env.NODE_ENV === "development");
const { setLanguage, languageVal } = i18nStore();

const lang = ref(languageVal);

const toggleLang = () => {
  if (lang.value === 'kr') {
    lang.value = 'en';
    setLanguage('en');
  } else {
    lang.value = 'kr';
    setLanguage('kr');
  }
}

</script>

<style lang="scss" scoped></style>