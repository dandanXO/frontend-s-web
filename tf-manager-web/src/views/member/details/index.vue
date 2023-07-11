<template>
  <el-tabs v-model="activeName" :key="id">
    <el-tab-pane :label="t('fields.member')" name="member-info">
      <MemberInfoTab :mbr-id="id" />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.login')" name="login-info">
      <LoginInfoTab :mbr-id="id" />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.bankCard')" name="member-bank">
      <MemberBankTab :mbr-id="id" />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.moneyChange')" name="member-money-change">
      <MemberMoneyChange :mbr-id="id" />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.deposit')" name="deposit-info">
      <DepositInfoTab :mbr-id="id" />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.withdraw')" name="withdraw-info">
      <WithdrawInfoTab :mbr-id="id" />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.transaction')" name="transaction-info">
      <TransactionInfoTab :mbr-id="id" />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.privilege')" name="member-privilege-record">
      <MemberPrivilegeRecord :mbr-id="id" />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.riskControl')" name="risk-info">
      <RiskInfoTab :mbr-id="id" />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.betRecords')" name="member-bet-record">
      <MemberBetRecordTab :mbr-id="id" />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.referredFriends')" name="member-refer-friend">
      <MemberReferFriendTab :mbr-id="id" :site-id="siteId" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { defineComponent, computed } from "vue";
import LoginInfoTab from "./tabs/login-info/index.vue";
import MemberInfoTab from "./tabs/member-info/index.vue";
import TransactionInfoTab from "./tabs/transaction-info/index.vue";
import DepositInfoTab from "./tabs/deposit-info/index.vue";
import WithdrawInfoTab from "./tabs/withdraw-info/index.vue";
import { useRouter } from "vue-router";
import MemberPrivilegeRecord from "./tabs/member-privilege-record/index.vue";
import MemberMoneyChange from "./tabs/member-money-change/index.vue";
import MemberBankTab from "./tabs/member-bank/index.vue";
import RiskInfoTab from "./tabs/risk-info/index.vue";
import MemberBetRecordTab from "./tabs/member-bet-record/index.vue";
import MemberReferFriendTab from "./tabs/member-refer-friend/index.vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  components: {
    LoginInfoTab,
    MemberInfoTab,
    TransactionInfoTab,
    MemberPrivilegeRecord,
    MemberMoneyChange,
    DepositInfoTab,
    WithdrawInfoTab,
    MemberBankTab,
    RiskInfoTab,
    MemberBetRecordTab,
    MemberReferFriendTab
  },
  setup() {
    const { t } = useI18n()
    const router = useRouter()
    const activeName = computed(() => router.currentRoute.value.query.tab || 'member-info')
    const id = computed(() => router.currentRoute.value.params.id)
    const siteId = computed(() => router.currentRoute.value.query.site)

    return {
      activeName,
      id,
      siteId,
      t
    }
  }
})
</script>
