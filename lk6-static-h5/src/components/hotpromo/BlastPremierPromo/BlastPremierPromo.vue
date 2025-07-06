<template>
  <div class="cs2">
    <div class="section first">
      <div class="title">
        <img class="logo" src="../../../assets/images/promo/hotpromo/blastpremier/spring-logo.png" />
        <img class="top" src="../../../assets/images/promo/hotpromo/blastpremier/section-1-spring.png" />
      </div>
      <div class="tips">
        <div class="tips-inner">活动时间：2024年07月29日—2024年08月06日</div>
        <div class="tips-inner">
          参与BLAST Premier 秋季小组赛当日投注金额100元注单结算后，次日可获得一个开箱钥匙，每投注100元即可获得一个钥匙.
        </div>
      </div>
      <div class="title">
        <img class="bottom" src="../../../assets/images/promo//hotpromo/blastpremier/section-bottom.png" />
      </div>
      <div class="content">
        <div class="top-row">
          <div class="lft">
            <img src="../../../assets/images/promo/hotpromo/blastpremier/key.png" />
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
            <!-- <div
              v-for="(item, i) in items"
              :key="i"
              class="item"
              :class="{ active: activeItem === item.no }"
              @click="setActiveItem(item.no)"
            > -->
            <div v-for="(item, i) in items" :key="i" class="item">
              <img
                v-if="item.treasureLevel"
                :src="
                  require(`../../../assets/images/promo/hotpromo/blastpremier/treasure-level-${item.treasureLevel.toLowerCase()}.png`)
                "
              />
              <div v-else class="img-placeholder" />
              <div class="required-key">
                <img src="../../../assets/images/promo/hotpromo/blastpremier/key.png" />
                <span>x{{ item.quantity }}</span>
              </div>
              <div class="use-Keys" @click="openBox(item.treasureLevel)">开启</div>
            </div>
          </div>
          <!-- <div class="tips-p" style="margin-top: 10px">
            系统会在注单已结算后次日中午12点后统计所有记录，并自动派发钥匙
          </div> -->
        </div>
      </div>
      <div class="tips">
        <div class="tips-inner">系统会在注单已结算后次日中午12点后统计所有记录，并自动派发钥匙。</div>
      </div>
    </div>
    <div class="section second">
      <div class="title">
        <img class="top" src="../../../assets/images/promo/hotpromo/blastpremier/section-1-spring.png" />
      </div>
      <div class="tips">
        <div class="tips-inner">
          活动期间,连续投注BLAST Premier 秋季小组赛≥1000元则视为签到成功,根据对应累计的签到天数开启宝箱。
        </div>
      </div>
      <div class="title">
        <img class="bottom" src="../../../assets/images/promo//hotpromo/blastpremier/section-bottom.png" />
      </div>
      <div class="content">
        <div class="top-row">
          <div class="lft">
            <!-- <img src="../../../assets/images/promo/hotpromo/blastpremier/gun.png" />
            签到天数：
            <span class="number">{{ signNumber }}</span> -->
            <div class="item">
              <div class="item-inner">
                <img :src="require(`../../../assets/images/promo/hotpromo/blastpremier/daily-bonus-spring.png`)" />
                <div class="sec-col">
                  <img :src="require(`../../../assets/images/promo/hotpromo/blastpremier/daily-bonus-premier.png`)" />

                  <div class="sign-day">
                    签到天数：
                    <span class="number">{{ signNumber }}</span>
                  </div>
                </div>
                <!-- <div class="btn not-complete">未完成签到</div> -->
              </div>
            </div>
          </div>
        </div>
        <div class="middle-row">
          <div class="sign-container">
            <div v-for="(day, i) in dayList" :key="i" class="item" :class="{ isDotted: !day.claimed && !day.toClaim }">
              <img :src="require(`../../../assets/images/promo/hotpromo/blastpremier/daily-bonus-${i + 1}.png`)" />
              <div class="sign-day">累计签到 {{ day.no }} 天</div>
              <div class="btn claimed" v-if="day.claimed">已开启</div>
              <div class="btn to-claim" v-if="day.toClaim" @click="openModal('claim', day, i)">开启</div>
              <div class="btn not-complete" v-if="!day.claimed && !day.toClaim">未完成签到</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="section third">
      <div class="title"><img src="../../../assets/images/promo/hotpromo/blastpremier/section-3-spring.png" /></div>
      <div class="content">
        <p>
          1. 活动期间,每日投注电竞场馆的BLAST Premier
          秋季小组赛达到100元有效投注即可获得1个开箱钥匙,开箱钥匙与开箱次数每日不设上限；
        </p>
        <p>
          2.
          活动期间,开箱钥匙可积攒使用,获得开箱钥匙满足开箱条件可在活动期间任意时间开启宝箱,超出活动时间未开启宝箱则不予补偿；
        </p>
        <p>
          3.任何低于欧洲盘 1.7 或亚洲盘 0.7
          水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投注额内；
        </p>
        <p>
          4. 活动期间,参与BLAST Premier
          秋季小组赛当日有效投注≥1,000元则视为签到成功,达到指定签到天数则可开启签到宝箱,每个签到宝箱每位用户仅可开启一次；
        </p>
        <p>
          5.
          活动期间，开启宝箱后获得彩金由系统自动实时派发至会员主钱包内.彩金3倍流水即可出款，若用户连续签到中断,则重新开始计算,已开启过的签到宝箱无法二次开启；
        </p>
        <p>6. 同一手机号、姓名、邮箱地址、银行卡号等信息的游戏账号,仅可参与一次,若有违规者,将不享受此红利；</p>
        <p>
          7.
          任何会员或团体以不正常的方式进行套取活动优惠,平台方保在不通知的情况下冻结或关闭相关账户的权利,并不退还款项,且会员会被列入黑名单；
        </p>
        <p>8. 为避免文字理解差异,本站保留本活动最终解释权；</p>
      </div>
    </div>

    <q-dialog width="100%" class="cs2Dialog" v-model="isKeyRecordModal" persistent>
      <div>
        <div class="modal-title">
          <img src="../../../assets/images/promo/hotpromo/cs2/getkey.png" />
        </div>
        <div class="modal-body keyRec">
          <div class="dialog-close">
            <q-btn
              @click="isKeyRecordModal = false"
              v-close-popup
              class="close-btn"
              icon="close"
              height="30"
              width="30"
            ></q-btn>
          </div>
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
                    <img src="../../../assets/images/promo/hotpromo/cs2/key.png" />
                    {{ key.quantity }}
                  </div>
                </td>
              </tr>
            </table>
            <div v-else style="display: flex; justify-content: center; align-items: center; height: 130px">
              暂无数据
            </div>
          </div>
        </div>
      </div>
    </q-dialog>

    <q-dialog width="100%" class="cs2Dialog" v-model="isChestRecordModal" persistent>
      <div>
        <div class="modal-title">
          <img src="../../../assets/images/promo/hotpromo/cs2/openchest.png" />
        </div>
        <div class="modal-body openRec">
          <div class="dialog-close">
            <q-btn
              @click="isChestRecordModal = false"
              v-close-popup
              class="close-btn"
              icon="close"
              height="30"
              width="30"
            ></q-btn>
          </div>

          <table style="min-width: 300px; width: 85%">
            <tr>
              <th width="34%">日期</th>
              <th width="33%">消耗</th>
              <th width="33%">获取金额</th>
            </tr>
          </table>
          <div class="rec">
            <table style="text-align: center" v-if="openRecords && openRecords.length > 0" class="table-rows">
              <tr v-for="(open, i) in openRecords" :key="i">
                <td width="34%">{{ open.createTime }}</td>
                <td width="33%">{{ open.quantity }}</td>
                <td width="33%">{{ open.amount }}</td>
              </tr>
            </table>
            <div v-else style="display: flex; justify-content: center; align-items: center; height: 130px">
              暂无数据
            </div>
          </div>
        </div>
      </div>
    </q-dialog>

    <q-dialog width="100%" class="cs2Dialog" v-model="isClaimModal" persistent>
      <div>
        <div class="modal-title">
          <img src="../../../assets/images/promo/hotpromo/cs2/congrats.png" />
        </div>
        <div class="modal-body">
          <div class="dialog-close">
            <q-btn
              @click="claimModalClose"
              v-close-popup
              rounded
              class="close-btn"
              icon="close"
              height="30"
              width="30"
            ></q-btn>
          </div>
          <div class="amt">
            <div class="coin"><img src="../../../assets/images/promo/hotpromo/cs2/coin.png" /></div>
            <div class="value">{{ amountClaimed }}</div>
          </div>
          <div class="confirm" @click="claimModalClose">确定</div>
        </div>
      </div>
    </q-dialog>
  </div>
