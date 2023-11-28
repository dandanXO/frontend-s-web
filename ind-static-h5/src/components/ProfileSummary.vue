<template>
  <div class="infoboard-container" :class="!homeProfile && 'q-pa-md'">
    <img src="../assets/images/earn-money/infoboard.png" v-if="!homeProfile" />
    <div class="infoboard-wrapper" :class="homeProfile && 'home-profile'">
      <div class="profile-wrapper" v-if="store.hasToken()">
        <div class="profile-pic">
          <q-avatar size="70px">
            <img :src="profileImagePath" />
          </q-avatar>
          <div class="profile-pic-frame" v-if="!homeProfile"></div>
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
          <q-chip v-if="store.unreadInboxMail" class="notification" color="red" size="xs"></q-chip>
        </div>
      </div>
      <div class="profile-wrapper-extra" v-else>
        <div class="logo-img">
          <img src="../assets/logo.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { userStore } from "stores/index";
import { useRoute, useRouter } from "vue-router";

const props = defineProps(["homeProfile"]);
const route = useRoute();
const router = useRouter();
const store = userStore();

const profileImg = [
  {
    imgPath: ["profile-pic-01", "profile-pic-02", "profile-pic-03", "profile-pic-04", "profile-pic-05"]
  }
];
const randomProfileImg = computed(() => {
  const storedImg = sessionStorage.getItem("PROFILE_IMG");
  if (storedImg) {
    return storedImg;
  } else {
    const randomProfile = profileImg[0];
    const randomIndex = Math.floor(Math.random() * randomProfile.imgPath.length);
    const imgPath = randomProfile.imgPath[randomIndex];
    sessionStorage.setItem("PROFILE_IMG", imgPath);
    return imgPath;
  }
});

const profileImagePath = computed(() => {
  return require(`../assets/images/account/${randomProfileImg.value}.png`);
});

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

onMounted(() => {
  if (!sessionStorage.getItem("PROFILE_IMG")) {
    const randomProfile = profileImg[0];
    const randomIndex = Math.floor(Math.random() * randomProfile.imgPath.length);
    const imgPath = randomProfile.imgPath[randomIndex];
    sessionStorage.setItem("PROFILE_IMG", imgPath);
  }
});
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

      .profile-pic {
        margin: 0;
      }
    }
  }

  .profile-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-top: 10px;
    padding-bottom: 10px;
    width: 100%;

    .profile-pic {
      position: relative;
      margin: 6px 6px 6px 12px;
    }
    .profile-pic-frame {
      background-image: url(../assets/images/common/profile-frame.png);
      width: 90px;
      height: 90px;
      background-size: 100%;
      position: absolute;
      top: -12px;
      left: -10px;
    }

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
      position: relative;

      .notification {
        position: absolute;
        top: -0.25rem;
        left: -0.5rem;
      }
    }
  }

  .profile-wrapper-extra {
    display: flex;
    align-items: center;
    padding-top: 8px;
    width: 100%;
  }

  .logo-img {
    width: 100%;

    margin: 0 auto;
    text-align: center;

    img {
      max-width: 100px;
      width: 100%;
      text-align: center;
    }
  }

  img {
    width: 30rem;
  }
}
</style>
