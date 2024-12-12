<template>
  <div class="christmas-gachapon-container">
    <div class="el-loading-mask el-loading-mask-h" v-if="isLoading">
      <p class="spinner"><img src="../christmas-gachapon/img/spinner.png" /></p>
      <p class="loading-text">加载中...</p>
    </div>
    <div class="snow-container">
      <div class="snowflake"></div>
      <div class="snowflake"></div>
      <div class="snowflake"></div>
      <div class="snowflake"></div>
      <div class="snowflake"></div>
    </div>
    <div class="promodetails" @click="openModal('detail')"><img src="../christmas-gachapon/img/details.png" /></div>
    <div class="promorule" @click="openModal('rule')"><img src="../christmas-gachapon/img/rules.png" /></div>
    <div class="promorecord" @click="openModal('record')"><img src="../christmas-gachapon/img/record.png" /></div>
    <div class="once" @click="getGachapon('once')"><img src="../christmas-gachapon/img/once.png" /></div>
    <div class="fivex" @click="getGachapon('five')"><img src="../christmas-gachapon/img/fivex.png" /></div>
    <div class="amtleft">
      抽奖次数剩余:
      <span>{{ availableDraw }}次</span>
    </div>
  </div>
  <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" class="christmas-modal" v-model="isModal">
    <div class="christmas-side" v-if="modalContent.type === 'rule'">
      <img src="../christmas-gachapon/img/tiny.png" />
    </div>
    <div class="inner-contents">
      <div class="title">
        <img src="../christmas-gachapon/img/side.png" />
        {{ modalContent.title }}
        <img src="../christmas-gachapon/img/side.png" />
      </div>
      <div v-if="modalContent.type === 'rule'" class="rules" v-html="rules"></div>
      <div class="table-scroll" v-if="modalContent.type === 'record'">
        <el-table :data="paginatedData" style="width: 100%">
          <el-table-column prop="prizeNo" label="编号"></el-table-column>
          <el-table-column prop="bonusName" label="内容"></el-table-column>
          <el-table-column prop="recordTime" label="时间" width="300"></el-table-column>
          <!-- <el-table-column prop="status" label="状态" width="100"></el-table-column> -->
        </el-table>
      </div>
      <el-pagination
        v-if="modalContent.type === 'record'"
        style="margin-top: 20px; justify-content: center; text-align: right"
        background
        v-model:current-page="params.current"
        v-model:page-size="params.size"
        :total="totalItems"
        layout="prev, pager, next, sizes, jumper"
        :page-sizes="[5, 10, 20, 30, 50]"
        @current-change="onPageSizeChange"
        @update:page-size="onPageSizeChange"
      />
    </div>
    <div class="details" v-if="modalContent.type === 'detail'">
      <div class="detailed-info">
        <div class="little-title">
          <div class="left">活动时间</div>
          <div class="right">2024.12.24-2025.1.1</div>
        </div>
        <div class="little-title">
          <div class="left">活动对象</div>
          <div class="right">全网会员</div>
        </div>
        <div class="little-title" style="justify-content: flex-start; align-items: flex-start">
          <div class="left">优惠详情</div>
          <div class="right" style="max-width: 73%">
            在2024.12.24-2025.1.1活动期间，每日投注额≥1000元及以上次日即可获得一次抽奖机会，每日可抽50次，活动周期内抽奖次数可累计。
          </div>
        </div>
        <table class="detailed-info-table">
          <tbody>
            <tr>
              <th>当日有效投注</th>
              <th>抽奖机会</th>
              <th>流水倍数</th>
            </tr>
            <tr>
              <td>≥1,000元</td>
              <td>1次</td>
              <td rowspan="11">5倍流水</td>
            </tr>
            <tr>
              <td>≥5,000元</td>
              <td>2次</td>
            </tr>
            <tr>
              <td>≥8,000元</td>
              <td>3次</td>
            </tr>
            <tr>
              <td>≥15,000元</td>
              <td>5次</td>
            </tr>
            <tr>
              <td>≥30,000元</td>
              <td>10次</td>
            </tr>
            <tr>
              <td>≥80,000元</td>
              <td>15次</td>
            </tr>
            <tr>
              <td>≥100,000元</td>
              <td>20次</td>
            </tr>
            <tr>
              <td>≥300,000元</td>
              <td>25次</td>
            </tr>
            <tr>
              <td>≥800,000元</td>
              <td>30次</td>
            </tr>
            <tr>
              <td>≥1,000,000元</td>
              <td>40次</td>
            </tr>
            <tr>
              <td>≥3,000,000元</td>
              <td>50次</td>
            </tr>
          </tbody>
        </table>

        <div class="detailed-info-bottom">
          <div class="detailed-info-bottom-left-title">
            <div class="detailed-info-bottom-left-btn">
              <img src="../../../assets/promo/lh-livepoker-rebate/game-bottom-left-btn.png" alt="" width="22px" />
              <span>示例</span>
            </div>
            会员A在2024年12月25日累计有效投注为20000元, 2024年12月26日即可在优惠页面点击【立即抽奖】获得财富金,
            根据规则会员可获得5次抽奖机会, 奖金仅需5倍水即可出款
          </div>
        </div>
      </div>
    </div>
  </el-dialog>

  <el-dialog
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="prize-modal"
    :class="{ five: prizes.length > 1, once: prizes.length <= 1 }"
    v-model="isPrizeModal"
    align-center
  >
    <div class="prizes">
      <div class="prize" v-for="prize in prizes">
        <div class="imgball"><img :src="require(`../christmas-gachapon/img/${prize.img}.png`)" /></div>
        <div class="redbar">{{ prize.type }}</div>
      </div>
    </div>
    <div class="claimbtn" @click="getBalance()">
      <img src="../christmas-gachapon/img/claim.png" />
    </div>
  </el-dialog>
