<template>
  <div class="roles-main">
    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ $t('menu.Settlement Report') }}</span>
        </div>
      </template>
      <el-tabs v-model="activeName" style="margin-left: 20px">
        <el-tab-pane :label="t('fields.personalCommission')" name="personal">
          <PersonalSettlementTab />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import PersonalSettlementTab from './tab/personal-settlement.vue'

const { t } = useI18n()
const activeName = ref('personal')
</script>