</template>
<script setup>
import { ref, onMounted, defineProps } from "vue";
import { userStore } from "../../../stores/index";
import {
  getTreasureDetail,
  getKeyCount,
  getCheckInRecord,
  openTreasure,
  getKeyRecord,
  getOpenRecord,
  claimCheckInTreasure
} from "../../../api/index/promo";
// import { ElMessage, ElLoading } from "element-plus";
import { useQuasar } from "quasar";
const props = defineProps(["promoCode"]);
const store = userStore();
const $q = useQuasar();

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
  console.log(activeItem.no);
  const index = items.value.findIndex((item) => item.no === activeItem.no);

  if (index !== -1) {
    items.value.splice(index, 1); // Remove the active item from its current position
    const middleIndex = Math.floor(items.value.length / 2);
    items.value.splice(middleIndex, 0, activeItem); // Insert the active item at the center
  }
};
const openBox = (item) => {
  $q.loading.show({
    message: "开启中... 请稍等..."
  });
  openTreasure(props.promoCode, item).then((res) => {
    if (res.code === 0) {
      // Open Dialog
      openModal("amt", res.data);
      init();
    }
    $q.loading.hide();
  });
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
    $q.loading.show({
      message: "加载记录中... 请稍等..."
    });
    getKeyRecord(props.promoCode, search.value).then((res) => {
      if (res.code === 0) {
        keyRecords.value = res.data.records;
        isKeyRecordModal.value = true;
      }
    });
    setTimeout(() => {
      $q.loading.hide();
    }, 1000);
  }
  if (modal === "openchest") {
    $q.loading.show({
      message: "加载记录中... 请稍等..."
    });
    getOpenRecord(props.promoCode, search.value).then((res) => {
      if (res.code === 0) {
        openRecords.value = res.data.records;
        isChestRecordModal.value = true;
      }
    });
    setTimeout(() => {
      $q.loading.hide();
    }, 1000);
  }
  if (modal === "amt") {
    isClaimModal.value = true;
    amountClaimed.value = item;
  }
  if (modal === "claim") {
    $q.loading.show({
      message: "开启中... 请稍等..."
    });
    $q.loading.hide();
    claimCheckInTreasure(props.promoCode, item.no).then((res) => {
      if (res.code === 0) {
        amountClaimed.value = res.data;
        isClaimModal.value = true;
        dayList.value[itemIndex].toClaim = false;
        dayList.value[itemIndex].claimed = true;
      }
      $q.loading.hide();
    });
  }
};

