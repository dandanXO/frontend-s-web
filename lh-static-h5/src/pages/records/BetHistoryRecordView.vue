<template>
  <q-dialog class="selection-modal" v-model="selectionRef" position="bottom">
    <div class="selection-modal-wrapper">
      <div class="selection-header">
        <div class="select-cancel" v-close-popup>取消</div>
        <div class="select-confirm" @click="searchRecord()" v-close-popup>确认</div>
      </div>
      <Swiper
        class="swiper-container"
        :slides-per-view="5"
        :loop="false"
        :pagination="false"
        :direction="'vertical'"
        @swiper="onSwiper"
      >
        <SwiperSlide v-for="(e, i) in platformsList" :key="`${e}-${i}`" class="swiper-slide">
          <div class="slide-item" @click="onSlideClick(i)">
            <div :class="getLabelClass(i)">
              {{ e.label }}
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </q-dialog>
  <div class="table-record">
    <div class="flex-div">
      <span class="select-stage">选择平台：</span>
      <q-select
        clearable
        rounded
        outlined
        dense
        color="primary"
        style="width: 320px; margin: 10px auto 8px; color: #000"
        v-model="platform"
        :options="platformsList"
        placeholder="选择平台"
        map-options
        @clear="platform = ''"
        @update:model-value="searchRecord"
      ></q-select>

      <div class="payout-total">
        <div>
          <span style="width: 80px; display: inline-block">总投注:</span>
          {{ totalBetRecord.totalBet }}
        </div>
        <div>
          <span style="width: 80px; display: inline-block">总派彩:</span>
          {{ totalBetRecord.totalPayout }}
        </div>
        <div>
          <span style="width: 80px; display: inline-block">总有效投注:</span>
          {{ totalBetRecord.totalValidBet }}
        </div>
      </div>
    </div>

    <RecordDateFilter class="q-my-sm" :startDate="startDate" :endDate="endDate" @handleDateChange="searchRecord" />

    <!--    <div class="select-btn">-->
    <!--      <q-btn class="common-large-btn" label="点击选择平台" @click="showSelection" />-->
    <!--    </div>-->

    <RecordComponent
      ref="recordRef"
      recordType="bethistory"
      :loading="visible"
      :list="tableData"
      :headers="tableHeaders"
      @loadnewdata="loadNewData"
      :isEnded="isEnded"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, onActivated } from "vue";
import { api } from "boot/axios";
import { cached } from "boot/cache";
import { userStore } from "src/stores";
import moment from "moment";
import RecordComponent from "../../components/RecordComponent.vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper-bundle.css";
import RecordDateFilter from "src/components/RecordDateFilter.vue";

const store = userStore();

const selectionRef = ref(false);
const showSelection = () => {
  selectionRef.value = true;
};

const swiperInstance = ref();
const onSwiper = (swiper) => {
  swiperInstance.value = swiper;
};

const selectedPlatformIndex = ref(0);
const onSlideClick = (i) => {
  // set value
  selectedPlatformIndex.value = i;

  // set color

  // set scroll position
  const centeredIndex = i - 2;
  swiperInstance.value.slideTo(centeredIndex);
};

const getLabelClass = (i) => {
  const difference = Math.abs(selectedPlatformIndex.value - i);
  if (!difference) return "active-text";
  else if (difference === 1) return "almost-active-text";
  else return "inactive-text";
};

const visible = ref(true);
const tableData = ref([]);

const searchRecord = (data) => {
  const { val, isStartDate } = data;
  if (isStartDate !== undefined && val !== undefined) {
    isStartDate ? (startDate = val) : (endDate = val);
  }

  tableData.value = [];
  current.value = 1;
  isEnded.value = false;
  recordRef.value.clearTable();
  loadDepositTable(true);
};

const isEnded = ref(false);

var apiUrl = "/session/member/gameBetRecordWithType";
var getRecordTotalApiUrl = "/session/member/gameBetRecordTotal";

var endDate = reactive(moment().format("YYYY-MM-DD"));
var startDate = reactive(moment().add(-7, "days").format("YYYY-MM-DD"));
var current = ref(1);
var maxPage = ref(0);
const platformsList = ref([]);
const platform = ref("");
const recordRef = ref();
const totalBetRecord = reactive({
  totalBet: 0,
  totalPayout: 0,
  totalValidBet: 0
});
const loadNewData = () => {
  if (maxPage.value > current.value) {
    current.value++;
  } else {
    current.value = 1;
    // endDate = moment(startDate).add(-1, "days").format("YYYY-MM-DD");
    // console.log(endDate);

    // startDate = moment(endDate).add(-7, "days").format("YYYY-MM-DD");
    // console.log(startDate);

    // const startMonth = moment(startDate).format("MM");
    // const endMonth = moment(endDate).format("MM");
    // if (startMonth !== endMonth) {
    //   // If startDate and endDate are in the same month, take the latest month's data
    //   const latestMonthEnd = moment(endDate).endOf("month").format("YYYY-MM-DD");
    //   startDate = moment(latestMonthEnd).startOf("month").format("YYYY-MM-DD");
    // }

    // if (endDate <= moment().add(-29, "days").format("YYYY-MM-DD")) {
    //   console.log("mor than 3 months");
    //   isEnded.value = true;
    //   return;
    // }
    isEnded.value = true;
    return;
  }
  loadDepositTable(false);
};

