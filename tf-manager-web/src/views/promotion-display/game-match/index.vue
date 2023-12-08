<template>
  <el-tabs v-model="activeName">
    <el-tab-pane :label="t('fields.gameMatch')" name="match-info" v-if="hasPermission(['sys:game-match:list'])">
      <MatchInfoTab />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.gameMatchRecord')" name="match-record" v-if="hasPermission(['sys:game-match-record:list'])">
      <MatchRecordTab />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useRouter } from "vue-router";
import MatchInfoTab from "./match-info/index.vue";
import MatchRecordTab from "./match-record/index.vue";
import { useI18n } from "vue-i18n";
import { hasPermission } from "../../../utils/util";

export default defineComponent({
  components: {
    MatchInfoTab,
    MatchRecordTab
  },
  setup() {
    const { t } = useI18n()
    const router = useRouter()
    const activeName = computed(() => router.currentRoute.value.query.tab || 'match-info')

    return {
      activeName,
      t,
      hasPermission
    }
  }
})
</script>
