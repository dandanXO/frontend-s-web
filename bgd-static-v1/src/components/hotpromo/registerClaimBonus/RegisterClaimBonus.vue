<template>
  <div class="wrapper">
    <div class="bonus-wrapper">
      <img :src="require(`./img/bonus-title-${$t('lang.langVal')}.png`)" class="bonus-title" />

      <div class="bonus-container">
        <div class="bonus-main">
          <img src="./img/bonus-main.png" alt="" />
        </div>
        <div class="bonus-info">
          <div class="bonus-info-item">
            <div class="label">{{ $t("hotPromo.registerClaimBonus.trialBonusBalance") }}:</div>
            <div class="value">
              {{ promoData.trialBalance ? convertToCommaAmount(promoData.trialBalance) : "0.00" }}
            </div>
          </div>
          <div class="bonus-info-item">
            <div class="label">{{ $t("hotPromo.registerClaimBonus.amountAvailable") }}:</div>
            <div class="value">
              {{ promoData.claimableBonus ? convertToCommaAmount(promoData.claimableBonus) : "0.00" }}
            </div>
          </div>
          <div class="bonus-info-item">
            <div class="label">{{ $t("hotPromo.registerClaimBonus.amountToBeUnlocked") }}:</div>
            <div class="value">
              {{ promoData.pendingBonus ? convertToCommaAmount(promoData.pendingBonus) : "0.00" }}
            </div>
          </div>
        </div>

        <div class="bonus-progress">
          <div class="bonus-progress-title">
            <div class="bonus-progress-title-left">
              {{ $t("hotPromo.registerClaimBonus.complete") }}
              <span class="highlight">3</span>
              {{ $t("hotPromo.registerClaimBonus.tasksToReceiveIt") }}
            </div>
            <div class="bonus-progress-title-right">
              <img src="./img/clock.png" alt="" />
              {{ promoDaysLeft }} {{ $t("hotPromo.registerClaimBonus.days") }}
            </div>
          </div>
          <div class="bonus-progress-bar">
            <div class="bonus-progress-bar-fill" :style="{ width: totalProgressBarWidth + '%' }"></div>
          </div>
          <div class="bonus-progress-text">
            <div class="bonus-progress-text-left">
              {{ $t("hotPromo.registerClaimBonus.completed") }}: {{ noOfTasksCompleted }}
            </div>
            <div class="bonus-progress-text-right">{{ $t("hotPromo.registerClaimBonus.target") }}: 3</div>
          </div>
        </div>

        <div
          class="bonus-claim-button"
          :class="{ disable: promoData.idVerificationStatus === true && promoData.claimableBonus <= 0 }"
          @click="claimBonus"
        >
          {{ $t("hotPromo.registerClaimBonus.claimNow") }}
        </div>
      </div>
    </div>
    <div class="task-container" v-for="(task, index) in promoData.tasks" :key="task.code">
      <div class="task-container-header">
        {{ $t("hotPromo.registerClaimBonus.task") }} {{ index + 1 }}: {{ task.name }}
        <div
          class="status-button"
          :class="
            task.memberTaskStatus === 'COMPLETED' || task.memberTaskStatus === 'CLAIMED' ? 'completed' : 'progress'
          "
        >
          {{ task.memberTaskStatus.charAt(0) + task.memberTaskStatus.slice(1).toLowerCase() }}
        </div>
      </div>
      <div class="task-container-content">
        {{ task.rules }}
      </div>

      <div class="bonus-progress">
        <div class="bonus-progress-bar">
          <div
            class="bonus-progress-bar-fill"
            :style="{ width: (task.memberDepositStatus / task.depositRequired) * 100 + '%' }"
          ></div>
        </div>
        <div class="bonus-progress-text">
          <div class="bonus-progress-text-left">
            {{ $t("hotPromo.registerClaimBonus.alreadyRecharged") }}: {{ task.memberDepositStatus }}
          </div>
          <div class="bonus-progress-text-right">{{ $t("hotPromo.registerClaimBonus.amount") }}: {{ task.depositRequired }}</div>
        </div>
      </div>
      <div class="task-container-footer">
        {{ task.remark }}
        <!-- <br />
        <span class="highlight">30% (recharge + bonus requires double turnover)</span> -->
      </div>
    </div>
  </div>
  <q-dialog v-model="isNameAuthModal">
    <NameAuthModal @closeDialog="isNameAuthModal = false" />
  </q-dialog>

  <q-dialog v-model="isCongratsModalV2" @hide="handleReceiveBonus">
    <div class="congrats-container">
      <q-btn icon="close" round dense v-close-popup class="congrats-close" />
      <div class="congrats-header"><img src="../../../assets/images/index/modal/congrats-header-v2.png" /></div>
      <div class="congrats-coupons"><img src="../../../assets/images/index/modal/congrats-coupon.png" /></div>
      <div class="congrats-title">Congratulations! You have unlocked bonuses</div>
      <div class="congrats-highlight">{{ convertToCommaAmount(bonusAmount) }}BDT</div>

      <div class="congrats-button">
        <q-btn no-caps unelevated class="recharge-btn" @click="handleReceiveBonus">
          {{ $t("btn.receive") }}
        </q-btn>
      </div>
    </div>
  </q-dialog>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";
