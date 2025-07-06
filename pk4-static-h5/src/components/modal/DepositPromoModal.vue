<template>
  <q-dialog v-model="showModal" ref="dialogRef" persistent @hide="handleDialogClose">
    <div class="deposit-promo-modal">
      <template v-if="modalType !== 'APP_LOGIN_APK'">
        <div class="modal-img">
          <img :src="require(`../../assets/images/index/deposit-modal/deposit-promo-${modalImageIndex}.png`)" />
        </div>
        <div class="modal-btn" @click="btnAction()">
          <img :src="require(`../../assets/images/index/deposit-modal/deposit-promo-${modalImageIndex}-btn.png`)" />
        </div>

        <div class="modal-checkbox">
          <q-checkbox v-model="hideModalForAWeek">Don't remind me again within a week</q-checkbox>
        </div>
      </template>
      <!-- <template v-if="modalType === 'APP_LOGIN_APK'">
        <div class="modal-img-2">
          <img :src="require(`../../assets/images/index/deposit-modal/deposit-promo-${modalImageIndex}-${depositOpen ? 'open' : 'close'}.png`)" />
          <div class="modal-btn-2" @click="!depositOpen ? depositOpen = !depositOpen : btnAction()">
            <img :src="require(`../../assets/images/index/deposit-modal/deposit-promo-${modalImageIndex}-${depositOpen ? 'open' : 'close'}-btn.png`)" />
          </div>
          <div class="modal-rule-2" @click="showRules = true">
            <img v-if="depositOpen" :src="require(`../../assets/images/index/deposit-modal/deposit-promo-${modalImageIndex}-open-rule.png`)" />
          </div>
        </div>
      </template> -->
      <!-- <div v-if="[2, 3].includes(modalImageIndex)" class="modal-countdown">
        <img :src="require(`../../assets/images/index/deposit-modal/deposit-promo-${modalImageIndex}-countdown.png`)" />
        <span class="modal-countdown__number" :class="{ 'is-ftd': modalImageIndex === 2 }" :data-stroke="countdown">
          {{ countdown }}
        </span>
      </div> -->
      <div v-close-popup class="modal-close">
        <q-icon name="highlight_off"></q-icon>
      </div>
    </div>
    <q-dialog v-model="showRules" class="rules-container">
      <q-card style="width: 100%;height: 100%; max-height: unset; margin: 0; padding: 0;">
        <q-card-section class="page-title">
          <a @click="showRules = !showRules" class="q-mt-sm">
            <img src="../../assets/images/index/btn-back.png" width="30" />
            <!-- <q-icon class="header-icon" name="arrow_back_ios"></q-icon> -->
            <!-- <span v-if="route.path === '/deposit' || route.path === '/withdraw'" class="header-back">Back</span> -->
          </a>
          <div class="page-title-wrapper">
            <!--          <img src="../assets/images/index/hot-elephant-left.png" alt="" />-->
            <div class="title-container">
              <span class="title">Rules</span>
            </div>
            <!--          <img src="../assets/images/index/hot-elephant-right.png" alt="" />-->
          </div>

          <div
            class="header-right"
          >
          </div>
        </q-card-section>
        <q-page-container>
          <div class="terms-conditions">
            <div class="terms-title">
              <img src="../../assets/images/promotion/hotpromo/app-login-bonus/rules-title.png">
            </div>
            <ul>
              <li>{{ $t("hotPromo.appLoginBonus.termsCondition8") }}</li>
              <li>{{ $t("hotPromo.appLoginBonus.termsCondition9") }}</li>
            </ul>
          </div>
        </q-page-container>
      </q-card>
    </q-dialog>
  </q-dialog>
</template>

<script setup>
import { ref, watch, computed, onMounted, onActivated, onDeactivated } from "vue";
import { useUI } from "stores/ui";
import { useRouter } from "vue-router";
import { eventapi } from "src/boot/axios";
import { userStore } from "src/stores";
import { isAndroid } from "src/boot/utils";
import moment from "moment";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { useLocalStorage } from "@vueuse/core";
const KEY = "PAK_APP_LOGIN_PHONE_BONUS_LAST_CHECK_TIMESTAMP";
/**
 * @typedef {'APP_LOGIN_H5'|'APP_LOGIN_APK'|'FIRST_DEPOSIT'|'FIRST_DEPOSIT_AMOUNT'|'SECONDARY_DEPOSIT_AMOUNT'|'LUCKY_10_DAY'|'PHONE_VERIFIED_NOT_CLAIMED'} ModalType
 */

