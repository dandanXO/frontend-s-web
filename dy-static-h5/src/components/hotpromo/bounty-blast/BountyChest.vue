<template>
  <div class="cs2">
    <div class="livepoker-rebate-game-info section-bg section first">
      <div class="title-img">箱开福来</div>
      <!-- <div class="tips">
        <div class="tips-inner">活动时间：2025年1月14日至2025年1月26日</div>
        <div class="tips-inner">
          参与BLAST Premier 赏金赛当日投注金额500元且注单结算后，次日可获得一个开箱钥匙，每投注500元即可获得一个钥匙。
        </div>
      </div>
      <div class="title">
        <img class="bottom" src="../../../assets/images/promo//hotpromo/blastbounty/section-bottom.png" />
      </div> -->
      <div class="content">
        <div class="top-row">
          <div class="top-row-inner">
            <div class="lft">
              <img src="../../../assets/images/promo//hotpromo/blastbounty/key.png" />
              钥匙数量：
              <span class="number">{{ keyNumber }}</span>
            </div>
            <div class="buttons">
              <div class="btn" @click="openModal('getkey')">获取记录</div>
              <div class="btn" @click="openModal('openchest')">开箱记录</div>
            </div>
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
                  require(`../../../assets/images/promo//hotpromo/blastbounty/treasure-level-${item.treasureLevel.toLowerCase()}.png`)
                "
              />
              <div v-else class="img-placeholder" />
              <div class="required-key">
                <div class="top">{{ getTreasureDescription(item.treasureLevel) }}</div>
                <div class="container-description">
                  <!-- <span>开启一次所需钥匙：</span> -->
                </div>
                <div class="key-container">
                  <img src="../../../assets/images/promo//hotpromo/blastbounty/key.png" />
                  <span>x{{ item.quantity }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- <div class="tips-p">系统会在注单已结算后次日中午12点后统计所有记录，并自动派发钥匙</div> -->
        </div>
      </div>
      <div class="useKeys" @click="openBox(selectedTreasureLevel)">点击开启</div>
      <!-- <div class="tips">
        <div class="tips-inner">系统会在注单已结算后次日中午12点后统计所有记录，并自动派发钥匙。</div>
      </div> -->
    </div>
    
    <div class="livepoker-rebate-game-info section-bg section third">
      <div class="title-img">活动详情</div>
      <div class="content">
        <div class="little-title">
          <div class="left">活动时间</div>
          <div class="right">2025年8月05日至2025年8月17日</div>
        </div>
        <div class="little-title">
          <div class="left">活动内容</div>
          <div class="right">参与BLAST赏金赛第二赛季当日投注金额500元且注单结算后，次日可获得一个开箱钥匙，每投注500元即可获得一个钥匙。</div>
        </div>
      </div>
    </div>
    <div class="livepoker-rebate-game-bottom-rule section-bg section third">
       <div class="title-img">活动规则</div>
      
      <div class="content">
        <div class="item">
          <div class="item-num">1</div>
          <div style="display: flex; flex-direction: column">
            活动期间，每日投注 BLAST 赏金赛第二赛季达到 500 元有效投注，即可在次日 12:00 点自动获得 1 个开箱钥匙，开箱钥匙与开箱次数每日不设上限；
            <div class="hint">注：开箱钥匙可累积使用，仅限活动期间开启，逾期未开启不予补偿。</div>
          </div>
        </div>
        <div class="item">
          <div class="item-num">2</div>
          开启宝箱后获得彩金由系统自动实时派发至会员主钱包内，彩金 5 倍流水即可出款；
        </div>
        <div class="item">
          <div class="item-num">3</div>
          活动期间，仅计算当日投注 BLAST 赏金赛第二赛季已结算的注单；当日存款 ≥500 元且有效投注 ≥1,000 元的会员，可在次日 24 小时内于活动页面点击【立即领取】按钮领取签到奖金，逾期未领取视为放弃，彩金 8 倍流水即可出款；
        </div>
        <div class="item">
          <div class="item-num">4</div>
          同一手机号、姓名、邮箱地址、银行卡号等信息视为同一账户，每位会员仅可参与一次；若发现违规行为，将不享受此红利；
        </div>
        <div class="item">
          <div class="item-num">5</div>
          任何会员或团体以不正常的方式进行套取活动优惠，平台方保留在不通知的情况下冻结或关闭相关账户的权利，且不退还款项，并将会员列入黑名单；
        </div>
        <div class="item">
          <div class="item-num">6</div>
          为避免文字理解差异，本站保留本活动最终解释权；
        </div>
      </div>
    </div>

    <q-dialog width="100%" class="cs2Dialog" v-model="isKeyRecordModal" persistent>
      <div>
        <div class="modal-title">
          <img src="../../../assets/images/promo/hotpromo/blastbounty/getkey.png" />
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
                    <img src="../../../assets/images/promo/hotpromo/blastbounty/key.png" />
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
          <img src="../../../assets/images/promo/hotpromo/blastbounty/openchest.png" />
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
          <img src="../../../assets/images/promo/hotpromo/blastbounty/congrats.png" />
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
            <div class="coin"><img src="../../../assets/images/promo/hotpromo/blastbounty/coin.png" /></div>
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
const getTreasureDescription = (treasureLevel) => {
  if (treasureLevel === "NORMAL") {
    return "普通宝箱";
  } else if (treasureLevel === "CS") {
    return "CS宝箱";
  } else if (treasureLevel === "DRAGON") {
    return "龙宝箱";
  }
};
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
        margin-bottom: 10px;
      }
      &.top {
        max-width: 250px;
      }
    }
  }

  .useKeys {
    // background: url(@/assets/images/promotion/hotpromo/blastpremier/open-btn-bg.png) no-repeat center center;
    background: linear-gradient(180deg, #73b2ff, #3981ff);
    background-size: cover;
    border-radius: 20px;
    color: #fff;
    cursor: pointer;
    font-size: 14px;
    font-weight: 700;
    margin: 0 auto 10px;
    padding: 4px 25px;
    width: 120px;
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
    background: url(../../../assets/images/promo/hotpromo/blastbounty/middle-row.png) no-repeat center center;
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
          background: url(../../../assets/images/promo/hotpromo/blastbounty/btn.png) no-repeat center center;
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
            background: url(../../../assets/images/promo/hotpromo/blastbounty/btn-active.png) no-repeat center center;
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
    .middle-row {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  .first .content .top-row {
    // background: url(../../../assets/images/promotion/hotpromo/blastpremier/container.png) no-repeat center center;
    // background-size: contain;
    background: linear-gradient(180deg, #93F2FF 3.39%, #3A69F7 100%);
    border-radius: 15px;
    border: 2px solid #94BAF8;
    padding: 4px;
      margin-bottom: 15px;
    &-inner {
        background: linear-gradient(180deg, #FAFCFF 31.57%, #E3EAF8 54.21%, rgba(202, 211, 239, 0.6) 100%);
        border: 2px solid #9FA9D0;
        width: 100%;
        border-radius: 15px;
    }
  }
  .content {
    max-width: 1300px;
    margin: 0 auto;
    padding: 20px 0px 10px 0px;
    width: 100%;

    .top-row-inner {
      padding: 9px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .lft {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
        font-size: 14px;
        color:#333333;
        font-weight: 600;
        .number {
          color: #00A1FF;
          font-weight: 700;
          font-size: 17px;
        }
        img {
          width: 25px;
          margin: 0;
        }
      }

      .buttons {
        display: flex;
        gap: 10px;

        .btn {
          cursor: pointer;
          font-family: "PingFang SC";
          color: #00A1FF;
          font-size: 14px;
          font-weight: 600;
          // color: $color-white;
          &:first-of-type {
            color: #000000;
          }

          // background: url(../../../assets/images/promo/hotpromo/blastbounty/btn-active.png) no-repeat center center;
        }
      }
    }
    .middle-row {
      .item-container {
        display: flex;
        justify-content: space-around;
        max-width: 1280px;
        margin: 0 auto;
        // margin-bottom: 50px;

        .item {
          width: 100px;
          height: 100px;
          padding: 0;
          display: flex;
          flex-direction: column;
          justify-items: center;
          align-items: center;
          gap: 16px;
          position: relative;
          // padding: 10px 0;
          background: url(../../../assets/images/promo/hotpromo/blastbounty/global-treasure-bg.png) no-repeat center
            center;
          background-size: contain;
          cursor: pointer;
          transition: background-image 0.3s ease, transform 0.3s ease;
          filter: brightness(0.5);
          // .img-placeholder {
          //   width: 360px;
          //   height: 300px;
          // }

          > img {
            // width: 155px;
            // height: 140px;
            // margin-top: 45px;
    width: 60%;
    margin-top: 22%;
    margin-bottom: -25px;
          }

          &.active {
            background: url(../../../assets/images/promo/hotpromo/blastbounty/global-treasure-bg-active.png) no-repeat
              center center;
              
          background-size: contain;
            transform: scale(1.2);
            filter: brightness(1);
            .required-key {
              // color: #fffd66;
            }
          }
        }
      }

      .required-key {
        display: flex;
        align-items: center;
        color: #ffffff;
        font-family: PingFang SC;
        font-size: 25px;
        font-weight: 600;
        line-height: 38.4px;
        height: 50px;
        width: 100%;
        justify-content: space-between;
        padding: 0 10px;
        .top {
          position: absolute;
          top: 0px;
          left: 0;
          right: 0;
          font-size: 8px;
          color: #ffffff;
          text-shadow: 1.36px 1.36px 0px #00000040;
        }
        .container-description {
          display: flex;
          align-items: center;
          margin-bottom: 24px;
          span {
            font-size: 6px;
            line-height: 8px;
          }
        }
        .key-container {
          display: flex;
          align-items: center;
          margin-bottom: 2px;
          img {
            height: 12px;
            width: 12px;
            margin: 0;
          }
          span {
            font-size: 8px;
            line-height: 8px;
            font-weight: normal;
          }
        }
      }

      .sign-container {
        display: flex;
        justify-content: space-evenly;
        gap: 10px;

        .item {
          position: relative;

          img {
            width: 140px;
          }

          .item-inner {
            display: flex;
            flex-direction: column;
            align-items: center;
            // gap: 24px;

            .sign-day {
              width: 180px;
              // height: 60px;
              // background: url(../../../assets/images/promo/hotpromo/blastbounty/daily-bonus-title.png) no-repeat;
              // background-size: cover;
              background: unset;
              padding: 0 20px;
              border-radius: 0;
              color: #ffffff;
              font-weight: bold;
              font-family: "PingFang SC";
              font-size: 20px;
              line-height: 24px;
              margin-bottom: 8px;
              &:nth-child(2) {
                font-size: 18px;
              }
            }
          }

          // &.isDotted {
          //   &:after {
          //     border: 1px solid #01f8f9;
          //   }
          // }

          &:first-child {
            &:after {
              display: none;
            }
          }

          // &:after {
          //   content: "";
          //   position: absolute;
          //   // background: #f38100;
          //   border: 1px solid #01f8f9;
          //   height: 0px;
          //   top: 7%;
          //   left: -50%;
          //   width: 25%;
          // }
        }

        .btn {
          align-self: normal;
          font-size: 18px;
          padding: 5px 24px;
          font-weight: 500;
          font-family: "PingFang SC";
          color: $white;
          background: url(../../../assets/images/promo/hotpromo/blastbounty/btn.png) no-repeat center center;

          &.claimed,
          &.not-complete {
            cursor: default;
          }

          &.to-claim {
            cursor: pointer;
            background: url(../../../assets/images/promo/hotpromo/blastbounty/btn-active.png) no-repeat center center;
            color: #000000;
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
      // background: url(../../../assets/images/promo/hotpromo/blastbounty/rules-bg.png) no-repeat center center;
      // background-size: 100% 100%;
      // padding: 20px;

      // color: #b5a73b;
      // text-align: left;
      // img {
      //   max-width: 120px;
      //   margin: 0px auto;
      // }
    }
  }
}
.cs2Dialog {
  max-width: 500px;
}
.q-dialog__inner--minimized > div .dialog-close {
  background: url(../../../assets/images/promo/hotpromo/blastbounty/close.png) no-repeat center center;
  top: 10px;
  right: 15px;
  background-size: contain;
  position: absolute;
  .q-btn {
    content-visibility: hidden;
  }
}
.modal-title {
  background: url(../../../assets/images/promo/hotpromo/blastbounty/star.png) no-repeat center center;
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
  background: url(../../../assets/images/promo/hotpromo/blastbounty/dialogbg.png) no-repeat center top;
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
    color: #7f4c00;

    .rec {
      width: 98%;
      margin: 0 auto;
      height: 140px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      overflow: auto;
      justify-content: flex-start;
      align-items: center;

      &::-webkit-scrollbar {
        width: 5px;
        height: 8px;
        background-color: #ffffff;
      }
      &::-webkit-scrollbar-thumb {
        background: #ffd4b3;
      }
    }

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
    color: #7f4c00;
    gap: 5px;

    .table-title {
      font-weight: 700;
    }
    .rec {
      width: 90%;
      margin: 0 auto;
      height: 140px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      overflow: auto;
      justify-content: flex-start;
      align-items: center;

      &::-webkit-scrollbar {
        width: 5px;
        height: 8px;
        background-color: #ffffff;
      }
      &::-webkit-scrollbar-thumb {
        background: #ffd4b3;
      }
    }

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
  background: url(../../../assets/images/promo/hotpromo/blastbounty/dialogbtn.png) no-repeat center -8px;
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
    background-image: url("../../../assets/images/promotion/hotpromo/lh1-blast-premier/info-title.png");
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
    margin-bottom: 10px;
    gap: 10px;
    .left {
      background-image: url("../../../assets/images/promotion/hotpromo/lh1-blast-premier/info-little-title-bg.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 64px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      font-weight: 600;
      line-height: 23.33px;
      color: #ffffff;
      margin-right: 16px;
    }
    .right {
      font-size: 12px;
      font-weight: 400;
      line-height: 20px;
      color: #000000;
    }
  }
}

.livepoker-rebate-game-info-table {
    text-align: left;
  width: 100%;
  height: 100%;
  border-collapse: separate;
  border-spacing: 0;
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
    text-align: left;
  background: #f2f8fe;
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
    padding: 0;

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
        background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
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
</style>