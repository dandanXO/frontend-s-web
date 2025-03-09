<template>
  <div class="livepoker-rebate-wrapper">
    <div class="livepoker-rebate-container">
      <div class="livepoker-rebate-section">
        <div class="welcomne" v-if="!store.token">
          你好，请
          <span style="color: #fffd66; cursor: pointer" @click="handleClickLogin">【登录】</span>
        </div>
        <!--        <div class="welcomne" v-else>-->
        <!--          欢迎您，{{ store.realName }}-->
        <!--          <span style="color: #2483ff; cursor: pointer" @click="handleClickLogout">退出</span>-->
        <!--        </div>-->
        <div class="tab-wrapper">
          <div class="tab" :class="{ active: tabValue === 1 }" @click="handleClickTab(1)">投注宝箱</div>
          <div class="tab" :class="{ active: tabValue === 2 }" @click="handleClickTab(2)">充值宝箱</div>
        </div>
      </div>

      <template v-if="tabValue === 1">
        <div>
          <div class="livepoker-rebate-game-info">
            <div class="title-wrapper">
              <img src="../../../assets/promo/lh-dota2-pgl/rule-title-left2.png" alt="" />
              <h1>宝箱抽奖</h1>
              <img src="../../../assets/promo/lh-dota2-pgl/rule-title-right2.png" alt="" />
            </div>
            <div>
              <div class="reward-wrapper">
                <template v-for="(bonus, index) of bonuses" :key="index">
                  <div class="reward-item">
                    <div class="reward-item-content">{{ bonus }} 元</div>
                  </div>
                </template>

                <!--                <div class="reward-item">-->
                <!--                  <div class="reward-item-content">8 元</div>-->
                <!--                </div>-->
                <!--                <div class="reward-item">-->
                <!--                  <div class="reward-item-content">18 元</div>-->
                <!--                </div>-->
                <!--                <div class="reward-item">-->
                <!--                  <div class="reward-item-content">58 元</div>-->
                <!--                </div>-->
                <!--                <div class="reward-item">-->
                <!--                  <div class="reward-item-content">88 元</div>-->
                <!--                </div>-->
                <img src="../../../assets/promo/lh-dota2-pgl/reward-box.png" alt="" style="width: 181px" />
              </div>

              <div class="reward-title-wrapper">
                <div class="reward-title">
                  累计开启次数：
                  <span style="font-weight: bold">{{ accumulatedClaimed }}</span>
                  次 剩余开启次数：
                  <span style="font-weight: bold">{{ todayLeftClaimCount }}</span>
                  次
                </div>
              </div>

              <div class="reward-btn-wrapper" @click="handleClaimBonus">
                <div class="reward-btn">开启宝箱</div>
              </div>
            </div>
          </div>

          <div class="livepoker-rebate-game-bottom-rule">
            <div class="title-wrapper">
              <img src="../../../assets/promo/lh-dota2-pgl/rule-title-left2.png" alt="" />
              <h1>活动规则</h1>
              <img src="../../../assets/promo/lh-dota2-pgl/rule-title-right2.png" alt="" />
            </div>
            <div class="content">
              <div class="item">
                1. 活动期间，活动仅计算电竞场馆中 PGL 瓦拉几亚 第 3 季赛事，会员在当日 PGL 瓦拉几亚 第 2
                季中累计有效投注 ≥ 1,500 元即可获得 1 次开箱次数，每日最高上限获得 10 次开箱次数，每日最高可开启 10
                次宝箱；
              </div>
              <div class="item">
                2. 开启宝箱每第 10 次开启即可触发最高奖励，开启获得的宝箱彩金实时派发，彩金 5 倍流水即可提款；
              </div>
              <div class="item">3. 获得的开启宝箱次数在当天内积累，次日清零，请在当天内使用，逾期未使用不予补偿；</div>
              <div class="item">
                4. 任何低于欧洲盘 1.7 或亚洲盘 0.7
                水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投注额内；
              </div>
              <div class="item">
                5.
                根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；
              </div>
              <div class="item">
                6. 此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及 IP
                地址视为同一账户，若有违规者，将不享受此红利；
              </div>
              <div class="item">7. 为避免文字理解差异，东赢电竞保留此活动最终解释权；</div>
            </div>
          </div>
        </div>
      </template>

      <template v-if="tabValue === 2">
        <div style="width: 100%">
          <div class="livepoker-rebate-game-info">
            <div class="title-wrapper">
              <img src="../../../assets/promo/lh-dota2-pgl/rule-title-left2.png" alt="" />
              <h1>宝箱抽奖</h1>
              <img src="../../../assets/promo/lh-dota2-pgl/rule-title-right2.png" alt="" />
            </div>

            <div class="carousell-div">
              <Carousel v-model="slide" snapAlign="center" :items-to-show="3" :wrap-around="true">
                <Slide @click="handleSlideClick(index)" name="1" v-for="(box, index) in boxes" :key="box.title">
                  <div class="reward-box">
                    <img :src="require(`../../../assets/promo/lh-dota2-pgl/reward2-${index}.png`)" alt="" />
                    <div>{{ box.title }}</div>
                    <div class="text">{{ box.text }}</div>
                  </div>
                </Slide>
              </Carousel>
            </div>

            <div class="livepoker-rebate-game-bottom" style="justify-content: center">注：每个奖品仅可兑换 1 次</div>
          </div>

          <div class="livepoker-rebate-game-bottom-rule">
            <div class="title-wrapper">
              <img src="../../../assets/promo/lh-dota2-pgl/rule-title-left2.png" alt="" />
              <h1>活动规则</h1>
              <img src="../../../assets/promo/lh-dota2-pgl/rule-title-right2.png" alt="" />
            </div>
            <div class="content">
              <div class="item">
                1.活动期间，当日累计存款≥1000
                即可计算连续天数，连续存款达档位标准即可获得开启宝箱次数，充值宝箱次数将自动派发至投注宝箱页，点击开启即可参与抽奖；
              </div>
              <div class="item">
                2.活动期间，每个档位的奖励仅可领取一次，若出现中断连续天数，重新打卡至对应连续天数奖励则不重复派发；
              </div>
              <div class="item">
                3.根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；
              </div>
              <div class="item">
                4.此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及 IP
                地址视为同一账户，若有违规者，将不享受此红利；
              </div>
              <div class="item">5.为避免文字理解差异，东赢电竞保留此活动最终解释权；</div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import "vue3-carousel/dist/carousel.css";
