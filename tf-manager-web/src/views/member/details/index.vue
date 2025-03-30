<template>
  <el-tabs v-model="activeName" :key="id">
    <el-tab-pane :label="t('fields.member')" name="member-info" lazy>
      <MemberInfoTab :mbr-id="id" :time-zone="timeZone" />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.login')" name="login-info" lazy>
      <LoginInfoTab :mbr-id="id" :time-zone="timeZone" />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.bankCard')" name="member-bank" lazy>
      <MemberBankTab :mbr-id="id" :time-zone="timeZone" />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.betMoneyChange')" name="bet-money-change" lazy>
      <BetMoneyChange :mbr-id="id" :time-zone="timeZone" />
    </el-tab-pane>
    <el-tab-pane v-if="hasRole(['ADMIN']) && useStore().state.user.name === 'xf-martin'" :label="t('fields.betMoneyChangeTidb')" name="member-money-change-tidb" lazy>
      <MemberMoneyChangeTidb :mbr-id="id" :time-zone="timeZone" />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.moneyChange')" name="member-money-change" lazy>
      <MemberMoneyChange :mbr-id="id" :time-zone="timeZone" />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.betRecords')" name="member-bet-record" lazy>
      <MemberBetRecordTab :mbr-id="id" :time-zone="timeZone" />
    </el-tab-pane>
    <el-tab-pane v-if="hasRole(['ADMIN']) && useStore().state.user.name === 'xf-martin'" :label="t('fields.betRecordsTidb')" name="member-bet-record-tidb" lazy>
      <MemberBetRecordTidbTab :mbr-id="id" :time-zone="timeZone" />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.deposit')" name="deposit-info" lazy>
      <DepositInfoTab :mbr-id="id" :time-zone="timeZone" />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.withdraw')" name="withdraw-info" lazy>
      <WithdrawInfoTab :mbr-id="id" :time-zone="timeZone" />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.transaction')" name="transaction-info" lazy>
      <TransactionInfoTab :mbr-id="id" :time-zone="timeZone" />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.privilege')" name="member-privilege-record" lazy>
      <MemberPrivilegeRecord :mbr-id="id" :time-zone="timeZone" />
    </el-tab-pane>
    <el-tab-pane
      :label="t('fields.rolloverRecord')"
      name="member-rollover-record"
      lazy
    >
      <MemberRolloverRecord :mbr-id="id" :time-zone="timeZone" />
    </el-tab-pane>
    <el-tab-pane
      :label="t('fields.memberRolloverEvent')"
      name="member-rollover-event"
      lazy
    >
      <MemberRolloverEventTab :mbr-id="id" :time-zone="timeZone" />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.riskControl')" name="risk-info" lazy>
      <RiskInfoTab :mbr-id="id" :time-zone="timeZone" />
    </el-tab-pane>
    <el-tab-pane
      :label="t('fields.referredFriends')"
      name="member-refer-friend"
      lazy
    >
      <MemberReferFriendTab
        :mbr-id="id"
        :site-id="siteId"
        :time-zone="timeZone"
      />
    </el-tab-pane>
    <el-tab-pane
      :label="t('fields.memberConsolidateReport')"
      name="daily-report"
      lazy
    >
      <DailyReportTab :mbr-id="id" :site-id="siteId" />
    </el-tab-pane>
    <el-tab-pane :label="t('menu.Member Platform')" name="member-platform" lazy>
      <MemberPlatformTab :mbr-id="id" :site-id="siteId" />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.memberBetRecordByPlatform')" name="member-bet-record-by-platform" lazy>
      <MemberBetRecordByPlatformTab :mbr-id="id" :time-zone="timeZone" />
    </el-tab-pane>
    <el-tab-pane v-if="hasRole(['ADMIN']) && useStore().state.user.name === 'xf-martin'" :label="t('fields.memberBetRecordByPlatformTidb')" name="member-bet-record-by-platform-tidb" lazy>
      <MemberBetRecordByPlatformTidbTab :mbr-id="id" :time-zone="timeZone" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { hasRole } from "../../../utils/util";
import LoginInfoTab from './tabs/login-info/index.vue'
import MemberInfoTab from './tabs/member-info/index.vue'
import TransactionInfoTab from './tabs/transaction-info/index.vue'
import DepositInfoTab from './tabs/deposit-info/index.vue'
import WithdrawInfoTab from './tabs/withdraw-info/index.vue'
import { useRouter } from 'vue-router'
import MemberPrivilegeRecord from './tabs/member-privilege-record/index.vue'
import BetMoneyChange from './tabs/bet-money-change/index.vue'
import MemberMoneyChange from './tabs/member-money-change/index.vue'
import MemberMoneyChangeTidb from './tabs/bet-money-change-tidb/index.vue'
import MemberBankTab from './tabs/member-bank/index.vue'
import RiskInfoTab from './tabs/risk-info/index.vue'
import MemberBetRecordTab from './tabs/member-bet-record/index.vue'
import MemberBetRecordTidbTab from './tabs/member-bet-record-tidb/index.vue'
import MemberBetRecordByPlatformTab from './tabs/member-bet-record-by-platform/index.vue'
import MemberBetRecordByPlatformTidbTab from './tabs/member-bet-record-by-platform-tidb/index.vue'
import MemberReferFriendTab from './tabs/member-refer-friend/index.vue'
import MemberRolloverRecord from './tabs/member-rollover-record/index.vue'
import DailyReportTab from './tabs/daily-report/index.vue'
import MemberPlatformTab from './tabs/member-platform/index.vue'
import MemberRolloverEventTab from './tabs/rollover-event/index.vue'
import { useI18n } from 'vue-i18n'
import { getSiteTimeZoneById } from '@/api/site'
import { useStore } from '../../../store'

export default defineComponent({
  components: {
    LoginInfoTab,
    MemberInfoTab,
    TransactionInfoTab,
    MemberPrivilegeRecord,
    BetMoneyChange,
    MemberMoneyChange,
    MemberMoneyChangeTidb,
    DepositInfoTab,
    WithdrawInfoTab,
    MemberBankTab,
    RiskInfoTab,
    MemberBetRecordTab,
    MemberBetRecordTidbTab,
    MemberReferFriendTab,
    MemberRolloverRecord,
    DailyReportTab,
    MemberPlatformTab,
    MemberBetRecordByPlatformTab,
    MemberBetRecordByPlatformTidbTab,
    MemberRolloverEventTab,
  },
  async setup() {
    const { t } = useI18n()
    const router = useRouter()
    const activeName = computed(
      () => router.currentRoute.value.query.tab || 'member-info'
    )
    const id = computed(() => router.currentRoute.value.params.id)
    const siteId = computed(() => router.currentRoute.value.query.site)
    const { data: timeZone } = await getSiteTimeZoneById(
      router.currentRoute.value.query.site
    )

    return {
      activeName,
      id,
      siteId,
      t,
      timeZone,
      hasRole,
      useStore
    }
  },
})
</script>
