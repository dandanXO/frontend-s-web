<template>
  <div class="vip-container">
    <div class="header-section">
      <img src="../assets/vip/vip-header.png" class="vip-header" />
    </div>
    <!--    <div class="banner-container" />-->

    <Carousel v-model="currentSlide" :items-to-show="2.95" :wrap-around="true">
      <Slide v-for="(vip, vipIndex) in vipItems" :key="vipIndex">
        <div class="carousel__item">
          <div :class="`vipitem vipitem${vip.vipLevel}`">
            <div class="claimButtons" v-if="currentSlide === vipIndex && store.token">
              <a
                v-if="vipIndex + 1 !== 1 && vipIndex + 1 !== 2 && vipIndex + 1 !== 3"
                @click="store.openLiveChat()"
                class="claimBtn vipBirthday"
              >
                <img width="18" height="18" src="../assets/images/vip/vip-birthday-cake-icon.svg" />
                {{ $t("vip.birthday") }}
              </a>
              <a
                v-if="vipIndex + 1 !== 1 && vipIndex + 1 !== 2"
                :class="{ unavailable: vipLevel !== Number(vip.vipLevel) || !canClaimMonthly }"
                @click="canClaimMonthly && vipLevel + 1 === Number(vip.vipLevel) ? claimBonus('monthly') : null"
                class="claimBtn vipMonthly"
              >
              <img width="18" height="18" src="../assets/images/vip/vip-calendar-icon.svg" />
                {{ $t("vip.monthly") }}
              </a>
              <a
                v-if="vipIndex + 1 !== 1 && vipIndex + 1 !== 2"
                :class="{ unavailable: vip.unavailable, claimed: vip.claimed }"
                @click="!vip.unavailable && !vip.claimed ? claimBonus('welcome', vipIndex + 1) : null"
                class="claimBtn vipWelcome"
              >
              <img width="18" height="18" src="../assets/images/vip/vip-money-icon.svg" />
                {{ $t("vip.upgrade") }}
              </a>
            </div>
            <div class="vipcontents">
              <div class="title">
                VIP{{ vip.vipLevel }}
                <span class="type">{{ vip.vipTitle }}</span>
              </div>
              <div class="description">
                <span v-if="vipIndex !== 0">
                  {{ $t("vip.vipUpgradeRequired") }}:
                  <span style="color: #424f72">{{ $t("vip.totalBetMonth") }} {{ vip.upgrade }}</span>
                </span>
                <br />

                {{ $t("vip.vipMaintainRequired") }}:
                <span style="color: #424f72">
                  <span v-if="vipIndex === 0">{{ $t("vip.3timedeposit") }}</span>
                  <span v-else>{{ $t("vip.totalBetMonth") }} {{ vip.maintain }}</span>
                </span>
              </div>
              <!-- vip progress bar start -->
              <div class="progressBarContainer" v-if="vipLevel">
                <div class="progressBarOuterBar">
                  <div class="progressBarInnerBar" :style="{ width: getVipLevelProgress(vip) + '%' }" />
                </div>
                <div class="progressBarDescription">
                  <span>
                    {{ `V${vip.vipLevel - 1}` }}
                  </span>
                  <span>
                    {{ `V${+vip.vipLevel}` }}
                  </span>
                </div>
              </div>
              <!-- vip progress bar end -->
              <!--              <div-->
              <!--                style="color: #cfb282; font-size: 18px; position: absolute; bottom: 4px; left: 0; right: 0"-->
              <!--                v-if="vipLevel + 1 === Number(vip.vipLevel) && store.token"-->
              <!--              > {{ store.currency.label }}-->
              <!--                {{-->
              <!--                  Number(currentDepositAmt).toFixed(2)-->
              <!--                }}-->
              <!--              </div>-->
            </div>
            <div
              :class="`vipLevelReachStatus ${getVipLevelProgress(vip) === 100 && !!vipLevel ? 'vipLevelReached' : ''}`"
            >
              <span>
                {{ getVipLevelProgress(vip) === 100 && !!vipLevel ? $t("vip.achieved") : $t("vip.unachieved") }}
              </span>
            </div>
          </div>
          <!-- <router-link
            to="/center/deposit"
            class="vipLevelButton"
            v-if="vip.depositPromoAvailable && !vip.unavailable && !vip.claimed"
          >
            {{ $t('vip.proceedToDeposit') }}
          </router-link>
          <div
            @click="claimVIPLevelItem(vip)"
            class="vipLevelButton"
            v-if="vip.promoAvailable && !vip.unavailable && !vip.claimed"
          >
            {{$t('vip.claimVIP')}}
          </div>
          <div class="vipLevelButton claimed" v-if="vip.claimed && !vip.unavailable">{{ $t('vip.claimed') }}</div> -->
        </div>
      </Slide>
      <template #addons>
        <Navigation />
      </template>
    </Carousel>

    <div class="vip-program">
      <div class="buttons">
        <div class="common-btn" :class="{ active: showRebate }" @click="onShowRebateClick(true)">
          {{ $t("vip.vipProgram") }}
        </div>
        <div class="common-btn" :class="{ active: !showRebate }" @click="onShowRebateClick(false)">
          {{ $t("vip.exclusivePromotions") }}
        </div>
      </div>
      <div v-if="showRebate">
        <div class="vip-table" id="left">
          <table>
            <tbody>
              <tr>
                <td></td>
                <td>IRON</td>
                <td>BRONZE</td>
                <td>SILVER</td>
                <td>GOLD</td>
                <td>PLATINUM</td>
                <td>RUBY</td>
                <td>DIAMOND</td>
              </tr>
            </tbody>
          </table>
          <div>
            <div class="tbl-title free">{{ $t("vip.freeBonus") }}</div>

            <table class="free">
              <tbody>
                <tr>
                  <td>{{ $t("vip.welcomeBonus") }}</td>
                  <td></td>
                  <td></td>
                  <td>888</td>
                  <td>1,888</td>
                  <td>3,888</td>
                  <td>5,888</td>
                  <td>10,888</td>
                </tr>
                <tr>
                  <td>{{ $t("vip.monthlyBonus") }}</td>
                  <td></td>
                  <td></td>
                  <td>588</td>
                  <td>888</td>
                  <td>1,888</td>
                  <td>3,888</td>
                  <td>5,888</td>
                </tr>

                <tr>
                  <td>{{ $t("vip.birthdayBonus") }}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>888</td>
                  <td>2,888</td>
                  <td>5,888</td>
                  <td>8,888</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <div class="tbl-title rebate">{{ $t("vip.rebateBonus") }}</div>

            <table class="rebate">
              <tbody>
                <tr>
                  <td>{{ $t("vip.sportRebate") }}</td>
                  <td>0.30%</td>
                  <td>0.38%</td>
                  <td>0.48%</td>
                  <td>0.58%</td>
                  <td>0.68%</td>
                  <td>0.78%</td>
                  <td>0.88%</td>
                </tr>
                <tr>
                  <td>{{ $t("vip.esportRebate") }}</td>
                  <td>0.40%</td>
                  <td>0.48%</td>
                  <td>0.58%</td>
                  <td>0.68%</td>
                  <td>0.78%</td>
                  <td>0.88%</td>
                  <td>1.00%</td>
                </tr>

                <tr>
                  <td>{{ $t("vip.liveCasinoRebate") }}</td>
                  <td>0.40%</td>
                  <td>0.45%</td>
                  <td>0.50%</td>
                  <td>0.55%</td>
                  <td>0.60%</td>
                  <td>0.70%</td>
                  <td>0.80%</td>
                </tr>
                <tr>
                  <td>{{ $t("vip.pokerRebate") }}</td>
                  <td>0.40%</td>
                  <td>0.48%</td>
                  <td>0.58%</td>
                  <td>0.68%</td>
                  <td>0.78%</td>
                  <td>0.88%</td>
                  <td>1.00%</td>
                </tr>
                <tr>
                  <td>{{ $t("vip.slotRebate") }}</td>
                  <td>0.60%</td>
                  <td>0.70%</td>
                  <td>0.80%</td>
                  <td>1.00%</td>
                  <td>1.20%</td>
                  <td>1.60%</td>
                  <td>2.00%</td>
                </tr>

                <tr>
                  <td>{{ $t("vip.lotteryRebate") }}</td>
                  <td>0.30%</td>
                  <td>0.30%</td>
                  <td>0.40%</td>
                  <td>0.40%</td>
                  <td>0.50%</td>
                  <td>0.50%</td>
                  <td>0.60%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <div class="tbl-title monthly">{{ $t("vip.monthlyReload") }}</div>

            <table class="monthly">
              <tbody>
                <tr>
                  <td>{{ $t("vip.monthlyReloadPercent") }}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>30%</td>
                  <td>30%</td>
                  <td>30%</td>
                </tr>
                <tr>
                  <td>{{ $t("vip.minDeposit") }}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>3,500</td>
                  <td>3,500</td>
                  <td>3,500</td>
                </tr>
                <tr>
                  <td>{{ $t("vip.maxBonus") }}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>5,888</td>
                  <td>8,888</td>
                  <td>12,888</td>
                </tr>
                <tr>
                  <td>{{ $t("vip.returnOver") }}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>15</td>
                  <td>15</td>
                  <td>15</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div v-else>
        <table class="promo">
          <tbody>
            <tr>
              <td>{{ $t("vip.betLimit") }}</td>
              <td>{{ $t("vip.standard") }}</td>
              <td>{{ $t("vip.standard") }}</td>
              <td>{{ $t("vip.standard") }}</td>
              <td>{{ $t("vip.standard") }}</td>
              <td>{{ $t("vip.highLimit") }}</td>
              <td>{{ $t("vip.highLimit") }}</td>
              <td>{{ $t("vip.highLimit") }}</td>
            </tr>

            <tr>
              <td>{{ $t("vip.priorityPaymentMethod") }}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>✓</td>
              <td>✓</td>
              <td>✓</td>
            </tr>
            <tr>
              <td>{{ $t("vip.customerCare") }}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>✓</td>
              <td>✓</td>
            </tr>
            <tr>
              <td>{{ $t("vip.invitationExclusive") }}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>✓</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="left" />
      <div class="right" />
    </div>

    <div class="terms-conditions">
      <div class="section-title">{{ $t("vip.vipTerms") }}</div>
      <img
        class="terms-conditions-title-separator"
        :src="require('../assets/vip/terms-condition-title-separator.png')"
      />
      <ol class="terms">
        <!-- <li v-for="(term, i) in currentDisplayTerms" :key="i" class="term">
          {{ term.text }}
        </li> -->
        <li class="term" v-for="term in 10" :key="term">
          {{ $t(`vip.tnc${term}`) }}
        </li>
      </ol>
    </div>
  </div>

  <el-dialog class="" v-model="privilegeClaimedModalVisible" width="600px" align-center>
    <div class="noticedialog">
      <div class="title" style="flex-direction: column; display: flex">
        {{ modalTitle }}
        <span style="font-size: 30px; color: #5196ff">{{ amount ? amount : 0 }}</span>
      </div>
      <div class="standard-button-container">
        <button class="standard-button btn-color-blue" @click="claimNow()">{{ $t("common.confirm") }}</button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { ref, reactive, defineComponent, computed, onMounted } from "vue";
