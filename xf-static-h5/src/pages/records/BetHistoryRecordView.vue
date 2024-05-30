<template>
  <div class="table-record">
    <div class="flex-div">
      <span class="select-stage">选择平台：</span>
      <q-select
        allowClear
        rounded
        outlined
        dense
        color="white"
        style="width: 200px;margin:10px auto 8px 8px;"
        v-model="platform"
        :options="platformsList"
        placeholder="选择平台"
        @update:model-value="searchRecord"
      >
      </q-select>
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
import {defineComponent, onMounted, ref, reactive} from "vue";
import RecordComponent from "../../components/RecordComponent.vue";
import {api} from "boot/axios";
import moment from "moment/moment";
import {userStore} from "src/stores";
import {cached} from "boot/cache";
import * as _ from "lodash"



const totalBetRecord = reactive({
  totalBet: 0,
  totalPayout: 0
});


var apiUrl= "/session/member/gameBetRecord";

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

const searchRecord = () => {
  tableData.value = [];
  isEnded.value = false;
  recordRef.value.clearTable();
  loadDepositTable(true);
}


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
    platform: platformName,
    memberId: store.id,
    size: 10,
    current: current.value
  };

  api.get(apiUrl, {
      params: paramData
    }
  ).then((res) => {
    maxPage.value = res.data.pages;
    totalBetRecord.totalBet = res.data.sums.totalBet;
    totalBetRecord.totalPayout = res.data.sums.totalPayout;
    tableData.value.push(...res.data.records);



  }).finally(() => {
    if (isNew) {
      visible.value = false;
    }
  });
};

const loadPlatformLists = () => {
  var platformApiUrl = store.hasToken()
    ? "/session/loggedInPlatform"
    : "/platform";
  var platformApiKey = store.hasToken() ? "LOGGEDPLATFORMS" : "PLATFORMS";


  cached.get(platformApiKey, () => api.get(platformApiUrl).then((response) => {
    return response
  })).then((data) => {
    console.log(data);
    _.each(data, function (item, index) {
      var option = {
        label: item.name,
        value: item.code,
      }
      platformsList.value.push(option);
    })

  });
}


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
  margin-right: 5px;

}
</style>
