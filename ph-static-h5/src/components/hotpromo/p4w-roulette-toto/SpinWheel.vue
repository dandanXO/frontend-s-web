<template>
  <template v-if="isModal">
    <template v-if="rouletteDetailsLoaded">
      <q-dialog v-model="spinWheelModalVisible" @hide="spinWheelHideHandler">
        <div class="spinwheel" style="background: transparent">
          <div class="spin-container">
            <img
              style="display: flex; width: 70%; margin: auto"
              src="./../../../assets/images/promotion/hotpromo/p4w-roulette-toto/get-wards-for-free-text.png"
            />
            <div class="spin-wheel">
              <div class="spin-wheel-bg">
                <img class="glow" src="../../../assets/images/promotion/hotpromo/p4w-roulette-toto/spin-glow.png" />
                <img class="bot" src="../../../assets/images/promotion/hotpromo/p4w-roulette-toto/spin-bot.png" />
              </div>
              <div class="wheel-wrapper">
                <q-icon
                  v-close-popup
                  name="cancel"
                  size="lg"
                  style="position: absolute; right: -50px; top: -50px"
                  color="white"
                />
                <div class="wheel-pointer">
                  <img src="../../../assets/images/promotion/hotpromo/p4w-roulette-toto/toparrow.png" />
                </div>
                <div class="wheel-bg" :style="`transform: rotate(${wheelDeg}deg)`" @click="onClickRotate">
                  <div class="prize-list">
                    <div class="prize-item-wrapper" v-for="(item, index) in prizeList" :key="index">
                      <div class="prize-item" :style="`transform: rotate(${(360 / prizeList.length) * index}deg)`" />
                    </div>
                  </div>
                </div>
                <div v-if="freeze" :class="{ freeze: freeze }">
                  <div style="position: absolute">
                    <div class="claim-prize" v-if="!fullyRedeemed && !rouletteDetails.hasSpinRoulette">
                      <img
                        class="cash"
                        width="80"
                        src="../../../assets/images/promotion/hotpromo/p4w-roulette-toto/coins.svg"
                      />
                      <div class="claim-prize-text">{{ prizeResult }}</div>
                    </div>
                    <div class="claim-prize" v-else>
                      <!-- <img width="80" src="../../../assets/images/promotion/hotpromo/p4w-roulette-toto/time.svg" />-->
                      <div class="claim-prize-text">
                        Congratulations on completing this event! More activities will be launched soon!!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="rouletteDetails.percentage !== 100" class="progress-container">
              <div class="progress">
                <div class="prog">
                  {{ rouletteDetails.percentage ? parseFloat(rouletteDetails.percentage).toFixed(2) : 0 }}%
                </div>
              </div>
              <div class="progressbar">
                <div class="outerProgress">
                  <div
                    class="innerProgress"
                    :style="`width: ${rouletteDetails.percentage ? rouletteDetails.percentage : 0}%`"
                  ></div>
                </div>
              </div>
              <div class="progress-text">1 time deposit can draw it</div>
            </div>
            <div class="go-btn-wrapper" v-if="isModal">
              <q-btn to="/account/personal" class="go-btn" style="max-width: 100%">GO KYC</q-btn>
              <q-btn to="/finance/deposit" class="go-btn" style="max-width: 100%">GO Deposit</q-btn>
            </div>
          </div>
        </div>
      </q-dialog>
      <q-dialog v-model="spinWheelProgressModalVisible">
        <div style="width: 90%">
          <SpinWheelProgress
            style="background: transparent"
            :prize="rouletteDetails.prize"
            :progress="rouletteDetails.progress"
            :isEligibleClaimPrize="rouletteDetails.prize && !fullyRedeemed && rouletteDetails.progress === 100"
            :helpersList="rouletteDetails.helperDetails"
          />
          <SpinWheelInviteBtn />
        </div>
      </q-dialog>
    </template>
  </template>
  <template v-else>
    <div v-if="rouletteDetailsLoaded" class="roulette">
      <SpinWheelProgress
        :prize="rouletteDetails.prize"
        :progress="rouletteDetails.progress"
        :isEligibleClaimPrize="rouletteDetails.prize && !fullyRedeemed && rouletteDetails.progress === 100"
        :helpersList="rouletteDetails.helperDetails"
      />

      <div class="spinwheel" style="background: transparent">
        <div class="spin-container">
          <div class="spin-wheel">
            <div class="spin-wheel-bg">
              <img class="glow" src="../../../assets/images/promotion/hotpromo/p4w-roulette-toto/spin-glow.png" />
              <img class="bot" src="../../../assets/images/promotion/hotpromo/p4w-roulette-toto/spin-bot.png" />
            </div>
            <div class="wheel-wrapper">
              <div class="wheel-pointer">
                <img src="../../../assets/images/promotion/hotpromo/p4w-roulette-toto/toparrow.png" />
              </div>
              <div class="wheel-bg" :style="`transform: rotate(${wheelDeg}deg)`" @click="onClickRotate">
                <div class="prize-list">
                  <div class="prize-item-wrapper" v-for="(item, index) in prizeList" :key="index">
                    <div class="prize-item" :style="`transform: rotate(${(360 / prizeList.length) * index}deg)`" />
                  </div>
                </div>
              </div>
              <div v-if="freeze" :class="{ freeze: freeze }">
                <div style="position: absolute">
                  <div class="claim-prize" v-if="!fullyRedeemed && !rouletteDetails.hasSpinRoulette">
                    <img
                      class="cash"
                      width="80"
                      src="../../../assets/images/promotion/hotpromo/p4w-roulette-toto/coins.svg"
                    />
                    <div class="claim-prize-text">{{ prizeResult }}</div>
                  </div>
                  <div class="claim-prize" v-else>
                    <!--<img width="80" src="../../../assets/images/promotion/hotpromo/p4w-roulette-toto/time.svg" /> -->
                    <div v-if="rouletteDetails.progress === 100" class="claim-prize-text">
                      Congratulations on completing this event! More activities will be launched soon!!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="expiration-text" v-if="rouletteDetails.prize && !fullyRedeemed">
            <span v-if="days > 0 && hours > 0 && minutes > 0 && seconds > 0">
              Expiration in {{ days }} days {{ `${hours}:${minutes}:${seconds}` }}
            </span>
            <span v-else>Expired</span>
          </div>
        </div>
      </div>
      <SpinWheelInviteBtn />
      <SpinWheelTermsCondition />
    </div>
  </template>
