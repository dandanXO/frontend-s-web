<template>
  <div v-if="rouletteDetailsLoaded" class="roulette">
    <div
      v-if="!hasWonPrize && (!rouletteDetails.prize || !props.isModal)"
      class="spin-container"
      :class="{ modal: props.isModal }"
    >
      <div v-if="props.isModal" class="spin-title">LUCKY SPINNING PROMOTION</div>
      <div v-if="props.isModal" class="rewards-list">
        <div class="reward-title">Rewards list</div>
        <div class="reward-item" v-for="(reward, i) in prizeListOrigin" :key="i">
          <img :src="require(`../assets/images/promotion/spinwheel/reward-${i + 1}.png`)" />
          {{ reward.label }}
        </div>
      </div>
      <div class="spin-wheel">
        <div class="spin-wheel-bg">
          <img class="glow" src="../assets/images/promotion/spinwheel/spin-glow.png" />
          <img class="bot" src="../assets/images/promotion/spinwheel/spin-bot.png" />
        </div>
        <div class="wheel-wrapper">
          <img @click="minimizeModal()" src="../assets/images/promotion/adsPopupList/close-btn.png" class="close-btn" />
          <div class="wheel-pointer"><img src="../assets/images/promotion/spinwheel/toparrow.png" /></div>
          <div class="wheel-bg" @click="onClickRotate" :style="`transform: rotate(${wheelDeg}deg)`">
            <div class="prize-list">
              <div class="spin-btn">
                <img style="width: 100%" src="../assets/images/promotion/adsPopupList/spin-btn.png" />
              </div>
              <div class="prize-item-wrapper" v-for="(item, index) in prizeList" :key="index">
                <div class="prize-item" :style="`transform: rotate(${(360 / prizeList.length) * index}deg)`">
                  <!-- <div class="prize-name">
                    {{ item.name }}
                  </div>
                  <div class="prize-icon">
                    <img :src="item.icon" />
                  </div> -->
                </div>
              </div>
            </div>
          </div>
          <div v-if="freeze" :class="{ freeze: freeze }">
            <div class="spinned" v-if="fullyRedeemed">
              <!-- <img src="../assets/images/promotion/spinwheel/time.svg" />-->
              Congratulations on completing this event! More activities will be launched soon!!
            </div>
            <div class="unspinned" v-else style="position: absolute">
              <img src="../assets/images/promotion/spinwheel/coins.svg" />
              {{ prizeResult }}
            </div>
          </div>
        </div>
      </div>

      <div v-if="rouletteDetails.percentage !== 100 && props.isModal" class="progress-container">
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
        <div class="progress-text">
          1 time deposit can draw it
          <!-- Accumulating deposit {{rouletteDetails.requiredAmount}} to join lucky spin：{{rouletteDetails.totalDeposit}}/{{rouletteDetails.requiredAmount }} -->
        </div>
      </div>
      <div v-if="props.isModal" class="spin-buttons">
        <div class="go-btn">
          <div to="/center/personal" v-if="!prizeResult" @click="goPersonal">GO KYC</div>
          <div v-if="!prizeResult" @click="goDeposit()">GO Deposit</div>
        </div>
      </div>
    </div>
    <div v-if="rouletteDetails.prize && !fullyRedeemed">
      <div v-if="!props.isModal" class="timeleft">
        <span v-if="days > 0 && hours > 0 && minutes > 0 && seconds > 0">
          Expiration in {{ days }} days {{ `${hours}:${minutes}:${seconds}` }}
        </span>
        <span v-else>Expired</span>
      </div>

      <div class="spin-progress" :class="{ modal: props.isModal }">
        <div v-if="props.isModal" class="spin-title">
          <img src="../assets/images/promotion/spinwheel/cash.svg" />
          Please receive your reward
        </div>
        <div v-if="props.isModal" class="congrats-message">Congratulations! Lucky star, you win!!</div>
        <div class="amountwon">
          <img src="../assets/images/promotion/spinwheel/cash.svg" />
          {{ rouletteDetails.prize }}
        </div>
        <div class="progress-container">
          <div class="progress">
            <div class="prog" :style="`width: ${rouletteDetails.progress ? rouletteDetails.progress : 0}%`">
              {{ rouletteDetails.progress ? rouletteDetails.progress : 0 }}%
            </div>
          </div>
          <div class="progressbar">
            <div class="outerProgress">
              <div
                class="innerProgress"
                :style="`width: ${rouletteDetails.progress ? rouletteDetails.progress : 0}%`"
              ></div>
            </div>
          </div>
        </div>
        <div class="helpercontainer" v-if="rouletteDetails.helperDetails && rouletteDetails.helperDetails.length > 0">
          <span class="helperdetails" v-for="helper in rouletteDetails.helperDetails">
            <div class="helpername">
              {{ helper.loginName }}
            </div>
            <div class="helperprogress">
              + {{ helper.progress }} %
              <!--              <img src="../assets/images/promotion/spinwheel/cash.svg" />-->
            </div>
          </span>
        </div>
      </div>
      <div class="shareinvitebtn" style="cursor: pointer" @click="isShareModal = true">
        <img src="../assets/images/promotion/spinwheel/invitebtn.svg" />
      </div>
    </div>
    <a-modal
      :footer="null"
      :width="450"
      :mask-closable="false"
      destroy-on-close
      centered
      v-model:visible="isShareModal"
      class="share"
    >
      <div class="share-title">Invite more friends to help you claim!!</div>
      <div class="share-icons">
        <div class="iconshare messenger">
          <img src="../assets/images/promotion/spinwheel/messenger.svg" />
          Messenger
        </div>
        <div class="iconshare telegram">
          <img src="../assets/images/promotion/spinwheel/telegram.svg" />
          Telegram
        </div>
        <div class="iconshare viber">
          <img src="../assets/images/promotion/spinwheel/viber.svg" />
          Viber
        </div>
      </div>
      <div class="copy-share-link">
        <div class="design"></div>
        <input ref="copyinput" v-model="referralLink" />
        <span class="copy-icon" @click="copyCode">
          <img src="../assets/images/promotion/spinwheel/copy.svg" />
        </span>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, defineExpose, defineProps, defineEmits } from "vue";
