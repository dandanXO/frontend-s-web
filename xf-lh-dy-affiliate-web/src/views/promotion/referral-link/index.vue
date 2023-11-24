<template>
  <div class="roles-main">
    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">
            {{ $t('fields.referralLink') }}
          </span>
        </div>
      </template>
      <el-tabs v-model="activeName" style="margin-left: 20px">
        <el-tab-pane :label="t('fields.referralLink')" name="referral-link">
          <referralLink />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import referralLink from './tab/referral-link.vue'

const { t } = useI18n()
const activeName = ref('referral-link')
</script>
