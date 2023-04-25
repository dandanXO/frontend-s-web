<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-date-picker
          v-model="request.recordTime"
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
        <el-button
          style="margin-left: 10px"
          icon="el-icon-search"
          size="mini"
          type="primary"
          @click="loadMemberMoneyChange()"
        >{{ t('fields.search') }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
      </div>
    </div>

    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <el-table
        height="600"
        size="small"
        :resizable="true"
        :data="page.records"
        @sort-change="sort"
        v-loading="page.loading"
        :empty-text="t('fields.noData')"
      >
        <el-table-column
          prop="serialNumber"
          :label="t('fields.serialNo')"
          align="center"
          min-width="280"
          sortable
        />
        <el-table-column prop="type" :label="t('fields.type')" align="center" min-width="180" />
        <el-table-column prop="subType" :label="t('fields.privilege')" align="center" min-width="180">
          <template #default="scope">
            <span v-if="scope.row.subType === null">-</span>
            <span v-if="scope.row.subType !== null">{{ scope.row.subType }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="platformName" :label="t('fields.platformName')" align="center" min-width="180">
          <template #default="scope">
            <span v-if="scope.row.platformName === null">-</span>
            <span v-if="scope.row.platformName !== null">{{ scope.row.platformName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" :label="t('fields.amount')" align="center" min-width="180" sortable />
        <el-table-column prop="beforeBalance" :label="t('fields.beforeBalance')" align="center" min-width="180">
          <template #default="scope">
            <span v-if="scope.row.beforeBalance === 0">-</span>
            <span v-if="scope.row.beforeBalance !== 0">{{ scope.row.beforeBalance }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="afterBalance" :label="t('fields.afterBalance')" align="center" min-width="180">
          <template #default="scope">
            <span v-if="scope.row.afterBalance === 0">-</span>
            <span v-if="scope.row.afterBalance !== 0">{{ scope.row.afterBalance }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="platformBalance"
          :label="t('fields.platformBalance')"
          align="center"
          min-width="180"
        >
          <template #default="scope">
            <span v-if="scope.row.platformBalance === 0">-</span>
            <span v-if="scope.row.platformBalance !== 0">{{ scope.row.platformBalance }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="recordTime"
          :label="t('fields.recordTime')"
          align="center"
          min-width="180"
          sortable
        >
          <template #default="scope">
            <span v-if="scope.row.recordTime === null">-</span>
            <!-- eslint-disable -->
            <span
              v-if="scope.row.recordTime !== null"
              v-formatter="{ data: scope.row.recordTime, formatter: 'YYYY/MM/DD HH:mm:ss', type: 'date' }"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :total="page.total"
        :page-sizes="[20, 50, 100, 150]"
        layout="total,sizes,prev, pager, next"
        style="margin-top: 10px"
        v-model:page-size="request.size"
        v-model:page-count="page.pages"
        v-model:current-page="request.current"
        @current-change="loadMemberMoneyChange"
        @size-change="loadMemberMoneyChange"
      />
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, defineProps, reactive } from 'vue';
import moment from 'moment';
import { getMemberMoneyChangeList } from '../../../../../api/member';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps({
  affId: {
    type: String,
    required: true
  }
})

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

const request = reactive({
  size: 20,
  current: 1,
  recordTime: [defaultStartDate, defaultEndDate],
  orderBy: "recordTime",
  sortType: "DESC"
});

function resetQuery() {
  request.recordTime = [defaultStartDate, defaultEndDate];
}

const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false
});

const sort = (column) => {
  request.orderBy = column.prop;
  if (column.order === "descending") {
    request.sortType = "DESC";
  } else {
    request.sortType = "ASC";
  }
  loadMemberMoneyChange();
};

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD');
}

function disabledDate(time) {
  return time.getTime() < moment(new Date()).subtract(2, 'months').startOf('month').format('x') || time.getTime() > new Date().getTime();
}

async function loadMemberMoneyChange() {
  page.loading = true;
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  if (request.recordTime !== null) {
    if (request.recordTime.length === 2) {
      query.recordTime = request.recordTime.join(",");
    }
  }
  query.memberId = props.affId;
  const { data: ret } = await getMemberMoneyChangeList(props.affId, query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.total = ret.total;
  page.loading = false;
}

onMounted(() => {
  loadMemberMoneyChange();
});

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin: 20px 0;
  display: flex;
}

.search {
  display: flex;
  justify-content: flex-start;
}
</style>
