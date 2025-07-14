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
import { defineComponent, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
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
    const route = useRoute()
    const request = computed(() => router.currentRoute.value.query.request)
    const originalQueryParams = ref(null);
    const activeName = computed(() => router.currentRoute.value.query.tab || 'sport-live-event-setting')

    const onTabChange = () => {

    }

    const handleBack = () => {
      const savedQuery = sessionStorage.getItem('liveEventQuery');
      if (savedQuery) {
        router.push({
          path: '/live-sport/live-event',
        });
      } else {
        router.go(-1);
      }
    };

    // 在组件挂载时读取 query 参数
    onMounted(() => {
      if (route.query.request) {
        originalQueryParams.value = route.query.request;
      }
    });

    return {
      activeName,
      request,
      onTabChange,
      handleBack,
      t
    }
  }
})
</script>