import { getReferralLink } from "@/api/personal/share";
import { spinRoulette, spinWheelProgress } from "../api/index/promo";
import { userStore } from "@/store";
import { message } from "ant-design-vue";
import { useRoute, useRouter } from "vue-router";
const props = defineProps(["rouletteDetails", "isModal"]);
const emit = defineEmits();
const referralLink = ref("");
const copyinput = ref(null);
const isShareModal = ref(false);
// Define reactive refs using the ref function
const rouletteDetailsLoaded = ref(false);
const freeze = ref(false);
const rolling = ref(false);
const wheelDeg = ref(0);
const prizeNumber = ref(8);

const prizeResult = ref("");
const hasWonPrize = ref(false);
const prizeListOrigin = ref([
  // Your prize list items
  {
    name: "iPhone Pro Max",
    label: "iPhone Pro Max",
    rollover: -1
  },
  {
    name: "iPhone 15 Pro",
    label: "iPhone 15 Pro",
    rollover: -1
  },
  {
    name: "Induction Cooker",
    label: "Induction Cooker",
    rollover: -1
  },
  {
    name: "P2888",
    label: "₱2888",
    rollover: 3
  },
  {
    name: "P1888",
    label: "₱1888",
    rollover: 3
  },
  {
    name: "P888",
    label: "₱888",
    rollover: 3
  },
  {
    name: "P588",
    label: "₱588",
    rollover: 3
  },
  {
    name: "P288",
    label: "₱288",
    rollover: 3
  }
]);

// Computed property using the computed function
const prizeList = computed(() => prizeListOrigin.value.slice(0, prizeNumber.value));

