<template>
  <div class="christmas-gachapon-container">
    <div class="q-loading-mask" v-if="isLoading">
      <p class="spinner"><img src="../../../assets/promo/christmas-gachapon/spinner.png" /></p>
      <p class="loading-text">加载中...</p>
    </div>
    <div class="snow-container">
      <div class="snowflake"></div>
      <div class="snowflake"></div>
      <div class="snowflake"></div>
      <div class="snowflake"></div>
      <div class="snowflake"></div>
    </div>
    <div class="promodetail" @click="openModal('detail')">
      <img src="../../../assets/promo/christmas-gachapon/details.png" />
    </div>
    <div class="promorule" @click="openModal('rule')">
      <img src="../../../assets/promo/christmas-gachapon/rules.png" />
    </div>
    <div class="promorecord" @click="openModal('record')">
      <img src="../../../assets/promo/christmas-gachapon/record.png" />
    </div>
    <div class="once" @click="getGachapon('once')"><img src="../../../assets/promo/christmas-gachapon/once.png" /></div>
    <div class="fivex" @click="getGachapon('five')">
      <img src="../../../assets/promo/christmas-gachapon/fivex.png" />
    </div>
    <div class="amtleft">
      抽奖次数剩余:
      <span>{{ availableDraw }}次</span>
    </div>
    <div class="tips">温馨提示：由于场馆人数火爆，投注记录会在10-20分钟内全部更新，请稍等片刻</div>
  </div>
  <q-dialog class="christmas-modal" v-model="isModal" align-center>
    <div class="title">
      <img src="../../../assets/promo/christmas-gachapon/side.png" />
      {{ modalContent.title }}
      <img src="../../../assets/promo/christmas-gachapon/side.png" />
    </div>
    <div class="inner-contents">
      <div v-if="modalContent.type === 'rule'" class="rules" v-html="rules"></div>
      <div class="table-scroll" v-if="modalContent.type === 'record'">
        <q-table
          flat
          bordered
          dense
          grid
          row-key="prizeNo"
          :rows="translatedTableData"
          :columns="columns"
          v-model:pagination="pagination"
          style="max-height: 200px"
        />
      </div>
      <!-- <div v-if="!isRules" class="row justify-center q-mt-md">
            <q-pagination
                v-model="pagination.page"
                color="grey-8"
                :max="pagesNumber"
                size="sm"
            />
            </div> -->
      <div class="details" v-if="modalContent.type === 'detail'">
        <div class="detailed-info">
          <div class="little-title">
            <div class="left">活动时间</div>
            <div class="right">2024.12.24-2025.1.7</div>
          </div>
          <div class="little-title">
            <div class="left">活动对象</div>
            <div class="right">全网会员</div>
          </div>
          <div class="little-title" style="justify-content: flex-start; align-items: flex-start">
            <div class="left">优惠详情</div>
            <div class="right" style="max-width: 73%">
              在2024.12.24-2025.1.7活动期间，每日投注额≥1000元及以上即可获得一次抽奖机会，每日可抽50次，活动周期内抽奖次数可累计。
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
                <img
                  src="../../../assets/images/promotion/hotpromo/lh1-blast-premier/game-bottom-left-btn.png"
                  alt=""
                  width="22px"
                />
                <span>示例</span>
              </div>
              会员A在2024年12月25日累计有效投注为20000元, 即可在优惠页面点击【立即抽奖】获得财富金,
              根据规则会员可获得5次抽奖机会, 奖金仅需5倍水即可出款
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-dialog>

  <q-dialog
    persistent
    class="prize-modal"
    :class="{ five: prizes.length > 1, once: prizes.length <= 1 }"
    v-model="isPrizeModal"
    align-center
  >
    <div class="prizes">
      <div class="prize" v-for="(prize, i) in prizes" :key="i">
        <div class="imgball"><img :src="require(`../../../assets/promo/christmas-gachapon/${prize.img}.png`)" /></div>
        <div class="redbar">{{ prize.type }}</div>
      </div>
    </div>
    <div class="claimbtn" @click="getBalance()">
      <img src="../../../assets/promo/christmas-gachapon/claim.png" />
    </div>
  </q-dialog>
</template>
<script setup>
import { onMounted, ref, defineProps, computed } from "vue";
import { useNotify } from "src/hooks/notify";
import { userStore } from "src/stores";
import moment from "moment";
import { initDrawEvent, getDrawPrizes, getDrawRecord } from "../../../api/promotion/christmasGachapon";
const store = userStore();
const isLoading = ref(false);
const props = defineProps(["promoCode", "promoRules"]);
const promoCode = ref(props.promoCode);
const rules = ref(props.promoRules);
const notify = useNotify();
const isModal = ref(false);
const isPrizeModal = ref(false);
const modalContent = {
  title: "",
  type: ""
};
const prizes = ref([]);
const availableDraw = ref(0);
const params = {
  size: 30,
  current: 1
};
// Pagination state
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: params.current,
  rowsPerPage: params.size
});

