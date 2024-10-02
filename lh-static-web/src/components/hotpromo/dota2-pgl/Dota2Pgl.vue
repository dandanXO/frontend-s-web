<template>
  <div class="livepoker-rebate-wrapper">
    <div class="livepoker-rebate-container">
      <div class="livepoker-rebate-section">
        <div class="welcomne" v-if="!store.token">
          你好，请
          <span style="color: #2483ff; cursor: pointer" @click="handleClickLogin">【登录】</span>
        </div>
        <div class="welcomne" v-else>
          欢迎您，{{ store.realName }}
          <span style="color: #2483ff; cursor: pointer" @click="handleClickLogout">退出</span>
        </div>
        <div class="tab-wrapper">
          <div class="tab" :class="{ active: tabValue === 1 }" @click="handleClickTab(1)">投注宝箱</div>
          <div class="tab" :class="{ active: tabValue === 2 }" @click="handleClickTab(2)">充值宝箱</div>
        </div>
      </div>

      <template v-if="tabValue === 1">
        <div>
          <div class="livepoker-rebate-game-info">
            <div class="title-wrapper">
              <img src="../../../assets/promo/lh-dota2-pgl/rule-title-left.png" alt="" />
              <h1>宝箱抽奖</h1>
              <img src="../../../assets/promo/lh-dota2-pgl/rule-title-right.png" alt="" />
            </div>
            <div>
              <div class="reward-wrapper">
                <div class="reward-item">
                  <div class="reward-item-content">1元</div>
                </div>
                <div class="reward-item">
                  <div class="reward-item-content">8元</div>
                </div>
                <div class="reward-item">
                  <div class="reward-item-content">18元</div>
                </div>
                <div class="reward-item">
                  <div class="reward-item-content">58元</div>
                </div>
                <div class="reward-item">
                  <div class="reward-item-content">88元</div>
                </div>
                <img src="../../../assets/promo/lh-dota2-pgl/reward.png" alt="" />
              </div>

              <div class="reward-title-wrapper">
                <div class="reward-title">累计完成场次: {{ accumulatedClaimed }}次剩余开启次数: {{ todayLeftClaimCount }}次</div>
              </div>

              <div class="reward-btn-wrapper" @click="handleClaimBonus">
                <div class="reward-btn">开启宝箱</div>
              </div>
            </div>
            <div class="livepoker-rebate-game-bottom">
              消耗有效投注1,500元可开启，每日最多开启10次，每十次必中最高奖励
            </div>
          </div>

          <div class="livepoker-rebate-game-bottom-rule">
            <div class="title-wrapper">
              <img src="../../../assets/promo/lh-dota2-pgl/rule-title-left.png" alt="" />
              <h1>活动规则</h1>
              <img src="../../../assets/promo/lh-dota2-pgl/rule-title-right.png" alt="" />
            </div>
            <div class="content">
              <div class="item">
                1.活动期间，每次开启宝箱需要消耗PGL 瓦拉几瓦赛事1,500元有效投注，每日最高可开启10次宝箱；
              </div>
              <div class="item">
                2.开启宝箱每第10次开启即可触发最高奖励，开启获得的宝箱彩金实时派发，彩金5倍流水即可提款；
              </div>
              <div class="item">
                3.获得的开启宝箱次数可在活动期间内积累，活动结束后清零，请在活动期间内使用，逾期未使用不予补偿；
              </div>
              <div class="item">
                4.根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；
              </div>
              <div class="item">
                5.此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及 IP
                地址视为同一账户，若有违规者，将不享受此红利；
              </div>
              <div class="item">6.为避免文字理解差异，雷火电竞保留此活动最终解释权；</div>
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="tabValue === 2">
        <div>
          <div class="livepoker-rebate-game-info">
            <div class="title-wrapper">
              <img src="../../../assets/promo/lh-dota2-pgl/rule-title-left.png" alt="" />
              <h1>宝箱抽奖</h1>
              <img src="../../../assets/promo/lh-dota2-pgl/rule-title-right.png" alt="" />
            </div>
            <div class="reward-box-list">
              <div class="reward-box-wrapper">
                <div class="reward-box">
                  <img src="../../../assets/promo/lh-dota2-pgl/reward.png" alt="">
                  <div>宝箱x1</div>
                  <div class="text">连续存款3天</div>
                </div>
                <!-- <div class="reward-box-btn">已领取</div> -->
              </div>
              <div class="reward-box-wrapper">
                <div class="reward-box">
                  <img src="../../../assets/promo/lh-dota2-pgl/reward.png" alt="">
                  <div>宝箱x3</div>
                  <div class="text">连续存款3天</div>
                </div>
                <!-- <div class="reward-box-btn active">领取</div> -->
              </div>
              <div class="reward-box-wrapper">
                <div class="reward-box">
                  <img src="../../../assets/promo/lh-dota2-pgl/reward.png" alt="">
                  <div>宝箱x5</div>
                  <div class="text">连续存款3天</div>
                </div>
                <!-- <div class="reward-box-btn disabled">领取</div> -->
              </div>
            </div>

            <div class="livepoker-rebate-game-bottom" style="justify-content: end">注：每个奖品仅可兑换1次</div>
          </div>

          <div class="livepoker-rebate-game-bottom-rule">
            <div class="title-wrapper">
              <img src="../../../assets/promo/lh-dota2-pgl/rule-title-left.png" alt="" />
              <h1>活动规则</h1>
              <img src="../../../assets/promo/lh-dota2-pgl/rule-title-right.png" alt="" />
            </div>
            <div class="content">
              <div class="item">1.活动期间，当日存款≥100即可计算连续天数，连续存款达档位标准即可获得开启宝箱次数；</div>
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
              <div class="item">5.为避免文字理解差异，雷火电竞保留此活动最终解释权；</div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { putPglTreasureInit, getPglTreasureInit } from "@/api/index/promo";
