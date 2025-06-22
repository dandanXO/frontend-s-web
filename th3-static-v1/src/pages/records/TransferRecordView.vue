<template>
  <div class="table-record">
    <RecordComponent
      recordType="transfer"
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
import moment from "moment";
import {api} from "boot/axios";
import {cached} from "boot/cache";

export default defineComponent({
  components: {
    RecordComponent
  },
  setup() {
    const visible = ref(true);
    const tableData = ref([]);

    const isEnded = ref(false);

    var apiUrl = "/session/member/transfer";

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

    const loadDepositTable = (isNew = true) => {
      if (isNew) {
        visible.value = true;
      }
      console.log(startDate);
      console.log(endDate);

      let paramData = {
        "startDate": startDate,
        "endDate": endDate
      };
      var apiKey = apiUrl + "_" + startDate + "_" + endDate;
      console.log(apiKey);

      cached.get(apiKey, () => api.get(apiUrl, {
            params: paramData
          }),
          {expired_value: 30}
      ).then((res) => {
        console.log(res);

        if (isNew) {
          visible.value = false;
        }

        tableData.value.push(...res.records);
        // console.log("TableData");
        // console.log(tableData.value);
      }).catch((err) => {
        if (isNew) {
          visible.value = false;
        }
      });
    };

    const tableHeaders = ([
      {
        key: "serialNumber",
        label: "转账编码"
      },
      {
        key: "type",
        label: "账变类型"
      },
      {
        key: "platform",
        label: "游戏平台"
      },
      {
        key: "amount",
        label: "金额"
      },
      {
        key: "status",
        label: "状态"
      },
      {
        key: "transferDate",
        label: "时间"
      }

    ]);
    onMounted(() => {
      loadDepositTable();
    });

    return {
      tableData,
      tableHeaders,
      visible,
      loadNewData,
      isEnded
    };
  }
});
</script>
<style scoped lang="scss">
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
</style>
