<template>
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="箱开福来" name="bountychest">
        <BountyChest :promo-code="promoCode" />
      </el-tab-pane>
      <el-tab-pane label="签到好礼" name="bountysign">
        <BountySignIn :promo-code="promoCode" />
      </el-tab-pane>
    </el-tabs>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import BountyChest from './BountyChest.vue';
  import BountySignIn from './BountySignIn.vue';
  
  const props = defineProps(["promoCode"]);
  const promoCode = props.promoCode
  const activeTab = ref('bountychest');
  
  const handleTabClick = (tab) => {
    console.log('Tab clicked:', tab.name);
  };
  </script>
  
  <style lang="scss" scoped>
  :deep(.el-tabs){
    background: red;
  }
  :deep(.el-tabs__nav-wrap:after) {
    background: none;
  }
  :deep(.el-tabs__header) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  :deep(.el-tabs__nav) {
    display: flex;
    gap: 80px;
    // margin: 0px auto 50px;
  }
  :deep(.el-tabs__item) {
    background: linear-gradient(180deg, #E7E7E7 0%, #C9C9C9 100%);
    text-align: center;
    padding: 10px 50px 20px 50px !important;
    border-radius: 30px;
    color: #95979A;
    font-family: HYYakuHei800;
    font-size: 30px;
    // margin-left: 100px;
    font-weight: 500;
    text-align: center;
    height: 64px;
    
    &.is-active { 
      // background: linear-gradient(90deg, #FFFD66 0%, #FF9400 100%);
      // color: #000000;
      background: linear-gradient(180deg, #73B2FF 0%, #3981FF 100%);
      color: #ffffff;

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
  