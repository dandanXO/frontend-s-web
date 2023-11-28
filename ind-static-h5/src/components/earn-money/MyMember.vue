<template>
  <div class="infoboard-container q-pa-md">
    <img src="../../assets/images/earn-money/infoboard.png" />

    <div class="infoboard-wrapper">
      <LoadingComponent v-if="isLoading.betRebateSummary"></LoadingComponent>
      <template v-else>
        <div class="left-container">
          <div class="infoboard">
            <div>Income</div>
            <div>{{ rebateSummary.rebateAmount }}</div>
          </div>
          <div class="infoboard">
            <div>Direct Member</div>
            <div>{{ rebateSummary.memberCount }}</div>
          </div>
        </div>
        <div class="right-container">
          <!-- <img src="../../assets/images/index/more-btn.png" alt="" @click="showMoreButton()" /> -->
        </div>
      </template>
    </div>
  </div>

  <ContentView :contentTopStatus="`${isNoInfo ? '' : 'solid'}`">
    <LoadingComponent v-if="isLoading.referredBetRebateRecord"></LoadingComponent>
    <NoInfoComponent v-else-if="isNoInfo" noInfoTitle="No Member"></NoInfoComponent>
    <div v-else class="member-info-container">
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
            <div class="amount-text">Recharge Amount</div>
            <div class="amount">
              RS
              <span>{{ e.rebateAmount }}</span>
            </div>
          </div>

          <div class="amount-container">
            <div class="amount-text">Income</div>
            <div class="amount">
              RS
              <span>{{ e.validBet }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ContentView>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import { api } from "boot/axios";
import ContentView from "../ContentView.vue";
import NoInfoComponent from "../NoInfoComponent.vue";
import LoadingComponent from "../LoadingComponent.vue";

const showMoreButton = () => {
  console.log("show more button clicked");
};

const getBetRebateRecord = () => {
  api.get("/session/member/betRebateRecord").then((response) => {
    const a = response;
    console.log("rebate record" + a);
  });
};

const isLoading = reactive({ betRebateSummary: true, referredBetRebateRecord: true });
const isNoInfo = ref(true);

let rebateSummary = reactive({
  rebateAmount: 0,
  memberCount: 0
});
const getBetRebateSummary = () => {
  isLoading.betRebateSummary = true;

  api.get("/session/member/betRebateSummary").then((response) => {
    rebateSummary = response.data;

    isLoading.betRebateSummary = false;
  });
};

const myMemberList = ref([]);
const getReferredBetRebateRecord = () => {
  isLoading.referredBetRebateRecord = true;

  api.get("/session/member/referredBetRebateRecord").then((response) => {
    myMemberList.value = response.data.records;
    if (myMemberList.value.length !== 0) isNoInfo.value = false;

    isLoading.referredBetRebateRecord = false;
  });
};

onMounted(() => {
  //   getBetRebateRecord();
  getBetRebateSummary();
  getReferredBetRebateRecord();
});
</script>

<style lang="scss">
.infoboard-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .infoboard-wrapper {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22rem;
    padding: 0 1rem;

    .left-container {
      width: 100%;

      .infoboard {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #fff;
        margin: 1rem 0;

        font-family: Helvetica;
        font-size: 1rem;
        font-style: normal;
        font-weight: 700;
        text-transform: capitalize;
      }
    }

    .right-container {
      img {
        width: 1.75rem;
      }
    }
  }

  img {
    width: 30rem;
  }
}

.member-info-container {
  &::-webkit-scrollbar {
    display: none;
  }

  .member-info {
    border-radius: 1.25rem;
    background: rgba(21, 0, 37, 0.2);
    padding: 1.25rem;
    margin: 0 0 1rem 0;

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
          text-align: center;
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
</style>