import { canRedeemMonthly, canRedeemWelcome, claimMonthly, claimWelcome } from "@/api/index/promo";
import { userStore } from "@/store";
import { Carousel, Slide, Navigation } from "vue3-carousel";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "VIPView",
  components: {
    Carousel,
    Slide,
    Navigation,
  },
  setup() {
    const { t } = useI18n();
    const store = userStore();
    const amount = ref("0");
    const privilegeClaimedModalVisible = ref(false);
    const vipLevel = computed(() => {
      return +store.vip.replace("VIP", "");
    });
    const currentDepositAmt = computed(() => {
      return store.getCurrentDeposit();
    });
    const getVipLevelProgress = (vipInfo) => {
      const vipLevel = +store.vip.replace("VIP", "");
      const currentDeposit = +store.getCurrentDeposit();
      const upgradeStatus = vipInfo.upgrade;

      if (vipLevel >= +vipInfo.vipLevel) {
        return 100;
      }
      var levelUpDeposit = +upgradeStatus.replaceAll(",", "");
      if (!levelUpDeposit) {
        levelUpDeposit = 0;
      }
      if (vipLevel === 0) {
        return 0;
      }
      if (vipLevel + 1 === +vipInfo.vipLevel) {
        return (currentDeposit / levelUpDeposit) * 100;
      }
      if (currentDeposit > levelUpDeposit + 1) {
        return 100;
      } else {
        return 0;
      }

      // const levelUpDeposit = +upgradeStatus.replaceAll(",", "");
      // return (currentDeposit / levelUpDeposit) * 100;

      // const levelUpDeposit = +upgradeStatus.replaceAll(",", "");
      // return (currentDeposit / levelUpDeposit) * 100;
    };
    const storeToken = computed(() => {
      return store.token;
    });
    const modalTitle = ref("");
    const claimBonus = (vipType, vipLevel) => {
      if (vipType === "monthly") {
        claimMonthly().then((res) => {
          if (res.code === 0) {
            amount.value = store.currency.label + res.data;
            privilegeClaimedModalVisible.value = true;
            modalTitle.value = t("vip.monthlyBonus");
          } else {
            ElMessage.error(res.message);
          }
        });
      } else if (vipType === "welcome") {
        claimWelcome(vipLevel).then((res) => {
          if (res.code === 0) {
            amount.value = store.currency.label + res.data;
            privilegeClaimedModalVisible.value = true;
            modalTitle.value = t("vip.welcomeBonus");
          } else {
            ElMessage.error(res.message);
          }
        });
      }
    };
    const claimNow = () => {
      privilegeClaimedModalVisible.value = false;
      store.getBalance();
      initVIPTable();
    };
    // const loadingClaim = ref(false);
    // const loadingMClaim = ref(false);
    // const loadingBClaim = ref(false);
    // const dailySlot = (bonusItem, vipType) => {
    //   loadingClaim.value = true;
    //   if (vipType === "monthly") {
    //     loadingMClaim.value = true;
    //   } else if (vipType === "birthday") {
    //     loadingBClaim.value = true;
    //   }
    //   claimBonusItem(bonusItem)
    //     .then((res) => {
    //       if (res.code === 0) {
    //         amount.value = "$" + res.data;
    //         privilegeClaimedModalVisible.value = true;
    //         loadingClaim.value = false;
    //         loadingMClaim.value = false;
    //         loadingBClaim.value = false;
    //         store.getBalance();
    //       } else {
    //         ElMessage.error(res.message);
    //         loadingClaim.value = false;
    //         loadingMClaim.value = false;
    //         loadingBClaim.value = false;
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err.message);
    //     });
    // };

    // const terms = [
    //   {
    //     text: `所有雷火电竞会员存款达到相应VIP等级要求即可享有特定免费奖金、存送奖金或其他奖励，存送奖金只需完成（存款+奖金）*相应流水倍数即可提款。`
    //   },
    //   {
    //     text: `达到相应等级要求的会员可以点击"待领取"，领取免费奖金或存款选择相对应的存送优惠即可。`
    //   },
    //   {
    //     text: `各等级所对应的优惠所要求的流水有所不同，会员需要达到相应流水方可申请提款。`
    //   },
    //   {
    //     text: `此优惠促销只适用于拥有一个独立账户的玩家。住址、电子邮箱地址﹑电话号码﹑支付方式（相同借记卡/信用卡/银行账户号码）IP地址，同一网络环境等将可以作为判定是否独立玩家的条件。对于发现任何有违背、欺骗、或利用规则和条款进行非法获利的会员，雷火电竞保留在任何时候都可以停止、取消优惠或索回已支付的全部优惠的权利。`
    //   },
    //   {
    //     text: `在某些未知因素超出可控范围的情况下，雷火电竞保留可单方面执行的决定权，并承诺会在这类紧急问题发生时解释给客户原因并听取客户反馈与客户沟通协商解决。`
    //   },
    //   {
    //     text: `雷火电竞保留对本次活动的修订、终止和最终解释权，超出本网站控制外的技术错误，雷火电竞将不承担任何责任。`
    //   },
    //   {
    //     text: `雷火电竞有权延长，缩短，终止，或者修改此活动！此活动最终解释权归雷火电竞所有。`
    //   }
    // ];

    // const vipTerms = [
    //   {
    //     text: `所有雷火电竞会员存款达到相应VIP等级要求即可享有特定免费奖金、存送奖金或其他奖励，存送奖金只需完成（存款+奖金）*相应流水倍数即可提款。`
    //   },
    //   {
    //     text: `达到相应等级要求的会员可以点击"待领取"，领取免费奖金或存款选择相对应的存送优惠即可。`
    //   },
    //   {
    //     text: `各等级所对应的优惠所要求的流水有所不同，会员需要达到相应流水方可申请提款。`
    //   },
    //   {
    //     text: `此优惠促销只适用于拥有一个独立账户的玩家。住址、电子邮箱地址﹑电话号码﹑支付方式（相同借记卡/信用卡/银行账户号码）IP地址，同一网络环境等将可以作为判定是否独立玩家的条件。对于发现任何有违背、欺骗、或利用规则和条款进行非法获利的会员，雷火电竞保留在任何时候都可以停止、取消优惠或索回已支付的全部优惠的权利。`
    //   },
    //   {
    //     text: `在某些未知因素超出可控范围的情况下，雷火电竞保留可单方面执行的决定权，并承诺会在这类紧急问题发生时解释给客户原因并听取客户反馈与客户沟通协商解决。`
    //   },
    //   {
    //     text: `雷火电竞保留对本次活动的修订、终止和最终解释权，超出本网站控制外的技术错误，雷火电竞将不承担任何责任。`
    //   },
    //   {
    //     text: `雷火电竞有权延长，缩短，终止，或者修改此活动！此活动最终解释权归雷火电竞所有。`
    //   }
    // ];

    const showRebate = ref(true);
    // const currentDisplayTerms = ref(vipTerms);
    const onShowRebateClick = (flag) => {
      showRebate.value = flag;
      // if (showRebate.value) currentDisplayTerms.value = terms;
      // else currentDisplayTerms.value = vipTerms;
    };

    const vipItems = reactive([
      {
        vipLevel: "1",
        upgrade: "100",
        maintain: "",
        vipTitle: "IRON",
        depositPromoAvailable: false,
        promoAvailable: false,
        unavailable: false,
        claimed: false
      },
      {
        vipLevel: "2",
        upgrade: "380,000",
        maintain: "200,000",
        vipTitle: "BRONZE",
        depositPromoAvailable: false,
        promoAvailable: false,
        unavailable: false,
        claimed: false
      },
      {
        vipLevel: "3",
        upgrade: "1,000,000",
        maintain: "600,000",
        vipTitle: "SILVER",
        depositPromoAvailable: false,
        promoAvailable: false,
        unavailable: false,
        claimed: false
      },
      {
        vipLevel: "4",
        upgrade: "3,000,000",
        maintain: "2,000,000",
        vipTitle: "GOLD",
        depositPromoAvailable: false,
        promoAvailable: false,
        unavailable: false,
        claimed: false
      },
      {
        vipLevel: "5",
        upgrade: "9,000,000",
        maintain: "3,000,000",
        vipTitle: "PLATINUM",
        depositPromoAvailable: false,
        promoAvailable: false,
        unavailable: false,
        claimed: false
      },
      {
        vipLevel: "6",
        upgrade: "20,000,000",
        maintain: "6,000,000",
        vipTitle: "RUBY",
        depositPromoAvailable: false,
        promoAvailable: false,
        unavailable: false,
        claimed: false
      },
      {
        vipLevel: "7",
        upgrade: "50,000,000",
        maintain: "20,000,000",
        vipTitle: "DIAMOND",
        depositPromoAvailable: false,
        promoAvailable: false,
        unavailable: false,
        claimed: false
      }
    ]);
    const canClaimMonthly = ref(false);
    const initVIPTable = () => {
      if (store.token) {
        canRedeemMonthly("vnm-vip-monthly").then((res) => {
          if (res.code === 0) {
            canClaimMonthly.value = res.data;
          }
        });
        canRedeemWelcome().then((res) => {
          if (res.code === 0) {
            // Your arrays of elements
            const promoAvailableElements = res.data.promoAvailable;
            const unavailableElements = res.data.unavailable;
            const claimedElements = res.data.claimed;

            // Function to update properties based on the provided elements
            function updatePropertiesBasedOnElements(elements, property) {
              elements.forEach((element) => {
                const index = element - 1;
                if (index >= 0 && index < vipItems.length) {
                  vipItems[index][property] = true;
                }
              });
            }
            // Call the function to update properties based on promoAvailable elements
            updatePropertiesBasedOnElements(promoAvailableElements, "promoAvailable");

            // Call the function to update properties based on unavailable elements
            updatePropertiesBasedOnElements(unavailableElements, "unavailable");

            // Call the function to update properties based on unavailable elements
            updatePropertiesBasedOnElements(claimedElements, "claimed");

            // Now, vipItems array has the updated properties based on the provided elements
            // console.log(vipItems);
          } else {
            ElMessage.error(res.message);
          }
        });
      }
    };
    // const claimVIPLevelItem = (vip) => {
    //   claim(vip.vipLevel).then((res) => {
    //     if (res.code === 0) {
    //       ElMessage.success(t('common.claimedSuccess'));
    //       store.getBalance();
    //       initVIPTable();
    //     } else {
    //       ElMessage.error(res.message)
    //     }
    //   });
    // };
    const currentSlide = ref(0);
    const slideTo = () => {
      const vipLevel = +store.vip.replace("VIP", "");
      if (vipLevel === 0) {
        currentSlide.value = 0;
        return;
      }
      currentSlide.value = vipLevel - 1;
    };
    onMounted(() => {
      initVIPTable();
      slideTo();
    });

    return {
      showRebate,
      onShowRebateClick,
      // terms,
      vipItems,
      vipLevel,
      getVipLevelProgress,
      storeToken,
      amount,
      privilegeClaimedModalVisible,
      // currentDisplayTerms,
      // vipTerms,
      // claimVIPLevelItem,
      currentSlide,
      slideTo,
      currentDepositAmt,
      store,
      canClaimMonthly,
      claimBonus,
      claimNow,
      modalTitle
    };
  }
});
</script>
<style scoped lang="scss">
$border-settings: 1px solid #e5e7eb;

