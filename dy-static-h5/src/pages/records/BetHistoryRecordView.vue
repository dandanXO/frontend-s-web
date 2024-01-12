<template>
  <div class="table-record">
    <div class="flex-div">
      <span>选择平台：</span>
      <q-select
        allowClear
        rounded
        outlined
        dense
        color="primary"
        style="width: 320px; margin: 10px auto 8px; color: #000"
        v-model="platform"
        :options="platformsList"
        placeholder="选择平台"
        @update:model-value="searchRecord"
      ></q-select>
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
import {defineComponent, onActivated, onMounted, ref} from "vue";
import RecordComponent from "../../components/RecordComponent.vue";
import { api } from "boot/axios";
import moment from "moment/moment";
import { userStore } from "src/stores";
import {cached} from "boot/cache";
import * as _ from "lodash"
import {translateRecord} from "src/directives/translate";


export default defineComponent({
  name: "BetHistoryRecordView",
  components: {
    RecordComponent
  },
  setup() {

    const store = userStore();
    const visible = ref(true);
    const tableData = ref([]);

    const isEnded = ref(false);

    var apiUrl= "/session/member/gameBetRecord";

    var endDate = moment().format("YYYY-MM-DD");
    var startDate = moment().add(-7, "days").format("YYYY-MM-DD");
    var current = ref(1);
    var maxPage = ref(0);

    const platformsList = ref([]);
    const platform = ref("");
    const recordRef = ref();

    const loadNewData = () => {
      if(maxPage.value > current.value){
        current.value++;
      }else {
        current.value= 1;
        endDate = moment(startDate).add(-1, "days").format("YYYY-MM-DD");
        console.log(endDate);

        startDate = moment(endDate).add(-7, "days").format("YYYY-MM-DD");
        console.log(startDate);

        const startMonth = moment(startDate).format("MM");
        const endMonth = moment(endDate).format("MM");
        if (startMonth !== endMonth) {
          // If startDate and endDate are in the same month, take the latest month's data
          const latestMonthEnd = moment(endDate).endOf("month").format("YYYY-MM-DD");
          startDate = moment(latestMonthEnd).startOf("month").format("YYYY-MM-DD");
        }

        if (endDate <= moment().add(-29, "days").format("YYYY-MM-DD")) {
          console.log("mor than 3 months");
          isEnded.value = true;
          return;
        }
      }
      loadDepositTable(false);
    };

    const loadDepositTable = (isNew = true) => {
      if (isNew) {
        visible.value = true;
      }

      var platformName = platform.value ? platform.value.value : "";


      console.log(startDate);
      console.log(endDate);

      let paramData = {
        "startDate": startDate,
        "endDate": endDate,
        "platform": platformName,
        "memberId": store.id,
        "size": 20,
        "current": current.value
      };

      api.get(apiUrl, {
          params: paramData
        }
      ).then((res) => {
        maxPage.value = res.data.pages;
        tableData.value.push(...res.data.records);
        // console.log("TableData");
        // console.log(tableData.value);
      }).finally(() => {
        if (isNew) {
          visible.value = false;
        }
      });
    };

    const getGameName = (gameName) => {
      if (!gameName) {
        return ''
      }

      switch (gameName) {
        case 'IMES':
          return 'IM电竞';
        case 'TCG':
          return 'TCG彩票';
        case 'MGP':
          return 'MG电子';
        case 'CQ9':
          return 'CQ电子';
        case 'SABA':
          return 'SABA体育';
        case 'TFGaming':
          return 'DY电竞 ';
        case 'SW':
          return 'SW电子';
        case 'GPS':
          return 'GPS捕鱼';
        case 'IA':
          return '小艾电竞 ';
        case 'DT':
          return '大唐棋牌';
        case 'IM':
          return 'IM体育';
        case 'BBIN':
          return 'BBIN真人, BBIN电子, BBIN彩票';
        case 'KY':
          return '开元棋牌';
        case 'PT':
          return 'PT电子';
        case 'PG':
          return 'PG电子';
        case 'AG':
          return 'AG真人, XIN电子';
        case 'ALLBET':
          return 'ALLBET真人';

        default:
          return gameName;
      }
    }

    const loadPlatformLists = () => {
      cached.get("PLATFORMS", () => api.get("/platform").then((response) => {
        return response
      })).then((data) => {
        console.log(data);
        _.each(data, function (item, index) {
          var option = {
            label: getGameName(item.name),
            value: item.name,
          }
          platformsList.value.push(option);
        })
        console.log(platformsList.value);
      });
    }

    const searchRecord = () => {
      // console.log("searchRecord");
      recordRef.value.clearTable();
      isEnded.value = false;
      tableData.value= [];

      current.value= 1;
      endDate = moment().format("YYYY-MM-DD");
      startDate = moment().add(-7, "days").format("YYYY-MM-DD");
      const startMonth = moment(startDate).format("MM");
      const endMonth = moment(endDate).format("MM");
      if (startMonth !== endMonth) {
        // If startDate and endDate are in the same month, take the latest month's data
        const latestMonthEnd = moment(endDate).endOf("month").format("YYYY-MM-DD");
        startDate = moment(latestMonthEnd).startOf("month").format("YYYY-MM-DD");
      }

      loadDepositTable(true);
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
      await loadDepositTable();
    });

    return {
      tableData,
      visible,
      tableHeaders,
      loadNewData,
      isEnded,
      platformsList,
      platform,
      searchRecord,
      recordRef
    };
  }
});
</script>
<style lang="scss">
.flex-div {
  display: flex;
  align-items: center;
  justify-content: space-between;

  span {
    font-size: 14px;
    padding-left: 5px;
  }
}
</style>
