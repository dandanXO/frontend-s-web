<template>
  <el-tabs v-model="activeName">
    <el-tab-pane :label="t('fields.sportMatchSetting')" name="sport-match-setting" v-if="hasPermission(['sys:sport-match:list'])">
      <SettingTab />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.sportMatchRecord')" name="sport-match-record" v-if="hasPermission(['sys:sport-match-record:list'])">
      <RecordTab />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useRouter } from "vue-router";
import SettingTab from "./setting/index.vue";
import RecordTab from "./record/index.vue";
import { useI18n } from "vue-i18n";
import { hasPermission } from "../../../utils/util";

export default defineComponent({
  components: {
    SettingTab,
    RecordTab
  },
  setup() {
    const { t } = useI18n()
    const router = useRouter()
    const activeName = computed(() => router.currentRoute.value.query.tab || 'sport-match-setting')

    return {
      activeName,
      t,
      hasPermission
    }
  }
})
</script>
