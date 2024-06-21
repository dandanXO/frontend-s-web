<template>
  <a-modal v-model:visible="visible" centered :footer="null" :width="400" :style="{ padding: '13px 17px' }">
    <div class="language-content-wrapper">
      <span class="language-title">{{ $t("layout.header.languageModal.title") }}</span>
      <a-checkbox-group
        v-model:value="selectedValue"
        class="language-list"
        name="language"
        @change="handleCheckedChange"
      >
        <label v-for="(language, index) in languages" :key="index" :for="language.value" class="language-item">
          <div class="language-item__label">
            <img
              class="language-item__label-flag"
              :src="require(`@/assets/images/layout/header/${language.value}.png`)"
            />
            <span>{{ language.name }}</span>
          </div>
          <a-checkbox :value="language.value" :id="language.value" />
        </label>
      </a-checkbox-group>
      <button class="common-btn" :disabled="!selectedValue.length" @click="handleSubmit">
        {{ $t("layout.header.languageModal.confirmButton") }}
      </button>
    </div>
  </a-modal>
</template>
<script setup>
import { LANGUAGE_DEFAULT_VALUE, LANGUAGE_KEY } from "@/constant/localStorage";
import { useSingleCheckbox } from "@/hooks/singleCheckbox";
import { useLocalStorage } from "@vueuse/core";
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const visible = defineModel();

const { locale } = useI18n();
const currentLanguage = useLocalStorage(LANGUAGE_KEY, LANGUAGE_DEFAULT_VALUE);
const { selectedValue, handleCheckedChange } = useSingleCheckbox();

const languages = ref([
  { flag: "🇺🇸", name: "US", value: "en" },
  { flag: "🇵🇰", name: "پاکستان", value: "ur" }
]);

const handleSubmit = () => {
  locale.value = selectedValue.value[0];
  currentLanguage.value = selectedValue.value[0];
  visible.value = false;
};

const resetSelectedLanguage = () => (selectedValue.value = [locale.value]);

onMounted(resetSelectedLanguage);

watch(visible, resetSelectedLanguage);
</script>
<style scoped lang="scss">
.language-content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8c968f;

  .language-title {
    margin-bottom: 45px;
    font-size: 18px;
    line-height: 20.92px;
    text-align: center;
    color: #fff;
  }

  .language-list {
    display: flex;
    flex-direction: column;
    gap: 18px;
    width: 100%;
    margin-bottom: 112px;

    .language-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 18px;
      border-bottom: 1px solid #ffffff33;
      font-size: 16px;
      font-weight: 400;
      line-height: 24.24px;
      color: #fff;
      cursor: pointer;

      .language-item__label {
        display: flex;
        gap: 10px;

        .language-item__label-flag {
          max-width: 24px;
        }
      }

      :deep(.ant-checkbox) {
        .ant-checkbox-inner {
          border-radius: 50%;
        }
      }
      :deep(.ant-checkbox-checked) {
        .ant-checkbox-inner {
          background-color: $primary;
          border-color: $primary;
        }
      }
    }
  }

  .common-btn {
    color: #000a01;

    &[disabled] {
      filter: grayscale(0.5);
      cursor: not-allowed;
    }
  }
}
</style>
