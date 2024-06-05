<template>
  <el-tabs v-model="activeName">
    <el-tab-pane :label="t('fields.refereeEligibility')" name="referee-eligibility-setting" v-if="hasPermission(['sys:refer-rebate:setting:list'])">
      <EligibilityTab />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.oneTimeBonusSetting')" name="one-time-bonus-setting" v-if="hasPermission(['sys:refer-rebate:setting:list'])">
      <OneTimeBonusSettingTab />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.depositRebateSetting')" name="deposit-rebate-setting" v-if="hasPermission(['sys:refer-rebate:setting:list'])">
      <DepositRebateSettingTab />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.betRebateSetting')" name="bet-rebate-setting" v-if="hasPermission(['sys:refer-rebate:setting:list'])">
      <BetRebateSettingTab />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useRouter } from "vue-router";
import EligibilityTab from "./eligibility/index.vue";
import DepositRebateSettingTab from "./deposit-rebate/index.vue";
import OneTimeBonusSettingTab from "./one-time-bonus/index.vue";
import BetRebateSettingTab from "./bet-rebate/index.vue";
import { useI18n } from "vue-i18n";
import { hasPermission } from "../../../utils/util";

export default defineComponent({
  components: {
    EligibilityTab,
    DepositRebateSettingTab,
    OneTimeBonusSettingTab,
    BetRebateSettingTab
  },
  setup() {
    const { t } = useI18n()
    const router = useRouter()
    const activeName = computed(() => router.currentRoute.value.query.tab || 'referee-eligibility-setting')

    return {
      activeName,
      t,
      hasPermission
    }
  }
})
</script>