</template>
<script setup id="SpinWheelModal">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { spinWheelProgress, spinRoulette } from "src/api/index/promo";
import SpinWheelProgress from "./SpinWheelProgress.vue";
import SpinWheelTermsCondition from "./SpinWheelTermsCondition.vue";
import SpinWheelInviteBtn from "./SpinWheelInviteBtn.vue";
import { userStore } from "src/stores";
import { useQuasar } from "quasar";
var qs = require("qs");

const props = defineProps(["isModal"]);
const emits = defineEmits(["spinWheelOnClose"]);

const spinWheelModalVisible = ref(false);
const spinWheelProgressModalVisible = ref(false);

// Define reactive refs using the ref function
const rouletteDetailsLoaded = ref(false);
const freeze = ref(false);
const fullyRedeemed = ref(false);
const rolling = ref(false);
const wheelDeg = ref(0);
const prizeNumber = ref(8);
const $q = useQuasar();

const prizeListOrigin = ref([
  // Your prize list items
  {
    name: "P288",
    rollover: 3
  },
  {
    name: "iPhone Pro Max",
    rollover: -1
  },
  {
    name: "P588",
    rollover: 3
  },
  {
    name: "P888",
    rollover: 3
  },
  {
    name: "P1888",
    rollover: 3
  },
  {
    name: "Induction Cooker",
    rollover: -1
  },
  {
    name: "P2888",
    rollover: 3
  },
  {
    name: "iPhone 15 Pro",
    rollover: -1
  }
]);

const days = ref(0);
const hours = ref("00");
const minutes = ref("00");
const seconds = ref("00");

const spinWheelHideHandler = () => {
  emits("spinWheelOnClose");
};

const calculateTimeLeft = () => {
  if (!rouletteDetails.value.eventEndTime) {
    return;
  }
  const endTime = new Date(rouletteDetails.value.eventEndTime).getTime();
  const now = new Date().getTime();
  const timeDifference = endTime - now;

  days.value = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  hours.value = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    .toString()
    .padStart(2, "0");
  minutes.value = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))
    .toString()
    .padStart(2, "0");
  seconds.value = Math.floor((timeDifference % (1000 * 60)) / 1000)
    .toString()
    .padStart(2, "0");
};

// Computed property using the computed function
const prizeList = computed(() => prizeListOrigin.value.slice(0, prizeNumber.value));

