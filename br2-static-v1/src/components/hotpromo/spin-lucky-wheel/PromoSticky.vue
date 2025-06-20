<template>
  <!-- <q-page-sticky position="bottom-right" :offset="csDragPos" class="floating-btn" v-if="remainingTime && isShowSticky"> -->
  <div
    v-touch-pan.prevent.mouse="moveCsIcon"
    @click="router.push('promo?name=spin-lucky-wheel')"
    class="countdown-sticky"
  >
    <picture class="gift-img">
      <img src="../../../assets/images/promotion/spin-lucky-wheel/sticky/bg.png" />
    </picture>
    <span class="remaining-time" :data-text="remainingTime">{{ remainingTime }}</span>
    <!-- <img @click.stop="closeSticky()" class="close-btn" src="../../../assets/images/index/close-btn.png" /> -->
  </div>
  <!-- </q-page-sticky> -->
</template>
<script setup>
import { storeToRefs } from "pinia";
import { userStore } from "src/stores";
import { onMounted, onUnmounted, ref, onActivated } from "vue";
import { eventapi } from "src/boot/axios";
import moment from "moment-timezone";
import { useRouter } from "vue-router";
import { usePromoStore } from "src/stores/promo";

const router = useRouter();
const promoStore = usePromoStore();

const timer = ref();
const remainingTime = ref("");
// const { isShowSticky } = storeToRefs(promoStore);
const nextFreeSpinRemainingTime = ref("");
const moveCsIcon = (ev) => {
  isDraggingCsIcon.value = ev.isFirst !== true && ev.isFinal !== true;
  csDragPos.value = [csDragPos.value[0] - ev.delta.x, csDragPos.value[1] - ev.delta.y];
};

const store = userStore();

const closeSticky = () => {
  // isShowSticky.value = false;
  promoStore.setIsShowSticky(false);
  sessionStorage.setItem("SPIN_LUCKY_WHEEL_STICKY", "1");
};

const csDragPos = ref([10, 240]);
const isDraggingCsIcon = ref(false);
const isInitialized = ref(false);

const info = ref({
  wheelStartTime: "",
  wheelEndTime: "",
  hasWithdrawn: false,
  accumulatedBonus: 0,
  targetWithdrawAmount: 0,
  availableSpin: 0,
  currentBonusType: "",
  wheelNo: 1
});

const getRemainingTime = (endTime) => {
  let result = "00:00:00";
  if (endTime) {
    const now = moment(Date.now());
    const _endTime = moment(endTime);
    const totalSeconds = _endTime.diff(now, "seconds");
    if (totalSeconds > 0) {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      result = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
  }
  return result;
};

const updateCountdownTime = () => {
  const wheelEndTime = moment.tz(info.value.wheelEndTime, "America/Sao_Paulo");
  const wheelResetTime = moment.tz(info.value.wheelResetTime, "America/Sao_Paulo");
  const now = moment();

  const endTime = now.isAfter(moment.min(wheelEndTime, wheelResetTime))
    ? moment.max(wheelEndTime, wheelResetTime)
    : moment.min(wheelEndTime, wheelResetTime);

  const nextFreeSpinEndTime = moment().add(1, "days").startOf("day");

  if (timer.value) {
    clearInterval(timer.value);
  }

  remainingTime.value = getRemainingTime(endTime);
  // nextFreeSpinRemainingTime.value = getRemainingTime(nextFreeSpinEndTime);

  timer.value = setInterval(() => {
    remainingTime.value = getRemainingTime(endTime);
    // nextFreeSpinRemainingTime.value = getRemainingTime(nextFreeSpinEndTime);
  }, 1000);
};

const loadData = async () => {
  const getShow = sessionStorage.getItem("SPIN_LUCKY_WHEEL_STICKY");

  if (!getShow && store.token) {
    var res = await eventapi.get("/session/refer-wheel-spin/init?promoCode=pak-refer-wheel-spin");
    // res.code = 199;
    if (res.code === 0) {
      info.value = {
        ...info.value,
        ...res.data
      };

      updateCountdownTime();
      promoStore.addShownFloatingOrDialogList("spin-lucky-wheel");
      if (info.value.wheelStartTime) {
        promoStore.setIsShowSticky(true);
        // isShowSticky.value = true;
      }
    }
  }
};

onMounted(async () => {
  await loadData();
  isInitialized.value = true;
});

onActivated(() => {
  if (!isInitialized.value) return;

  clearInterval(timer.value);
  loadData();
});

onUnmounted(() => {
  clearInterval(timer.value);
});
</script>
<style lang="scss" scoped>
.countdown-sticky {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  aspect-ratio: 192/172;
  // background: url("../../../assets/images/promotion/spin-lucky-wheel/sticky/bg.png") no-repeat center
  //   center;
  // background-size: contain;
  position: relative;

  .close-btn {
    position: absolute;
    top: -5px;
    right: -5px;
    width: 20px;
    cursor: pointer;
  }
}

.remaining-time {
  position: absolute;
  top: 26px;
  font-size: 16px;
  font-weight: 900;
  line-height: 24px;
  letter-spacing: -1px;
  background: linear-gradient(180deg, #fdfd7a 0%, #fddb04 100%);
  background-clip: text;
  color: transparent;
  // text-shadow: 0px 2.61px 0px #b72c00;
}

.gift-img {
  img {
    pointer-events: none;
  }
}
</style>
