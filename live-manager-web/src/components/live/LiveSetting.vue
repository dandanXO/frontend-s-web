<template>
  <TabView v-model:activeIndex="activeIndex" @update:activeIndex="onTabChange">
    <TabPanel :header="t('fields.sportLiveEventSetting')">
      <SettingTab />
    </TabPanel>
    <TabPanel :header="t('fields.sportLiveStreamSetting')">
      <RecordTab />
    </TabPanel>
  </TabView>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useRouter } from "vue-router";
import SettingTab from "./setting/LiveSettingView.vue";
import RecordTab from "./setting/LiveRecordView.vue";
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
