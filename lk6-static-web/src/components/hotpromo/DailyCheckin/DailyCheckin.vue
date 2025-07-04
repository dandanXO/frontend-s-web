<template>
  <div class="container">
    <div class="seciont2">
      <div class="first">
        <div class="title"></div>
        <div class="day-task">
          <div class="task-content">
            <div class="task-left">
              <div style="margin-right: 20px">
                <img :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/icon-task-1.png')" />
              </div>
              <div>
                <div style="font-size: 24px">今日签到任务</div>
                <div style="font-size: 20px">
                  <img
                    v-if="todayCheckInState === 'YES' || todayCheckInState === 'CLAIMED'"
                    style="width: 20px; height: 20px"
                    :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/icon-done.png')"
                  />
                  <img
                    v-else
                    style="width: 20px; height: 20px"
                    :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/icon-cancel.png')"
                  />
                  <span style="color: rgba(153, 153, 153, 1)">充值金额≥{{ todayMinDeposit }} 元</span>
                </div>
              </div>
            </div>
            <div class="task-right">
              <button v-if="todayCheckInState === 'YES' || todayCheckInState === 'CLAIMED'" class="button-finish">
                已完成
              </button>
              <button v-else class="button" @click="handleDeposit">去充值</button>
            </div>
          </div>
          <div class="task-content">
            <div class="task-left">
              <div style="margin-right: 20px">
                <img :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/icon-task-2.png')" />
              </div>
              <div>
                <div style="font-size: 24px">获得补签卡</div>
                <div style="font-size: 20px">
                  <img
                    v-if="recheckTaskState === 'CLOSE'"
                    style="width: 20px; height: 20px"
                    :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/icon-done.png')"
                  />
                  <img
                    v-else
                    style="width: 20px; height: 20px"
                    :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/icon-cancel.png')"
                  />
                  <span style="color: rgba(153, 153, 153, 1)">充值金额≥{{ reCheckinMinDeposit }} 元，补签卡 +1</span>
                </div>
              </div>
            </div>
            <div class="task-right">
              <div style="margin-top: -20px">
                剩余补签卡：{{ currentRecheckInChances }} / {{ totalRecheckMinusWeekChances }}
              </div>
              <button v-if="recheckTaskState === 'CLOSE'" class="button-finish">已完成</button>
              <button v-else class="button" @click="handleDeposit">去充值</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="seciont1">
      <div class="basic-info">
        <div>
          VIP 等级
          <span style="color: rgba(238, 202, 24, 1)">{{ vipLevel }}</span>
        </div>
        <div>
          连续签到天数
          <span style="color: rgba(24, 207, 238, 1)">{{ countiuneSign }}</span>
        </div>
      </div>
      <div class="first" v-show="todayCheckInState !== 'NOT_ELIGIBLE'">
        <div
          v-for="(item, index) in sectionOneItems"
          :key="item.day"
          class="grid-item"
          :class="[item.claimState === 'CLAIMED' ? `item-finish item${index}-finish` : `item${index}`]"
          @click="handleClickSectionOneItem(item)"
        >
          <div class="numbers">
            <div class="bonus-number">
              {{ item.bonus }}
              <span class="rmb">¥</span>
            </div>
            <div class="active-point" v-if="item.activePoint > 0">+{{ item.activePoint }}活跃</div>
          </div>
          <div class="day-number">0{{ index + 1 }}</div>
          <div class="status-img">
            <img
              v-if="item.claimState === 'CLAIMED'"
              :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/button-green.png')"
            />
            <img
              v-if="item.claimState === 'OPEN'"
              :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/button-blue.png')"
            />
            <img
              v-if="item.claimState === 'CLOSE'"
              :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/button-purple.png')"
            />
            <img
              v-if="item.claimState === 'RECHECKIN'"
              :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/button-blue.png')"
            />
            <div class="status-text" v-if="item.claimState !== 'CLAIMED'">
              {{ statusTextMap[item.claimState] }}
            </div>
          </div>
        </div>
      </div>
      <div class="secend">
        <div class="box-area">
          <div v-for="(box, index) in sectionOneBoxItems" :key="box.requiredActivePoint">
            <template v-if="index === 0">
              <img
                :class="box.claimState === 'OPEN' ? 'can-claim' : ''"
                :src="
                  box.claimState === 'OPEN'
                    ? require('../../../assets/images/promotion/hotpromo/dailyCheckin/box-blue.png')
                    : box.claimState === 'CLOSE'
                    ? require('../../../assets/images/promotion/hotpromo/dailyCheckin/box-blue-lock.png')
                    : require('../../../assets/images/promotion/hotpromo/dailyCheckin/box-blue-gray.png')
                "
                @click="handleClickBox(box)"
              />
            </template>
            <template v-if="index === 1">
              <img
                :src="
                  box.claimState === 'OPEN'
                    ? require('../../../assets/images/promotion/hotpromo/dailyCheckin/box-blue.png')
                    : box.claimState === 'CLOSE'
                    ? require('../../../assets/images/promotion/hotpromo/dailyCheckin/box-blue-lock.png')
                    : require('../../../assets/images/promotion/hotpromo/dailyCheckin/box-blue-gray.png')
                "
                @click="handleClickBox(box)"
              />
            </template>
            <template v-if="index === 2">
              <img
                :src="
                  box.claimState === 'OPEN'
                    ? require('../../../assets/images/promotion/hotpromo/dailyCheckin/box-purple.png')
                    : box.claimState === 'CLOSE'
                    ? require('../../../assets/images/promotion/hotpromo/dailyCheckin/box-purple-lock.png')
                    : require('../../../assets/images/promotion/hotpromo/dailyCheckin/box-purple-gray.png')
                "
                @click="handleClickBox(box)"
              />
            </template>
            <template v-if="index === 3">
              <img
                :src="
                  box.claimState === 'OPEN'
                    ? require('../../../assets/images/promotion/hotpromo/dailyCheckin/box-yellow.png')
                    : box.claimState === 'CLOSE'
                    ? require('../../../assets/images/promotion/hotpromo/dailyCheckin/box-yellow-lock.png')
                    : require('../../../assets/images/promotion/hotpromo/dailyCheckin/box-yellow-gray.png')
                "
                @click="handleClickBox(box)"
              />
            </template>
          </div>
        </div>
        <div class="progressBar-area">
          <div class="progress-container">
            <div class="progress-bar" :style="{ width: countPercent + '%' }">{{ currentActivePoints }} / 100</div>
          </div>
        </div>
        <div class="number-area">
          <div v-for="box in sectionOneBoxItems" :key="box.requiredActivePoint">
            {{ box.requiredActivePoint }}
          </div>
        </div>
      </div>
    </div>
    <div class="seciont2">
      <div class="secend">
        <div class="title"></div>
        <div style="width: 100%">
          <img
            style="width: 160px; height: 42px"
            :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/rule-time.png')"
          />
          <div class="text">
            {{ promoInfo.activity_date }}
          </div>
        </div>
        <div style="width: 100%">
          <img
            style="width: 160px; height: 42px"
            :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/rule-content.png')"
          />
          <div class="text" style="margin-left: -20px">
            <ul>
              <li>雷火电竞会员存款达到相应要求即可领取签到礼金和对应活跃积分，签到金仅需8倍流水即可提款；</li>
              <li>
                签到礼金和活跃积分每周期只可领取一次，活动期间,若用户签到中断,则重新开始计算,已开启过的宝箱无法再次开启,签到彩金由系统自动实时派发至会员主钱包内；
              </li>
              <li>
                根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；
              </li>
              <li>
                此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及 IP
                地址视为同一账户，若有违规者，将不享受此红利；
              </li>
              <li>为避免文字理解差异，雷火电竞保留此活动最终解释权；</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  <el-dialog v-model="showSuccessDialog" width="550" style="background: transparent">
    <template #header="{ close, titleId, titleClass }">
      <div class="dialog-header">
        <img
          style="width: 190px; height: 50px"
          :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/success-1.png')"
        />
        <img
          style="width: 240px; height: 42px"
          :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/success-2.png')"
        />
        <img
          style="width: 130px; height: 130px"
          :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/success-3.png')"
        />
        <img
          @click="showSuccessDialog = false"
          style="width: 200px; height: auto; cursor: pointer"
          :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/success-4.png')"
        />
      </div>
    </template>
    <template #default v-if="false"></template>
  </el-dialog>
  <el-dialog v-model="showErrorDialog" width="550" style="background: transparent">
    <template #header="{ close, titleId, titleClass }">
      <div class="dialog-header">
        <img
          style="width: 190px; height: auto"
          :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/failure-1.png')"
        />
        <img
          style="width: 240px; height: auto"
          :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/failure-2.png')"
        />
        <img
          style="width: 130px; height: 130px; padding: 10px"
          :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/failure-3.png')"
        />
        <img
          @click="showErrorDialog = false"
          style="width: 190px; height: auto; cursor: pointer"
          :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/failure-4.png')"
        />
      </div>
    </template>
    <template #default v-if="false"></template>
  </el-dialog>
