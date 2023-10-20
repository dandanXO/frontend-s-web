<template>
  <div class="infoboard-container q-pa-md">
    <img src="../../assets/images/earn-money/infoboard.png" />
    <div class="infoboard-wrapper">
      <div class="left-container">
        <div class="infoboard">
          <div class="profile-wrapper">
            <div class="profile-pic">
              <q-avatar size="70px">
                <img src="https://cdn.quasar.dev/img/avatar.png" />
              </q-avatar>
            </div>
            <div class="profile-details-container">
              <div class="profile-name">
                Guest0238434
                <div class="vip-details" @click="router.push('/vip')">
                  <img src="../../assets/images/index/icon-vip-badge.png" alt="" />
                  <div class="vip-level">VIP1</div>
                </div>
              </div>
              <div class="profile-rating">
                <img src="../../assets/images/index/profile-rating-off.png" alt="" />
                <img src="../../assets/images/index/profile-rating-off.png" alt="" />
                <img src="../../assets/images/index/profile-rating-off.png" alt="" />
              </div>
              <div class="profile-agency">
                <div class="profile-agency-lbl">Agency Level:</div>
                <div class="profile-agency-val">1</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="bg-container">
    <ContentFrame :isNoInfo="isNoInfoRef" :noInfoTitle="`No Member`"></ContentFrame>

    <div class="member-info-container">
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
  </div>
</template>

<script setup>
import { ref } from "vue";
import ContentFrame from "../ContentFrame.vue";

// [
//   { id: "Guest1321084", status: "Online", level: "vip1", rechargeAmount: 0, income: 0 },
//   { id: "Guest1321084", status: "Offline", level: "vip1", rechargeAmount: 0, income: 0 },
//   { id: "Guest1321084", status: "Online", level: "vip1", rechargeAmount: 0, income: 0 },
//   { id: "Guest1321084", status: "Offline", level: "vip1", rechargeAmount: 0, income: 0 },
//   { id: "Guest1321084", status: "Online", level: "vip1", rechargeAmount: 0, income: 0 }
// ]
const myMemberList = ref([]);

let isNoInfoRef = ref(true);
if (myMemberList.value.length) isNoInfoRef.value = true;

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
    margin: 0 0 0 1rem;

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

.profile-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 20px;
  padding-bottom: 20px;

  .profile-details-container {
    display: flex;
    flex-direction: column;
    font-size: 18px;
  }
  .profile-name {
    display: flex;
    align-items: center;
    line-height: 1;
    gap: 10px;

    .vip-details {
      position: relative;
      margin-left: 25px;
      margin-bottom: 10px;
      img {
        display: block;
        width: 40px;
        position: absolute;
        top: -6px;
        left: -26px;
      }

      .vip-level {
        background: linear-gradient(93.61deg, #ffd84d 11.24%, #d97d00 91.82%),
          linear-gradient(217.27deg, rgba(255, 255, 255, 0.55) -9.02%, rgba(255, 255, 255, 0) 53.03%);
        border-radius: 0px 2px 5px 0px;
        width: 45px;
        height: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        line-height: 1;
        padding-bottom: 1px;
      }
    }
  }
  .profile-agency {
    display: flex;
    gap: 0.75rem;

    .profile-agency-lbl {
      color: rgba(255, 255, 255, 0.5);
    }
  }
  .profile-rating {
    display: flex;
    gap: 6px;
    img {
      display: block;
      width: 20px;
    }
  }
  .profile-balance {
    position: relative;
    background: rgba(255, 255, 255, 0.24);
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    padding-top: 3px;
    padding-bottom: 3px;
    width: 130px;
    font-size: 14px;

    &:before {
      content: "";
      position: absolute;
      top: -9px;
      left: -3px;
      background-image: url(../../assets/images/index/icon-balance.png);
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 40px 40px;
      display: block;
      width: 40px;
      height: 40px;
    }

    .balance-amount {
      margin-left: 15px;
    }
  }
  .profile-msg {
    margin-left: auto;
    margin-top: 30px;
  }
}
</style>