const loadDepositTable = (isNew) => {
  if (isNew) {
    visible.value = true;
  }

  let paramData = {
    startDate: startDate,
    endDate: endDate,
    platform: "",
    gameType: "",
    platformName: "",
    memberId: store.id,
    size: 10,
    current: current.value
  };

  let selectedPlatform = platform.value ? (platform.value.value === "BBINDY" ? "BBIN" : platform.value.value) : "";
  if (selectedPlatform && selectedPlatform.includes("@")) {
    const platformArr = selectedPlatform.split("@");
    paramData.platform = platformArr[0];
    paramData.gameType = platformArr[1];
    paramData.platformName = platformArr[2];
  } else {
    paramData.platform = "";
    paramData.gameType = "";
    paramData.platformName = null;
  }

  api
    .get(apiUrl, {
      params: paramData
    })
    .then((res) => {
      maxPage.value = res.data.pages;
      totalBetRecord.totalBet = res.data.sums.totalBet;
      totalBetRecord.totalPayout = res.data.sums.totalPayout;
      totalBetRecord.totalValidBet = res.data.sums.totalValidBet;
      tableData.value.push(...res.data.records);
    })
    .catch(() => {
      isEnded.value = true;
    })
    .finally(() => {
      if (isNew) {
        visible.value = false;
      }
    });

  // const obj = {
  //   memberId: store.id,
  //   platform: platformName,
  //   startDate: startDate,
  //   endDate: endDate
  // };
  // api
  //   .get(getRecordTotalApiUrl, {
  //     params: obj
  //   })
  //   .then((res) => {
  //     totalBetRecord.totalBet = res.data.totalBet;
  //     totalBetRecord.totalPayout = res.data.totalPayout;
  //   });
};

const getGameName = (gameName) => {
  if (!gameName) {
    return "";
  }

  switch (gameName) {
    case "IMES":
      return "IM电竞";
    case "TCG":
      return "TCG彩票";
    case "MGP":
      return "MG电子";
    case "CQ9":
      return "CQ电子";
    case "SABA":
      return "沙巴体育";
    case "TFGaming":
      return "雷火电竞 ";
    case "SW":
      return "SW电子";
    case "GPS":
      return "GPS捕鱼";
    case "PMFISH":
      return "DB捕鱼";
    case "IA":
      return "小艾电竞 ";
    case "DT":
      return "大唐棋牌";
    case "IM":
      return "IM体育";
    case "BBIN":
      return "BBIN真人";
    case "KY":
      return "开元棋牌";
    case "PT":
      return "PT电子";
    case "PG":
      return "PG电子";
    case "AG":
      return "PA真人, PA电子";
    case "AGF":
      return "PA捕鱼";
    case "ALLBET":
      return "ALLBET真人";
    case "GFLC":
      return "高登棋牌";
    case "LEG":
      return "乐游棋牌";

    default:
      return gameName;
  }
};

const loadPlatformLists = () => {
  platformsList.value = [];
  cached
    .get("PLATFORMSTYPES", () =>
      api.get("/platformWithType").then((response) => {
        return response;
      })
    )
    .then((data) => {
      platformsList.value.push({
        label: "全部平台",
        value: ""
      });

      data.forEach((item) => {
        const option = {
          // label: getGameName(item.name),
          label: item.alias,
          value: item.code + "@" + item.gameType + "@" + item.alias
        };
        platformsList.value.push(option);
      });
    });
};

const tableHeaders = [
  {
    key: "transactionId",
    label: "注单号"
  },
  {
    key: "betTime",
    label: "游戏时间"
  },
  {
    key: "alias",
    label: "游戏平台"
  },
  {
    key: "bet",
    label: "投注"
  },
  {
    key: "payout",
    label: "派彩"
  },
  {
    key: "gameType",
    label: "游戏类型"
  },
  {
    key: "betStatus",
    label: "投注状态"
  }
];

onMounted(async () => {
  await loadPlatformLists();

  const startMonth = moment(startDate).format("MM");
  const endMonth = moment(endDate).format("MM");
  if (startMonth !== endMonth) {
    // If startDate and endDate are in the same month, take the latest month's data
    const latestMonthEnd = moment(endDate).endOf("month").format("YYYY-MM-DD");
    startDate = moment(latestMonthEnd).startOf("month").format("YYYY-MM-DD");
  }
  await loadDepositTable(true);
});
</script>

<style lang="scss">
.payout-total {
  margin-left: 24px;
  margin-right: 12px;
}

.table-record {
  width: 100%;
  gap: 10px;

  .select-platform {
    display: none;
  }

  .select-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1rem auto;

    .q-btn {
      width: 95%;
    }
  }

  .q-card {
    color: rgb(0, 0, 0) !important;
    background: rgb(255, 255, 255) !important;
  }

  .label {
    color: #000;
  }

  .q-btn {
    font-size: 11px !important;
  }
}

.selection-modal {
  .selection-modal-wrapper {
    width: 100%;
    background: $white;
    box-shadow: 0px 4px 6px 0px #c3d4e6 inset;
    border-radius: 10px;
    padding: 1.25rem;

    .selection-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 0 1.5rem 0;

      .select-cancel {
        color: $font-1;
        font-size: 1.1rem;
        font-weight: 600;
      }

      .select-confirm {
        color: #468cff;
        font-size: 1.1rem;
        font-weight: 600;
      }
    }

    .swiper-container {
      height: 15rem;

      .swiper-wrapper {
        .slide-item {
          font-size: 1rem;
          font-weight: 400;
          border-top: 1px solid #ecedf0;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;

          .active-text {
            color: $font-2;
          }

          .almost-active-text {
            color: rgba(66, 79, 114, 0.5);
          }

          .inactive-text {
            color: rgba(66, 79, 114, 0.3);
          }
        }
      }
    }
  }
}

.flex-div {
  display: flex;
  align-items: center;
  justify-content: space-between;

  span {
    font-size: 14px;
    padding-left: 5px;
    min-width: 50px;

    &:nth-child(3) {
      margin-left: 10px;
    }

    &.select-stage {
      min-width: 80px;
    }
  }
}

.payout-total {
  width: 240px;
}
</style>