import { onMounted, ref } from "vue";
import { getPGLTreasureInit, putPGLTreasureInit } from "../../../api/index/promo";
import { userStore } from "src/stores";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

import { Carousel, Slide, Navigation, Pagination } from "vue3-carousel";

const props = defineProps(["promoCode"]);
const promoCode = ref(props.promoCode);

const store = userStore();
const $q = useQuasar();
const router = useRouter();

const accumulatedClaimed = ref(0);
const todayLeftClaimCount = ref(0);
const todayClaimed = ref(0);
const tabValue = ref(1);
const slide = ref(1);

const bonuses = ref([8, 18, 38, 58, 88]);

const boxes = ref([
  {
    title: "宝箱 x1",
    text: "连续存款 3 天"
  },
  {
    title: "宝箱 x2",
    text: "连续存款 5 天"
  },
  {
    title: "宝箱 x3",
    text: "连续存款 7 天"
  }
]);

const handleClickTab = (value) => {
  tabValue.value = value;
};

const handleSlideClick = (vipIndex) => {
  slide.value = vipIndex;
};

const handleClickLogin = () => {
  router.push("/login");
};

const handleClickLogout = () => {
  store.memberLogout();
};

const isClaiming = ref(false);
const handleClaimBonus = () => {
  if (!store.token) {
    $q.dialog({
      class: "q-px-md q-pt-md",
      title: "系统提示",
      message: "请登录后再操作",
      ok: {
        push: true,
        color: "primary",
        label: "去登录",
        tabindex: 1
      },
      cancel: {
        push: true,
        color: "warning",
        label: "取消",
        tabindex: 0
      },
      persistent: true
    }).onOk(() => {
      router.push("/login");
    });
    return;
  }
  if (isClaiming.value === true) {
    return;
  }

  isClaiming.value = true;
  putPGLTreasureInit()
    .then((res) => {
      if (res.code === 0 && res.data) {
        $q.notify({
          type: "success",
          message: `成功领取${res.data}元！`
        });
        fetchData();
      } else {
        $q.notify({
          type: "error",
          message: res.message
        });
      }
      isClaiming.value = false;
    })
    .catch((err) => {
      isClaiming.value = false;
      console.log(err);
    });
};