import { onMounted, ref, defineProps } from "vue";
import { useNotify } from "@/hooks/notify";
import { userStore } from "@/store";
import { ElMessageBox } from "element-plus";
const props = defineProps(["promoCode"]);
const promoCode = ref(props.promoCode);

const notify = useNotify();

const store = userStore();
const accumulatedClaimed = ref(0);
const todayLeftClaimCount = ref(0);
const todayClaimed = ref(0);
const tabValue = ref(2);

const handleClickTab = (value) => {
  tabValue.value = value;
};

const handleClickLogin = () => {
  store.loginPageVisible = true;
};

const handleClickLogout = () => {
  store.memberLogout().then(() => {
    location.reload();
  });
};

const handleClaimBonus = () => {
  if (!store.hasToken()) {
    ElMessageBox.alert("请登录后再操作", "系统提示", {
      autofocus: false,
      center: true,
      confirmButtonText: "确认",
      showClose: false,
      buttonSize: "large",
      closeOnClickModal: true
    }).then(() => {
      store.loginPageVisible = true;
    });
    return;
  }

  putPglTreasureInit()
    .then((res) => {
      if (res.code === 0) {
        notify({
          type: "success",
          message: `成功领取`
        });
        fetchData();
      } else {
        notify({
          type: "error",
          message: res.message
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const fetchData = async () => {
  try {
    const res = await getPglTreasureInit();
    accumulatedClaimed.value = res.data.accumulatedClaimed;
    todayLeftClaimCount.value = res.data.todayLeftClaimCount;
    todayClaimed.value = res.data.todayClaimed;
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  if (!store.token) {
    // notify({
    //   message: "请登录后操作",
    //   type: "error"
    // });
    return;
  }
  fetchData();
});
</script>

<style scoped lang="scss">
.livepoker-rebate-wrapper {
  display: flex;
  justify-content: center;
}
.livepoker-rebate-container {
  width: 1200px;
  height: 100%;
}

.livepoker-rebate-section {
  margin: 10px 0 30px;
}

.welcomne {
  color: black;
  font-size: 18px;
  text-align: center;
}

.tab-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;

  .tab {
    border-radius: 60px;
    background: linear-gradient(180deg, #e7e7e7 0%, #c9c9c9 100%);
    padding: 13px 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    color: #818181;
    font-weight: bold;
    cursor: pointer;

    &.active {
      background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
      color: white;
      box-shadow: 0px -2px 4.58px 0px #b1d7ff inset, 0px -1px 3.66px 0px #5894ff inset;
    }
  }
}

.livepoker-rebate-game-bottom {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #8c5b00;
  font-size: 18px;
  font-weight: 500;
}

.livepoker-rebate-game-info {
  background: white;
  border-radius: 12px;
  padding: 40px;

  .reward-item {
    background: url("../../../assets/promo/lh-dota2-pgl/reward-item-bg.png") no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    height: 200px;
    position: absolute;
    top: 50%;
    cursor: pointer;
    animation: shaking infinite 1.5s linear;
    --rotation-angle: 0deg;

    &:first-child {
      left: 0;
      top: 60%;
      --rotation-angle: -15deg;
    }

    &:nth-child(2) {
      left: 17%;
      top: 20%;
      --rotation-angle: -35deg;
    }

    &:nth-child(3) {
      top: 5%;
    }

    &:nth-child(4) {
      right: 17%;
      top: 20%;
      --rotation-angle: 35deg;
    }

    &:nth-child(5) {
      right: 0;
      top: 60%;
      --rotation-angle: 15deg;
    }

    .reward-item-content {
      background: url("../../../assets/promo/lh-dota2-pgl/reward-item.png") no-repeat;
      width: 140px;
      height: 54px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24px;
      color: #735700;
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
    padding-top: 250px;
  }

  .reward-title-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
  }

  .reward-title {
    background: url("../../../assets/promo/lh-dota2-pgl/reward-title-bg.png") no-repeat;
    font-size: 20px;
    font-weight: 500;
    color: #8c5b00;
    width: 508px;
    height: 63px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  .reward-btn-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
  }
  .reward-btn {
    background: url("../../../assets/promo/lh-dota2-pgl/reward-btn.png") no-repeat;
    font-size: 28px;
    color: black;
    width: 328px;
    height: 121px;
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

  .reward-box-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 12px;
    flex: 1;

    .reward-box {
      background: url("../../../assets/promo/lh-dota2-pgl/reward-box-bg.png") no-repeat;
      background-size: contain;
      width: 100%;
      height: 360px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 24px;
      color: #735700;
      font-weight: 600;

      img {
        width: 149px;
        height: 175px;
      }

      .text {
        background-color: #E3C976;
        width: 330px;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .reward-box-btn {
      width: 196px;
      height: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 32px;
      color: white;
      font-size: 20px;
      background: linear-gradient(180deg, rgba(115, 178, 255, 0.5) 0%, rgba(57, 129, 255, 0.5) 100%);
      box-shadow: 0px -1.07px 2.45px 0px #B1D7FF inset, 0px -0.54px 1.96px 0px #5894FF inset;
      cursor: pointer;
      font-weight: bold;

      &.active {
        background: linear-gradient(180deg, #73B2FF 0%, #3981FF 100%);
      }

      &.disabled {
        background: linear-gradient(180deg, #E7E7E7 0%, #C9C9C9 100%);
        color: #818181;
        box-shadow: none;
      }
    }
  }
}

.title-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;

  h1 {
    margin: 0;
    white-space: nowrap;
  }
}

.livepoker-rebate-game-bottom-rule {
  width: 100%;
  height: 100%;
  margin-top: 40px;
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  align-items: center;

  .content {
    font-size: 20px;
    font-weight: 400;
    line-height: 36px;
    color: #7a8eb9;
    .item {
      padding-left: 24px;
      display: flex;
      gap: 10px;
      margin-bottom: 12px;
    }
  }
}
</style>
