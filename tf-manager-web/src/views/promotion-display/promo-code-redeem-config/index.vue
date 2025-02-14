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
import CodeRedeemConfig from "./config/index.vue";
import BnWListRecord from "./bnw-list/index.vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  components: {
    CodeRedeemConfig,
  },
  setup() {
    const { t } = useI18n();
    const activeName = ref('codeRedeemConfig')
    const tabs = [
      { key: 1, displayName: t('fields.promoCodeRedeemConfig'), name: "codeRedeemConfig", componentName: CodeRedeemConfig },
      { key: 2, displayName: t('fields.promoCodeRedeemBnWList'), name: "bnWListRecord", componentName: BnWListRecord },
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
