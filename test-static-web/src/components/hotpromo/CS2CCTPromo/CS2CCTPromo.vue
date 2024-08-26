<template>
  <div class="cs2">
    <div class="section first">
      <div class="title"><img src="@/assets/images/promotion/hotpromo/CS2CCTPromo/section-1.png" /></div>
      <div class="tips">
        <div class="tips-inner">
          参与CCT全球总决赛当日投注金额100元注单结算后，次日可获得一个开箱钥匙，每投注100元即可获得一个钥匙。
        </div>
      </div>
      <div class="content">
        <div class="top-row">
          <div class="lft">
            <img src="@/assets/images/promotion/hotpromo/CS2CCTPromo/key.png" />
            钥匙数量：
            <span class="number">{{ keyNumber }}</span>
          </div>
          <div class="buttons">
            <div class="btn" @click="openModal('getkey')">获取记录</div>
            <div class="btn" @click="openModal('openchest')">开箱记录</div>
          </div>
        </div>
        <div class="middle-row">
          <div class="item-container">
            <div
              v-for="(item, i) in items"
              :key="i"
              class="item"
              :class="{ active: activeItem === item.no }"
              @click="setActiveItem(item.no)"
            >
              <img
                v-if="item.treasureLevel"
                :src="
                  require(`@/assets/images/promotion/hotpromo/CS2CCTPromo/treasure-level-${item.treasureLevel.toLowerCase()}.png`)
                "
              />
              <div v-else class="img-placeholder" />
              <div class="required-key">
                <img src="@/assets/images/promotion/hotpromo/CS2CCTPromo/key.png" />
                <span>x{{ item.quantity }}</span>
              </div>
            </div>
          </div>
          <div class="useKeys" @click="openBox(selectedTreasureLevel)">开启</div>
          <div class="tips-p">系统会在注单已结算后次日中午12点后统计所有记录，并自动派发钥匙</div>
        </div>
      </div>
    </div>
    <div class="section second">
      <div class="title"><img src="@/assets/images/promotion/hotpromo/CS2CCTPromo/section-2.png" /></div>
      <div class="tips">
        <div class="tips-inner">
          活动期间，连续投注CCT全球总决赛赛事≥1000元则视为签到成功，根据对应累计的签到天数开启宝箱
        </div>
      </div>
      <div class="content">
        <div class="top-row">
          <div class="lft">
            <img src="@/assets/images/promotion/hotpromo/CS2CCTPromo/gun.png" />
            签到天数：
            <span class="number">{{ signNumber }}</span>
          </div>
        </div>
        <div class="middle-row">
          <div class="sign-container">
            <div v-for="(day, i) in dayList" :key="i" class="item" :class="{ isDotted: !day.claimed && !day.toClaim }">
              <div class="item-inner">
                <div class="sign-day">连续签到{{ day.no }}天</div>
                <img :src="require(`@/assets/images/promotion/hotpromo/CS2CCTPromo/daily-bonus-${i + 1}.png`)" />
                <div class="btn claimed" v-if="day.claimed">已开启</div>
                <div class="btn to-claim" v-if="day.toClaim" @click="openModal('claim', day, i)">开启</div>
                <div class="btn not-complete" v-if="!day.claimed && !day.toClaim">未完成签到</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="section third">
      <div class="title"><img src="@/assets/images/promotion/hotpromo/CS2CCTPromo/section-3.png" /></div>
      <div class="content">
        <p>1.活动期间,每日报注CCT全球总决赛达到100元有效投注即可获得1个开箱钥匙,开箱钥匙与开箱次数每日不设上限;</p>
        <p>
          2.活动期间,开箱钥匙可积攒使用,获得开箱钥匙满足开箱条件可在活动期间任意时间开启宝箱,超出活动时间未开启宝箱则不予补偿;
        </p>
        <p>3.开启宝箱后获得彩金由系统自动实时派发至会员主钱包内,彩金3倍流水即可出款;</p>
        <p>
          4.活动期间,参与CCT全球总决赛有效投注≥1,000元则视为签到成功,达到指定签到天数则可开启签到宝箱,每个宝箱每位用户仅可开启一次;
        </p>
        <p>5.活动期间,若用户连续签到中断,则重新开始计算,已开启过的宝箱无法二次开启;</p>
        <p>6.同一手机号、姓名、邮箱地址、银行卡号等信息的游戏账号,仅可参与一次,若有违规者,将不享受此红利</p>
        <p>
          7.任何会员或团体以不正常的方式进行套取活动优惠,平台方保留在不通知的情况下冻结或关闭相关账户的权利,并不退还款项,且会员会被列入黑名单;
        </p>
        <p>8.为避免文字理解差异,本站保留本活动最终解释权</p>
      </div>
    </div>

    <el-dialog class="cs2Dialog" v-model="isKeyRecordModal" lock-scroll>
      <div class="modal-title">
        <img src="../../../assets/images/promotion/hotpromo/cs2/getkey.png" />
      </div>
      <div class="modal-body keyRec">
        <table>
          <tr>
            <th>日期</th>
            <th>数量</th>
          </tr>
        </table>
        <div class="rec">
          <table v-if="keyRecords && keyRecords.length > 0" class="table-rows">
            <tr v-for="(key, i) in keyRecords" :key="i">
              <td>{{ key.createTime }}</td>
              <td>
                <div class="keysAmt">
                  <img src="../../../assets/images/promotion/hotpromo/cs2/key.png" />
                  {{ key.quantity }}
                </div>
              </td>
            </tr>
          </table>
          <div v-else style="display: flex; justify-content: center; align-items: center; height: 400px">暂无数据</div>
        </div>
      </div>
    </el-dialog>

    <el-dialog class="cs2Dialog" v-model="isChestRecordModal" lock-scroll>
      <div class="modal-title">
        <img src="../../../assets/images/promotion/hotpromo/cs2/openchest.png" />
      </div>
      <div class="modal-body openRec">
        <div class="rec">
          <div class="table-title" style="width: 100%">
            <table style="width: 100%">
              <tr>
                <th width="50%">日期</th>
                <th width="25%">消耗</th>
                <th width="25%">获取金额</th>
              </tr>
            </table>
          </div>
          <table style="width: 100%" v-if="openRecords">
            <tr v-for="(open, i) in openRecords" :key="i">
              <td width="50%">{{ open.createTime }}</td>
              <td width="25%">{{ open.quantity }}</td>
              <td width="25%">{{ open.amount }}</td>
            </tr>
          </table>
          <div v-else style="display: flex; justify-content: center; align-items: center; height: 400px">暂无数据</div>
        </div>
      </div>
    </el-dialog>

    <el-dialog class="cs2Dialog" v-model="isClaimModal" lock-scroll>
      <div class="modal-title">
        <img src="../../../assets/images/promotion/hotpromo/cs2/congrats.png" />
      </div>
      <div class="modal-body">
        <div class="amt">
          <div class="coin"><img src="../../../assets/images/promotion/hotpromo/cs2/coin.png" /></div>
          <div class="value">{{ amountClaimed }}</div>
        </div>
        <div class="confirm" @click="claimModalClose">确定</div>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, onMounted, defineProps } from "vue";