import { userStore } from "src/stores";
import { api, eventapi } from "boot/axios";
import NameAuthModal from "src/components/modal/NameAuthModal.vue";
import { convertToCommaAmount } from "src/boot/utils";
import moment from "moment";

const store = userStore();

const props = defineProps(["params", "promocode"]);
const params = JSON.parse(props.params || "{}");
const promoData = ref([]);
const isNameAuthModal = ref(false);
const isCongratsModalV2 = ref(false);
const bonusAmount = ref(0);
const promoDaysLeft = ref(0);

const noOfTasksCompleted = computed(() => {
  return (
    promoData.value?.tasks?.filter(
      (item, index) => index <= 2 && (item.memberTaskStatus === "COMPLETED" || item.memberTaskStatus === "CLAIMED")
    ).length || 0
  );
});

const totalProgressBarWidth = computed(() => {
  const tasksLength = promoData.value.tasks?.length || 0;
  var taskSize = 0;
  if (noOfTasksCompleted.value === 1) {
    taskSize = 0.3;
  } else if (noOfTasksCompleted.value === 2) {
    taskSize = 0.6;
  } else if (noOfTasksCompleted.value === 3) {
    taskSize = 1;
  }

  const calculatedVal = tasksLength ? taskSize : 0;
  return !isNaN(calculatedVal) ? calculatedVal * 100 : 0;
});

const claimBonus = () => {
  if (!promoData.value.idVerificationStatus) {
    isNameAuthModal.value = true;
  } else {
    eventapi.post(`/session/register-trial-fund/claimTask?promoCode=${props.promocode}`).then((res) => {
      if (res.code === 0 && res.data !== 0) {
        isCongratsModalV2.value = true;
        bonusAmount.value = res.data;
      }
    });
  }
};

const handleReceiveBonus = async () => {
  await getTasks();
  isCongratsModalV2.value = false;
};

const getTasks = async () => {
  eventapi.get(`/session/register-trial-fund/init?promoCode=${props.promocode}`).then((res) => {
    promoData.value = res.data;

    const expiryDate = moment.utc(promoData.value.expiryDate, "YYYY-MM-DD HH:mm:ss");
    promoDaysLeft.value = expiryDate.diff(moment.utc(), "days");
    if (promoDaysLeft.value < 0) {
      promoDaysLeft.value = 0;
    }
  });
};
onMounted(() => {
  // loadAppTabs();
  getTasks();
});
</script>
<style lang="scss" scoped>
.bonus-wrapper {
  position: relative;
  padding-top: 10px;
  margin-bottom: 16px;

  .bonus-title {
    width: 80% !important;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 0px;
  }

  .bonus-container {
    background-color: #1e371f;
    border: 1px solid #337e3a;
    padding-top: 72px;
    border-radius: 10px;

    .bonus-main {
      background-image: url("./img/bonus-main-bg.png");
      background-size: cover;
      margin-bottom: 16px;

      img {
        width: 80% !important;
        margin: 0 auto;
      }
    }

    .bonus-info {
      background-color: #ffffff1a;
      padding: 0 12px;
      margin: 0 12px 16px;
      border-radius: 4px;

      .bonus-info-item {
        font-size: 12px;
        font-weight: bold;
        border-bottom: 1px solid #ffffff1a;
        padding: 8px 0 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .label {
          color: white;
        }

        .value {
          color: #fff96f;
        }

        &:last-child {
          border-bottom: none;
        }
      }
    }

    .bonus-claim-button {
      background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);
      box-shadow: 0px 2px 0px 0px #1dca6a;
      color: #000000;
      font-size: 14px;
      font-weight: bold;
      text-align: center;
      margin: 12px;
      border-radius: 28px;
      padding: 12px 0;
      &.disable {
        background: #d3d3d3;
        box-shadow: none;
        color: #a0a0a0;
        cursor: not-allowed;
        pointer-events: none;
        opacity: 0.6;
      }
    }
  }
}

