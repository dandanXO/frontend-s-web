<template>
  <div class="roles-main">
    <div class="header-container" style="margin-bottom: 40px">
      <div class="search">
        <el-input v-model="request.memberName" size="small" style="width: 150px;" :placeholder="t('fields.memberName')" />
        <el-select
          clearable
          v-model="request.freezeType"
          size="small"
          :placeholder="t('fields.freezeType')"
          class="filter-item"
          style="width: 150px;margin-left: 5px"
        >
          <el-option
            v-for="item in freezeType.list"
            :key="item.key"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
        <el-input v-model="request.createBy" size="small" style="width: 150px;margin-left: 5px" :placeholder="t('fields.operator')" />
        <el-date-picker
          style="margin-left: 5px"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          v-model="request.createTime"
          size="small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
        />
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadFreezeRecords">
          {{ t('fields.search') }}
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">
          {{ t('fields.reset') }}
        </el-button>
      </div>
    </div>
    <el-table
      :data="page.records"
      v-loading="page.loading"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      style="width: 100%;margin: 20px;"
      :empty-text="t('fields.noData')"
    >
      <el-table-column prop="memberName" :label="t('fields.memberName')" width="250" />
      <el-table-column prop="freezeType" :label="t('fields.freezeType')" width="250">
        <template #default="scope">
          <span v-for="f in freezeType.list"
                :key="f.key"
          >
            <span v-if="scope.row.freezeType === f.value">{{ f.name }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="reason" :label="t('fields.reason')" width="250" />
      <el-table-column prop="createTime" :label="t('fields.createTime')" width="250" />
      <el-table-column prop="createBy" :label="t('fields.operator')" />
    </el-table>
    <el-pagination class="pagination"
                   @current-change="changePage"
                   layout="prev, pager, next"
                   :page-size="request.size"
                   :page-count="page.pages"
                   :current-page="request.current"
    />
  </div>
</template>

<script setup>

import moment from "moment";
import { onMounted, reactive } from "vue";
import { getFreezeRecords } from "../../../api/freeze";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const page = reactive({
  pages: 0,
  records: [],
  loading: false
});

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
  }
];

const startDate = new Date();
startDate.setDate(startDate.getDate() - 2);
const defaultStartDate = convertDate(startDate);
const defaultEndDate = convertDate(new Date());

const request = reactive({
  size: 30,
  current: 1,
  memberName: null,
  freezeType: null,
  createBy: null,
  createTime: [defaultStartDate, defaultEndDate]
});

const freezeType = reactive({
  list: [
    { key: 1, name: "NORMAL", value: "NORMAL" },
    { key: 2, name: "TEMPORARY", value: "TEMPORARY" },
    { key: 3, name: "PERMANENT", value: "PERMANENT" }
  ]
})

function resetQuery() {
  request.memberName = null;
  request.freezeType = null;
  request.createBy = null;
  request.createTime = [];
}

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD');
}

function disabledDate(time) {
  return time.getTime() < moment(new Date()).subtract(2, 'months').startOf('month').format('x') || time.getTime() > new Date().getTime();
}

async function loadFreezeRecords() {
  page.loading = true;
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  if (request.createTime.length === 2) {
    query.createTime = request.createTime.join(",");
  }
  const { data: ret } = await getFreezeRecords(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.loading = false;
}

function changePage(page) {
  request.current = page;
  loadFreezeRecords();
}

onMounted(() => {
  loadFreezeRecords();
});

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin-bottom: 10px;
}

.search {
  display: flex;
  justify-content: flex-start;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}

</style>
