<template>
  <el-tabs v-model="activeName">
    <el-tab-pane :label="t('fields.piggyBankSettings')" name="piggy-bank-setting" v-if="hasPermission(['sys:piggy-bank:list'])">
      <SettingTab />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.piggyBankRecords')" name="piggy-bank-records" v-if="hasPermission(['sys:piggy-bank-records:list'])">
      <RecordsTab />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useRouter } from "vue-router";
import SettingTab from "./settings/index.vue";
import RecordsTab from "./records/index.vue";
import { useI18n } from "vue-i18n";
import { hasPermission } from "../../../utils/util";

export default defineComponent({
  components: {
    SettingTab,
    RecordsTab
  },
  setup() {
    const { t } = useI18n()
    const router = useRouter()
    const activeName = computed(() => router.currentRoute.value.query.tab || 'piggy-bank-setting')

    return {
      activeName,
      t,
      hasPermission
    }
  }
})
</script>
