<template>
  <div class="bonus-container" :class="{ 'has-top-download': hasTopDownload }">
    <q-btn icon="close" round dense flat v-close-popup class="bonus-close" />
    <div class="bonus-content-wrapper">
      <div v-if="hasRedemptionBonus" class="mission-item">
        <img class="mission-icon" src="../../assets/images/earn-money/redemptionicon.png" />
        <div class="mission-title-wrapper">
          <div class="mission-title">
            <span>Redemption Code</span>
          </div>
        </div>
        <RouterLink to="/account?openCodeModal=true">
          <q-btn flat class="details">{{ $t("btn.details") }}</q-btn>
        </RouterLink>
      </div>
      <div v-for="(mission, index) in promoList" :key="index" class="mission-item">
        <img class="mission-icon" :src="imgURL + mission.mobileFastAccessIconImgUrl" />
        <div class="mission-title-wrapper">
          <div class="mission-title">
            <span>{{ mission.title }}</span>
            <!-- <div v-if="mission.name === 'wheel-reward'" class="mission-title-extra">$15 12d 14:42:44</div> -->
          </div>
          <!-- <q-icon name="help_outline">
            <q-tooltip>
              {{ mission.description }}
            </q-tooltip>
          </q-icon> -->
        </div>
        <!-- <RouterLink :to="{ path: '/promo', query: { name: mission.redirectUrl } }">
          <q-btn :loading="!isLoaded"  class="details" flat>
            {{ mission.buttonMode === "API_CLAIM" ? $t("btn.claim") : $t("btn.details") }}
            <span class="countdown-span" v-if="mission.countDown === true && mission.response?.eligible === true">
              {{ mission.getCountDownStr }}
            </span>
          </q-btn>
        </RouterLink> -->
        <q-btn
          :loading="mission.buttonMode === 'API_CLAIM' ? isClaimLoading : false"
          class="details"
          :class="{
            'no-reward': mission.buttonMode === 'DETAILS'
          }"
          flat
          @click="handleClick(mission)"
        >
          {{ promoCountdown[mission.promoCode].btnText }}
          <span class="countdown-span" v-if="mission.countDown === true && mission.response?.eligible === true">
            {{ promoCountdown[mission.promoCode].countDown }}
          </span>
        </q-btn>
      </div>

      <div v-if="!store.hasDeposit" class="mission-item">
        <img class="mission-icon" src="../../assets/images/earn-money/newplayericon.png" />
        <div class="mission-title-wrapper">
          <div class="mission-title">
            <span>New Player Guide</span>
          </div>
        </div>
        <a @click="openNewPlayerGuide">
          <q-btn :loading="!isLoaded" flat class="details">
            {{ $t("btn.details") }}
          </q-btn>
        </a>
      </div>
    </div>
    <div class="bonus-header">
      <img :src="require(`../../assets/images/index/modal/bonus-header-${$t('lang.langVal')}.png`)" />
    </div>
  </div>
</template>

<script setup>
import { api, eventapi } from "boot/axios";
import { userStore } from "stores/index";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const $q = useQuasar();
const emit = defineEmits(["open-new-player"]);
const store = userStore();
const router = useRouter();
const props = defineProps({
  hasRedemptionBonus: Boolean,
  hasTopDownload: Boolean,
  promoList: Array
});
const handleClick = async (mission) => {
  if (mission.buttonMode === "API_CLAIM") {
    await claimApi(mission.claimApiUrl, mission.promoCode);
  } else {
    router.push({ path: "/promo", query: { name: mission.redirectUrl } });
  }
};
async function claimApi(apiUrl, promoCode) {
  if (!apiUrl) {
    console.warn("Missing claimApiUrl");
    return;
  }

  try {
    isClaimLoading.value = true;
    console.log("Calling claim API:", apiUrl);

    const res = await eventapi.post(`${apiUrl}?promoCode=${promoCode}`);

    if (res.code === 0) {
      $q.notify({
        type: "positive",
        position: "top",
        message: t("notify.claimedSuccessfully"),
        icon: "check_circle_outline"
      });
    } else {
    }
  } catch (err) {
    console.error("Claim API error:", err);
  } finally {
    isClaimLoading.value = false;
  }
}

const isInit = ref(false);
const isLoaded = ref(false);
const isClaimLoading = ref(false);
const countdownTimerList = ref();
const now = ref(Date.now());