</template>
<script setup>
import { onMounted, ref, reactive, watch, defineProps, computed } from "vue";
import { useNotify } from "@/hooks/notify";
import { userStore } from "@/store";
import moment from "moment";
import { getDrawPrizes, initDrawEvent, getDrawRecord } from "@/api/index/promo";
import { ResponseCode } from "@/api/response";
const store = userStore();
const isLoading = ref(false);
const props = defineProps(["promoCode", "promoRules"]);
const promoCode = ref(props.promoCode);
const rules = ref(props.promoRules);
const notify = useNotify();
const isModal = ref(false);
const isRules = ref(false);
const isRecord = ref(false);
const isDetails = ref(false);
const isPrizeModal = ref(false);
const modalContent = {
  title: "",
  type: ""
};
const prizes = ref([]);
const availableDraw = ref(0);
const params = reactive({
  size: 30,
  current: 1
});
const totalItems = ref(0);
const onPageSizeChange = async () => {
  tableData.value = [];
  getDrawRecord(promoCode.value, params).then((res) => {
    if (res.code === 0) {
      totalItems.value = res.data.total;
      tableData.value = res.data.records;
    } else {
        notify({
            type: "error",
            message: `${res.message}`
        });
    }
  });
};
const openModal = (type) => {
  modalContent.type = type;
  if (type === "detail") {
    modalContent.title = "活动内容";
  } else if (type === "rule") {
    modalContent.title = "活动规则";
  } else if (type === "record") {
    tableData.value = [];
    getDrawRecord(promoCode.value, params).then((res) => {
      if (res.code === 0) {
        totalItems.value = res.data.total;
        tableData.value = res.data.records;
        console.log(tableData.value);
      }
    });
    modalContent.title = "活动记录";
    isRules.value = false;
  } else {
  }
  isModal.value = true;
};
const getGachapon = (t) => {
  // if (availableDraw.value === 0) {
  //     notify({
  //     type: "warning",
  //     message: `抽奖次数不足`
  //     });
  //     return
  // }
  isLoading.value = true;

  var times = 1;
  if (t === "five") {
    times = 5;
  }
  // Simulating an async operation (e.g., an API call) with a Promise.
  getDrawPrizes(promoCode.value, times) // Replace this with your actual async operation (e.g., an API call)
    .then((res) => {
      if (res.code === 0) {
        prizes.value = [];
        res.data.forEach((item) => {
          if (!item.bonus) {
            if (item.bonusName === "苹果16 256GB") {
              prizes.value.push({
                img: "iphone",
                type: "IPhone16 256GB"
              });
            }
            if (item.bonusName === "苹果耳机") {
              prizes.value.push({
                img: "ipods",
                type: "苹果耳机一副"
              });
            }
          } else {
            const bonusMapping = {
              大红包: "big",
              中红包: "med",
              小红包: "small"
            };

            if (bonusMapping[item.bonusName]) {
              prizes.value.push({
                img: bonusMapping[item.bonusName],
                type: `${item.bonusName} ${item.bonus}元彩金`
              });
            }
          }
        });
        isPrizeModal.value = true;
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
    })
    .catch((error) => {
      // Handle error
      // notify({
      //     type: "error",
      //     message: `Error fetching prizes: ${error.message}`
      // });
      // console.error('Error fetching prizes:', error);
    })
    .finally(() => {
      // Always run (after success or error)
      isLoading.value = false;
      console.log("Loading state finished");
      init();
    });
};
const getBalance = () => {
  store.getBalance();
  init();
  isPrizeModal.value = false;
};

const tableData = ref([]);

const paginatedData = computed(() => {
  // Translate the data before pagination
  const translatedData = translateTableData(tableData.value);

  return translatedData; // Pagination on translated data
});

// Status translation mapping
const statusTranslations = {
  PENDING: "待处理",
  CLAIMED: "已领取"
};
// const translatedTableData = computed(() => {
//     return tableData.value.map((row) => ({
//         ...row,
//         bonusName: row.bonusAmount
//         ? `恭喜获得 ${row.bonusName} ${row.bonusAmount}元彩金`
//         : `恭喜获得 ${row.bonusName}`,
//         status: statusTranslations[row.status] || row.status, // Use translation or fallback to original
//         recordTime: moment(row.recordTime).format('YYYY年MM月DD日HH:mm:ss'), // Format time
//     }));
// });

// Translate the table data
const translateTableData = (data) => {
  return data.map((row) => ({
    ...row,
    bonusName: row.bonusAmount ? `恭喜获得${row.bonusName}${row.bonusAmount}元彩金` : `恭喜获得${row.bonusName}`,
    status: statusTranslations[row.status] || row.status, // Use translation or fallback to original
    recordTime: moment(row.recordTime).format("YYYY年MM月DD日HH:mm:ss") // Format time
  }));
};

const init = () => {
  initDrawEvent(promoCode.value).then((res) => {
    if (res.code === 0) {
      availableDraw.value = res.data.availableDraw;
    }
  });
};
onMounted(() => {
  if (!store.token) {
    return;
  }
  init();
});
</script>
<style scoped lang="scss">
.snow-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .snowflake {
    position: absolute;
    top: -10px; // Start slightly above the visible area
    width: 10px;
    height: 10px;
    background: white;
    border-radius: 50%;
    opacity: 0.8;
    animation: fall linear infinite;

    // Randomly generate animation values for variety
    &:nth-child(1) {
      left: 5%;
      animation-duration: 10s;
      animation-delay: 0s;
      animation-timing-function: ease-in;
    }
    &:nth-child(2) {
      left: 15%;
      animation-duration: 12s;
      animation-delay: 2s;
    }
    &:nth-child(3) {
      left: 25%;
      animation-duration: 8s;
      animation-delay: 1s;
    }
    &:nth-child(4) {
      left: 50%;
      animation-duration: 15s;
      animation-delay: 3s;
    }
    &:nth-child(5) {
      left: 75%;
      animation-duration: 11s;
      animation-delay: 0.5s;
    }
  }
}

