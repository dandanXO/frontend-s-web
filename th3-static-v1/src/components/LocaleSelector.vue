<template>
  <BottomSheetPicker v-model:show="model" :current :list="LOCALES" @update:current="handleLocaleChange" />
</template>
<script setup>
import { i18nStore } from "src/router/language";
import BottomSheetPicker from "./modal/BottomSheetPicker.vue";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import ThFlagImg from "../assets/images/auth/country-flag-th.png";
import EnFlagImg from "../assets/images/auth/country-flag-en.png";
import CnFlagImg from "../assets/images/auth/country-flag-zh.png";

const LOCALES = [
  { label: "ภาษาไทย", value: "th", icon: ThFlagImg },
  { label: "English", value: "en", icon: EnFlagImg },
  { label: "中文", value: "cn", icon: CnFlagImg }
];

const model = defineModel();

const _i18nStore = i18nStore();
const { languageVal } = storeToRefs(_i18nStore);
const { setLanguage } = _i18nStore;

const showLocaleSelectorDialog = ref(false);
const current = ref();

const handleLocaleChange = (selected) => {
  setLanguage(selected);
  current.value = selected;
};

const handleLocaleSelectorClick = () => {
  showLocaleSelectorDialog.value = true;
};

onMounted(() => {
  current.value = languageVal.value;
});
</script>
<style lang="scss" scoped>
.locale-selector {
  .locale-selector-btn {
    min-width: unset;
    img {
      display: block;
      width: 24px;
      filter: brightness(0) invert(50%) sepia(11%) saturate(3258%) hue-rotate(77deg) brightness(122%) contrast(75%);
      // filter: brightness(1) sepia(0) hue-rotate(0deg) saturate(1);
      animation: hueBlink 1s infinite;
    }
  }
}

@keyframes hueBlink {
  0% {
    filter: brightness(0) invert(100%) sepia(0%) saturate(3258%) hue-rotate(355deg) brightness(100%) contrast(100%);
  }
  100% {
    filter: brightness(0) invert(40%) sepia(9%) saturate(510%) hue-rotate(355deg) brightness(95%) contrast(90%);
  }
}
</style>
