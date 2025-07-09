<template>
  <div class="table-record">
    <div class="search-bar">
      <div class="flex-div">区间</div>
      <div class="flex-div">
        <q-btn class="date-btn" flat>
          {{ startDate }}
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="startDate" mask="YYYY-MM-DD">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="关闭" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-btn>
        <!-- <q-input standout v-model="startDate">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
            </q-icon>
          </template>
        </q-input> -->
        <q-separator style="flex: 1" />
        <q-btn class="date-btn" flat>
          {{ endDate }}
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="endDate" mask="YYYY-MM-DD">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="关闭" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-btn>
        <!-- <q-input standout v-model="endDate">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="endDate" mask="YYYY-MM-DD">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="关闭" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input> -->
      </div>
      <div class="flex-div">平台</div>
      <div class="flex-div">
        <div class="platform-selector" @click="handlePlatformSelectionClick">
          {{ currentPlatformText }}
          <img src="../../assets/records/arrow-right-s-line.svg" />
        </div>
        <!-- <q-select
          clearable
          rounded
          outlined
          dense
          color="primary"
          v-model="platform"
          :options="platformsList"
          placeholder="选择平台"
          map-options
          @clear="platform = ''"
          @update:model-value="searchRecord"
        ></q-select> -->
      </div>
      <div class="flex-div">
        <q-btn class="search-btn" @click="searchRecord">搜寻</q-btn>
      </div>
    </div>
    <div class="payout-total">
      <div>总投注: {{ totalBetRecord.totalBet }}</div>
      <div>总派彩: {{ totalBetRecord.totalPayout }}</div>
      <!-- <div>总有效投注: {{ totalBetRecord.totalValidBet }}</div> -->
    </div>
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

    <BottomSheetPicker
      v-model="showPlatformSelectorDialog"
      :list="platformsList"
      :current="pendingPlatform"
      @confirm="handlePendingPlatformConfirmClick"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, onActivated, computed } from "vue";
import { api } from "boot/axios";
import { cached } from "boot/cache";
import { userStore } from "src/stores";
import moment from "moment/moment";
import RecordComponent from "../../components/RecordComponent.vue";
import BottomSheetPicker from "src/components/modal/BottomSheetPicker.vue";

const store = userStore();
const visible = ref(true);
const tableData = ref([]);

const searchRecord = () => {
  tableData.value = [];
  isEnded.value = false;
  recordRef.value.clearTable();
  loadDepositTable(true);
};

const isEnded = ref(false);
const showPlatformSelectorDialog = ref(false);

var apiUrl = "/session/member/gameBetRecordWithType";

var endDate = ref(moment().format("YYYY-MM-DD"));
var startDate = ref(moment().add(-7, "days").format("YYYY-MM-DD"));
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

const currentPlatformText = computed(() => {
  if (!platform.value) {
    return "全部平台";
  } else {
    return platform.value.label;
  }
});

const loadNewData = () => {
  if (maxPage.value > current.value) {
    current.value++;
  } else {
    current.value = 1;

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
    startDate: startDate.value,
    endDate: endDate.value,
    platform: "",
    gameType: "",
    platformName: "",
    memberId: store.id,
    size: 20,
    current: current.value
  };

  let selectedPlatform = platform.value ? (platform.value.value === "BBINDY" ? "BBIN" : platform.value.value) : "";
  if (selectedPlatform.includes("@")) {
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
    .finally(() => {
      if (isNew) {
        visible.value = false;
      }
    });
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
        var option = {
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
    key: "platform",
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
    key: "status",
    label: "投注状态"
  }
];

const handlePlatformSelectionClick = () => {
  showPlatformSelectorDialog.value = true;
};

const handlePendingPlatformConfirmClick = (selected) => {
  platform.value = selected;
};

onMounted(async () => {
  await loadPlatformLists();

  const startMonth = moment(startDate.value).format("MM");
  const endMonth = moment(endDate.value).format("MM");
  if (startMonth !== endMonth) {
    // If startDate and endDate are in the same month, take the latest month's data
    const latestMonthEnd = moment(endDate.value).endOf("month").format("YYYY-MM-DD");
    startDate.value = moment(latestMonthEnd).startOf("month").format("YYYY-MM-DD");
  }
  await loadDepositTable(true);
});
</script>
<style lang="scss" scoped>
.table-record {
  padding: 0 16px;
  .search-bar {
    background: #fcfdfe;
    padding: 12px;
    border-radius: 7px;
    margin-bottom: 20px;

    .flex-div {
      &:not(:last-child) {
        margin-bottom: 10px;
      }
      .platform-selector {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 7px 14px;
        background: #f7f8fb;
        box-shadow: 0px 0px 2.78px 0px #a9c9ea inset;
        border-radius: 7px;
        color: #424f72;
      }
      .search-btn {
        width: 100%;
        background: radial-gradient(103.75% 103.75% at 50% -3.75%, #94c3ff 0%, #4b91f5 100%);
        border: 1px solid #ffffff;
        box-shadow: 0px 2px 0px 0px #9ab0ff70;
        border-radius: 30px;
        padding: 12px 0;
        font-size: 16px;
        white-space: nowrap;
        color: #fff;
      }

      .date-btn {
        flex-basis: 45%;
        background: #f7f8fb;
        box-shadow: 0px 0px 2.78px 0px #a9c9ea inset;
        border-radius: 7px;
        padding: 7px 0;
        color: #424f72;
      }
    }
  }

  .payout-total {
    color: #7a80a1;
    > div {
      margin-bottom: 12px;
    }
  }
}
</style>
<style lang="scss">
.payout-total {
  margin-left: 24px;
  margin-right: 12px;
}

.flex-div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;

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
