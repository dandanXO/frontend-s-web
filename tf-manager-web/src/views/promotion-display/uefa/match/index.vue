<template>
  <el-tabs v-model="activeName">
    <el-tab-pane :label="t('fields.uefaMatchSetting')" name="uefa-match-setting" v-if="hasPermission(['sys:uefa-match:list'])">
      <SettingTab />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.uefaMatchRecord')" name="uefa-match-record" v-if="hasPermission(['sys:uefa-match-record:list'])">
      <RecordTab />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.uefaSettlement')" name="uefa-settlement" v-if="hasPermission(['sys:uefa-settlement:list'])">
      <SettlementTab />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useRouter } from "vue-router";
import SettingTab from "./setting/index.vue";
import RecordTab from "./record/index.vue";
import SettlementTab from "./settle/index.vue";
import { useI18n } from "vue-i18n";
import { hasPermission } from "../../../../utils/util";

export default defineComponent({
  components: {
    SettingTab,
    RecordTab,
    SettlementTab
  },
  setup() {
    const { t } = useI18n()
    const router = useRouter()
    const activeName = computed(() => router.currentRoute.value.query.tab || 'uefa-match-setting')

    return {
      activeName,
      t,
      hasPermission
    }
  }
})
</script>