.carousel__slide {
  .vipLevelButton {
    display: none;
  }
}
.carousel__slide--active {
  .vipLevelButton {
    background: url("../assets/vip/button.png") no-repeat center center;
    background-size: contain;
    padding: 15px;
    color: #000000;
    display: flex;
    justify-content: center;
    margin-top: 15px;
    padding-bottom: 23px;
    cursor: pointer;
    &.claimed {
      background: #d7d7d7;
      border-radius: 40px;
      color: #959595;
      padding: 15px;
      width: 50%;
      margin: 20px auto;
    }
  }
}
.vip-container {
  position: relative;
  background-image: url("../assets/vip/vip-bg.jpg");
  background-color: #f3f7fd;
  background-repeat: no-repeat;
  background-position: top center;
  background-size: cover;
  background-attachment: fixed;
  color: #8d8d8d;
  min-height: 100vh;

  .header-section {
    margin: 0 auto;
    width: 100%;
    text-align: center;
  }
  .vip-header {
    width: 400px;
    margin: 10px auto;
  }

  .banner-container {
    background: url("../assets/vip/banner.png") no-repeat center center;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    min-height: 600px;
  }

  .vipitem {
    display: flex;
    flex-direction: column-reverse;
    justify-content: flex-end;
    position: relative;
    width: 564px;
    height: 284px;
    background: url("../assets/vip/badge/banner-1.png") no-repeat top center;
    background-size: contain;
    margin-bottom: 90px;
    .claimButtons {
      display: flex;
      position: absolute;
      // right: 34%;
      gap: 10px;
      // top: 25px;
      bottom: -50px;
      justify-content: center;
      align-items: center;
      width: 100%;
      z-index: 99;
      .claimBtn {
        cursor: pointer;
        gap: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        border-radius: 15px;
        padding: 8px;
        line-height: 9px;
        // color: #cdae77;
        // box-shadow: 0px 2px 5px 0px #cdae77 inset;
        background: linear-gradient(360deg, #e29100 0%, #f8d79d 70%, #f2e4b6 80%, #ffb42a 100%);
        color: #000000;
        &.unavailable {
          cursor: unset;
          pointer-events: none;
          color: #b1b1b1;
          background: linear-gradient(360deg, #d3d3d3 0%, #e6e6e6 70%, #f2f2f2 80%, #ffffff 100%);
          svg {
            fill: #b1b1b1;
          }
        }
        &.claimed {
          // box-shadow: 0px 2px 5px 0px #78634a inset;
          pointer-events: none;
          background: linear-gradient(360deg, #d4af37 0%, #ffd700 70%, #e6c200 80%, #ffc532 100%);
          color: #8f8f8f;
          cursor: unset;
          svg {
            fill: #8f8f8f;
          }
        }
        svg {
          width: 18px;
          fill: #000000;
        }
      }
    }

    &2 {
      background: url("../assets/vip/badge/banner-2.png") no-repeat top center;
      background-size: contain;
    }

    &3 {
      background: url("../assets/vip/badge/banner-3.png") no-repeat top center;
      background-size: contain;
    }

    &4 {
      background: url("../assets/vip/badge/banner-4.png") no-repeat top center;
      background-size: contain;
    }

    &5 {
      background: url("../assets/vip/badge/banner-5.png") no-repeat top center;
      background-size: contain;
    }

    &6 {
      background: url("../assets/vip/badge/banner-6.png") no-repeat top center;
      background-size: contain;
    }

    &7 {
      background: url("../assets/vip/badge/banner-7.png") no-repeat top center;
      background-size: contain;
    }

    &8 {
      background: url("../assets/vip/badge/banner-8.png") no-repeat top center;
      background-size: contain;
    }

    &9 {
      background: url("../assets/vip/badge/banner-9.png") no-repeat top center;
      background-size: contain;
    }

    &10 {
      background: url("../assets/vip/badge/banner-10.png") no-repeat top center;
      background-size: contain;
    }

    &11 {
      background: url("../assets/vip/badge/banner-11.png") no-repeat top center;
      background-size: contain;
    }

    &12 {
      background: url("../assets/vip/badge/banner-12.png") no-repeat top center;
      background-size: contain;
    }
    .vipLevelReachStatus {
      background: url("../assets/vip/badge/vip-level-banner-status-ribbon-unachieved.png") no-repeat left center;
      background-size: contain;
      margin-top: 15px;
      margin-left: 2px;
      z-index: 1;
      text-align: left;
      height: 75px;

      &.vipLevelReached {
        background: url("../assets/vip/badge/vip-level-banner-status-ribbon-achieved.png") no-repeat left center;
        background-size: contain;
      }

      span {
        color: #fff;
        margin-left: 30px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 100%;
      }
    }
    .vipcontents {
      height: 100%;
      border-radius: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-direction: column;
      padding: 30px 30px;

      .title {
        color: #333;
        text-align: center;
        font-family: Arial Narrow;
        font-size: 51.319px;
        font-style: italic;
        font-weight: 700;
        line-height: normal;
        .type {
          color: #7a80a1;
          font-weight: 400;
          font-size: 30.84px;
          display: inline-block;
          font-style: normal;
        }
      }

      .description {
        color: #7a80a1;
        font-size: 13.987px;
        font-style: normal;
        font-weight: 400;
        text-align: left;
        line-height: normal;
      }

      .progressBarContainer {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;

        .progressBarOuterBar {
          border-radius: 16px;
          background: grey;
          width: 100%;
          overflow: hidden;
        }

        .progressBarInnerBar {
          color: #fff;
          border-radius: 16px;
          background: linear-gradient(90deg, #e5cda5 0.87%, #b48f57 100%);
          height: 10px;
        }

        .progressBarDescription {
          display: flex;
          justify-content: space-between;
          color: #333;
          font-size: 17.987px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
        }
      }

      .inner-vip {
        background-color: #303450;
        width: 100%;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-evenly;
        font-size: 45px;
        line-height: 53px;
        font-family: "Arial";
      }
    }
  }
  .vip-program {
    margin: 50px auto;
    max-width: 1300px;
    width: 95%;

    .tbl-title {
      padding: 10px;
      font-weight: bold;
      color: #000000;
      text-transform: uppercase;
      &.free {
      }
    }
    table {
      width: 100%;
      table-layout: fixed;
      border-collapse: collapse;
      border: $border-settings;

      th {
        border-bottom: $border-settings;
        background-color: #f9fafb;
        color: #6b7280;
      }

      td {
        color: #111827;
        border-right: $border-settings;
        img {
          width: 20px;
        }

        &:has(.disable) {
          background-color: #e7e7e7;
          background-color: #e7e7e74f;
        }
      }

      th,
      td {
        padding: 16px 24px 16px 24px;
        border-bottom: $border-settings;
      }
    }

    .buttons {
      display: flex;
      justify-content: center;
      align-items: stretch;
      border: 1px solid #fce9c5;
      border-radius: 58.321px;
      width: fit-content;
      margin: 0px auto 20px auto;

      .common-btn {
        display: block;
        text-align: center;
        color: #858585;
        background: #f9fcff;
        border: 0px;
        border-radius: 58.321px;
        padding: 8px 30px;
        font-size: 18px;
        font-weight: 700;
        transition: all 0.3s;
        filter: brightness(1);
        margin: 5px;

        &:hover {
          filter: brightness(0.9);
        }

        &.active {
          background: linear-gradient(90deg, #e5cda5 0.87%, #b48f57 100%);
          box-shadow: 0px 4px 4px 0px #ffffff40 inset;
          box-shadow: 0px -4px 4px 0px #89520040 inset;
          color: #fff;
        }
      }
    }

    .separator {
      margin: 20px 0;
    }
  }

  .terms-conditions {
    padding-bottom: 80px;
    margin: 0 auto;
    width: 80%;
    position: relative;

    .section-title {
      background: linear-gradient(90deg, #e5cda5 0.87%, #b48f57 100%);
      background-clip: text;
      text-align: center;
      font-size: 48px;
    }

    .terms-conditions-title-separator {
      width: 100%;
      height: 100%;
    }

    .terms {
      display: flex;
      flex-direction: column;
      // align-items: center;
      font-size: 16px;
      font-weight: 400;
      line-height: 30px;

      .term {
        max-width: 1300px;
        width: 100%;
        margin-top: 39px;
        list-style-type: decimal;
      }
    }
  }
}

@media (max-width: 767px) {
  .vip-program {
    display: none;
  }

  .vip-container {
    .banner-container {
      min-height: 300px;
      background-position: center center;
    }

    .vipitem {
      width: 430px;
      height: 215px;
      margin: auto;

      .vipLevelReachStatus {
        margin-top: 12px;
        margin-left: 3px;
      }

      .vipcontents {
        padding-bottom: 10px;
      }
    }
  }
}
</style>
<style lang="scss">
.carousel {
  max-width: 1080px;
  margin: 0 auto;
}

.carousel__item {
  // background: url(../assets/vip/vipbg.png)no-repeat center center;
  background-size: 100%;
  font-size: 20px;
  border-radius: 8px;
}

.carousel__slide {
  padding: 10px;
  align-items: flex-start;
}

.carousel__prev,
.carousel__next {
  box-sizing: content-box;
  background: transparent;
  top: 180px;
  width: 40%;
  height: 90%;

  svg {
    width: 30px;
    height: 30px;
    background: url(../assets/vip/nextprev.png) no-repeat center center;
    background-size: contain;
  }
}

.carousel__prev {
  left: 4%;
}

.carousel__next {
  right: 4%;
}

.carousel__slide > .carousel__item {
  transform: scale(0.2);
  //filter: brightness(0.7);
  transition: 0.5s;
}

.carousel__slide--visible > .carousel__item {
  opacity: 1;
  filter: brightness(1);
  transform: rotateY(0);
}

.carousel__slide--next > .carousel__item {
  /* transform: scale(1.2) translate(-10px); */
  transform: scale(0.8) translate(-170px);
  z-index: -2;
}

.carousel__slide--prev > .carousel__item {
  transform: scale(0.8) translate(170px);
  z-index: -2;
  /* transform: scale(0.9) translate(10px); */
}

.carousel__slide--active > .carousel__item {
  transform: scale(1);
  z-index: 0;
}

@media (max-width: 767px) {
  .carousel__prev,
  .carousel__next {
    top: 15%;
  }

  .carousel__next {
    top: 13.5%;
    right: 2%;
  }

  .carousel__slide > .carousel__item {
    transform: scale(0);
    filter: brightness(0.7);
    transition: 0.5s;
  }

  .carousel__slide--visible > .carousel__item {
    opacity: 1;
    filter: brightness(1);
    transform: rotateY(0);
  }
}
</style>
