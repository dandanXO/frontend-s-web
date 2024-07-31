<template>
  <div class="vip-container">
    <div class="header-section">
      <img src="../../assets/images/vip/vip-header.png" class="vip-header" />
    </div>
    <!--    <div class="banner-container" />-->

    <Carousel v-model="currentSlide" :items-to-show="2.99" :wrap-around="true">
      <Slide v-for="(vip, vipIndex) in vipItems" :key="vipIndex">
        <div class="carousel__item">
          <div :class="`vipitem vipitem${vip.vipLevel}`">
            <div class="vipcontents">
              <div class="title">
                <span class="type">{{ vip.vipTitle }}</span>
              </div>
              <div class="badge">
                <img :src="require(`../../assets/images/vip/badge/${vip.vipTitle}.png`)">
              </div>
              <div class="description">
                累积存款:
                <span>{{ vip.upgrade }}</span>
              </div>
              <div class="viplevel">
                VIP {{ vip.vipLevel }}
              </div>
              <!-- vip progress bar start -->
              <!-- <div class="progressBarContainer" v-if="vipLevel">
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
              </div> -->
              <!-- vip progress bar end -->
              <!-- <div
                style="color: #cfb282; font-size: 18px; position: absolute; bottom: 25px; left: 0; right: 0"
                v-if="vipLevel + 1 === Number(vip.vipLevel)"
              >
                {{
                  Number(currentDepositAmt)
                    .toLocaleString("en-US", { style: "currency", currency: "CNY" })
                    .replace("CN", "")
                }}
              </div> -->
            </div>
            <!-- <div
              :class="`vipLevelReachStatus ${getVipLevelProgress(vip) === 100 && !!vipLevel ? 'vipLevelReached' : ''}`"
            >
              <span>{{ getVipLevelProgress(vip) === 100 && !!vipLevel ? "已达到" : "未达到" }}</span>
            </div> -->
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
    <div class="current-vip-status">
      <div class="badge">
        <img :src="badgeSrc">
      </div>
      <div class="vip-progress">
        <div class="amount">
          <div class="text">还要<div class="required-amount">{{ requiredDepAmt }}</div>存款升级到 VIP {{vipLevel + 1}}</div>
          <div class="progressBarContainer">
            <div class="progressBarOuterBar">
              <div class="progressBarInnerBar" :style="{ width: getVipLevelProgress(vipLevel) + '%' }" />
            </div>
          </div>
        </div>
        <div class="amount">
          <div class="text">还要<div class="required-amount">{{ requiredExpAmt }}</div>经验值升级到 VIP {{vipLevel + 1}}</div>
          <div class="progressBarContainer">
            <div class="progressBarOuterBar">
              <div class="progressBarInnerBar" :style="{ width: getVipLevelProgress(vipLevel) + '%' }" />
            </div>
          </div>
        </div>
      </div>
      <div class="claim-btn">
        一键领取
      </div>
    </div>
    <div class="month-birthday-bonus">
      <div class="left">
        <img src="../../assets/images/vip/img-border.png">
        <div class="inner-slide">
          <q-carousel height="350px">
            <q-carousel-slide v-for="item in 4" :key="item">
              <img loading="lazy" class="card-img" :src="require(`../../assets/images/vip/slide-img.png`)" alt="" />
            </q-carousel-slide>
          </q-carousel>
        </div>
      </div>
      <div class="right">
        <template v-for="(item, i) in vipItems" :key="i">
          <template v-if="+item.vipLevel === currentSlide + 1">
            <div class="vip-boxes">
              <div class="box">
                <div class="icon"><img src="../../assets/images/vip/levelup.png"></div>
                <div class="item-name">晋级彩金</div>
                <div class="item-amt">{{ item.upgrade }}</div>
              </div>
              <div class="box">
                <div class="icon"><img src="../../assets/images/vip/birthday.png"></div>
                <template v-if="item.unavailable">
                <div class="item-name">生日礼金</div>
                <div class="item-amt">{{ item.upgrade }}</div>
                </template>
                <template v-else>
                  <div class="claim-now">立即领取</div>
                </template>
              </div>
              <div class="box">
                <div class="icon"><img src="../../assets/images/vip/rebate.png"></div>
                <div class="item-name">日返水</div>
                <div class="item-amt">0,20 -0,45%</div>
              </div>
              <div class="box">
                <div class="icon"><img src="../../assets/images/vip/redpacket.png"></div>
                <div class="item-name">节日礼金</div>
                <div class="item-amt">1,888</div>
              </div>
              <div class="box">
                <div class="icon"><img src="../../assets/images/vip/levelup.png"></div>
                <div class="item-name">保级彩金</div>
                <div class="item-amt">1,2%</div>
              </div>
              <div class="box inactive">
                <div class="icon"><img src="../../assets/images/vip/yearly.png"></div>
                <div class="item-name">年度保级彩金</div>
                <div class="item-amt">1,2%</div>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>

    <div class="tips">
      等级晋升后开启90天保级期，保级期内完成存款和流水要求则保级成功，未完成则降一级。<div @click="isShowTable = !isShowTable" class="linktotable"> 查看升保级明细</div>
      <div v-if="isShowTable" class="absolute-box">
        <div class="arrow_box">
          <div class="overflow-table">
            <table border="1">
              <thead>
                <tr>
                  <th style="background: #AD9870;">等级</th>
                  <th style="background: #F1DDA0; color:#766442;">VIP 1</th>
                  <th style="background: #F1DDA0; color:#766442;">VIP 2</th>
                  <th style="background: #F1DDA0; color:#766442;">VIP 3</th>
                  <th style="background: #F1DDA0; color:#766442;">VIP 4</th>
                  <th style="background: #F1DDA0; color:#766442;">VIP 5</th>
                  <th style="background: #F1DDA0; color:#766442;">VIP 6</th>
                  <th style="background: #F1DDA0; color:#766442;">VIP 7</th>
                  <th style="background: #F1DDA0; color:#766442;">VIP 8</th>
                  <th style="background: #F1DDA0; color:#766442;">VIP 9</th>
                  <th style="background: #F1DDA0; color:#766442;">VIP 10</th>
                  <th style="background: #F1DDA0; color:#766442;">VIP 11</th>
                  <th style="background: #F1DDA0; color:#766442;">VIP 12</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>会员勋章</td>
                  <td>青铜 I</td>
                  <td>青铜 II</td>
                  <td>白银 I</td>
                  <td>白银 II</td>
                  <td>白银 III</td>
                  <td>黄金 I</td>
                  <td>黄金 II</td>
                  <td>黄金 III</td>
                  <td>铂金 I</td>
                  <td>铂金 II</td>
                  <td>钻石</td>
                  <td>王者</td>
                </tr>
                <tr>
                  <td>升级条件<br>（流水）</td>
                  <td>6,000</td>
                  <td>17,500</td>
                  <td>50,000</td>
                  <td>130,000</td>
                  <td>600,000</td>
                  <td>1,200,000</td>
                  <td>2,400,000</td>
                  <td>6,400,000</td>
                  <td>2,400,000</td>
                  <td>6,400,000</td>
                  <td>15,000,000</td>
                  <td>25,000,000</td>
                </tr>
                <tr>
                  <td>保级条件<br>（90天）</td>
                  <td>3,500</td>
                  <td>7,500</td>
                  <td>19,000</td>
                  <td>32,500</td>
                  <td>75,000</td>
                  <td>200,000</td>
                  <td>620,000</td>
                  <td>1,900,000</td>
                  <td>6,250,000</td>
                  <td>12,500,000</td>
                  <td>21,000,000</td>
                  <td>50,000,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="terms-conditions">
      <div class="section-title">规则与条款</div>
      <!-- <img
        class="terms-conditions-title-separator"
        :src="require('../../assets/images/vip/terms-condition-title-separator.png')"
      /> -->
      <ol class="terms">
        <li v-for="(term, i) in currentDisplayTerms" :key="i" class="term">
          {{ term.text }}
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup>
import "vue3-carousel/dist/carousel.css";
import { ref, onActivated, computed, reactive, watch } from "vue";
import { eventapi } from "src/boot/axios";
import { useQuasar } from "quasar";
import { userStore } from "stores/index";
import { useRouter } from "vue-router";
import { useNotify } from "src/hooks/notify";
import { Carousel, Slide, Navigation } from "vue3-carousel";
    components: {
      Carousel,
      Slide,
      Navigation
    }
    const isShowTable = ref(false);
    const notify = useNotify();
    const store = userStore();
    const amount = ref("$0");
    const privilegeClaimedModalVisible = ref(false);
    const vipLevel = computed(() => {
      return +store.vip.replace("VIP", "");
    });
    const currentDepositAmt = computed(() => {
      return store.getCurrentDeposit();
    });
    const requiredDepAmt = ref(0)
    const getVipLevelProgress = (lvl) => {
      if (lvl === 0) {
        return 0;
      }
      const vipInfo = vipItems.find(item => +item.vipLevel === lvl + 1);
      console.log(vipInfo)
      const vipLevel = +store.vip.replace("VIP", "");
      const currentDeposit = +store.getCurrentDeposit();
      const upgradeStatus = vipInfo.upgrade;

      console.log('vip' + vipLevel)
      console.log('currentdepo' + currentDeposit)
      console.log('upgrade' + upgradeStatus)
      // if (vipLevel >= +vipInfo.vipLevel) {
      //   return 100;
      // }
      var levelUpDeposit = +upgradeStatus.replaceAll(",", "");
      if (!levelUpDeposit) {
        levelUpDeposit = 0;
      }
      // if (vipLevel === 0) {
      //   return 0;
      // }
      if (lvl + 1 === +vipInfo.vipLevel) {
        requiredDepAmt.value = (levelUpDeposit - currentDeposit).toLocaleString('en-US')
        return (currentDeposit / levelUpDeposit) * 100;
      }
      // if (currentDeposit > levelUpDeposit + 1) {
      //   return 100;
      // } else {
      //   return 0;
      // }

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
            notify.error(res.message);
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
    const badgeSrc = computed(() => {
      const vip = vipItems.find(vip => vip.vipLevel === vipLevel.value && vipLevel.value);
      return require(`../../assets/images/vip/level/vip${vip ? vip.vipLevel : '1'}.png`);
    });

    const vipItems = reactive([
      {
        vipLevel: "1",
        upgrade: "一笔存款",
        vipTitle: "青铜 II",
        depositPromoAvailable: false,
        promoAvailable: false,
        unavailable: false,
        claimed: false
      },
      {
        vipLevel: "2",
        upgrade: "3,000",
        vipTitle: "青铜 I",
        depositPromoAvailable: false,
        promoAvailable: false,
        unavailable: false,
        claimed: false
      },
      {
        vipLevel: "3",
        upgrade: "30,000",
        vipTitle: "白银 III",
        depositPromoAvailable: false,
        promoAvailable: false,
        unavailable: false,
        claimed: false
      },
      {
        vipLevel: "4",
        upgrade: "80,000",
        vipTitle: "白银 II",
        depositPromoAvailable: false,
        promoAvailable: false,
        unavailable: false,
        claimed: false
      },
      {
        vipLevel: "5",
        upgrade: "200,000",
        vipTitle: "白银 I",
        depositPromoAvailable: false,
        promoAvailable: false,
        unavailable: false,
        claimed: false
      },
      {
        vipLevel: "6",
        upgrade: "400,000",
        vipTitle: "黄金 III",
        depositPromoAvailable: false,
        promoAvailable: false,
        unavailable: false,
        claimed: false
      },
      {
        vipLevel: "7",
        upgrade: "600,000",
        vipTitle: "黄金 II",
        depositPromoAvailable: false,
        promoAvailable: false,
        unavailable: false,
        claimed: false
      },
      {
        vipLevel: "8",
        upgrade: "1,000,000",
        vipTitle: "黄金 I",
        depositPromoAvailable: false,
        promoAvailable: false,
        unavailable: false,
        claimed: false
      },
      {
        vipLevel: "9",
        upgrade: "2,000,000",
        vipTitle: "铂金 II",
        depositPromoAvailable: false,
        promoAvailable: false,
        unavailable: false,
        claimed: false
      },
      {
        vipLevel: "10",
        upgrade: "4,000,000",
        vipTitle: "铂金 I",
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
        vipTitle: "最强王者",
        depositPromoAvailable: false,
        promoAvailable: false,
        unavailable: false,
        claimed: false
      }
    ]);
    const initVIPTable = () => {
      if (store.token) {
        eventapi.get("/vip-upgrade/lh/canRedeem").then((res) => {
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
            notify.error(res.message);
          }
        });
      }
    };
    const claimVIPLevelItem = (vip) => {
      claim(vip.vipLevel).then((res) => {
        if (res.code === 0) {
          notify.success("领取成功！");
          store.getBalance();
          initVIPTable();
        } else {
          notify.error(res.message);
        }
      });
    };
    const currentSlide = ref(11);
    const slideTo = () => {
      const vipLevel = +store.vip.replace("VIP", "");
      if (vipLevel === 0) {
        currentSlide.value = 0;
        return;
      }
      currentSlide.value = vipLevel - 1;
    };
    onActivated(() => {
      initVIPTable();
      slideTo();
    });
