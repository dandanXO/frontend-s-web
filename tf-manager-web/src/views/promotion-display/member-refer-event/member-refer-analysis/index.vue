<template>
  <el-tabs v-model="activeName">
    <el-tab-pane
      :label="t('fields.referFriendAnalysis')"
      name="stats-analysis"
      v-if="hasPermission(['sys:privi:member-refer-friend-stats:list'])"
    >
      <StatsAnalysisTab @switch-to-relation-tab="switchPane" />
    </el-tab-pane>
    <el-tab-pane
      :label="t('fields.referRelationQuery')"
      name="refer-relation"
      v-if="hasPermission(['sys:privi:member-refer-friend-stats:list'])"
    >
      <ReferRelationTab :referrer-query="referQuery" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { defineComponent, ref } from 'vue'
import ReferRelationTab from './refer-relation/index.vue'
import StatsAnalysisTab from './stats-analysis/index.vue'
import { useI18n } from 'vue-i18n'
import { hasPermission } from '@/utils/util'

export default defineComponent({
  components: {
    ReferRelationTab,
    StatsAnalysisTab,
  },
  setup() {
    const { t } = useI18n()
    const activeName = ref('stats-analysis')
    const referQuery = ref(null)
    const switchPane = (query) => {
      activeName.value = 'refer-relation'
      referQuery.value = query
    }

    return {
      activeName,
      t,
      hasPermission,
      switchPane,
      referQuery
    }
  },
})
</script>
