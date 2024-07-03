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

var apiUrl = "/session/member/gameBetRecord";

var endDate = reactive(moment().format("YYYY-MM-DD"));
var startDate = reactive(moment().add(-7, "days").format("YYYY-MM-DD"));
var current = ref(1);
var maxPage = ref(0);

const platformsList = ref([]);
const platform = ref("");
const recordRef = ref();
const totalBetRecord = reactive({
  totalBet: 0,
  totalPayout: 0
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

  var platformName = platform.value ? (platform.value.value === "BBINDY" ? "BBIN" : platform.value.value) : "";
  let paramData = {
    startDate: startDate,
    endDate: endDate,
    platform: platformName,
    memberId: store.id,
    size: 20,
    current: current.value
  };

  api
    .get(apiUrl, {
      params: paramData
    })
    .then((res) => {
      maxPage.value = res.data.pages;
      totalBetRecord.totalBet = res.data.sums.totalBet;
      totalBetRecord.totalPayout = res.data.sums.totalPayout;
      tableData.value.push(...res.data.records);
    })
    .finally(() => {
      if (isNew) {
        visible.value = false;
      }
    });

  const obj = {
    memberId: store.id,
    platform: platformName,
    startDate: startDate,
    endDate: endDate
  };
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
      return "SABA体育";
    case "TFGaming":
      return "DY电竞 ";
    case "SW":
      return "SW电子";
    case "GPS":
      return "GPS捕鱼";
    case "PMFISH":
      return "DB捕鱼";
    case "IA":
      return "小艾电竞 ";
    case "LEG":
      return "乐游棋牌";
    case "DT":
      return "大唐棋牌";
    case "IM":
      return "IM体育";
    case "BBIN":
      return "BBIN真人, BBIN电子, BBIN彩票";
    case "KY":
      return "开元棋牌";
    case "PT":
      return "PT电子";
    case "PG":
      return "PG电子";
    case "AG":
      return "AG真人, XIN电子";
    case "AGF":
      return "AG捕鱼";
    case "ALLBET":
      return "ALLBET真人";

    default:
      return gameName;
  }
};

const loadPlatformLists = () => {
  platformsList.value = [];
  cached
    .get("LOGGEDPLATFORMS", () =>
      api.get("/session/loggedInPlatform").then((response) => {
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
          label: getGameName(item.name),
          value: item.code
        };
        platformsList.value.push(option);
      });
    });
};

const tableHeaders = [
  {
    key: "betId",
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
