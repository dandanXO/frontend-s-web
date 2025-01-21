<template>
  <div class="container">
    <div class="top">
      <div class="top-wrapper">
        <div class="balance">
          <div class="title">{{ $t("hotPromo.referWheel.currentAmount") }} ({{ store.currency.label }})</div>
          <div class="balance-info">
            <div class="amount">
              <svg class="gradient-amount-wrapper"  preserveAspectRatio='xMinYMin' xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="gradientAmount" gradientTransform="rotate(90)">
                    <stop offset="0%" stop-color="#FDEE4F" />
                    <stop offset="100%" stop-color="#FF953E" />
                  </linearGradient>
                </defs>
                <text id="test" x="0" y="45" class="amount">{{ (accumulatedBonus || 0)?.toFixed(2) }}</text>
              </svg>
            </div><img class="money-icon"
              src="../../../assets/images/promotion/hotpromo/refer-spinwheel/money-pile-icon.png" />
          </div>
        </div>
        <div class="primary-bg withdraw-btn center" @click="claimBonus">
          {{ $t('hotPromo.referWheel.withdraw') }}
        </div>
      </div>
      <div class="achievement">
        <div class="progress-section">
          <div class="progress-bar">
            <div class="progress-bar-full">
              <span class="achievement-percentage">{{ Math.round(achievementProgress || 0) }}%</span>
              <div class="progress-bar-current" :style="`width:${achievementProgress}%`">
              </div>

              <div class="achieved-bar">
                <div class="achieve-item" v-for="index in 5" :key="index">
                  <!-- <img class="achieved-icon" :class="achievementProgress >= (index - 1) * 25 ? 'active' : ''"
                    src="./../../../assets/images/promotion/hotpromo/refer-spinwheel/achieved-icon.svg" />
                  <span class="achieved-label">{{ (index - 1) * 25 }}%</span> -->
                </div>
              </div>
            </div>
          </div>
          <div class="remaining">
            <span class="highlight">{{ accumulatedBonus }}/</span><span class="label">300</span>
          </div>
        </div>
      </div>
      <div class="remaining">
        <div>{{ $t('hotPromo.referWheel.withdrawalStillTakes') }}</div>
        <div class="highlight">{{ store.currency.label }} {{ (300 - accumulatedBonus).toFixed(2) }}</div>
      </div>
    </div>
    <div class="spin-wheel-container">
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
              src="./../../../assets/images/promotion/hotpromo/refer-spinwheel/spin-wheel-bg-en.png" />
            <img v-else id="spin-wheel-bg" class="wheel-bg"
              src="./../../../assets/images/promotion/hotpromo/refer-spinwheel/spin-wheel-bg-bn.png" />
            <div id="spin-wheel-number" class="spin-wheel-number" style="display: none"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="remaining-draw-wrapper">
      <div class="remaining-draw-text">
        {{ $t("hotPromo.referWheel.remainingDrawTimes") }}
        <span id="remaning-draw-amt">: {{ remainingDraws }}</span>
      </div>
    </div>

    <div class="expiry">
      <div class="days tertiary-bg center">
        <div class="label">{{ $t('hotPromo.referWheel.days') }}</div>
        <div class="highlight expiry-day">{{ remainingTime.days }}</div>
        <div class="label">{{ $t('hotPromo.referWheel.expiresLater') }}</div>
      </div>
      <div class="countdown tertiary-bg center">
        <div class="timer-item">
          <div class="label">{{ $t('hotPromo.referWheel.hours') }}</div>
          <div class="timer-value-wrapper">
            <div class="timer-value" v-for="hour in remainingTime.hours?.toString().padStart(2, '0').split('')"
              :key="hour">{{ hour }}</div>
          </div>
        </div>
        <div class="timer-item">
          <div class="label" style="visibility: hidden;">|</div>
          <div class="timer-value-wrapper">
            :
          </div>
        </div>
        <div class="timer-item">
          <div class="label">{{ $t('hotPromo.referWheel.minutes') }}</div>
          <div class="timer-value-wrapper">
            <div class="timer-value" v-for="minute in remainingTime.minutes?.toString().padStart(2, '0').split('')"
              :key="minute">{{ minute }}</div>
          </div>
        </div>
        <div class="timer-item">
          <div class="label" style="visibility: hidden;">|</div>
          <div class="timer-value-wrapper">
            :
          </div>
        </div>
        <div class="timer-item">
          <div class="label">{{ $t('hotPromo.referWheel.seconds') }}</div>
          <div class="timer-value-wrapper">
            <div class="timer-value" v-for="second in remainingTime.seconds?.toString().padStart(2, '0').split('')"
              :key="second">{{ second }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="referral">
      <div class="invite primary-bg" @click="showInvitePopup = true">{{ $t('hotPromo.referWheel.inviteFriendsHelp')
        }}<img class="icon share-icon" src="../../../assets/images/promotion/hotpromo/refer-spinwheel/share-icon.svg" />
      </div>
      <div class="qr primary-bg" @click="showQRPopup = true">{{ $t('hotPromo.referWheel.scanQRCode') }}<img
          class="icon qr-icon" src="../../../assets/images/promotion/hotpromo/refer-spinwheel/qr-icon.svg" /></div>
    </div>

    <div class="list-section">
      <div class="list-wrapper">
        <div class="list">
          <div class="list-row" v-for="winner, index in winnersList" :key="index">
            <div class="list-item"><span class="cyan">{{ winner.loginName }}</span></div>
            <div class="list-item"><span class="label">{{ winner.loginName }}</span></div>
            <div class="list-item">
              <div class="center points"><span class="highlight">+{{ winner.bonus }}</span><img class="wheel-icon"
                  src="../../../assets/images/promotion/hotpromo/refer-spinwheel/wheel-icon.svg" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="withdraw-order-btn btn-primary btn-primary__full center">Withdraw Orders</div>
    </div>


    <div class="terms-conditions">
      <img v-if="languageVal === 'en'" src="../../../assets/images/promotion/hotpromo/refer-spinwheel/terms-conditions-title-en.svg" />
      <img v-else src="../../../assets/images/promotion/hotpromo/refer-spinwheel/terms-conditions-title-bn.svg" />
      <div class="content">
        <ul>
          <li>{{ $t('hotPromo.referWheel.termsCondition1') }}</li>

          <li>{{ $t('hotPromo.referWheel.termsCondition2') }}</li>

          <li>{{ $t('hotPromo.referWheel.termsCondition3') }}</li>

          <li>{{ $t('hotPromo.referWheel.termsCondition4') }}</li>

          <li>{{ $t('hotPromo.referWheel.termsCondition5') }}</li>

          <li>{{ $t('hotPromo.referWheel.termsCondition6') }}</li>

          <li>{{ $t('hotPromo.referWheel.termsCondition7') }}</li>
        </ul>
      </div>
    </div>
  </div>

  <q-dialog v-model="showInvitePopup" backdrop-filter="none" position="bottom">
    <InvitePopup :selfTgurl="selfTgurl" />
  </q-dialog>

  <q-dialog v-model="showPrizePopup" backdrop-filter="none">
    <PrizePopup :prize="prizePopupBonusAmt" :languageVal="languageVal" />
  </q-dialog>

  <q-dialog v-model="showQRPopup" backdrop-filter="none">
    <QRPopup :selfTgurl="selfTgurl" />
  </q-dialog>

  <q-dialog v-model="showWithdrawPopup" backdrop-filter="none">
    <WithdrawPopup v-if="accumulatedBonus < 300" :accumulatedBonus="accumulatedBonus"
      :closePopup="() => showWithdrawPopup = false" :invitePopup="() => showInvitePopup = true"
      :invitedList="invitedList" />
    <PrizePopup v-else prize="300" :showRechargeBtn="true" />
  </q-dialog>
</template>
  <script setup>
  import { ref, onMounted, computed, onUnmounted } from "vue";
  import { api, eventapi } from "src/boot/axios";
  import { useQuasar } from "quasar";
  import { useI18n } from "vue-i18n";
  import { userStore } from "src/stores";
  import PrizePopup from "./PrizePopup.vue";
  import InvitePopup from "./InvitePopup.vue";
  import QRPopup from "./QRPopup.vue";
  import WithdrawPopup from "./WithdrawPopup.vue";
  import moment from 'moment';
  import { i18nStore } from "src/router/language";
  import { storeToRefs } from "pinia";
  
  const { languageVal } = storeToRefs(i18nStore());


  const remainingTime = computed(() => {
    if(endDate.value) {
      const total = Date.parse(moment(endDate.value).format()) - Date.parse(new Date());
      const seconds = Math.floor( (total/1000) % 60 );
      const minutes = Math.floor( (total/1000/60) % 60 );
      const hours = Math.floor( (total/(1000*60*60)) % 24 );
      const days = Math.floor( total/(1000*60*60*24) );
      
      return { days,hours,minutes,seconds };
    }
    
    return {};
  });

  const achievementProgress = computed(() => {
    return accumulatedBonus.value / 300 * 100;
  });

  const { t } = useI18n();
  const $q = useQuasar();
  const store = userStore();
  const selfTgurl = ref("");

  // spin wheel constants
  const TOTAL_ITEMS = 8;
  const DEFAUL_SPEED = 1;
  const MAX_SPEED = 4;
  const FULL_DEGREE = 360;
  const SPIN_WHEEL_PRIZES = ['ADDSPIN',8,'RANDBONUS','THANKS',5,10,'withdraw',2];

  // spin wheel element refs
  const spinBoardRef = ref();
  const spinNumRef = ref();
  const drawBtnRef = ref();

  const spinButtonDisable = ref(false);
  const degreesToStopAt = ref([]);
  const showPrizePopup = ref(false);
  const showWithdrawPopup = ref(false);
  const showQRPopup = ref(false);
  const showInvitePopup = ref(false);
  const prizePopupBonusAmt = ref();
  const remainingDraws = ref(0);
  const winnersList = ref([]);
  const invitedList = ref([]);
  const endDate = ref();
  const remainingTimeTimer = ref();
  const accumulatedBonus = ref();

  let finalDegree = 0;
  let speed = 1;
  var spinSchedule;
  var degree;

  const spin = (prizeIndex, stopCallback) => {
    spinButtonDisable.value = true;
    // drawBtnRef.value.style.filter = "brightness(0.85)";

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

  const getRecords = () => {
    eventapi
      .get("/session/refer-wheel/getRecords?promoCode=bgd-refer-wheel")
      .then((res) => {
        if (res.code == 0) {
          winnersList.value = res.data;
        }
      })
      .catch((err) => {
        console.log("here", err);
      });
  };

  const stopSpin = (prizeIndex, stopCallback) => {
    // call api

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
            // drawBtnRef.value.style.filter = "none";
            stopCallback?.();
          }, 750);
        }, stopTime * 1000);
      }
    };
  };

  const reset = () => {
    degree = finalDegree % 360;
    speed = DEFAUL_SPEED;

    spinBoardRef.value.style.transition = "";
    spinNumRef.value.style.transition = "";
  };

  const spinWheel = () => {
    //FOr TesTING START
    // const res = {
    //   data: {
    //     bonus: 8,
    //     availableSpin: 0,
    //     spinType: 'THANKS'
    //   }
    // }
    // var bonusIndex = res.data.spinType === 'FIXEDBONUS' ? res.data.bonus : res.data.spinType;

    // const prizeIndex = SPIN_WHEEL_PRIZES.findIndex((prize) => prize === bonusIndex);


    // console.log('here', bonusIndex, prizeIndex)
    // spin(prizeIndex, () => {
    //   showPrizePopup.value = true;
    //   prizePopupBonusAmt.value = ['RANDBONUS', 'FIXEDBONUS'].includes(res.data.spinType) ? res.data.bonus : res.data.spinType;
    //   remainingDraws.value = res.data.availableSpin;
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
        message: t("hotPromo.referWheel.remainingDrawTimes") + `: 0`,
        icon: "report_problem"
      });
      return;
    }

    eventapi
      .post("/session/refer-wheel/spin?promoCode=bgd-refer-wheel")
      .then((res) => {
        if (res.code == 0) {
          var bonusIndex = res.data.spinType === 'FIXEDBONUS' ? res.data.bonus : res.data.spinType === 'FIRSTBONUS' ? 'RANDBONUS' : res.data.spinType;

          const prizeIndex = SPIN_WHEEL_PRIZES.findIndex((prize) => prize === bonusIndex);

          spin(prizeIndex, () => {
            showPrizePopup.value = true;
            prizePopupBonusAmt.value = ['RANDBONUS', 'FIRSTBONUS', 'FIXEDBONUS'].includes(res.data.spinType) ? res.data.bonus : res.data.spinType;
            remainingDraws.value = res.data.availableSpin;
            initSpinWheel();
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const initSpinWheel = () => {
    eventapi.get("/session/refer-wheel/init?promoCode=bgd-refer-wheel").then((res) => {
      if (res.code == 0) {
        remainingDraws.value = res.data.availableSpin;
        endDate.value = res.data.endDate;
        accumulatedBonus.value = res.data.accumulatedBonus;
        invitedList.value = res.data.invitedList;
        
        if(!remainingTimeTimer.value) {
          setInterval(() => {
            endDate.value = endDate.value - 1;
          }, 1000);
        }
      }
    });

    getRecords();
  };

  const claimBonus = () => {
    if(accumulatedBonus.value === 300) {
      eventapi
      .post("/session/refer-wheel/claimBonus?promoCode=bgd-refer-wheel")
      .then((res) => {
        if (res.code == 0) {
          showWithdrawPopup.value = true;
        }
      })
      .catch((err) => {
        console.log(err);
      });
    } else {
      showWithdrawPopup.value = true;
    }
  };

  onMounted(() => {
    // calc no of spin wheel items and potential stops
    for (var i = 0; i < TOTAL_ITEMS; i++) {
      var the_degree = (FULL_DEGREE / TOTAL_ITEMS) * i * -1;
      degreesToStopAt.value.push({ degree: the_degree, prize: SPIN_WHEEL_PRIZES[i] });
    }

    spinBoardRef.value = document.getElementById("spin-wheel-bg");
    spinNumRef.value = document.getElementById("spin-wheel-number");
    drawBtnRef.value = document.querySelector(".draw-btn");

    initSpinWheel();

    let tgDomain = window.location.origin + "/";
    if (store.isApp()) {
      tgDomain = store.evip ? "https://" + store.evip + "/" : store.h5Url;
    }

    api.get("/session/member/referralCode").then((res) => {
      if (res.code === 0) {
        selfTgurl.value = tgDomain + "refer/" + res.data;
      }
    });
  });

  onUnmounted(() => {
    clearInterval(remainingTimeTimer.value);
  })
</script>
  
  <style lang="scss" scoped>

  .primary-bg {
    background: linear-gradient(90deg, #24EE89 0%, #9FE871 100%);
    color: #000A01;
  }

  .secondary-bg {
    background: linear-gradient(180deg, #1BAA99 0%, #8AC542 100%), linear-gradient(90deg, #24EE89 0%, #9FE871 100%);

  }

  .tertiary-bg {
    background: #95E87321;
  }

  .primary-bg,
  .secondary-bg,
  .tertiary-bg {
    border-radius: 10px;
    padding: 5px 10px;
    margin-bottom: 15px;
  }

  .center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .highlight {
    color: #FAFF00;
  }

  .label {
    color: #ffffff80;
  }

  .container {
    font-family: 'Poppins';

    .top {
      background: linear-gradient(101.81deg, #1F5021 1.83%, #1E371F 56.02%);
      border: 1px solid #337E3A;
      box-shadow: 0px 0px 20px 0px #5FFF4640 inset;
      margin: 5px;
      border-radius: 10px;
      padding: 15px;

      .top-wrapper {
        display: grid;
        grid-template-columns: 1fr 100px;

        .balance {
          display: flex;
          flex-direction: column;
          
          .title {
            font-size: 16px;
          }

          .balance-info {
            display: flex;
            align-items: center;
            gap: 15px;

            .gradient-amount-wrapper {
              max-height: 55px;
              max-width: 180px;

              .amount {
                font-size: 50px;
                fill: url(#gradientAmount);
                text-shadow: 3px 3px #A00022;
                font-family: 'Poppins';
                font-weight: 500;
              }

            }

            .money-icon {
              width: 55px;
            }
          }
        }

        .withdraw-btn {
          height: 35px;
          font-weight: 700;
        }
      }

      .achievement {
        display: flex;
        flex-direction: column;

        .progress-section {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 10px;

          .progress-bar {
            display: flex;
            align-items: flex-start;
            padding-top: 10px;
            height: 30px;
            overflow: hidden;

            .progress-bar-full {
              height: 10px;
              width: 100%;
              border-radius: 35px;
              background: #545454;
              position: relative;

              .achievement-percentage {
                z-index: 1;
                position: absolute;
                right: 40%;
                top: 50%;
                transform: translate(-50%, -50%);
              }
            }

            .progress-bar-current {
              height: 10px;
              border-radius: 35px;
              background: linear-gradient(90deg, #24EE89 0%, #9FE871 100%);
              border-radius: 35px;
              position: relative;
            }

            .achieved-bar {
              width: 100%;
              display: flex;
              justify-content: space-between;
              position: absolute;
              top: calc(50% + 10px);
              left: 50%;
              transform: translate(-50%, -50%);

              .achieve-item {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                .achieved-icon {
                  width: 20px;
                  margin-bottom: 0;
                  filter: grayscale(1);

                  &.active {
                    filter: grayscale(0);
                  }
                }

                .achieved-label {
                  letter-spacing: -1px;
                }
              }
            }
          }
        }
      }

      .remaining {
        display: flex;
        justify-content: center;
        gap: 5px;
      }
    }

    .expiry {
      display: grid;
      grid-template-columns: 0.3fr 0.7fr;
      gap: 15px;
      font-size: 15px;

      .days {
        display: flex;
        flex-direction: column;
        text-align: center;

        .expiry-day {
          font-weight: bold;
        }
      }

      .countdown {
        display: flex;
        justify-content: space-evenly;
        padding: 10px 0;

        .timer-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;

          .timer-value-wrapper {
            display: flex;
            gap: 8px;

            .timer-value {
              background: #4CEC8142;
              padding: 5px 5px;
              border-radius: 3px;
              width: 25px;
              text-align: center;
            }
          }
        }
      }
    }

    .referral {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      font-weight: 600;
      font-size: 14px;

      .invite,
      .qr {
        display: flex;
        height: 50px;
        align-items: center;
        justify-content: space-around;
        cursor: pointer;
        line-height: 15px;

        &:hover {
          filter: brightness(0.9);
        }

        .icon {
          width: 22px;
          height: 22px;
          margin-bottom: 0;
          margin-left: 5px;

          &.qr-icon {
            height: 24px;
            width: 24px;
          }
        }
      }
    }

    @keyframes marquee-content {
			from {
				transform: translateY( 0% );
			}
			to {
				transform: translateY( -100% );
			}
		}

    .list-section {
      background: #70BC621A;
      border: 1px solid #575D53;
      border-radius: 10px;
      position: relative;
      margin-bottom: 20px;

      .list-wrapper {
        max-height: 120px;
        overflow-y: hidden;
        padding-bottom: 20px;

        .list {
          display: table;
          width: 100%;
          padding: 10px 20px;
          animation-duration: 100s ;
          animation-iteration-count: infinite ;
          animation-name: marquee-content ;
          animation-timing-function: linear ;

          .list-row {
            display: table-row;

            .list-item {
              display: table-cell;

              .cyan {
                color: #00FFC3;
              }

              .points {
                gap: 5px;
                font-weight: 700;
              }
            }
          }

          .wheel-icon {
            width: 22px;
          }
        }
      }

      .withdraw-order-btn {
        visibility: hidden;
        position: absolute;
        bottom: -16%;
      }
    }

    .terms-conditions {
      .content {
        margin-top: 20px;

        ul {
          font-family: 'Poppins';
          font-size: 12px;
          font-weight: 400;
          line-height: 16px;

        }
      }
    }
  }

  #remaning-draw-amt {
    font-size: 12px;
    color: #ffffff;
    font-weight: bold;
  }

  .spin-wheel-container {
    position: relative;
    margin: 25px 0px 25px;
    text-align: center;
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
    z-index: 20;
    position: absolute;
    bottom: 24%;
    left: 50%;
    transform: translate(-50%, 50%);

    img {
      width: 100%;
    }
  }

  .cny-hat {
    width: 120px;
    height: auto;
    z-index: 22;
    position: absolute;
    top: -45px;
    left: 50%;
    transform: translate(-50%, 0%);

    img {
      width: 100%;
    }
  }

  .draw-btn img {
    width: 100%;
  }

  .spin-wheel-board {
    position: relative;
    z-index: 20;
    background-size: contain;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #888;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  .prize-popup {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden !important;
  }

  .prize-gold {
    display: flex;
    align-items: center;
    flex-direction: column;
    color: #c7c7c7;
  }

  .prize-amount {
    font-size: 38px;
    color: #ffffff;
    font-weight: bold;
    margin-top: 10px;
    margin-bottom: 20px;
  }

  .prizePopupContainer {
    display: flex;
    justify-content: center;
    align-items: center;

    .wrapper {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      // width: 300px;
      // height: 345px;
      gap: 0px;
      // background: url("./../../../assets/images/promotion/hotpromo/refer-spinwheel/prize-popup.png");
      // background-size: 100% 100%;
      position: relative;

      .close {
        position: absolute;
        right: 0;
        top: 38px;
        width: 20px;
        height: 20px;
      }

      .bold-text {
        font-family: sans-serif;
        font-size: 20px;
        font-weight: 700;
        letter-spacing: 1px;
        text-align: center;
        color: #530102;
      }

      .golden-text {
        font-size: 25px;
        letter-spacing: 2px;
        background: linear-gradient(94.81deg, #f6ff8c 7.45%, #ffba88 95.9%),
          linear-gradient(360deg, #ff932f 9.54%, #fffca9 86.08%);
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .darkred-text {
        color: #8c3b00;
        font-size: 20px;
      }

      .red-text {
        color: #ff0000;
        font-size: 28px;
      }

      .win-text {
        font-size: 28px;
        letter-spacing: 2px;
        background: linear-gradient(360deg, #ffc700 9.54%, #fff500 86.08%);
        background-clip: text;
        -webkit-text-fill-color: transparent;
        filter: drop-shadow(1px 1px #00000050);
      }

      .popup-header {
        letter-spacing: normal;
        font-size: 25px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .content {
        height: 260px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        margin-right: 10px;

        .action-btn {
          // background: url("./../../../assets/images/promotion/hotpromo/refer-spinwheel/prize-popup-action-btn.png")
          // no-repeat center center;
          // background-size: contain;
          // width: 100%;
          // height: 100%;
          // max-height: 70px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #ffffff;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
        }
      }
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

  .evt-top-header {
    background: url("./../../../assets/images/promotion/hotpromo/refer-spinwheel/top-header.png") no-repeat center center;
    background-size: 100% auto;
    display: flex;
    height: 50px;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: bold;
    font-size: 14px;
    max-width: 400px;
    margin: 0 auto 24px;
  }

  .promo-info-container {
    display: grid;
    border: 1px solid #3f8cff;
    border-radius: 15px;
    padding: 10px;
    max-width: 1200px;
    margin: 50px auto 0;
    //   margin-bottom: 150px;

    .promo-info-banner {
      background-size: 100% 100%;
      width: 100%;
      height: 200px;
      margin: auto;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 20px;
      border-radius: 15px;
      background: #3f8cff0d;
      position: relative;
    }

    .promo-info-content {
      height: 100%;
      max-height: 140px;
      overflow-y: auto;

      .event-info-item {
        display: grid;
        grid-template-columns: 100px 1fr;
        justify-content: center;
        align-items: center;
        padding: 7px;
        color: #530102;

        .event-info-title {
          font-weight: bold;
        }
      }

      .nowinners-list {
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
        color: #7a8eb9;
        font-size: 16px;
      }

      .winners-list-item {
        font-size: 12px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        padding: 7px;
        text-align: center;

        &:not(:last-child) {
          border-bottom: 0.58px dotted #53010233;
        }

        .winner-date {
          font-weight: 700;
          color: #7a8eb9;
        }

        .winner-loginName {
          font-weight: 700;
          color: #7a8eb9;
        }

        .winner-prize {
          font-weight: 700;
          color: #3f8cff;
        }
      }
    }
  }


  @media (max-width: 430px) {
    .container {
      .top {
        .top-wrapper {
          .withdraw-btn {
            width: 80px;
          }

          .balance {
            .balance-info {
              gap: 5px;

              .gradient-amount-wrapper {
                max-width: 150px;

                .amount {
                  font-size: 35px;
                }
              }
            }
          }
        }
      }
    }
  }

  @media (max-width: 350px) {
    .container {
      .top {
        .top-wrapper {
          .balance {
            .balance-info {
              gap: 5px;
              
              .gradient-amount-wrapper {
                max-width: 130px;

                .amount {
                  font-size: 30px;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
  