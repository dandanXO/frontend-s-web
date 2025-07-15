<template>
  <div class="locale-selector">
    <q-btn class="local-selector-btn" flat round @click="handleLocaleSelectorClick">
      <img src="../assets/images/home/global.svg" />
    </q-btn>

    <BottomSheetPicker v-model="showLocaleSelectorDialog" :current :list="LOCALES" @confirm="handlePickerConfirm" />
  </div>
</template>
<script setup>
import { i18nStore } from "src/router/language";
import BottomSheetPicker from "./modal/BottomSheetPicker.vue";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

const LOCALES = [
  { label: "简体中文", value: "zh" },
  { label: "English", value: "en" }
];

const _i18nStore = i18nStore();
const { languageVal } = storeToRefs(_i18nStore);
const { setLanguage } = _i18nStore;

const showLocaleSelectorDialog = ref(false);

const current = computed(() => {
  return LOCALES.find((item) => item.value === languageVal.value);
});

const handlePickerConfirm = (selected) => {
  setLanguage(selected.value);
};

const handleLocaleSelectorClick = () => {
  showLocaleSelectorDialog.value = true;
};
</script>
<style lang="scss" scoped>
.local-selector {
  .local-selector-btn {
  }
}
</style>
