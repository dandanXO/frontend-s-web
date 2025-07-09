<template>
  <!-- <RecordDateFilter class="q-my-sm" :startDate="startDate" :endDate="endDate" @handleDateChange="handleDateChange" /> -->
  <div class="table-record">
    <RecordComponent
      ref="recordRef"
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
import {defineComponent, onActivated, onMounted, ref} from "vue";
import RecordComponent from "../../components/RecordComponent.vue";
import { api } from "boot/axios";
import moment from "moment/moment";
import { cached, TIME_EXPIRED } from "boot/cache";
import RecordDateFilter from "src/components/RecordDateFilter.vue";

export default defineComponent({
  name: "DepositRecordView",
  components: {
    RecordComponent,
    // RecordDateFilter
  },
  setup() {
    const recordRef = ref();
    const visible = ref(true);
    const tableData = ref([]);
    const isEnded = ref(false);

    var apiUrl = "/session/member/deposit";
    const endDate = ref(moment().format("YYYY-MM-DD"));
    const startDate = ref(moment().add(-7, "days").format("YYYY-MM-DD"));

    var current = ref(1);
    var maxPage = ref(0);

    const loadNewData = () => {
      if(maxPage.value > current.value){
        current.value++;
      }else {
        current.value = 1;
        endDate.value = moment(startDate.value).add(-1, "days").format("YYYY-MM-DD");
        console.log(endDate.value);

        startDate.value = moment(endDate.value).add(-7, "days").format("YYYY-MM-DD");
        console.log(startDate.value);

        if (endDate.value <= moment().add(-29, "days").format("YYYY-MM-DD")) {
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
        "startDate": startDate.value,
        "endDate": endDate.value,
        "size": 10,
        "current": current.value
      };
      var apiKey = apiUrl + "_" + startDate.value + "_" + endDate.value + "_" + current.value;
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
        if(!tableData.value.length){
          isEnded.value = true;
        }else{
          isEnded.value = false;
        }
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
    const handleDateChange = (data) => {
      const {val, isStartDate} = data
      isStartDate ? startDate.value = val : endDate.value = val
      tableData.value = [];
      current.value = 1;
      isEnded.value = false;
      recordRef.value.clearTable();
      loadDepositTable(true);
    };
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
      tableData,
      handleDateChange,
      endDate,
      startDate,
      recordRef
    };
  }
});
</script>
<style lang="scss"></style>
