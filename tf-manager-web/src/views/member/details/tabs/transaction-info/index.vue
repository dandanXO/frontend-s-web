<template>
  <div class="inputs-wrap">
    <el-date-picker
      v-model="transferDate"
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
          <span v-if="scope.row.type !== null">{{ scope.row.type }}</span>
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
          <span v-formatter="{data: scope.row.transferDate,formatter: 'YYYY/MM/DD HH:mm:ss',type: 'date'}" />
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

export default defineComponent({
  props: {
    mbrId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { t } = useI18n();
    const shortcuts = [
      {
        text: t('fields.today'),
        value: () => {
          const end = new Date();
          const start = new Date();
          return [start, end];
        }
      },
      {
        text: t('fields.yesterday'),
        value: () => {
          const end = new Date();
          const start = new Date();
          start.setTime(moment(start).subtract(1, 'days').format('x'));
          end.setTime(moment(end).subtract(1, 'days').format('x'));
          return [start, end];
        }
      },
      {
        text: t('fields.thisWeek'),
        value: () => {
          const end = new Date();
          const start = new Date();
          start.setTime(moment(start).startOf('week').format('x'));
          return [start, end];
        }
      },
      {
        text: t('fields.lastWeek'),
        value: () => {
          const end = new Date();
          const start = new Date();
          start.setTime(moment(start).subtract(1, 'weeks').startOf('week').format('x'));
          end.setTime(moment(end).subtract(1, 'weeks').endOf('week').format('x'));
          return [start, end];
        }
      },
      {
        text: t('fields.thisMonth'),
        value: () => {
          const end = new Date();
          const start = new Date();
          start.setTime(moment(start).startOf('month').format('x'));
          return [start, end];
        }
      },
      {
        text: t('fields.lastMonth'),
        value: () => {
          const end = new Date();
          const start = new Date();
          start.setTime(moment(start).subtract(1, 'months').startOf('month').format('x'));
          end.setTime(moment(end).subtract(1, 'months').endOf('month').format('x'));
          return [start, end];
        }
      },
      {
        text: t('fields.last3Months'),
        value: () => {
          const end = new Date();
          const start = new Date();
          start.setTime(moment(start).subtract(2, 'months').startOf('month').format('x'));
          return [start, end];
        }
      }
    ];
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
      transferDate: [defaultStartDate, defaultEndDate],
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
      if (formData.transferDate && formData.transferDate.length === 2) {
        query.transferDate = formData.transferDate.join(",");
      }
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
      disabledDate,
      convertDate,
      t,
      ...toRefs(memberData),
      ...toRefs(formData),
      sort,
      loadData
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
