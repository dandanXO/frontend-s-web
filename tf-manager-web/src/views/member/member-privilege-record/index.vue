<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane
      v-for="item in tabs"
      :id="item.key"
      :key="item.key"
      :label="item.displayName"
      :name="item.name"
    ><!-- eslint-disable -->
      <component v-bind:is="item.componentName" v-if="activeName === item.name" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { defineComponent, ref } from "vue";
import DistributeRecord from "./distribute-record/index.vue";
import MemberRecord from "./member-record/index.vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  components: {
    DistributeRecord,
  },
  setup() {
    const { t } = useI18n();
    const activeName = ref('distributeRecord')
    const tabs = [
      { key: 1, displayName: t('fields.distributePrivilege'), name: "distributeRecord", componentName: DistributeRecord },
      { key: 2, displayName: t('fields.memberPrivilegeRecord'), name: "memberRecord", componentName: MemberRecord },
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
