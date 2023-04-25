<template>
  <el-tabs v-model="activeName">
    <el-tab-pane :label="t('fields.affiliate')" name="affiliate-info">
      <AffiliateInfoTab :aff-id="id" />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.downlineMember')" name="downline-member">
      <DownlineMemberTab :aff-id="id" />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.downlineAffiliate')" name="downline-affiliate">
      <DownlineAffiliateTab :aff-id="id" />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.login')" name="login-info">
      <LoginInfoTab :aff-id="id" />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.bankCard')" name="member-bank">
      <MemberBankTab :aff-id="id" />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.moneyChange')" name="member-money-change">
      <MemberMoneyChange :aff-id="id" />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.withdraw')" name="withdraw-info">
      <WithdrawInfoTab :aff-id="id" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { defineComponent, ref } from "vue";
import AffiliateInfoTab from "./tabs/affiliate-info/index.vue";
import DownlineMemberTab from "./tabs/downline-member/index.vue";
import DownlineAffiliateTab from "./tabs/downline-affiliate/index.vue";
import LoginInfoTab from "./tabs/login-info/index.vue";
import WithdrawInfoTab from "./tabs/withdraw-info/index.vue";
import MemberMoneyChange from "./tabs/member-money-change/index.vue";
import MemberBankTab from "./tabs/member-bank/index.vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

export default defineComponent({
  components: {
    AffiliateInfoTab,
    DownlineMemberTab,
    DownlineAffiliateTab,
    LoginInfoTab,
    WithdrawInfoTab,
    MemberMoneyChange,
    MemberBankTab
  },
  setup() {
    const { t } = useI18n();
    const activeName = ref('affiliate-info')
    const router = useRouter()
    const {
      params: { id }
    } = router.currentRoute.value

    return {
      activeName,
      id,
      t
    }
  }
})
</script>
