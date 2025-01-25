<template>
  <div v-if="showRoulette" class="spin-wheel-container">
    <div :class="`draw-btn click-pointer ${spinButtonDisable ? 'disabled' : ''}`" @click="spinWheel">
      <img v-if="languageVal === 'en'" class="spin-btn" src="./../../../assets/images/promotion/hotpromo/refer-spinwheel/click-spin-btn-en.png" />
      <img v-else class="spin-btn" src="./../../../assets/images/promotion/hotpromo/refer-spinwheel/click-spin-btn-bn.png" />
      <img class="hand" v-if="!spinButtonDisable"
        src="./../../../assets/images/promotion/hotpromo/refer-spinwheel/hand.png" />
    </div>
    <div class="wheel-stage">
      <img src="./../../../assets/images/promotion/hotpromo/refer-spinwheel/spin-wheel-stg.png" />
    </div>
    <div class="spin-wheel-board">
      <div class="spin-wheel-frame">
        <div id="spin-wheel-id" class="spin-wheel">
          <img v-if="languageVal === 'en'" id="spin-wheel-bg" class="wheel-bg"
            src="./../../../assets/images/promotion/hotpromo/new-user-roulette/spin-wheel-bg-en.png" />
          <img v-else id="spin-wheel-bg" class="wheel-bg"
            src="./../../../assets/images/promotion/hotpromo/new-user-roulette/spin-wheel-bg-bn.png" />
          <div id="spin-wheel-number" class="spin-wheel-number" style="display: none"></div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showRoulette" class="remaining-draw-wrapper">
    <div class="remaining-draw-text">
      {{ $t("hotPromo.referWheel.remainingDrawTimes") }}
      <span id="remaning-draw-amt">: {{ remainingDraws }}</span>
    </div>
  </div>

  <table class="content-table" border="0" cellpadding="8" cellspacing="0" width="100%" style="text-align: center" v-if="!hideRulesAndDesc">
    <thead>
      <tr>
        <th>{{ $t("hotPromo.newUserRoulette.timePeriod") }}</th>
        <th>{{ $t("hotPromo.newUserRoulette.numberOfPlaces") }}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>00:00-06:00</td>
        <td>30%</td>
      </tr>
      <tr>
        <td>06:00-12:00</td>
        <td>20%</td>
      </tr>
      <tr>
        <td>12:00-18:00</td>
        <td>25%</td>
      </tr>
      <tr>
        <td>18:00-24:00</td>
        <td>25%</td>
      </tr>
    </tbody>
  </table>

  <div class="sign-up-bonus-section" v-if="!hideRulesAndDesc">
    <img
      v-if="languageVal === 'en'"
      src="../../../assets/images/promotion/hotpromo/new-user-roulette/sign-up-bonus-title-en.png"
    />
    <img v-else src="../../../assets/images/promotion/hotpromo/new-user-roulette/sign-up-bonus-title-bn.png" />
    <p>
      {{ $t("hotPromo.newUserRoulette.signUpBonus1") }}
    </p>
    <p>
      {{ $t("hotPromo.newUserRoulette.signUpBonus2") }}
      <span style="color: #ff0000cc">18, 58, 88, 200, 300, 500 BDT</span>
      <span>{{ `. ` }}</span>
      {{ $t("hotPromo.newUserRoulette.signUpBonus3") }}
    </p>
    <!-- <p>{{ $t("hotPromo.newUserRoulette.signUpBonus4") }}</p>
    <p style="color: #ff9d00">
      {{ $t("hotPromo.newUserRoulette.signUpBonus5") }}
    </p> -->
  </div>
  <div class="activity-rule-section" v-if="!hideRulesAndDesc">
    <img
      v-if="languageVal === 'en'"
      src="../../../assets/images/promotion/hotpromo/new-user-roulette/activity-rule-en.png"
    />
    <img v-else src="../../../assets/images/promotion/hotpromo/new-user-roulette/activity-rule-bn.png" />
    <ul>
      <li>
        {{ $t("hotPromo.newUserRoulette.activityRule1") }}
      </li>
      <li>
        {{ $t("hotPromo.newUserRoulette.activityRule2") }}
      </li>
      <li>
        {{ $t("hotPromo.newUserRoulette.activityRule3") }}
      </li>
      <li>
        {{ $t("hotPromo.newUserRoulette.activityRule4") }}
      </li>
    </ul>
  </div>
  <q-dialog v-model="showPrizePopup" @hide="handleBtnClick" persistent>
    <div class="congrats-container">
      <q-btn icon="close" round dense v-close-popup class="congrats-close" />
      <div class="congrats-header">
        <img src="../../../assets/images/index/modal/congrats-header.png" />
      </div>
      <div class="congrats-content">
        <img src="../../../assets/images/index/modal/congrats-shine-bg.png" />
        <div class="congrats-highlight" :style="isNaN(prizePopupBonus) ? 'font-size: 20px;' : ''">
          <img :src="require(`../../../assets/images/promotion/hotpromo/new-user-roulette/bonus-${prizeIndex}.png`)" />
          {{
            !!prizePopupBonus ? (isNaN(prizePopupBonus) ? getPrizeTxt(prizePopupBonus) : `${prizePopupBonus} BDT`) : 0
          }}
        </div>
      </div>

      <div class="congrats-title">{{ $t("hotPromo.newUserRoulette.congratsOnSignUpBonus") }}</div>

      <div class="congrats-button-container">
        <q-btn no-caps unelevated class="congrats-btn" @click="handleBtnClick">
          {{ $t("btn.receive") }}
        </q-btn>
      </div>
    </div>
  </q-dialog>

  <BindEmailModal :bindEmailDialog="bindEmailDialog" @update:bindEmailDialog="bindEmailDialog = $event" />

  <q-dialog width="100%" v-model="changePhoneDialog">
    <div class="popout-dialog">
      <q-btn
        dense
        rounded
        icon="close"
        class="text-white popout-close"
        @click="changePhoneDialog = false"
        v-close-popup
      />
      <div class="popout-dialog-container">
        <div class="txt-title">{{ $t("form.bindPhoneNumber") }}</div>
        <div class="pc-form">
          <InputRowGrid>
            <template #fields>
              <InputField :label="$t('form.phone')">
                <template #input>
                  <q-input
                    type="tel"
                    pattern="\d*"
                    maxlength="11"
                    hide-bottom-space
                    ref="phoneRef"
                    v-model="updatePhoneInfo.phone"
                    :rules="[
                      (val) => (val && val.length > 0) || $t('form.phone_rules_01'),
                      (val) => (val && val.length >= 10 && val.length <= 11) || $t('form.phone_rules_02'),
                      (val) => val.startsWith('01') || $t('form.phone_rules_03')
                    ]"
                    label-color="brand"
                    outlined
                    color="green"
                    :placeholder="$t('form.phone')"
                  >
                    <template v-slot:prepend>
                      <FancyIcon name="smartphone" />
                      <div class="prepend-number">+880</div>
                    </template>
                  </q-input>
                </template>
              </InputField>
            </template>
          </InputRowGrid>
        </div>

        <div class="bottom-btn">
          <q-btn no-caps unelevated class="btn-primary btn-primary__full" @click="submitUpdatePhone">
            {{ $t("btn.confirm") }}
          </q-btn>
        </div>
      </div>
    </div>
  </q-dialog>