</template>

<script setup>
import { reactive, defineProps, computed, ref, onMounted } from "vue";
import { userStore } from "@/store";
import {
  getCheckInFreeTreasureInit,
  putCheckInFreeTreasureCheckIn,
  putCheckInFreeTreasureClaim
} from "@/api/index/promo";
import { useNotify } from "@/hooks/notify";
import { useRouter } from "vue-router";

const notify = useNotify();
const router = useRouter();

const statusTextMap = {
  CLAIMED: "已领取",
  OPEN: "签到",
  CLOSE: "待签到",
  RECHECKIN: "补签"
};

const store = userStore();
const props = defineProps(["promoInfo"]);
const promoInfo = reactive(JSON.parse(props.promoInfo.param));

const showSuccessDialog = ref(false);
const showErrorDialog = ref(false);
const vipLevel = ref(store.vip.split("VIP")[1]);
const currentActivePoints = ref(0);
const currentRecheckInChances = ref(0);
const totalRecheckInChances = ref(0);
const recheckTaskState = ref("CLOSE");

const countiuneSign = computed(() => {
  let times = 0;
  sectionOneItems.value.forEach((item) => {
    if (item.claimState === "CLAIMED") {
      times++;
    }
  });
  return times;
});
const countPercent = computed(() => {
  let times = 0;
  sectionOneBoxItems.value.forEach((item) => {
    console.log(currentActivePoints.value);
    if (currentActivePoints.value >= +item.requiredActivePoint) {
      times++;
    }
  });
  if (times <= 0) {
    return (currentActivePoints.value / 5) * 4;
  } else if (times >= 4) {
    return 100;
  } else if (times >= 3) {
    return (currentActivePoints.value / 5) * 4.5;
  }
  return ((times * 25) / 5) * 4;
});
// 是 "YES", 就是“已完成” + 打勾，
// 是 "NO" 则是 "去充值“和 打 X
const todayCheckInState = ref("YES");
const sectionOneItems = ref([]);
const sectionOneBoxItems = ref([]);
const todayMinDeposit = ref(0);
const totalRecheckMinusWeekChances = ref(0);
const reCheckinMinDeposit = ref(0);

