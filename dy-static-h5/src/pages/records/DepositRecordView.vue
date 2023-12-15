<template>
  <div class="table-record">
    <RecordComponent
      recordType="deposit"
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
import { cached, TIME_EXPIRED } from "boot/cache";

export default defineComponent({
  components: {
    RecordComponent
  },
  setup() {

    const visible = ref(true);
    const tableData = ref([]);
    const isEnded = ref(false);

    var apiUrl = "/session/member/deposit";

    var endDate = moment().format("YYYY-MM-DD");
    var startDate = moment().add(-7, "days").format("YYYY-MM-DD");
    var current = ref(1);
    var maxPage = ref(0);

    const loadNewData = () => {
      if(maxPage.value > current.value){
        current.value++;
      }else {
        current.value = 1;
        endDate = moment(startDate).add(-1, "days").format("YYYY-MM-DD");
        console.log(endDate);

        startDate = moment(endDate).add(-7, "days").format("YYYY-MM-DD");
        console.log(startDate);

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
      // console.log(startDate);
      // console.log(endDate);

      let paramData = {
        "startDate": startDate,
        "endDate": endDate,
        "size": 10,
        "current": current.value
      };
      var apiKey = apiUrl + "_" + startDate + "_" + endDate + "_" + current.value;
      console.log(apiKey);

      cached.get(apiKey, () => api.get(apiUrl, {
          params: paramData
        }),
        { expired_value: 30 }
      ).then((res) => {
        console.log(res);
        maxPage.value = res.pages;
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
        key: "depositAmount",
        label: "金额"
      },
      {
        key: "paymentType",
        label: "存款类型"
      },
      {
        key: "status",
        label: "存款状态"
      },
      {
        key: "depositDate",
        label: "到账时间"
      },
      {
        key: "serialNumber",
        label: "存款编码"
      }
    ];
    onMounted(() => {
      current.value = 1;
      tableData.value = [];
      loadDepositTable();
    });

    return {
      visible,
      isEnded,
      tableHeaders,
      loadNewData,
      tableData
    };
  }
});
</script>
<style lang="scss"></style>
