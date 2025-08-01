<template>
  <div class="cs2">
    <div class="livepoker-rebate-game-info section-bg section first">
     <div class="title-img">箱开福来</div>
      <!-- <div class="tips">
        <div class="tips-inner">
          活动时间：2025年1月14日至2025年1月26日
          <br />
          参与BLAST Premier 赏金赛当日投注金额500元且注单结算后，次日可获得一个开箱钥匙，每投注500元即可获得一个钥匙。
        </div>
      </div> -->
      <!-- <div class="title">
        <img class="bottom" src="@/assets/images/promotion/hotpromo/blastpremier/section-bottom.png" />
      </div> -->
      <div class="content">
        <div class="top-row">
          <div class="top-row-inner">
            <div class="lft">
              <img src="@/assets/images/promotion/hotpromo/blastpremier/key.png" />
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
                  require(`@/assets/images/promotion/hotpromo/blastpremier/treasure-level-${item.treasureLevel.toLowerCase()}.png`)
                "
              />
              <div v-else class="img-placeholder" />
              <div class="required-key">
                <div class="top">{{ getTreasureDescription(item.treasureLevel) }}</div>
                <div class="container-description">
                  <span>开启一次所需钥匙：</span>
                </div>
                <div class="key-container">
                  <img src="@/assets/images/promotion/hotpromo/blastpremier/key.png" />
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
    <div style="display: none;" class="section second">
      <div class="title">
        <img class="top" src="@/assets/images/promotion/hotpromo/blastpremier/section-1-spring.png" />
      </div>
      <div class="tips">
        <div class="tips-inner">
          活动期间,连续投注BLAST Premier 全球总决赛≥1000元则视为签到成功,根据对应累计的签到天数开启宝箱
        </div>
      </div>
      <div class="title">
        <img class="bottom" src="@/assets/images/promotion/hotpromo/blastpremier/section-bottom.png" />
      </div>
      <div class="content">
        <div class="top-row">
          <div class="lft">
            <!-- <img src="@/assets/images/promotion/hotpromo/blastpremier/gun.png" />
              签到天数：
              <span class="number">{{ signNumber }}</span>
               -->
            <div class="item">
              <div class="item-inner">
                <img src="@/assets/images/promotion/hotpromo/blastpremier/daily-bonus-spring.png" />
                <div class="sign-day">
                  签到天数：
                  <span class="number">{{ signNumber }}</span>
                </div>
                <!-- <div class="btn not-complete">未完成签到</div> -->
              </div>
            </div>
          </div>
        </div>
        <div class="middle-row">
          <div class="sign-container">
            <div v-for="(day, i) in dayList" :key="i" class="item" :class="{ isDotted: !day.claimed && !day.toClaim }">
              <div v-if="i < 5" class="item-inner">
                <img :src="require(`@/assets/images/promotion/hotpromo/blastpremier/daily-bonus-${i + 1}.png`)" />
                <div class="sign-day">连续签到{{ day.no }}天</div>
                <div class="btn claimed" v-if="day.claimed">已开启</div>
                <div class="btn to-claim" v-if="day.toClaim" @click="openModal('claim', day, i)">开启</div>
                <div class="btn not-complete" v-if="!day.claimed && !day.toClaim">未完成签到</div>
              </div>
            </div>
          </div>
        </div>
      </div>
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

    <el-dialog class="cs2Dialog" v-model="isKeyRecordModal" lock-scroll>
      <div class="modal-title">
        <img src="../../../assets/images/promotion/hotpromo/cs2/getkey.png" />
      </div>
      <div class="modal-body keyRec">
        <table>
          <tbody>
            <tr>
              <th>日期</th>
              <th>数量</th>
            </tr>
          </tbody>
        </table>
        <div class="rec">
          <table v-if="keyRecords && keyRecords.length > 0" class="table-rows">
            <tbody>
              <tr v-for="(key, i) in keyRecords" :key="i">
                <td>{{ key.createTime }}</td>
                <td>
                  <div class="keysAmt">
                    <img src="../../../assets/images/promotion/hotpromo/cs2/key.png" />
                    {{ key.quantity }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else style="display: flex; justify-content: center; align-items: center; height: 400px">暂无数据</div>
        </div>
      </div>
    </el-dialog>

    <el-dialog class="cs2Dialog" v-model="isChestRecordModal" lock-scroll>
      <div class="modal-title">
        <img src="./images/title-img.png" />
      </div>
      <div class="modal-body openRec">
          <div class="rec">
            <div class="rec-bg">
              <div class="table-title" style="width: 100%">
                <table style="width: 100%" class="livepoker-rebate-game-info-table section-table">
                  <tr>
                    <th width="33.3%">日期</th>
                    <th width="33.3%">消耗</th>
                    <th width="33.3%">获取金额</th>
                  </tr>
                </table>
              </div>
              <table style="width: 100%" v-if="openRecords && openRecords.length > 0" class="livepoker-rebate-game-info-table section-table">
                <tbody>
                  <tr v-for="(open, i) in openRecords" :key="i">
                    <td width="33.3%">{{ open.createTime }}</td>
                    <td width="33.3%">{{ open.quantity }}</td>
                    <td width="33.3%">{{ open.amount }}</td>
                  </tr>
                </tbody>
              </table>
              <div v-else style="display: flex; justify-content: center; align-items: center; height: 400px">暂无数据</div>
            </div>
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
import { ElMessageBox } from "element-plus";
import { userStore } from "@/store";
import { ResponseCode } from "@/api/response";
import { useDark } from "@vueuse/core";
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
const isDark = useDark();
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
    } else if (
      !(
        res.code === ResponseCode.ERROR_USER_TOO_FAST ||
        res.code === ResponseCode.ERROR_PROMO_NOT_STARTED ||
        res.code === ResponseCode.ERROR_PROMO_USER_NOT_MEET_REQUIREMENT ||
        res.code === ResponseCode.ERROR_PROMO_CLAIMED ||
        res.code === ResponseCode.ERROR_SYSTEM
      )
    ) {
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

const getTreasureDescription = (treasureLevel) => {
  if (treasureLevel === "NORMAL") {
    return "普通宝箱";
  } else if (treasureLevel === "CS") {
    return "CS宝箱";
  } else if (treasureLevel === "DRAGON") {
    return "龙宝箱";
  }
};

const claimModalClose = () => {
  isClaimModal.value = false;
  store.getBalance();
};

const checkInDetails = ref();
const dayList = ref([
  // { no: 3, claimed: false, toClaim: false },
  // { no: 5, claimed: false, toClaim: false },
  // { no: 7, claimed: false, toClaim: false }
  { no: 1, claimed: false, toClaim: false },
  { no: 2, claimed: false, toClaim: false },
  { no: 3, claimed: false, toClaim: false },
  { no: 4, claimed: false, toClaim: false },
  { no: 5, claimed: false, toClaim: false }
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
    // notify({
    //   message: "请登录后操作",
    //   type: "error"
    // });
    return;
  }
  init();
});
</script>
<style lang="scss" scoped>
.livepoker-rebate-wrapper {
  display: flex;
  justify-content: center;
}
.livepoker-rebate-container {
  width: 1200px;
  height: 100%;
}