// Method to handle rotation
const onClickRotate = () => {
  if (!store.token) {
    $q.notify({
      color: "negative",
      position: "top",
      message: "Login to join the lucky draw",
      icon: "report_problem"
    });
    return;
  }
  if (!Number(rouletteDetails.value.totalDeposit) || Number(rouletteDetails.value.totalDeposit) < 299) {
    $q.notify({
      color: "negative",
      position: "top",
      message: "You have not met the requirements to make a spin",
      icon: "report_problem"
    });
    return;
  }
  if (rouletteDetails.value.prize) {
    $q.notify({
      color: "negative",
      position: "top",
      message: "You have already won a prize",
      icon: "report_problem"
    });
    return;
  }

  if (rolling.value) {
    return;
  }

  const getIndexByName = (name) => {
    return prizeListOrigin.value.findIndex((item) => item.name === name);
  };

  spinRoulette(
    qs.stringify({
      promoCode: "P4W-ROULETTE-TOTO"
    })
  ).then((res) => {
    if (res.code === 0) {
      // Usage example
      const result = getIndexByName(res.data.prize);
      roll(result);
    }
  });
};
const prizeResult = ref("");
// Inside the roll function
const roll = (result) => {
  rolling.value = true;
  const wheelDegValue = wheelDeg.value;
  const prizeListValue = prizeList.value;

  // Ensure prizeListValue is defined and result is within a valid range
  if (prizeListValue && prizeListValue[result]) {
    const length = prizeListValue.length;
    const newWheelDeg = wheelDegValue - (wheelDegValue % 360) + 6 * 360 + (360 - (360 / length) * result);

    // Update the reactive wheelDeg value
    wheelDeg.value = newWheelDeg;

    setTimeout(() => {
      rolling.value = false;
      freeze.value = true;
      prizeResult.value = prizeListValue[result].name;
      spinWheelProgressModalVisible.value = true;
      getSpinRoulette();
      //   alert("Result：" + prizeListValue[result].name);
    }, 4500);
  }
};
const rouletteDetails = ref([]);
const getSpinRoulette = () => {
  // debugger;
  return new Promise((resolve, reject) => {
    if (!store.token) {
      rouletteDetailsLoaded.value = true;
      return resolve();
    }
    return spinWheelProgress("P4W-ROULETTE-TOTO")
      .then((res) => {
        if (res.code === 0) {
          rouletteDetails.value = res.data;

          // if (!rouletteDetails.value.showRoulettePopup && props.isModal) {
          //   return resolve();
          // }

          if (rouletteDetails.value.hasSpinRoulette) {
            // spinWheelProgressModalVisible.value = true;
          } else {
            spinWheelModalVisible.value = true;
          }

          if (rouletteDetails.value.progress === 100) {
            fullyRedeemed.value = true;
            freeze.value = true;
          } else {
            if (rouletteDetails.value.hasSpinRoulette) {
              prizeResult.value = rouletteDetails.value.prize;
              freeze.value = true;
            }
          }
          rouletteDetails.value.percentage =
            (rouletteDetails.value.totalDeposit / rouletteDetails.value.requiredAmount) * 100;

          if (rouletteDetails.value.totalDeposit > rouletteDetails.value.requiredAmount) {
            rouletteDetails.value.percentage = 100;
          }
          rouletteDetailsLoaded.value = true;

          // if (rouletteDetails.value.prize) {
          //   spinWheelProgressModalVisible.value = true;
          // }

          interval.value = setInterval(calculateTimeLeft, 1000);

          return resolve(true);
        } else {
          return resolve();
        }
      })
      .catch((err) => {
        console.log(err);
        return resolve();
      });
  });
};
const store = userStore();

const interval = ref();

onMounted(() => {
  if (!props.isModal) {
    getSpinRoulette();
  }
});

onUnmounted(() => {
  clearInterval(interval.value);
});

defineExpose({
  getSpinRoulette
});
</script>
<style lang="scss">
.roulette {
  width: 100%;
}

.expiration-text {
  font-size: 14px;
  font-weight: 700;
  text-align: center;
}

.spin-wheel {
  position: relative;
}

