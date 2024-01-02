<template>
  <div style="height: 80px"></div>
  <div class="infoboard-container" :class="!homeProfile && 'q-pa-md'">
    <img src="../assets/images/earn-money/infoboard.png" v-if="!homeProfile" />
    <div class="infoboard-wrapper" :class="homeProfile && 'home-profile'">
      <div class="profile-wrapper-extra">
        <div class="logo-img">
          <img src="../assets/logo.png" />
        </div>
      </div>
      <div class="profile-wrapper" v-if="store.hasToken()">
        <div class="profile-details-container">
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
            <div class="flex-c-start">
              <div :class="`profile-balance ${isLoadingBalance ? 'active' : ''}`" @click="refreshBalance()">
                <span class="balance-amount">
                  <span style="font-family: 'Times New Roman', Times, serif">{{ store.currency.value }}</span>
                  {{ isLoadingBalance ? "Loading..." : store.balance.toFixed(2) }}
                </span>

                <div @click="refreshBalance()" class="btn-refresh">
                  <q-icon name="sync" size="16px" color="white-7"></q-icon>
                </div>
              </div>
            </div>
          </template>
        </div>

        <div>
          <q-btn square class="style-blue-btn" icon="add" dense @click="router.push('/deposit')" />
        </div>
        <!-- <div class="profile-msg btn-effect" v-if="homeProfile">
          <q-icon name="mail" size="40px" color="yellow-7" @click="router.push('/account/message')" />
          <q-chip v-if="store.unreadInboxMail" class="notification" color="red" size="xs"></q-chip>
        </div> -->
        <q-btn-dropdown no-caps :ripple="false">
          <template v-slot:label>
            <div class="profile-pic">
              <q-avatar size="50px">
                <img :src="profileImagePath" />
              </q-avatar>
              <div class="profile-pic-frame" v-if="!homeProfile"></div>

              <div class="vip-details">
                <img src="../assets/images/index/vip-row.png" alt="" />
                <div class="vip-level">
                  {{ store.vip }}
                </div>
              </div>
            </div>
          </template>

          <q-list style="background: #303954" dense>
            <q-item clickable v-close-popup @click="onVipClick">
              <q-item-section avatar>
                <q-avatar icon="diamond" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>VIP</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="router.push('/account/message')">
              <q-item-section avatar>
                <q-avatar icon="mail" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Message</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="router.push('/account/order')">
              <q-item-section avatar>
                <q-avatar icon="receipt" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Order</q-item-label>
              </q-item-section>
            </q-item>

            <hr />

            <q-item clickable v-close-popup @click="router.push('/account/bank')">
              <q-item-section avatar>
                <q-avatar icon="account_balance" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Bank</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="onLogout()">
              <q-item-section avatar>
                <q-avatar icon="logout" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Log out</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
      <div class="profile-wrapper" v-else>
        <q-btn class="btn-style-purple" no-caps @click="router.push('/register')">Register</q-btn>
        <q-btn no-caps @click="router.push('/login')">Login</q-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from "vue";
import { useQuasar, Platform } from "quasar";
import { userStore } from "stores/index";
import { useRoute, useRouter } from "vue-router";

const props = defineProps(["homeProfile"]);
const route = useRoute();
const router = useRouter();
const store = userStore();

const profileImg = [
  {
    imgPath: ["profile-pic"]
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

const onLogout = () => {
  store.memberLogout().then(() => {
    // location.reload();
    router.push("/home");
  });
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
  background: linear-gradient(180deg, #2d0f54 0%, #101114 100%);
  box-shadow: 0px -3px 7px 0px rgba(0, 0, 0, 0.1);
  overflow-x: hidden;

  position: fixed;
  top: 0;
  width: 100%;
  max-width: 500px;
  z-index: 999;

  .infoboard-wrapper {
    position: absolute;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1.5rem;
    // width: 22rem;
    width: 100%;
    margin: 0;

    &.home-profile {
      position: relative;
      width: 100%;
      gap: 0;
      justify-content: space-between;
      padding: 0 12px;
      overflow-y: hidden;

      .profile-pic {
        margin-top: -20px;
        margin-right: 20px;
      }
    }
  }

  .profile-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    width: 100%;

    .profile-pic {
      position: relative;
      margin: 6px 6px 6px 12px;
    }
    .profile-pic-frame {
      background-image: url(../assets/images/common/profile-frame.png);
      width: 70px;
      height: 70px;
      background-size: 100%;
      position: absolute;
      top: -8px;
      left: -4px;
    }

    .profile-details-container {
      display: flex;
      flex-direction: column;
      font-size: 16px;
    }
    .profile-name {
      display: flex;
      align-items: center;
      line-height: 1;
      gap: 10px;
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
      // background: rgba(255, 255, 255, 0.24);
      background: rgba(103, 38, 154, 0.9);
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      // margin-bottom: 10px;
      padding-top: 2px;
      padding-bottom: 2px;
      width: 130px;

      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
      font-weight: bold;
      &:active {
        filter: brightness(0.75);
      }

      .balance-amount {
        padding-right: 18px;
      }
    }
    .profile-msg {
      margin-left: auto;
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
    padding-top: 16px;
    width: 100%;
  }

  .logo-img {
    width: 100%;
    margin: 0 auto;

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

.vip-details {
  position: relative;
  margin-left: 20px;
  margin-bottom: 5px;
  margin-top: -10px;
  img {
    display: block;
    width: 100px;
    position: absolute;
    top: -17px;
    left: -45px;
  }

  .vip-level {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    line-height: 1.1;
    padding-top: 2px;
    padding-bottom: 4px;
    z-index: 3;
    color: #334ad6;
    font-weight: bold;
  }
}

.vip-chevron {
  position: absolute;
  top: 25px;
  right: -25px;
}

.btn-refresh {
  position: absolute;
  top: 0;
  right: 10px;
}

.style-blue-btn {
  background: linear-gradient(180deg, #8b36f8 0%, #334ad6 100%);
  border-radius: 5px;
}
</style>

<style lang="scss">
.q-btn-dropdown--simple * + .q-btn-dropdown__arrow {
  margin-left: -12px !important;
}

.q-btn-dropdown--simple {
  width: 80px !important;
}
</style>
