<template>
  <div class="inputs-wrap">
    <el-date-picker
      v-model="times"
      format="DD/MM/YYYY"
      value-format="YYYY-MM-DD"
      size="small"
      type="daterange"
      range-separator=":"
      :start-placeholder="t('fields.startDate')"
      :end-placeholder="t('fields.endDate')"
      style="width: 300px"
      :shortcuts="shortcuts"
      :disabled-date="disabledDate"
      :editable="false"
      :clearable="false"
    />
    <el-button icon="el-icon-search" type="primary" @click="loadData" size="small" style="margin-left:10px">
      {{ t('fields.search') }}
    </el-button>
  </div>
  <el-card class="box-card" shadow="never" style="margin-top: 20px">
    <el-table
      height="600"
      size="small"
      :resizable="true"
      :data="records"
      @sort-change="sort"
      v-loading="loading"
      :empty-text="t('fields.noData')"
    >
      <el-table-column :label="t('fields.serialNo')" prop="serialNumber"
                       align="center" min-width="280"
      />
      <el-table-column :label="t('fields.type')" prop="type"
                       align="center" min-width="180"
      >
        <template #default="scope">
          <span v-if="scope.row.type !== null">{{ t(transferTypeTrans[scope.row.type]) }}</span>
          <span v-if="scope.row.type === null">-</span>
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.platform')" prop="platformName"
                       align="center" min-width="180"
      >
        <template #default="scope">
          <span v-if="scope.row.platformName !== null">{{ scope.row.platformName }}</span>
          <span v-if="scope.row.platformName === null">-</span>
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.amount')"
                       align="center" min-width="180" prop="amount"
                       sortable
      >
        <template #default="scope">
          <span v-if="scope.row.amount < 0" style="color: red">$ <span v-formatter="{data: scope.row.amount,type: 'money'}" /></span>
          <span v-else> $ <span v-formatter="{data: scope.row.amount,type: 'money'}" /></span>
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.transferDate')"
                       align="center" min-width="180" prop="transferDate"
                       sortable
      >
        <template #default="scope">
          <span v-formatter="{data: scope.row.transferDate,timeZone: timeZone,type: 'date'}" />
        </template>
      </el-table-column>
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
import { defineComponent, reactive, toRefs } from "vue";
import moment from 'moment';
import { getMemberTransferRecord } from "../../../../../api/member";
import { useI18n } from "vue-i18n";
import { useRoute } from 'vue-router'
import { getShortcuts } from "@/utils/datetime";
import { formatInputTimeZone } from "@/utils/format-timeZone"

export default defineComponent({
  props: {
    mbrId: {
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
    const route = useRoute()
    const site = reactive({
      id: route.query.site
    });
    const transferTypeTrans = {
      DEPOSIT: 'fields.transferIn',
      WITHDRAW: 'fields.transferOut'
    };
    const shortcuts = getShortcuts(t);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 2);
    const defaultStartDate = convertDate(startDate);
    const defaultEndDate = convertDate(new Date());
    const request = reactive({ siteId: null });
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
      times: [defaultStartDate, defaultEndDate],
      siteId: request.siteId,
      size: 20,
      current: 1,
      orderBy: "transfer_date",
      sortType: "DESC"
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
      if (formData.times && formData.times.length === 2) {
        query.times = JSON.parse(JSON.stringify(formData.times));
        query.times[0] = formatInputTimeZone(query.times[0], props.timeZone, 'start');
        query.times[1] = formatInputTimeZone(query.times[1], props.timeZone, 'end');
        query.times = query.times.join(',')
      }
      query.siteId = site.id;
      query.memberId = props.mbrId;
      await getMemberTransferRecord(props.mbrId, query).then(res => {
        memberData.records = res?.data?.records;
        memberData.pages = res?.data?.pages;
        memberData.total = res?.data?.total;
      });
      memberData.loading = false;
    };
    const sort = (column) => {
      formData.orderBy = column.prop;
      if (column.order === "descending") {
        formData.sortType = "DESC";
      } else {
        formData.sortType = "ASC";
      }
      loadData();
    };

    return {
      shortcuts,
      startDate,
      defaultStartDate,
      defaultEndDate,
      request,
      disabledDate,
      convertDate,
      t,
      ...toRefs(memberData),
      ...toRefs(formData),
      sort,
      loadData,
      transferTypeTrans
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
