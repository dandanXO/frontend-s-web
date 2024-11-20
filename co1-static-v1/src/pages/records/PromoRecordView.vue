<template>
  <div class="table-record">
    <RecordComponent
      recordType="promo"
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
import {cached} from "boot/cache";

export default defineComponent({
  name: "PromoRecordView",
  components: {
    RecordComponent
  },
  setup() {

    const visible = ref(true);
    const tableData = ref([]);

    var apiUrl = "/session/member/privilege";

    const isEnded = ref(false);
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
          { expired_value: 30 }
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

    const tableHeaders = [
      {
        key: "serialNumber",
        label: "编码"
      },
      {
        key: "privilegeName",
        label: "优惠名"
      },
      {
        key: "amount",
        label: "金额"
      },
      {
        key: "recordTime",
        label: "记录时间"
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
</style>
