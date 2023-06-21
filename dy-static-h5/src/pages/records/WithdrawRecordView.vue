<template>
  <div class="table-record">
      <RecordComponent recordType="withdraw" :loading="visible" :list="tableData" :headers="tableHeaders" />
  </div>
</template>
<script lang="js">
import {onMounted, ref, defineComponent} from "vue"
import RecordComponent from "../../components/RecordComponent.vue"
import {api} from "boot/axios";
import moment from "moment";

export default defineComponent({
  components: {
    RecordComponent
  },
  setup() {

    const visible = ref(true);
    const tableData = ref([]);
    const loadDepositTable = () => {

      let paramData = {
        "startDate": moment().add(-7, 'days').format("YYYY-MM-DD"),
        "endDate": moment().format("YYYY-MM-DD")
      }
      visible.value = true;
      api.get("/session/member/withdraw", {
          params: paramData
        },
      ).then((res) => {
        // console.log(res);
        tableData.value = res.data.records;


      }).finally(() => {
        visible.value = false
      })


      tableData.value = [
        {
          "serialNumber": "DY1WEB6491b58be4b0a89b1f5bff3b",
          "withdrawAmount": 220.0,
          "localCurrencyAmount": 220.0,
          "currencyName": "CNY",
          "currencyRate": 1.0,
          "status": "SUCCESS",
          "withdrawDate": "2023-06-20 22:19:55",
          "confirmStatus": 0,
          "id": 47
        },
        {
          "serialNumber": "DY1WEB6491ae88e4b0a89b1f5bff3a",
          "withdrawAmount": 210.0,
          "localCurrencyAmount": 210.0,
          "currencyName": "CNY",
          "currencyRate": 1.0,
          "status": "SUCCESS",
          "withdrawDate": "2023-06-20 21:50:00",
          "confirmStatus": 0,
          "id": 46
        },
        {
          "serialNumber": "DY1WEB6491aa16e4b0a393aa8b7578",
          "withdrawAmount": 5200.0,
          "localCurrencyAmount": 727.0,
          "currencyName": "USDT",
          "currencyRate": 7.14,
          "status": "STEP_3",
          "withdrawDate": "2023-06-20 21:31:03",
          "confirmStatus": 0,
          "id": 45
        },
        // {
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
        // }
      ]
    }
    const tableHeaders = ([
      {
        key: 'serialNumber',
        label: '单号'
      },
      {
        key: 'withdrawAmount',
        label: '提款数额'
      },
      {
        key: 'status',
        label: '状态'
      },
      // {
      //   key: 'typeText',
      //   label: '类型'
      // },
      {
        key: 'withdrawDate',
        label: '提款日期',
      },
    ])
    onMounted(() => {
      loadDepositTable()
    })

    return {
      tableData,
      visible,
      tableHeaders
    }
  }
});
</script>