const ui = useUI();
const store = userStore();
const router = useRouter();
const $q = useQuasar();
const { t } = useI18n();
const lastCheck = useLocalStorage(KEY, {});

const hideModalForAWeek = ref(false);
/**
 * @type {import('vue').Ref<ModalType>}
 */
const modalType = ref("");
const modalIndex = ref(1);
const showModal = ref(false);
const isDuringInitial = ref(true);
const statusFromApi = ref({
  hadBindEmail: false,
  hadBindPhone: false,
  hadClaim: false,
  isAppLogin: false
});
const isActivated = ref(true);
const isDuringActivation = ref(false);
const shouldCheckAppAgain = ref(false);
const countdown = ref("");
const countdownTimer = ref(null);
const dialogRef = ref(null);
const currentTriggerType = ref("LOGIN");
const modalTriggerList = ref([
  null,
  "LOGIN,REDIRECT_TO_HOME"
]);

const combinedStatus = computed(() => ({
  ...statusFromApi.value,
  claimedFtdPrivilege: store.claimedFtdPrivilege,
  claimedSecondPrivilege: store.claimedSecondPrivilege,
  eligibleThirdPrivilege: store.eligibleThirdPrivilege
}));

const isLuckyDay = computed(() => moment().date() % 10 === 1);
const depositOpen = ref(false);
const showRules = ref(false);
const modalImageIndex = computed(() => {
  return modalIndex.value;
});

const startCountdown = () => {
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value);
  }
  const duration = moment.duration(60, "minutes");
  let remaining = duration.clone();
  countdownTimer.value = setInterval(() => {
    remaining.subtract(100, "milliseconds");
    if (remaining.asMilliseconds() <= 0) {
      clearInterval(countdownTimer.value);
      dialogRef.value?.hide();
    }
    const minutes = String(remaining.minutes()).padStart(2, "0");
    const seconds = String(remaining.seconds()).padStart(2, "0");
    const decimalSeconds = String(Math.floor(remaining.milliseconds() / 100)).padStart(2, "0");
    countdown.value = `${minutes}:${seconds}:${decimalSeconds}`;
  }, 100);
};

const handleDialogClose = () => {
  if (hideModalForAWeek.value) {
    lastCheck.value[modalIndex.value] = Date.now();
    hideModalForAWeek.value = false;
  }
  showNextModal();
};

