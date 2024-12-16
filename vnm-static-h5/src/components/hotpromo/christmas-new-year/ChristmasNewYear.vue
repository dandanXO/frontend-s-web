<template>
  <div class="christmas-new-year-container">
    <div class="el-loading-mask el-loading-mask-h" v-if="isLoading">
      <p class="spinner"><img src="@/components/hotpromo/christmas-new-year/img/spinner.png" /></p>
      <p class="loading-text">Đang tải...</p>
    </div>
    <div class="record-btn" @click="openModal('record')">
      Xem hồ sơ
    </div>
    <div class="title">
      Tổng số lần rút thăm：{{ availableDraw }}
    </div>
    <div class="prizes">
      <div @click="getGachapon" class="prize" v-for="prize in 6" :key="prize">
        <img src="@/components/hotpromo/christmas-new-year/img/claimbtn.png">
      </div>
    </div>
    <div class="terms">
      <div class="termtitle">Điều khoản và điều kiện</div>
      <div class="termcontent" v-html="promoRules"></div>
    </div>
    <!-- <router-link to="/promotion?name=trotaidudoan-asean2024"  @click="handlePromoClick('trotaidudoan-asean2024')">
      <img src="@/components/hotpromo/asean2024/img/1.png">
    </router-link>
    <router-link to="/promotion?name=dudoan-asean2024">
      <img src="@/components/hotpromo/asean2024/img/2.png"  @click="handlePromoClick('dudoan-asean2024')">
    </router-link>
    <router-link to="/promotion?name=baohiemvon-20%asean"  @click="handlePromoClick('baohiemvon-20%asean')">
      <img src="@/components/hotpromo/asean2024/img/3.png">
    </router-link> -->
    
  <q-dialog class="christmas-modal" v-model="isModal" align-center>
    <div class="inner-contents">
      <div class="modaltitle">
        <!-- <img src="../christmas-gachapon/img/side.png" /> -->
        {{ modalContent.title }}
        <!-- <img src="../christmas-gachapon/img/side.png" /> -->
      </div>
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
    </div>
    <!-- <div class="details" v-if="modalContent.type === 'detail'">
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
    </div> -->
  </q-dialog>
  <q-dialog
    persistent
    class="prize-modal"
    :class="{ five: prizes.length > 1, once: prizes.length <= 1 }"
    v-model="isPrizeModal"
    align-center
  >
    <div class="items">
      <div class="item" v-for="item in prizes" :key="item">
        <!-- <div class="imgball"><img :src="require(`@/components/hotpromo/christmas-new-year/img/${prize.img}.png`)" /></div> -->
        <div class="redbar">Chúc mừng, bạn đã nhận được {{ item.type }} tiền thưởng</div>
      </div>
    </div>
    <div class="claimbtn" @click="getBalance()">
      <img src="@/components/hotpromo/christmas-new-year/img/claim.png" />
    </div>
  </q-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, defineProps, computed, reactive } from "vue";
import { useRouter } from 'vue-router';
import { initDrawEvent, getDrawPrizes, getDrawRecord } from "../../../api/index/promo";
import { useQuasar } from "quasar";
import { userStore } from "src/stores";
import moment from "moment";
const props = defineProps(["promoCode", "promoRules"]);
const promoCode = ref(props.promoCode);
const promoRules = ref(props.promoRules);
const router = useRouter();
const availableDraw = ref(0);
const store = userStore();
const isModal = ref(false);
const $q = useQuasar();

const init = () => {
  initDrawEvent(promoCode.value).then((res) => {
    if (res.code === 0) {
      availableDraw.value = res.data.availableDraw;
    }
  });
};
const getBalance = () => {
  store.getBalance();
  init();
  isPrizeModal.value = false;
};
const isLoading = ref(false);
const prizes = ref([]);
const isPrizeModal = ref(false);
const modalContent = {};
const tableData = ref([])
const params = reactive({
  size: 30,
  current: 1
});

const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: params.current,
  rowsPerPage: params.size
});

const statusTranslations = {
  PENDING: "Đang xử lý",
  CLAIMED: "Đã nhận"
};

const translatedTableData = computed(() =>
  tableData.value.map((row) => ({
    ...row,
    bonusName: row.bonusAmount ? `Chúc mừng bạn đã nhận được ${row.bonusName} ${row.bonusAmount} tiền thưởng` : `Chúc mừng bạn đã nhận được ${row.bonusName}`,
    status: statusTranslations[row.status] || row.status, // Use translation or fallback to original
    recordTime: moment(row.recordTime).format("YYYY-MM-DD HH:mm:ss") // Format time
  }))
);

