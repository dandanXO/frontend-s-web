<template>
  <el-tabs v-model="activeTab" @tab-click="handleTabClick">
    <el-tab-pane label="签到好礼" name="bountysign">
      <BountySignIn :promo-code="promoCode" />
    </el-tab-pane>
    <el-tab-pane label="箱开福来" name="bountychest">
      <BountyChest :promo-code="promoCode" />
    </el-tab-pane>
  </el-tabs>
</template>

<script setup>
import { ref, defineProps } from "vue";
import BountyChest from "./BountyChest.vue";
import BountySignIn from "./BountySignIn.vue";

const props = defineProps(["promoCode"]);
const promoCode = ref(props.promoCode);
const activeTab = ref("bountysign");

const handleTabClick = (tab) => {
  console.log("Tab clicked:", tab.name);
};
</script>

<style lang="scss" scoped>
:deep(.el-tabs__nav-wrap:after) {
  background: none;
}
:deep(.el-tabs__header) {
  justify-content: center;
  align-items: center;
}
:deep(.el-tabs__nav) {
  display: flex;
  width: 100%;
  justify-content: center;
  gap: 80px;
  margin: 50px auto 0;
}
:deep(.el-tabs__item) {
  background: linear-gradient(180deg, #e7e7e7 0%, #c9c9c9 100%);
  text-align: center;
  padding: 30px 50px !important;
  border-radius: 30px;
  color: #95979a;
  font-family: HYYakuHei800;
  font-size: 36px;
  font-weight: 700;
  text-align: center;
  display: flex;
  align-items: center;

  &.is-active {
    background: linear-gradient(90deg, #fffd66 0%, #ff9400 100%);
    color: #000000;
  }
}
:deep(.el-tabs__active-bar) {
  display: none;
}
:deep(.el-tabs__nav-wrap) {
  flex: none;
}
/* Add any custom styles here */
</style>
