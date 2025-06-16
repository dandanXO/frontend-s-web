<template>
  <el-select v-model="languageVal" placeholder="Select" size="small" style="position:absolute;top:10px;right:25px;width:120px;" @change="changeLang">
    <el-option v-for="item in langOptions" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
</template>

<script setup>
import { ref } from 'vue';
import { i18nStore } from '@/store/language';
import { storeToRefs } from 'pinia';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const langOptions = ref([{ label: t('fields.vietnamese'), value: 'vi' }, { label: t('fields.english'), value: 'en' }]);
const i18nStoreLanguage = i18nStore();
const { languageVal } = storeToRefs(i18nStoreLanguage);

const changeLang = (newLang) => {
  i18nStoreLanguage.setLanguage(newLang);
}
</script>
