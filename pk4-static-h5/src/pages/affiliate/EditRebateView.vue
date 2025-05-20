<template>
    <q-card class="q-pa-md bg-transparent">
      <img @click="openPageInfoDialog" class="info-qn" src="../../assets/images/affiliate/qnmark.png">
      <div class="top-right" @click="() => {}">
        <img src="../../assets/images/affiliate/team-management/sort-icon.png">
      </div>

      <EditRebate />
    </q-card>
  </template>
  
  <script setup>
  import { ref } from 'vue'
import EditRebate from './edit-rebate/EditRebate.vue';
  </script>
  
  <style scoped lang="scss">
  .info-qn {
    position: absolute;
    right: 120px;
    top: -30px;
    width: 15px;
  }
  .top-right {
    top: -35px;
    right: 10px;
    position: absolute;
  }
  .q-card {
    max-width: 800px;
    margin: auto;
  }
  .tab-toggle {
    // background: url(../../assets/images/account/deposit-withdraw-tab-bg.png) no-repeat center center;
    
    background-size: 100% 100%;
    border-radius: 8px;
    margin: 10px;
    padding: 1px;

    .right {
      color: white;
      // background: url(../../assets/images/account/deposit-withdraw-tab-active-bg-right.png) no-repeat center center;
      background-size: 0;
    }

    .left {
      color: white;
      // background: url(../../assets/images/account/deposit-withdraw-tab-active-bg-left.png) no-repeat center center;
      background-size: 0;
    }

    :deep(.q-tab__label) {
      font-weight: 700;
      font-size: 10px;
      // color: #FFFFFF80;
    }
    :deep(.q-tab) {
      background: #3237384D;
      min-height: unset;
      padding: 4px;
    }
    :deep(.q-tabs__content) {

    }

    :deep(.q-tab--active) {
      color: white;
      // background-size: 100% 100%;
      // background: linear-gradient(
      //   180deg,
      //   rgba(97, 255, 0, 0) 0%,
      //   rgba(97, 255, 0, 0.25) 50.5%,
      //   rgba(97, 255, 0, 0) 100%
      // );
      // box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);

      // &:before {
      //   content: "";
      //   background-color: #21EF89;
      //   height: 3px;
      //   border-radius: 4px;
      //   width: 30%;
      //   position: absolute;
      //   bottom: 0;
      //   left: 50%;
      //   transform: translateX(-50%);
      // }
      background: linear-gradient(90deg, #0287f2 0%, #0664d2 100%);
    }

    :deep(.q-tab--active .q-tab__label) {
      font-weight: 700 !important;
    }
  }
  </style>