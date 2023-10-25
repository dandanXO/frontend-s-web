<template>
  <div class="infoboard-container q-pa-md">
    <img src="../../assets/images/earn-money/infoboard.png" />
    <div class="infoboard-wrapper">
      <div class="left-container">
        <div class="infoboard">
          <div>Income</div>
          <div>0</div>
        </div>
        <div class="infoboard">
          <div>Direct Income</div>
          <div>0</div>
        </div>
      </div>
      <div class="right-container">
        <img src="../../assets/images/index/more-btn.png" alt="" @click="showMoreButton()" />
      </div>
    </div>
  </div>

  <ContentView :contentTopStatus="`${isNoInfo ? '' : 'solid'}`">
    <NoInfoComponent v-if="isNoInfo" noInfoTitle="No Member"></NoInfoComponent>
    <div v-else class="member-info-container">
      <div v-for="(e, i) in myMemberList" :key="`${e}-${i}`" class="member-info">
        <div class="top-container">
          <div class="id-container">
            <span class="id">{{ e.id }}</span>
            <img src="../../assets/images/index/vip.png" alt="" />
          </div>
          <div :class="`status ${e.status === 'Online' ? 'online' : 'offline'}`">{{ e.status }}</div>
        </div>
        <div class="bot-container">
          <div class="amount-container">
            <div class="amount-text">Recharge Amount</div>
            <div class="amount">
              RS
              <span>{{ e.rechargeAmount }}</span>
            </div>
          </div>

          <div class="amount-container">
            <div class="amount-text">Income</div>
            <div class="amount">
              RS
              <span>{{ e.income }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ContentView>
</template>

<script setup>
import { ref } from "vue";
import ContentView from "../ContentView.vue";
import NoInfoComponent from "../NoInfoComponent.vue";

// [
//   { id: "Guest1321084", status: "Online", level: "vip1", rechargeAmount: 0, income: 0 },
//   { id: "Guest1321084", status: "Offline", level: "vip1", rechargeAmount: 0, income: 0 },
//   { id: "Guest1321084", status: "Online", level: "vip1", rechargeAmount: 0, income: 0 },
//   { id: "Guest1321084", status: "Offline", level: "vip1", rechargeAmount: 0, income: 0 },
//   { id: "Guest1321084", status: "Online", level: "vip1", rechargeAmount: 0, income: 0 }
// ]
const myMemberList = ref([]);

const isNoInfo = ref(false);
if (myMemberList.value.length === 0) isNoInfo.value = true;

const showMoreButton = () => {
  console.log("show more button clicked");
};
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
    gap: 1.5rem;
    width: 22rem;
    margin: 0 0 0 2rem;

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
  position: absolute;
  padding: 0 2rem;
  width: 30rem;
  height: 39.5rem;
  overflow: scroll;
  top: 14rem;

  &::-webkit-scrollbar {
    display: none;
  }

  .member-info {
    border-radius: 1.25rem;
    background: rgba(21, 0, 37, 0.2);
    padding: 1.25rem;
    margin: 1rem 0;

    .top-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 0 1.5rem 0;

      .id-container {
        width: 50%;
        display: flex;

        .id {
          color: #fff;
          font-family: Helvetica;
          font-size: 1.5rem;
          font-style: normal;
          font-weight: 700;
          margin: 0 1rem 0 0;
        }

        img {
          width: 5rem;
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
