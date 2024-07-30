<template>
  <div class="container">
    <div class="seciont1">
      <div class="first" v-show="todayCheckInState !== 'NOT_ELIGIBLE'">
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

        <div
          v-for="(item, index) in sectionOneItems"
          :key="item.day"
          class="grid-item"
          :class="[item.claimState === 'CLAIMED' ? `item${index}-finish` : `item${index}`]"
          @click="handleClickSectionOneItem(item)"
        >
          <div class="day-number">0{{ index + 1 }}</div>
          <div class="status-img">
            <img v-if="item.claimState === 'CLAIMED'" :src="require('./images/button-green.png')" />
            <img v-if="item.claimState === 'OPEN'" :src="require('./images/button-blue.png')" />
            <img v-if="item.claimState === 'CLOSE'" :src="require('./images/button-purple.png')" />
            <img v-if="item.claimState === 'RECHECKIN'" :src="require('./images/button-blue.png')" />
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
                class="box"
                :src="
                  box.claimState === 'OPEN'
                    ? require('./images/box-blue.png')
                    : box.claimState === 'CLOSE'
                    ? require('./images/box-blue-lock.png')
                    : require('./images/box-blue-gray.png')
                "
                @click="handleClickBox(box)"
              />
            </template>
            <template v-if="index === 1">
              <img
                class="box"
                :src="
                  box.claimState === 'OPEN'
                    ? require('./images/box-blue.png')
                    : box.claimState === 'CLOSE'
                    ? require('./images/box-blue-lock.png')
                    : require('./images/box-blue-gray.png')
                "
                @click="handleClickBox(box)"
              />
            </template>
            <template v-if="index === 2">
              <img
                class="box"
                :src="
                  box.claimState === 'OPEN'
                    ? require('./images/box-purple.png')
                    : box.claimState === 'CLOSE'
                    ? require('./images/box-purple-lock.png')
                    : require('./images/box-purple-gray.png')
                "
                @click="handleClickBox(box)"
              />
            </template>
            <template v-if="index === 3">
              <img
                class="box"
                :src="
                  box.claimState === 'OPEN'
                    ? require('./images/box-yellow.png')
                    : box.claimState === 'CLOSE'
                    ? require('./images/box-yellow-lock.png')
                    : require('./images/box-yellow-gray.png')
                "
                @click="handleClickBox(box)"
              />
            </template>
          </div>
        </div>
        <div class="progressBar-area">
          <div class="progress-container">
            <div class="progress-bar" :style="{ width: countPercent + '%' }"></div>
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
      <div class="first">
        <div class="title"></div>
        <div class="day-task">
          <div class="task-content">
            <div class="task-left">
              <div style="margin-right: 10px; height: 36px; width: 36px">
                <img :src="require('./images/icon-task-1.png')" />
              </div>
              <div>
                <div style="font-size: 14px">今日签到任务</div>
                <div class="flex-item">
                  <img
                    v-if="todayCheckInState === 'YES'"
                    style="display: inline; vertical-align: middle; width: 12px; height: 12px"
                    :src="require('./images/icon-done.png')"
                  />
                  <img v-else style="width: 20px; height: 20px" :src="require('./images/icon-cancel.png')" />
                  <span style="color: rgba(153, 153, 153, 1)">充值金额≥500 元</span>
                </div>
              </div>
            </div>
            <div class="task-right">
              <button v-if="todayCheckInState === 'YES'" class="button-finish">已完成</button>
              <button v-else class="button" @click="handleDeposit">去充值</button>
            </div>
          </div>
          <div class="task-content">
            <div class="task-left">
              <div style="margin-right: 10px; height: 36px; width: 36px">
                <img :src="require('./images/icon-task-2.png')" />
              </div>
              <div>
                <div style="font-size: 14px">获得补签卡</div>
                <div class="flex-item">
                  <!-- reCheckInState  TODO 圖片判斷需要另外寫-->
                  <img
                    v-if="todayCheckInState === 'YES'"
                    style="display: inline; vertical-align: middle; width: 12px; height: 12px"
                    :src="require('./images/icon-done.png')"
                  />
                  <img v-else style="width: 20px; height: 20px" :src="require('./images/icon-cancel.png')" />
                  <span style="color: rgba(153, 153, 153, 1)">充值金额≥100 元，补签卡 +1</span>
                </div>
              </div>
            </div>
            <div class="task-right">
              <div style="margin-top: -20px">
                剩余补签卡：{{ currentRecheckInChances }}/ {{ totalRecheckInChances }}
              </div>
              <button v-if="todayCheckInState === 'YES'" class="button-finish">已完成</button>
              <button v-else class="button" @click="handleDeposit">去充值</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <q-dialog v-model="showSuccessDialog" persistent>
    <q-card class="win-rebate-model">
      <q-card-section class="row items-center justify-center">
        <div class="dialog-header">
          <img style="width: 108px; height: 28px" :src="require('./images/success-1.png')" />
          <img style="width: 126px; height: 22px" :src="require('./images/success-2.png')" />
          <img style="width: 80px; height: 80px" :src="require('./images/success-3.png')" />
          <img
            @click="showSuccessDialog = false"
            style="width: 122px; height: 43px"
            :src="require('./images/success-4.png')"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showErrorDialog" persistent>
    <q-card class="win-rebate-model">
      <q-card-section class="row items-center justify-center">
        <div class="dialog-header">
          <img style="width: 108px; height: 28px" :src="require('./images/failure-1.png')" />
          <img style="width: 126px; height: 22px" :src="require('./images/failure-2.png')" />
          <img style="width: 80px; height: 80px" :src="require('./images/failure-3.png')" />
          <img
            @click="showErrorDialog = false"
            style="width: 122px; height: 43px"
            :src="require('./images/failure-4.png')"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showRuleDialog" persistent>
    <q-card class="win-rebate-model">
      <q-card-section class="row items-center justify-center">
        <div class="dialog-header-2">
          <img class="closeX" @click="showRuleDialog = false" :src="require('./images/icon-close.png')" />
          <div class="secend-rule">
            <div class="title">活动规则</div>
            <div style="width: 100%">
              <img style="width: 104px; height: 28px" :src="require('./images/rule-time.png')" />
              <div class="text">
                {{ promoInfo.activity_date }}
              </div>
            </div>
            <div style="width: 100%">
              <img style="width: 104px; height: 28px" :src="require('./images/rule-content.png')" />
              <div class="text" style="margin-left: -20px; overflow: scroll; height: 250px">
                <ul>
                  <li>
                    所有雷火电竞会员存款达到相应 VIP
                    等级要求即可享有特定免费奖金、存送奖金或其他奖励，存送奖金只需完成（存款 +
                    奖金）*相应流水倍数即可提款。
                  </li>
                  <li>各等级所对应的优惠所要求的流水有所不同，会员需要达到相应流水方可申请提款。</li>
                  <li>
                    此优惠促销只适用于拥有一个独立账户的玩家。住址、电子邮箱地址﹑电话号码﹑支付方式（相同借记卡/信用卡/银行账户号码）IP
                    地址，同一网络环境等将可以作为判定是否独立玩家的条件。对于发现任何有违背、欺骗、或利用规则和条款进行非法获利的会员，雷火电竞保留在任何时候都可以停止、取消优惠或索回已支付的全部优惠的权利。
                  </li>
                  <li>各等级所对应的优惠所要求的流水有所不同，会员需要达到相应流水方可申请提款。</li>
                  <li>
                    所有雷火电竞会员存款达到相应 VIP
                    等级要求即可享有特定免费奖金、存送奖金或其他奖励，存送奖金只需完成（存款 +
                    奖金）*相应流水倍数即可提款。
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { reactive, defineProps, computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { userStore } from "../../../stores/index";
import { eventapi } from "../../../boot/axios";
import { useNotify } from "src/hooks/notify";

const statusTextMap = {
  CLAIMED: "已领取",
  OPEN: "签到",
  CLOSE: "待签到",
  RECHECKIN: "补签"
};

const notify = useNotify();
const router = useRouter();
const store = userStore();
const props = defineProps(["promoInfo"]);
const promoInfo = reactive(JSON.parse(props.promoInfo.param));

const showSuccessDialog = ref(false);
const showErrorDialog = ref(false);
const showRuleDialog = ref(false);
const vipLevel = ref(store.vip.split("VIP")[1]);
const currentActivePoints = ref(0);
// 是 "YES", 就是“已完成” + 打勾，
// 是 "NO" 则是 "去充值“和 打 X
const todayCheckInState = ref("YES");
const currentRecheckInChances = ref(0);
const totalRecheckInChances = ref(0);
const recheckTaskState = ref("CLOSE");

const sectionOneItems = ref([]);
const sectionOneBoxItems = ref([]);
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
    if (item.claimState === "CLAIMED") {
      times++;
    }
  });
  return times * 25;
});

