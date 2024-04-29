<template>
  <div class="main-section">
    <div class="vip-container">
      <div class="content-container">
        <div class="vip-headline">
          {{ $t("lang.level") }}
        </div>
      </div>

      <div v-for="(vip, vipIndex) in vipItems" :key="vipIndex" :name="vipIndex">
        <div class="carousel__item">
          <template v-if="vipGrade === vip.vipGrade">
            <div class="vipitem" :class="'vipitem-' + vip.vipGrade.toLowerCase()">
              <div class="vipcontents">
                <div class="vip-title">{{ vip.vipGrade }}</div>
                <div class="inner-vip" v-if="vip.vipGrade == 'Bronze'">
                  <div class="txt-inner pt-40">
                    <div class="txt-inner-title">{{ $t("lang.upgrade") }}</div>
                  </div>
                  <div class="txt-inner">
                    <div class="txt-inner-content-full">
                      {{ $t("lang.have_one_successful_deposit") }}
                    </div>
                  </div>
                </div>
                <div class="inner-vip" v-else>
                  <div class="txt-inner pt-10">
                    <div class="txt-inner-title">
                      {{ $t("lang.upgrade") }}
                    </div>
                  </div>
                  <div class="txt-inner">
                    <div class="txt-inner-content-full">{{ $t("lang.upgrade") }} {{ vip.upgrade }}</div>
                  </div>

                  <div class="txt-inner pt-20">
                    <div class="txt-inner-content">
                      {{ $t("lang.monthly_bonus") }}
                      <br />
                      {{ vip.monthly }}
                    </div>

                    <div class="txt-inner-content">
                      {{ $t("lang.birthday_bonus") }}
                      <br />
                      {{ vip.birthday }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <div class="content-container">
        <div class="content-txt-title">
          {{ $t("lang.accumulated_deposits") }}
        </div>
        <div class="content-txt-value">
          <div class="content-txt-num">
            {{ formatAmount(vipAccumulatedDepositsCurrent) }} /
            {{ formatAmount(vipAccumulatedDeposits) }}
          </div>
          <div class="content-txt-num">
            {{
              vipAccumulatedDeposits === 0
                ? ((vipAccumulatedDepositsCurrent / vipAccumulatedDeposits) * 100).toFixed(2)
                : 0
            }}%
          </div>
        </div>
        <!-- <div class="content-txt-title">{{ $t("lang.turnover_requirements") }}</div>
        <div class="content-txt-value">
          <div class="content-txt-num">0/6,000</div>
          <div class="content-txt-num">0.00%</div>
        </div> -->
      </div>

      <div class="vip-lower-wrap">
        <div class="vip-lower">
          <div v-for="(vip, vipIndex) in vipItems" :key="vipIndex" :name="vipIndex">
            <div class="vip__item">
              <div class="vipitem" :class="'vipitem-' + vip.vipGrade.toLowerCase()">
                <div class="vipcontents">
                  <div class="vip-title">{{ vip.vipGrade }}</div>
                  <div class="inner-vip">
                    <div class="txt-inner pt-10">
                      <div class="txt-inner-title">
                        {{ $t("lang.upgrade") }}
                      </div>
                    </div>
                    <div class="txt-inner">
                      <div class="txt-inner-content-full">{{ $t("lang.upgrade") }} {{ vip.upgrade }}</div>
                    </div>

                    <div class="txt-inner pt-20">
                      <div class="txt-inner-content">
                        {{ $t("lang.monthly_bonus") }}
                        <br />
                        {{ vip.monthly }}
                      </div>

                      <div class="txt-inner-content">
                        {{ $t("lang.birthday_bonus") }}
                        <br />
                        {{ vip.birthday }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- <div class="second-vip">
              <div v-if="vip.monthly">
                <div class="title">โบนัสประจำเดือน</div>
                <div class="inner-vip">{{ vip.monthly }}</div>
                <q-btn
                  :loading="loadingMClaim"
                  v-if="store.hasToken() && vip.vipLevel == vipLevel"
                  @click="claimRebate('jolly88-vip-monthly', 'monthly')"
                  color="brand"
                  glossy
                  label="เคลมตอนนี้"
                />
                <div v-if="vip.birthday">
                  <div class="title">โบนัสวันเกิด</div>
                  <div class="inner-vip">{{ vip.birthday }}</div>
                  <q-btn
                    :loading="loadingBClaim"
                    v-if="store.hasToken() && vip.vipLevel == vipLevel"
                    @click="claimRebate('jolly88-vip-birthday', 'birthday')"
                    color="brand"
                    glossy
                    label="เคลมตอนนี้"
                  />
                </div>
              </div>
            </div> -->

            <div class="inner-vip-mobile">
              <div class="menu-title">{{ $t("lang.rebate_bonus") }}</div>
              <div class="rebates">
                <div class="rebate" v-for="(rebate, i) in vip.rebates" :key="i">
                  <div class="value">{{ rebate.rebateValue }}</div>
                  <div class="name">{{ rebate.rebateName }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="terms-conditions">
        <div class="menu-title">{{ $t("lang.terms_and_conditions") }}</div>
        <div class="terms">
          <div class="term" v-for="(term, i) in terms" :key="i">
            <div class="circle-wrapper">
              <div class="circle">{{ i + 1 }}</div>
            </div>
            <div class="term-text">{{ term.text }}</div>
          </div>
        </div>
      </div>

      <q-dialog v-model="isClaimModal" persistent>
        <q-card class="win-rebate-model">
          <q-card-section class="row items-center">
            <div class="bonus-svg-div">
              <span class="claim-amt">{{ claimMsg }}</span>
              <span class="bonus-text">โบนัส</span>
            </div>
          </q-card-section>

          <q-card-actions align="center">
            <q-btn flat label="ตกลง" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import { ref, defineComponent, onMounted, computed } from "vue";
import { userStore } from "stores/index";
import { eventapi } from "boot/axios";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "TransitRecordView",
  setup() {
    const $q = useQuasar();
    const { t } = useI18n();

    const slide = ref(0);
    const showRebate = ref(false);

    const store = userStore();
    const vipLevel = ref("");
    // const vipGrade = ref("");
    const vipGrade = computed(() => {
      return store.vip;
    });

    const vipAccumulatedDeposits = computed(() => {
      return store.levelUpDeposit;
    });

    const vipAccumulatedDepositsCurrent = computed(() => {
      return store.currentDeposit;
    });

    // const vipAccumulatedDeposits = ref(0);
    // const vipAccumulatedDepositsCurrent = ref(0);
    const vipTurnoverRequirements = ref(0);

    const loading = ref(false);
    const loadingMClaim = ref(false);
    const loadingBClaim = ref(false);

    const columns = [
      {
        title: "VIP Level",
        dataIndex: "vipLevel",
        key: "vipLevel"
      },
      {
        title: "VIP 1",
        dataIndex: "vip1",
        key: "vip1"
      },
      {
        title: "VIP 2",
        dataIndex: "vip2",
        key: "vip2"
      },
      {
        title: "VIP 3",
        dataIndex: "vip3",
        key: "vip3"
      },
      {
        title: "VIP 4",
        dataIndex: "vip4",
        key: "vip4"
      },
      {
        title: "VIP 5",
        dataIndex: "vip5",
        key: "vip5"
      },
      {
        title: "VIP 6",
        dataIndex: "vip6",
        key: "vip6"
      },
      {
        title: "VIP 7",
        dataIndex: "vip7",
        key: "vip7"
      }
    ];

    const data = [
      {
        key: "1",
        vipLevel: "เงินคืนสล็อต",
        vip1: "0.40%",
        vip2: "0.40%",
        vip3: "0.50%",
        vip4: "0.60%",
        vip5: "0.70%",
        vip6: "0.80%",
        vip7: "1.00%"
      },
      {
        key: "2",
        vipLevel: "เงินคืนยิงปลา",
        vip1: "0.30%",
        vip2: "0.30%",
        vip3: "0.30%",
        vip4: "0.30%",
        vip5: "0.30%",
        vip6: "0.30%",
        vip7: "0.30%"
      },
      {
        key: "3",
        vipLevel: "เงินคืนคาสิโนสด",
        vip1: "0.20%",
        vip2: "0.20%",
        vip3: "0.30%",
        vip4: "0.40%",
        vip5: "0.50%",
        vip6: "0.60%",
        vip7: "0.80%"
      },
      // {
      //   key: "4",
      //   vipLevel: "เงินคืนไพ่",
      //   vip1: "0.20%",
      //   vip2: "0.20%",
      //   vip3: "0.30%",
      //   vip4: "0.40%",
      //   vip5: "0.50%",
      //   vip6: "0.60%",
      //   vip7: "0.80%",
      // },
      {
        key: "5",
        vipLevel: "เงินคืนกีฬา",
        vip1: "0.30%",
        vip2: "0.30%",
        vip3: "0.40%",
        vip4: "0.40%",
        vip5: "0.50%",
        vip6: "0.50%",
        vip7: "0.60%"
      }
      // {
      //   key: "6",
      //   vipLevel: "เงินคืนล็อตตารี่",
      //   vip1: "0.30%",
      //   vip2: "0.30%",
      //   vip3: "0.40%",
      //   vip4: "0.40%",
      //   vip5: "0.50%",
      //   vip6: "0.50%",
      //   vip7: "0.60%",
      // },
    ];
    const promoExclusive = [
      {
        title: "เลเวล VIP",
        dataIndex: "vipLevel",
        key: "vipLevel",
        render: (text) => String(text)
      },
      {
        title: "VIP 1",
        dataIndex: "vip1",
        key: "vip1"
      },
      {
        title: "VIP 2",
        dataIndex: "vip2",
        key: "vip2"
      },
      {
        title: "VIP 3",
        dataIndex: "vip3",
        key: "vip3"
      },
      {
        title: "VIP 4",
        dataIndex: "vip4",
        key: "vip4"
      },
      {
        title: "VIP 5",
        dataIndex: "vip5",
        key: "vip5"
      },
      {
        title: "VIP 6",
        dataIndex: "vip6",
        key: "vip6"
      },
      {
        title: "VIP 7",
        dataIndex: "vip7",
        key: "vip7",
        render: (text) => String(text)
      }
    ];
    const dataExclusive = [
      {
        key: "1",
        vipLevel: "ถอนเงิน",
        vip1: "500,000/Day",
        vip2: "500,000/Day",
        vip3: "500,000/Day",
        vip4: "1,000,000/Day",
        vip5: "1,000,000/Day",
        vip6: "1,000,000/Day",
        vip7: "2,000,000.00/Day"
      },
      {
        key: "2",
        vipLevel: "สแตนดาร์ด",
        vip1: "สแตนดาร์ด",
        vip2: "สแตนดาร์ด",
        vip3: "สแตนดาร์ด",
        vip4: "สแตนดาร์ด",
        vip5: "วงเงินสูง",
        vip6: "วงเงินสูง",
        vip7: "วงเงินสูง"
      },
      {
        key: "3",
        vipLevel: "วิธีการชำระเงินแบบด่วนพิเศษ",
        vip1: "",
        vip2: "",
        vip3: "",
        vip4: "",
        vip5: "✔",
        vip6: "✔",
        vip7: "✔"
      },
      {
        key: "4",
        vipLevel: "24/7 ทีมบริการลูกค้า VIP",
        vip1: "",
        vip2: "",
        vip3: "",
        vip4: "",
        vip5: "",
        vip6: "✔",
        vip7: "✔"
      },
      {
        key: "5",
        vipLevel: "ขอเชิญร่วมงานพิเศษ",
        vip1: "",
        vip2: "",
        vip3: "",
        vip4: "",
        vip5: "",
        vip6: "",
        vip7: "✔"
      }
    ];
    const terms = [
      {
        text: t("lang.vip_tnc_para_1")
      },
      {
        text: t("lang.vip_tnc_para_2")
      },
      {
        text: t("lang.vip_tnc_para_3")
      },
      {
        text: t("lang.vip_tnc_para_4")
      },
      {
        text: t("lang.vip_tnc_para_5")
      },
      {
        text: t("lang.vip_tnc_para_6")
      },
      {
        text: t("lang.vip_tnc_para_7")
      },
      {
        text: t("lang.vip_tnc_para_8")
      }
    ];
    const vipItems = [
      {
        vipLevel: "1",
        vipGrade: "Bronze",
        upgrade: t("lang.first_successful_deposit"),
        monthly: "0",
        birthday: "0",
        rebates: [
          {
            rebateName: t("lang.slots_rebate"),
            rebateValue: "0.40%"
          },
          {
            rebateName: t("lang.fishing_rebate"),
            rebateValue: "0.40%"
          },
          {
            rebateName: t("lang.live_casino_rebate"),
            rebateValue: "0.40%"
          },
          {
            rebateName: t("lang.poker_rebate"),
            rebateValue: "0.40%"
          },
          {
            rebateName: t("lang.sport_esports_rebate"),
            rebateValue: "0.20%"
          },
          {
            rebateName: t("lang.lottery_rebate"),
            rebateValue: "0.30%"
          }
        ]
      },
      {
        vipLevel: "2",
        vipGrade: "Silver",
        upgrade: "500,000",
        monthly: "688",
        birthday: "888",
        rebates: [
          {
            rebateName: t("lang.slots_rebate"),
            rebateValue: "0.45%"
          },
          {
            rebateName: t("lang.fishing_rebate"),
            rebateValue: "0.45%"
          },
          {
            rebateName: t("lang.live_casino_rebate"),
            rebateValue: "0.45%"
          },
          {
            rebateName: t("lang.poker_rebate"),
            rebateValue: "0.45%"
          },
          {
            rebateName: t("lang.sport_esports_rebate"),
            rebateValue: "0.30%"
          },
          {
            rebateName: t("lang.lottery_rebate"),
            rebateValue: "0.30%"
          }
        ]
      },
      {
        vipLevel: "3",
        vipGrade: "Gold",
        upgrade: "1,500,000",
        monthly: "1,588",
        birthday: "2,888",
        rebates: [
          {
            rebateName: t("lang.slots_rebate"),
            rebateValue: "0.50%"
          },
          {
            rebateName: t("lang.fishing_rebate"),
            rebateValue: "0.50%"
          },
          {
            rebateName: t("lang.live_casino_rebate"),
            rebateValue: "0.50%"
          },
          {
            rebateName: t("lang.poker_rebate"),
            rebateValue: "0.50%"
          },
          {
            rebateName: t("lang.sport_esports_rebate"),
            rebateValue: "0.35%"
          },
          {
            rebateName: t("lang.lottery_rebate"),
            rebateValue: "0.40%"
          }
        ]
      },
      {
        vipLevel: "4",
        vipGrade: "Platinium",
        upgrade: "3,500,000",
        monthly: "2,888",
        birthday: "5,888",
        rebates: [
          {
            rebateName: t("lang.slots_rebate"),
            rebateValue: "0.60%"
          },
          {
            rebateName: t("lang.fishing_rebate"),
            rebateValue: "0.60%"
          },
          {
            rebateName: t("lang.live_casino_rebate"),
            rebateValue: "0.60%"
          },
          {
            rebateName: t("lang.poker_rebate"),
            rebateValue: "0.60%"
          },
          {
            rebateName: t("lang.sport_esports_rebate"),
            rebateValue: "0.40%"
          },
          {
            rebateName: t("lang.lottery_rebate"),
            rebateValue: "0.40%"
          }
        ]
      },
      {
        vipLevel: "5",
        vipGrade: "Diamond",
        upgrade: "7,000,000",
        monthly: "6,888",
        birthday: "8,888",
        rebates: [
          {
            rebateName: t("lang.slots_rebate"),
            rebateValue: "0.80%"
          },
          {
            rebateName: t("lang.fishing_rebate"),
            rebateValue: "0.70%"
          },
          {
            rebateName: t("lang.live_casino_rebate"),
            rebateValue: "0.70%"
          },
          {
            rebateName: t("lang.poker_rebate"),
            rebateValue: "0.70%"
          },
          {
            rebateName: t("lang.sport_esports_rebate"),
            rebateValue: "0.45%"
          },
          {
            rebateName: t("lang.lottery_rebate"),
            rebateValue: "0.50%"
          }
        ]
      },
      {
        vipLevel: "6",
        vipGrade: "Ruby",
        upgrade: "20,000,000",
        monthly: "18,888",
        birthday: "48,888",
        rebates: [
          {
            rebateName: t("lang.slots_rebate"),
            rebateValue: "1.00%"
          },
          {
            rebateName: t("lang.fishing_rebate"),
            rebateValue: "0.80%"
          },
          {
            rebateName: t("lang.live_casino_rebate"),
            rebateValue: "0.80%"
          },
          {
            rebateName: t("lang.poker_rebate"),
            rebateValue: "0.80%"
          },
          {
            rebateName: t("lang.sport_esports_rebate"),
            rebateValue: "0.55%"
          },
          {
            rebateName: t("lang.lottery_rebate"),
            rebateValue: "0.50%"
          }
        ]
      }
    ];

    const isClaimModal = ref(false);
    const claimMsg = ref("");

    const formatAmount = (num) => {
      return Math.floor(num)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    onMounted(() => {
      // console.log(store);
    });

    const claimRebate = (type, vipType) => {
      loading.value = true;
      if (vipType === "monthly") {
        loadingMClaim.value = true;
      } else if (vipType === "birthday") {
        loadingBClaim.value = true;
      }
      // console.log(eventapi);
      const eventUrl = "/bonus/claim/" + type;
      console.log(eventUrl);
      eventapi
        .put(eventUrl)
        .then((res) => {
          loading.value = false;
          loadingMClaim.value = false;
          loadingBClaim.value = false;
          var responseCode = res.data;
          if (responseCode.code === 0) {
            var rebatePoint = responseCode.data;

            claimMsg.value = "$" + rebatePoint;
            isClaimModal.value = true;

            // $q.dialog({
            //   class: "q-px-md q-pt-md",
            //   title: "สำเร็จ",
            //   message: "You won " + rebatePoint + " !",
            //   ok: {
            //     push: true,
            //     color: 'deep-orange',
            //     label: "ตกลง",
            //     tabindex: 1
            //   },
            //   persistent: true
            // });
          } else {
            // $q.notify({
            //   color: "negative",
            //   position: "top",
            //   message: responseCode.message,
            //   icon: "report_problem"
            // });
          }
        })
        .catch((error) => {
          loading.value = false;
          loadingMClaim.value = false;
          loadingBClaim.value = false;
          // $q.notify({
          //   color: "negative",
          //   position: "top",
          //   message: error.message,
          //   icon: "report_problem"
          // });
        });
    };

    return {
      columns,
      data,
      showRebate,
      promoExclusive,
      dataExclusive,
      terms,
      vipItems,
      loading,
      vipLevel,
      vipGrade,
      slide,
      claimRebate,
      store,
      isClaimModal,
      claimMsg,
      loadingMClaim,
      loadingBClaim,
      vipAccumulatedDeposits,
      vipAccumulatedDepositsCurrent,
      vipTurnoverRequirements,
      formatAmount
    };
  }
});
</script>
<style scoped lang="scss">
.main-section {
  background-repeat: repeat-x;
  background-size: contain;
}

.content-container {
  // padding-bottom: 80px;
  max-width: 900px;
  margin: 0 auto;
  width: 95%;
  position: relative;

  .content-txt-title {
    font-size: 22px;
  }

  .content-txt-value {
    display: flex;
    justify-content: space-between;
    padding-left: 20px;
    color: #9e9e9e;
    font-size: 16px;
    padding-top: 10px;
    padding-bottom: 30px;
    .content-txt-num {
    }
  }
}

.vip-lower-wrap {
  overflow: hidden;
  padding-left: 20px;
}

.vip-lower {
  display: flex;
  overflow-x: scroll;

  @media (min-width: 768px) {
    display: grid;
    grid-gap: 20px;
    grid-template-columns: 1fr 1fr;
    overflow: hidden;
  }

  @media (min-width: 992px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.vip-container {
  // background: linear-gradient(to bottom, #23263c, #190f25);
  min-height: 100vh;
  padding-top: 30px;

  .vip-headline {
    color: $header-color;
    font-size: 28px;
  }

  .inner-vip-mobile {
    display: none;
  }

  .vip__item {
    padding-right: 24px;

    .vipitem {
      max-width: 290px;
      min-height: 270px;
    }
  }

  .vipitem {
    position: relative;
    display: flex;
    flex-direction: column-reverse;
    // background: salmon;
    // background: url("../../assets/vip/vip_04.png") no-repeat top center;
    background-size: 100% !important;
    width: 350px;
    min-height: 310px;
    justify-content: flex-end;
    color: #3a375e;

    &.vipitem-classic {
      background: url("../../assets/vip/vip-sec-classic.png") no-repeat top center;
    }

    &.vipitem-bronze {
      background: url("../../assets/vip/vip-sec-bronze.png") no-repeat top center;
    }

    &.vipitem-silver {
      background: url("../../assets/vip/vip-sec-silver.png") no-repeat top center;
    }

    &.vipitem-gold {
      background: url("../../assets/vip/vip-sec-gold.png") no-repeat top center;
    }

    &.vipitem-platinium {
      background: url("../../assets/vip/vip-sec-platinium.png") no-repeat top center;
    }

    &.vipitem-diamond {
      background: url("../../assets/vip/vip-sec-diamond.png") no-repeat top center;
    }

    &.vipitem-ruby {
      background: url("../../assets/vip/vip-sec-ruby.png") no-repeat top center;
      color: #eed290;
    }

    .viplevelcircle {
      img {
        width: 140px;
        margin-top: 20px;
      }

      margin-bottom: -50px;
      z-index: 1;
    }

    .vipcontents {
      padding-top: 60px;
      // background: #2b2b4b;
      // color: #ffffff;
      border-radius: 20px;
      display: flex;
      // justify-content: center;
      // align-items: center;
      flex-direction: column;
      // border-top: 2px solid #db7e42;
      // border-bottom: 2px solid #db7e42;
      .title {
        font-size: 18px;
        line-height: 36px;
      }

      .vip-title {
        font-size: 26px;
        text-align: left;
        font-weight: 800;
        text-transform: uppercase;
        padding: 20px 20px 0;
      }

      .inner-vip {
        // background-color: #303450;
        width: 100%;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-evenly;
        font-size: 16px;
        font-family: "Arial";
        flex-wrap: wrap;
        padding: 0 24px;

        .txt-inner {
          text-align: left;
          width: 100%;
          display: flex;

          &.pt-40 {
            padding-top: 40px;
          }
          &.pt-20 {
            padding-top: 20px;
          }

          &.pt-10 {
            padding-top: 10px;
          }
          .txt-inner-title {
            width: 50%;
          }
          .txt-inner-content {
            width: 50%;
          }
          .txt-inner-content {
            width: 50%;
          }
        }
      }

      .second-vip {
        // background: #2b2b4b;
        width: 100%;
        display: flex;
        justify-content: space-around;
        font-size: 45px;
        line-height: 53px;

        div {
          flex: 1;
        }

        .common-btn {
          padding: 5px 10px;
          font-size: 12px;
          line-height: 20px;
          margin: 0 30px 30px;
        }
      }
    }
  }

  .vip-program {
    .game-title {
      margin-bottom: 30px;
    }

    margin: 50px auto;
    max-width: 1080px;
    width: 95%;

    .buttons {
      display: flex;
      justify-content: center;
      align-items: stretch;
      border: 1px solid $main-color;
      border-radius: 10px;
      margin-bottom: 10px;

      .common-btn {
        display: block;
        width: 100%;
        text-align: center;
        background: transparent;

        &.active {
          background-image: $linear-bg-red;
        }
      }
    }

    :deep(.ant-table-thead > tr > th) {
      text-align: center;

      &:nth-child(odd) {
        background: #2b2b4b;
      }
    }

    :deep(.ant-table-tbody > tr > td) {
      &:nth-child(odd) {
        background: #2b2b4b;
      }
    }

    .note {
      color: $main-color;
      margin-top: 5px;
      display: block;
    }
  }

  .terms-conditions {
    padding-bottom: 80px;
    padding-top: 30px;
    max-width: 900px;
    margin: 0 auto;
    width: 95%;
    position: relative;

    .game-title {
      margin-top: 80px;
      margin-bottom: 30px;
    }

    .terms {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .term {
        .circle-wrapper {
          margin-right: -50px;

          z-index: 1;
          background: #2b2b4b;
          border: 4px solid $border-color;
          border-radius: 50%;
          width: 80px;
          height: 80px;
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          left: 10px;

          .circle {
            border: 2px solid $border-color;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            font-size: 50px;
            font-family: Wave;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #ffffff;
          }
        }

        .term-text {
          min-height: 80px;
          width: calc(100% - 40px);
          border-radius: 10px;
          background: #2b2b4b;
          min-width: 20px;
          justify-content: center;
          align-items: center;
          display: flex;
          color: #ffffff;
          padding: 20px 20px 20px 80px;
          margin-left: 40px;
        }
      }
    }
  }
}

.section-product {
  width: 95%;
  min-height: 70vh;
  margin: 0 auto;
  padding: 50px 0 80px 0;
  /* position: relative; */
  .title {
    position: relative;

    &:after {
      content: "";
      position: absolute;
      height: 1px;
      width: 100%;
      left: 0;
      margin-top: 20px;
      background-color: rgb(214, 214, 214);
    }
  }

  .subintro {
    font-size: 16px;
    width: 100%;
    margin: auto;
    font-weight: 100;
    color: #190f25;
  }

  .item-group {
    padding-top: 50px;
    width: 100%;
    margin: 0 auto;
    display: grid;
    grid-gap: 20px;
    grid-template-columns: 1fr 1fr 1fr;

    &:last-child {
      padding-top: 30px;
    }
  }

  .set {
    margin: auto;
    width: 100%;
  }

  .items {
    position: relative;
    cursor: pointer;
    width: 100%;
    height: 340px;
    margin: auto;
    overflow: hidden;

    .theme {
      overflow: hidden;

      img {
        width: 100%;
        vertical-align: middle;
        margin-top: 70px;
        border-radius: 20px 20px 0 0;
      }
    }

    .main-object {
      position: absolute;
      top: 0;
      right: 0px;
      height: 225px;
      overflow: hidden;
      transform: translateY(0px);
      transition: 0.3s;

      img {
        vertical-align: middle;
        width: 100%;
      }
    }

    &:hover .main-object {
      position: absolute;
      transform: translateX(-25px);
    }

    .sub-object {
      display: none;
      position: absolute;
      top: 0;
      left: 10px;
      height: 225px;
      overflow: hidden;
      transform: translateY(0px);
      transition: 0.3s;

      img {
        vertical-align: middle;
        width: 100%;
      }
    }

    .txt {
      position: absolute;
      bottom: 0px;
      background: #2b2b4b;
      padding: 20px 80px 20px 20px;
      color: #fff;
      width: 100%;
      filter: brightness(0.9);
      border-radius: 0 0 20px 20px;

      p {
        font-size: 12px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 16px;
      }

      img {
        max-width: 50%;
        margin: 0 0 10px;
        display: block;
        max-height: 30px;
      }
    }

    &:hover {
      .txt {
        opacity: 1;
        filter: brightness(1);
      }
    }
  }
}

.section-product .item-group {
  grid-template-columns: 1fr;
}

.vip-program {
  display: none;
}

.vip-container {
  .banner-container {
    background-position: 70% 50%;

    .btn-wrapper {
      .center {
        max-width: 300px;
        width: 100%;
        margin: 0 auto;

        .page-headline {
          font-size: 5rem;
          line-height: 5rem;
        }

        .page-blend {
          font-size: 1.7rem;
          line-height: 1.7rem;
          padding: 10px;
        }

        .page-subline {
          font-size: 1rem;
          line-height: 1rem;
        }

        .page-liner {
          font-size: 0.7rem;
          line-height: 1rem;
        }
      }
    }
  }

  .vipitem {
    background-size: cover;
    min-width: 340px;
    margin: auto;

    .vipcontents {
      padding-bottom: 10px;
    }
  }

  .inner-vip-mobile {
    // margin-top: 20px;
    display: block;
    padding-right: 20px;

    .note {
      margin-top: 10px;
    }

    .rebates {
      display: grid;
      width: 100%;
      gap: 10px;
      text-align: center;

      .rebate {
        background: #23263c;
        //border-top: 5px solid $header-color;
        //border-bottom: 5px solid $header-color;
        border-top: 5px solid $border-color;
        border-bottom: 5px solid $border-color;
        border-radius: 20px;

        .name {
          font-size: 12px;
          line-height: 15px;
          color: #ffffff;
          padding: 10px 0;
        }

        .value {
          background: $dark-old;
          color: #ffffff;
          margin: 20px 0 0;
          font-family: Wave;
          font-size: 30px;
        }
      }
    }

    .note {
      color: #db7d42;
      font-size: 12px;
      text-align: left;
      padding: 0 10px;
      display: block;
    }
  }
}

// @media (max-width: 768px) {

// }

.vip-container {
  .inner-vip-mobile {
    .rebates {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

// @media (max-width: 500px) {
//   .vip-container {
//     .inner-vip-mobile {
//       .rebates {
//         grid-template-columns: repeat(2, 1fr);
//       }
//     }
//   }
// }
</style>
<!-- Carousel CSS only -->
<style lang="scss">
.q-carousel {
  overflow: hidden;
  margin: 0 auto;
  text-align: center;

  ol {
    padding: 0;
    margin: 0 auto;
    width: 100%;
    list-style-type: none;
    display: flex;
  }
}

.carousel__item {
  // background: url(../../assets/images/vip/vipbg.png)no-repeat center center;
  background-size: 100%;
  font-size: 20px;
  border-radius: 8px;
}

.carousel__slide {
  padding: 10px;
  width: 100%;
}

button {
  border: 0;
}

.carousel__prev,
.carousel__next {
  position: absolute;
  padding: 20px;

  box-sizing: content-box;
  background: url(../../assets/vip/nextprev.png) no-repeat center center;
  background-size: contain;
  top: 20%;

  .carousel__icon {
    display: none;
  }
}

.carousel__prev {
  top: 20%;
  left: 0%;
}

.carousel__next {
  transform: rotate(180deg);
  right: 0;
}
</style>
