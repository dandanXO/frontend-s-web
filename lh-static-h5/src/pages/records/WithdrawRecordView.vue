<template>
  <RecordSearch class="q-my-sm" :startDate="startDate" :endDate="endDate" @handleDateChange="handleDateChange" />
  <div class="table-record">
    <RecordComponent
      ref="recordRef"
      recordType="withdraw"
      :loading="visible"
      :list="tableData"
      :headers="tableHeaders"
      @loadnewdata="loadNewData"
      :isEnded="isEnded"
    />
  </div>
</template>
<script lang="js">
import {onMounted, ref, defineComponent} from "vue";
import RecordComponent from "../../components/RecordComponent.vue";
import {api} from "boot/axios";
import moment from "moment";
import {cached} from "boot/cache";
import RecordSearch from "src/components/RecordSearch.vue";

export default defineComponent({
  components: {
    RecordComponent,
    RecordSearch
  },
  setup() {

    const visible = ref(true);
    const tableData = ref([]);
    const isEnded = ref(false);

    var apiUrl = "/session/member/withdraw";

    var endDate = ref(moment().format("YYYY-MM-DD"));
    var startDate = ref(moment().add(-7, "days").format("YYYY-MM-DD"));
    var current = ref(1);
    var maxPage = ref(0);
    var pagingState= ref("");
    const recordRef = ref();

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
      // console.log(apiKey);

      cached.get(apiKey, () => api.get(apiUrl, {
          params: paramData
        }),
        { expired_value: 30 }
      ).then((res) => {
        // console.log(res);


        maxPage.value = res.pages;


        if (isNew) {
          visible.value = false;
        }

        tableData.value.push(...res.records);
        // console.log("TableData");
        // console.log(tableData.value);
      }).catch((err) => {
        if (isNew) {
          visible.value = false;
        }
        isEnded.value = true;
      });
    };

    const handleDateChange = (data) => {
      const {val, isStartDate} = data
      isStartDate ? startDate.value = val : endDate.value = val
      tableData.value = [];
      current.value = 1;
      isEnded.value = false;
      recordRef.value.clearTable();
      loadDepositTable(true);
    };

    const tableHeaders = ([
      {
        key: "serialNumber",
        label: "单号"
      },
      {
        key: "withdrawAmount",
        label: "提款数额"
      },
      {
        key: "statusName",
        label: "状态"
      },
      // {
      //   key: 'typeText',
      //   label: '类型'
      // },
      {
        key: "withdrawDate",
        label: "提款日期"
      }
    ]);
    onMounted(() => {
      current.value = 1;
      loadDepositTable();
    });

    return {
      tableData,
      visible,
      tableHeaders,
      loadNewData,
      isEnded,
      endDate,
      startDate,
      recordRef,
      handleDateChange
    };
  }
});
</script>
<style scoped lang="scss">
.table-record {
  width: 100%;
  gap: 10px;

  .q-card {
    color: rgb(0, 0, 0) !important;
    background: rgb(255, 255, 255) !important;
  }

  .label {
    color: #000;
  }

  .q-btn {
    font-size: 11px !important;
  }
}
</style>
