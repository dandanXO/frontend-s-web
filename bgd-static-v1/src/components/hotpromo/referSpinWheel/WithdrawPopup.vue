<template>
    <div class="congrats-container">
        <q-btn icon="close" round dense v-close-popup class="congrats-close" />
        <div class="congrats-coupons">

            <div class="balance">
                <div class="title">{{ $t("hotPromo.referWheel.getForFree") }}</div>
                <div class="balance-info">
                    <div class="amount">
                        <svg class="gradient-amount-wrapper" preserveAspectRatio='xMinYMin'
                            xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="gradientAmount" gradientTransform="rotate(90)">
                                    <stop offset="0%" stop-color="#FDEE4F" />
                                    <stop offset="100%" stop-color="#FF953E" />
                                </linearGradient>
                            </defs>
                            <text id="test" x="90" y="35" class="amount">{{ props.accumulatedBonus }}</text>
                        </svg>
                    </div><img class="money-icon"
                        src="../../../assets/images/promotion/hotpromo/refer-spinwheel/money-pile-icon.png" />
                </div>
            </div>

            <div class="achievement">
                <div class="progress-section">
                    <div class="progress-bar">
                        <div class="progress-bar-full">
                            <div class="progress-bar-current" :style="`width:${achievementProgress}%`">
                            </div>

                            <div class="achieved-bar">
                                <div class="achieve-item" v-for="index in 5" :key="index">
                                    <img class="achieved-icon"
                                        :class="achievementProgress >= (index - 1) * 25 ? 'active' : ''"
                                        src="./../../../assets/images/promotion/hotpromo/refer-spinwheel/achieved-icon-green.svg" />
                                    <span class="achieved-label">{{ (index - 1) * 25 }}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="remaining">
                <div>{{ $t('hotPromo.referWheel.withdrawalStillTakes') }}</div>
                <div class="highlight">{{ store.currency.label }} {{ (300 - props.accumulatedBonus).toFixed(2) }}</div>
            </div>

            <div class="timeline">
                <div class="left">
                    <img src="./../../../assets/images/promotion/hotpromo/refer-spinwheel/achieved-icon-lightgreen.svg" />
                    <img :style="props.accumulatedBonus !== 300 ? 'filter:grayscale(1)' : ''" src="./../../../assets/images/promotion/hotpromo/refer-spinwheel/achieved-icon-lightgreen.svg" />
                    <img :style="props.accumulatedBonus !== 300 ? 'filter:grayscale(1)' : ''" src="./../../../assets/images/promotion/hotpromo/refer-spinwheel/achieved-icon-lightgreen.svg" />
                </div>
                <div class="right">
                    <div>{{ $t('hotPromo.referWheel.paymentRequestSubmitted') }}</div>
                    <div v-if="!isNaN(props.accumulatedBonus)">{{ $t('hotPromo.referWheel.withdrawalStillRequires') }} {{ store.currency.label }}{{ (300 - props.accumulatedBonus).toFixed(2) }}</div>
                    <div>{{ store.currency.label }}{{ '300.00' }} {{ $t('hotPromo.referWheel.willBeCreditedToAccount') }}</div>
                </div>
            </div>

            <div class="list-section">
                <div class="list-wrapper">
                    <div class="list">
                    <template v-if="Array.isArray(props.invitedList) && props.invitedList.length">
                        <div class="list-row" v-for="invited, index in props.invitedList" :key="index">
                            <div class="list-item"><span class="cyan">{{ invited.loginName }}</span></div>
                            <div class="list-item"><span class="label">{{ invited.loginName }}</span></div>
                            <div class="list-item">
                            <div class="center points"><span class="highlight">+{{ invited.bonus }}</span><img class="wheel-icon"
                                src="../../../assets/images/promotion/hotpromo/refer-spinwheel/wheel-icon.svg" />
                            </div>
                            </div>
                        </div>
                    </template>
                    <div v-else class="list-row" >
                        <div class="list-item" style="text-align: center;">{{ $t('hotPromo.referWheel.noInvitesYet') }}</div>
                    </div>
                    </div>
                </div>
            </div>

            <q-btn no-caps unelevated class="recharge-btn" :loading="false" @click="props.invitePopup">
                {{ $t("hotPromo.referWheel.inviteFriendsHelp") }}
            </q-btn>
        </div>


        <div class="congrats-button" @click="props.closePopup">
            <img src="./../../../assets/images/promotion/hotpromo/refer-spinwheel/close-icon.svg" />
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { userStore } from "src/stores";
const props = defineProps(['prize', 'accumulatedBonus', 'closePopup', 'invitePopup', 'invitedList']);

const store = userStore();

const achievementProgress = computed(() => {
    return props.accumulatedBonus / 300 * 100;
});
</script>

<style lang="scss" scoped>
.balance {
    display: flex;
    flex-direction: column;

    .title {
        font-size: 16px;
        text-align: center;
        font-weight: 700;
        font-family: 'Poppins';
    }

    .balance-info {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;

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
            height: 50px;
            overflow: hidden;

            .progress-bar-full {
                height: 10px;
                width: 100%;
                border-radius: 35px;
                background: #545454;
                position: relative;
            }

            .progress-bar-current {
                height: 10px;
                border-radius: 35px;
                background: linear-gradient(180deg, #009268 0%, #007050 100%);
                border-radius: 35px;
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

.highlight {
    color: #FAFF00;
}

.timeline {
    background: #95e87321;
    padding: 20px 30px;
    border-radius: 10px;
    display: flex;
    gap: 20px;
    margin-top: 20px;

    .left {
        width: 2px;
        height: 100px;
        background: rgba(255, 255, 255, 0.2);
        display: grid;
        grid-template-rows: 20px 20px 20px;
        align-items: center;
        justify-content: center;
        gap: 20px;

        img {
            width: 20px;
            height: 20px;
        }
    }

    .right {
        display: grid;
        grid-template-rows: 20px 20px 20px;
        align-items: center;
        gap: 20px;
    }
}


.gradient-amount-wrapper {

    .amount {
        font-size: 50px;
        fill: url(#gradientAmount);
        text-shadow: 3px 3px #A00022;
        font-family: 'Poppins';
        font-weight: 700;
        text-anchor: middle;
        dominant-baseline: middle;
    }
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
        .light-source {
            display: block;
            width: 100%;
            margin: auto;
            max-width: 300px;
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
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        gap: 10px;
        top: 55%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 10px 0;

        .money-icon {
            width: 80px;
        }
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
    display: flex;
    margin: 20px auto 10px;
}

.list-section {
      background: #70BC621A;
      border: 1px solid #575D53;
      border-radius: 10px;
      position: relative;
      margin-top: 20px;

      .list-wrapper {
        max-height: 120px;
        overflow-y: scroll;
        padding-bottom: 20px;

        .list {
          display: table;
          width: 100%;
          padding: 10px 20px;

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
                display: flex;
              }
            }
          }

          .wheel-icon {
            width: 22px;
          }
        }
      }

      .withdraw-order-btn {
        position: absolute;
        bottom: -16%;
      }
    }
</style>