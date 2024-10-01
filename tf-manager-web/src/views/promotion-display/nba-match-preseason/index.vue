<template>
  <el-tabs v-model="activeName">
    <el-tab-pane :label="t('fields.nbaMatchPreseasonSetting')" name="nba-match-preseason-setting" v-if="hasPermission(['sys:nba-match-preseason:list'])">
      <SettingTab />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.nbaMatchPreseasonRecord')" name="nba-match-preseason-record" v-if="hasPermission(['sys:nba-match-preseason-record:list'])">
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
import { hasPermission } from "@/utils/util";

export default defineComponent({
  components: {
    SettingTab,
    RecordTab
  },
  setup() {
    const { t } = useI18n()
    const router = useRouter()
    const activeName = computed(() => router.currentRoute.value.query.tab || 'nba-match-preseason-setting')

    return {
      activeName,
      t,
      hasPermission
    }
  }
})
</script>
