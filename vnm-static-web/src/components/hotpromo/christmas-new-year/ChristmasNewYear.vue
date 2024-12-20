<template>
  <div class="christmas-new-year-container">
    <div class="el-loading-mask el-loading-mask-h" v-if="isLoading">
      <p class="spinner"><img src="@/components/hotpromo/christmas-new-year/img/spinner.png" /></p>
      <p class="loading-text">{{ $t('common.loading') }}...</p>
    </div>
    <!-- <div class="record-btn" @click="openModal('record')">
      {{ $t('promo.view_records') }}
    </div> -->
    <div class="title">
      {{ $t('promo.available_draw') }}: {{ availableDraw }}
    </div>
    <div class="prizes">
      <div @click="getGachapon" class="prize" v-for="prize in 6">
        <img src="@/components/hotpromo/christmas-new-year/img/claimbtn.png">
      </div>
    </div>
    <div class="terms">
      <!-- <div class="termtitle">{{ $t('promo.tnc') }}</div> -->
      <div class="termcontent" v-html="promoRules"></div>
    </div>
    <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" class="christmas-modal" v-model="isModal">
    <div class="inner-contents">
      <div class="modaltitle">
        <!-- <img src="../christmas-gachapon/img/side.png" /> -->
        {{ modalContent.title }}
        <!-- <img src="../christmas-gachapon/img/side.png" /> -->
      </div>
      <div v-if="modalContent.type === 'rule'" class="rules" v-html="rules"></div>
      <div class="table-scroll" v-if="modalContent.type === 'record'">
        <el-table :data="paginatedData" style="width: 100%;">
          <el-table-column prop="prizeNo" label="Mã số"></el-table-column>
          <el-table-column prop="bonusAmount" label="So Tien Thuong"></el-table-column>
          <el-table-column prop="loginName" label="Ten Dang Nhap"></el-table-column>
          <el-table-column prop="recordTime" label="Thời gian"></el-table-column>
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
  </el-dialog>
  <el-dialog
    :show-close="false"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    class="prize-modal"
    :class="{ five: prizes.length > 1, once: prizes.length <= 1 }"
    v-model="isPrizeModal"
    align-center
  >
    <div class="items">
      <div class="item" v-for="item in prizes">
        <!-- <div class="imgball"><img :src="require(`@/components/hotpromo/christmas-new-year/img/${prize.img}.png`)" /></div> -->
        <div class="redbar">{{ item.type }}</div>
      </div>
    </div>
    <div class="claimbtn" @click="getBalance()">
      <img src="@/components/hotpromo/christmas-new-year/img/claim.png" />
    </div>
  </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, defineProps, computed, reactive } from "vue";
import { useRouter } from 'vue-router';
import { initDrawEvent, getDrawPrizes, getDrawRecord } from "../../../api/index/promo";
import { ElMessage } from "element-plus";
import { userStore } from "@/store";
import moment from "moment";
import { useI18n } from "vue-i18n";

import i18n from "@/i18n/index";
const { t } = useI18n();
const props = defineProps(["promoCode", "promoRules"]);
const promoCode = ref(props.promoCode);
const promoRules = ref(props.promoRules);
const router = useRouter();
const availableDraw = ref(0);
const store = userStore();
const isModal = ref(false);

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
const modalContent = {};
const tableData = ref([])
const params = reactive({
  size: 30,
  current: 1
});
const onPageSizeChange = async () => {
  tableData.value = [];
  getDrawRecord(promoCode.value, params).then((res) => {
    if (res.code === 0) {
      totalItems.value = res.data.total;
      tableData.value = res.data.records;
    } else {
      ElMessage.error(res.message)
    }
  });
};
// Translate the table data
const translateTableData = (data) => {
  return data.map((row) => ({
    'prizeNo': row.prizeNo,          // Mã số
    'bonusAmount': row.bonusAmount, // Số tiền thưởng
    'loginName': row.loginName,   // Tên đăng nhập
    // bonusName: row.bonusAmount ? `Chúc mừng bạn đã nhận được ${row.bonusName} ${row.bonusAmount} tiền thưởng` : `Chúc mừng bạn đã nhận được ${row.bonusName}`,
    // status: statusTranslations[row.status] || row.status, // Use translation or fallback to original
    'recordTime': moment(row.recordTime).format("YYYY-MM-DD HH:mm:ss") // Format time
  }));
};

