<template>
  <div class="roles-main">
    <el-card class="box-card" shadow="never">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ $t('menu.Finance Report') }}</span>
        </div>
      </template>
      <el-tabs v-model="activeName">
        <el-tab-pane :label="t('fields.personalReport')" name="personal">
          <PersonalFinanceTab />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import PersonalFinanceTab from './tab/personal-finance.vue'

const { t } = useI18n()
const activeName = ref('personal')
</script>
