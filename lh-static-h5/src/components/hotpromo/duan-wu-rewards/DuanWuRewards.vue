<template>
  <div class="livepoker-rebate-wrapper">
    <div class="livepoker-rebate-container">
      <div
        class="livepoker-rebate-section section-bg"
        style="background: #fbfbe3 !important; border: 1px solid #027c5f !important"
      >
        <div class="livepoker-rebate-section-left">
          <div class="livepoker-rebate-section-title">
            <div class="duanwu-title-img img1"></div>
          </div>
          <div class="duanwu-reward-wrapper">
            <div class="duanwu-reward-container">
              <div class="duanwu-reward-item">
                <div class="gap"></div>
                <div class="up">昨日累计有效投注</div>
                <div class="down">{{ totalValidBet }}元</div>
              </div>
              <div class="duanwu-reward-item">
                <div class="gap"></div>
                <div class="up">已获得粽叶数量</div>
                <div class="down">{{ currentTokenAmount }}片</div>
              </div>
              <div class="duanwu-reward-item">
                <div class="gap"></div>
                <div class="up">可兑换粽子数量</div>
                <div class="down">{{ rewardsCanClaim }}个</div>
              </div>
            </div>
            <div class="duanwu-bonus-wrapper">
              <div class="left">
                <img src="./images/bonus-img.png" />
                <p>粽叶领取 X {{ todayToken }}片</p>
              </div>
              <div class="right" style="width: 100px">
                <img src="./images/bonus-button.svg" alt="" width="100%" @click="handleClaimToken" />
              </div>
            </div>
          </div>
          <div class="main-img-wrapper">
            <div
              style="
                position: absolute;
                top: 31%;
                right: 12%;
                transform: rotate(-7deg);
                color: #723d00;
                font-size: 13px;
                font-weight: 600;
                text-decoration: underline;
              "
              @click="
                handleOpenRecordDialog();
                isTabLeft = true;
              "
            >
              粽叶领取记录
            </div>
            <div
              style="
                position: absolute;
                top: 45%;
                right: 12%;
                transform: rotate(-1deg);
                color: rgb(114, 61, 0);
                font-size: 13px;
                font-weight: 600;
                text-decoration: underline;
              "
              @click="
                handleOpenRecordDialog();
                isTabLeft = false;
              "
            >
              开启粽子记录
            </div>
            <img src="./images/main-img.png" @click="handleOpenRecordDialog" />
            <img src="./images/main-img-reward.png" class="reward-button" @click="handleClaimBonus" />
            <div style="font-size: 13px; color: #027c5f; text-align: center">
              每开启一次粽子将
              <span style="color: red">消耗5片粽叶</span>
            </div>
          </div>
        </div>
      </div>
      <div
        class="livepoker-rebate-game-info section-bg"
        style="background: #fbfbe3 !important; border: 1px solid #027c5f !important"
      >
        <div class="duanwu-title-img img2"></div>
        <div class="little-title" style="flex-direction: row">
          <div class="ribbon2">活动时间</div>
          <div class="right" style="color: #000000 !important">2025年5月28日至2025年6月3日(共7天)</div>
        </div>
        <div class="little-title">
          <div class="ribbon2">活动内容</div>
          <div class="right" style="color: #000000 !important">
            活动期间，昨日累计有效投注≥1,500
            元即可获得对应粽叶数量，每五片粽叶可兑换一个粽子，打开粽子即可领取神秘安康金，粽叶最高可领50片~ 
          </div>
        </div>
        <table class="livepoker-rebate-game-info-table section-table2">
          <thead>
            <tr>
              <th>昨日有效投注</th>
              <th>粽叶数量</th>
              <th>流水倍数</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>≥1,500元</td>
              <td>1片</td>
              <td rowspan="9" style="color: black !important">6倍流水</td>
            </tr>
            <tr>
              <td>≥5,000元</td>
              <td>2片</td>
            </tr>
            <tr>
              <td>≥10,000元</td>
              <td>3片</td>
            </tr>
            <tr>
              <td>≥30,000元</td>
              <td>5片</td>
            </tr>
            <tr>
              <td>≥100,000元</td>
              <td>8片</td>
            </tr>
            <tr>
              <td>≥300,000元</td>
              <td>12片</td>
            </tr>
            <tr>
              <td>≥500,000元</td>
              <td>18片</td>
            </tr>
            <tr>
              <td>≥1,000,000元</td>
              <td>30片</td>
            </tr>
            <tr>
              <td>≥3,000,000元</td>
              <td>50片</td>
            </tr>
          </tbody>
        </table>

        <div class="livepoker-rebate-game-bottom">
          <div class="livepoker-rebate-game-bottom-left-title">
            <div class="livepoker-rebate-game-bottom-left-btn">
              <img
                src="../../../assets/images/promotion/hotpromo/lh1-blast-premier/game-bottom-left-btn.png"
                alt=""
                style="width: 10px"
              />
              <span>示例</span>
            </div>
            会员A 在当日累计有效投注400,000元，次日即可领取12片粽叶，兑换2个好粽，获得对应安康金。
          </div>
        </div>
      </div>

      <div
        class="livepoker-rebate-game-bottom-rule section-bg"
        style="background: #fbfbe3 !important; border: 1px solid #027c5f !important"
      >
        <div class="duanwu-title-img img3"></div>
        <br />
        <div class="content">
          <div class="item">
            <div class="item-num">1</div>
            <div style="display: flex; flex-direction: column; color: #014625 !important">
              活动期间，会员当日累计有效投注≥1,500 元，次日 24
              小时内在活动页面点击【领取粽叶】按钮获得粽叶，若粽叶数量≥5片，即可获得一个好粽，点击【打开好粽】即可获得安康金，彩金
              6 倍流水即可出款，逾期未领取则视为放弃，有效投注次日清零；
              <div class="hint">注：奖励不叠加派发，按最高档位每日派发一次。</div>
            </div>
          </div>
          <div class="item">
            <div class="item-num">2</div>
            <div style="display: flex; flex-direction: column; color: #014625 !important">
              获得的粽叶可在活动期间内累计保存使用，请于活动结束（2025年6月3日23:59）完成兑换，否则未使用的粽叶将视为自动放弃，平台将不予补偿；
              <div class="hint">注：有效投注统计截止至6月2日23:59前，兑换领取截止6月3日23:59前</div>
            </div>
          </div>
          <div class="item" style="color: #014625 !important">
            <div class="item-num">3</div>
            任何低于欧洲盘 1.7 或亚洲盘 0.7
            水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投注额内；
          </div>
          <div class="item" style="color: #014625 !important">
            <div class="item-num">4</div>
            根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；
          </div>
          <div class="item" style="color: #014625 !important">
            <div class="item-num">5</div>
            此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及 IP
            地址视为同一账户，若有违规者，将不享受此红利；
          </div>
          <div class="item" style="color: #014625 !important">
            <div class="item-num">6</div>
            为避免文字理解差异，雷火电竞保留此活动最终解释权；
          </div>
        </div>
      </div>
    </div>
  </div>

  <q-dialog align-center centered v-model="isOpenResultDialog">
    <div
      class="dialog"
      style="
        padding: 0px;
        border-radius: 12px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
      "
    >
      <div
        style="
          background: linear-gradient(180deg, #00cc8c 0%, #006646 100%);
          text-align: center;
          color: #fff;
          font-size: 20px;
          font-weight: 600;
          height: 36px;
          width: 100%;
        "
      >
        兑换粽子获得安康金
      </div>
      <img
        src="./images/closeButton.png"
        alt=""
        style="position: absolute; top: 5px; right: 5px; cursor: pointer"
        @click="isOpenResultDialog = false"
      />

      <img src="./images/BigZoneZi.png" alt="" width="70%" />
      <div>
        <div style="color: #ff8400; font-weight: 600">
          <span style="font-size: 56px">{{ bonusClaims }}</span>
          <span style="font-size: 16px">元</span>
        </div>
      </div>
      <div style="color: #014625; font-size: 16px">恭喜您获得安康金</div>
      <div style="display: flex; justify-content: center; margin-top: 16px; margin-bottom: 20px">
        <button @click="isOpenResultDialog = false">关闭</button>
      </div>
    </div>
  </q-dialog>
  <q-dialog align-center centered v-model="isRecordDialogShow">
    <div class="dialog">
      <div class="title">
        <img src="./images/title-img-left.png" />
        <span>活动记录</span>
        <img src="./images/title-img-right.png" />
      </div>
      <div class="tab-wrapper" @click="handleToggleTab">
        <img v-if="isTabLeft" src="./images/tab-active-left.png" width="100%" />
        <img v-else src="./images/tab-active-right.png" width="100%" />
      </div>
      <div v-show="isTabLeft" style="flex: 1" class="inner-table">
        <table>
          <thead>
            <tr>
              <th>领取时间</th>
              <th>领取数量</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="tokenRecord?.length <= 0">
              <td colspan="2">暂无数据</td>
            </tr>
            <tr v-for="(item, index) in tokenRecord" :key="index">
              <td>{{ item.recordTime }}</td>
              <td>{{ item.token }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-show="!isTabLeft" style="flex: 1" class="inner-table">
        <table>
          <thead>
            <tr>
              <th>兑换时间</th>
              <th>粽子数量</th>
              <th>安康金</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="rewardRecord?.length <= 0">
              <td colspan="3">暂无数据</td>
            </tr>
            <tr v-for="(item, index) in rewardRecord" :key="index">
              <td>{{ item.recordTime }}</td>
              <td>1个</td>
              <td>{{ item.bonus }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style="display: flex; justify-content: center">
        <button @click="isRecordDialogShow = false">关闭</button>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import { onMounted, ref, toRefs } from "vue";
import {
  getTokenRewardsInit,
  receiveTokenRewards,
  claimTokenRewardsBonus,
  getTokenRecords,
  getRewardsRecords
} from "../../../api/index/promo";
import { useNotify } from "src/hooks/notify";
import { userStore } from "src/stores";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

const props = defineProps(["promoCode"]);
const { promoCode } = toRefs(props);
const notify = useNotify();
const store = userStore();
const $q = useQuasar();
const router = useRouter();

const totalValidBet = ref(0);
const rewardsCanClaim = ref(0);
const currentTokenAmount = ref(0);
const todayToken = ref(0);
const isClaiming = ref(false);
const isClaimingToken = ref(false);
const isRecordDialogShow = ref(false);
const isTabLeft = ref(true);
const tokenRecord = ref([]);
const rewardRecord = ref([]);
const isOpenResultDialog = ref(false);
const bonusClaims = ref(0);

const handleToggleTab = () => {
  isTabLeft.value = !isTabLeft.value;
};

const handleOpenRecordDialog = () => {
  fetchRecordData();
  isRecordDialogShow.value = true;
};

const fetchRecordData = () => {
  getTokenRecords(props.promoCode).then((res) => {
    if (res.code === 0) {
      tokenRecord.value = res.data;
    }
  });

  getRewardsRecords(props.promoCode).then((res) => {
    if (res.code === 0) {
      rewardRecord.value = res.data;
    }
  });
};

const handleClaimBonus = () => {
  if (isClaiming.value === true) {
    return;
  }
  isClaiming.value = true;
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
  claimTokenRewardsBonus(promoCode.value)
    .then((res) => {
      if (res.code === 0) {
        isOpenResultDialog.value = true;
        // notify({
        //   message: "成功领取",
        //   type: "red-packet",
        //   params: {
        //     redPacket: res.data
        //   }
        // });
        bonusClaims.value = res.data;
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
    })
    .finally(() => {
      isClaiming.value = false;
    });
};

const handleClaimToken = () => {
  if (isClaimingToken.value === true) {
    return;
  }
  isClaimingToken.value = true;
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
  receiveTokenRewards(promoCode.value)
    .then((res) => {
      if (res.code === 0) {
        notify({
          type: "success",
          message: "领取成功"
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
    })
    .finally(() => {
      isClaimingToken.value = false;
    });
};

const fetchData = async () => {
  try {
    const res = await getTokenRewardsInit(promoCode.value);
    totalValidBet.value = res.data.totalValidBet;
    rewardsCanClaim.value = res.data.rewardsCanClaim;
    currentTokenAmount.value = res.data.currentTokenAmount;
    todayToken.value = res.data.todayToken;
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  if (!store.token) {
    return;
  }
  fetchData();
  // handleOpenRecordDialog();
});
</script>

<style scoped lang="scss">
.livepoker-rebate-wrapper {
  display: flex;
  justify-content: center;
}

.livepoker-rebate-container {
  width: 100%;
  height: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.livepoker-rebate-section {
  box-shadow: 0px 0px 4px 0px #01497b0f;
  padding: 20px 12px 40px;
  border-radius: 12px;
  border: 1px solid #acd4f6;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: url("../../../assets/images/promotion/hotpromo/lh1-blast-premier/section-bg.png");
  background-size: 100% 100%;
  align-items: center;
  width: 100%;

  .livepoker-rebate-section-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
  }

  .livepoker-rebate-section-right {
    width: 180px;
    margin-top: 20px;

    .bonus-image {
      width: 100%;
      cursor: pointer;

      &:active {
        filter: brightness(0.85);
        transform: translate(0px, 1px);
      }

      &.disabled {
        filter: grayscale(100%);
        cursor: not-allowed;
        pointer-events: none;
      }
    }
  }

  .livepoker-rebate-section-title {
    color: #000000;
    font-size: 16px;
    line-height: 1;
    font-weight: 600;
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 20px;
  }
}

.livepoker-rebate-game {
  width: 100%;
  height: 302px;
  border-radius: 12px;
  // border: 1px solid #51acff;
  background-color: #fff;
  position: relative;
  margin-bottom: 12px;
}

.livepoker-rebate-game-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .livepoker-rebate-game-bottom-left-title {
    font-size: 12px;
    font-weight: 600;
    line-height: 22.4px;
    color: #ff5d5d !important;
  }
  .livepoker-rebate-game-bottom-left-btn {
    font-size: 12px;
    font-weight: 600;
    line-height: 22.4px;
    color: #ff5d5d !important;
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;
  }
}

.livepoker-rebate-game-info {
  width: 100%;
  height: 100%;
  margin-top: 40px;
  background: #f2f8fe;
  border-radius: 12px;
  padding: 20px 12px 12px;
  border: 1px solid #acd4f6;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .title {
    background-repeat: no-repeat;
    background-size: 100%;
    width: 240px;
    height: 26px;
    margin: 0 auto;
  }
  .little-title {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 10px;
  }
}

.livepoker-rebate-game-info-table {
  width: 100%;
  height: 100%;
  border-collapse: separate;
  border-spacing: 0;
  text-align: center;
  vertical-align: middle;
  th {
    height: 36px;
    font-size: 12px;
    font-weight: 400;
    line-height: 28px;
    color: #fff;
    background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
    &:first-child {
      border-top-left-radius: 12px;
    }
    &:last-child {
      border-top-right-radius: 12px;
    }
  }
  tr {
    &:last-child {
      td {
        &:first-child {
          // border-bottom-left-radius: 12px;
        }
      }
    }
    &:nth-child(2) {
      td {
        &:last-child {
          // border-bottom-right-radius: 12px;
        }
      }
    }
  }
  td {
    background: transparent;
    border: 1px solid #acd4f6;
    height: 36px;
    font-size: 12px;
    font-weight: 400;
    line-height: 28px;
    color: #000000;
  }
}

.livepoker-rebate-game-bottom-rule {
  width: 100%;
  height: 100%;
  margin-top: 40px;
  background: #fbfbe3;
  border-radius: 12px;
  padding: 20px 12px 12px;
  border: 1px solid #acd4f6;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    background-image: url("../../../assets/images/promotion/hotpromo/lh1-blast-premier/rule-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 240px;
    height: 20px;
    margin-bottom: 20px;
  }
  .content {
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    color: #000000;
    padding: 8px;
    .item {
      display: flex;
      gap: 10px;
      align-items: baseline;

      .item-num {
        color: #ffffff;
        font-size: 12px;
        line-height: 1;
        border-radius: 50%;
        height: 16px !important;
        width: 16px !important;
        min-width: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 2px;
        background: linear-gradient(180deg, #00cc8c 0%, #006646 100%) !important;
      }

      .hint {
        font-size: 12px;
        font-weight: 400;
        line-height: 22.4px;
        color: #ff5d5d !important;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 4px;
      }
    }
  }
}

.reward-info {
  border: 1px solid rgba(215, 235, 255, 1);
  padding: 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.reward-info-icon {
  width: 16px;
  height: 16px;
  margin-right: 10px;
}

.reward-info-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: black;

  .amount {
    color: #00a1ff;
    font-weight: 600;
  }
}

.duanwu-title-img {
  width: 100%;
  height: 28px;
  background-repeat: no-repeat;
  background-size: cover;

  background-position: center;
  &.img1 {
    background-image: url("./images/title-img1.png");
  }

  &.img2 {
    background-image: url("./images/title-img2.png");
  }

  &.img3 {
    background-image: url("./images/title-img3.png");
  }
}

.duanwu-reward-wrapper {
  display: flex;
  flex-direction: column;

  .duanwu-reward-container {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
    align-items: center;
    justify-content: space-between;

    .duanwu-reward-item {
      height: 60px;
      flex: 1;
      border-radius: 4px;
      overflow: hidden;
      position: relative;
      background-color: #d7fab5;
      border: 1px solid #027c5f;
      color: #54783b !important;
      display: flex;
      flex-direction: column;

      .gap {
        height: 20px;
        width: 100%;
      }

      .up {
        background-color: #60904b;
        border-bottom: 1px solid #027c5f;
        border-radius: 0 0 4px 4px;
        color: white;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        font-weight: 800;
        position: absolute;
        top: 0;
        width: 100%;
        height: 20px;
        font-size: 11px;
      }

      .down {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        font-weight: 800;
        font-size: 18px;
        color: #54783b !important;
        width: 100%;
        height: 40px;
      }
    }
  }
}

.duanwu-bonus-wrapper {
  background-color: #d7fab5;
  border: 1px solid #027c5f;
  border-radius: 4px;
  display: flex;
  align-items: center;
  height: 60px;
  padding: 12px;

  .left {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: #54783b !important;
    font-size: 14px;
    font-weight: 800;
    flex: 1;

    img {
      height: 100%;
      width: auto !important;
      margin: 0 !important;
    }

    p {
      margin: 0;
    }
  }

  .right {
    img {
      margin: 0 !important;
    }
  }
}

.dialog {
  max-height: 450px !important;
  background-color: #fbfbe3;
  width: 80%;
  overflow: auto;
  border: 1px solid #027c5f;
  display: flex;
  flex-direction: column;
  .inner-table {
    overflow-y: scroll;
    height: 300px;
    table {
      border-collapse: separate; /* 關鍵！讓邊角能獨立呈現 */
      border-spacing: 0;
    }
    td {
      border: 1px solid #027c5f;
      padding: 0px !important;
      text-align: center;
    }
    th {
      border: none; /* 拿掉標題欄位的邊框 */
    }
    tr:last-child td:first-child {
      border-bottom-left-radius: 4px;
    }
    tr:last-child td:last-child {
      border-bottom-right-radius: 4px;
    }
  }
  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #014625;
    font-weight: 600;
    font-size: 20px;
  }

  table {
    border-radius: 4px;
    width: 100%;

    th {
      background: linear-gradient(180deg, #00cc8c 0%, #006646 100%);
      font-size: 14px;
      color: white;
      border-radius: 4px 4px 0 0;
    }

    td {
      color: #014625;
      font-size: 14px;
    }
  }

  button {
    font-size: 16px;
    background: linear-gradient(180deg, #00cc8c 0%, #006646 100%);
    color: white;
    border: none;
    border-radius: 4px;
    outline: none;
    width: 144px;
    height: 44px;
  }
}

.main-img-wrapper {
  position: relative;
  width: 330px;
  margin: 0 auto;

  .reward-button {
    position: absolute;
    bottom: 10%;
    left: 50%;
    transform: translateX(-50%);
    width: 120px !important;
  }
}
</style>
