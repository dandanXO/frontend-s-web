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
      <img :src="require(`../assets/images/auth/country-flag-${languageVal}.png`)" />
      <div style="margin-left: 8px">{{ $t("lang.language") }}</div>
    </template>
  </q-select>

  <!-- <div class="lang-wrapper">
    <div class="item-icon"><img :src="require(`../assets/images/auth/country-flag-${languageVal}.png`)" /></div>
    {{ $t("sideNav.slots") }}
  </div> -->
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
    label: "Urdu",
    value: "ur",
    icon: "iconur"
  },
  {
    label: "English",
    value: "en",
    icon: "iconen"
  }
];
</script>

<style scoped lang="scss">
.lang-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
}

.item-icon {
  img {
    display: block;
    width: 26px;
  }
}

.lang-container {
  color: #9f9f9f;
  img {
    display: block;
    width: 30px;
    height: 30px;
  }

  :deep(.q-field__marginal) {
    min-height: 40px;
    height: 40px;
    display: none;
  }

  :deep(.q-field__control) {
    min-height: 40px;
    height: 40px;

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
    color: #9f9f9f;
    font-weight: bold;
  }
}
</style>

<style lang="scss">
.q-select__dialog {
  label {
    display: none;
    img {
      width: 30px;
      height: 30px;
    }
  }
}
</style>
