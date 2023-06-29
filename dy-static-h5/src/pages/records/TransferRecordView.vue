<template>
    <div class="table-record">
        <RecordComponent :loading="visible" :list="tableData" :headers="tableHeaders" />
    </div>
</template>
<script lang="js">
import {defineComponent, onMounted, ref} from "vue"
import RecordComponent from "../../components/RecordComponent.vue"
import moment from "moment";
import {api} from "boot/axios";

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

      api.get("/session/member/moneyChange", {
          params: paramData
        },
      ).then((res) => {
        console.log(res);
        tableData.value= res.data.records;

      }).finally(()=>{
        visible.value = false;
      })
    }
    const tableHeaders = ([
      {
        key: 'serialNumber',
        label: '单号'
      },
      {
        key: 'statusText',
        label: '状态'
      },
      {
        key: 'typeText',
        label: '类型'
      },
      {
        key: 'feedbackTime',
        label: '催单时间',
      },
      {
        key: 'financeRemark',
        label: '回复'
      }
    ])
    onMounted(() => {
      loadDepositTable()
    })

    return {
      tableData,
      tableHeaders,
      visible
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