const totalItems = ref(0);
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
    modalContent.title = "Lịch sử hoạt động";
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
  // Simulating an async operation (e.g., an API call) with a Promise.
  getDrawPrizes(promoCode.value, 1) // Replace this with your actual async operation (e.g., an API call)
    .then((res) => {
      if (res.code === 0) {
        prizes.value = [];
        res.data.forEach((item) => {
          const obj = {
            type: item.bonus
          }
          prizes.value.push(obj)
        });
        isPrizeModal.value = true;
      } else {
        $q.notify({
          type: 'error',
          message: res.message
        })
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
onMounted(() => {
  init();
});
</script>
<style scoped lang="scss">
  
@keyframes spin {
  from {
    transform: rotate(0deg); /* Start with no rotation */
  }
  to {
    transform: rotate(360deg); /* Complete a full rotation */
  }
}
  .christmas-new-year-container {
    display: flex;
    gap: 15px;
    justify-content: flex-start;
    box-shadow: 0px 0px 4px 0px #01497B0F;
    border-radius: 12px;
    width: 100%;
    max-width: 1050px;
    padding: 50px 20px;
    margin: 0 auto;
    flex-direction: column;
    border: 1px solid #ACD4F6;
    background: #F2F8FE;
    position: relative;
    .spinner {
    display: inline-block;
    width: 150px; /* Set the width of your PNG */
    height: 150px; /* Set the height of your PNG */
    overflow: hidden; /* Optional: Ensures content stays within the div */
  }
  .el-loading-mask-h {
    display: flex;
    position: absolute;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: #ffffff;
    overflow: hidden;
    z-index: 1;
    height: 100%;
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
    .record-btn {
      display: flex;
      align-self: flex-end;
      background: #FF0000;
      color: #ffffff;
      font-weight: 600;
      cursor: pointer;
      padding: 8px 20px;
      border-radius: 10px;
      border: 4px solid green;
      position: absolute;
      right: 20px;
      top: 20px;
    }
    .title {
      width: 330px;
      min-height: 150px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top: 60px;
      font-size: 17px;
      color: #ffffff;
      font-weight: bold;
      margin: 0 auto;
      background: url(img/title.png)no-repeat center center;
      background-size: contain;
    }
    .prizes {
      display: flex;
      gap: 10px;
      justify-content: space-evenly;
      flex-wrap: wrap;
      .prize {
        width: 30%;
        height: 30vw;
        background:url(img/present.png)no-repeat center center;
        background-size: contain;
        position: relative;
        cursor: pointer;
        img {
          position: absolute;
          bottom: 7px;
          left: 0;
          right: 0;
          margin: auto;
          width: 70% !important;
        }
      }
    }
    .terms {
      border-radius: 12px;
      border: 1px solid #ACD4F6;
      box-shadow: 0px 0px 4px 0px #01497B0F;
      background: #FFFFFF;
      width: 95%;
      margin: 10px auto;
      padding: 20px;
      .termtitle {
        color: #CB162A;
        font-weight: 600;
        font-size: 28px;
      }
      .termcontent {
        font-size: 20px;
      }
    }
  }
</style>
<style lang="scss">
.christmas-modal {
  .modaltitle {
      min-height: 150px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top: 70px;
      font-size: 20px;
      color: #ffffff;
      font-weight: bold;
      margin: 0 auto 20px;
      background: url(img/title.png)no-repeat center center;
      background-size: contain;
      position: sticky;
      top: 0;
      z-index: 2;
      background-color: white;
  }
  .title {
    text-align: center;
    margin: 10px auto;
    color: #1f774c;
    font-family: PingFang;
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
    }
  }
}
.christmas-modal .q-dialog__inner {
  background: #ffffff;
  background-size: 100% 100%;
  height: 90vh;
  justify-content: center;
  align-items: flex-start;
  width: 95%;
  margin: auto;
  > div {
    height: 100%;
  }
}
.prize-modal .q-dialog__inner {
  background: url(../christmas-new-year/img/modalbg.png) no-repeat center center;
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
    // width: 80%;
    margin: 0 auto;
    overflow: auto;
    max-width: 340px;
    width: 95%;
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
  padding: 200px 0 40px;
  background: url(../christmas-new-year/img/modalbg.png) no-repeat center center;
  background-size: contain;
  justify-content: center;
  align-items: flex-start;
  height: 540px;
  
  .claimbtn {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px auto 0;
    cursor: pointer;
    width: 250px;
    position: absolute;
    bottom: 40px;
    img {
      width: 100%;
    }
  }
  .prizes {
    .prize {
      width: unset;
      .imgball {
        width: 200px;
      }
    }
  }
  .redbar {
    font-size: 26px;
    width: 100%;
    max-width: 400px;
    color: #FBE696;
    text-align: center;
    margin: -50px auto 0;
  }
  > div {
    overflow: unset;
  }
}
.prize-modal.five .q-dialog__inner {
  padding: 140px 0 40px;
  background: url(../christmas-new-year/img/modalbg.png) no-repeat center center;
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