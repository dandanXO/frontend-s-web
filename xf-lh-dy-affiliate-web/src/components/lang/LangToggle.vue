<template>
  <el-select v-model="languageVal" placeholder="Select" size="small" style="position:absolute;top:10px;right:25px;width:120px;" @change="changeLang">
    <el-option :label="$t('fields.vietnamese')" :value="'vi'" />
    <el-option :label="$t('fields.english')" :value="'en'" />
  </el-select>
</template>

<script setup>
import { i18nStore } from '@/store/language';
import { storeToRefs } from 'pinia';

const i18nStoreLanguage = i18nStore();
const { languageVal } = storeToRefs(i18nStoreLanguage);

const changeLang = (newLang) => {
  i18nStoreLanguage.setLanguage(newLang);
}
</script>
