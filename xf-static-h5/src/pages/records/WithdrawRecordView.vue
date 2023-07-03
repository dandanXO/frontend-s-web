<template>
  <div className="table-record">
    <RecordComponent recordType="withdraw" :loading="visible" :list="tableData" :headers="tableHeaders"/>
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
        tableData.value = res.data.records;
      }).finally(() => {
        visible.value = false
      })
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

