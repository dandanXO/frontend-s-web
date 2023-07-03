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
import {userStore} from "src/stores";

export default defineComponent({
  name: "BetHistoryRecordView",
  components: {
    RecordComponent
  },
  setup() {

    const store= userStore()
    const visible = ref(true);
    const tableData = ref([]);
    const loadDepositTable = () => {

      visible.value = true;
      let paramData = {
        "startDate": moment().add(-7, 'days').format("YYYY-MM-DD"),
        "endDate": moment().format("YYYY-MM-DD"),
        "platform": "",
        "memberId": store.id,
        "current": 1,
        "size": 10
      }

      api.get("/session/member/gameBetRecord", {
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
        key: 'betTime',
        label: '游戏时间'
    },
    {
        key: 'platform',
        label: '游戏平台'
    },
    {
        key: 'bet',
        label: '投注'
    },
    {
        key: 'payout',
        label: '派彩',
    },
    {
        key: 'gameType',
        label: '游戏类型'
    },
    {
        key: 'betStatus',
        label: '投注状态'
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