const handleClickSectionOneItem = async (item) => {
  if (item.claimState === "OPEN" || item.claimState === "RECHECKIN") {
    putCheckInFreeTreasureCheckIn(item.day)
      .then(async (res) => {
        if (res.code === 0) {
          showSuccessDialog.value = true;
          await fetchData();
        } else {
          showErrorDialog.value = true;
        }
      })
      .catch((err) => {
        showErrorDialog.value = true;
      });
  }
};

const handleClickBox = async (box) => {
  console.log(box);
  if (box.claimState !== "OPEN") return;

  putCheckInFreeTreasureClaim(box.requiredActivePoint)
    .then(async (res) => {
      if (res.code === 0) {
        notify.success("领取成功");
        store.getBalance();
        await fetchData();
      } else {
        notify.error(res.message);
      }
    })
    .catch((err) => {
      notify.error(res.message);
    });
};

const handleDeposit = () => {
  if (todayCheckInState.value !== "NO") return;

  router.push("/center/deposit");
};

const fetchData = async () => {
  try {
    const res = await getCheckInFreeTreasureInit();
    sectionOneItems.value = res.data.checkInState.checkInDayHistory;
    todayCheckInState.value = res.data.checkInState.todayCheckInState;
    todayMinDeposit.value = res.data.checkInState.todayMinDeposit;
    sectionOneBoxItems.value = res.data.lhFreeTreasureState.treasureList;
    currentActivePoints.value = res.data.lhFreeTreasureState.currentActivePoints;
    currentRecheckInChances.value = res.data.reCheckInState.currentRecheckInChances;
    totalRecheckInChances.value = res.data.reCheckInState.totalRecheckInChances;
    if (totalRecheckInChances.value !== 0) {
      totalRecheckMinusWeekChances.value =
        res.data.reCheckInState.totalRecheckInChances - res.data.reCheckInState.thisWeekUsedChances;
    }
    reCheckinMinDeposit.value = res.data.reCheckInState.minDeposit;
    recheckTaskState.value = res.data.reCheckInState.recheckTaskState;
  } catch (error) {
    notify.error(res.message);
  }
};

onMounted(async () => {
  await fetchData();
});
</script>