import { userStore } from "@/store";
import {
  getTreasureDetail,
  getKeyCount,
  getCheckInRecord,
  openTreasure,
  getKeyRecord,
  getOpenRecord,
  claimCheckInTreasure
} from "@/api/index/promo";
import { ElLoading } from "element-plus";
import { useNotify } from "@/hooks/notify";

const props = defineProps(["promoCode"]);
const store = userStore();
const notify = useNotify();

const keyNumber = ref(0);
const signNumber = ref(0);
const items = ref([
  { no: 1, amt: 100 },
  { no: 2, amt: 10 },
  { no: 3, amt: 30 }
]);
const activeItem = ref(3);
const selectedTreasureLevel = ref("Dragon");

const setActiveItem = (itemNo) => {
  const item = items.value.find((i) => i.no === itemNo);
  if (item) {
    selectedTreasureLevel.value = item.treasureLevel;
    activeItem.value = item.no;
    reorderItems(item);
  }
};

const reorderItems = (activeItem) => {
  const index = items.value.findIndex((item) => item.no === activeItem.no);

  if (index !== -1) {
    items.value.splice(index, 1); // Remove the active item from its current position
    const middleIndex = Math.floor(items.value.length / 2);
    items.value.splice(middleIndex, 0, activeItem); // Insert the active item at the center
  }
};
const openBox = (item) => {
  const loading = ElLoading.service({
    lock: true,
    text: "开启中",
    background: "rgba(0, 0, 0, 0.7)"
  });

  openTreasure(props.promoCode, item).then((res) => {
    if (res.code === 0) {
      // Open Dialog
      openModal("amt", res.data);
      init();
    } else {
      notify({
        type: "error",
        message: res.message
      });
    }
  });
  setTimeout(() => {
    loading.close();
  }, 2000);
};
const claimModalClose = () => {
  isClaimModal.value = false;
  store.getBalance();
};