const handleAppLoginPromoClaim = async () => {
  if (isAndroid() || store.isFromGooglePackage) {
    if (!combinedStatus.value.hadBindPhone) {
      $q.notify({
        type: "negative",
        position: "top",
        message: t("modal.appLoginBonus.validatePhoneAndEmail"),
        icon: "error"
      });
      showModal.value = false;
      router.push("/account/profile");
      shouldCheckAppAgain.value = true;
    } else if (!combinedStatus.value.hadClaim) {
      try {
        const res = await eventapi.post("/session/app-login-bonus/claimBonus?promoCode=pk4-app-login-phone-bonus");
        if (res.code === 0) {
          $q.notify({
            type: "positive",
            position: "top",
            message: t("modal.appLoginBonus.claimBonus", { amount: res.data }),
            icon: "check_circle_outline"
          });
          showModal.value = false;
          store.getBalance();
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      showModal.value = false;
    }
  } else if (!combinedStatus.value.isAppLogin) {
    const downloadTag = document.createElement("a");
    downloadTag.href = ui.downloadAppUrl;
    downloadTag.click();
    downloadTag.remove();
  }
};

const btnAction = () => {
  switch (modalIndex.value) {
    case 1:
      handleAppLoginPromoClaim();
      break;
    case 2:
    case 3:
      router.push("/deposit");
      break;
    case 4:
      $q.dialog({
        message: t("modal.appLoginBonus.loginTomorrow"),
        persistent: true,
        ok: {
          label: t("btn.close"),
          color: "primary"
        },
        class: "deposit-promo-modal-notification-dialog"
      }).onOk(() => dialogRef.value?.hide());
      break;
    case 5:
      router.push("/promo?name=pk4-lucky-10-day-bonus");
  }
};

const checkAppLogin = async () => {
  if (combinedStatus.value.hadClaim) {
    showNextModal();
    return;
  }
  try {
    // if (isAndroid() || store.isFromGooglePackage) {
    //   const res = await eventapi.get("/session/app-login-bonus/popUp?promoCode=pk4-app-login-phone-bonus");
    //   if (res.code === 0 && res.data) {
    //     modalType.value = "APP_LOGIN_APK";
    //   } else {
    //     showNextModal();
    //   }
    // } else if (!combinedStatus.value.isAppLogin) {
    //   modalType.value = "APP_LOGIN_H5";
    // } else {
    //   showNextModal();
    // }
    if (isAndroid() || store.isFromGooglePackage) {
      modalType.value = "APP_LOGIN_APK";
    } else if (!combinedStatus.value.isAppLogin) {
      modalType.value = "APP_LOGIN_H5";
    } else {
      showNextModal();
    }
  } catch (e) {
    console.error(e);
    showNextModal();
  } finally {
    shouldCheckAppAgain.value = false;
  }
};

const checkLucky10DayPromo = async () => {
  if (!isLuckyDay.value) return;
  try {
    const res = await eventapi.get("/session/lucky-day/init?promoCode=pk4-lucky-10-day-bonus");
    if (res.code === 0 && res.data?.isClaimable) {
      modalType.value = "LUCKY_10_DAY";
    }
  } catch (e) {
    console.error(e);
  }
};

const checkModalType = async () => {
  if (statusFromApi.value.hadBindPhone === true && statusFromApi.value.hadClaim === false) {
    modalType.value = "PHONE_VERIFIED_NOT_CLAIMED"
  }
  if (modalIndex.value >= modalTriggerList.value.length) {
    resetModal();
    return;
  }
  if (!modalTriggerList.value[modalIndex.value].includes(currentTriggerType.value)) {
    showNextModal();
    return;
  }

  switch (modalIndex.value) {
    case 1:
      if (shouldShowModalAgain(modalIndex.value)) {
        checkAppLogin();
      }
      // else {
      //   showNextModal();
      // }
      break;
    // case 2:
    //   if (!combinedStatus.value.claimedFtdPrivilege && shouldShowModalAgain(modalIndex.value)) {
    //     modalType.value = "FIRST_DEPOSIT";
    //   } else {
    //     showNextModal();
    //   }
    //   break;
    // case 3:
    //   if (
    //     combinedStatus.value.claimedFtdPrivilege &&
    //     !combinedStatus.value.claimedSecondPrivilege &&
    //     store.balance <= 50 &&
    //     shouldShowModalAgain(modalIndex.value)
    //   ) {
    //     modalType.value = "FIRST_DEPOSIT_AMOUNT";
    //   } else {
    //     showNextModal();
    //   }
    //   break;
    // case 4:
    //   if (combinedStatus.value.eligibleThirdPrivilege && store.balance < 30 && shouldShowModalAgain(modalIndex.value)) {
    //     modalType.value = "SECONDARY_DEPOSIT_AMOUNT";
    //   } else {
    //     showNextModal();
    //   }
    //   break;
    // case 5:
    //   if (shouldShowModalAgain(modalIndex.value)) {
    //     checkLucky10DayPromo();
    //   }
    //   break;
  }
};

const recheckModalType = async () => {
  if (shouldCheckAppAgain.value && shouldShowModalAgain(1)) {
    await getData(false);
    checkAppLogin();
  }
  // else if (
  //   combinedStatus.value.claimedFtdPrivilege &&
  //   !store.claimedSecondPrivilege &&
  //   store.balance <= 50 &&
  //   shouldShowModalAgain(3)
  // ) {
  //   modalIndex.value = 3;
  //   modalType.value = "FIRST_DEPOSIT_AMOUNT";
  // } else if (combinedStatus.value.eligibleThirdPrivilege && store.balance < 30 && shouldShowModalAgain(4)) {
  //   modalIndex.value = 4;
  //   modalType.value = "SECONDARY_DEPOSIT_AMOUNT";
  // }
};

const showNextModal = () => {
  if (!isActivated.value) return;
  modalIndex.value++;
  checkModalType();
};

const shouldShowModalAgain = (index) => {
  const lastCheckTime = lastCheck.value[index];
  if (lastCheckTime) {
    const now = Date.now();
    const diff = now - lastCheckTime;
    return diff > 7 * 24 * 60 * 60 * 1000; // 7 days
  }
  return true;
};

const getData = async (isFirst = true) => {
  try {
    const initRes = await eventapi.get("/session/app-login-bonus/init?promoCode=pk4-app-login-phone-bonus");
    if (initRes.code === 0) {
      statusFromApi.value = initRes.data;
      isFirst && checkModalType();
    }
  } catch (e) {
    console.error(e);
  } finally {
    isDuringInitial.value = false;
  }
};

const resetModal = () => {
  modalIndex.value = 1;
  modalType.value = "";
  showModal.value = false;
};

watch(modalType, (val) => {
  if (val) {
    if (isAndroid()) {
      showModal.value = false;
    } else {
      showModal.value = true;
    }
  }
  // if ([2, 3].includes(modalIndex.value)) {
  //   startCountdown();
  // }
});

watch(
  () => store.balance,
  () => {
    if (isDuringInitial.value || isDuringActivation.value) return;
    store.getMemberInfo().then(recheckModalType);
    currentTriggerType.value = "REDIRECT_TO_HOME";
  }
);

onActivated(() => {
  isActivated.value = true;
  isDuringActivation.value = true;
  if (isDuringInitial.value) return;
  store.getMemberInfo().then(() => {
    recheckModalType();
    isDuringActivation.value = false;
  });
  currentTriggerType.value = "REDIRECT_TO_HOME";
});

onDeactivated(() => {
  handleDialogClose();
  isActivated.value = false;
  resetModal();
});

onMounted(() => {
  setTimeout(() => {
    if (store.token) {
      getData();
    }
  }, 2000);
});
</script>

<style scoped lang="scss">
.deposit-promo-modal {
  .modal-img-2 {
    position: relative;
    display: flex;
    justify-content: center;
    img {
      display: block;
      width: 100%;
      max-width: 300px;
    }
  }

  .modal-btn-2 {
    position: absolute;
    display: flex;
    justify-content: center;
    bottom: 120px;
    img {
      display: block;
      width: 100%;
      max-width: 160px;
    }
  }
  .modal-rule-2 {
    position: absolute;
    bottom: 280px;
    position: absolute;
    width: 100%;
    left: 40px;
    img {
      max-width: 35px;
    }

  }
  .modal-img {
    display: flex;
    justify-content: center;
    img {
      display: block;
      width: 100%;
      max-width: 300px;
    }
  }

  .modal-btn {
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      display: block;
      width: 100%;
      max-width: 160px;
    }
  }

  .modal-checkbox {
    margin-bottom: 12px;
    text-align: center;
  }

  .modal-countdown {
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      max-width: 249px;
    }
    .modal-countdown__number {
      position: relative;
      font-family: PaytoneOne;
      font-size: 56px;
      color: #de7919;
      --countdown-text-shadow-color: #71090b;

      &.is-ftd {
        &::after {
          --countdown-text-shadow-color: #097109;
        }
      }

      &::before {
        position: absolute;
        z-index: -1;
        content: attr(data-stroke);
        -webkit-text-stroke: 6px #fff;
        text-stroke: 6px #fff;
      }

      &::after {
        position: absolute;
        z-index: -2;
        content: attr(data-stroke);
        text-shadow: 0px 10px 1.42px var(--countdown-text-shadow-color);
        inset: 0;
      }
    }
  }

  .modal-close {
    display: flex;
    justify-content: center;
    font-size: 30px;
    font-weight: lighter;
    margin-top: 16px;
  }
}