.livepoker-rebate-section {
  box-shadow: 0px 0px 4px 0px #01497b0f;
  padding: 30px 40px;
  border-radius: 12px;
  border: 1px solid #acd4f6;
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  background: url("@/assets/promo/lh-livepoker-rebate/section-bg.png");
  background-size: 100% 100%;

  .livepoker-rebate-section-left {
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
    justify-content: flex-start;
    gap: 25px;
  }

  .livepoker-rebate-section-right {
    margin-top: auto;
    margin-bottom: auto;
    width: 220px;

    .bonus-image {
      cursor: pointer;
      width: 100%;

      &:hover {
        filter: brightness(0.9);
      }
      &:active {
        transform: translate(0px, 1px);
        opacity: 0.9;
      }

      &.disabled {
        cursor: not-allowed;
        pointer-events: none;
      }
    }
  }

  .livepoker-rebate-section-title {
    color: #000000;
    font-size: 24px;
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
    font-size: 16px;
    font-weight: 500;
    line-height: 22.4px;
    color: #ff3333;
  }
  .livepoker-rebate-game-bottom-left-btn {
    font-size: 16px;
    font-weight: 600;
    line-height: 22.4px;
    color: #ff3333;
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
  padding: 40px;
  border: 1px solid #acd4f6;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  // align-items: center;
  gap: 20px;

  .title {
    background-image: url("@/assets/promo/lh-livepoker-rebate/info-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 738px;
    height: 44px;
    margin: 0 auto 8px;
  }
  .little-title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 15px;
    gap: 10px;
    .left {
      background-image: url("@/assets/promo/lh-livepoker-rebate/info-little-title-bg.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 120px;
      height: 36px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      font-weight: 600;
      line-height: 23.33px;
      color: #ffffff;
      margin-right: 16px;
    }
    .right {
      font-size: 20px;
      font-weight: 400;
      line-height: 28px;
      color: #000000;
    }
  }
}

.livepoker-rebate-game-info-table {
  width: 100%;
  height: 100%;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  text-align: center;
  vertical-align: middle;
  th {
    height: 56px;
    font-size: 20px;
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
    border: 1px solid #acd4f6;
    font-size: 14px;
    font-weight: 400;
    line-height: 30px;
    color: #000000;
  }
}

.livepoker-rebate-game-bottom-rule {
  width: 100%;
  height: 100%;
  margin-top: 40px;
  background: #f2f8fe;
  border-radius: 12px;
  padding: 40px;
  border: 1px solid #acd4f6;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    background-image: url("@/assets/promo/lh-livepoker-rebate/rule-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 738px;
    height: 44px;
    margin-bottom: 20px;
  }
  .content {
    font-size: 20px;
    font-weight: 400;
    line-height: 36px;
    color: #000000;
    .item {
      padding-left: 24px;
      display: flex;
      gap: 10px;

      .item-num {
        color: #ffffff;
        font-size: 20px;
        line-height: 1;
        border-radius: 50%;
        height: 28px !important;
        width: 28px !important;
        min-width: 28px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 2px;
        background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
      }

      .hint {
        font-size: 18px;
        font-weight: 400;
        line-height: 22.4px;
        color: #ff3333;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 4px;
      }
    }
  }
}
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
    display: flex;
    flex-direction: column;
    gap: 10px;
    img {
      margin: 0 auto;
      &.logo {
        max-width: 350px;
      }
      &.top {
        max-width: 600px;
      }
      &.bottom {
        margin: 10px auto;
      }
    }
  }

  .useKeys {
    @include animation-btn;
    // background: url(@/assets/images/promotion/hotpromo/blastpremier/open-btn-bg.png) no-repeat center center;
    background: linear-gradient(180deg, #73B2FF 0%, #3981FF 100%);
    color: #ffffff;
    padding: 4px 25px;
    width: 200px;
    background-size: cover;
    margin: 0 auto;
    font-weight: bold;
    font-size: 20px;
    cursor: pointer;
    margin-bottom: 80px;
    border-radius: 20px;
  }

  .tips {
    color: #fffd66;
    margin: 0 auto;
    text-align: center;
    font-size: 16px;
    // font-weight: 700;
    // font-family: PingFang SC;
    // font-size: 20px;
    // line-height: 28px;
    // position: relative;
    // margin-bottom: 36px;

    // &::before,
    // &::after {
    //   content: "";
    //   display: block;
    //   position: absolute;
    //   left: 0;
    //   right: 0;
    //   background: linear-gradient(90deg, rgba(#01f8f9, 0) 0%, rgba(#01f8f9, 50%) 50%, rgba(#01f8f9, 0) 100%) no-repeat
    //     center center;
    //   height: 2px;
    // }

    // &::before {
    //   top: 0;
    // }

    // & ::after {
    //   bottom: 0;
    // }

    // .tips-inner {
    //   background: linear-gradient(90deg, rgba(#01f8f9, 0) 0%, rgba(#01f8f9, 20%) 50%, rgba(#01f8f9, 0) 100%) no-repeat
    //     center center;
    //   padding: 22px 0;
    // }
  }
  .second .content {
    display: flex;
    background: url(@/assets/images/promotion/hotpromo/blastpremier/middle-row.png) no-repeat center center;
    padding: 50px 0;
    justify-content: center;
    gap: 20px;
    align-items: center;
    .top-row {
      margin: 0;
      .lft {
        .item {
          padding-right: 20px;
          border-right: 1px solid #fffd66;
        }
        .item-inner {
          img {
            width: 100%;
            padding: 20px;
          }
        }
      }
    }
  }
  .first .content .top-row {
    // background: url(../../../assets/images/promotion/hotpromo/blastpremier/container.png) no-repeat center center;
    // background-size: contain;
    background: linear-gradient(180deg, #93F2FF 3.39%, #3A69F7 100%);
    border-radius: 15px;
    border: 3px solid #94BAF8;
    padding: 5px;
      margin-bottom: 40px;
    &-inner {
        background: linear-gradient(180deg, #FAFCFF 31.57%, #E3EAF8 54.21%, rgba(202, 211, 239, 0.6) 100%);
        border: 3px solid #9FA9D0;
        width: 100%;
        border-radius: 15px;
    }
  }
  .content {
    max-width: 1300px;
    margin: 0 auto;
    padding: 20px 20px 40px 20px;
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
        font-size: 20px;
        color:#333333;
        font-weight: 600;
        padding: 0 18px;
        > img {
          height: 40px;
          width: 40px;
        }
        .btn {
          align-self: normal;
          font-size: 18px;
          padding: 5px 24px;
          font-weight: 600;
          font-family: "PingFang SC";
          color: $color-white;
          background: url(@/assets/images/promotion/hotpromo/blastpremier/btn.png) no-repeat center center;

          &.claimed,
          &.not-complete {
            cursor: default;
          }

          &.to-claim {
            @include animation-btn;
            cursor: pointer;
            background: url(@/assets/images/promotion/hotpromo/blastpremier/btn-active.png) no-repeat center center;
            color: #000000;
          }
        }
        .item {
          position: relative;

          img {
            width: 100%;
          }

          .item-inner {
            display: flex;
            flex-direction: column;
            align-items: center;
            // gap: 24px;

            .sign-day {
              width: 180px;
              // height: 60px;
              // background: url(@/assets/images/promotion/hotpromo/blastpremier/daily-bonus-title.png) no-repeat;
              // background-size: cover;
              background: unset;
              padding: 0 20px;
              border-radius: 0;
              color: #000000;
              font-weight: 600;
              font-family: "PingFang SC";
              font-size: 20px;
              line-height: 24px;
              margin-bottom: 8px;
              &:nth-child(2) {
                color: #00A1FF;
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

        .number {
          color: #00A1FF;
          font-weight: 700;
          font-size: 25px;
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
          padding: 12px 30px;
          font-weight: 600;
          line-height: 28px;
          font-family: "PingFang SC";
          color: #00A1FF;
          // color: $color-white;
          &:first-of-type {
            color: #000000;
          }

          // background: url(@/assets/images/promotion/hotpromo/blastpremier/btn-active.png) no-repeat center center;
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
          width: 300px;
          height: 250px;
          display: flex;
          flex-direction: column;
          justify-items: center;
          align-items: center;
          gap: 16px;
          position: relative;
          // padding: 10px 0;
          background: url(@/assets/images/promotion/hotpromo/blastpremier/global-treasure-bg.png) no-repeat center
            center;
          background-size: contain;
          cursor: pointer;
          transition: background-image 0.3s ease, transform 0.3s ease;
          filter: brightness(0.5);
          .img-placeholder {
            width: 360px;
            height: 300px;
          }

          > img {
            width: 155px;
            height: 140px;
            margin-top: 45px;
          }

          &.active,
          &:hover {
            background: url(@/assets/images/promotion/hotpromo/blastpremier/global-treasure-bg-active.png) no-repeat
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
          top: 10px;
          left: 0;
          right: 0;
          font-size: 15px;
          color: #ffffff;
          text-shadow: 1.36px 1.36px 0px #00000040;
        }
        .container-description {
          display: flex;
          align-items: center;
          margin-bottom: 24px;
          span {
            font-size: 18px;
          }
        }
        .key-container {
          display: flex;
          align-items: center;
          margin-bottom: 14px;
          img {
            width: 32px;
            height: 32px;
          }
          span {
            font-size: 20px;
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
              // background: url(@/assets/images/promotion/hotpromo/blastpremier/daily-bonus-title.png) no-repeat;
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
          color: $color-white;
          background: url(@/assets/images/promotion/hotpromo/blastpremier/btn.png) no-repeat center center;

          &.claimed,
          &.not-complete {
            cursor: default;
          }

          &.to-claim {
            @include animation-btn;
            cursor: pointer;
            background: url(@/assets/images/promotion/hotpromo/blastpremier/btn-active.png) no-repeat center center;
            color: #000000;
          }
        }
      }
    }
  }

  .section {
    margin-bottom: 30px;
    &.section-bg {
      max-width: 1400px;
      margin-left: auto;
      margin-right: auto;
    }

    &.first {
      .title .logo {
        margin: 50px auto 10px;
        width: 200px;
        img {
          width: 100%;
        }
      }
      .title .top {
      }
    }

    &.second {
    }

    &.third {
      // background: url(@/assets/images/promotion/hotpromo/blastpremier/rules-bg.png) no-repeat center center;
      // background-size: 100% 100%;
      // max-width: 1200px;
      // margin: 30px auto;
      // padding: 20px;

      // color: #b5a73b;

      .content {
        text-align: left;
        z-index: 99;
        position: relative;
      }
    }
  }
}

:deep(.cs2Dialog) {
  width: 760px;
  background: transparent;
  box-shadow: none;
  .el-dialog__header .el-dialog__headerbtn {
    background: url(../../../assets/images/promotion/hotpromo/cs2/close2.png);
    content-visibility: hidden;
    top: 50px;
    right: 50px;
    background-size: contain;
    width: 20px;
    height: 20px;
  }

  .modal-title {
    // background: url(../../../assets/images/promotion/hotpromo/cs2/star.png) no-repeat center center;
    position: absolute;
    top: 4px;
    left: 50%;
    transform: translateX(-50%);
    img {
      // filter: brightness(100);
      height: 60px;
      width: 439px;
    }
  }

  .modal-body {
    // background: url(../../../assets/images/promotion/hotpromo/cs2/dialogbg.png) no-repeat center center;
    background: linear-gradient(0deg, #D9D9D9, #D9D9D9),linear-gradient(0deg, #F2F8FE, #F2F8FE);
    width: 100%;
    height: 470px;
    background-size: contain;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    &.keyRec {
      color: #7f4c00;
      font-size: 20px;

      .rec {
        width: 90%;
        margin: 0 auto;
        height: 300px;
        display: flex;
        flex-direction: column;
        gap: 15px;
        overflow: auto;
        justify-content: flex-start;
        align-items: center;

        &::-webkit-scrollbar {
          width: 5px;
          height: 8px;
          background-color: #ffffff;
        }

        &::-webkit-scrollbar-thumb {
          //background: #ffd4b3;
        }
      }

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
      background: linear-gradient(180deg, #93F2FF 3.39%, #3A69F7 100%);
      border-radius: 10px;
      font-size: 24px;
      gap: 15px;
      .table-title {
        font-weight: 700;
      }
      .rec {
        width: 96%;
        height: 96%;
        background: #fff;
        border-radius: 10px;
        &::-webkit-scrollbar {
          width: 5px;
          height: 8px;
          //background-color: #ffffff;
        }
        &::-webkit-scrollbar-thumb {
          //background: #ffd4b3;
        }
        .rec-bg {
          width: 94%;
          max-height: 364px;
          display: flex;
          flex-direction: column;
          overflow: auto;
          justify-content: flex-start;
          align-items: center;
          margin: 62px auto 0;
        }
      }

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
.dark {
  .livepoker-rebate-section,
  .livepoker-rebate-game-info,
  .livepoker-rebate-game-bottom-rule {
    position: relative;
    background: linear-gradient(180deg, #2d3f64 0%, #232a36 100%);
    border: none;
  }

  .livepoker-rebate-section::before,
  .livepoker-rebate-game-info::before,
  .livepoker-rebate-game-bottom-rule::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 12px;
    padding: 1px;
    background: linear-gradient(170deg, #be9457 1.91%, rgba(190, 148, 87, 0) 33.82%);
    mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    mask-composite: exclude;
    pointer-events: none;
  }

  .livepoker-rebate-section {
    .livepoker-rebate-section-title {
      color: #fff;
    }
    .reward-info-content {
      color: #fff;
    }
  }

  .livepoker-rebate-game-info {
    .left {
      background-image: url("../../../assets/promo/lh-livepoker-rebate/dark-info-little-title-bg.png");
    }
    .right {
      color: #fff;
    }
    .title {
      background-image: url("../../../assets/promo/lh-livepoker-rebate/dark-info-title.png");
    }
  }

  .livepoker-rebate-game-bottom-rule {
    .item {
      color: #fff;
    }
    .title {
      background-image: url("../../../assets/promo/lh-livepoker-rebate/dark-info-title.png");
    }
  }

  .livepoker-rebate-game-info-table {
    th {
      background: linear-gradient(180deg, #597adf 0%, #3c5ec3 100%);
    }
    td {
      color: white;
    }
  }
}
</style>