const fetchData = async () => {
  try {
    const res = await getPGLTreasureInit();
    accumulatedClaimed.value = res.data.accumulatedClaimed;
    todayLeftClaimCount.value = res.data.todayLeftClaimCount;
    todayClaimed.value = res.data.todayClaimed;
    bonuses.value = res.data.bonuses;
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  if (!store.token) {
    return;
  }
  fetchData();
});
</script>

<style scoped lang="scss">
.livepoker-rebate-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}

.carousell-div {
  width: 100%;

  //:deep(.carousel__slide) {
  //  width: 280px !important;
  //}
}

.livepoker-rebate-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.livepoker-rebate-section {
  margin: 10px 0 30px;
  width: 100%;
  background: transparent;
}

.welcomne {
  color: white;
  font-size: 18px;
  text-align: center;
  background: url("../../../assets/promo/lh-dota2-pgl/login-bg.png") no-repeat;
  background-size: contain;
  background-position: center;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: end;
  padding-bottom: 5px;
  margin-bottom: 20px;
}

.tab-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;

  .tab {
    border-radius: 60px;
    background: linear-gradient(180deg, #e7e7e7 0%, #c9c9c9 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    color: #818181;
    font-weight: bold;
    cursor: pointer;
    height: 32px;
    flex: 1;

    &.active {
      background: linear-gradient(180deg, #ffe173 0%, #ffad39 100%);
      color: #000000;
    }
  }
}

.livepoker-rebate-game-bottom {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffd164;
  font-size: 16px;
  font-weight: 600;
  text-align: center;

  max-width: calc(100vw - 56px);
  margin: 0 auto 20px;
}

.livepoker-rebate-game-info {
  background: white;
  border-radius: 12px;
  padding: 20px 12px 12px;
  width: 100%;
  background: url("../../../assets/promo/lh-dota2-pgl/reward-section-bg-t.png") no-repeat top / 100%,
    url("../../../assets/promo/lh-dota2-pgl/reward-section-bg-b.png") no-repeat bottom / 100%,
    url("../../../assets/promo/lh-dota2-pgl/reward-section-bg-l.png") no-repeat left center,
    url("../../../assets/promo/lh-dota2-pgl/reward-section-bg-r.png") no-repeat right center, #1c0d18;

  .reward-item {
    background: url("../../../assets/promo/lh-dota2-pgl/reward-item-bg.png") no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 57.6px;
    height: 57.6px;
    position: absolute;
    top: 50%;
    cursor: pointer;
    animation: shaking infinite 1.5s linear;
    --rotation-angle: 0deg;

    &:first-child {
      left: 0;
      top: 40%;
      --rotation-angle: -25deg;
    }

    &:nth-child(2) {
      left: 17%;
      top: 15%;
      --rotation-angle: -35deg;
    }

    &:nth-child(3) {
      top: 5%;
    }

    &:nth-child(4) {
      right: 17%;
      top: 15%;
      --rotation-angle: 35deg;
    }

    &:nth-child(5) {
      right: 0;
      top: 40%;
      --rotation-angle: 25deg;
    }

    .reward-item-content {
      background: url("../../../assets/promo/lh-dota2-pgl/reward-item.png") no-repeat;
      width: 40px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      color: #8c5b00;
      font-weight: 600;
    }

    @keyframes shaking {
      0%,
      100% {
        transform: translateY(0) rotate(var(--rotation-angle));
      }
      50% {
        transform: translateY(-20px) rotate(var(--rotation-angle));
      }
    }
  }

  .reward-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    padding-top: 100px;
  }

  .reward-title-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
    width: 100%;
  }

  .reward-title {
    background: url("../../../assets/promo/lh-dota2-pgl/reward-title-bg.png") no-repeat;
    background-size: 100%;
    font-size: 16px;
    font-weight: 500;
    color: #8c5b00;
    width: 100%;
    height: 40px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  .reward-btn-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 12px 0;
  }
  .reward-btn {
    background: url("../../../assets/promo/lh-dota2-pgl/reward-btn2.png") no-repeat center;
    background-size: contain;
    font-size: 20px;
    color: #ffd164;
    width: 100%;
    height: 50px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    cursor: pointer;
  }

  .reward-box-list {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 32px;
    margin-bottom: 20px;
  }

  .reward-box {
    background: url("../../../assets/promo/lh-dota2-pgl/reward-box-bg.png") no-repeat;
    background-size: 100% 100%;
    width: 226px;
    height: 230px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: #ffd164;
    font-weight: 600;
    padding-bottom: 40px;
    position: relative;

    img {
      width: 85px !important;
      height: 100px;
      margin-bottom: 0;
    }

    .text {
      background-color: #e3c976;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 94%;
      height: 20%;
      position: absolute;
      bottom: 8px;
      color: #735700;
    }
  }
}

