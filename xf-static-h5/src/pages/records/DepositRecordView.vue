<template>
  <div className="table-record">
    <RecordComponent
        recordType="deposit"
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

      api.get("/session/member/deposit", {
            params: paramData
          },
      ).then((res) => {
        tableData.value = res.data.records;
      }).finally(() => {
        visible.value = false;
      })
    };
    const tableHeaders = [
      {
        key: "depositAmount",
        label: "金额",
      },
      // {
      //   key: "depositType",
      //   label: "存款类型",
      // },
      {
        key: "status",
        label: "存款状态",
      },
      {
        key: "depositDate",
        label: "到账时间",
      },
      {
        key: "serialNumber",
        label: "存款编码",
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
<style scoped lang="scss">
.table-record {
  width: 100%;
  gap: 10px;

  .label {
    color: #bacef1;
  }
}
</style>