</script>
<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Play:wght@400;700&family=Purple+Purse&display=swap');
$border-settings: 1px solid #e5e7eb;
.carousel__slide {
  .vipLevelButton {
    display: none;
  }
}
.carousel__slide--active {
  .vipLevelButton {
    background: url("../../assets/images/vip/button.png") no-repeat center center;
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
  background-image: url("../../assets/images/vip/vip-bg.jpg");
  background-color: #f3f7fd;
  background-repeat: no-repeat;
  background-position: top center;
  background-size: cover;
  background-attachment: fixed;
  color: #8d8d8d;
  min-height: 100vh;
  padding: 0 0 80px;

  .header-section {
    margin: 0 auto;
    width: 100%;
    text-align: center;
  }
  .vip-header {
    width: 100%;
    margin: 10px auto;
  }

  .banner-container {
    background: url("../../assets/images/vip/banner.png") no-repeat center center;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    min-height: 600px;
  }
  .current-vip-status {
    border: 2px solid #799DF8;
    max-width: 480px;
    padding: 10px;
    flex-direction: column;
    width: 95%;

    margin: 50px auto;
    background: #212B4AE0;
    border-radius: 30px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 20px;
    padding: 10px;
    .badge {
      width: 100px;
      position: absolute;
      left: 15px;
      img {
        width: 100%;
      }
    }
    .vip-progress {
      display: flex;
      flex-direction: column;
      width: calc(100% - 120px);
      margin-left: 70px;
      gap: 20px;
      .amount {
        display: flex;
        flex-direction: column;
        gap: 10px;
        .text {
          display: flex;
          gap: 2px;
          font-size: 14px;
          color: #ffffff;
          .required-amount {
            color: #799DF8;
            font-weight:600;
          }
        }
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
    }
    .claim-btn {
      border: 2px solid #799DF8;
      background: #405471;
      padding: 8px 15px;
      color: #ffffff;
      width: 180px;
      text-align: center;
      display: block;
      border-radius: 8px;
        font-size: 14px;
        padding: 8px 0px;
        text-align: center;
        width: 180px;

    }
  }
  .month-birthday-bonus {
    border: 2px solid #799DF8;
    max-width: 480px;
    margin: 50px auto 0;
    background: #212B4AE0;
    border-radius: 30px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 20px;
    gap: 20px;
    flex-direction: column;
    .left {
      flex: 1;
      position: relative;
      width: 100%;
      img {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 1;
      }
      .inner-slide {
        width: 98%;
        margin: auto;
        overflow: hidden;
        height: 96%;
        margin-top: 2.3%;
        .card-img-wrap {
          min-height: 160px;

          @media (min-width: 470px) {
            min-height: 210px;
          }
        }

      }
    }
    .right {
      flex: 2;
      .vip-boxes {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        width: 100%;
        height: 100%;
        gap: 15px;
        .box {
          border: 2px solid #799DF8;
          background: #1F2231;
          padding: 10px;
          display: flex;    
          justify-content: flex-start;
          align-items: center;
          flex-direction: column;
          border-radius: 10px;
          font-size: 12px;
          &.inactive {
            border: 2px solid #596589;
            background: #2F3547;
            .icon {
            background: url(../../assets/images/vip/bg-circle-inactive.png)no-repeat center center;
            background-size: contain;
            }
            .item-amt {
              color: #596589;
            }
          }
          .icon {
            background: url(../../assets/images/vip/bg-circle.png)no-repeat center center;
            background-size: contain;
            padding: 0 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 60px;
            height: 60px;
            margin-bottom: 5px;
            img { 
              height: 50%;
            }
          }
          .item-name {
            color: #ffffff;
          }
          .item-amt {
            color: #799DF8;
          }
          .claim-now {
            background: linear-gradient(90deg, #F1DDA0 0%, #FFCC80 100%);
            color: #000000;
            font-family: PingFang SC;
            font-size: 12px;
            font-weight: 400;
            line-height: 28px;
            text-align: center;
            padding: 0px 9px;
            border-radius: 10px;
            margin: 10px auto;
          }
        }
      }
    }
  }
  .tips {
    color: #FFFFFF;
    font-size: 20px;
    font-weight: 400;
    line-height: 22.8px;
    text-align: center;
    margin: 30px auto;
    max-width: 500px;
    width: 100%;
    position: relative;
    .linktotable {
      border-bottom: 1px solid #F1DDA0;
      color: #F1DDA0;
      display: inline-block;
    }
    .absolute-box {
      position: absolute;
    width: 100%;
    right: -45px;
      z-index: 2;
    }
    .arrow_box {
      font-family: PingFang SC;
      width: 80%;
      top: 40px;
      position: relative;
      background: #1F2231;
      border: 2px solid #799DF8;  /*set border colour here*/
      border-radius: 3px;
      -webkit-filter: drop-shadow(0 1px 10px rgba(113, 158, 206, 0.8)); /*set shadow colour  and size here*/
      -moz-box-shadow: 0 1px 10px rgba(113, 158, 206, 0.8);
      filter: drop-shadow(0 1px 10px rgba(113, 158, 206, 0.8));
      
      padding: 30px;
      border-radius: 10px;
      .overflow-table {
        overflow-x: auto;
        width: 100%;
        &::-webkit-scrollbar {
          width: 8px;  /* Change this value to your desired width */
          height: 8px; /* Change this value for horizontal scrollbars */
        }

        /* Customize the scrollbar track */
        &::-webkit-scrollbar-track {
          background: #1f2231; /* You can change this to the color you prefer */
        }

        /* Customize the scrollbar handle */
        &::-webkit-scrollbar-thumb {
          background: #799DF8; /* You can change this to the color you prefer */
          border-radius: 10px; /* Makes the scrollbar handle rounded */
        }

        /* Handle on hover */
        &::-webkit-scrollbar-thumb:hover {
          background: #2F3547; /* Darker color on hover */
        }
      }
      table {
        width: 1500px;
        tr {
          th {
            border: 2px solid #F1DDA0;
            padding: 20px 10px;
          }
          td {
            padding: 20px 10px;
            border: 2px solid #799DF8;
          } 
          &:first-child {
            background: #2F3547;
          }
          &:nth-child(2) {
            background: #2F3547;
          }
          &:nth-child(3) {
            background: #282C3E;
          }
        }
      }
    }

    .arrow_box:after,
    .arrow_box:before {
      bottom: 100%;
      border: solid transparent;
      content: " ";
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
    }

    .arrow_box:after {
      border-color: rgba(255, 255, 255, 0);
      border-bottom-color: #1F2231;
      border-width: 19px;
      left: 75%;
      margin-left: -19px;
    }

    .arrow_box:before {
      border-color: rgba(113, 158, 206, 0);
      border-bottom-color: #799DF8;
      border-width: 20px;
      left: 75%;
      margin-left: -20px;
    }
  }

  .vipitem {
    display: flex;
    flex-direction: column-reverse;
    justify-content: flex-end;
    position: relative;
    width: 400px;
    height: 520px;
    background: url("../../assets/images/vip/cardbg.png") no-repeat top center;
    background-size: contain;
    &9, &10, &11, &12 {
      background: url("../../assets/images/vip/cardbg-shiny.png") no-repeat top center;
      background-size: contain;

    }

    // &2 {
    //   background: url("../../assets/images/vip/badge/banner-2.png") no-repeat top center;
    //   background-size: contain;
    // }

    // &3 {
    //   background: url("../../assets/images/vip/badge/banner-3.png") no-repeat top center;
    //   background-size: contain;
    // }

    // &4 {
    //   background: url("../../assets/images/vip/badge/banner-4.png") no-repeat top center;
    //   background-size: contain;
    // }

    // &5 {
    //   background: url("../../assets/images/vip/badge/banner-5.png") no-repeat top center;
    //   background-size: contain;
    // }

    // &6 {
    //   background: url("../../assets/images/vip/badge/banner-6.png") no-repeat top center;
    //   background-size: contain;
    // }

    // &7 {
    //   background: url("../../assets/images/vip/badge/banner-7.png") no-repeat top center;
    //   background-size: contain;
    // }

    // &8 {
    //   background: url("../../assets/images/vip/badge/banner-8.png") no-repeat top center;
    //   background-size: contain;
    // }

    // &9 {
    //   background: url("../../assets/images/vip/badge/banner-9.png") no-repeat top center;
    //   background-size: contain;
    // }

    // &10 {
    //   background: url("../../assets/images/vip/badge/banner-10.png") no-repeat top center;
    //   background-size: contain;
    // }

    // &11 {
    //   background: url("../../assets/images/vip/badge/banner-11.png") no-repeat top center;
    //   background-size: contain;
    // }

    // &12 {
    //   background: url("../../assets/images/vip/badge/banner-12.png") no-repeat top center;
    //   background-size: contain;
    // }
    .vipLevelReachStatus {
      // background: url("../../assets/images/vip/badge/vip-level-banner-status-ribbon-unachieved.png") no-repeat left center;
      background-size: contain;
      margin-top: 15px;
      margin-left: 2px;
      z-index: 1;
      text-align: left;
      height: 47px;

      &.vipLevelReached {
        // background: url("../../assets/images/vip/badge/vip-level-banner-status-ribbon-achieved.png") no-repeat left center;
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
      height: 98%;
      border-radius: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-direction: column;
      padding: 30px 30px;
      .title {
        color: #333;
        text-align: center;
        font-family: Arial Narrow;
        font-size: 24.319px;
        font-style: italic;
        font-weight: 700;
        line-height: normal;
        top: 50px;
        position: absolute;
        .type {
          color: #799DF8;
          font-weight: 400;
          font-size: 24.319px;
          display: inline-block;
          font-style: normal;
        }
      }
      .badge {
        width: 75%;
        img { 
          width: 100%;
        }
      }

      .description {
        color: #ffffff;
        font-size: 14px;
        font-weight: 400;
        line-height: 24px;
        text-align: center;
        display: flex;
        flex-direction: column;
        span {
          color: #F1DDA0;
          font-size: 20px;
          font-weight: 600;
          line-height: 26.4px;
          text-align: center;

        }
      }
      .viplevel {
        color: #ffffff;
        font-family: "Purple Purse", serif;
        font-size: 30px;
        font-weight: 400;
        line-height: 33px;
        text-align: center;

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
    max-width: 480px;
    margin: 0 auto;
    width: 95%;
    position: relative;
    border: 2px solid #799DF8;
    padding: 10px;
    background: linear-gradient(0deg, #2F3547, #2F3547);
    border-radius: 15px;
    .section-title {
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(180deg, #FFFFFF 18.57%, #B3D7F0 85%);
      background-clip: text;
      -webkit-text-fill-color: transparent;
      &:before {
        content: "";
        background: url(../../assets/images/vip/decal.png);
        width: 70px;
        height: 70px;
        display: block;
        background-size: cover;
      }
      &:after {
        content: "";
        background: url(../../assets/images/vip/decal.png);
        width: 70px;
        height: 70px;
        display: block;
        background-size: cover;
        transform: rotateY(180deg);
      }
      background-clip: text;
      text-align: center;
      font-size: 30px;
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
      background: linear-gradient(0deg, #2F3547, #2f3547ad);

      .term {
        max-width: 1300px;
        width: 100%;
        margin-top: 10px;
        list-style-type: decimal;
        color: #ffffff;
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
      height: 320px;
      margin: auto;
      width: 300px;
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

<style scoped>
.carousel {
  max-width: 320px;
  margin: 0 auto;
}
.carousel__slide {
  padding: 5px;
}

.carousel__viewport {
  perspective: 2000px;
}

.carousel__track {
  transform-style: preserve-3d;
}

.carousel__slide--sliding {
  transition: 0.5s;
}

.carousel__slide {
  opacity: 0;
  transform: scale(0.5);
  filter: grayscale(.5) brightness(.9);
}

.carousel__slide--active ~ .carousel__slide {
  z-index: -1;
  filter: grayscale(.8) brightness(.9);
  .vipcontents {
    &:before {
      content: "";            
      box-shadow: 200px 0 30px -10px black inset;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      z-index: 2;
    }
  }
}
.carousel__slide--active ~ .carousel__slide.carousel__slide--next {
  transform: scale(0.6);
  filter: grayscale(1) brightness(.7);
  z-index: -3;
  
  .vipcontents {
    &:before {
      content: "";            
      box-shadow: 110px 0 30px -10px black inset;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      z-index: 2;
    }
  }
}
.carousel__slide--active ~ .carousel__slide.carousel__slide--prev {
  transform: scale(0.6);
  filter: grayscale(1) brightness(.7);
  .vipcontents {
    &:before {
      content: "";            
      box-shadow: -110px 0 30px -10px black inset;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      z-index: 2;
    }
  }
}
.carousel__slide--prev {
  opacity: 1;
  transform: scale(0.6);
  z-index: -2;
  filter: grayscale(1) brightness(.5);
  .vipcontents {
    &:before {
      content: "";            
      box-shadow: -110px 0 30px -10px black inset;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      z-index: 2;
    }
  }
}

.carousel__slide--next {
  transform: scale(0.6);
  opacity: 1;
  z-index: -2;
  filter: grayscale(1) brightness(.5);
  
  .vipcontents {
    &:before {
      content: "";            
      box-shadow: 110px 0 30px -10px black inset;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      z-index: 2;
    }
  }
}
.carousel__slide--prev + .carousel__slide.carousel__slide--visible {
  .vipcontents {
    &:before {
      content: "";            
      box-shadow: -200px 0 30px -10px black inset;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      z-index: 2;
    }
  }
}
.carousel__slide--next + .carousel__slide.carousel__slide--visible {
  .vipcontents {
    &:before {
      content: "";            
      box-shadow: 200px 0 30px -10px black inset;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      z-index: 2;
    }
  }
}
.carousel__slide--visible {
  transform: scale(0.8);
  opacity: 0.9;
  z-index: -1;
}

:deep(.carousel__prev) {
  background: url('../../assets/images/vip/nextprev.png');
  background-size: contain;
  padding: 25px;
}
:deep(.carousel__next) {
  background: url('../../assets/images/vip/nextprev.png');
  background-size: contain;
  padding: 25px;
  transform: translate3d(20px, -20px, 10px) rotateY(180deg);
}
.carousel__slide--active {
  opacity: 1;
  transform: scale(1);
  filter: grayscale(0);
  z-index: 1;
  .vipcontents {
    &:before {
      content: unset !important;            
      box-shadow: 200px 0 30px -10px black inset;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      z-index: 2;
    }
  }
}
</style>
