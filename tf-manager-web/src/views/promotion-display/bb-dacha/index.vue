<template>
  <el-tabs v-model="activeName">
    <el-tab-pane :label="t('fields.bbdachaSetting')" name="bb-dacha-setting" v-if="hasPermission(['sys:bb-dacha:list'])">
      <SettingTab />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.bbdachaAnswers')" name="bb-dacha-answers" v-if="hasPermission(['sys:bb-dacha-answer:list'])">
      <AnswersTab />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useRouter } from "vue-router";
import SettingTab from "./setting/index.vue";
import AnswersTab from "./answers/index.vue";
import { useI18n } from "vue-i18n";
import { hasPermission } from "../../../utils/util";

export default defineComponent({
  components: {
    SettingTab,
    AnswersTab
  },
  setup() {
    const { t } = useI18n()
    const router = useRouter()
    const activeName = computed(() => router.currentRoute.value.query.tab || 'bb-dacha-setting')

    return {
      activeName,
      t,
      hasPermission
    }
  }
})
</script>