const promoCountdown = computed(() =>
  props.promoList.reduce((result, promo) => {
    result[promo.promoCode] = {};
    if (promo.countDown && promo.response && promo.response.eligible === true) {
      result[promo.promoCode].countDown = getCountdownWithDays(promo.response.promoEndTime);
    }
    switch (promo.buttonMode) {
      case "API_CLAIM":
        result[promo.promoCode].btnText = t("btn.claim");
        break;
      case "API_REDIRECT":
        result[promo.promoCode].btnText = t("btn.details");
        break;
      case "DETAILS":
        result[promo.promoCode].btnText = t("btn.check");
        break;
      default:
        result[promo.promoCode].btnText = t("btn.check");
    }

    return result;
  }, {})
);

const imgURL = process.env.IMAGE_CDN + "/promo/";
const openNewPlayerGuide = () => {
  localStorage.setItem("newPlayerGuide", 1);
  localStorage.removeItem("completeddepositguide");
  localStorage.removeItem("completedreferguide");
  localStorage.removeItem("completedwithdrawguide");
  emit("open-new-player");
};

function getCountdownWithDays(endTime) {
  const now = Date.now();
  let diff = Math.max(0, endTime - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff %= 1000 * 60 * 60 * 24;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff %= 1000 * 60 * 60;

  const minutes = Math.floor(diff / (1000 * 60));
  diff %= 1000 * 60;

  const seconds = Math.floor(diff / 1000);

  const pad = (num) => String(num).padStart(2, "0");

  return `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

onUnmounted(() => {
  clearInterval(countdownTimerList.value);
});

onMounted(() => {
  setInterval(() => {
    now.value = Date.now();
  }, 1000);
});
</script>

<style lang="scss" scoped>
.bonus-container {
  // background-color: #1e371f;
  background: linear-gradient(325.86deg, #0e1e08 5.38%, #1b6026 98.11%);

  border: 1px solid #9fe871;
  border-radius: 16px !important;
  max-width: 400px;
  width: 100%;
  padding: 16px;
  position: relative;
  overflow: visible;
  margin-bottom: -100px;
  margin-top: 60px;

  &:before {
    content: "";
    background-image: url(../../assets/images/index/modal/bonus-container-light.png);
    background-size: 100% 100%;
    background-position: center center;
    background-repeat: no-repeat;
    width: 100%;
    height: 370px;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
  }

  &.has-top-download {
    margin-top: 130px;
  }

  .bonus-header {
    display: flex;
    justify-content: center;
    // margin-top: -18px;
    // z-index: 2;
    position: absolute;
    top: -20px;
    // bottom: 5px;
    width: 100%;

    img {
      display: block;
      width: 100%;
      max-width: 248px;
      margin-bottom: -24px;
      margin-right: 24px;
      height: 60px;
    }
  }

  .bonus-content-wrapper {
    // margin: 0 auto 29px;
    margin: 30px auto 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 60vh;
    overflow-y: auto;
    .mission-item {
      a {
        text-decoration: none;
      }
      display: flex;
      align-items: center;
      // padding: 8px 8px 8px 6px;
      padding: 0 0 0 6px;
      // background-color: #81ff9e1a;
      border-radius: 8px;
      min-height: 50px;
      background: #ffffff0d;
      border: 1px solid #55c2530d;
      box-shadow: 0px 4px 4px 0px #0000000d;
      .mission-icon {
        width: 40px;
        max-width: 10vw;
        margin-right: 7px;
      }
      .mission-title-wrapper {
        display: flex;
        align-items: center;
        flex-grow: 1;
        > :first-child {
          margin-right: 7px;
        }

        .mission-title {
          display: flex;
          flex-direction: column;
          font-weight: 700;
          color: #fff;
        }

        .mission-title-extra {
          color: #00ff44;
        }
      }

      .q-btn {
        min-width: 115px;
        width: 115px;
        border-radius: 4px;
        font-weight: 700;
        text-transform: none;
        line-height: 19px;

        min-height: 50px;

        &.details {
          background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);
          color: #000a01;
        }

        :deep(.q-btn__content) {
          display: flex;
          flex-direction: column;
        }

        .countdown-span {
          color: #d47c00;
          font-size: 12px;
        }

        &.no-reward {
          background: transparent;
          color: #81a285;
          text-transform: uppercase;
        }
      }
    }
  }
}

.bonus-close {
  position: absolute;
  top: 5px;
  right: 10px;
  z-index: 99;
}
</style>
