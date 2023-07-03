<template>
  <div class="table-record">
    <RecordComponent
      recordType="reminder"
      :loading="visible"
      :list="tableData"
      :headers="tableHeaders"
    />
  </div>
</template>
<script lang="js">
import {defineComponent, onMounted, ref} from "vue";
import RecordComponent from "../../components/RecordComponent.vue";
import {api} from "boot/axios";
import moment from "moment/moment";

export default defineComponent({
  components: {
    RecordComponent
  },
  setup() {

    const visible = ref(true);
    const tableData = ref([]);
    const loadDepositTable = () => {

      visible.value = true;
      let paramData = {
        "startDate": moment().add(-7, 'days').format("YYYY-MM-DD"),
        "endDate": moment().format("YYYY-MM-DD")
      }

      api.get("/session/member/financeFeedback", {
          params: paramData
        },
      ).then((res) => {
        tableData.value= res.data.records;
      }).finally(()=>{
        visible.value = false;
      })
    };
    const tableHeaders = [
      {
        key: "orderNo",
        label: "订单号",
      },
      {
        key: "financeRemark",
        label: "财务反馈",
      },
      {
        key: "feedbackTime",
        label: "反馈时间",
      },
      {
        key: "type",
        label: "类型",
      }
    ];
    onMounted(() => {
      loadDepositTable();
    });

    return {
      tableData,
      visible,
      tableHeaders
    }
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