</template>
<script setup>
import { ref, onMounted, reactive } from "vue";
import { api, eventapi } from "src/boot/axios";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { userStore } from "src/stores";
import { useRouter } from "vue-router";
import { i18nStore } from "src/router/language";
import { storeToRefs } from "pinia";
import BindEmailModal from "src/components/modal/BindEmailModal.vue";
import InputRowGrid from "src/components/auth/InputRowGrid.vue";
import InputField from "src/components/auth/InputField.vue";
import FancyIcon from "src/components/auth/FancyIcon.vue";

const props = defineProps(["promocode", "hideRulesAndDesc"]);

const { t } = useI18n();
const $q = useQuasar();
const store = userStore();
const router = useRouter();
const { languageVal } = storeToRefs(i18nStore());
const qs = require("qs");

const spinButtonDisable = ref(false);
const remainingDraws = ref(0);
const prizePopupBonus = ref();
const prizeIndex = ref(0);
const degreesToStopAt = ref([]);
const showRoulette = ref(false);

const showPrizePopup = ref(false);
const bindEmailDialog = ref(false);
const changePhoneDialog = ref(false);
const hideRulesAndDesc = ref(props?.hideRulesAndDesc || false);

// spin wheel constants
const TOTAL_ITEMS = 8;
const DEFAUL_SPEED = 1;
const MAX_SPEED = 4;
const FULL_DEGREE = 360;
const SPIN_WHEEL_PRIZES = [18, 58, 88, 200, 300, 500, "bgd-roulette-deposit-get-18", "bgd-roulette-deposit-get-28"];