// Reference
onMounted(() => {
  if (!store.token) {
    return;
  }
  init();
});
</script>
<style lang="scss" scoped>
.cs2 {
  text-align: center;
  .title {
    margin: 10px auto;
    img {
      margin: 0 auto;
      &.logo {
        max-width: 150px;
      }
      &.top {
        max-width: 250px;
      }
    }
  }

  .tips {
    color: #fffd66;
    margin: 0 auto;
    text-align: center;
    // color: #00d6d6;
    // font-weight: 700;
    // font-family: Microsoft Yahei UI;
    // position: relative;

    // &::before,
    // &::after {
    //   content: "";
    //   display: block;
    //   position: absolute;
    //   left: 0;
    //   right: 0;
    //   background: linear-gradient(90deg, rgba(#FFFD66, 0) 0%, rgba(#FFFD66, 50%) 50%, rgba(#FFFD66, 0) 100%) no-repeat
    //     center center;
    //   height: 1px;
    // }

    // &::before {
    //   top: 0;
    // }

    // & ::after {
    //   bottom: 0;
    // }

    .tips-inner {
      // background: linear-gradient(90deg, rgba(#FFFD66, 0) 0%, rgba(#FFFD66, 20%) 50%, rgba(#FFFD66, 0) 100%) no-repeat
      //   center center;
      // padding: 6px 30px;
    }
  }
  .second .content {
    display: flex;
    flex-direction: column;
    background: url(../../../assets/images/promo/hotpromo/blastpremier/middle-row.png) no-repeat center center;
    background-size: 100% 100%;
    padding: 20px 0;
    justify-content: center;
    gap: 20px;
    align-items: center;
    .top-row {
      margin: 0 auto;
      width: 90%;
      .lft {
        width: 100%;
        .btn {
          background: url(../../../assets/images/promo/hotpromo/blastpremier/btn.png) no-repeat center center;
          padding: 10px;
          font-size: 14px;
          font-weight: 500;
          font-family: "Microsoft Yahei UI";
          color: $white;
          background-size: contain;
          width: 85%;
          margin: 0 auto;
          flex: 3;

          &.claimed,
          &.not-complete {
            cursor: default;
          }

          &.to-claim {
            cursor: pointer;
            background: url(../../../assets/images/promo/hotpromo/blastpremier/btn-active.png) no-repeat center center;
            background-size: contain;
          }
        }
        .item {
          width: 100%;
          padding-bottom: 20px;
          border-bottom: 1px solid #fffd66;

          .item-inner {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 30px;
            .sec-col {
              flex: 2;
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              align-items: flex-start;
              gap: 10px;
              img {
                max-width: 130px;
              }
              .sign-day {
                color: #fffd66;
                font-weight: bold;
              }
            }
            img {
              max-width: 120px;
              width: 100%;
              flex: 1;
            }
          }
        }
      }
    }
  }
  .first .content .top-row {
    background: url(../../../assets/images/promo/hotpromo/blastpremier/container.png) no-repeat center center;
    background-size: contain;
  }
  .content {
    margin: 10px auto;
    .top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      .lft {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
        font-size: 14px;
        color: $white;
        .number {
          color: #fffd66;
          font-weight: 700;
          font-size: 17px;
        }
        img {
          width: 46px;
          margin: 0;
        }
      }
      .buttons {
        display: flex;
        gap: 10px;
        .btn {
          cursor: pointer;
          // background: url(../../../assets/images/promo/hotpromo/blastpremier/btn-active.png) no-repeat center center;
          padding: 5px 20px;
          color: #fffd66;
          background-size: cover;
        }
      }
    }
    .middle-row {
      .item-container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 6px;
        justify-content: space-evenly;
        margin: 25px auto;

        // @media (max-width: 400px){
        //   grid-template-columns: repeat(2, 1fr);
        // }

        .item {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 6px;
          background: url(../../../assets/images/promo/hotpromo/blastpremier/treasure-bg.png) no-repeat center center;
          background-size: 100% 100%;

          img {
            margin-bottom: 0;
            width: 80%;
            margin: 20px auto 0;
          }

          .img-placeholder {
            width: 165px;
            height: 137px;
          }

          &.active {
            background: url(../../../assets/images/promo/hotpromo/blastpremier/treasure-bg-active.png) no-repeat center
              center;
            color: #fffd66;
            background-size: 100% 100%;

            @media (max-width: 400px) {
              order: -1;
            }
          }
        }
      }

      .required-key {
        display: flex;
        align-items: center;
        padding: 5px 10px;
        margin: 10px auto;
        font-weight: bold;
        color: $white;
        height: 15px;
      }

      .use-Keys {
        background: url(../../../assets/images/promo/hotpromo/blastpremier/open-btn-bg.png) no-repeat center center;
        color: #003434;
        padding: 15px 15px;
        background-size: contain;
        margin: 0 auto;
        font-weight: bold;
        font-size: 12px;
        cursor: pointer;
        width: 90%;
      }
      .sign-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        justify-content: space-around;
        gap: 20px;
        width: 85%;
        margin: 0 auto;
        // margin: 25px auto;

        @media (max-width: 375px) {
          grid-template-columns: repeat(2, 1fr);
        }

        .item {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          gap: 12px;

          img {
            width: 100%;
            margin-bottom: 0;
          }

          .sign-day {
            color: #fffd66;
            padding: 8px 12px;
            // background: url(../../../assets/images/promo/hotpromo/blastpremier/daily-bonus-title.png) no-repeat center
            //   center;
            font-weight: bold;
            font-family: "Microsoft YaHei UI";
            font-size: 14px;
            line-height: 19.6px;
          }

          &:first-child {
            &:after {
              display: none;
            }
          }
          &:after {
            content: "";
            position: absolute;
            height: 0px;
            top: 7%;
            right: 90%;
            width: 45%;
          }
        }
        .btn {
          background: url(../../../assets/images/promo/hotpromo/blastpremier/btn.png) no-repeat center center;
          padding: 10px;
          align-self: normal;
          font-size: 14px;
          font-weight: 500;
          font-family: "Microsoft Yahei UI";
          color: $white;
          background-size: contain;
          width: 85%;
          margin: 0 auto;

          &.claimed,
          &.not-complete {
            cursor: default;
          }

          &.to-claim {
            cursor: pointer;
            background: url(../../../assets/images/promo/hotpromo/blastpremier/btn-active.png) no-repeat center center;
            background-size: contain;
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
      background: url(../../../assets/images/promo/hotpromo/blastpremier/rules-bg.png) no-repeat center center;
      background-size: 100% 100%;
      padding: 20px;

      color: #b5a73b;
      text-align: left;
      img {
        max-width: 120px;
        margin: 0px auto;
      }
    }
  }
}
.cs2Dialog {
  max-width: 500px;
}
.q-dialog__inner--minimized > div .dialog-close {
  background: url(../../../assets/images/promo/hotpromo/cs2/close.png) no-repeat center center;
  top: 10px;
  right: 7px;
  background-size: contain;
  position: absolute;
  .q-btn {
    content-visibility: hidden;
    width: 24px;
    height: 24px;
    padding: 0px;
  }
}
.modal-title {
  background: url(../../../assets/images/promo/hotpromo/cs2/star.png) no-repeat center center;
  background-size: contain;
  text-align: center;
  img {
    filter: brightness(100);
    width: 60%;
    margin: 0 auto;
  }
}
.modal-body {
  position: relative;
  background: url(../../../assets/images/promo/hotpromo/cs2/dialogbg.png) no-repeat center top;
  // width: 90vw;
  // max-width: 500px;
  width: 350px;
  height: 300px;
  background-size: contain;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  font-size: 16px;
  padding-top: 30px;
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
      width: 98%;
      margin: 0 auto;
      height: 140px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      overflow: auto;
      justify-content: flex-start;
      align-items: center;
    }
    color: #7f4c00;
    table {
      width: 100%;
      .keysAmt {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
        color: #f38100;
        font-weight: bold;
        img {
          height: 25px;
        }
      }
      tr td {
        width: 50%;
        padding: 5px 0;
        text-align: center;
      }
    }
  }
  &.openRec {
    justify-content: flex-start;
    padding: 25px 0;
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
      height: 140px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      overflow: auto;
      justify-content: flex-start;
      align-items: center;
    }
    color: #7f4c00;
    gap: 5px;
    .flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 95%;
      flex-wrap: unset;
      .openSuccess {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 25px;
        img {
          height: 20px;
        }
      }
    }
  }
}
.amt {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: -35px;
  margin-bottom: -25px;
  .coin {
    flex: 6;

    img {
      width: 100%;
    }
  }
  .value {
    color: #420505;
    font-size: 3rem;
    font-weight: 800;
    flex: 4;
  }
}
.confirm {
  background: url(../../../assets/images/promo/hotpromo/cs2/dialogbtn.png) no-repeat center -8px;
  color: #7f4c00;
  font-size: 1.5rem;
  padding: 12px 80px;
  font-weight: 800;
  cursor: pointer;
  background-size: cover;
}

.tips-p {
  color: #17c7ff;
  font-size: 12px;
  font-weight: 600;
  line-height: 20px;
}
</style>
