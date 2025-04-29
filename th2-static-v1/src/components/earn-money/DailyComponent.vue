<template>
  <div class="section-wrapper">
    <div class="team-member-wrapper">
      <div class="team-member-container" v-if="memberVIPData.totalMembers > 0">
        <div class="member-imgs" :style="`width: ${40 + limitedMembers * 15}px`">
          <q-avatar v-for="n in limitedMembers" :key="n" size="30px" class="overlapping" :style="`left: ${n * 15}px`">
            <img :src="getRandomImageSource(n)" />
          </q-avatar>
        </div>
        <div class="member-amt">{{ memberVIPData.totalMembers }}</div>
      </div>
    </div>

    <div class="title-wrapper">
      <div class="title-txt">{{ $t("earnMoney.daily.myTeamYesterday") }}</div>
      <div class="subtitle-wrapper">
        <div class="chart-cat">
          <div class="square m"></div>
          <div>{{ $t("earnMoney.daily.member") }}</div>
        </div>
        <div class="chart-cat">
          <div class="square ba"></div>
          <div>{{ $t("earnMoney.daily.betAmount") }}</div>
        </div>
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
        <div class="rate">{{ $t("earnMoney.daily.rate") }}</div>
        <div class="rate">{{ $t("earnMoney.daily.rate") }}</div>
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

  <div class="info-wrapper q-pt-lg">
    <div class="title-txt">{{ $t("earnMoney.daily.yesterdayReportTotal") }}</div>
    <div class="info-container">
      <div class="info-row">
        <div class="info-content-item longer-item">
          <div class="longer-group">
            <div
              class="info-title"
              :class="checkTeamAmountData(teamAmountData.agentLevel) === 'Calculating' ? 'f-wrap' : ''"
            >
              <div class="info-icon"><img src="../../assets/images/earn-money/icon-my-team-06.png" /></div>
              <div class="info-txt">{{ $t("earnMoney.daily.level") }}:</div>
              <div
                class="info-amount"
                :class="checkTeamAmountData(teamAmountData.agentLevel) === 'Calculating' ? 'font-smaller' : ''"
              >
                {{ checkTeamAmountData(teamAmountData.agentLevel) }}
              </div>
            </div>
          </div>

          <div class="longer-group">
            <div
              class="info-title"
              :class="checkTeamAmountData(teamAmountData.agentRate) === 'Calculating' ? 'f-wrap' : ''"
            >
              <div class="info-icon"><img src="../../assets/images/earn-money/icon-my-team-01.png" /></div>
              <div class="info-txt">{{ $t("earnMoney.daily.rate") }}:</div>
              <div
                class="info-amount"
                :class="checkTeamAmountData(teamAmountData.agentRate) === 'Calculating' ? 'font-smaller' : ''"
              >
                {{ checkTeamAmountData(teamAmountData.agentRate) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="info-row">
        <div class="info-content-item line-side">
          <div class="info-title">
            <div class="info-icon"><img src="../../assets/images/earn-money/icon-my-team-07.png" /></div>
            <div class="info-txt">{{ $t("earnMoney.daily.myselfBettingAmount") }}:</div>
          </div>
          <div class="info-amount">
            {{ store.currency.value }}
            {{ convertToCommaAmount(checkTeamAmountData(teamAmountData.myselfBetting), false) }}
          </div>
        </div>

        <div class="info-content-item">
          <div class="info-title">
            <div class="info-icon"><img src="../../assets/images/earn-money/icon-my-team-02.png" /></div>
            <div class="info-txt">{{ $t("earnMoney.daily.myselfRebate") }}:</div>
          </div>
          <div
            class="info-amount"
            :class="checkTeamAmountData(teamAmountData.myselfRebate) === 'Calculating' ? 'font-smaller' : ''"
          >
            <span>{{ store.currency.value }}&nbsp;</span>
            {{ convertToCommaAmount(checkTeamAmountData(teamAmountData.myselfRebate), false) }}
          </div>
        </div>
      </div>

      <div class="info-row">
        <div class="info-content-item line-side">
          <div class="info-title">
            <div class="info-icon"><img src="../../assets/images/earn-money/icon-my-team-03.png" /></div>
            <div class="info-txt">{{ $t("earnMoney.daily.teamBettingamount") }}:</div>
          </div>
          <div class="info-amount">
            {{ store.currency.value }}
            {{ convertToCommaAmount(checkTeamAmountData(teamAmountData.teamBetting), false) }}
          </div>
        </div>

        <div class="info-content-item">
          <div class="info-title">
            <div class="info-icon"><img src="../../assets/images/earn-money/icon-my-team-04.png" /></div>
            <div class="info-txt">{{ $t("earnMoney.daily.teamRebate") }}:</div>
          </div>
          <div
            class="info-amount"
            :class="checkTeamAmountData(teamAmountData.teamRebate) === 'Calculating' ? 'font-smaller' : ''"
          >
            <span>{{ store.currency.value }}&nbsp;</span>
            {{ convertToCommaAmount(checkTeamAmountData(teamAmountData.teamRebate), false) }}
          </div>
        </div>
      </div>

      <div class="info-row">
        <div class="info-content-item last-item">
          <div class="info-title">
            <div class="info-icon"><img src="../../assets/images/earn-money/icon-my-team-05.png" /></div>
            <div class="info-txt">{{ $t("earnMoney.daily.totalRebate") }}:</div>
            <div
              class="info-amount"
              :class="checkTeamAmountData(teamAmountData.totalRebate) === 'Calculating' ? 'font-smaller' : ''"
            >
              <span>{{ store.currency.value }}&nbsp;</span>
              {{ convertToCommaAmount(checkTeamAmountData(teamAmountData.totalRebate), false) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <LoadingComponent v-if="isLoading.referredBetRebateRecord"></LoadingComponent>
  <NoInfoComponent v-else-if="isNoInfo" :noInfoTitle="$t('records.noMember')" shortenContainer="true"></NoInfoComponent>
  <div v-else class="member-info-container">
    <div class="section-wrapper q-pt-lg">
      <div class="title-txt">{{ $t("earnMoney.daily.teamDetailsYesterday") }}</div>
      <div class="subtitle">{{ moment().utcOffset("+05:30").format("YYYY-MM-DD") }}</div>
    </div>

    <div v-for="(e, i) in myMemberList" :key="`${e}-${i}`" class="member-info">
      <div class="top-container">
        <div class="id-container">
          <span class="id">{{ e.loginName }}</span>
          <img src="../../assets/images/index/icon-vip-badge.png" alt="" />
          <div class="vip-name">
            <template v-if="e.rebateLevel == -1">...</template>
            <template v-else>{{ e.rebateLevel }}</template>
          </div>
        </div>
        <div class="status online">
          {{ $t("earnMoney.daily.betAmount") }}: {{ e.memberCount > 0 ? e.memberCount : "..." }}
        </div>
      </div>
      <div class="bot-container">
        <div class="amount-container">
          <div class="amount-text">{{ $t("earnMoney.daily.betAmount") }}</div>
          <div class="amount">
            {{ store.currency.label }}
            <span>{{ convertToCommaAmount(e.validBet, false) }}</span>
          </div>
        </div>

        <div class="amount-container">
          <div class="amount-text text-right">{{ $t("earnMoney.daily.income") }}</div>
          <div class="amount text-right">
            {{ store.currency.label }}
            <span>{{ convertToCommaAmount(e.rebateAmount, false) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";

import { api } from "@/boot/axios";
import { convertToCommaAmount } from "@/boot/utils";
import LoadingComponent from "@/components/LoadingComponent.vue";
import NoInfoComponent from "@/components/NoInfoComponent.vue";
import { userStore } from "@/stores/index";
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";
import moment from "moment";
import Swiper from "swiper";
import "swiper/swiper-bundle.css";

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
  progressValueM.value = memberVIPData.memberCount / memberVIPData.nextLevelMemberCount;
  progressValueBA.value = memberVIPData.totalValidBet / memberVIPData.nextLevelBet;
};

const getRandomImageSource = (index) => {
  const randomNumber = Math.floor(Math.random() * 5) + 1;
  return require(`../../assets/images/earn-money/profile-img-${randomNumber}.png`);
};

const memberVIPData = reactive({
  rate: 0,
  currentLevelMemberCount: 0,
  currentLevelBet: 0,
  nextLevelRate: 0,
  nextLevelMemberCount: 0,
  nextLevelBet: 0,
  memberCount: 0,
  totalValidBet: 0,
  totalMembers: 0
});

const limitedMembers = ref(0);
const getLimitedMembers = () => {
  if (memberVIPData.totalMembers > 5) {
    limitedMembers.value = 5;
  } else {
    limitedMembers.value = memberVIPData.totalMembers;
  }
};

const getVIPApi = () => {
  isLoading.referredBetRebateRecord = true;

  api.get("/session/member/betRebateStatus").then((res) => {
    const { code, data } = res;
    if (code === 0) {
      memberVIPData.rate = data.rate;
      memberVIPData.currentLevelMemberCount = data.currentLevelMemberCount;
      memberVIPData.currentLevelBet = data.currentLevelBet;
      memberVIPData.nextLevelRate = data.nextLevelRate;
      memberVIPData.nextLevelMemberCount = data.nextLevelMemberCount;
      memberVIPData.nextLevelBet = data.nextLevelBet;
      memberVIPData.memberCount = data.memberCount;
      memberVIPData.totalValidBet = data.totalValidBet;
      memberVIPData.totalMembers = data.totalMembers;
      getLimitedMembers();
      getProgressValue();
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

const teamAmountData = reactive({
  myselfBetting: 0,
  myselfRebate: 0,
  teamBetting: 0,
  teamRebate: 0,
  totalRebate: 0,
  agentLevel: 0,
  agentRate: 0
});

const getTeamAmountData = () => {
  api.get(`/session/member/betRebateDailyDetails`).then((res) => {
    const { code, data } = res;
    if (code === 0) {
      teamAmountData.myselfBetting = data.selfValidBet;
      teamAmountData.myselfRebate = data.selfRebate;
      teamAmountData.teamBetting = data.teamValidBet;
      teamAmountData.teamRebate = data.teamRebate;
      teamAmountData.totalRebate = data.totalRebate;
      teamAmountData.agentLevel = data.level;
      teamAmountData.agentRate = data.rate;
    }
  });
};

const checkTeamAmountData = (value) => {
  return value === -1 ? "Calculating" : value;
};

onMounted(() => {
  initializeSwiperNav();
  getReferredBetRebateRecord();
  getVIPApi();
  getTeamAmountData();
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
    flex-wrap: wrap;
  }
  .title {
    color: #fff;
    font-size: 18px;
    font-weight: 700;
  }

  .subtitle {
    font-size: 12px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.6);
    padding-top: 12px;
  }

  .subtitle-wrapper {
    display: flex;
    gap: 20px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9375rem;
    font-weight: 500;
    margin-left: auto;

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

.team-member-wrapper {
  display: flex;
  justify-content: flex-end;
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
      box-sizing: content-box;
    }
  }
}

.info-wrapper {
  .info-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 12px;
    .info-row {
      display: flex;
      gap: 15px;
      background: linear-gradient(180deg, rgba(139, 54, 248, 0.4) 0%, rgba(51, 74, 214, 0.4) 100%);
      border-radius: 12px;
    }

    .info-content-item {
      width: 100%;

      padding: 20px 12px;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      position: relative;

      &.line-side:before {
        content: "";
        position: absolute;
        width: 1px;
        height: calc(100% - 20px);
        background: rgba(255, 255, 255, 0.25);
        right: -10px;
        top: 10px;
      }
      &.longer-item {
        flex-direction: row;
        // gap: 36px;

        .longer-group {
          flex: 1;
          position: relative;

          &:first-child {
            margin-right: 36px;
          }
          &:first-child:before {
            content: "";
            position: absolute;
            width: 1px;
            height: calc(100% + 20px);
            background: rgba(255, 255, 255, 0.25);
            right: -20px;
            top: -10px;
          }
        }

        .info-amount {
          padding-top: 0;
        }
      }

      &.last-item {
        padding-top: 16px;
        padding-bottom: 16px;

        .info-amount {
          padding-top: 0;
        }
      }

      .info-amount {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        font-size: 19px;
        font-weight: 700;
        margin-left: auto;
        margin-top: auto;
        padding-top: 12px;

        &.font-smaller {
          font-size: 12px;
          margin-bottom: 2px;
          font-weight: 400;

          span {
            display: none;
          }
        }
      }

      .info-title {
        display: flex;

        &.f-wrap {
          flex-wrap: wrap;
        }
      }

      .info-icon {
        img {
          display: block;
          width: 27px;
          margin-right: 8px;
        }
      }

      .info-txt {
        margin-top: 4px;
        font-weight: 700;
      }
    }
  }
}

.content-wrapper {
  border-radius: 0.75rem;
  background: #6759c0;
  padding: 15px;
  margin: 0;

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
          font-size: 1.3rem;
          font-style: normal;
          font-weight: 400;
          // margin: 0 1rem 0 0;
        }

        .vip-name {
          border-radius: 0rem 0.125rem 0.3125rem 0rem;
          border: 0.5px solid rgba(255, 255, 255, 0.55);
          background: linear-gradient(94deg, #ffd84d 11.24%, #d97d00 91.82%);
          position: relative;
          right: 1rem;
          // width: 3.25rem;
          text-align: right;
          padding: 0 0.5rem 0 0.75rem;
          font-size: 0.75rem;
          font-weight: 700;
        }

        img {
          width: 3rem;
          z-index: 1;
        }
      }

      .status {
        width: auto;
        text-align: center;
        border-radius: 12.5rem;
        background: rgba(250, 229, 118, 0.2);
        font-family: Helvetica;
        font-size: 1rem;
        font-style: normal;
        font-weight: 400;
        padding: 0.25rem 0.75rem 0.15rem;

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

.title-txt {
  color: #fff;
  font-size: 18px;
  font-weight: 700;
}
</style>