// Method to handle rotation
const onClickRotate = () => {
  if (!store.token) {
    message.warning("Login to join the lucky draw", 5);
    return;
  }
  if (!Number(rouletteDetails.value.totalDeposit) || Number(rouletteDetails.value.totalDeposit) < 299) {
    message.warning("You have not met the requirements to make a spin", 5);
    return;
  }
  if (rouletteDetails.value.prize) {
    message.warning("You have already won a prize", 5);
    return;
  }
  if (rolling.value) {
    return;
  }
  //   const result = Math.floor(Math.random() * prizeList.value.length);

  //     // Usage example
  //     const result = getIndexByName(res.prize);
  //     roll(result);
  //   }
  const getIndexByName = (name) => {
    return prizeListOrigin.value.findIndex((item) => item.name === name);
  };
  spinRoulette("P4W-ROULETTE-TOTO").then((res) => {
    if (res.code === 0) {
      // Usage example
      const result = getIndexByName(res.data.prize);
      roll(result);
    }
  });
};
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
      getSpinRoulette();
      //   alert("Result：" + prizeListValue[result].name);
    }, 4500);
  }
};

const store = userStore();
// Fetch initial data or perform setup on component mount
const rouletteDetails = ref([]);
const fullyRedeemed = ref(false);
const getSpinRoulette = () => {
  return new Promise((resolve, reject) => {
    if (!store.token) {
      rouletteDetailsLoaded.value = true;
      hasWonPrize.value = false;
      return resolve();
    }

    return spinWheelProgress("P4W-ROULETTE-TOTO")
      .then((res) => {
        if (res.code === 0) {
          rouletteDetails.value = res.data;

          if (rouletteDetails.value.progress === 100) {
            fullyRedeemed.value = true;
            freeze.value = true;
            emit("modalVisible", "close");
          } else {
            if (rouletteDetails.value.hasSpinRoulette) {
              prizeResult.value = rouletteDetails.value.prize;
              freeze.value = true;
            }
            if (props.isModal && rouletteDetails.value.progress !== 100) {
              // if (Number(rouletteDetails.value.totalDeposit) > 299) {
              //   emit("modalVisible");
              //   rouletteDetailsLoaded.value = true;
              //   return resolve(props.isModal);
              // }
              emit("modalVisible");
              rouletteDetails.value.percentage =
                (rouletteDetails.value.totalDeposit / rouletteDetails.value.requiredAmount) * 100;

              if (rouletteDetails.value.totalDeposit > rouletteDetails.value.requiredAmount) {
                rouletteDetails.value.percentage = 100;
              }
              rouletteDetailsLoaded.value = true;
              return resolve(props.isModal);
            }
          }

          rouletteDetailsLoaded.value = true;
        }

        return resolve();
      })
      .catch((err) => {
        console.log(err);
        return resolve();
      });
  });
};
const route = useRoute();
const router = useRouter();
const minimizeModal = () => {
  emit("modalVisible", "close");
  if (!isFromRegister.value) {
    if (rouletteDetails.totalDeposit > 0) {
      router.push("/promotion");
    }
  }
};

const goPersonal = () => {
  emit("modalVisible", "close");
  sessionStorage.setItem("IS_GO_PAGE", "1");
  router.push("/center/personal");
};

const goDeposit = () => {
  emit("modalVisible", "close");
  sessionStorage.setItem("IS_GO_PAGE", "1");
  router.push("/center/top-up");
};

