<template>
  <q-select
    class="lang-container"
    style="min-height: 30px; height: 30px"
    v-model="languageVal"
    :options="langOptions"
    option-label="label"
    option-value="value"
    emit-value
    map-options
  >
    <template v-slot:selected>
      <img :src="require(`../assets/images/home/flag-${languageVal}.png`)" :alt="languageVal" />
    </template>
  </q-select>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { i18nStore } from "src/router/language";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const { languageVal } = storeToRefs(i18nStore());
const { setLanguage } = i18nStore();
watch(languageVal, (newVal) => {
  setLanguage(languageVal.value);
});

const langOptions = [
  {
    label: "Vietnamese",
    value: "vi",
    icon: "iconvn"
  },
  {
    label: "English",
    value: "en",
    icon: "iconen"
  }
];
</script>

<style scoped lang="scss">
.lang-container {
  img {
    display: block;
    width: 30px;
    height: 30px;
  }

  :deep(.q-field__marginal) {
    min-height: 36px;
    height: 36px;
    display: none;
  }

  :deep(.q-field__control) {
    min-height: 36px;
    height: 36px;

    &:after {
      display: none;
    }

    &:before {
      display: none;
    }
  }

  :deep(.q-field__native) {
    min-height: 30px;
    height: 30px;
    padding: 0;
  }
}
</style>

<style lang="scss">
.q-select__dialog {
  label {
    img {
      width: 30px;
      height: 30px;
    }
    display: none;
  }
}
</style>
