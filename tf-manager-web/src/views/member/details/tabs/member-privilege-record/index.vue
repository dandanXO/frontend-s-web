<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.privilegeName"
          size="small"
          :placeholder="t('fields.privilegeName')"
          class="filter-item"
          style="margin-left: 5px; width: 200px;"
          clearable
        >
          <el-option
            v-for="item in privilege.list"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <el-date-picker
          v-model="request.recordTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="margin-left: 10px; width: 300px"
          @change="checkDateValue"
          :shortcuts="shortcuts"
          :editable="false"
          :clearable="false"
        />
        <el-button
          style="margin-left: 10px"
          icon="el-icon-search"
          size="mini"
          type="primary"
          @click="loadMemberPrivilegeRecord"
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
          prop="privilegeName"
          :label="t('fields.privilegeName')"
          align="center"
          min-width="180"
        />
        <el-table-column
          prop="privilegeType"
          :label="t('fields.privilegeType')"
          align="center"
          min-width="180"
        />
        <el-table-column prop="amount" :label="t('fields.amount')" align="center" min-width="180" sortable />
        <el-table-column
          prop="rollover"
          :label="t('fields.turnoverMultiple')"
          align="center"
          min-width="180"
          sortable
        />
        <el-table-column
          prop="updateBy"
          :label="t('fields.updateBy')"
          align="center"
          min-width="180"
        />
        <el-table-column
          prop="recordTime"
          :label="t('fields.receiveTime')"
          align="center"
          min-width="180"
          sortable
        >
          <template #default="scope">
            <span v-if="scope.row.recordTime === null">-</span>
            <!-- eslint-disable -->
            <span
              v-if="scope.row.recordTime !== null"
              v-formatter="{ data: scope.row.recordTime, timeZone: timeZone, type: 'date' }"
            />
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top:10px;">
        <span>{{ t('fields.totalPrivilegeAmount') }}: {{ page.totalPrivilegeAmount }} </span>
      </div>
      <el-pagination
        :total="page.total"
        :page-sizes="[20, 50, 100, 150]"
        layout="total,sizes,prev, pager, next"
        style="margin-top: 10px"
        v-model:page-size="request.size"
        v-model:page-count="page.pages"
        v-model:current-page="request.current"
        @current-change="loadMemberPrivilegeRecord"
        @size-change="loadMemberPrivilegeRecord"
      />
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, defineProps, reactive } from 'vue';
import moment from 'moment';
import { getMemberPrivilegeRecord, getMemberPrivilegeRecordTotal, getMemberPrivilegeRecordNameList } from '../../../../../api/member';
import { useI18n } from "vue-i18n";
import { getShortcuts } from "@/utils/datetime";
import { formatInputTimeZone } from "@/utils/format-timeZone"
import { ElMessage } from "element-plus";

const props = defineProps({
  mbrId: {
    type: String,
    required: true
  },
  timeZone: {
    type: String,
    required: true,
  }
})

const privilege = reactive({
  list: []
});

const { t } = useI18n();
const shortcuts = getShortcuts(t);
const startDate = new Date();
startDate.setDate(startDate.getDate() - 2);
const defaultStartDate = convertDate(startDate);
const defaultEndDate = convertDate(new Date());

const request = reactive({
  size: 20,
  current: 1,
  privilegeName: null,
  recordTime: [defaultStartDate, defaultEndDate]
});

const checkDateValue = (date) => {
  const [startCheck, endCheck] = date;
  const distract = moment(endCheck).diff(startCheck, 'days');
  if (distract >= 93) {
    ElMessage({
      message: t('message.startenddatemore3months'),
      type: "error"
    });
    request.recordTime = [defaultStartDate, defaultEndDate];
  }
}

function resetQuery() {
  request.privilegeName = null;
  request.recordTime = [defaultStartDate, defaultEndDate];
}

const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false,
  totalPrivilegeAmount: 0
});

const sort = (column) => {
  request.orderBy = column.prop;
  if (column.order === "descending") {
    request.sortType = "DESC";
  } else {
    request.sortType = "ASC";
  }
  loadMemberPrivilegeRecord();
};

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD');
}

async function loadMemberPrivilegeRecord() {
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
      query.recordTime = JSON.parse(JSON.stringify(request.recordTime));
      query.recordTime[0] = formatInputTimeZone(query.recordTime[0], props.timeZone, 'start');
      query.recordTime[1] = formatInputTimeZone(query.recordTime[1], props.timeZone, 'end');
      query.recordTime = query.recordTime.join(',')
    }
  }
  query.memberId = props.mbrId;
  const { data: ret } = await getMemberPrivilegeRecord(props.mbrId, query);
  page.pages = ret.pages;
  page.records = patchRecord(ret.records);
  page.total = ret.total;
  page.loading = false;
  const { data: ttl } = await getMemberPrivilegeRecordTotal(props.mbrId, query);
  // Calculate the total amount
  page.totalPrivilegeAmount = ttl;

  const { data: nameList } = await getMemberPrivilegeRecordNameList(props.mbrId, query);
  console.log()
  privilege.list = nameList;
}

function patchRecord(records) {
  if (records.length > 0) {
    records.forEach((item, index) => {
      if (item.privilegeAlias !== null) {
        item.privilegeName = item.privilegeAlias;
      }
    })
  }
  return records;
}

onMounted(() => {
  loadMemberPrivilegeRecord();
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
