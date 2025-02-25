<template>
  <div class="table-record q-pa-md">
    <div class="flex-div">
      <!-- <span class="select-stage">选择平台：</span> -->
      <q-select
        allowClear
        dense
        style="width: 100%"
        v-model="platform"
        :options="platformsList"
        placeholder="选择平台"
        @update:model-value="searchRecord"
        outlined
        color="white"
        bg-color="roundedinputstyle"
      >
        <template v-slot:prepend><span>选择平台:</span></template>
      </q-select>
    </div>

    <RecordDateFilter class="q-my-sm" :startDate="startDate" :endDate="endDate" @handleDateChange="searchRecord" />

    <div class="payout-total flex-div">
      <div class="rounded-payout">总投注: {{ totalBetRecord.totalBet }}</div>
      <div class="rounded-payout">总有效投注: {{ totalBetRecord.totalValidBet }}</div>
      <div class="rounded-payout">总派彩: {{ totalBetRecord.totalPayout }}</div>
    </div>

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
import { defineComponent, onMounted, ref, reactive } from "vue";
import RecordComponent from "../../components/RecordComponent.vue";
import { api } from "boot/axios";
import moment from "moment/moment";
import { userStore } from "src/stores";
import { cached } from "boot/cache";
import * as _ from "lodash";
import RecordDateFilter from "src/components/RecordDateFilter.vue";

const totalBetRecord = reactive({
  totalBet: 0,
  totalPayout: 0,
  totalValidBet: 0
});

var apiUrl = "/session/member/gameBetRecordWithType";

var endDate = reactive(moment().format("YYYY-MM-DD"));
var startDate = reactive(moment().add(-7, "days").format("YYYY-MM-DD"));
var current = ref(1);
var maxPage = ref(0);

const store = userStore();
const visible = ref(true);
const tableData = ref([]);
const recordRef = ref();

const platform = ref("");
const platformsList = ref([]);
const isEnded = ref(false);

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

  console.log(startDate);
  console.log(endDate);

  var platformName = platform.value ? platform.value.value : "";
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
    .finally(() => {
      if (isNew) {
        visible.value = false;
      }
    });
};

const loadPlatformLists = () => {
  var platformApiUrl = "/platformWithType";
  var platformApiKey = "PLATFORMSTYPES";

  cached
    .get(platformApiKey, () =>
      api.get(platformApiUrl).then((response) => {
        return response;
      })
    )
    .then((data) => {
      console.log(data);
      _.each(data, function (item, index) {
        var option = {
          label: item.alias,
          value: item.code + "@" + item.gameType + "@" + item.alias
        };

        platformsList.value.push(option);
      });
      platformsList.value.push({
        label: "全部平台",
        value: ""
      });
      platform.value = { label: "全部平台", value: "" };
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
.table-record {
  width: 100%;
  gap: 10px;

  .q-card {
    background: rgb(33, 37, 52);
    color: rgb(186, 206, 241);
  }

  .label {
    color: #fff;
  }

  .q-btn {
    font-size: 11px !important;
  }
}

.flex-div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  span {
    font-size: 14px;
    min-width: 50px;

    &.select-stage {
      min-width: 80px;
    }
  }
}

.payout-total {
  margin-right: 5px;
  gap: 12px;

  .rounded-payout {
    border-radius: 24px;
    padding: 8px 16px;
    width: 100%;
    background-color: #222d49;
    color: #a3a7af;
    text-align: center;
    white-space: nowrap;
  }
}
</style>
