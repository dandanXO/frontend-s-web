<template>
  <!-- <RecordDateFilter class="q-my-sm" :startDate="startDate" :endDate="endDate" @handleDateChange="handleDateChange" /> -->
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
import {onMounted, ref, defineComponent, onActivated, computed} from "vue";
import RecordComponent from "../../components/RecordComponent.vue";
import { api } from "boot/axios";
import moment from "moment";
import { cached } from "boot/cache";
import RecordDateFilter from "../../components/RecordDateFilter.vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "WithdrawRecordView",
  components: {
    RecordComponent,
    // RecordDateFilter
  },
  setup() {
    const {t} = useI18n();
    const visible = ref(true);
    const tableData = ref([]);
    const isEnded = ref(false);
    const recordRef = ref();
    var apiUrl = "/session/member/withdraw";

    const endDate = ref(moment().format("YYYY-MM-DD"));
    const startDate = ref(moment().add(-7, "days").format("YYYY-MM-DD"));
    var current = ref(1);
    var maxPage = ref(0);
    var pagingState= ref("");

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
      console.log(apiKey,'apiKey');

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
        if(!tableData.value.length){
          isEnded.value = true;
        }else{
          isEnded.value = false;
        }
        // console.log("TableData");
        // console.log(tableData.value);
      }).catch((err) => {
        if (isNew) {
          visible.value = false;
        }
      });
    };

    const tableHeaders = computed(() => ([
      {
        key: "serialNumber",
        label: t('record.table.withdraw.header.serialNumber')
      },
      {
        key: "withdrawAmount",
        label: t('record.table.withdraw.header.amount'),
      },
      {
        key: "status",
        label: t('record.table.withdraw.header.status'),
      },

      {
        key: "withdrawDate",
        label: t('record.table.withdraw.header.withdrawDate'),
      }
    ]))
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
      loadDepositTable();
    });

    return {

      tableData,
      visible,
      tableHeaders,
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
