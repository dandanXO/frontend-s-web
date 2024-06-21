<template>
  <div class="europe-container">
    <div class="tab-buttons">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        @click="activateTab(index)"
        :class="{ active: activeTab === index }"
      >
        {{ tab.name }}
      </button>
    </div>
    <div class="tab-content">
      <component :is="tabs[activeTab].content" :tabtitle="tabs[activeTab].name" />
    </div>
  </div>
</template>

<script setup id="euroCup">
import { ref, defineProps, onMounted } from "vue";
import EuropeHongBaoYu from "../../hotpromo/europe-2024/parts/HongBaoYu.vue";
import ScheduleDisplay from "../../hotpromo/europe-2024/parts/ScheduleDisplay.vue";
import DoublingGold from "../../hotpromo/europe-2024/parts/DoublingGold.vue";
import DailyFund from "../../hotpromo/europe-2024/parts/DailyFund.vue";
import VenueFund from "../../hotpromo/europe-2024/parts/VenueFund.vue";
// import { ref, defineProps, onMounted } from "vue";
// import { claimDailyRainItem } from "@/api/index/promo";
// import { ElMessage } from "element-plus";

const tabs = ref([
  { name: "欧洲杯进球红包雨", content: EuropeHongBaoYu },
  { name: "欧洲杯赛程", content: ScheduleDisplay },
  { name: "欧洲杯专属豪礼", content: DailyFund },
  // { name: '首投场馆助威金', content: VenueFund },
  { name: "欧洲杯庆赛礼", content: DoublingGold }
]);

const activeTab = ref(0);

function activateTab(index) {
  activeTab.value = index;
}
</script>
<style lang="scss">
.europe-container {
  width: 100%;
  max-width: 1500px;
  margin: 10px auto;
  .rule-title {
    text-align: center;
  }
  .tab-buttons {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    max-width: 1400px;
    margin: 10px auto;
    flex-wrap: wrap;
    gap: 15px;
    button {
      background: url(images/inactive-tab.png) no-repeat center center;

      width: 45%;
      height: 50px;
      background-size: contain;
      color: #ffffff;
      font-weight: bold;
      font-family: "PingFang SC";
      font-size: 1rem;
      font-weight: 800;
      //line-height: 34.75px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-bottom: 3px;
      border: 0;

      &.active {
        background-image: url(images/active-tab.png);
      }
    }
  }
  .tab-content {
    // min-height: 1400px;
    .tab-title {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.5rem;
      font-weight: bold;
      line-height: 59.57px;
      letter-spacing: 0.12em;
      text-align: left;
      margin: 30px auto;
      background: linear-gradient(360deg, #bcf3ff 10.4%, #ffffff 100%);
      border: none;
      color: transparent; /* Hide the original text */
      -webkit-background-clip: text; /* Apply background gradient to the text */
      background-clip: text;
      white-space:nowrap;

      &:before,
      &:after {
        content: "";
        height: 20px;
        width: 80px;
        background: url(images/titlewing.png) no-repeat center center;
        background-size: contain;
      }
      &:after {
        transform: rotateY(180deg);
      }
    }
  }
  table {
    width: 100%;
    tr {
      th,
      td {
        background-color: #051d4766 !important;
        padding: 20px;
        text-align: center;
        font-size: 16px;
      }
      th {
        background: linear-gradient(180deg, #0275e1 0%, #01067b 100%);
        color: #ffffff;
      }
      &:nth-child(2) {
        td {
          border-top: 0;
        }
      }
      &:last-child {
        td {
          border-bottom: 0;
        }
      }
      td {
        background: #051d4766;
        color: #ffffff;
        border: 2px solid #ffffff33;
        &:first-child {
          border-left: 0;
          border-top: 0;
        }
        &:last-child {
          border-right: 0;
          border-bottom: 0;
        }
      }
    }
  }
  .note {
    color: #faff00;
    font-family: "Microsoft Yahei UI";
    text-align: center;
    margin: 10px auto;
    font-size: 16px;
    display: block;
  }
}
</style>