// spin wheel element refs
const spinBoardRef = ref();
const spinNumRef = ref();
const drawBtnRef = ref();

let finalDegree = 0;
let speed = 1;
var spinSchedule;
var degree;

const spin = (prizeIndex, stopCallback) => {
  spinBoardRef.value = document.getElementById("spin-wheel-bg");
  spinNumRef.value = document.getElementById("spin-wheel-number");
  drawBtnRef.value = document.querySelector(".draw-btn");

  spinButtonDisable.value = true;
  reset();

  spinSchedule = setInterval(() => {
    degree++;
    speed += 0.005;
    if (speed >= MAX_SPEED) speed = MAX_SPEED;

    finalDegree = (degree * speed) % 360;
    const transformValue = `rotate(${finalDegree}deg)`;
    spinBoardRef.value.style.transform = transformValue;
    spinNumRef.value.style.transform = transformValue;
  }, 1);

  // 5s + api return
  stopSpin(prizeIndex, stopCallback);
};

const reset = () => {
  degree = finalDegree % 360;
  speed = DEFAUL_SPEED;

  spinBoardRef.value.style.transition = "";
  spinNumRef.value.style.transition = "";
};

const stopSpin = (prizeIndex, stopCallback) => {
  let spinTimeEnd = false;
  let isApiReturned = true;
  setTimeout(() => {
    spinTimeEnd = true;
    attemptStopSpin();
  }, 5000);

  // stop spin variables
  const stopTime = 3;
  const stopSpinRound = 3 * 360;
  const endDegree = degreesToStopAt.value[prizeIndex].degree;

  const attemptStopSpin = () => {
    finalDegree = endDegree + stopSpinRound;

    if (spinTimeEnd && isApiReturned) {
      clearInterval(spinSchedule);

      const spinBoardRefStyle = spinBoardRef.value.style;
      const spinNumRefStyle = spinNumRef.value.style;

      const transitionTime = `transform ${stopTime}s ease-out`;
      const transformValue = `rotate(${finalDegree}deg)`;

      spinBoardRefStyle.transition = transitionTime;
      spinBoardRefStyle.transform = transformValue;

      spinNumRefStyle.transition = transitionTime;
      spinNumRefStyle.transform = transformValue;

      setTimeout(() => {
        spinButtonDisable.value = false;

        setTimeout(() => {
          stopCallback?.();
        }, 750);
      }, stopTime * 1000);
    }
  };
};

const phoneRef = ref();
const updatePhoneInfo = reactive({
  phone: ""
});

const submitUpdatePhone = () => {
  phoneRef.value.validate();

  if (!phoneRef.value.hasError) {
    api
      .post(
        "/session/account",
        qs.stringify({
          phone: updatePhoneInfo.phone
        })
      )
      .then((res) => {
        if (res.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: t("notify.phoneUpdatedSuccessfully"),
            icon: "check_circle_outline"
          });

          store
            .getMemberInfo()
            .then(() => {
              loadInfo();
            })
            .finally(() => {
              changePhoneDialog.value = false;
              updatePhoneInfo.phone = "";
            });
        } else {
          $q.notify({
            color: "negative",
            position: "top",
            message: res.message,
            icon: "report_problem"
          });
        }
      })
      .catch((error) => {});
  }
};

