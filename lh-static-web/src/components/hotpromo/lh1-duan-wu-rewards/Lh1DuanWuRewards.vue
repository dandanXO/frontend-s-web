<template>
  <div class="container">
    <div class="first-content">
      <img src="@/assets/promo/lh1-duan-wu-rewards/title-one.png" alt="" class="title-img" />
      <div class="content-top">
        <div class="first-content-title">
          <img src="@/assets/promo/lh1-duan-wu-rewards/first-little-title-one.svg" alt="" style="padding: 0px 20px" />
          <div>
            <span style="color: #54783b; font-size: 36px">{{ totalValidBet }}</span>
            <span style="color: #54783b; font-size: 16px">元</span>
          </div>
        </div>
        <div class="first-content-title">
          <img src="@/assets/promo/lh1-duan-wu-rewards/first-little-title-two.svg" alt="" style="padding: 0px 20px" />
          <div>
            <span style="color: #54783b; font-size: 36px">{{ currentTokenAmount }}</span>
            <span style="color: #54783b; font-size: 16px">片</span>
          </div>
        </div>
        <div class="first-content-title">
          <img src="@/assets/promo/lh1-duan-wu-rewards/first-little-title-three.svg" alt="" style="padding: 0px 20px" />
          <div>
            <span style="color: #54783b; font-size: 36px">{{ rewardsCanClaim }}</span>
            <span style="color: #54783b; font-size: 16px">个</span>
          </div>
        </div>
        <div class="second-content-title">
          <img src="@/assets/promo/lh1-duan-wu-rewards/Zongzi-ittle.png" alt="" />
          <div style="display: flex; flex-direction: column; justify-content: center; padding-right: 12px">
            <div>
              <span style="color: #54783b; font-size: 24px">
                粽叶领取 X
                <span>{{ todayToken }}</span>
              </span>
              <span style="color: #54783b; font-size: 24px">片</span>
            </div>
            <img
              src="@/assets/promo/lh1-duan-wu-rewards/btn.png"
              alt=""
              style="padding-top: 12px; cursor: pointer"
              @click="postReceive"
            />
          </div>
        </div>
      </div>

      <div class="content-bottom" style="position: relative">
        <img src="@/assets/promo/lh1-duan-wu-rewards/BigZongzi.png" alt="" />
        <img
          src="@/assets/promo/lh1-duan-wu-rewards/openBtn.png"
          alt=""
          style="position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); cursor: pointer"
          @click="postBonus"
        />

        <span
          style="
            z-index: 10;
            position: absolute;
            bottom: 212px;
            color: #723d00;
            right: 343px;
            transform: rotate(-9deg);
            font-size: 20px;
            text-decoration: underline;
            cursor: pointer;
          "
          @click="fetchRecordData(true)"
        >
          粽叶领取记录
        </span>
        <span
          style="
            z-index: 20;
            position: absolute;
            bottom: 165px;
            color: #723d00;
            right: 340px;
            transform: rotate(1deg);
            font-size: 20px;
            text-decoration: underline;
            cursor: pointer;
          "
          @click="fetchRecordData(false)"
        >
          开启粽子记录
        </span>
      </div>
      <div style="margin-bottom: 48px">
        <span style="color: #014625; font-size: 20px">每开启一次粽子将</span>
        <span style="color: #ff0000; font-size: 20px">消耗5片粽叶</span>
      </div>
    </div>

    <div class="second-content">
      <img src="@/assets/promo/lh1-duan-wu-rewards/title-two.png" alt="" class="title-img" />
      <div style="margin: 0px 40px; display: flex; flex-direction: column; gap: 12px">
        <div style="display: flex">
          <img src="@/assets/promo/lh1-duan-wu-rewards/second-title-1.png" alt="" />
          <span style="color: #014625; font-size: 20px">2025年5月28日至2025年6月3日(共7天)</span>
        </div>
        <div style="display: flex">
          <img src="@/assets/promo/lh1-duan-wu-rewards/second-title-2.png" alt="" />
        </div>
        <div style="color: #014625; font-size: 20px; text-align: left">
          活动期间，昨日累计有效投注≥1,500元即可获得对应粽叶数量，每五片粽叶可兑换一个粽子，打开粽子即可领取神秘安康金，粽叶最高可领50片~
        </div>

        <div class="table-container">
          <table class="bet-table">
            <thead>
              <tr>
                <th>昨日有效投注</th>
                <th>粽叶数量</th>
                <th>流水倍数</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in tableData" :key="index">
                <td>{{ row.bet }}</td>
                <td>{{ row.leaf }}</td>
                <td v-if="index === 0" :rowspan="tableData.length" class="flow-multiplier">
                  {{ flowMultiplier }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <div style="display: flex; align-items: center">
            <img src="@/assets/promo/lh1-duan-wu-rewards/right-arrow.png" alt="" />
            <span style="font-size: 20px; font-weight: 600; color: #ff0000">示例</span>
          </div>
        </div>
        <div style="font-size: 20px; font-weight: 400; color: #ff0000; text-align: left; margin-bottom: 40px">
          会员A 在当日累计有效投注400,000元，次日即可领取12片粽叶，兑换2个好粽，获得对应安康金。
        </div>
      </div>
    </div>

    <div class="third-content">
      <img src="@/assets/promo/lh1-duan-wu-rewards/title-three.png" alt="" class="title-img" />
      <div class="rules-container">
        <ul>
          <li>
            <span class="circle">1</span>
            活动期间，会员当日累计有效投注≥1,500
            元，次日24小时内在活动页面点击【领取粽叶】按钮获得粽叶，若粽叶数量≥5片，即可获得一个好粽，点击【打开好粽】即可获得安康金，彩金6
            倍流水即可出款，逾期未领取则视为放弃，有效投注次日清零；
            <span class="note red">注：奖励不叠加派发，按最高档位每日派发一次。</span>
          </li>
          <li>
            <span class="circle">2</span>
            获得的粽叶可在活动期间内累计保存使用，请于活动结束（2025年6月3日23:59）完成兑换，否则未使用的粽叶将视为自动放弃，平台将不予补偿
            <span class="note red">注：有效投注统计截止至6月2日23:59前，兑换领取截止6月3日23:59前</span>
          </li>

          <li>
            <span class="circle">3</span>
            任何低于欧洲盘 1.7 或亚洲盘 0.7
            水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投注额内；
          </li>
          <li>
            <span class="circle">4</span>
            根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；
          </li>
          <li>
            <span class="circle">5</span>
            此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及 IP
            地址视为同一账户，若有违规者，将不享受此红利；
          </li>
          <li>
            <span class="circle">6</span>
            为避免文字理解差异，雷火电竞保留此活动最终解释权；
          </li>
        </ul>
      </div>
    </div>
    <el-dialog
      align-center
      centered
      class="duanWuDialog"
      v-model="isOpenResultDialog"
      :show-close="false"
      style="background-color: #fbfbe3; border: #014625 solid 2px; min-width: 560px; width: 560px"
    >
      <div style="display: flex; align-items: center; flex-direction: column; justify-content: center; padding: 0px">
        <div
          style="
            border-top-left-radius: 9px;
            border-top-right-radius: 9px;
            display: flex;
            color: #fff;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            width: 100%;
            height: 50px;
            background: linear-gradient(180deg, #00cc8c 0%, #006646 100%);
          "
        >
          <div>兑换粽子获得安康金</div>
        </div>
        <img src="@/assets/promo/lh1-duan-wu-rewards/resultDialogBg.png" alt="" class="title-img" />
        <div>
          <span style="color: #ff8400; font-size: 40px; font-weight: 600">{{ rewardAmount }}</span>
          <span style="color: #ff8400; font-size: 20px">元</span>
        </div>
        <div style="font-size: 24px; font-weight: 400; color: #014625; text-align: center; margin: 10px 0">
          恭喜您获得安康金
        </div>
        <div
          style="
            background: linear-gradient(180deg, #00cc8c 0%, #006646 100%);
            height: 60px;
            width: 200px;
            border-radius: 8px;
            font-size: 24px;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          "
        >
          <div @click="closeResultDialog">确定</div>
        </div>
      </div>
      <div class="resultClose" @click="closeResultDialog">
        <img src="@/assets/promo/lh1-duan-wu-rewards/close-icon.png" alt="" />
      </div>
    </el-dialog>
    <el-dialog
      align-center
      centered
      class="duanWuDialog"
      v-model="isOpenDialog"
      :show-close="false"
      style="background-color: #fbfbe3; border: #014625 solid 2px; min-width: 1200px"
    >
      <div style="display: flex; justify-content: center; flex-direction: column; align-items: center">
        <img src="@/assets/promo/lh1-duan-wu-rewards/first-little-title-four.png" alt="" class="title-img" />
        <div class="tab-wrapper" @click="handleToggleTab" style="width: 560px; display: flex; justify-content: center">
          <img v-if="isTabLeft" src="@/assets/promo/lh1-duan-wu-rewards/dialog-btn2.png" width="100%" />
          <img v-else src="@/assets/promo/lh1-duan-wu-rewards/dialog-btn1.png" width="100%" />
        </div>

        <div class="close" @click="closeDialog">
          <img src="@/assets/promo/lh1-duan-wu-rewards/close-icon.png" alt="" />
        </div>

        <div v-show="isTabLeft" style="flex: 1; width: 100%; margin: 20px 0px">
          <div class="table-container">
            <table class="bet-table">
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
                <tr v-else v-for="(row, index) in tokenRecord" :key="index">
                  <td>{{ row.recordTime }}</td>
                  <td>{{ row.token }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-show="!isTabLeft" style="flex: 1; width: 100%; margin: 20px 0px">
          <div class="table-container">
            <table class="bet-table">
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
                <tr v-else v-for="(row, index) in rewardRecord" :key="index">
                  <td>{{ row.recordTime }}</td>
                  <td>1个</td>
                  <td>{{ row.bonus }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div @click="closeDialog" class="closeBtn">关闭</div>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import {
  getDuanWuRewardInit,
  getDuanWuTokenRecords,
  getDuanWuRewardRecords,
  postDuanWuReceiveToken,
  getDuanWuclaimBonus
} from "@/api/index/promo";
import { useNotify } from "@/hooks/notify";

const isOpenDialog = ref(false);
const isOpenResultDialog = ref(false);
const props = defineProps(["promoCode"]);
const notify = useNotify();
const todayToken = ref("");
const currentTokenAmount = ref("");
const rewardAmount = ref(0);
const rewardsCanClaim = ref("");
const totalValidBet = ref("");
const isTabLeft = ref(false);
const tokenRecord = ref([]);
const rewardRecord = ref([]);
const tableData = [
  { bet: "≥1,500元", leaf: "1片" },
  { bet: "≥5,000元", leaf: "2片" },
  { bet: "≥10,000元", leaf: "3片" },
  { bet: "≥30,000元", leaf: "5片" },
  { bet: "≥100,000元", leaf: "8片" },
  { bet: "≥300,000元", leaf: "12片" },
  { bet: "≥500,000元", leaf: "18片" },
  { bet: "≥1,000,000元", leaf: "30片" },
  { bet: "≥3,000,000元", leaf: "50片" }
];

const flowMultiplier = "6倍流水";

const handleToggleTab = () => {
  isTabLeft.value = !isTabLeft.value;
};

const init = () => {
  getDuanWuRewardInit(props.promoCode).then((res) => {
    console.log(res);

    if (res.code === 0) {
      todayToken.value = res.data.todayToken;
      currentTokenAmount.value = res.data.currentTokenAmount;
      rewardsCanClaim.value = res.data.rewardsCanClaim;
      totalValidBet.value = res.data.totalValidBet;
    } else {
      notify.error(res.message);
    }
  });
};

const postReceive = () => {
  postDuanWuReceiveToken(props.promoCode).then((res) => {
    if (res.code === 0) {
      notify.success({
        type: "success",
        message: "领取成功"
      });
      init();
    } else {
      notify.error(res.message);
    }
  });
};

const postBonus = () => {
  getDuanWuclaimBonus(props.promoCode).then((res) => {
    if (res.code === 0) {
      isOpenResultDialog.value = true;
      rewardAmount.value = res.data;
      init();
    } else {
      notify.error(res.message);
    }
  });
};

const fetchRecordData = (action) => {
  isOpenDialog.value = true;
  isTabLeft.value = action;
  getDuanWuTokenRecords(props.promoCode).then((res) => {
    if (res.code === 0) {
      tokenRecord.value = res.data;
    }
  });

  getDuanWuRewardRecords(props.promoCode).then((res) => {
    if (res.code === 0) {
      rewardRecord.value = res.data;
    }
  });
};
const closeResultDialog = () => {
  isOpenResultDialog.value = false;
};
const closeDialog = () => {
  isOpenDialog.value = false;
};

onMounted(() => {
  init();
});
</script>
<style scoped lang="scss">
@font-face {
  font-family: hyagi;
  src: url("@/components/hotpromo/dragonboat/fonts/hya0gj.ttf");
}

.container {
  /* background: url("@/assets/promo/lh1-duan-wu-rewards/bg-img.jpg"); */
  background-size: 100% 100%;
  font-size: 17px;
  line-height: 30px;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: "PingFang SC";
}

.first-content {
  min-width: 1200px;
  background-color: #fbfbe3;
  border: 2px solid #027c5f;
  border-radius: 24px;
  font-weight: 800;
}

.second-content {
  max-width: 1200px;
  background-color: #fbfbe3;
  border: 2px solid #027c5f;
  border-radius: 24px;
  margin-top: 40px;
  margin-bottom: 40px;
}

.third-content {
  max-width: 1200px;
  background-color: #fbfbe3;
  border: 2px solid #027c5f;
  border-radius: 24px;
}

.content-top {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.content-bottom {
  display: flex;
  justify-content: center;
  position: relative;
}
.title-img {
  width: 450px;
  margin-top: 15px;
  margin-bottom: 10px;
}

.first-content-title {
  background-color: #d7fab5;
  border: 2px solid #027c5f;
  border-radius: 12px;
  width: 220px;
  height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.second-content-title {
  background-color: #d7fab5;
  border: 2px solid #027c5f;
  border-radius: 12px;
  height: 140px;
  display: flex;
}

.table-container {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.bet-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  font-family: "PingFang SC";
}

thead {
  background: linear-gradient(to bottom, #00cc8c, #006646);
  color: white;
}

th {
  border: 1px solid #006948;
  padding: 12px;
  color: white;
}

td {
  border: 1px solid #006948;
  padding: 12px;
  color: #014625;
}

.flow-multiplier {
  vertical-align: middle;

  color: #014625;
}

.rules-container {
  margin: auto;
  padding: 0px 40px;
  font-size: 18px;
  line-height: 1.7;
  border-radius: 8px;
  color: #014625;
  text-align: left;
}

ul {
  list-style: none;
  padding-left: 0;
}

li {
  margin-bottom: 1.5rem;
  position: relative;
  padding-left: 2.5em;
}

.circle {
  position: absolute;
  top: 0.15em;
  left: 0;
  width: 22px;
  height: 22px;
  background-color: #4caf50;
  color: white;
  border-radius: 50%;
  text-align: center;
  font-size: 13px;
  line-height: 22px;
  font-weight: bold;
}

strong {
  color: #333;
}

.note {
  display: block;
  margin-top: 0.5em;
  color: #d9534f;
  font-weight: bold;
}

.red {
  color: red;
}

.el-dialog.duanWuDialog {
  background: #fbfbe3;
  box-shadow: none;
  min-width: 1200px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 0;
  position: relative;
}

.close {
  position: absolute;
  right: 5px;
  top: -25px;
  width: 10px;
  height: 10px;
  cursor: pointer;
}
.resultClose {
  position: absolute;
  right: 40px;
  top: 0px;
  width: 10px;
  height: 10px;
  cursor: pointer;
}

.closeBtn {
  background: linear-gradient(to bottom, #00cc8c, #006646);
  color: #fff;
  width: 144px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
}
:deep(.el-dialog .el-dialog__body) {
  padding: 0px;
  padding-bottom: 16px;
}
</style>