const checkInDetails = ref();
const dayList = ref([
  { no: 3, claimed: false, toClaim: false },
  { no: 5, claimed: false, toClaim: false },
  { no: 7, claimed: false, toClaim: false }
]);

const init = () => {
  getTreasureDetail(props.promoCode).then((res) => {
    if (res.code === 0) {
      res.data.forEach((element, i) => {
        element.no = i + 1;
      });
      items.value = res.data;
      setActiveItem(activeItem.value);
    }
  });
  // First Privilege
  getKeyCount(props.promoCode).then((res) => {
    if (res.code === 0) {
      keyNumber.value = res.data;
    }
  });
  //   Second Privilege
  getCheckInRecord(props.promoCode).then((res) => {
    if (res.code === 0) {
      checkInDetails.value = res.data;
      signNumber.value = checkInDetails.value.currentConsecutiveDay;
      dayList.value = [];
      checkInDetails.value.dayList.forEach((day) => {
        const obj = {
          no: day,
          claimed: false,
          toClaim: false
        };
        dayList.value.push(obj);
      });
      populateDayList(checkInDetails.value);
    }
  });
};
const populateDayList = (check) => {
  check.claimed.forEach((element) => {
    dayList.value.forEach((day) => {
      if (day.no === element) {
        day.claimed = true;
      }
    });
  });
  check.toClaim.forEach((element) => {
    dayList.value.forEach((day) => {
      if (day.no === element) {
        day.toClaim = true;
      }
    });
  });
};
const amountClaimed = ref(0);
const isClaimModal = ref(false);
// Dialogs
const isKeyRecordModal = ref(false);
const isChestRecordModal = ref(false);
const search = ref({
  current: 1,
  size: 20
});
const keyRecords = ref([]);
const openRecords = ref([]);

const openModal = (modal, item, itemIndex) => {
  if (modal === "getkey") {
    const loading = ElLoading.service({
      lock: true,
      text: "加载记录中",
      background: "rgba(0, 0, 0, 0.7)"
    });
    getKeyRecord(props.promoCode, search.value).then((res) => {
      if (res.code === 0) {
        keyRecords.value = res.data.records;
        isKeyRecordModal.value = true;
      }
    });
    setTimeout(() => {
      loading.close();
    }, 1000);
  }
  if (modal === "openchest") {
    const loading = ElLoading.service({
      lock: true,
      text: "加载记录中",
      background: "rgba(0, 0, 0, 0.7)"
    });
    getOpenRecord(props.promoCode, search.value).then((res) => {
      if (res.code === 0) {
        openRecords.value = res.data.records;
        isChestRecordModal.value = true;
      } else {
        notify.error(res.message);
      }
    });
    setTimeout(() => {
      loading.close();
    }, 1000);
  }
  if (modal === "amt") {
    isClaimModal.value = true;
    amountClaimed.value = item;
  }
  if (modal === "claim") {
    const loading = ElLoading.service({
      lock: true,
      text: "开启中",
      background: "rgba(0, 0, 0, 0.7)"
    });
    claimCheckInTreasure(props.promoCode, item.no).then((res) => {
      if (res.code === 0) {
        amountClaimed.value = res.data;
        isClaimModal.value = true;
        dayList.value[itemIndex].toClaim = false;
        dayList.value[itemIndex].claimed = true;
      }
    });
    setTimeout(() => {
      loading.close();
    }, 1000);
  }
};

