<template>
  <el-tabs v-model="activeName">
    <el-tab-pane :label="t('fields.task')" name="task-list" v-if="hasPermission(['sys:task:list'])">
      <ListTab />
    </el-tab-pane>
    <el-tab-pane :label="t('fields.taskProgress')" name="task-progress" v-if="hasPermission(['sys:task-progress:list'])">
      <ProgressTab />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useRouter } from "vue-router";
import ListTab from "./list/index.vue";
import ProgressTab from "./progress/index.vue";
import { useI18n } from "vue-i18n";
import { hasPermission } from "../../../utils/util";

export default defineComponent({
  components: {
    ListTab,
    ProgressTab
  },
  setup() {
    const { t } = useI18n()
    const router = useRouter()
    const activeName = computed(() => router.currentRoute.value.query.tab || 'task-list')

    return {
      activeName,
      t,
      hasPermission
    }
  }
})
</script>
