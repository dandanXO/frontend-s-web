<template>
  <div class="table-record">
    <RecordComponent
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
import { useI18n } from "vue-i18n";

export default defineComponent({
  components: {
    RecordComponent
  },
  setup() {
    const {t} = useI18n()
    const visible = ref(true);
    const tableData = ref([]);
    const isEnded = ref(false);

    var apiUrl = "/session/member/withdraw";

    var endDate = moment().format("YYYY-MM-DD");
    var startDate = moment().add(-7, "days").format("YYYY-MM-DD");
    var current = ref(1);
    var maxPage = ref(0);
    var pagingState= ref("");

    const loadNewData = () => {
      if(maxPage.value > current.value){
        current.value++;
      }else {
        current.value = 1;
        endDate = moment(startDate).add(-1, "days").format("YYYY-MM-DD");
        // console.log(endDate);

        startDate = moment(endDate).add(-7, "days").format("YYYY-MM-DD");
        // console.log(startDate);

        if (endDate <= moment().add(-29, "days").format("YYYY-MM-DD")) {
          // console.log("mor than 3 months");
          isEnded.value = true;
          return;
        }
      }
      loadDepositTable(false);
    };

    const loadDepositTable = (isNew = true) => {
      if (isNew) {
        visible.value = true;
      }

      let paramData = {
        "startDate": startDate,
        "endDate": endDate,
        "size": 10,
        "current": current.value
      };
      var apiKey = apiUrl + "_" + startDate + "_" + endDate + "_" + current.value;
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
      });
    };

    const tableHeaders = ([
      {
        key: "serialNumber",
        label: t('lang.col_serialnumber')
      },
      {
        key: "withdrawAmount",
        label: t('lang.col_withdrawamount')
      },
      {
        key: "status",
        label: t('lang.col_status')
      },
      // {
      //   key: 'typeText',
      //   label: '类型'
      // },
      {
        key: "withdrawDate",
        label: t('lang.col_withdrawdate')
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
      isEnded
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
