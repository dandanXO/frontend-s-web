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
            <div class="vipcontents">
              <div class="title">
                VIP{{ vip.vipLevel }}
                <span class="type">{{ vip.vipTitle }}</span>
              </div>
              <div class="description">
                累计存款:
                <span style="color: #424f72">{{ vip.upgrade }}</span>
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
              <div
                style="color: #cfb282; font-size: 18px; position: absolute; bottom: 25px; left: 0; right: 0"
                v-if="vipLevel + 1 === Number(vip.vipLevel)"
              >
                {{
                  Number(currentDepositAmt)
                    .toLocaleString("en-US", { style: "currency", currency: "CNY" })
                    .replace("CN", "")
                }}
              </div>
            </div>
            <div
              :class="`vipLevelReachStatus ${getVipLevelProgress(vip) === 100 && !!vipLevel ? 'vipLevelReached' : ''}`"
            >
              <span>{{ getVipLevelProgress(vip) === 100 && !!vipLevel ? "已达到" : "未达到" }}</span>
            </div>
          </div>
          <router-link
            to="/center/deposit"
            class="vipLevelButton"
            v-if="vip.depositPromoAvailable && !vip.unavailable && !vip.claimed"
          >
            前往存款
          </router-link>
          <div
            @click="claimVIPLevelItem(vip)"
            class="vipLevelButton"
            v-if="vip.promoAvailable && !vip.unavailable && !vip.claimed"
          >
            领取VIP等级奖励
          </div>
          <div class="vipLevelButton claimed" v-if="vip.claimed && !vip.unavailable">领取成功</div>
        </div>
      </Slide>
      <template #addons>
        <Navigation />
      </template>
    </Carousel>

    <div class="vip-program">
      <div class="buttons">
        <div class="common-btn" :class="{ active: showRebate }" @click="onShowRebateClick(true)">升级细则</div>
        <div class="common-btn" :class="{ active: !showRebate }" @click="onShowRebateClick(false)">VIP特权</div>
      </div>
      <div v-if="showRebate">
        <table>
          <thead>
            <tr>
              <th colspan="2">级别</th>
              <th>升级要求累积存款</th>
              <th>等级优惠</th>
              <th>流水要求</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowspan="2" width="100">青铜</td>
              <td width="100">青铜Ⅱ</td>
              <td width="260">一笔存款</td>
              <td width="384" id="vipPromoInfo2">网站首存优惠</td>
              <td width="252">无（不包含彩票场馆）</td>
            </tr>
            <tr>
              <td>青铜Ⅰ</td>
              <td>3,000</td>
              <td id="vipPromoInfo3">存款最少20元可申请一次晋级奖金88元</td>
              <td>电竞/体育10倍 老虎机12倍 真人18倍 棋牌20倍（不包含彩票场馆）</td>
            </tr>
            <tr>
              <td rowspan="3">白银</td>
              <td>白银Ⅲ</td>
              <td>30,000</td>
              <td id="vipPromoInfo4">
                存款最少100元可申请每月一次再存20% 最高奖金1888元
                <span style="color: #b8945d">（仅限白银Ⅲ申请）</span>
              </td>
              <td>电竞/体育 15倍 老虎机12倍 真人18倍 棋牌20倍（不包含彩票场馆）</td>
            </tr>
            <tr>
              <td>白银Ⅱ</td>
              <td>80,000</td>
              <td id="vipPromoInfo5" class="showTips4">存款最少20元可申请一次晋级奖金188元</td>
              <td class="showTips4">电竞/体育 5倍 老虎机12倍 真人18倍 棋牌20倍（不包含彩票场馆）</td>
              <!-- <td colspan="2" class="hideTips4">
                <div class="vip-btn disable">未符合</div>
              </td> -->
            </tr>
            <tr>
              <td>白银Ⅰ</td>
              <td>200,000</td>
              <td id="vipPromoInfo6" class="showTips5">存款最少20元可申请一次晋级奖金388元</td>
              <td class="showTips5">电竞/体育 5倍 老虎机12倍 真人18倍 棋牌20倍（不包含彩票场馆）</td>
              <!-- <td colspan="2" class="hideTips5">
                <div class="vip-btn disable">未符合</div>
              </td> -->
            </tr>
            <tr>
              <td rowspan="3">黄金</td>
              <td>黄金Ⅲ</td>
              <td>400,000</td>
              <td id="vipPromoInfo7" class="showTips6">存款最少200元可申请一次再存30%最高奖金888元</td>
              <td class="showTips6">电竞/体育 15倍 老虎机12倍 真人18倍 棋牌20倍（不包含彩票场馆）</td>
              <!-- <td colspan="2" class="hideTips6">
                <div class="vip-btn disable">未符合</div>
              </td> -->
            </tr>
            <tr>
              <td>黄金Ⅱ</td>
              <td>600,000</td>
              <td id="vipPromoInfo8" class="showTips7">存款最少20元可申请一次晋级奖金888元</td>
              <td class="showTips7">电竞/体育 5倍 老虎机12倍 真人18倍 棋牌20倍（不包含彩票场馆）</td>
              <!-- <td colspan="2" class="hideTips7">
                <div class="vip-btn disable">未符合</div>
              </td> -->
            </tr>
            <tr>
              <td>黄金Ⅰ</td>
              <td>1,000,000</td>
              <td id="vipPromoInfo9" class="showTips8">存款最少500元可申请每月一次再存35% 最高奖金2888元</td>
              <td class="showTips8">电竞/体育 15倍 老虎机12倍 真人18倍 棋牌20倍（不包含彩票场馆）</td>
              <!-- <td colspan="2" class="hideTips8">
                <div class="vip-btn disable">未符合</div>
              </td> -->
            </tr>
            <tr>
              <td rowspan="2">铂金</td>
              <td>铂金Ⅱ</td>
              <td>2,000,000</td>
              <td id="vipPromoInfo10" class="showTips9">存款最少20元可申请一次晋级奖金1888元</td>
              <td class="showTips9">电竞/体育 8倍 老虎机12倍 真人18倍 棋牌20倍（不包含彩票场馆）</td>
              <!-- <td colspan="2" class="hideTips9">
                <div class="vip-btn disable">未符合</div>
              </td> -->
            </tr>
            <tr>
              <td>铂金Ⅰ</td>
              <td>4,000,000</td>
              <td id="vipPromoInfo11" class="showTips10">存款最少500元可申请一次再存40%最高奖金5888元</td>
              <td class="showTips10">电竞/体育 15倍 老虎机12倍 真人18倍 棋牌20倍（不包含彩票场馆）</td>
              <!-- <td colspan="2" class="hideTips10">
                <div class="vip-btn disable">未符合</div>
              </td> -->
            </tr>
            <tr>
              <td rowspan="1">钻石</td>
              <td>钻石</td>
              <td>8,000,000</td>
              <td id="vipPromoInfo12" class="showTips11">存款最少20元可申请一次晋级奖金8888元</td>
              <td class="showTips11">电竞/体育10倍 老虎机12倍 真人18倍 棋牌20倍（不包含彩票场馆）</td>
              <!-- <td colspan="2" class="hideTips11">
                <div class="vip-btn disable">未符合</div>
              </td> -->
            </tr>
            <tr>
              <td rowspan="1">最强王者</td>
              <td>王者</td>
              <td>12,000,000</td>
              <td id="vipPromoInfo13" class="showTips12">存款最少20元可申请一次晋级奖金18888元</td>
              <td class="showTips12">电竞/体育10倍 老虎机12倍 真人18倍 棋牌20倍（不包含彩票场馆）</td>
              <!-- <td colspan="2" class="hideTips12">
                <div class="vip-btn disable">未符合</div>
              </td> -->
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <table style="margin-top: 50px">
          <tbody>
            <tr>
              <th width="137">等级</th>
              <th width="137">青铜</th>
              <th width="137">白银</th>
              <th width="137">黄金</th>
              <th width="137">铂金</th>
              <th width="137">钻石</th>
              <th width="137">最强王者</th>
              <th width="137">反水限额</th>
            </tr>
            <tr>
              <td>电竞</td>
              <td>0.4%</td>
              <td>0.45%</td>
              <td>0.5%</td>
              <td>0.55%</td>
              <td>0.6%</td>
              <td>0.8%</td>
              <td rowspan="2">无上限</td>
            </tr>
            <tr>
              <td>体育</td>
              <td>0.4%</td>
              <td>0.45%</td>
              <td>0.5%</td>
              <td>0.55%</td>
              <td>0.6%</td>
              <td>0.8%</td>
            </tr>
            <tr>
              <td>真人</td>
              <td>0.4%</td>
              <td>0.45%</td>
              <td>0.5%</td>
              <td>0.55%</td>
              <td>0.6%</td>
              <td>0.8%</td>
              <td>88888元</td>
            </tr>
            <tr>
              <td>棋牌</td>
              <td>0.4%</td>
              <td>0.45%</td>
              <td>0.5%</td>
              <td>0.6%</td>
              <td>0.8%</td>
              <td>1.0%</td>
              <td>8888元</td>
            </tr>
            <tr>
              <td>老虎机</td>
              <td>0.6%</td>
              <td>0.8%</td>
              <td>1.0%</td>
              <td>1.2%</td>
              <td>1.6%</td>
              <td>2.0%</td>
              <td>无上限</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="left" />
      <div class="right" />
    </div>

    <div class="terms-conditions">
      <div class="section-title">规则与条款</div>
      <img
        class="terms-conditions-title-separator"
        :src="require('../assets/vip/terms-condition-title-separator.png')"
      />
      <ol class="terms">
        <li v-for="(term, i) in currentDisplayTerms" :key="i" class="term">
          {{ term.text }}
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
import { ref, reactive, defineComponent, computed, onMounted } from "vue";
import { claimBonusItem, canRedeem, claim } from "@/api/index/promo";
import { userStore } from "@/store";
import { Carousel, Slide, Navigation } from "vue3-carousel";
// import { message } from "ant-design-vue";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "VIPView",
  components: {
    Carousel,
    Slide,
    Navigation
  },
  setup() {
    const store = userStore();
    const amount = ref("$0");
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
    const loadingClaim = ref(false);
    const loadingMClaim = ref(false);
    const loadingBClaim = ref(false);
    const dailySlot = (bonusItem, vipType) => {
      loadingClaim.value = true;
      if (vipType === "monthly") {
        loadingMClaim.value = true;
      } else if (vipType === "birthday") {
        loadingBClaim.value = true;
      }
      claimBonusItem(bonusItem)
        .then((res) => {
          if (res.code === 0) {
            amount.value = "$" + res.data;
            privilegeClaimedModalVisible.value = true;
            loadingClaim.value = false;
            loadingMClaim.value = false;
            loadingBClaim.value = false;
            store.getBalance();
          } else {
            ElMessage.error(res.message);
            loadingClaim.value = false;
            loadingMClaim.value = false;
            loadingBClaim.value = false;
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    };

    const terms = [
      {
        text: `所有雷火电竞会员存款达到相应VIP等级要求即可享有特定免费奖金、存送奖金或其他奖励，存送奖金只需完成（存款+奖金）*相应流水倍数即可提款。`
      },
      {
        text: `达到相应等级要求的会员可以点击"待领取"，领取免费奖金或存款选择相对应的存送优惠即可。`
      },
      {
        text: `各等级所对应的优惠所要求的流水有所不同，会员需要达到相应流水方可申请提款。`
      },
      {
        text: `此优惠促销只适用于拥有一个独立账户的玩家。住址、电子邮箱地址﹑电话号码﹑支付方式（相同借记卡/信用卡/银行账户号码）IP地址，同一网络环境等将可以作为判定是否独立玩家的条件。对于发现任何有违背、欺骗、或利用规则和条款进行非法获利的会员，雷火电竞保留在任何时候都可以停止、取消优惠或索回已支付的全部优惠的权利。`
      },
      {
        text: `在某些未知因素超出可控范围的情况下，雷火电竞保留可单方面执行的决定权，并承诺会在这类紧急问题发生时解释给客户原因并听取客户反馈与客户沟通协商解决。`
      },
      {
        text: `雷火电竞保留对本次活动的修订、终止和最终解释权，超出本网站控制外的技术错误，雷火电竞将不承担任何责任。`
      },
      {
        text: `雷火电竞有权延长，缩短，终止，或者修改此活动！此活动最终解释权归雷火电竞所有。`
      }
    ];

    const vipTerms = [
      {
        text: `返水奖金根据北京时间每天00:00:00-23:59:59之间的有效投注额进行计算，所有游戏场馆投注额都是按照北京时间计算，返水彩金无需申请，系统会在次日下午14:00派发到您的主账户；`
      },
      {
        text: `雷火电竞夺宝、捕鱼和彩票 不参与返水优惠；`
      },
      {
        text: `电竞/体育中的连串过关投注额返水将以注单结算时间为准。`
      },
      {
        text: `返水根据有效投注进行计算，在所有产品中，任何注单取消或本金退还，任何低于欧洲盘1.7或亚洲盘0.7水位的投注以及在同一游戏中同时投注对等盘口，将不计算在有效投注额内，赢半和输半只计算一半流水，体育提前注单按照实际输赢金额的绝对值作为有效投注；`
      },
      {
        text: `返水奖金可投注于任何平台游戏，奖金只需1倍投注额即可申请提款，最低返水1元，低于1元不予派发。`
      },
      {
        text: `此优惠促销只适用于拥有一个独立账户的玩家。住址、电子邮箱地址, 电话号码, 支付方式(相同借记卡/信用卡/银行账户号码) IP地址，同一网络环境等将可以作为判定是否独立玩家的条件。`
      },
      {
        text: `对于发现任何有违背、欺骗、或利用规则和条款进行非法获利的会员，雷火保留在任何时候都可以停止、取消优惠或索回已支付的全部优惠的权利。`
      },
      {
        text: `在某些未知因素超出可控范围的情况下，雷火保留可单方面执行的决定权，并承诺会在这类紧急问题发生时解释给客户原因并听取客户反馈与客户沟通协商解决。`
      },
      {
        text: `雷火保留对本次活动的修订、终止和最终解释权，超出本网站控制外的技术错误，雷火将不承担任何责任。`
      }
    ];

    const showRebate = ref(true);
    const currentDisplayTerms = ref(terms);
    const onShowRebateClick = (flag) => {
      showRebate.value = flag;
      if (showRebate.value) currentDisplayTerms.value = terms;
      else currentDisplayTerms.value = vipTerms;
    };

    const vipItems = reactive([
      {
        vipLevel: "1",
        upgrade: "一笔存款",
        vipTitle: "青铜2",
        depositPromoAvailable: false,
        promoAvailable: false,
        unavailable: false,
        claimed: false
      },
      {
        vipLevel: "2",
        upgrade: "3,000",
        vipTitle: "青铜1",
        depositPromoAvailable: false,
        promoAvailable: false,
        unavailable: false,
        claimed: false
      },
      {
        vipLevel: "3",
        upgrade: "30,000",
        vipTitle: "白银3",
        depositPromoAvailable: false,
        promoAvailable: false,
        unavailable: false,
        claimed: false
      },
      {
        vipLevel: "4",
        upgrade: "80,000",
        vipTitle: "白银2",
        depositPromoAvailable: false,
        promoAvailable: false,
        unavailable: false,
        claimed: false
      },
      {
        vipLevel: "5",
        upgrade: "200,000",
        vipTitle: "白银1",
        depositPromoAvailable: false,
        promoAvailable: false,
        unavailable: false,
        claimed: false
      },
      {
        vipLevel: "6",
        upgrade: "400,000",
        vipTitle: "黄金3",
        depositPromoAvailable: false,
        promoAvailable: false,
        unavailable: false,
        claimed: false
      },
      {
        vipLevel: "7",
        upgrade: "600,000",
        vipTitle: "黄金2",
        depositPromoAvailable: false,
        promoAvailable: false,
        unavailable: false,
        claimed: false
      },
      {
        vipLevel: "8",
        upgrade: "1,000,000",
        vipTitle: "黄金1",
        depositPromoAvailable: false,
        promoAvailable: false,
        unavailable: false,
        claimed: false
      },
      {
        vipLevel: "9",
        upgrade: "2,000,000",
        vipTitle: "铂金2",
        depositPromoAvailable: false,
        promoAvailable: false,
        unavailable: false,
        claimed: false
      },
      {
        vipLevel: "10",
        upgrade: "4,000,000",
        vipTitle: "铂金1",
        depositPromoAvailable: false,
        promoAvailable: false,
        unavailable: false,
        claimed: false
      },
      {
        vipLevel: "11",
        upgrade: "8,000,000",
        vipTitle: "钻石",
        depositPromoAvailable: false,
        promoAvailable: false,
        unavailable: false,
        claimed: false
      },
      {
        vipLevel: "12",
        upgrade: "12,000,000",
        vipTitle: "王者",
        depositPromoAvailable: false,
        promoAvailable: false,
        unavailable: false,
        claimed: false
      }
    ]);
    const initVIPTable = () => {
      if (store.token) {
        canRedeem().then((res) => {
          if (res.code === 0) {
            // Your arrays of elements
            const depositPromoAvailableElements = res.data.depositPromoAvailable;
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

            // Call the function to update properties based on depositPromoAvailable elements
            updatePropertiesBasedOnElements(depositPromoAvailableElements, "depositPromoAvailable");

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
    const claimVIPLevelItem = (vip) => {
      claim(vip.vipLevel).then((res) => {
        if (res.code === 0) {
          ElMessage.success("领取成功！");
          store.getBalance();
          initVIPTable();
        } else {
          ElMessage.error(res.message);
        }
      });
    };
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
      terms,
      vipItems,
      vipLevel,
      getVipLevelProgress,
      storeToken,
      dailySlot,
      loadingClaim,
      loadingMClaim,
      loadingBClaim,
      amount,
      privilegeClaimedModalVisible,
      currentDisplayTerms,
      vipTerms,
      claimVIPLevelItem,
      currentSlide,
      slideTo,
      currentDepositAmt
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
      height: 47px;

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
        font-size: 17.987px;
        font-style: normal;
        font-weight: 400;
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
      align-items: center;
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

.dark {
  .vip-container {
    background-image: url("../assets/vip/vip-bg-dark.png");
    background-color: #f3f7fd;
    background-repeat: no-repeat;

    .vip-program {
      table {
        border: none;
        th {
          background-color: #0E464D;
          color: $color-white;
          border: none;
        }
        td {
          background-color: #28313e;
          color: $color-white;
          border-color: #3b4c6f;
        }
        tbody {
          tr {
            > :nth-last-child(2) {
              background-color: #057886;
            }
          }
        }
      }
    }

    .terms-conditions {
      .section-title {
        color: $color-white;
      }
      .terms {
        @include content-block-dark;
        color: $font-3-dark;
        margin-top: 39px;
        .term {
          &:first-child {
            margin-top: 0;
          }
        }
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
