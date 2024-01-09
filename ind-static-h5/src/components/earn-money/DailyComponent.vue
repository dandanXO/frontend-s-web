<template>
  <div class="section-wrapper">
    <div class="title-wrapper">
      <div class="title">My Team</div>
      <div class="team-member-container">
        <div class="member-imgs" :style="`width: ${40 + limitedMembers * 15}px`">
          <q-avatar v-for="n in limitedMembers" :key="n" size="30px" class="overlapping" :style="`left: ${n * 15}px`">
            <img :src="`https://cdn.quasar.dev/img/avatar${n + 1}.jpg`" />
          </q-avatar>
        </div>
        <div class="member-amt">{{ memberVIPData.totalMembers }}</div>
      </div>
    </div>

    <div class="subtitle-wrapper">
      <div class="subtitle">Today Status</div>
      <div class="chart-cat">
        <div class="square m"></div>
        <div>Member</div>
      </div>
      <div class="chart-cat">
        <div class="square ba"></div>
        <div>Bet Amount</div>
      </div>
    </div>
  </div>

  <div class="content-wrapper">
    <div class="progress-bar-wrapper">
      <q-linear-progress size="15px" :value="progressValueM" color="#EC77FF" class="progress-bar-M">
        <div class="linear-indicator linear-start">{{ memberVIPData.currentLevelMemberCount }}</div>
        <div class="absolute-full flex flex-center">
          <q-badge
            color="transparent"
            text-color="white"
            :label="`${convertToCommaAmount(memberVIPData.memberCount, false)}/${convertToCommaAmount(
              memberVIPData.nextLevelMemberCount,
              false
            )}`"
          ></q-badge>
        </div>
        <div class="linear-indicator linear-end">{{ memberVIPData.nextLevelMemberCount }}</div>
      </q-linear-progress>
    </div>

    <div class="progress-bar-wrapper">
      <q-linear-progress size="15px" :value="progressValueBA" color="#FFA800" class="progress-bar-BA">
        <div class="linear-indicator linear-start">{{ memberVIPData.currentLevelBet }}</div>
        <div class="absolute-full flex flex-center">
          <q-badge
            color="transparent"
            text-color="white"
            :label="`${convertToCommaAmount(memberVIPData.totalValidBet, false)}/${convertToCommaAmount(
              memberVIPData.nextLevelBet,
              false
            )}`"
          ></q-badge>
        </div>
        <div class="linear-indicator linear-end">{{ convertToCommaAmount(memberVIPData.nextLevelBet) }}</div>
      </q-linear-progress>
    </div>

    <div>
      <div class="percentage-wrapper">
        <div class="percentage">{{ memberVIPData.rate }}%</div>
        <div class="percentage">{{ memberVIPData.nextLevelRate }}%</div>
      </div>
      <div class="rate-wrapper">
        <div class="rate">Rate</div>
        <div class="rate">Rate</div>
      </div>
      <div class="achieve-wrapper">
        <div class="achieve"><q-icon name="check" /></div>
        <div class="line"></div>
        <div class="not-achieve">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8.5" stroke="white" stroke-opacity="0.3" stroke-width="3" />
          </svg>
        </div>
      </div>
    </div>
  </div>

  <div class="content-wrapper">
    <div class="top-container">
      <div class="left-container">
        <div class="title">Betting Amount</div>
        <div class="value">₹ {{ convertToCommaAmount(totalBetRabteDailyDetailsData.validBet, false) }}</div>
        <div class="data-wrapper">
          <div class="img-wrapper">
            <img src="../../assets/images/earn-money/member.png" />
          </div>
          <div class="data-txt">Register Members:</div>
          <div class="data-amount">{{ totalBetRabteDailyDetailsData.memberCount }}</div>
        </div>
      </div>
      <div class="right-container text-right">
        <div class="title">Rebate Amount</div>
        <div class="value">₹ {{ convertToCommaAmount(totalBetRabteDailyDetailsData.rebateAmount, false) }}</div>
        <!-- <div class="data-wrapper right">
          <div class="img-wrapper">
            <img src="../../assets/images/earn-money/cash.png" />
          </div>
          <div class="data-txt">Cash In:</div>
          <div class="data-amount">0</div>
        </div> -->
      </div>
    </div>
    <div class="chart">
      <div class="arrow" @click="onSwiperArrowClick()"><img src="../../assets/images/earn-money/arrow_left.png" /></div>
      <div class="swiper-container swiper-nav-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <div class="slide-item">
              <Bar ref="chartRef" :data="chartData.data" :options="chartData.options" />
            </div>
          </div>
          <div class="swiper-slide">
            <div class="slide-item">
              <Bar ref="chartRef2" :data="chartData2.data" :options="chartData2.options" />
            </div>
          </div>
        </div>
      </div>
      <div class="arrow" @click="onSwiperArrowClick(true)">
        <img src="../../assets/images/earn-money/arrow_right.png" />
      </div>

      <!-- <Bar ref="chartRef" :data="chartData.data" :options="chartData.options" /> -->
    </div>
  </div>

  <LoadingComponent v-if="isLoading.referredBetRebateRecord"></LoadingComponent>
  <NoInfoComponent v-else-if="isNoInfo" noInfoTitle="No Member"></NoInfoComponent>
  <div v-else class="member-info-container">
    <div class="section-wrapper">
      <div class="title">Daily Report</div>
      <div class="subtitle">{{ moment().format("YYYY-MM-DD") }}</div>
    </div>

    <div v-for="(e, i) in myMemberList" :key="`${e}-${i}`" class="member-info">
      <div class="top-container">
        <div class="id-container">
          <span class="id">{{ e.loginName }}</span>
          <img src="../../assets/images/index/icon-vip-badge.png" alt="" />
          <div class="vip-name">{{ e.vipName }}</div>
        </div>
        <!-- <div :class="`status ${e.status === 'Online' ? 'online' : 'offline'}`">{{ e.status }}</div> -->
      </div>
      <div class="bot-container">
        <div class="amount-container">
          <div class="amount-text">Bet Amount</div>
          <div class="amount">
            RS
            <span>{{ convertToCommaAmount(e.validBet, true) }}</span>
          </div>
        </div>

        <div class="amount-container">
          <div class="amount-text text-right">Income</div>
          <div class="amount text-right">
            RS
            <span>{{ convertToCommaAmount(e.rebateAmount, true) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, computed } from "vue";
import { api } from "boot/axios";
import NoInfoComponent from "../NoInfoComponent.vue";
import LoadingComponent from "../LoadingComponent.vue";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import { Bar } from "vue-chartjs";
import { userStore } from "stores/index";
import moment from "moment";
import Swiper from "swiper";
import "swiper/swiper-bundle.css";
import { convertToCommaAmount } from "src/boot/utils";

const store = userStore();

const isLoading = reactive({ referredBetRebateRecord: true });
const isNoInfo = ref(true);

const myMemberList = ref([]);
const getReferredBetRebateRecord = () => {
  isLoading.referredBetRebateRecord = true;

  api.get("/session/member/referredBetRebateRecord").then((response) => {
    myMemberList.value = response.data.records;
    if (myMemberList.value.length !== 0) isNoInfo.value = false;

    isLoading.referredBetRebateRecord = false;
  });
};

const maxProgress = store.levelUpDeposit.toFixed(2);
const progressRef = ref(store.currentDeposit.toFixed(2));
const progressValue = ref(0);

const progressValueM = ref(0);
const progressValueBA = ref(0);

progressValue.value = progressRef.value / maxProgress;

const getProgressValue = () => {
  progressValueM.value = memberVIPData.value.memberCount / memberVIPData.value.nextLevelMemberCount;
  progressValueBA.value = memberVIPData.value.totalValidBet / memberVIPData.value.nextLevelBet;
};

// const memberVIPData = reactive({
//   rate: 0,
//   memberCount: 0,
//   totalValidBet: 0
// });

const memberVIPData = ref([]);

// const limitedMembers = computed(() => {
//   // Ensure that memberVIPData.totalMembers does not exceed 5
//   return Math.min(memberVIPData.value.totalMembers, 5);
// });

const limitedMembers = ref(0);
const getLimitedMembers = () => {
  if (memberVIPData.value.totalMembers > 5) {
    limitedMembers.value;
  } else {
    limitedMembers.value = memberVIPData.value.totalMembers;
  }
};

const getVIPApi = () => {
  isLoading.referredBetRebateRecord = true;

  api.get("/session/member/betRebateStatus").then((res) => {
    console.log("res~:", res);
    const { code, data } = res;
    if (code === 0) {
      memberVIPData.value = data;
      getLimitedMembers();
      getProgressValue();
      // memberVIPData.rate = data.rate;
      // memberVIPData.nextLevelRate = data.nextLevelRate;
      // memberVIPData.memberCount = data.memberCount;
      // memberVIPData.totalValidBet = data.totalValidBet;
    }
  });
};

let swiperNav;
const initializeSwiperNav = () => {
  swiperNav = new Swiper(".swiper-nav-container", {
    slidesPerView: 1,
    initialSlide: 0,
    centeredSlides: true,
    pagination: false
  });
};

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const chartData = reactive({
  data: {
    labels: [],
    datasets: [
      {
        label: "Member",
        data: [],
        backgroundColor: [],
        borderRadius: []
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        ticks: {
          color: "#C4C4C4"
        }
      },
      y: {
        ticks: {
          color: "#fff",
          callback: function (value, index) {
            return index % 2 ? value : "";
          }
        }
      }
    }
  }
});
const chartData2 = reactive({
  data: {
    labels: [],
    datasets: [
      {
        label: "Bet Amount",
        data: [],
        backgroundColor: [],
        borderRadius: []
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        ticks: {
          color: "#C4C4C4"
        }
      },
      y: {
        ticks: {
          color: "#fff",
          callback: function (value, index) {
            return index % 2 ? value : "";
          }
        }
      }
    }
  }
});
const chartRef = ref();
const chartRef2 = ref();

const onSwiperArrowClick = (isRight) => {
  if (isRight) swiperNav.slideNext();
  else swiperNav.slidePrev();
};

const totalBetRabteDailyDetailsData = reactive({
  recordTime: "",
  validBet: 0,
  rebateAmount: 0,
  memberCount: 0
});
const getChartAPI = () => {
  const startDate = moment().subtract(6, "d").format("YYYY-MM-DD");
  const endDate = moment().format("YYYY-MM-DD");

  api.get(`/session/member/betRebateDailyDetails?start=${startDate}&end=${endDate}`).then((res) => {
    const { code, data } = res;
    if (code === 0) {
      data.forEach((e, i) => {
        totalBetRabteDailyDetailsData.validBet += e.validBet;
        totalBetRabteDailyDetailsData.rebateAmount += e.rebateAmount;
        totalBetRabteDailyDetailsData.memberCount += e.memberCount;

        // chartRef.value.chart.data.datasets[0].data[i] = e.validBet;

        chartData.data.datasets[0].data[i] = e.memberCount;
        chartData.data.datasets[0].borderRadius[i] = 6;
        chartData.data.labels[i] = moment(e.recordTime).format("DD MMM");

        chartData2.data.datasets[0].data[i] = e.validBet;
        chartData2.data.datasets[0].borderRadius[i] = 6;
        chartData2.data.labels[i] = moment(e.recordTime).format("DD MMM");
      });

      const maxChart = Math.max(...chartData.data.datasets[0].data);
      chartData.data.datasets[0].data.forEach((e, i) => {
        if (e === maxChart) chartData.data.datasets[0].backgroundColor[i] = "#00D1FF";
        else chartData.data.datasets[0].backgroundColor[i] = "#574BA0";
      });

      const maxChart2 = Math.max(...chartData2.data.datasets[0].data);
      chartData2.data.datasets[0].data.forEach((e, i) => {
        if (e === maxChart2) chartData2.data.datasets[0].backgroundColor[i] = "#FFB100";
        else chartData2.data.datasets[0].backgroundColor[i] = "#574BA0";
      });

      chartRef.value.chart.update();
      chartRef.value.chart.render();

      chartRef2.value.chart.update();
      chartRef2.value.chart.render();
    }
  });
};

onMounted(() => {
  initializeSwiperNav();

  getReferredBetRebateRecord();

  getVIPApi();
  getChartAPI();
});
</script>

<style scoped lang="scss">
.section-wrapper {
  margin: 0 0 10px 0;

  .title-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
  }
  .title {
    color: #fff;
    font-size: 18px;
    font-weight: 700;
  }

  .team-member-container {
    background: rgba(217, 217, 217, 0.2);
    padding: 6px 8px;
    border-radius: 4px;
    position: relative;
    display: flex;
    align-items: center;

    .member-imgs {
      height: 30px;
      width: 60px;
      display: block;
      position: relative;
      margin-left: -15px;
    }

    .member-amt {
    }

    .overlapping {
      border: 2px solid #9105e8;
      position: absolute;
    }
  }

  .subtitle-wrapper {
    display: flex;
    gap: 20px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9375rem;
    font-weight: 500;

    .subtitle {
      font-size: 12px;
      font-weight: 500;
    }

    .chart-cat {
      display: flex;
      align-items: center;
      gap: 5px;

      .square {
        width: 10px;
        height: 10px;

        &.m {
          background: #ec77ff;
        }

        &.ba {
          background: #ffa800;
        }
      }
    }
  }
}

.content-wrapper {
  border-radius: 0.75rem;
  background: #6759c0;
  padding: 15px;
  margin: 0 0 15px 0;

  // top section
  .progress-bar-wrapper {
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: center;
    margin: 0 0 15px 0;

    .progress-bar-M {
      border-radius: 0.25rem;

      :deep(.q-linear-progress__track) {
        background: #2b374a;
        opacity: 1;
      }

      :deep(.q-linear-progress__model) {
        background: #ec77ff;
      }
    }

    .progress-bar-BA {
      border-radius: 0.25rem;

      :deep(.q-linear-progress__track) {
        background: #2b374a;
        opacity: 1;
      }

      :deep(.q-linear-progress__model) {
        background: #ffa800;
      }
    }
  }

  .percentage-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .rate-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .achieve-wrapper {
    display: flex;
    align-items: center;
    margin: 10px 0 0 0;

    .achieve {
      background: #35c212;
      border-radius: 50%;
      width: 25px;
      height: 25px;
      text-align: center;
      line-height: 25px;
    }

    .line {
      width: 100%;
      height: 2px;
      background: rgba(255, 255, 255, 0.2);
    }

    .not-achieve {
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        width: 25px;
        height: 25px;
      }
    }
  }

  // bot section
  .top-container {
    display: flex;
    justify-content: space-between;

    .left-container,
    .right-container {
      .title {
        font-size: 12px;
        font-weight: 700;
      }
      .value {
        color: #ffb100;
        font-size: 1.25rem;
        font-weight: 700;
      }

      .data-wrapper {
        display: flex;
        gap: 5px;
        align-items: center;

        &.right {
          justify-content: flex-end;
        }

        .img-wrapper {
          border-radius: 6.25rem;
          background: rgba(255, 255, 255, 0.4);
          width: 25px;
          height: 25px;
          text-align: center;
          line-height: 25px;
        }

        .data-txt {
          color: #fff;
          font-size: 0.75rem;
          font-weight: 400;
        }

        .data-amount {
          color: #ffb100;
          font-size: 0.875rem;
          font-weight: 700;
        }
      }
    }
  }

  .chart {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 30px 0 0 0;

    .swiper-nav-container {
      text-align: center;
      overflow: hidden;

      .slide-item {
        width: 95%;
        margin: 0 auto;
      }
    }

    .arrow {
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.8);
      color: #5c46e7;
      text-align: center;
      width: 60px;
      height: 30px;
      margin: 0 0 50px 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.member-info-container {
  &::-webkit-scrollbar {
    display: none;
  }

  .member-info {
    border-radius: 1.25rem;
    padding: 1.25rem;
    margin: 0 0 1rem 0;
    background: linear-gradient(180deg, rgba(139, 54, 248, 0.4) 0%, rgba(51, 74, 214, 0.4) 100%);

    .top-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 0 1.5rem 0;

      .id-container {
        display: flex;
        align-items: center;

        .id {
          color: #fff;
          font-family: Helvetica;
          font-size: 1.5rem;
          font-style: normal;
          font-weight: 700;
          margin: 0 1rem 0 0;
        }

        .vip-name {
          border-radius: 0rem 0.125rem 0.3125rem 0rem;
          border: 0.5px solid rgba(255, 255, 255, 0.55);
          background: linear-gradient(94deg, #ffd84d 11.24%, #d97d00 91.82%);
          position: relative;
          right: 1rem;
          width: 3.25rem;
          text-align: right;
          padding: 0 0.5rem 0 0;
          font-size: 0.75rem;
          font-weight: 700;
        }

        img {
          width: 3rem;
          z-index: 1;
        }
      }

      .status {
        width: 5rem;
        text-align: center;
        border-radius: 12.5rem;
        background: rgba(250, 229, 118, 0.2);
        font-family: Helvetica;
        font-size: 1rem;
        font-style: normal;
        font-weight: 700;

        &.online {
          color: rgba(250, 229, 118, 1);
        }

        &.offline {
          color: rgba(255, 255, 255, 0.5);
        }
      }
    }

    .bot-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2.5rem 0 0;

      .amount-container {
        .amount-text {
          color: rgba(255, 255, 255, 0.5);
          font-family: Helvetica;
          font-size: 1rem;
          font-style: normal;
          font-weight: 700;
        }

        .amount {
          font-size: 1rem;

          span {
            background: linear-gradient(180deg, #fff0a0 17.41%, #fff8d4 17.41%, #ffdc26 67.56%);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-family: Helvetica;
            font-style: normal;
            font-weight: 700;
          }
        }
      }
    }
  }
}

.linear-indicator {
  display: block;
  position: absolute;
  color: #ffffff;
  font-size: 0.775rem;

  &.linear-start {
    padding-left: 16px;
    left: 0;
    &:before {
      content: "";
      width: 8px;
      height: 8px;
      background: #ffffff;
      border-radius: 50%;
      position: absolute;

      left: 3px;
      top: 4px;
    }
  }

  &.linear-end {
    right: 0;
    padding-right: 16px;

    &:before {
      content: "";
      width: 8px;
      height: 8px;
      background: #ffffff;
      border-radius: 50%;
      position: absolute;

      right: 3px;
      top: 4px;
    }
  }
}
</style>
