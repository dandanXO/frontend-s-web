<template>
  <el-select
    v-model="languageVal"
    placeholder="Select"
    size="small"
    style="position:absolute;top:10px;right:25px;width:120px;"
    @change="changeLang"
  >
    <el-option
      v-for="lang in filteredLangOptions"
      :key="lang.value"
      :value="lang.value"
      :label="lang.label"
    />
    <!-- <el-option :label="$t('fields.vietnamese')" :value="'vi'" />
    <el-option :label="$t('fields.english')" :value="'en'" /> -->
  </el-select>
</template>

<script setup>
import { defineProps, computed } from 'vue'
import { i18nStore } from '@/store/language'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  // eslint-disable-next-line vue/require-default-prop
  langList: {
    type: Array,
    required: false,
  },
});

const { t } = useI18n()
const i18nStoreLanguage = i18nStore()
const { languageVal } = storeToRefs(i18nStoreLanguage)

const langOptions = [
  { label: t('fields.vietnamese'), value: 'vi' },
  { label: t('fields.english'), value: 'en' },
  { label: t('fields.chinese'), value: 'zh' },
]

const filteredLangOptions = computed(() => {
  return langOptions.filter((lang) => {
    return props.langList.includes(lang.value)
  })
})
const changeLang = newLang => {
  i18nStoreLanguage.setLanguage(newLang)
}
</script>