.task-container {
  border: 1px solid #337e3a;
  border-radius: 10px;
  overflow: hidden;
  padding-bottom: 12px;
  margin-bottom: 16px;

  .task-container-header {
    background: linear-gradient(180deg, #70bc62 0%, #33562d 100%), linear-gradient(90deg, #24ee89 0%, #9fe871 100%),
      linear-gradient(180deg, #70bc62 0%, #33562d 100%);
    color: white;
    font-size: 14px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    padding: 12px;

    .status-button {
      font-size: 10px;
      font-weight: bold;
      border-radius: 100px;
      width: 100px;
      height: 24px;
      display: flex;
      justify-content: center;
      align-items: center;

      &.not-completed {
        color: #3b3b3b;
        background: linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)),
          linear-gradient(90deg, #888888 0%, #a0a0a0 100%);
      }

      &.completed {
        color: #076300;
        background: linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)),
          linear-gradient(90deg, #24ee89 0%, #9fe871 100%);

        &::after {
          content: "";
          display: inline-block;
          width: 10px;
          height: 7px;
          background-image: url("./img/check-icon.png");
          margin-left: 4px;
          background-size: cover;
        }
      }

      &.progress {
        color: #624400;
        background: linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)),
          linear-gradient(90deg, #eeab24 0%, #e8de71 100%);
      }
    }
  }

  .task-container-content {
    color: white;
    font-size: 12px;
    padding: 12px;
  }

  .task-container-footer {
    background: #ffffff1a;
    color: white;
    font-size: 9px;
    padding: 6px;
    margin: 0 12px;
    border-radius: 4px;
  }
}

.bonus-progress {
  margin: 0 12px;

  .bonus-progress-title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 12px;
    color: #ffffff;
    font-weight: bold;

    .bonus-progress-title-right {
      display: flex;
      align-items: center;
      gap: 8px;

      img {
        width: 16px !important;
        height: 16px !important;
        margin: 0 !important;
      }
    }
  }

  .bonus-progress-bar {
    height: 8px;
    border-radius: 100px;
    background-color: #ffffff1a;

    .bonus-progress-bar-fill {
      height: 100%;
      border-radius: 100px;
      background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);
      width: 10%;
    }
  }

  .bonus-progress-text {
    display: flex;
    justify-content: space-between;
    margin: 8px 0;
    font-size: 12px;
    color: #ffffff;
    font-weight: bold;
  }
}

.highlight {
  color: #fff96f;
}

.congrats-button {
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
}
.congrats-wrapper {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}
.congrats-container {
  background-color: #1e371f;
  border: 1px solid #337e3a;
  border-radius: 10px !important;
  max-width: 400px;
  width: 100%;
  padding: 16px;
  position: relative;
  overflow: visible;
  border-radius: 12px;

  &:before {
    content: "";
    background-image: url(../../../assets/images/index/modal/congrats-container-light.png);
    background-size: 100% 100%;
    background-position: center center;
    background-repeat: no-repeat;
    width: 100%;
    height: 150px;
    position: absolute;
    left: 0;
    top: -150px;
  }

  .congrats-header {
    display: flex;
    justify-content: center;
    margin-top: -18px;
    z-index: 2;

    img {
      display: block;
      width: 100%;
      max-width: 320px;
    }
  }

  .congrats-coupons {
    img {
      display: block;
      width: 100%;
      margin: auto;
      max-width: 240px;
    }
  }

  .congrats-title {
    color: #ffffff;
    display: flex;
    justify-content: center;
    font-size: 18px;
    font-weight: bold;
  }

  .congrats-highlight {
    color: #fff96f;
    font-size: 45px;
    text-align: center;
    background-image: url(../../../assets/images/index/modal/congrats-highlight-bg.png);
    padding: 0 12px;
    background-repeat: no-repeat;
    background-size: 70% 100%;
    background-position: center;
    margin-top: 16px;
  }
}

.congrats-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.1);
}

.recharge-btn {
  background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);
  border-radius: 10px;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: #000a01;
}
</style>
