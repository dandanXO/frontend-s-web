<template>
  <div class="infoboard-container q-pa-md">
    <img src="../assets/images/earn-money/infoboard.png" />
    <div class="infoboard-wrapper">
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
              <img src="../assets/images/index/icon-vip-badge.png" alt="" />
              <div class="vip-level">VIP1</div>
            </div>
          </div>
          <div class="profile-rating">
            <img src="../assets/images/index/profile-rating-off.png" alt="" />
            <img src="../assets/images/index/profile-rating-off.png" alt="" />
            <img src="../assets/images/index/profile-rating-off.png" alt="" />
          </div>
          <div class="profile-agency">
            <div class="profile-agency-lbl">Agency Level:</div>
            <div class="profile-agency-val">1</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <SwiperNav :slideList="slideList" :onSlideClick="onSlideClick" :isActiveSlide="isActiveSlide"></SwiperNav>

  <div class="bg-container">
    <ContentFrame></ContentFrame>

    <!-- <div class="bank-card-add">qweasd</div> -->
  </div>
</template>

<script setup>
import { ref } from "vue";
import SwiperNav from "../components/SwiperNav.vue";
import { useRouter } from "vue-router";
import ContentFrame from "../components/ContentFrame.vue";
import AgencyPolicy from "../components/earn-money/AgencyPolicy.vue";

let slideList = ref(["Personal Center", "Discount", "Record", "Order", "Bank", "Message"]);
let slideListPath = ref([
  "/account",
  "/account/discount",
  "/account/record",
  "/account/order",
  "/account/bank",
  "/account/message"
]);
let currentSlide = ref(slideList.value[0]);

const isActiveSlide = (e) => {
  if (e === currentSlide.value) return true;
  return false;
};
const router = useRouter();

const onSlideClick = (e, i) => {
  if (e === currentSlide.value) return;

  // console.log(i);
  // console.log(slideListPath.value[i]);
  router.push(slideListPath.value[i]);

  //   for (let i = 0, l = tabList.value.length; i < l; i++) {
  //     const _currentTab = tabList.value[i];
  //     if (_currentTab === e) {
  //       tabList.value.splice(i, 1);
  //       tabList.value.unshift(e);
  //     }
  //   }

  currentSlide.value = e;
};

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

<style lang="scss" scoped>
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
    margin: 0;

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
      background-image: url(../assets/images/index/icon-balance.png);
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

.bank-card-add {
  position: absolute;
  padding: 0 2rem;
  height: 37rem;
  overflow: auto;
  top: 15rem;

  .card-overall {

  }
}
</style>
