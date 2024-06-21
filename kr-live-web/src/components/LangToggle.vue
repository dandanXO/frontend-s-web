<template>
  <q-page-sticky position="bottom-right" :offset="[40, 230]" style="z-index:999999" v-if="memberType === 'TEST'">
    <q-btn class="floating" fab color="primary" @click="toggleLang">{{ lang }}</q-btn>
  </q-page-sticky>
</template>

<script setup>
import { ref } from "vue";
import { i18nStore } from "src/router/language";
import { userStore } from "src/stores";
import { storeToRefs } from "pinia";

const store = userStore();
const { memberType } = storeToRefs(store);
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