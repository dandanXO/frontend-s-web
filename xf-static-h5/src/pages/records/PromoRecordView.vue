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
import {defineComponent, onMounted, ref} from "vue";
import RecordComponent from "../../components/RecordComponent.vue";
import {api} from "boot/axios";
import moment from "moment/moment";

export default defineComponent({
  name: "PromoRecordView",
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

      api.get("/session/member/privilege", {
          params: paramData
        },
      ).then((res) => {
        console.log(res);
        tableData.value= res.data.records;

      }).finally(()=>{
        visible.value = false;
      })


      //HARDCODE.
      // tableData.value = [
      //   {
      //     id: "1",
      //     code: "金额",
      //     depositAmount: "200",
      //     depositType: "KDPay",
      //     depositStatus: "支付中",
      //     commitDate: 1672486214000,
      //     serialNumber: "XFI617020221231193013594",
      //   },
      //   {
      //     id: "2",
      //     code: "存款类型",
      //     depositAmount: "200",
      //     depositType: "QQ_CODE",
      //     depositStatus: "支付中",
      //     commitDate: 1672486214000,
      //     serialNumber: "XFI617020221231193013594",
      //   },
      //   {
      //     id: "3",
      //     code: "存款类型",
      //     depositAmount: "200",
      //     depositType: "WECHAT_CODE2",
      //     depositStatus: "支付中",
      //     commitDate: 1672486214000,
      //     serialNumber: "XFI617020221231193013594",
      //   },
      //   {
      //     id: "4",
      //     code: "存款类型",
      //     depositAmount: "200",
      //     depositType: "QQ_CODE",
      //     depositStatus: "支付中",
      //     commitDate: 1672486214000,
      //     serialNumber: "XFI617020221231193013594",
      //   },
      //   {
      //     id: "5",
      //     code: "存款类型",
      //     depositAmount: "200",
      //     depositType: "QQ_CODE",
      //     depositStatus: "支付中",
      //     commitDate: 1672486214000,
      //     serialNumber: "XFI617020221231193013594",
      //   },
      //   {
      //     id: "6",
      //     code: "存款类型",
      //     depositAmount: "200",
      //     depositType: "QQ_CODE",
      //     depositStatus: "支付中",
      //     commitDate: 1672486214000,
      //     serialNumber: "XFI617020221231193013594",
      //   },
      //   {
      //     code: "金额",
      //     depositAmount: "200",
      //     depositType: "KDPay",
      //     depositStatus: "支付中",
      //     commitDate: 1672486214000,
      //     serialNumber: "XFI617020221231193013594",
      //   },
      //   {
      //     code: "存款类型",
      //     depositAmount: "200",
      //     depositType: "QQ_CODE",
      //     depositStatus: "支付中",
      //     commitDate: 1672486214000,
      //     serialNumber: "XFI617020221231193013594",
      //   },
      //   {
      //     code: "存款类型",
      //     depositAmount: "200",
      //     depositType: "QQ_CODE",
      //     depositStatus: "支付中",
      //     commitDate: 1672486214000,
      //     serialNumber: "XFI617020221231193013594",
      //   },
      //   {
      //     code: "存款类型",
      //     depositAmount: "200",
      //     depositType: "QQ_CODE",
      //     depositStatus: "支付中",
      //     commitDate: 1672486214000,
      //     serialNumber: "XFI617020221231193013594",
      //   },
      //   {
      //     code: "存款类型",
      //     depositAmount: "200",
      //     depositType: "QQ_CODE",
      //     depositStatus: "支付中",
      //     commitDate: 1672486214000,
      //     serialNumber: "XFI617020221231193013594",
      //   },
      //   {
      //     id: "last",
      //     code: "存款类型",
      //     depositAmount: "200",
      //     depositType: "QQ_CODE",
      //     depositStatus: "支付中",
      //     commitDate: 1672486214000,
      //     serialNumber: "XFI617020221231193013594",
      //   },
      // ];

    };
    const tableHeaders = [
      {
        key: "serialNumber",
        label: "编码",
      },
      {
        key: "privilegeName",
        label: "优惠名",
      },
      {
        key: "amount",
        label: "金额",
      },
      {
        key: "recordTime",
        label: "记录时间",
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