// Reference
onMounted(() => {
  if (!store.token) {
    notify({
      message: "请登录后操作",
      type: "error"
    });
    return;
  }
  init();
});
</script>
<style lang="scss" scoped>
@mixin animation-btn {
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1, 1.1);
  }
}

.cs2 {
  text-align: center;
  position: relative;

  .title {
    margin: 0 auto 20px;
  }

  .tips {
    margin: 0 auto;
    text-align: center;
    color: #00d6d6;
    font-weight: 700;
    font-family: Microsoft Yahei UI;
    font-size: 20px;
    line-height: 28px;
    position: relative;
    margin-bottom: 36px;

    &::before,
    &::after {
      content: "";
      display: block;
      position: absolute;
      left: 0;
      right: 0;
      background: linear-gradient(90deg, rgba(#01f8f9, 0) 0%, rgba(#01f8f9, 50%) 50%, rgba(#01f8f9, 0) 100%) no-repeat
        center center;
      height: 2px;
    }

    &::before {
      top: 0;
    }

    & ::after {
      bottom: 0;
    }

    .tips-inner {
      background: linear-gradient(90deg, rgba(#01f8f9, 0) 0%, rgba(#01f8f9, 20%) 50%, rgba(#01f8f9, 0) 100%) no-repeat
        center center;
      padding: 22px 0;
    }
  }

  .content {
    max-width: 1300px;
    margin: 0 auto;
    padding: 20px;

    .top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      .lft {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
        font-size: 20px;
        color: $color-white;

        .number {
          color: #01f8f9;
          font-weight: 700;
          font-size: 25px;
        }

        img {
          height: 50px;
        }
      }

      .buttons {
        display: flex;
        gap: 10px;

        .btn {
          @include animation-btn;
          cursor: pointer;
          align-self: normal;
          font-size: 20px;
          padding: 12px 40px;
          font-weight: 700;
          line-height: 28px;
          font-family: "Microsoft Yahei UI";
          color: $color-white;
          background: url(@/assets/images/promotion/hotpromo/CS2CCTPromo/btn-active.png) no-repeat center center;
        }
      }
    }

    .middle-row {
      .item-container {
        display: flex;
        justify-content: space-around;
        margin-bottom: 50px;

        .item {
          width: 360px;
          display: flex;
          flex-direction: column;
          justify-items: center;
          align-items: center;
          gap: 16px;
          padding: 20px 0;
          background: url(@/assets/images/promotion/hotpromo/CS2CCTPromo/treasure-bg.png) no-repeat center center;
          cursor: pointer;

          .img-placeholder {
            width: 360px;
            height: 300px;
          }

          &.active,
          &:hover {
            background: url(@/assets/images/promotion/hotpromo/CS2CCTPromo/treasure-bg-active.png) no-repeat center
              center;
            color: #01f8f9;
          }
        }
      }

      .required-key {
        display: flex;
        gap: 12px;
        align-items: center;
        color: $color-white;
        font-family: PingFang SC;
        font-size: 36px;
        font-weight: 600;
        line-height: 50.4px;
      }

      .useKeys {
        @include animation-btn;
        background: url(@/assets/images/promotion/hotpromo/CS2CCTPromo/open-btn-bg.png) no-repeat center center;
        color: #003434;
        padding: 25px 50px;
        width: 340px;
        background-size: cover;
        margin: 0 auto;
        font-weight: bold;
        font-size: 30px;
        cursor: pointer;
      }

      .sign-container {
        display: flex;
        justify-content: space-evenly;

        .item {
          position: relative;

          img {
            width: 100%;
          }

          .item-inner {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 24px;

            .sign-day {
              width: 180px;
              height: 60px;
              background: url(@/assets/images/promotion/hotpromo/CS2CCTPromo/daily-bonus-title.png) no-repeat;
              background-size: cover;
              padding: 0 20px;
              border-radius: 0;
              color: #01f8f9;
              font-weight: bold;
              font-family: "Microsoft YaHei UI";
              font-size: 20px;
              line-height: 60px;
              margin-bottom: 8px;
            }
          }

          &.isDotted {
            &:after {
              border: 1px solid #01f8f9;
            }
          }

          &:first-child {
            &:after {
              display: none;
            }
          }

          &:after {
            content: "";
            position: absolute;
            // background: #f38100;
            border: 1px solid #01f8f9;
            height: 0px;
            top: 7%;
            left: -50%;
            width: 25%;
          }
        }

        .btn {
          align-self: normal;
          font-size: 20px;
          padding: 24px;
          font-weight: 700;
          font-family: "Microsoft Yahei UI";
          color: $color-white;
          background: url(@/assets/images/promotion/hotpromo/CS2CCTPromo/btn.png) no-repeat center center;

          &.claimed,
          &.not-complete {
            cursor: default;
          }

          &.to-claim {
            @include animation-btn;
            cursor: pointer;
            background: url(@/assets/images/promotion/hotpromo/CS2CCTPromo/btn-active.png) no-repeat center center;
          }
        }
      }
    }
  }

  .section {
    margin-bottom: 30px;

    &.first {
    }

    &.second {
    }

    &.third {
      color: #00dede;

      .content {
        text-align: left;
      }
    }
  }
}

:deep(.cs2Dialog) {
  width: 760px;

  .el-dialog__header .el-dialog__headerbtn {
    background: url(../../../assets/images/promotion/hotpromo/cs2/close.png);
    content-visibility: hidden;
    top: 130px;
    right: 50px;
    background-size: contain;
  }

  background: transparent;
  box-shadow: none;

  .modal-title {
    background: url(../../../assets/images/promotion/hotpromo/cs2/star.png) no-repeat center center;

    img {
      filter: brightness(100);
    }
  }

  .modal-body {
    background: url(../../../assets/images/promotion/hotpromo/cs2/dialogbg.png) no-repeat center center;
    width: 100%;
    height: 470px;
    background-size: contain;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    &.keyRec {
      .rec {
        &::-webkit-scrollbar {
          width: 5px;
          height: 8px;
          background-color: #ffffff;
        }

        &::-webkit-scrollbar-thumb {
          background: #ffd4b3;
        }

        width: 90%;
        margin: 0 auto;
        height: 300px;
        display: flex;
        flex-direction: column;
        gap: 15px;
        overflow: auto;
        justify-content: flex-start;
        align-items: center;
      }

      color: #7f4c00;
      font-size: 20px;

      table {
        width: 100%;

        .keysAmt {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          color: #f38100;
          font-weight: bold;

          img {
            height: 40px;
          }
        }

        tr td {
          width: 50%;
          padding: 10px 0;
        }
      }
    }

    &.openRec {
      .table-title {
        font-weight: 700;
      }

      .rec {
        &::-webkit-scrollbar {
          width: 5px;
          height: 8px;
          background-color: #ffffff;
        }

        &::-webkit-scrollbar-thumb {
          background: #ffd4b3;
        }

        width: 90%;
        margin: 0 auto;
        height: 300px;
        display: flex;
        flex-direction: column;
        gap: 15px;
        overflow: auto;
        justify-content: flex-start;
        align-items: center;
      }

      color: #7f4c00;
      font-size: 24px;
      gap: 15px;

      .flex {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 80%;

        .openSuccess {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 25px;
        }
      }
    }
  }

  .amt {
    display: flex;
    justify-content: center;
    align-items: center;

    .coin {
      background: url(../../../assets/images/promotion/hotpromo/cs2/coin.png) no-repeat center center;
      margin-left: -100px;
    }

    .value {
      color: #420505;
      font-size: 68px;
      font-weight: 800;
    }
  }

  .confirm {
    background: url(../../../assets/images/promotion/hotpromo/cs2/dialogbtn.png) no-repeat center -15px;
    color: #7f4c00;
    font-size: 32px;
    padding: 15px 100px;
    cursor: pointer;
  }
}

.tips-p {
  margin-top: 24px;
  color: #17c7ff;
  font-size: 24px;
  font-weight: 700;
}
</style>