const getPrizeTxt = (prize) => {
  if (prize === "bgd-roulette-deposit-get-18") {
    return t("hotPromo.newUserRoulette.recharge100get18");
  } else if (prize === "bgd-roulette-deposit-get-28") {
    return t("hotPromo.newUserRoulette.recharge200get28");
  }
};
const handleBtnClick = () => {
  showPrizePopup.value = false;
  if (store.token) store.getBalance();
};

const spinWheel = () => {
  //FOr TesTING START
  // const res = {
  //   data: {
  //     showRoulette: "YES",
  //     spinChance: 1,
  //     hasUnusedCoupon: "NO",
  //     privilegeId: null
  //   }
  // };
  // var bonusIndex = 500;
  // prizeIndex.value = SPIN_WHEEL_PRIZES.findIndex((prize) => prize === bonusIndex);
  // showRoulette.value = res.data.showRoulette === "YES";
  // spin(prizeIndex.value, () => {
  //   showPrizePopup.value = true;
  //   prizePopupBonus.value = bonusIndex;
  //   remainingDraws.value = res.data.spinChance;
  // });
  // return;
  //FOr TesTING END
  if (spinButtonDisable.value === true) {
    return;
  }
  if (remainingDraws.value <= 0) {
    $q.notify({
      color: "negative",
      position: "top",
      message: t("hotPromo.newUserRoulette.remainingDrawTimes") + `: 0`,
      icon: "report_problem"
    });
    return;
  }
  eventapi
    .post(`/session/${props.promocode}/spin`)
    .then((res) => {
      if (res.code == 0) {
        prizePopupBonus.value = res.data.bonusName ? res.data.bonusName : res.data.bonusAmount;
        prizeIndex.value = SPIN_WHEEL_PRIZES.findIndex((prize) => prize === prizePopupBonus.value);
        spin(prizeIndex.value, () => {
          showPrizePopup.value = true;
          initSpinWheel();
        });
      } else if (res.code == 582301) {
        $q.notify({
          color: "negative",
          position: "top",
          message: res.message,
          icon: "report_problem"
        });

        if (store.phone && !store.email) {
          bindEmailDialog.value = true;
        }

        if (store.email && !store.phone) {
          changePhoneDialog.value = true;
        }
      } else if (res.code == 54001) {
        $q.notify({
          color: "negative",
          position: "top",
          message: res.message,
          icon: "report_problem"
        });

        sessionStorage.setItem("FROM_PROMO", props.promocode);

        router.push("/account/bank");
      }
    })
    .catch(() => {});
};

const initSpinWheel = () => {
  eventapi.get(`/session/${props.promocode}/init`).then((res) => {
    if (res.code == 0) {
      remainingDraws.value = res.data.spinChance;
      showRoulette.value = res.data.showRoulette === "YES";
    }
  });
};

