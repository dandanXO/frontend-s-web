<template>
  <el-tabs v-model="activeName">
    <el-tab-pane :label="t('fields.affiliate')" name="affiliate-info">
      <AffiliateInfoTab :aff-id="id" :time-zone="timeZone" />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.downlineMember')" name="downline-member">
      <DownlineMemberTab :aff-id="id" :time-zone="timeZone" />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.downlineAffiliate')" name="downline-affiliate">
      <DownlineAffiliateTab :aff-id="id" :time-zone="timeZone" />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.login')" name="login-info">
      <LoginInfoTab :aff-id="id" :time-zone="timeZone" />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.bankCard')" name="member-bank">
      <MemberBankTab :aff-id="id" :time-zone="timeZone" />
    </el-tab-pane>
    <el-tab-pane v-if="parseInt(siteId) === 26" :label="t('fields.betMoneyChange')" name="bet-money-change" lazy>
      <BetMoneyChange :mbr-id="id" :time-zone="timeZone" />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.moneyChange')" name="member-money-change">
      <MemberMoneyChange :aff-id="id" :time-zone="timeZone" />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.withdraw')" name="withdraw-info">
      <WithdrawInfoTab :aff-id="id" :time-zone="timeZone" />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.affiliateTransferRecord')" name="affiliate-transfer">
      <AffiliateTransferTab :aff-id="id" :time-zone="timeZone" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import AffiliateInfoTab from "./tabs/affiliate-info/index.vue";
import DownlineMemberTab from "./tabs/downline-member/index.vue";
import DownlineAffiliateTab from "./tabs/downline-affiliate/index.vue";
import LoginInfoTab from "./tabs/login-info/index.vue";
import WithdrawInfoTab from "./tabs/withdraw-info/index.vue";
import MemberMoneyChange from "./tabs/member-money-change/index.vue";
import MemberBankTab from "./tabs/member-bank/index.vue";
import AffiliateTransferTab from "./tabs/affiliate-transfer/index.vue";
import BetMoneyChange from '../../member/details/tabs/bet-money-change/index.vue'
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { getSiteTimeZoneById } from "@/api/site";

export default defineComponent({
  components: {
    AffiliateInfoTab,
    DownlineMemberTab,
    DownlineAffiliateTab,
    LoginInfoTab,
    WithdrawInfoTab,
    MemberMoneyChange,
    MemberBankTab,
    AffiliateTransferTab,
    BetMoneyChange
  },
  async setup() {
    const { t } = useI18n();
    const activeName = ref('affiliate-info')
    const router = useRouter()
    const {
      params: { id }
    } = router.currentRoute.value
    const { data: timeZone } = await getSiteTimeZoneById(router.currentRoute.value.query.site);
    const siteId = computed(() => router.currentRoute.value.query.site)

    return {
      activeName,
      id,
      t,
      timeZone,
      siteId
    }
  }
})
</script>