<style lang="scss" scoped>
.seciont1 {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  .basic-info {
    position: absolute;
    top: 30px;
    width: 1336px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 50px;
    color: #fff;
    font-size: 30px;
  }
  .first {
    padding-top: 30px;
    background-image: url("@/assets/images/promotion/hotpromo/dailyCheckin/bg-1.png");
    background-repeat: no-repeat;
    background-size: contain;
    width: 1336px;
    height: 400px;
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-gap: 10px;
    background-color: transparent;
    padding: 50px 20px 20px;
    .grid-item {
      position: relative;
      padding: 20px;
      font-size: 20px;
      text-align: center;
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center;
      background-image: url("@/assets/images/promotion/hotpromo/dailyCheckin/card-other.png");
      &.item-finish {
        background-image: url("@/assets/images/promotion/hotpromo/dailyCheckin/card-finish.png");
      }
      .numbers {
        position: absolute;
        left: 58%;
        top: 36%;
        text-align: center;
        .bonus-number {
          background: linear-gradient(180deg, #ffffff 22.73%, #ffef81 79.55%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
          font-size: 45px;
          line-height: 35px;
          font-weight: 600;
          span.rmb {
            font-size: 25px;
            margin-left: 2px;
          }
        }
        .active-point {
          font-size: 14px;
        }
      }
    }
    .grid-item:nth-last-child(1) {
      grid-column: span 2;
    }
    .item6 {
      background-image: url("@/assets/images/promotion/hotpromo/dailyCheckin/card-big-other.png");
    }
    .item6-finish {
      background-image: url("@/assets/images/promotion/hotpromo/dailyCheckin/card-big-finish.png");
    }
    .day-number {
      position: absolute;
      top: 80px;
      left: 12px;
      font-size: 20px;
    }
    .status-img {
      position: absolute;
      bottom: 90px;
      cursor: pointer;
      img {
        width: 120px;
        height: 40px;
        border-radius: 0px !important;
      }
    }
    .status-text {
      position: absolute;
      bottom: 5px;
      left: 50%; /* 将元素的左边界设置在父元素宽度的 50% 的位置 */
      transform: translateX(-50%); /* 然后通过 transform 向左偏移自身宽度的 50% */
    }
  }
  .secend {
    background-image: url("@/assets/images/promotion/hotpromo/dailyCheckin/bg-2.png");
    width: 1320px;
    height: 588px;
    display: flex;
    margin-top: 40px;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .box-area {
      margin-bottom: 30px;
      padding-top: 90px;
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      width: 1300px;
      padding-left: 84px;
      padding-right: 84px;

      img {
        cursor: pointer;
        &.can-claim {
          &:hover {
            filter: brightness(0.9);
          }
          &:active {
            filter: brightness(0.85);
            transform: translate(0px, 1px);
          }
        }
      }
    }
    .progressBar-area {
      width: 100%;
      padding-left: 84px;
      padding-right: 84px;
      .progress-container {
        width: 100%;
        background-image: url("@/assets/images/promotion/hotpromo/dailyCheckin/bar-bg.png");
        border-radius: 30px;
        overflow: hidden;
        margin: 20px 0;
        border: 1px solid #065092;
      }

      .progress-bar {
        width: 0%;
        height: 30px;
        background: linear-gradient(90deg, #23d2f0 0%, #9a7bff 100%);
        text-align: center;
        line-height: 30px;
        color: white;
        border-radius: 5px 30px 30px 5px;
      }
    }
    .number-area {
      margin-top: 25px;
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      width: 1300px;
      padding-left: 84px;
      padding-right: 84px;
      font-size: 40px;
      color: #fff;

      > div {
        width: 190px;
        text-align: center;
      }
    }
  }
}
.seciont2 {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .first {
    width: 1336px;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .title {
      background-image: url("@/assets/images/promotion/hotpromo/dailyCheckin/title1.png");
      width: 1060px;
      height: 60px;
      margin-top: 40px;
      margin-bottom: 40px;
    }
    .day-task {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .task-content {
        color: #fff;
        background-image: url("@/assets/images/promotion/hotpromo/dailyCheckin/bg-3.png");
        width: 640px;
        height: 144px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        .task-left {
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          align-items: center;
        }
        .task-right {
          .button {
            background: linear-gradient(90deg, #23d2f0 0%, #9a7bff 100%);
            width: 150px;
            height: 50px;
            border-radius: 8px;
            font-size: 24px;

            &:hover {
              opacity: 0.9;
            }
          }
          .button-finish {
            background: linear-gradient(90deg, #23d2f0 0%, #9a7bff 100%);
            opacity: 0.8;
            width: 150px;
            height: 50px;
            border-radius: 8px;
            font-size: 24px;
          }
        }
      }
    }
  }
  .secend {
    width: 1336px;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .title {
      background-image: url("@/assets/images/promotion/hotpromo/dailyCheckin/title2.png");
      width: 1060px;
      height: 60px;
      margin-top: 60px;
      margin-bottom: 30px;
    }
    .text {
      color: #fff;
      font-size: 20px;
      margin-top: 20px;
      margin-bottom: 40px;
    }
  }
}
.dialog-header {
  width: 550px;
  height: 420px;
  background: transparent;
  background-image: url("@/assets/images/promotion/hotpromo/dailyCheckin/bg-4.png");
  background-size: contain;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
:deep(.el-dialog) {
  background: transparent !important;
}
:deep(.el-dialog__header) {
  background: transparent !important;
}
:deep(.el-dialog__body) {
  display: none;
}
</style>