const handleClickSectionOneItem = async (item) => {
  if (item.claimState === "OPEN" || item.claimState === "RECHECKIN") {
    eventapi
      .put(`/checkInFreeTreasure/checkIn?checkInDay=${item.day}`)
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
  if (box.claimState !== "OPEN") return;

  eventapi
    .put(`/checkInFreeTreasure/claimTreasure?point=${box.requiredActivePoint}`)
    .then(async (res) => {
      console.log(res);
      if (res.code === 0) {
        notify.success("领取成功");
        await fetchData();
      } else {
        notify.error(res.message);
      }
    })
    .catch((err) => {
      notify.error(err.message);
    });
};

const handleDeposit = () => {
  if (todayCheckInState.value !== "NO") return;

  router.push("/finance/deposit");
};

const fetchData = async () => {
  try {
    eventapi.get("/checkInFreeTreasure/init").then((res) => {
      sectionOneItems.value = res.data.checkInState.checkInDayHistory;
      todayCheckInState.value = res.data.checkInState.todayCheckInState;
      sectionOneBoxItems.value = res.data.lhFreeTreasureState.treasureList;
      currentActivePoints.value = res.data.lhFreeTreasureState.currentActivePoints;
      currentRecheckInChances.value = res.data.reCheckInState.currentRecheckInChances;
      totalRecheckInChances.value = res.data.reCheckInState.totalRecheckInChances;
      recheckTaskState.value = res.data.reCheckInState.recheckTaskState;
    });
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
    top: 1.6rem;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 2.5rem;
    color: #fff;
    font-size: 14px;
  }
  .first {
    position: relative;
    padding: 18px;
    padding-top: 50px;
    background-image: url("./images/bg-1.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center;
    width: 100%;
    height: 100%;
    min-height: 250px;
    display: grid;
    place-items: center;
    grid-template-columns: repeat(4, 1fr); /* 四個等寬的列 */
    background-color: transparent; /* 背景顏色 */

    .grid-item {
      width: 72px;
      height: 86px;
      position: relative;
      padding: 20px;
      font-size: 10px;
      text-align: center;
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center;

      @media (max-width: 375px) {
        width: 64px;
        height: 76px;
      }
    }
    .grid-item:nth-last-child(1) {
      grid-column: span 2;
      width: 154px;
      height: 86px;

      @media (max-width: 375px) {
        width: 135px;
        height: 76px;
      }
    }
    .item0 {
      background-image: url("./images/card-1-other.png");
    }
    .item0-finish {
      background-image: url("./images/card-1-finish.png");
    }
    .item1 {
      background-image: url("./images/card-1-other.png");
    }
    .item1-finish {
      background-image: url("./images/card-1-finish.png");
    }
    .item2 {
      background-image: url("./images/card-1-other.png");
    }
    .item2-finish {
      background-image: url("./images/card-1-finish.png");
    }
    .item3 {
      background-image: url("./images/card-1-other.png");
    }
    .item3-finish {
      background-image: url("./images/card-1-finish.png");
    }
    .item4 {
      background-image: url("./images/card-2-other.png");
    }
    .item4-finish {
      background-image: url("./images/card-2-finish.png");
    }
    .item5 {
      background-image: url("./images/card-3-other.png");
    }
    .item5-finish {
      background-image: url("./images/card-3-finish.png");
    }
    .item6 {
      background-image: url("./images/card-4-other.png");
    }
    .item6-finish {
      background-image: url("./images/card-4-finish.png");
    }
    .day-number {
      position: absolute;
      top: 4px;
      left: 4px;
      font-size: 10px;
    }
    .status-img {
      position: absolute;
      bottom: 0px;
      img {
        width: 50px;
        height: 18px;
        border-radius: 0px !important;
      }
      cursor: pointer;
    }
    .status-text {
      position: absolute;
      bottom: 7px;
      width: 100%;
      left: 50%; /* 将元素的左边界设置在父元素宽度的 50% 的位置 */
      transform: translateX(-50%); /* 然后通过 transform 向左偏移自身宽度的 50% */
    }
  }
  .secend {
    background-image: url("./images/bg-2.png");
    background-size: 100% 100%;
    background-position: center;
    min-height: 200px;
    height: 100%;
    background-repeat: no-repeat;
    width: 100%;
    display: flex;
    margin-top: 16px;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .box-area {
      padding-top: 8.5%;
      display: grid;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      width: 85%;
      grid-template-columns: repeat(4, 1fr);
      gap: 25px;

      @media (max-width: 400px) {
        gap: 15px;
      }

      .box {
        width: 100%;
        height: auto;
      }
    }
    .progressBar-area {
      width: 90%;
      padding-left: 20px;
      padding-right: 20px;
      .progress-container {
        width: 100%;
        background-image: url("./images/bar-bg.png");
        border-radius: 30px;
        overflow: hidden;
        margin: 5px 0;
      }

      .progress-bar {
        width: 0%;
        height: 10px;
        background: linear-gradient(90deg, #23d2f0 0%, #9a7bff 100%);
        text-align: center;
        line-height: 30px;
        color: white;
        border-radius: 5px;
      }
    }
    .number-area {
      margin: 4px auto;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      flex-direction: row;
      justify-content: center;
      align-items: center;
      text-align: center;
      width: 85%;
      gap: 25px;
      font-size: 14px;
      color: #fff;
    }

    @media (min-width: 500px) {
      min-height: 220px;
    }
  }
}
.seciont2 {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .first {
    width: 100%;
    .title {
      background-image: url("./images/title1.png");
      background-repeat: no-repeat;
      width: 65px;
      height: 20px;
      margin-top: 15px;
    }
    .day-task {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      .task-content {
        color: #fff;
        background-image: url("./images/bg-3.png");
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
        width: 100%;
        min-height: 74px;
        aspect-ratio: 640/140;
        padding: 0 16px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-top: 15px;
        .task-left {
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          align-items: center;
        }
        .flex-item {
          font-size: 12px;

          @media (max-width: 400px) {
            display: flex;
            gap: 4px;
          }
        }
        .task-right {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .button {
            color: #fff;
            background: linear-gradient(90deg, #23d2f0 0%, #9a7bff 100%);
            width: 80px;
            height: 26px;
            border-radius: 8px;
            font-size: 12px;
          }
          .button-finish {
            color: #fff;
            background: linear-gradient(90deg, #23d2f0 0%, #9a7bff 100%);
            opacity: 0.6;
            width: 80px;
            height: 26px;
            border-radius: 8px;
            font-size: 12px;
          }
        }
      }
    }
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: column;
  }
}
.secend-rule {
  .title {
    font-size: 20px;
    width: 100%;
    height: 28px;
    margin-top: 16px;
    margin-bottom: 12px;
    text-align: center;
    color: #fff;
  }
  .text {
    color: #fff;
    font-size: 12px;
    margin-top: 8px;
    margin-bottom: 12px;
  }
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.dialog-header {
  width: 315px;
  height: 240px;
  background: transparent;
  background-image: url("./images/bg-4.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.dialog-header-2 {
  position: relative;
  width: 315px;
  height: 450px;
  padding: 0 24px;
  background: transparent;
  background-image: url("./images/bg-5.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .closeX {
    right: 10px;
    top: 6px;
    position: absolute;
  }
}
</style>
