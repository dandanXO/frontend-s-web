<template>
  <!-- <RecordDateFilter class="q-my-sm" :startDate="startDate" :endDate="endDate" @handleDateChange="handleDateChange" /> -->
  <div class="table-record">
    <RecordComponent
      ref="recordRef"
      recordType="reminder"
      :loading="visible"
      :list="tableData"
      :headers="tableHeaders"
      @loadnewdata="loadNewData"
      :isEnded="isEnded"
    />
  </div>
</template>
<script lang="js">
import {computed, defineComponent, onActivated, onMounted, ref} from "vue";
import RecordComponent from "../../components/RecordComponent.vue";
import { api } from "boot/axios";
import moment from "moment/moment";
import { cached, TIME_EXPIRED } from "boot/cache";
import RecordDateFilter from "../../components/RecordDateFilter.vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "FeedbackRecordView",
  components: {
    RecordComponent,
    // RecordDateFilter
  },
  setup() {
    const {t} = useI18n();
    const visible = ref(true);
    const tableData = ref([]);

    var apiUrl = "/session/member/financeFeedback";

    const isEnded = ref(false);
    const recordRef = ref();
    const endDate = ref(moment().format("YYYY-MM-DD"));
    const startDate = ref(moment().add(-7, "days").format("YYYY-MM-DD"));
    var current = ref(1);
    var maxPage = ref(0);

    const loadNewData = () => {
      // if (maxPage.value > current.value) {
      //   current.value++;
      // } else {
      //   isEnded.value = true;
      //   return;
      // }
      loadDepositTable(false);
    };

    const loadDepositTable = (isNew = true) => {
      if (isNew) {
        visible.value = true;
      }
      console.log(startDate);
      console.log(endDate);

      let paramData = {
        "startDate": startDate.value,
        "endDate": endDate.value,
        "size": 10,
        "current": current.value
      };
      var apiKey = apiUrl + "_" + startDate.value + "_" + endDate.value + "_" + current.value;
      console.log(apiKey);

      cached.get(apiKey, () => api.get(apiUrl, {
          params: paramData
        }),
        {expired_value: 0}
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

    const tableHeaders = computed(() => (

      [
        {
          key: "orderNo",
          label: t('record.table.reminderRequired.header.orderNo')
        },
        {
          key: "status",
          label: t('record.table.reminderRequired.header.status')
        },
        {
          key: "financeRemark",
          label: t('record.table.reminderRequired.header.financeRemark')
        },
        {
          key: "feedbackTime",
          label: t('record.table.reminderRequired.header.feedbackTime')
        },
        {
          key: "type",
          label: t('record.table.reminderRequired.header.type')
        }
      ]
    ))
    const handleDateChange = (data) => {
      const {val, isStartDate} = data;
      isStartDate ? startDate.value = val : endDate.value = val;
      tableData.value = [];
      current.value = 1;
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
      tableHeaders, loadNewData,
      isEnded,
      startDate,
      endDate,
      handleDateChange,
      recordRef
    };
  }
});
</script>
<style lang="scss"></style>
