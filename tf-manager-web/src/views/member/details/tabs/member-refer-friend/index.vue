<template>
  <div class="inputs-wrap">
    <el-date-picker
      v-model="regTime"
      format="DD/MM/YYYY"
      value-format="YYYY-MM-DD"
      size="small"
      type="daterange"
      range-separator=":"
      :start-placeholder="t('fields.startDate')"
      :end-placeholder="t('fields.endDate')"
      style="margin-right: 10px;width: 300px"
      :shortcuts="shortcuts"
      :disabled-date="disabledDate"
      :editable="false"
      :clearable="false"
    />
    <el-button icon="el-icon-search" type="primary" @click="loadData" size="small">
      {{ t('fields.search') }}
    </el-button>
  </div>
  <el-card class="box-card" shadow="never" style="margin-top: 20px">
    <el-table
      height="600"
      size="small"
      :resizable="true"
      :data="records"
      v-loading="loading"
      :empty-text="t('fields.noData')"
    >
      <el-table-column :label="t('fields.loginName')" prop="loginName"
                       align="center" min-width="180"
      >
        <template #default="scope">
          <span v-if="scope.row.loginName !== null">{{ scope.row.loginName }}</span>
          <span v-if="scope.row.loginName === null">-</span>
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.registerTime')"
                       align="center" min-width="180"
      >
        <template #default="scope">
          <span v-formatter="{data: scope.row.regTime,timeZone: timeZone,type: 'date'}" />
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.depositSerialNo')" prop="depositSerialNumber"
                       align="center" min-width="180"
      >
        <template #default="scope">
          <span v-if="scope.row.depositSerialNumber !== null">{{ scope.row.depositSerialNumber }}</span>
          <span v-if="scope.row.depositSerialNumber === null">-</span>
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.depositAmount')" prop="depositAmount"
                       align="center" min-width="180"
      >
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.depositAmount,type: 'money'}" />
        </template>
      </el-table-column>
      <!-- <el-table-column :label="t('fields.bonusReceived')" prop="bonusReceived"
                       align="center" min-width="180"
      >
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.bonusReceived,type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.dateReceived')"
                       align="center" min-width="180"
      >
        <template #default="scope">
          <span v-if="scope.row.dateReceived !== null" v-formatter="{data: scope.row.dateReceived,timeZone: timeZone,type: 'date'}" />
          <span v-else>-</span>
        </template>
      </el-table-column> -->
    </el-table>
    <el-pagination
      :total="total"
      :page-sizes="[20, 50, 100, 150]"
      layout="total,sizes,prev, pager, next"
      style="margin-top: 10px"
      v-model:page-size="size"
      v-model:page-count="pages"
      v-model:current-page="current"
      @current-change="loadData"
      @size-change="loadData"
    />
  </el-card>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import moment from 'moment';
import { getMemberReferFriend } from "../../../../../api/member";
import { useI18n } from "vue-i18n";
import { getShortcuts } from "@/utils/datetime";

export default defineComponent({
  props: {
    mbrId: {
      type: String,
      required: true
    },
    siteId: {
      type: String,
      required: true
    },
    timeZone: {
      type: String,
      required: true,
    }
  },
  setup(props) {
    const { t } = useI18n();
    const shortcuts = getShortcuts(t);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 2);
    const defaultStartDate = convertDate(startDate);
    const defaultEndDate = convertDate(new Date());
    function convertDate(date) {
      return moment(date).format('YYYY-MM-DD');
    }
    function disabledDate(time) {
      return time.getTime() < moment(new Date()).subtract(2, 'months').startOf('month').format('x') || time.getTime() > new Date().getTime();
    }
    const memberData = reactive({
      pages: 0,
      total: 0,
      records: [],
      loading: false
    });
    const formData = reactive({
      regTime: [defaultStartDate, defaultEndDate],
      size: 20,
      current: 1
    });
    const loadData = async () => {
      memberData.loading = true;
      const formDataCopy = { ...formData };
      const query = {};
      Object.entries(formDataCopy).forEach(([key, value]) => {
        if (value) {
          query[key] = value;
        }
      });
      if (formData.regTime && formData.regTime.length === 2) {
        query.regTime = formData.regTime.join(",");
      }
      query.referrerId = props.mbrId;
      query.siteId = props.siteId;
      await getMemberReferFriend(query).then(res => {
        memberData.records = res?.data?.records;
        memberData.pages = res?.data?.pages;
        memberData.total = res?.data?.total;
      });
      memberData.loading = false;
    };
    onMounted(async () => {
      loadData();
    });
    return {
      loadData,
      shortcuts,
      startDate,
      defaultStartDate,
      defaultEndDate,
      disabledDate,
      convertDate,
      t,
      ...toRefs(formData),
      ...toRefs(memberData)
    };
  }
});
</script>

<style scoped>
.inputs-wrap {
  margin: 20px 0;
  display: flex;
}
</style>
