<template>
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
        <div>总投注: {{ totalBetRecord.totalBet }}</div>
        <div>总派彩: {{ totalBetRecord.totalPayout }}</div>
        <div>总有效投注: {{ totalBetRecord.totalValidBet }}</div>
      </div>
    </div>
    <div class="flex-div">
      <span>开始：</span>
      <q-input rounded outlined dense v-model="startDate">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="startDate" mask="YYYY-MM-DD" @update:model-value="searchRecord">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="关闭" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <span>结束：</span>
      <q-input rounded outlined dense v-model="endDate">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="endDate" mask="YYYY-MM-DD" @update:model-value="searchRecord">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="关闭" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
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
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, onActivated } from "vue";
import { api } from "boot/axios";
import { cached } from "boot/cache";
import { userStore } from "src/stores";
import moment from "moment/moment";
import RecordComponent from "../../components/RecordComponent.vue";

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

var apiUrl = "/session/member/gameBetRecordWithType";

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
