<template>
  <el-tabs v-model="activeName">
    <el-tab-pane :label="t('fields.gameQuiz')" name="quiz-question" v-if="hasPermission(['sys:game-quiz:list'])">
      <QuestionTab />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.gameQuizAnswer')" name="quiz-answer" v-if="hasPermission(['sys:game-quiz-answer:list'])">
      <AnswerTab />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useRouter } from "vue-router";
import QuestionTab from "./question/index.vue";
import AnswerTab from "./answer/index.vue";
import { useI18n } from "vue-i18n";
import { hasPermission } from "../../../utils/util";

export default defineComponent({
  components: {
    QuestionTab,
    AnswerTab
  },
  setup() {
    const { t } = useI18n()
    const router = useRouter()
    const activeName = computed(() => router.currentRoute.value.query.tab || 'quiz-question')

    return {
      activeName,
      t,
      hasPermission
    }
  }
})
</script>
