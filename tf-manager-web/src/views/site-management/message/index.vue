<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane
      v-for="item in tabs"
      :id="item.key"
      :key="item.key"
      :label="item.displayName"
      :name="item.name"
    >
      <!-- eslint-disable -->
      <component v-bind:is="item.componentName" v-if="activeName === item.name" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { defineComponent, ref } from "vue";
import SystemMessage from "./system-message-template/index.vue";
import MessageOutbox from "./message-outbox/index.vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  components: {
    SystemMessage,
  },
  setup() {
    const { t } = useI18n();
    const activeName = ref('message')
    const tabs = [
      { key: 1, displayName: t('fields.composeMessage'), name: "message", componentName: SystemMessage },
      { key: 2, displayName: t('fields.inbox'), name: "message-inbox", componentName: MessageOutbox },
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
