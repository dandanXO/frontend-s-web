<template>
  <div class="table-record">

    <q-select
        allowClear
        rounded
        outlined
        dense
        color="white"
        style="width: 320px;margin:10px auto 8px;"
        v-model="platform"
        :options="platformsList"
        placeholder="选择平台"
        @change="searchRecord"
    >
    </q-select>

    <RecordComponent
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
import {defineComponent, onMounted, ref} from "vue";
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

    const store = userStore();
    const visible = ref(true);
    const tableData = ref([]);

    const searchRecord = () => {
      console.log("HERe");
      loadDepositTable(false);
    }

    const platform= ref("");

    const isEnded = ref(false);

    var apiUrl = "/session/member/gameBetRecord";


    var endDate = moment().format("YYYY-MM-DD");
    var startDate = moment().add(-7, "days").format("YYYY-MM-DD");

    const loadNewData = () => {
      startDate = moment(startDate).add(-7, "days").format("YYYY-MM-DD");
      console.log(startDate);

      endDate = moment(endDate).add(-7, "days").format("YYYY-MM-DD");
      console.log(endDate);

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
      console.log(platformsList.value);

      if (isNew) {
        visible.value = true;
      }
      console.log(startDate);
      console.log(endDate);

      let paramData = {
        "startDate": startDate,
        "endDate": endDate,
        "platform": platform.value,
        "memberId": store.id,
        "current": 1,
        "size": 10
      };

      api.get(apiUrl, {
            params: paramData
          }
      ).then((res) => {
        tableData.value.push(...res.data.records);
        // console.log("TableData");
        // console.log(tableData.value);
      }).finally(() => {
        if (isNew) {
          visible.value = false;
        }
      });
    };

    const loadPlatformLists = () => {
      cached.get("PLATFORMS", () => api.get("/platform").then((response) => {
        return response
      })).then((data) => {
        console.log(data);
        _.each(data, function(item, index){
          var option= {
            label: item.name,
            value: item.name,
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
        key: "betStatus",
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
      platform
    };
  }
});
</script>
<style lang="scss">
.table-record {
  width: 100%;
  gap: 10px;

  .q-card {
    background: #ffffff !important;
    color: #000000 !important;
  }

  .label {
    color: #000000;
  }

  .q-btn {
    font-size: 11px !important;
  }
}
</style>