.spin-container {
  .spin-title {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .spin-wheel {
    .spin-wheel-bg {
      overflow: hidden;
      position: relative;
      text-align: center;

      img {
        width: 100%;
        // margin-top: -100px;
        // margin-bottom: -50px;
      }

      .glow {
        animation: rotate 5s infinite ease-in-out;
        max-width: 500px;
      }

      .bot {
        position: absolute;
        bottom: 0px;
        left: 0;
        max-width: 400px;
        right: 0;
        margin: auto;
      }
    }

    @keyframes rotate {
      0% {
        transform: rotate(0deg) scale(1);
      }

      25% {
        transform: rotate(180deg) scale(1);
      }

      50% {
        transform: rotate(360deg) scale(1.2);
      }

      75% {
        transform: rotate(180deg) scale(1.2);
      }

      100% {
        transform: rotate(0deg) scale(1);
      }
    }

    .wheel-wrapper {
      width: 300px;
      height: 300px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      .claim-prize {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;
        margin: auto;
        width: 80%;

        .claim-prize-text {
          color: #fff;
          font-size: 20px;
          white-space: pre-wrap;
          word-wrap: break-word;
          text-align: center;
        }
      }
    }

    .wheel-pointer {
      width: 30px;
      height: 30px;

      position: absolute;
      left: 50%;
      top: 9%;
      transform: translate(-50%, -50%);
      z-index: 10;

      img {
        width: 100%;
      }
    }

    .wheel-bg {
      width: 824px;
      height: 824px;
      max-width: 100%;
      max-height: 100%;
      border-radius: 1000px;
      transition: transform 4s ease-in-out;
      background: url(../../../assets/images/promotion/hotpromo/p4w-roulette-toto/spin-wheel-bg.png);
      background-size: cover;
    }

    .freeze {
      background: url(../../../assets/images/promotion/hotpromo/p4w-roulette-toto/circle.png) no-repeat center center;
      background-size: 90%;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      z-index: 11;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: Poppins Bold;

      &:after {
        content: "";
      }
    }

    .prize-list {
      width: 100%;
      height: 100%;
      position: relative;
      text-align: center;
    }

    .prize-item-wrapper {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 150px;
      height: 150px;
    }

    .prize-item {
      width: 100%;
      height: 100%;
      transform-origin: bottom;

      .prize-name {
        padding: 16px 0;
      }

      .prize-icon {
      }
    }
  }
}

.progress-container {
  margin: 20px auto;
  width: 90%;
  .progress {
    text-align: center;
    font-size: 14px;
    margin-bottom: -20px;
    color: #ffffff;
    .prog {
      word-wrap: normal;
    }
  }
  .progressbar {
    width: 100%;
    height: 20px;
    border-radius: 86px;
    overflow: hidden;
    .outerProgress {
      background: #92acd266;
      width: 100%;
      height: 100%;
      .innerProgress {
        background: #49ace7;
        width: 10%;
        border-radius: 86px;
        height: 100%;
      }
    }
  }
  .progress-text {
    color: #3887ff;
    font-size: 18.56px;
    font-weight: 400;
    line-height: 20.38px;
    text-align: center;
    margin-top: 5px;
  }
}
.spin-progress {
  margin: -20px -50px;
  background: #ffffff;
  padding: 20px 50px;
  border-radius: 12px;
  color: #000000;

  .spin-title {
    display: flex;
    font-family: Poppins Bold;
    gap: 5px;
    align-items: center;

    img {
      width: 15px;
    }
  }

  .congrats-message {
    color: #3887ff;
    font-size: 20px;
    text-align: center;
    padding: 20px 0;
  }

  .amountwon {
    color: #2b2b82;
    font-family: Poppins Bold;
    font-size: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 25px;
  }

  .progress-container {
    margin: 20px 0;

    .progress {
      text-align: right;
    }

    .progressbar {
      width: 100%;
      height: 10px;
      border-radius: 86px;
      overflow: hidden;

      .outerProgress {
        background: #92acd266;
        width: 100%;
        height: 100%;

        .innerProgress {
          background: #5406e8;
          width: 10%;
          border-radius: 86px;
          height: 100%;
        }
      }
    }
  }

  .helpercontainer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    width: 100%;

    .helperdetails {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      width: 100%;

      .helpername {
        color: #92acd2;
      }

      .helperprogress {
        color: #3887ff;
        display: flex;
        gap: 20px;

        img {
          width: 18px;
        }
      }
    }
  }
}

.body--dark {
  .spin-container {
    .spin-title {
      background-image: linear-gradient(180deg, #feffd4 0%, #3dc3e0 100%);
      background-size: 100%;
      background-repeat: repeat;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      -moz-background-clip: text;
      -moz-text-fill-color: transparent;
      font-family: Baloo Bhaina;
      font-size: 60px;
      line-height: 64px;
      margin: 0 auto;
      text-align: center;
    }

    .spin-wheel {
      .wheel-bg {
        width: 100%;
        height: 100%;
        border-radius: 1000px;
        transition: transform 4s ease-in-out;
        background: url(../../../assets/images/promotion/hotpromo/p4w-roulette-toto/spin-wheel-bg-dark.png);
        background-size: cover;
      }
    }

    .go-btn {
      background: linear-gradient(to right, #ebdf02 0%, #e84901 100%);
      box-shadow: none;
      border-radius: 20px;
      color: #fff;
      padding: 0px 15px;
    }
  }

  .expiration-text {
    color: #fff;
  }
}

.go-btn-wrapper {
  height: 75px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}

.go-btn {
  display: flex;
  margin: 0 auto;
  background: linear-gradient(270deg, #76b5fa 0%, #fff 44.79%, #76b5fa 100%);
  box-shadow: 0px -4px 4px 0px #2b74b0 inset, -1px 2px 4px 0px rgba(255, 255, 255, 0.8) inset;
  border-radius: 20px;
  color: #15599a;
  font-weight: 700;
  min-width: 150px;
  font-size: 16px;
}

.body--dark {
  .go-btn-wrapper {
    .go-btn {
      background: linear-gradient(to right, #ebdf02 0%, #e84901 100%);
      box-shadow: none;
      border-radius: 20px;
      color: #fff;
      padding: 0px 15px;
    }
  }
}
</style>