@keyframes fall {
  0% {
    transform: translateY(-100px);
    opacity: 0.8;
  }
  100% {
    transform: translateY(110vh); // Fall beyond the bottom edge
    opacity: 0; // Fade out at the end
  }
}

@keyframes bounce {
  0% {
    transform: translateX(0); /* Start at the center, no rotation */
  }
  25% {
    transform: translateX(-15px); /* Move up and rotate 90 degrees */
  }
  50% {
    transform: translateX(0); /* Return to center and rotate 180 degrees */
  }
  75% {
    transform: translateX(15px); /* Move down and rotate 270 degrees */
  }
  100% {
    transform: translateX(0); /* Return to center and complete rotation */
  }
}
@keyframes spin {
  from {
    transform: rotate(0deg); /* Start with no rotation */
  }
  to {
    transform: rotate(360deg); /* Complete a full rotation */
  }
}
.christmas-gachapon-container {
  position: relative;
  background: url(img/christmas-bg.png) no-repeat center center;
  background-size: cover;
  width: 100%;
  max-width: 1920px;
  height: 890px;
  margin: 0 auto;

  .spinner {
    display: inline-block;
    width: 150px; /* Set the width of your PNG */
    height: 150px; /* Set the height of your PNG */
    overflow: hidden; /* Optional: Ensures content stays within the div */
  }
  .el-loading-mask-h {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: #ffffff;
    position: relative;
    overflow: hidden;
    height: 100vh;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent overlay */
  }
  .loading-text {
    font-size: 24px; /* Adjust size as needed */
    color: #ffffff; /* Text color */
    background: linear-gradient(90deg, #ff7e5f, #feb47b); /* Gradient text */
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent; /* Make gradient visible in text */
    text-shadow: 0px 5px 5px rgba(0, 0, 0, 0.3); /* Add a soft shadow */
    animation: bounce 2s linear infinite; /* Apply spinning animation */
  }
  .spinner img {
    width: 88%; /* Ensures the image scales properly */
    height: 88%;
    animation: spin 1.5s ease-in-out infinite;
  }

  .promodetails {
    position: absolute;
    top: 63%;
    left: 30%;
    @media screen and (max-width: 1700px) {
      top: 63%;
      left: 24%;
    }
    transform: translate(-50%, -50%);
    cursor: pointer;
    img {
      width: 100px;
    }
    &:hover {
      filter: hue-rotate(340deg) saturate(2.5);
    }
  }
  .promorule {
    position: absolute;
    top: 69.7%;
    left: 30.5%;
    @media screen and (max-width: 1700px) {
      top: 70%;
      left: 24%;
    }
    transform: translate(-50%, -50%); /* Center the element */
    cursor: pointer;
    img {
      width: 100px;
    }
    &:hover {
      filter: hue-rotate(340deg) saturate(2.5);
    }
  }
  .promorecord {
    position: absolute;
    top: 77.5%;
    left: 30.5%;
    @media screen and (max-width: 1700px) {
      top: 77%;
      left: 24%;
    }
    transform: translate(-50%, -50%);
    cursor: pointer;
    img {
      width: 100px;
    }
    &:hover {
      filter: hue-rotate(340deg) saturate(2.5);
    }
  }
  .once {
    position: absolute;
    transform: translate(-50%, -50%);
    top: 84%;
    left: 43%;
    @media screen and (max-width: 1700px) {
      top: 82%;
      left: 42%;
    }
    width: 240px;
    cursor: pointer;
    img {
      width: 100%;
    }
  }
  .fivex {
    position: absolute;
    width: 240px;
    top: 84%;
    left: 56%;
    @media screen and (max-width: 1700px) {
      top: 82%;
      left: 58%;
    }
    transform: translate(-50%, -50%);
    cursor: pointer;
    img {
      width: 100%;
    }
  }
  .amtleft {
    position: absolute;
    top: 92%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    width: 500px;
    font-weight: bold;
    font-size: 18px;
    color: #ffffff;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
    span {
      color: #ffd900;
      text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
    }
    background: linear-gradient(
      90deg,
      rgba(255, 217, 0, 0) 0%,
      rgba(255, 217, 0, 0.6) 52.5%,
      rgba(255, 217, 0, 0) 93.5%
    );
  }
}

.christmas-modal {
  .title {
    text-align: center;
    margin: 10px auto;
    color: #1f774c;
    font-family: PingFang;
    font-size: 32px;
    font-weight: 600;
    line-height: 44px;
    display: flex;
    gap: 5px;
    justify-content: center;
    align-items: center;
    z-index: 999999;
    position: relative;
    img {
      width: 50px;
    }
  }
  .christmas-side {
    position: absolute;
    right: 20px;
    bottom: 0px;
  }
  .detailed-info {
    width: 100%;
    height: 100%;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    // align-items: center;
    gap: 10px;

    .title {
      background-image: url("../../../assets/promo/lh-livepoker-rebate/info-title.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 738px;
      height: 44px;
      margin: 0 auto 40px;
    }
    .little-title {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 5px;
      .left {
        filter: hue-rotate(150deg) saturate(3.5);
        background-image: url("../../../assets/promo/lh-livepoker-rebate/info-little-title-bg.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        width: 100px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        font-weight: 600;
        line-height: 23.33px;
        color: #ffffff;
        margin-right: 16px;
      }
      .right {
        font-size: 16px;
        font-weight: 400;
        line-height: 20px;
        color: #000000;
      }
    }
  }

  .detailed-info-table {
    width: 100%;
    height: 100%;
    border-collapse: separate;
    border-spacing: 0;
    text-align: center;
    vertical-align: middle;

    th {
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: #fff;
      background: #f34e38;
      padding: 8px;

      // background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
      // &:first-child {
      //   border-top-left-radius: 12px;
      // }
      // &:last-child {
      //   border-top-right-radius: 12px;
      // }
    }
    tr {
      &:first-child {
        td {
          &:last-child {
            background: #ffffff;
          }
        }
      }
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
      &:nth-child(odd) {
        background: #f34e3820;
      }
    }
    td {
      padding: 8px;
      border: 1px solid #f34e3832;
      font-size: 16px;
      font-weight: 400;
      line-height: 20px;
      color: #000000;
    }
  }

  .detailed-info-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .detailed-info-bottom-left-title {
      font-size: 16px;
      font-weight: 500;
      line-height: 22.4px;
      color: #ff0000;
    }
    .detailed-info-bottom-left-btn {
      font-size: 16px;
      font-weight: 600;
      line-height: 22.4px;
      color: #ff0000;
      cursor: pointer;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 4px;
    }
  }
}
.prize-modal {
  .prizes {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0px;
    .prize {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .imgball {
        width: 220px;
        img {
          width: 100%;
        }
      }
      .redbar {
        background: url(img/redbar.png) no-repeat center center;
        padding: 10px 30px;
        width: 100%;
        font-size: 18px;
        text-align: center;
        color: #f82f06;
        font-weight: bold;
      }
    }
  }
  .claimbtn {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    margin: 10px auto 0;
    cursor: pointer;
    img {
      width: 100%;
    }
  }
}
</style>
<style lang="scss">
body .el-dialog.christmas-modal {
  .rules {
    font-size: 14px;
    color: #333; // Default text color
    line-height: 1.6;
    padding: 0;
    border-radius: 8px; // Optional: Rounded corners for the rules container

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      counter-reset: item; // Initialize counter

      li {
        position: relative;
        padding-left: 30px; // Space for numbered circle
        margin-bottom: 15px;

        &::before {
          content: counter(item); // Display the index
          counter-increment: item; // Increment counter
          position: absolute;
          top: 10px;
          left: 0px;
          transform: translateY(-50%);
          background: linear-gradient(135deg, #e6374a, #ac1828);
          color: #ffffff;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: bold;
        }
      }
    }

    font {
      color: #c24f4a;
      font-weight: bold; // Optional: Emphasize important notes
    }
  }
  .el-table thead {
    position: sticky;
    top: 0;
    background-color: #fff; /* Ensure the header background is white */
    z-index: 1; /* Ensure it stays above the table body */
  }
  .table-scroll {
    height: 305px;
    overflow: auto;
    position: relative;
  }
  .el-table {
    font-weight: bold;
    font-family: PingFang SC;
  }
  .el-table th.el-table__cell.is-leaf {
    background: #f34e38;
    color: #ffffff;
    border: 1px solid;
    text-align: center;
  }

  .el-table .cell {
    text-align: center;
  }
  .el-table__row:nth-child(even) {
    background-color: #f34e3851;
    color: #000000;
  }

  /* Set the background color for odd rows to transparent */
  .el-table__row:nth-child(odd) {
    background-color: transparent;
    color: #000000;
  }
  box-shadow: none;
  background-color: unset;
  width: 80%;
  max-width: 1020px;
  overflow: unset;
  * {
    scrollbar-color: #fb7070 transparent;
  }
  .el-dialog__header .el-dialog__headerbtn {
    top: -80px;
    z-index: 9999;
  }
}
body .el-dialog.prize-modal {
  * {
    scrollbar-color: #fb7070 transparent;
  }
  box-shadow: none;
  background-color: unset;
  width: 90%;
  max-width: 1400px;
  overflow: unset;
  &.once {
    max-width: 500px;
  }
}
body .el-dialog.christmas-modal .el-dialog__body {
  &:before {
    content: "";
    background: url(img/modal-top.png) no-repeat center center;
    background-size: cover;
    position: absolute;
    left: -10px;
    right: -10px;
    height: 280px;
    top: -130px;
  }
  position: relative;
  background: url(img/modal-bg.png) no-repeat bottom center;
  background-size: 100% 100%;
  min-height: 530px;
  padding: 50px 50px 40px;
  /* padding: 210px 80px 0;
    margin-top: -120px; */
  .el-pagination.is-background .btn-next.is-active,
  .el-pagination.is-background .btn-prev.is-active,
  .el-pagination.is-background .el-pager li.is-active {
    background-color: #ff0000;
    color: #ffffff;
  }
  .el-pager li.is-active,
  .el-pager li:hover {
    color: #ff0000;
  }
}
body .el-dialog.prize-modal.once .el-dialog__body {
  background: url(img/modal-one.png) no-repeat center center;
  background-size: contain;
  min-height: 703px;
  /* padding: 200px 80px 0;
    margin-top: -120px; */
  padding: 200px 80px 0;
  .prizes {
    .prize {
      .imgball {
        width: 300px;
      }
    }
  }
  .redbar {
    background-size: cover;
    font-size: 20px;
  }
  .claimbtn {
    width: 250px;
  }
}
body .el-dialog.prize-modal.five .el-dialog__body {
  background: url(img/modal-five.png) no-repeat center center;
  background-size: contain;
  min-height: 640px;
  padding: 260px 80px 0;
}
</style>
