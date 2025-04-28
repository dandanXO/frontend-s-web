<template>
  <q-dialog v-model="showModal" persistent @hide="handleDialogClose">
    <div class="deposit-promo-modal">
      <div class="modal-img">
        <img :src="require(`../../assets/images/index/deposit-modal/deposit-promo-${modalImageIndex}.png`)" />
      </div>
      <div class="modal-btn" @click="btnAction()">
        <img :src="require(`../../assets/images/index/deposit-modal/deposit-promo-${modalImageIndex}-btn.png`)" />
      </div>
      <div class="modal-checkbox">
        <q-checkbox v-model="hideModalForAWeek">Don't remind me again within a week</q-checkbox>
      </div>
      <div v-close-popup class="modal-close">
        <q-icon name="highlight_off"></q-icon>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import { ref, watch, computed, onMounted, onActivated, onDeactivated } from "vue";
import { useUI } from "stores/ui";
import { useRouter } from "vue-router";
import { eventapi } from "src/boot/axios";
import { userStore } from "src/stores";
import { isAndroid, isInPwa } from "src/boot/utils";
import moment from "moment";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { useLocalStorage, useSessionStorage } from "@vueuse/core";

const KEY = "PAK_APP_LOGIN_PHONE_BONUS_LAST_CHECK_TIMESTAMP";

/**
 * @typedef {'APP_LOGIN_H5'|'APP_LOGIN_APK'|'FIRST_DEPOSIT'|'FIRST_DEPOSIT_AMOUNT'|'SECONDARY_DEPOSIT_AMOUNT'|'LUCKY_10_DAY'} ModalType
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

const combinedStatus = computed(() => ({
  ...statusFromApi.value,
  depositCount: store.depositCount
}));

const isLuckyDay = computed(() => moment().date() % 10 === 9);

const modalImageIndex = computed(() => {
  if (modalIndex.value === 1 && (isAndroid() || store.isFromGooglePackage)) return 6;
  return modalIndex.value;
});

const handleDialogClose = () => {
  if (hideModalForAWeek.value) {
    lastCheck.value[modalIndex.value] = Date.now();
    hideModalForAWeek.value = false;
  }
  showNextModal();
};

const handleAppLoginPromoClaim = async () => {
  if (isAndroid() || store.isFromGooglePackage) {
    if (!combinedStatus.value.hadBindEmail || !combinedStatus.value.hadBindPhone) {
      $q.notify({
        type: "negative",
        position: "top",
        message: t("modal.appLoginBonus.validatePhoneAndEmail"),
        icon: "error"
      });
      router.push("/account/profile");
    } else {
      try {
        const res = await eventapi.post("/session/app-login-bonus/claimBonus?promoCode=pak-app-login-phone-bonus");
        if (res.code === 0) {
          $q.notify({
            type: "positive",
            position: "top",
            message: `Claim successfully`,
            icon: "check_circle_outline"
          });
          store.getBalance();
          showModal.value = false;
        }
      } catch (e) {
        console.error(e);
      }
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
    case 4:
      router.push("/deposit");
      break;
    case 5:
      router.push("/promo?name=pak-lucky-10-day-bonus");
  }
};

const checkAppLogin = async () => {
  try {
    if (isAndroid() || store.isFromGooglePackage) {
      const res = await eventapi.get("/session/app-login-bonus/popUp?promoCode=pak-app-login-phone-bonus");
      if (res.code === 0 && !res.data) {
        modalType.value = "APP_LOGIN_APK";
      }
    } else if (!combinedStatus.value.isAppLogin) {
      modalType.value = "APP_LOGIN_H5";
    } else {
      showNextModal();
    }
  } catch (e) {
    console.error(e);
  }
};

const checkLucky10DayPromo = async () => {
  if (!isLuckyDay.value) return;
  try {
    const res = await eventapi.get("/session/lucky-day/init?promoCode=pak-lucky-10-day-bonus");
    if (res.code === 0 && res.data?.isClaimable) {
      modalType.value = "LUCKY_10_DAY";
    }
  } catch (e) {
    console.error(e);
  }
};

const checkModalType = async () => {
  switch (modalIndex.value) {
    case 1:
      if (shouldShowModalAgain()) {
        checkAppLogin();
      } else {
        showNextModal();
      }
      break;
    case 2:
      if (combinedStatus.value.depositCount === 0 && shouldShowModalAgain()) {
        modalType.value = "FIRST_DEPOSIT";
      } else {
        showNextModal();
      }
      break;
    case 3:
      if (combinedStatus.value.depositCount === 1 && store.balance <= 50 && shouldShowModalAgain()) {
        modalType.value = "FIRST_DEPOSIT_AMOUNT";
      } else {
        showNextModal();
      }
      break;
    case 4:
      if (combinedStatus.value.depositCount === 2 && store.balance <= 10 && shouldShowModalAgain()) {
        modalType.value = "SECONDARY_DEPOSIT_AMOUNT";
      } else {
        showNextModal();
      }
      break;
    case 5:
      if (shouldShowModalAgain()) {
        checkLucky10DayPromo();
      }
      break;
  }
};

const recheckBalance = () => {
  if (store.depositCount === 1 && store.balance <= 50) {
    modalIndex.value = 3;
    modalType.value = "FIRST_DEPOSIT_AMOUNT";
  } else if (store.depositCount === 2 && store.balance <= 10) {
    modalIndex.value = 4;
    modalType.value = "SECONDARY_DEPOSIT_AMOUNT";
  }
};

const showNextModal = () => {
  modalIndex.value++;
  checkModalType();
};

const shouldShowModalAgain = () => {
  const lastCheckTime = lastCheck.value[modalIndex.value];
  if (lastCheckTime) {
    const now = Date.now();
    const diff = now - lastCheckTime;
    return diff > 7 * 24 * 60 * 60 * 1000; // 7 days
  }
  return true;
};

const getData = async () => {
  try {
    const initRes = await eventapi.get("/session/app-login-bonus/init?promoCode=pak-app-login-phone-bonus");
    if (initRes.code === 0) {
      statusFromApi.value = initRes.data;
      checkModalType();
    }
  } catch (e) {
    console.error(e);
  } finally {
    isDuringInitial.value = false;
  }
};

watch(modalType, (val) => {
  if (val) {
    showModal.value = true;
  }
});

const unwatchBalance = watch(
  () => store.balance,
  () => {
    if (isDuringInitial.value) return;
    store.getMemberInfo().then(recheckBalance);
    if (store.depositCount > 2) unwatchBalance();
  }
);

onActivated(() => {
  if (isDuringInitial.value) return;
  recheckBalance();
});

onDeactivated(() => {
  modalIndex.value = 1;
  modalType.value = "";
  showModal.value = false;
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
  .modal-img {
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

  .modal-close {
    display: flex;
    justify-content: center;
    font-size: 30px;
    font-weight: lighter;
    margin-top: 16px;
  }
}
</style>
