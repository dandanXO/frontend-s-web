<template>
  <q-page-sticky position="bottom-right" :offset="fabPos" style="z-index:6001" v-if="memberType === 'TEST' || isDevENV">
    <q-btn class="floating" fab color="primary" @click="toggleLang" v-touch-pan.prevent.mouse="moveFab"
      :disable="draggingFab">{{ lang
      }}</q-btn>
  </q-page-sticky>
</template>

<script setup>
import { ref } from "vue";
import { i18nStore } from "src/router/language";
import { userStore } from "src/stores";
import { storeToRefs } from "pinia";

const store = userStore();
const isDevENV = ref(process.env.NODE_ENV === "development");
const { memberType } = storeToRefs(store);
const { setLanguage, languageVal } = i18nStore();

const fabPos = ref([20, 180])
const draggingFab = ref(false)

const lang = ref(languageVal);

const moveFab = (ev) => {
  draggingFab.value = ev.isFirst !== true && ev.isFinal !== true

  fabPos.value = [
    fabPos.value[0] - ev.delta.x,
    fabPos.value[1] - ev.delta.y
  ]
}

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