<template>
  <div class="table-record">
    <RecordDateFilter class="q-ma-md" :startDate="startDate" :endDate="endDate" @handleDateChange="handleDateChange" />

    <RecordComponent
      ref="recordRef"
      recordType="moneyChange"
      :loading="visible"
      :list="tableData"
      :headers="tableHeaders"
      @loadnewdata="loadNewData"
      :isEnded="isEnded"
    />
  </div>
</template>
<script lang="js">
import {defineComponent, onMounted, ref} from "vue";
import RecordComponent from "../../components/RecordComponent.vue";
import moment from "moment";
import {api} from "boot/axios";
import {userStore} from "src/stores";
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

    const isEnded = ref(false);

    var apiUrl = "/session/member/moneyChange";

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

        // for moneychange db cannot know total no. of records
        // when records is empty stop calling api
        if (res.records.length < 1) {
          isEnded.value = true
        }
      }).catch((err) => {
        if (isNew) {
          visible.value = false;
        }
        isEnded.value = true;
      });
    };


    const tableHeaders = ([
      {
        key: "serialNumber",
        label: "编码"
      },
      {
        key: "type",
        label: "账变类型"
      },
      {
        key: "platformCode",
        label: "平台"
      },
      {
        key: "amount",
        label: "金额"
      },
      {
        key: "subType",
        label: "账变子类型"
      },
      {
        key: "recordTime",
        label: "时间"
      }
    ]);

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
      tableHeaders,
      visible,
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
<style scoped lang="scss">
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
