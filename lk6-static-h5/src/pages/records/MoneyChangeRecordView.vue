<template>
  <!-- <RecordDateFilter class="q-my-sm" :startDate="startDate" :endDate="endDate" @handleDateChange="handleDateChange" /> -->
  <div class="table-record">
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
import {defineComponent, onActivated, onMounted, ref} from "vue";
import RecordComponent from "../../components/RecordComponent.vue";
import moment from "moment";
import {api} from "boot/axios";
import {userStore} from "src/stores";
import {cached, TIME_EXPIRED} from "boot/cache";
import RecordDateFilter from "../../components/RecordDateFilter.vue";

export default defineComponent({
  name: "MoneyChangeRecordView",
  components: {
    RecordComponent,
    // RecordDateFilter
  },
  setup() {
    const visible = ref(true);
    const tableData = ref([]);
    const isEnded = ref(false);
    const recordRef = ref();
    var apiUrl = "/session/member/moneyChange";


  const endDate = ref(moment().format("YYYY-MM-DD"));
  const startDate = ref(moment().add(-7, "days").format("YYYY-MM-DD"));
    var current = ref(1);
    var maxPage = ref(0);
    var pagingState = ref("")

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
      console.log(startDate.value);
      console.log(endDate);

      let paramData = {
        "startDate": startDate.value,
        "endDate": endDate.value,
        "size": 10,
        "current": current.value
      };
      if(pagingState.value && current.value !== 1){
        paramData["pagingState"]= pagingState.value;
      }
      var apiKey = apiUrl + "_" + startDate.value + "_" + endDate.value + "_" + current.value;
      console.log(apiKey);

      cached.get(apiKey, () => api.get(apiUrl, {
            params: paramData
          }),
          {expired_value: 30}
      ).then((res) => {
        console.log(res);

        // Check if records array is empty and stop processing if true
        if (res.records.length === 0) {
          console.log("No records found. Ending function execution.");
          current.value = maxPage.value;
          if (isNew) {
            visible.value = false;
          }
          return; // Exit the function early
        }

        maxPage.value = res.pages;
        pagingState.value = res.pagingState;

        if (isNew) {
          visible.value = false;
        }

        tableData.value.push(...res.records);
        if(!tableData.value.length){
          isEnded.value = true;
        }else{
          isEnded.value = false;
        }
      }).catch((err) => {
        if (isNew) {
          visible.value = false;
        }
        console.error(err); // Log or handle the error appropriately
      });
    };


    // const loadDepositTable = (isNew = true) => {
    //   if (isNew) {
    //     visible.value = true;
    //   }
    //   console.log(startDate + endDate);

    //   let paramData = {
    //     "startDate": startDate,
    //     "endDate": endDate,
    //     "size": 10,
    //     "current": current.value
    //   };
    //   if(pagingState.value && current.value !== 1){
    //     paramData["pagingState"]= pagingState.value;
    //   }
    //   var apiKey = apiUrl + "_" + startDate + "_" + endDate + "_" + current.value;
    //   console.log(apiKey);

    //   cached.get(apiKey, () => api.get(apiUrl, {
    //         params: paramData
    //       }),
    //       {expired_value: 30}
    //   ).then((res) => {
    //     console.log(res);

    //     maxPage.value = res.pages;
    //     pagingState.value= res.pagingState;


    //     if (isNew) {
    //       visible.value = false;
    //     }

    //     tableData.value.push(...res.records);
    //     // console.log("TableData");
    //     // console.log(tableData.value);
    //   }).catch((err) => {
    //     if (isNew) {
    //       visible.value = false;
    //     }
    //   });
    // };

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
      const {val, isStartDate} = data;
      isStartDate ? startDate.value = val : endDate.value = val;
      tableData.value = [];
      current.value = 1;
      recordRef.value.clearTable();
      loadDepositTable();
    };
    onMounted(() => {
      current.value = 1;
      loadDepositTable();
    });

    return {
      tableData,
      tableHeaders,
      visible,
      loadNewData,
      isEnded,
      startDate,
      endDate,
      handleDateChange,
      recordRef
    };
  }
});
</script>
<style scoped lang="scss"></style>