// Compute the number of pages
const pagesNumber = computed(() => Math.ceil(totalItems.value / pagination.value.rowsPerPage));

const totalItems = ref(0);
const openModal = (type) => {
  modalContent.type = type;
  if (type === "detail") {
    modalContent.title = "活动内容";
  } else if (type === "rule") {
    modalContent.title = "活动规则";
  } else if (type === "record") {
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
    modalContent.title = "活动记录";
  } else {
  }
  isModal.value = true;
};
const getGachapon = (t) => {
  // if (availableDraw.value === 0) {
  //   notify({
  //     type: "warning",
  //     message: `抽奖次数不足`
  //   });
  //   return;
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
      } else {
        notify({
          type: "error",
          message: `${res.message}`
        });
      }
    })
    .catch((error) => {
      // Handle error
      // notify({
      //     type: "error",
      //     message: `Error fetching prizes: ${error.message}`
      // });
      // console.error("Error fetching prizes:", error);
      // prizes.value = []
      // if (t === "five") {
      // prizes.value.push({
      //   img: "iphone",
      //   type: "IPhone16 256GB"
      // });
      // prizes.value.push({
      //   img: "iphone",
      //   type: "IPhone16 256GB"
      // });
      // prizes.value.push({
      //   img: "iphone",
      //   type: "IPhone16 256GB"
      // });
      // prizes.value.push({
      //   img: "iphone",
      //   type: "IPhone16 256GB"
      // });
      // prizes.value.push({
      //   img: "iphone",
      //   type: "IPhone16 256GB"
      // });
      // } else {
      //   prizes.value.push({
      //   img: "iphone",
      //   type: "IPhone16 256GB"
      // });
      // }
      // isPrizeModal.value = true
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
const columns = [
  { name: "prizeNo", label: "编号", align: "left", field: "prizeNo" },
  { name: "bonusName", label: "内容", align: "left", field: "bonusName" },
  { name: "recordTime", label: "时间", align: "left", field: "recordTime" }
  //   { name: "status", label: "状态", align: "left", field: "status" },
];
const tableData = ref([]);
// Status translation mapping
const statusTranslations = {
  PENDING: "待处理",
  CLAIMED: "已领取"
};
const translatedTableData = computed(() =>
  tableData.value.map((row) => ({
    ...row,
    bonusName: row.bonusAmount ? `恭喜获得${row.bonusName}${row.bonusAmount}元彩金` : `恭喜获得${row.bonusName}`,
    status: statusTranslations[row.status] || row.status, // Use translation or fallback to original
    recordTime: moment(row.recordTime).format("YYYY年MM月DD日 HH:mm:ss") // Format time
  }))
);

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
<style lang="scss">
.snow-container {
  position: relative;
  width: 100%;
  height: 100vh;
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
  //background: url(../../../assets/promo/christmas-gachapon/christmas-bg.png) no-repeat top left;
  background-size: 100%;
  width: 100%;
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding-bottom: 20vw;

  .q-loading-mask {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: #ffffff;
    z-index: 9999;
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
  .spinner {
    display: inline-block;
    width: 150px; /* Set the width of your PNG */
    height: 150px; /* Set the height of your PNG */
    overflow: hidden; /* Optional: Ensures content stays within the div */
  }
  .spinner img {
    width: 88%; /* Ensures the image scales properly */
    height: 88%;
    animation: spin 1.5s ease-in-out infinite;
  }

  .promodetail {
    top: 136vw;
    cursor: pointer;
    left: 33vw;
    position: absolute;
    // width: 35vw;
    width: 30vw;
    &:hover {
      filter: hue-rotate(340deg) saturate(2.5);
    }
  }
  .promorule {
    top: 155vw;
    cursor: pointer;
    left: 33vw;
    position: absolute;
    // width: 35vw;
    width: 30vw;
    &:hover {
      filter: hue-rotate(340deg) saturate(2.5);
    }
  }
  .promorecord {
    top: 171vw;
    cursor: pointer;
    left: 33vw;
    position: absolute;
    // width: 35vw;
    width: 30vw;
    &:hover {
      filter: hue-rotate(340deg) saturate(2.5);
    }
  }
  .once {
    top: 97vw;
    cursor: pointer;
    left: 15vw;
    position: absolute;
    width: 35vw;
    img {
      width: 100%;
    }
  }
  .fivex {
    top: 97vw;
    cursor: pointer;
    left: 50vw;
    position: absolute;
    width: 35vw;
    img {
      width: 100%;
    }
  }
  .amtleft {
    // bottom: 227px;
    top: 113vw;
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    left: 0;
    position: absolute;
    text-align: center;
    text-shadow: 1px 1px 3px #000000b3;
    width: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 217, 0, 0) 0%,
      rgba(255, 217, 0, 0.6) 52.5%,
      rgba(255, 217, 0, 0) 93.5%
    );

    span {
      color: #ffd900;
      text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
    }
  }
  .tips {
    // bottom: 227px;
    top: 120vw;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    left: 0;
    position: absolute;
    text-align: center;
    text-shadow: 1px 1px 3px #000000b3;
    width: 100%;
    span {
      color: #ffd900;
      text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
    }
  }
}

.christmas-modal {
  .title {
    text-align: center;
    margin: 10px auto;
    color: #1f774c;
    font-family: "PingFang", "Roboto", "-apple-system", "Helvetica Neue", "Microsoft YaHei", Helvetica, Arial,
      sans-serif;

    font-size: 20px;
    font-weight: 600;
    line-height: 44px;
    display: flex;
    gap: 5px;
    justify-content: center;
    align-items: center;
    img {
      width: 40px;
    }
  }
  .christmas-side {
    position: absolute;
    right: 20px;
    bottom: 0px;
  }

  .detailed-info-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .detailed-info-bottom-left-title {
      font-size: 12px;
      font-weight: 600;
      line-height: 22.4px;
      color: #ff0000;
    }
    .detailed-info-bottom-left-btn {
      font-size: 12px;
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
  .details {
    max-height: 60vh;
  }

  .detailed-info {
    width: 100%;
    height: 100%;
    border-radius: 12px;
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
      .left {
        filter: hue-rotate(150deg) saturate(3.5);
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
        display: inline-flex;
      }
      .right {
        font-size: 12px;
        font-weight: 400;
        line-height: 28px;
        color: #000000;
        display: inline;
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
      font-size: 12px;
      font-weight: 400;
      line-height: 28px;
      color: #fff;
      background: #f34e38;
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
      border: 1px solid #f34e3832;
      font-size: 12px;
      font-weight: 400;
      line-height: 16px;
      color: #000000;
    }
  }
}
.prize-modal {
  .prizes {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 1%;
    .prize {
      width: 30%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: flex-start;
      .imgball {
        width: 80px;
        img {
          width: 100%;
        }
      }
      .redbar {
        color: #f82f06;
        font-size: 12px;
        font-weight: 700;
        padding: 0;
        text-align: center;
        width: 100%;
        word-break: keep-all;
        width: 75%;
        margin: 0 auto;
      }
    }
  }
  .claimbtn {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 160px;
    margin: 10px auto 0;
    cursor: pointer;
    max-width: 160px;
    img {
      width: 100%;
      max-width: 200px;
      margin-top: 20px;
    }
  }
}
.christmas-modal .q-dialog__inner,
.prize-modal .q-dialog__inner {
  background: url(../../../assets/promo/christmas-gachapon/modal-bg.png) no-repeat center center;
  background-size: 100% 100%;
  padding: 120px 0 80px;
  max-height: 95vh;
  width: 95%;
  margin: 0 auto;
  align-self: center;
  display: flex;
  overflow: hidden;
  max-width: 350px;
  * {
    scrollbar-width: thin; /* Simplified width */
    scrollbar-color: #e6374a transparent; /* Thumb color, no track background */
  }
  > div {
    margin: 0 auto;
    overflow: auto;
    max-width: 340px;
    width: 80%;
  }
  .rules {
    height: 45vh;
    width: 95%;
    margin: auto;
    font-size: 14px;
    color: #333; // Default text color
    line-height: 1.6;
    padding: 10px 0;
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
  .q-table thead {
    position: sticky;
    top: 0;
    background-color: #fff; /* Ensure the header background is white */
    z-index: 1; /* Ensure it stays above the table body */
  }
  .q-table__grid-item-row {
    display: flex;
    gap: 15px;
    .q-table__grid-item-title {
      color: #e6374a;
      opacity: 1;
    }
  }
  /* Table header color */
  .custom-table .q-table__head {
    background: #f34e38;
    color: white;
  }

  /* Even rows color */
  .custom-table .q-table__row:nth-child(even) {
    background: #f34e3855; /* Light transparent red for even rows */
  }

  /* Optional: Style odd rows differently if needed */
  .custom-table .q-table__row:nth-child(odd) {
    background: white; /* or any other background color */
  }
  .table-scroll {
    height: 40vh;
    overflow: auto;
    position: relative;
  }
  .q-table__bottom--nodata {
    color: #ff0000;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30vh;
  }
}
.prize-modal.once .q-dialog__inner {
  padding: 140px 0 40px;
  background: url(../../../assets/promo/christmas-gachapon/modal-one.png) no-repeat center center;
  background-size: contain;
  justify-content: center;
  align-items: center;
  height: 540px;
  .prizes {
    .prize {
      width: unset;
      .imgball {
        width: 200px;
      }
    }
  }
  .redbar {
    font-size: 16px;
  }
  > div {
    overflow: unset;
  }
}
.prize-modal.five .q-dialog__inner {
  padding: 140px 0 40px;
  background: url(../../../assets/promo/christmas-gachapon/modal-one.png) no-repeat center center;
  background-size: contain;
  justify-content: center;
  align-items: center;
  height: 540px;
  .prizes {
    align-items: flex-start;
    .prize {
      width: 30%;
      align-items: center;
      .imgball {
        width: 100%;
      }
    }
  }
  > div {
    overflow: unset;
  }
}
</style>
