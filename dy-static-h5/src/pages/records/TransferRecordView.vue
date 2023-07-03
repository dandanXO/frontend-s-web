<template>
  <div class="table-record">
    <RecordComponent
      :loading="visible"
      :list="tableData"
      :headers="tableHeaders"
    />
  </div>
</template>
<script lang="js">
import { defineComponent, onMounted, ref } from "vue";
import RecordComponent from "../../components/RecordComponent.vue";
import moment from "moment";
import { api } from "boot/axios";

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
        "startDate": moment().add(-7, "days").format("YYYY-MM-DD"),
        "endDate": moment().format("YYYY-MM-DD")
      };

      api.get("/session/member/transfer", {
          params: paramData
        }
      ).then((res) => {
        console.log(res);
        tableData.value = res.data.records;

      }).finally(() => {
        visible.value = false;
      });

      // tableData.value = [{
      //   amount: 50,
      //   commitTime: null,
      //   feedbackTime: "2021-11-01 22:33:15",
      //   financeRemark: "test",
      //   id: 21,
      //   loginName: null,
      //   memberId: 804,
      //   memberRemark: "oyoyoyoy",
      //   operaterName: null,
      //   orderNo: "XF560320211004163950615",
      //   photos: "944202d1-42a6-4daa-a221-76d001dc9046",
      //   photosUrl: ["944202d1-42a6-4daa-a221-76d001dc9046"],
      //   status: 2,
      //   statusText: "已核实",
      //   type: 1,
      //   typeText: "存款",
      //   updateBy: 0,
      //   updateTime: null
      //
      // },]
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
      visible
    };
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