const statusTranslations = {
  PENDING: "Đang xử lý",
  CLAIMED: "Đã nhận"
};
const paginatedData = computed(() => {
  // Translate the data before pagination
  const translatedData = translateTableData(tableData.value);

  return translatedData; // Pagination on translated data
});
const totalItems = ref(0);
const isPrizeModal = ref(false);
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
            type: `Chúc mừng, bạn đã nhận được ${item.bonus} VNDP`
          }
          prizes.value.push(obj)
        });
        isPrizeModal.value = true;
      } else {
        prizes.value = [];
        var viMessage = '';
        if (res.code === 58100) {
          viMessage = 'Bạn chưa có hoặc đã sử dụng hết số lần mở quà'
        } else if (res.code === 58101) {
          viMessage = 'Bạn chưa có hoặc đã sử dụng hết số lần mở quà'
        } else if (res.code === 58102) {
          viMessage = 'Phần thưởng hôm nay đã phát hết rồi, ngày mai quay lại nhé'
        } else if (res.code === 58103) {
          viMessage = 'Bạn không đủ điều kiện để nhận thưởng'
        }  else if (res.code === 35013) {
          viMessage = 'Bạn không đủ điều kiện để nhận thưởng'
        } else if (res.code === 604) {
          viMessage = 'Vui lòng đăng nhập tài khoản để mở quà'
        } else {
          viMessage = i18n.global.t('response.' + res.code) || res.message
        }
        const obj = {
          type: viMessage
        }
        prizes.value.push(obj)
        if (viMessage) {
          isPrizeModal.value = true;
        }
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
    min-height: 1200px;
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
      width: 800px;
      min-height: 150px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top: 70px;
      font-size: 20px;
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
        width: 300px;
        height: 300px;
        background:url(img/present.png)no-repeat center center;
        background-size: contain;
        position: relative;
        cursor: pointer;
        img {
          position: absolute;
          bottom: 0px;
          left: 0;
          right: 0;
          margin: auto;
          width: 60%;
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
    }
  .modaltitle {
      min-height: 150px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top: 70px;
      font-size: 20px;
      color: #ffffff;
      font-weight: bold;
      margin: 0 auto 10px;
      background: url(img/title.png)no-repeat center center;
      background-size: contain;
  }
  }
</style>
<style lang="scss">
.christmas-new-year-container .terms {
  table {
    width: 100%;
    border-collapse: collapse;
    font-family: Arial, sans-serif;
    margin: 20px auto;
    text-align: center;
  }

  th, td {
    border: 1px solid #ddd;
    padding: 10px;
  }

  th {
    background-color: #b22222;
    color: #fff;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9; 
  }

  tr:hover {
    background-color: #f1f1f1; 
    transition: background-color 0.3s ease;
  }
}
body .el-dialog.christmas-modal .el-dialog__header .el-dialog__headerbtn .el-dialog__close, 
body .el-dialog.prize-modal.once .el-dialog__header .el-dialog__headerbtn .el-dialog__close {
  color: #ff0000;
}

body .el-dialog.christmas-modal {
  .el-table th.el-table__cell.is-leaf,
  .el-table--enable-row-transition .el-table__body td.el-table__cell {
    text-align: center;
  }
}
body .el-dialog.prize-modal.once {
  background: none;
  box-shadow: none;
}
body .el-dialog.prize-modal.once .el-dialog__body {
  transform: scale(1.25);
  background: url(img/modalbg.png) no-repeat center center;
  background-size: contain;
    min-height: 350px;
    padding: 0 10px;

  .items {
    .item {
      .imgball {
        width: 300px;
      }
    }
  }
  .redbar {
    font-size: 18px;
    width: 70%;
    max-width: 280px;
    color: #FBE696;
    text-align: center;
    margin: 0px auto;
    padding: 60px 35px 0;
    min-height: 165px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .claimbtn {
    width: 150px;
    position: absolute;
    bottom: 15px;
    margin: auto;
    left: 0;
    right: 0;
    cursor: pointer;
    img {
      width: 100%;
    }
  }
}
</style>