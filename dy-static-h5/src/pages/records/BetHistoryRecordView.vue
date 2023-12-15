<template>
  <div class="table-record">
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
import { defineComponent, onMounted, ref } from "vue";
import RecordComponent from "../../components/RecordComponent.vue";
import { api } from "boot/axios";
import moment from "moment/moment";
import { userStore } from "src/stores";

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

    const loadNewData = () => {
      const startMonth = moment(startDate).format("MM");
      const endMonth = moment(endDate).format("MM");
      if (startMonth !== endMonth) {
        // If startDate and endDate are in the same month, take the latest month's data
        const latestMonthEnd = moment(endDate).endOf("month").format("YYYY-MM-DD");
        startDate = moment(latestMonthEnd).startOf("month").format("YYYY-MM-DD");
      } else {
        startDate = moment(startDate).add(-7, "days").format("YYYY-MM-DD");
        endDate = moment(endDate).add(-7, "days").format("YYYY-MM-DD");
      }
      if (startDate <= moment().add(-30, "days").format("YYYY-MM-DD")) {
        console.log("mor than 3 months");
        isEnded.value = true;
        return;
      }
      loadDepositTable(false);
    };

    const loadDepositTable = (isNew = true) => {
      if (isNew) {
        visible.value = true;
      }
      console.log(startDate);
      console.log(endDate);

      let paramData = {
        "startDate": startDate,
        "endDate": endDate,
        "platform": "",
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
    onMounted(() => {
      loadDepositTable();
    });

    return {
      tableData,
      visible,
      tableHeaders,
      loadNewData,
      isEnded
    };
  }
});
</script>
<style lang="scss"></style>