onMounted(() => {
  // calc no of spin wheel items and potential stops
  for (var i = 0; i < TOTAL_ITEMS; i++) {
    var the_degree = ((FULL_DEGREE / TOTAL_ITEMS) * i * -1) + 20;
    degreesToStopAt.value.push({ degree: the_degree, prize: SPIN_WHEEL_PRIZES[i] });
  }

  spinBoardRef.value = document.getElementById("spin-wheel-bg");
  spinNumRef.value = document.getElementById("spin-wheel-number");
  drawBtnRef.value = document.querySelector(".draw-btn");

  initSpinWheel();
});
</script>
<style scoped lang="scss">
.spin-wheel-container {
    position: relative;
    margin: 25px 0px 25px;
    text-align: center;
    width: 100%;
  }

  .spin-wheel-frame {
    position: relative;
    width: 330px;
    height: 330px;
    margin: 0 auto;
    background: url(../../../assets/images/promotion/hotpromo/refer-spinwheel/spin-wheel-frame.gif) no-repeat center center;
    background-size: 100%;
  }

  .wheel-frame {
    position: relative;
    z-index: 3;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    width: 100%;
    height: 100%;
  }

  .chosen-color-bg {
    position: absolute;
    z-index: 3;
    top: -0px;
    left: 50%;
    transform: translate(-50%, 0);
    width: 230px;
  }

  .spin-wheel {
    position: absolute;
    z-index: 2;
    top: 35px;
    left: 35px;
    width: 260px;
    height: 260px;
  }

  .wheel-bg {
    width: 100%;
    height: 100%;
  }

  .spin-wheel-cny-hat {
    width: 100%;
    height: 100%;
  }

  .spin-wheel-number {
    position: absolute;
    z-index: 5;
    top: 0px;
    left: 0px;
    width: 550px;
    height: 550px;
  }

  .spin-wheel-number img {
    width: 100%;
    height: 100%;
  }

  .spin-btn {
    width: 90px;
  }

  .draw-btn {
    width: 92px;
    height: auto;
    aspect-ratio: 95 / 117;
    z-index: 25;
    position: absolute;
    top: 47.5%;
    left: 50%;
    transform: translate(-50%, -50%);

    &.disabled {
      filter: brightness(0.85);
      opacity: 1 !important;
      pointer-events: none;
    }

    img.hand {
      width: 50px !important;
      position: absolute;
      top: 60%;
      left: 66%;
      animation: swipe-hand 3s infinite;
      animation-delay: 1s;
    }
  }

  @keyframes swipe-hand {
    25% { transform: translate(20px) rotate(30deg);}
    50% { transform: translate(-20px) rotate(-15deg); }
    100% { transform: translate(0px) rotate(0); }
  }

  .click-pointer,
  .history-btn {
    cursor: pointer;
  }

  .click-pointer:hover,
  .history-btn {
    filter: brightness(1);
  }

  .history-btn:active {
    transform: translate(0px, 1px);
    filter: brightness(0.9);
  }

  .click-pointer:active {
    transform: translate(-50%, calc(-50% + 1px));
    filter: brightness(0.9);
  }

  .wheel-stage {
    width: 370px;
    height: 500px;
    z-index: 0;
    position: absolute;
    bottom: 24%;
    left: 50%;
    transform: translate(-50%, 50%);

    img {
      width: 100%;
    }
  }

  .remaining-draw-wrapper {
    .remaining-draw-text {
      color: #FFFFFF;
      font-size: 12px;
      margin: 10px auto 30px;
      padding-top: 8px;
      text-align: center;
      width: 300px;
      position: relative;
      z-index: 23;
    }
  }

.content-table {
  display: none;
  text-align: center;
  font-family: "Manrope", sans-serif;
  font-size: 10px;
  color: #000;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  overflow: hidden;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  thead {
    background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);

    th {
      color: #076b2c;
      font-weight: 700;
      font-size: 12px;
      min-width: 100px;
    }
  }

  tbody {
    td {
      color: #fff;
      padding: 10px 4px;
      font-size: 12px;
      border: 1px solid #ffffff1a;
    }

    tr {
      background: none !important;
      &:nth-child(even) {
        td {
          background-color: #70bc621a !important;
        }
      }
      &:nth-child(odd) {
        td {
          background-color: transparent !important;
        }
      }

      .player-details {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }
    }
  }
}

.sign-up-bonus-section {
  img {
    margin-bottom: 20px !important;
  }
  p {
    margin: 0 0 10px !important;
    font-size: 13px !important;
  }
}

.activity-rule-section {
  img {
    margin: 20px 0 !important;
  }
  li {
    margin-bottom: 6px !important;
  }
}

.congrats-container {
  background-color: #1e371f;
  border: 1px solid #337e3a;
  border-radius: 10px !important;
  max-width: 350px;
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

  .congrats-content {
    position: relative;
    img {
      display: block;
      width: 100%;
      max-width: 320px;
    }
  }

  .congrats-highlight {
    color: #fff96f;
    font-size: 48px;
    text-align: center;
    background-image: url(../../../assets/images/index/modal/congrats-highlight-bg.png);
    padding: 0 12px;
    background-repeat: no-repeat;
    background-size: 70% 100%;
    background-position: center;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    text-shadow: 0px 3.5px 0px #a00022;
    font-family: Poppins;
    font-weight: 700;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      display: block;
      width: 100%;
      max-width: 80px;
    }
  }
}

.congrats-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.1);
}

.congrats-button-container {
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  .congrats-btn {
    background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);
    border-radius: 10px;
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    color: #000a01;
  }
}

.bottom-btn {
  margin-top: 20px;
}
</style>