const isFromRegister = ref(false);
const ifFromReg = () => {
  if (route.query && route.query.isFromRegister === true) {
    isFromRegister.value = true;
  }
};
const getReferral = () => {
  getReferralLink()
    .then((res) => {
      if (res.code === 0) {
        referralLink.value = `${location.origin}/refer/${res.data}`;
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
const copyCode = () => {
  const copyText = copyinput.value;
  copyText.select();
  document.execCommand("copy");
};
const days = ref(0);
const hours = ref("00");
const minutes = ref("00");
const seconds = ref("00");

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

onMounted(() => {
  if (store.token) {
    getReferral();
    calculateTimeLeft();
    setInterval(calculateTimeLeft, 1000);
    ifFromReg();
  }
});
defineExpose({
  getSpinRoulette
});
</script>

<style lang="scss">
.roulette {
  display: flex;
  justify-content: center;
  align-items: center;
}
.ant-modal-mask {
  background: rgba(0, 0, 0, 0.85);
}
.ant-modal.spinwheel {
  .ant-modal-content {
    max-width: 500px;
    margin: 0 auto;
    background: unset;
    box-shadow: none;
    .spin-container {
      .rewards-list {
        position: absolute;
        left: 120%;
        width: 280px;
        background: #15141a;
        .reward-title {
          font-family: "Inter Medium";
          font-size: 18px;
          line-height: 40px;
          padding: 5px 0 15px 0;
          margin-top: -30px;
          text-align: center;
          font-weight: bold;
          background: url(../assets/images/promotion/spinwheel/rewardtitle.png) no-repeat center center;
          background-size: cover;
        }
        .reward-item {
          border-bottom: 1px solid #83a3ca1a;
          text-align: center;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 90%;
          margin: 0 auto;
          color: #92acd2;
          font-size: 18px;
        }
      }
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
        margin: 25px auto;
        text-align: center;
      }
      .spin-wheel {
        .spin-wheel-bg {
          position: relative;
          text-align: center;
          img {
            width: 100%;
            // margin-top: -100px;
            // margin-bottom: -50px;
          }
          .glow {
            animation: rotate 10s infinite ease-out;
            max-width: 500px;
            margin-top: -50px;
            width: 130%;
            margin-left: -5%;
          }
          .bot {
            position: absolute;
            bottom: 50px;
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
          100% {
            transform: rotate(3600deg) scale(1);
          }
        }
        .wheel-wrapper {
          width: 300px;
          height: 300px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          .close-btn {
            position: absolute;
            right: -50px;
            top: -50px;
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
          width: 100%;
          height: 100%;
          border-radius: 1000px;
          transition: transform 4s ease-out;
          background: url(../assets/images/promotion/spinwheel/spinwheelface-w.png);
          background-size: cover;
          cursor: pointer;
        }
        .freeze {
          background: url(../assets/images/promotion/spinwheel/circle.png) no-repeat center center;
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
          .spin-btn {
            position: absolute;
            left: 42%;
            bottom: 42%;
            margin: auto;
            width: 50px;
          }
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
      .spin-buttons {
        height: 75px;
        position: relative;
        .go-btn {
          position: absolute;
          z-index: 9;
          top: 0;
          display: flex;
          width: 100%;
          gap: 20px;
          div {
            background: linear-gradient(270deg, #e84600 0%, #e8df00 100%);
            display: block;
            cursor: pointer;
            padding: 20px 50px;
            background-size: contain;
            text-align: center;
            font-family: Inter Bold;
            width: 100%;
            border-radius: 25px;
            padding: 15px 20px;
            &:hover {
              color: #000000;
            }
          }
        }
      }
    }
    .timeleft {
      color: #222222;
      font-size: 25px;
      width: 100%;
      text-align: center;
      margin: 10px auto;
    }
    .progress-container {
      margin: 20px 0;
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
          .prog {
            word-wrap: normal;
          }
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
        height: 150px;
        overflow: auto;
        gap: 15px;
        padding: 0 20px;
        margin: 30px 0;
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
    .shareinvitebtn {
      width: 80%;
      margin: 40px auto;
      img {
        width: 100%;
      }
    }
  }
}

.spin-container {
  width: 750px;
  position: relative;
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
    .spin-wheel-bg {
      position: relative;
      text-align: center;
      img {
        width: 100%;
        // margin-top: -100px;
        // margin-bottom: -50px;
      }
      .glow {
        animation: rotate 10s infinite ease-out;
        margin-top: 0;
        width: 100%;
      }
      .bot {
        position: absolute;
        bottom: 50px;
        left: 0;
        right: 0;
        margin: auto;
      }
    }

    @keyframes rotate {
      0% {
        transform: rotate(0deg) scale(1);
      }
      100% {
        transform: rotate(3600deg) scale(1);
      }
    }

    .wheel-wrapper {
      width: 500px;
      height: 500px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      .close-btn {
        //display: none;
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
      width: 100%;
      height: 100%;
      border-radius: 1000px;
      transition: transform 4s ease-in-out;
      background: url(../assets/images/promotion/spinwheel/spinwheelface-w.png);
      background-size: cover;
    }
    .freeze {
      background: url(../assets/images/promotion/spinwheel/circle.png) no-repeat center center;

      background-size: 95%;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      z-index: 11;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: Poppins Bold;
      color: #ffffff;
      flex-direction: column;
      .spinned {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #ffffff;
        flex-direction: column;
        gap: 10px;
      }
      .unspinned {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #ffffff;
        flex-direction: column;
        gap: 10px;
        font-size: 60px;
      }
      &:after {
        content: "";
      }
    }

    .prize-list {
      width: 100%;
      height: 100%;
      position: relative;
      text-align: center;
      .spin-btn {
        position: absolute;
        left: 40%;
        bottom: 40%;
        margin: auto;
        width: 100px;
      }
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
  // .spin-buttons {
  //   height: 75px;
  //   position: relative;
  //   .go-btn {
  //     width: 100%;
  //     position: absolute;
  //     z-index: 9;
  //     top: 0;
  //     background: url(../assets/images/promotion/spinwheel/gobtn.png) no-repeat center center;
  //     padding: 15px 20px;
  //     background-size: contain;
  //     text-align: center;
  //     font-family: Inter Bold;
  //     cursor: pointer;
  //     display: block;
  //     &:hover {
  //       color: #000000;
  //     }
  //   }
  // }
}
.timeleft {
  color: #222222;
  font-size: 25px;
  width: 100%;
  text-align: center;
  margin: 10px auto;
}
.spin-progress {
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
      .prog {
        word-wrap: normal;
      }
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
    height: 150px;
    overflow: auto;
    gap: 15px;
    padding: 0 20px;
    margin: 30px 0;
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
.shareinvitebtn {
  width: 80%;
  margin: 45px auto;
  img {
    width: 100%;
    &.isdark {
      display: none;
    }
    &.islight {
      display: block;
    }
  }
}
.dark-theme {
  .ant-modal.spinwheel {
    .ant-modal-content {
      .spin-container {
        .spin-wheel {
          .wheel-bg {
            background-image: url(../assets/images/promotion/spinwheel/spinwheelface.png);
          }
        }
      }
      .timeleft {
        color: #ffffff;
      }
      .spin-progress {
        background: #15141a;
        color: #ffffff;
        .amountwon {
          color: #ffffff;
        }
      }
      .shareinvitebtn {
        img {
          width: 100%;
          &.isdark {
            display: block;
          }
          &.islight {
            display: none;
          }
        }
      }
    }
  }
}
.dark-theme {
  .spin-container {
    .spin-wheel {
      .wheel-bg {
        background-image: url(../assets/images/promotion/spinwheel/spinwheelface.png);
      }
    }
  }
  .timeleft {
    color: #ffffff;
  }
  .spin-progress {
    background: #ffffff0d;

    color: #ffffff;
    .amountwon {
      color: #ffffff;
    }
  }
}
.share.ant-modal {
  .ant-modal-content .ant-modal-body {
    padding: 24px;
    margin: 0;
  }
  .share-title {
    font-family: Poppins Bold;
    font-size: 16px;
  }
  .share-icons {
    display: flex;
    gap: 10px;
    margin: 40px auto;
    justify-content: space-between;
    width: 100%;
    .iconshare {
      display: flex;
      flex-direction: column;
      gap: 5px;
      justify-content: center;
      align-items: center;
      color: #8aa0c6;

      img {
        width: 80%;
      }
    }
  }
  .copy-share-link {
    border: 1px solid #d9d9d9;
    border-radius: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    input {
      border: 0;
      height: 40px;
      width: 100%;
      background: transparent;
    }
  }
}
</style>
