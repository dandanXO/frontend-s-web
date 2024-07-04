<template>
  <el-empty :image-size="400" :description="t('fields.noData')" :image="Empty" />
</template>
<script setup>
import Empty from '@/assets/images/empty.svg'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>