@media (max-height: 700px) {
  .deposit-promo-modal {
    .modal-img {
      img {
        // max-width: 240px;

        max-width: 80%;
        margin-bottom: -90px;
      }
    }
    .modal-countdown {
      .modal-countdown__number {
        font-size: 38px;
      }
    }
  }
}
.rules-container {
  .q-page-container {
    background: url(../../assets/images/promotion/hotpromo/app-login-bonus/rules-bg.png)no-repeat top center;
    background-size: contain;
    background-color: #090F1E;
    height: calc(100% - 50px);
  }
  .terms-conditions {
    .terms-title {
      width: 100%;
      padding: 20px 0 10px;
      img {
        width: 100%;
      }
    }
    ul {
      font-family: Poppins;
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      letter-spacing: 0px;
      padding-right: 20px;
      color: #9F9F9F;
    }
  }
}

.page-title-wrapper {
  display: flex;
  justify-content: space-between;
  margin: 0;
  padding: 1rem 0px;
  height: 60px;

  img {
    width: 2.25rem;
  }

  .title-container {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20rem;
    margin: 0 0.5rem;
    font-size: 16px;
    font-weight: bold;
  }

  svg {
    width: 250px;
  }
}
</style>
<style lang="scss">
.deposit-promo-modal-notification-dialog {
  padding: 8px;
}
</style>
