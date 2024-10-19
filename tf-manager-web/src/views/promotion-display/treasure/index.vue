<template>
  <el-tabs v-model="activeName">
    <el-tab-pane :label="t('fields.keyRecord')" name="key-record" v-if="hasPermission(['sys:treasure:key:list'])">
      <KeyTab />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.claimRecord')" name="claim-record" v-if="hasPermission(['sys:treasure:list'])">
      <ClaimTab />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.checkInRecord')" name="check-in-record" v-if="hasPermission(['sys:treasure:check-in:list'])">
      <CheckInTab />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useRouter } from "vue-router";
import KeyTab from "./key-record/index.vue";
import ClaimTab from "./claim-record/index.vue";
import CheckInTab from "./check-in-record/index.vue";
import { useI18n } from "vue-i18n";
import { hasPermission } from "../../../utils/util";

export default defineComponent({
  components: {
    KeyTab,
    ClaimTab,
    CheckInTab
  },
  setup() {
    const { t } = useI18n()
    const router = useRouter()
    const activeName = computed(() => router.currentRoute.value.query.tab || 'key-record')

    return {
      activeName,
      t,
      hasPermission
    }
  }
})
</script>
