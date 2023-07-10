<template>
  <div class="roles-main">
    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.affiliateBankCard') }}</span>
        </div>
      </template>
      <el-table :data="memberBankCardPage.records" ref="table"
                row-key="id"
                size="small"
                highlight-current-row
                v-loading="memberBankCardPage.loading"
                :empty-text="t('fields.noData')"
      >
        <el-table-column
          :label="t('fields.sn')"
          type="index"
          align="center"
          min-width="280"
        />
        <el-table-column prop="bankName" :label="t('fields.bankName')" align="center" min-width="180" />
        <el-table-column prop="cardNumber" :label="t('fields.cardNumber')" align="center" min-width="180" />
        <el-table-column prop="cardAddress" :label="t('fields.cardAddress')" align="center" min-width="180" />
        <el-table-column prop="cardAccount" :label="t('fields.cardAccount')" align="center" min-width="180" />
        <el-table-column prop="createTime" :label="t('fields.createTime')" align="center" min-width="180">
          <template #default="scope">
            <span v-if="scope.row.createTime === null">-</span>
            <span
              v-if="scope.row.createTime !== null"
              v-formatter="{data: scope.row.createTime, formatter: 'YYYY/MM/DD HH:mm:ss', type: 'date'}"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        @current-change="changeMemberBankPage"
        layout="prev, pager, next"
        :page-size="memberBankCardRequest.size"
        :page-count="memberBankCardPage.pages"
        :current-page="memberBankCardRequest.current"
      />
    </el-card>

    <div class="header-container">
      <div class="search">
        <el-date-picker
          v-model="memberBankLogRequest.operationTime"
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
          @click="loadMemberBankLog()"
        >{{ t('fields.search') }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
      </div>
    </div>

    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.affiliateBankCardRecord') }}</span>
        </div>
      </template>
      <el-table :data="memberBankLogPage.records" ref="table"
                row-key="id"
                size="small"
                highlight-current-row
                v-loading="memberBankLogPage.loading"
                :empty-text="t('fields.noData')"
      >
        <el-table-column
          :label="t('fields.sn')"
          type="index"
          align="center"
          min-width="280"
        />
        <el-table-column prop="bankName" :label="t('fields.bankName')" align="center" min-width="180" />
        <el-table-column prop="cardNumber" :label="t('fields.cardNumber')" align="center" min-width="180" />
        <el-table-column prop="cardAddress" :label="t('fields.cardAddress')" align="center" min-width="180" />
        <el-table-column prop="cardAccount" :label="t('fields.cardAccount')" align="center" min-width="180" />
        <el-table-column prop="type" :label="t('fields.type')" align="center" min-width="180" />
        <el-table-column prop="operationTime" :label="t('fields.operationTime')" align="center" min-width="180">
          <template #default="scope">
            <span v-if="scope.row.operationTime === null">-</span>
            <span
              v-if="scope.row.operationTime !== null"
              v-formatter="{data: scope.row.operationTime, formatter: 'YYYY/MM/DD HH:mm:ss', type: 'date'}"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        @current-change="changeMemberBankLogPage"
        layout="prev, pager, next"
        :page-size="memberBankLogRequest.size"
        :page-count="memberBankLogPage.pages"
        :current-page="memberBankLogRequest.current"
      />
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, defineProps, reactive } from 'vue';
import moment from 'moment';
import { getMemberBank, getMemberBankLog } from '../../../../../api/member';
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
      start.setTime(
        moment(start)
          .startOf('day')
          .format('x')
      )
      return [start, end];
    }
  },
  {
    text: t('fields.yesterday'),
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(moment(start).subtract(1, 'days').startOf('day').format('x'));
      end.setTime(moment(end).subtract(1, 'days').endOf('day').format('x'));
      return [start, end];
    }
  },
  {
    text: t('fields.thisWeek'),
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(moment(start).startOf('isoWeek').format('x'));
      return [start, end];
    }
  },
  {
    text: t('fields.lastWeek'),
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(moment(start).subtract(1, 'weeks').startOf('isoWeek').format('x'));
      end.setTime(moment(end).subtract(1, 'weeks').endOf('isoWeek').format('x'));
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

const memberBankCardRequest = reactive({
  size: 5,
  current: 1,
  orderBy: "createTime",
  sortType: "DESC"
});

const memberBankLogRequest = reactive({
  size: 10,
  current: 1,
  operationTime: [defaultStartDate, defaultEndDate],
  orderBy: "operationTime",
  sortType: "DESC"
});

function resetQuery() {
  memberBankLogRequest.operationTime = [defaultStartDate, defaultEndDate];
}

const memberBankCardPage = reactive({
  pages: 0,
  records: [],
  loading: false
});

const memberBankLogPage = reactive({
  pages: 0,
  records: [],
  loading: false
});

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD');
}

function disabledDate(time) {
  return time.getTime() < moment(new Date()).subtract(2, 'months').startOf('month').format('x') || time.getTime() > new Date().getTime();
}

async function loadMemberBank() {
  memberBankCardPage.loading = true;
  const requestCopy = { ...memberBankCardRequest };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  query.memberId = props.affId;
  const { data: ret } = await getMemberBank(props.affId, query);
  memberBankCardPage.pages = ret.pages;
  memberBankCardPage.records = ret.records;
  memberBankCardPage.loading = false;
}

async function loadMemberBankLog() {
  memberBankLogPage.loading = true;
  const requestCopy = { ...memberBankLogRequest };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  if (memberBankLogRequest.operationTime !== null) {
    if (memberBankLogRequest.operationTime.length === 2) {
      query.operationTime = memberBankLogRequest.operationTime.join(",");
    }
  }
  query.memberId = props.affId;
  const { data: ret } = await getMemberBankLog(props.affId, query);
  memberBankLogPage.pages = ret.pages;
  memberBankLogPage.records = ret.records;
  memberBankLogPage.loading = false;
}

function changeMemberBankPage(page) {
  if (memberBankCardRequest.current >= 1) {
    memberBankCardRequest.current = page;
    loadMemberBank();
  }
}

function changeMemberBankLogPage(page) {
  if (memberBankLogRequest.current >= 1) {
    memberBankLogRequest.current = page;
    loadMemberBankLog();
  }
}

onMounted(() => {
  loadMemberBank();
});
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin: 40px 0 20px;
  display: flex;
}

.search {
  display: flex;
  justify-content: flex-start;
}
</style>
