<template>
  <div class="cs2">
    <div class="section first">
      <div class="title"><img src="../../../assets/images/promotion/hotpromo/cs2/fuli1.png" /></div>
      <div class="tips">
        参与CS Major2024当日投注金额100元注单结算后，次日可获得一个开箱钥匙，每投注100元即可获得一个钥匙。
      </div>
      <div class="content">
        <div class="top-row">
          <div class="lft">
            <img src="../../../assets/images/promotion/hotpromo/cs2/key.png" />
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
            <!-- <div v-for="i in items" :key="i" class="item" :class="{ active: activeItem === i }" @click="setActiveItem(i)">
                <img :src="require(`../../../assets/images/promotion/hotpromo/cs2/goldbox${i}.png`)" />
                <div class="requiredKey">钥匙*{{ getKeyAmt(i) }}</div>
            </div>
             -->
            <div
              v-for="(item, i) in items"
              :key="i"
              class="item"
              :class="{ active: activeItem === item.no }"
              @click="setActiveItem(item.no)"
            >
              <img
                v-if="item.treasureLevel"
                :src="require(`../../../assets/images/promotion/hotpromo/cs2/${item.treasureLevel}.png`)"
              />
              <div class="requiredKey">钥匙*{{ item.quantity }}</div>
            </div>
          </div>
          <div class="useKeys" @click="openBox(selectedTreasureLevel)">开启</div>

          <p class="tips-p">注：系统会在注单已结算后次日中午12点后统计所有记录，并自动派发钥匙</p>
        </div>
      </div>
    </div>
    <div class="section second">
      <div class="title"><img src="../../../assets/images/promotion/hotpromo/cs2/fuli2.png" /></div>
      <div class="tips">活动期间，连续投注 CS2Major 2024赛事≥1000元则视为签到成功，根据对应累计的签到天数开启宝箱</div>
      <div class="content">
        <div class="top-row">
          <div class="lft">
            <img src="../../../assets/images/promotion/hotpromo/cs2/gun.png" />
            签到天数：
            <span class="number">{{ signNumber }}</span>
          </div>
        </div>
        <div class="middle-row">
          <div class="sign-container">
            <div v-for="(day, i) in dayList" :key="i" class="item" :class="{ isDotted: !day.claimed && !day.toClaim }">
              <div class="signday">累计签到{{ day.no }}天</div>
              <img
                :style="i < 1 ? 'mix-blend-mode: luminosity;' : ''"
                :src="require(`../../../assets/images/promotion/hotpromo/cs2/car${i + 1}.png`)"
              />
              <div class="btn claimed" v-if="day.claimed">已开启</div>
              <div class="btn toClaim" v-if="day.toClaim" @click="openModal('claim', day, i)">&nbsp;</div>
              <div class="btn notComplete" v-if="!day.claimed && !day.toClaim">&nbsp;</div>
            </div>
          </div>
          <p class="tips-p">注：系统会在注单已结算后次日中午12点后统计所有记录，并自动统计签到日期</p>
        </div>
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
import { ElMessage, ElLoading } from "element-plus";

const props = defineProps(["promoCode"]);
const store = userStore();

const keyNumber = ref(0);
const signNumber = ref(0);
// const items = ref([{no:1}, {no:2}, {no:3}]);
// const activeItem = ref(2);

// const setActiveItem = (item) => {
//   activeItem.value = item;
//   reorderItems(item);
// };

// const reorderItems = (activeItem) => {
//   const index = items.value.indexOf(activeItem);
//   if (index !== -1) {
//     items.value.splice(index, 1); // Remove the active item from its current position
//     items.value.splice(1, 0, activeItem); // Insert the active item at the center
//   }
// };
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
  // var type = '';
  // if (item === 1) {
  //     type = 'Dragon'
  // }
  // if (item === 2) {
  //     type = 'Normal'
  // }
  // if (item === 3) {
  //     type = 'CS'
  // }
  openTreasure(props.promoCode, item).then((res) => {
    if (res.code === 0) {
      // Open Dialog
      openModal("amt", res.data);
      init();
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
  { no: 8, claimed: false, toClaim: false },
  { no: 10, claimed: false, toClaim: false }
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
        ElMessage.error(res.message);
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
  init();
});
</script>
<style lang="scss" scoped>
.cs2 {
  text-align: center;

  .title {
    margin: 0 auto;
  }

  .tips {
    background: url(../../../assets/images/promotion/hotpromo/cs2/bg-gradient.png) no-repeat center center;
    padding: 15px 0;
    margin: 0 auto;
    text-align: center;
    color: #7f4c00;
    font-weight: 700;
    font-family: Microsoft Yahei UI;
  }

  .content {
    max-width: 1300px;
    margin: 0 auto;
    padding: 20px;

    .top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .lft {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
        font-size: 20px;

        .number {
          color: #f38100;
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
          cursor: pointer;
          background: url(../../../assets/images/promotion/hotpromo/cs2/metal-btn.png) no-repeat center center;
          padding: 20px 40px;
          color: #ffffff;
          background-size: cover;
        }
      }
    }

    .middle-row {
      .item-container {
        display: flex;
        justify-content: space-around;
        margin-bottom: 50px;
      }

      .item {
        cursor: pointer;
        transform: scale3d(0.8, 0.8, 0.8);
        transition: transform 0.3s ease;

        &.active {
          transform: scale3d(1.2, 1.2, 1.2);
        }
      }

      .requiredKey {
        border: 2px solid #f38100;
        background: #f381001a;
        padding: 10px 15px;
        border-radius: 10px;
        width: 200px;
        color: #f38100;
        font-weight: bold;
        margin: 10px auto;
      }

      .useKeys {
        background: url(../../../assets/images/promotion/hotpromo/cs2/btnbg.png) no-repeat center center;
        color: #3d1600;
        padding: 20px 50px;
        width: 250px;
        background-size: cover;
        margin: 0 auto;
        font-weight: bold;
        font-size: 30px;
        cursor: pointer;
      }

      .sign-container {
        display: flex;
        justify-content: space-between;

        .item {
          img {
            width: 100%;
          }

          position: relative;

          .signday {
            background: #f381001a;
            border: 2px solid #f38100;
            color: #f38100;
            font-weight: bold;
            border-radius: 10px;
            display: inline-block;
            padding: 6px 30px;
            font-family: "Microsoft YaHei UI";
            font-size: 30px;
          }

          &.isDotted {
            &:after {
              border: 1px dotted #f38100;
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
            border: 1px solid #f38100;
            height: 0px;
            top: 7%;
            right: 90%;
            width: 45%;
          }
        }

        .btn {
          font-size: 24px;
          padding: 24px;
          font-weight: 700;
          font-family: "Microsoft Yahei UI";

          &.claimed {
            color: #999999;
            cursor: default;
          }

          &.toClaim {
            cursor: pointer;
            background: url(../../../assets/images/promotion/hotpromo/cs2/btnbg-open.png) no-repeat center center;
            background-size: cover;
            color: #3d1600;
          }

          &.notComplete {
            cursor: default;
            background: url(../../../assets/images/promotion/hotpromo/cs2/btnbg-close.png) no-repeat center center;
            background-size: cover;
            filter: grayscale(1);
          }
        }
      }
    }
  }

  .section {
    margin-bottom: 20px;

    &.first {
    }

    &.second {
    }
  }
}

.tips-p {
  margin-top: 10px;
  margin-bottom: 0px;
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
</style>
