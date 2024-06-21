<template>
<!--    <div class="europe-2024-promo-period">
      活动时间：2024/6/1 - 2024/7/15 23:59:59
    </div>-->
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

<script setup>
import { ref, defineProps, onMounted } from "vue";
import EuropeHongBaoYu from "@/components/hotpromo/europe-2024/parts/hongbaoyu.vue"
import ScheduleDisplay from "@/components/hotpromo/europe-2024/parts/scheduledisplay.vue"
import DoublingGold from "@/components/hotpromo/europe-2024/parts/doublinggold.vue"
import DailyFund from "@/components/hotpromo/europe-2024/parts/dailyfund.vue"
import VenueFund from "@/components/hotpromo/europe-2024/parts/venuefund.vue"
// import { ref, defineProps, onMounted } from "vue";
// import { claimDailyRainItem } from "@/api/index/promo";
// import { ElMessage } from "element-plus";

const tabs = ref([
{ name: '欧洲杯进球红包雨', content: EuropeHongBaoYu },
  { name: '欧洲杯赛程', content: ScheduleDisplay },
  { name: '欧洲杯专属豪礼', content: DailyFund },
  // { name: '首投场馆助威金', content: VenueFund },
  { name: '欧洲杯庆赛礼', content: DoublingGold},
]);

const activeTab = ref(0);

function activateTab(index) {
  activeTab.value = index;
}
</script>
<style lang="scss">
.europe-2024-promo-period {
  background: url("@/components/hotpromo/europe-2024/images/period-bg.png");
  background-size: 100% 100%;
  font-size: 17px;
  font-weight: 700;
  line-height: 30px;
  padding: 20px;
  color: #fff;
  width: 400px;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px auto 20px;
  text-align: center;
  font-family: 'Microsoft YaHei UI';
}

  .europe-container {
    width: 100%;
    max-width: 1500px;
    margin: 85px auto;
    .rule-title {
      text-align: center;
    }
    .tab-buttons {
      width: 100%;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      max-width: 1000px;
      margin: 0px auto;
      button {
        background: url(images/inactive-tab.png)no-repeat center center;
        width: 250px;
        height: 60px;
        background-size: contain;
        color: #ffffff;
        font-weight: bold;
        font-family: 'PingFang SC';
        font-size: 20px;
        font-weight: 800;
        text-align: center;

        &.active {
          background-image: url(images/active-tab.png);
        }
      }
    }
    .tab-content {
      min-height: 350px;
      // padding-top:20px;
      .tab-title {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 40px;
        font-weight: bold;
        line-height: 59.57px;
        letter-spacing: 0.12em;
        text-align: left;
        margin: 2vh auto 5vh;
        background: linear-gradient(360deg, #BCF3FF 10.4%, #FFFFFF 100%);
        border: none;
        color: transparent; /* Hide the original text */
        -webkit-background-clip: text; /* Apply background gradient to the text */
        background-clip: text;

        &:before, &:after {
          content: "";
          height: 48px;
          width: 180px;
          background: url(images/titlewing.png)no-repeat center center;
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
        th, td{
          padding: 20px;
          text-align: center;
          font-size: 24px;
        }
        th {
          background: linear-gradient(180deg, #0275E1 0%, #01067B 100%);
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
          background: #051D4766;
          color: #ffffff;
          border: 2px solid #FFFFFF33;
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
      color: #FAFF00;
      font-family: 'Microsoft Yahei UI';
      text-align: center;
      margin: 80px auto;
      font-size: 24px;
      display: block;
    }
  }

</style>
