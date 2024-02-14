<template>
  <el-tabs v-model="activeName">
    <el-tab-pane :label="t('fields.question')" name="questionnaire-questions" v-if="hasPermission(['sys:questionnaire:list'])">
      <QuestionsTab />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.records')" name="questionnaire-records" v-if="hasPermission(['sys:questionnaire-records:list'])">
      <RecordsTab />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useRouter } from "vue-router";
import QuestionsTab from "./questions/index.vue";
import RecordsTab from "./records/index.vue";
import { useI18n } from "vue-i18n";
import { hasPermission } from "../../../utils/util";

export default defineComponent({
  components: {
    QuestionsTab,
    RecordsTab
  },
  setup() {
    const { t } = useI18n()
    const router = useRouter()
    const activeName = computed(() => router.currentRoute.value.query.tab || 'questionnaire-questions')

    return {
      activeName,
      t,
      hasPermission
    }
  }
})
</script>
