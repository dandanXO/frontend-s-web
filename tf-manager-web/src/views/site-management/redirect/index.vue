<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane
      v-for="item in tabs"
      :id="item.key"
      :key="item.key"
      :label="item.displayName"
      :name="item.name"
    >
      <component :is="item.componentName" v-if="activeName === item.name" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
/* eslint-disable */
import { defineComponent, ref } from "vue";
import RedirectRecord from "./redirect-record/index.vue";
import RedirectMember from "./redirect-member/index.vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  components: {
    RedirectRecord,
  },
  setup() {
    const { t } = useI18n();
    const activeName = ref('RedirectRecord')
    const tabs = [
      { key: 1, displayName: t('fields.redirectRecord'), name: "RedirectRecord", componentName: RedirectRecord },
      { key: 2, displayName: t('fields.redirectMember'), name: "RedirectMember", componentName: RedirectMember },
    ]
    const handleClick = (tab, event) => {
      console.log(tab, event)
    }
    return {
      activeName,
      tabs,
      handleClick
    }
  }
})
</script>