.title-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  //margin-bottom: 20px;
  max-width: calc(100vw - 56px);
  margin: 0 auto 20px;

  h1 {
    margin: 0;
    white-space: nowrap;
    font-size: 18px;
    line-height: 0;
    font-weight: bold;
    color: #ffd164;
  }
  img {
    margin-bottom: 0 !important;
  }
}

.livepoker-rebate-game-bottom-rule {
  width: 100%;
  height: 100%;
  margin-top: 25px;
  background: url("../../../assets/promo/lh-dota2-pgl/reward-section-bg-t.png") no-repeat top / 100%,
    url("../../../assets/promo/lh-dota2-pgl/reward-section-bg-b.png") no-repeat bottom / 100%,
    url("../../../assets/promo/lh-dota2-pgl/reward-section-bg-l.png") no-repeat left center,
    url("../../../assets/promo/lh-dota2-pgl/reward-section-bg-r.png") no-repeat right center, #1c0d18;
  border-radius: 12px;
  padding: 20px 12px 12px;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  align-items: center;

  .content {
    color: #ffd164;
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    padding: 8px;

    max-width: calc(100vw - 45px);
    margin: 0 auto 20px;

    .item {
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
    }
  }
}

.carousel__slide--next {
  transform: scale(0.8);
}

.carousel__slide--prev {
  transform: scale(0.8);
}

.reward-box-btn {
  width: 120px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 32px;
  color: white;
  font-size: 14px;
  background: linear-gradient(180deg, rgba(115, 178, 255, 0.5) 0%, rgba(57, 129, 255, 0.5) 100%);
  box-shadow: 0px -1.07px 2.45px 0px #b1d7ff inset, 0px -0.54px 1.96px 0px #5894ff inset;
  cursor: pointer;
  font-weight: bold;

  &.active {
    background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
  }

  &.disabled {
    background: linear-gradient(180deg, #e7e7e7 0%, #c9c9c9 100%);
    color: #818181;
    box-shadow: none;
  }
}

::v-deep(.q-carousel__slide) {
  display: flex;
  justify-content: center;
}
</style>
