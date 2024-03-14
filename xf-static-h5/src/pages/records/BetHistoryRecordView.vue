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
<script lang="js">
import {defineComponent, onMounted, ref, reactive} from "vue";
import RecordComponent from "../../components/RecordComponent.vue";
import {api} from "boot/axios";
import moment from "moment/moment";
import {userStore} from "src/stores";
import {cached} from "boot/cache";
import * as _ from "lodash"

export default defineComponent({
  name: "BetHistoryRecordView",
  components: {
    RecordComponent
  },
  setup() {

    const totalBetRecord = reactive({
      totalBet: 0,
      totalPayout: 0
    });

    const store = userStore();
    const visible = ref(true);
    const tableData = ref([]);
    const recordRef = ref();

    const searchRecord = () => {
      // console.log("searchRecord");

      recordRef.value.clearTable();

      endDate = moment().format("YYYY-MM-DD");
      startDate = moment().add(-7, "days").format("YYYY-MM-DD");
      loadDepositTable(true);
    }

    const platform = ref("");

    const isEnded = ref(false);

    var apiUrl = "/session/member/gameBetRecord";


    var endDate = moment().format("YYYY-MM-DD");
    var startDate = moment().add(-7, "days").format("YYYY-MM-DD");

    const loadNewData = () => {
      startDate = moment(startDate).add(-7, "days").format("YYYY-MM-DD");
      // console.log(startDate);

      endDate = moment(endDate).add(-7, "days").format("YYYY-MM-DD");
      // console.log(endDate);

      if (startDate <= moment().add(-30, "days").format("YYYY-MM-DD")) {
        console.log("mor than 3 months");
        isEnded.value = true;
        return;
      }
      loadDepositTable(false);
    };

    const platformsList = ref([]);

    const loadDepositTable = (isNew = true) => {
      console.log("CHeck");
      console.log(platform.value);

      if (isNew) {
        visible.value = true;
        tableData.value = [];
        isEnded.value = false;
      }
      console.log(startDate);
      console.log(endDate);

      var platformName = platform.value ? platform.value.value : "";

      let paramData = {
        "startDate": startDate,
        "endDate": endDate,
        "platform": platformName,
        "memberId": store.id
      };

      api.get(apiUrl, {
          params: paramData
        }
      ).then((res) => {
        if (res.data.records.length > 0) {
          tableData.value.push(...res.data.records);
        }
        totalBetRecord.totalBet = res.data.sums.totalBet;
        totalBetRecord.totalPayout = res.data.sums.totalPayout;

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
      await loadDepositTable();
    });

    return {
      tableData,
      visible,
      tableHeaders,
      loadNewData,
      isEnded,
      searchRecord,
      platformsList,
      recordRef,
      platform,
      totalBetRecord
    };
  }
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
