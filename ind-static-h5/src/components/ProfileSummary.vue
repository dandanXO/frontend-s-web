<template>
  <div class="infoboard-container" :class="!homeProfile && 'q-pa-md'">
    <img src="../assets/images/earn-money/infoboard.png" v-if="!homeProfile" />
    <div class="infoboard-wrapper" :class="homeProfile && 'home-profile'">
      <div class="profile-wrapper">
        <div class="profile-pic">
          <q-avatar size="70px">
            <img src="../assets/images/account/profile-pic.png" />
          </q-avatar>
        </div>
        <div class="profile-details-container">
          <div class="profile-name">
            {{ store.realName ? store.realName : store.nickName }}
            <div class="vip-details" @click="onVipClick">
              <img src="../assets/images/index/icon-vip-badge.png" alt="" />
              <div class="vip-level">
                {{ store.vip }}
              </div>
            </div>
          </div>

          <template v-if="!homeProfile">
            <div class="profile-rating">
              <img src="../assets/images/index/profile-rating-off.png" alt="" />
              <img src="../assets/images/index/profile-rating-off.png" alt="" />
              <img src="../assets/images/index/profile-rating-off.png" alt="" />
            </div>
            <div class="profile-agency">
              <div class="profile-agency-lbl">Agency Level:</div>
              <div class="profile-agency-val">1</div>
            </div>
          </template>

          <template v-else>
            <div :class="`profile-balance ${isLoadingBalance ? 'active' : ''}`" @click="refreshBalance()">
              <span class="balance-amount">
                {{ isLoadingBalance ? "Loading..." : store.balance.toFixed(2) }}
              </span>
            </div>
          </template>
        </div>

        <div class="profile-msg btn-effect" v-if="homeProfile">
          <q-icon name="mail" size="40px" color="yellow-7" @click="router.push('/account/message')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { userStore } from "stores/index";
import { useRoute, useRouter } from "vue-router";

const props = defineProps(["homeProfile"]);
const route = useRoute();
const router = useRouter();
const store = userStore();

const isLoadingBalance = ref(false);
const refreshBalance = () => {
  if (store.token) {
    isLoadingBalance.value = true;
    store.getBalance().then((res) => {
      isLoadingBalance.value = false;
    });
  }
};

const onVipClick = () => {
  router.push({ path: "/vip", query: { redirect: route.path } });
};
</script>

<style scoped lang="scss">
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

    &.home-profile {
      position: relative;
      width: 100%;
      gap: 0;
      justify-content: space-between;
    }
  }

  .profile-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-top: 20px;
    padding-bottom: 20px;
    width: 100%;

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
          padding-top: 2px;
          padding-bottom: 4px;
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
      &:active {
        filter: brightness(0.75);
      }

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

  img {
    width: 30rem;
  }
}
</style>
