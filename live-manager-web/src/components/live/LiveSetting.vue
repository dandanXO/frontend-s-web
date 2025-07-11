<template>
  <Button @click="handleBack" size="small" style="margin-bottom: 10px">{{ t('fields.back') }}</Button>
  <TabView>
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

    const onTabChange = () => {

    }

    const handleBack = () => {
      console.log("handleBack")
      // 返回上一页
      router.go(-1);
      // 或者导航到指定路径
      // router.push('/live-sport');
    };

    return {
      activeName,
      onTabChange,
      handleBack,
      t
    }
  }
})
</script>
