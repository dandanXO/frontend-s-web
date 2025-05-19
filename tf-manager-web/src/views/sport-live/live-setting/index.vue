<template>
  <el-tabs v-model="activeName">
    <el-tab-pane :label="t('fields.sportLiveEventSetting')" name="sport-live-event-setting">
      <SettingTab />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.sportLiveStreamSetting')" name="sport-live-stream-setting">
      <RecordTab />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useRouter } from "vue-router";
import SettingTab from "./setting/index.vue";
import RecordTab from "./edit/index.vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  components: {
    SettingTab,
    RecordTab
  },
  setup() {
    const { t } = useI18n()
    const router = useRouter()
    const activeName = computed(() => router.currentRoute.value.query.tab || 'sport-live-event-setting')

    return {
      activeName,
      t
    }
  }
})
</script>
