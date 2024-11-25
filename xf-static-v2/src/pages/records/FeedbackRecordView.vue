<template>
  <div class="table-record">
    <RecordDateFilter class="q-ma-md" :startDate="startDate" :endDate="endDate" @handleDateChange="handleDateChange" />

    <RecordComponent
      ref="recordRef"
      recordType="reminder"
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
import {cached} from "boot/cache";
import RecordDateFilter from "src/components/RecordDateFilter.vue";

export default defineComponent({
  components: {
    RecordDateFilter,
    RecordComponent
  },
  setup() {
    const visible = ref(true);
    const tableData = ref([]);

    var apiUrl = "/session/member/financeFeedback";

    const isEnded = ref(false);

    const endDate = ref(moment().format("YYYY-MM-DD"));
    const startDate = ref(moment().add(-7, "days").format("YYYY-MM-DD"));

    const recordRef = ref();
    var current = ref(1);
    var maxPage = ref(0);

    const loadNewData = () => {
      if (maxPage.value > current.value) {
        current.value++;
      } else {
        isEnded.value = true;
        return;
      }
      loadDepositTable(false);
    };

    const loadDepositTable = (isNew = true) => {
      if (isNew) {
        visible.value = true;
      }

      let paramData = {
        "startDate": startDate.value,
        "endDate": endDate.value,
        "size": 10,
        "current": current.value
      };
      var apiKey = apiUrl + "_" + startDate.value + "_" + endDate.value + "_" + current.value;

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
      }).catch((err) => {
        if (isNew) {
          visible.value = false;
        }
        isEnded.value = true;
      });
    };

    const tableHeaders = [
      {
        key: "orderNo",
        label: "订单号"
      },
      {
        key: "status",
        label: "状态"
      },
      {
        key: "financeRemark",
        label: "财务反馈"
      },
      {
        key: "feedbackTime",
        label: "反馈时间"
      },
      {
        key: "type",
        label: "类型"
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
      tableData,
      visible,
      tableHeaders,
      loadNewData,
      isEnded,
      handleDateChange,
      recordRef,
      endDate,
      startDate
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
