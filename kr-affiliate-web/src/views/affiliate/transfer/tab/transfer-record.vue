<template>
  <div class="roles-main">
    <div class="inputs-wrap">
      <el-date-picker
        v-model="request.transferDate"
        format="DD/MM/YYYY"
        value-format="YYYY-MM-DD HH:mm:ss"
        size="normal"
        type="daterange"
        :start-placeholder="t('fields.startDate')"
        :end-placeholder="t('fields.endDate')"
        style="width: 100%; max-width: 300px"
        :shortcuts="shortcuts"
        :disabled-date="disabledDate"
        :editable="false"
        :clearable="false"
        :default-time="defaultTime"
      />
      <div class="btn-grp">
        <el-button icon="el-icon-search" type="primary" @click="loadTransferRecords()" size="normal">
          {{ $t('fields.search') }}
        </el-button>
      </div>
    </div>
    <table cellpadding="0" cellspacing="0" border="0" style="width: 98%; margin: 0 auto" class="custom-table">
      <thead>
        <tr>
          <th scope="col">{{ t('fields.loginName') }}</th>
          <th scope="col">{{ t('fields.transferAmount') }}</th>
          <th scope="col">{{ t('fields.transferDate') }}</th>
          <th scope="col">{{ t('fields.rollover') }}</th>
          <th scope="col">{{ t('fields.transferType') }}</th>
        </tr>
      </thead>
      <tbody v-if="page.records.length > 0">
        <tr v-for="item in page.records" :key="item.id">
          <td :data-label="t('fields.loginName')">{{ item.memberName }}</td>
          <td :data-label="t('fields.transferAmount')">
            <span v-formatter="{data: item.transferAmount, type: 'money'}" />
          </td>
          <td :data-label="t('fields.transferDate')">
            <span v-if="item.transferDate === null">-</span>
            <span v-if="item.transferDate !== null" v-formatter="{ data: item.transferDate, type: 'date'}" />
          </td>
          <td :data-label="t('fields.rollover')">{{ item.rollover }}</td>
          <td :data-label="t('fields.transferType')">
            <el-tag v-if="item.type === 'DEPOSIT'" type="success" size="normal">{{ t('transferType.' + item.type) }}</el-tag>
            <el-tag v-else-if="item.type === 'COMMISSION'" type="warning" size="normal">{{ t('transferType.' + item.type) }}</el-tag>
            <el-tag v-else-if="item.type === 'RECYCLE'" type="warning" size="normal">{{ t('fields.recycle') }}</el-tag>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="page.records.length === 0">
      <emptyComp />
    </div>
    <div class="table-footer">
      <span style="margin-right:20px;">{{ t('fields.totalTransfer') }}: <span v-formatter="{data: page.totalTransfer,type: 'money'}" /></span>
    </div>
    <el-pagination
      class="pagination"
      @current-change="changePage"
      layout="total, prev, pager, next"
      :total="page.total"
      :page-size="request.size"
      :page-count="page.pages"
      :current-page="request.current"
    />
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import { useStore } from "@/store";
import moment from 'moment';
import { getTransferRecords, getTotal } from '@/api/affiliate-member-transfer';
import { useI18n } from "vue-i18n";
import emptyComp from "@/components/empty"

const store = useStore();
const { t } = useI18n();

const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59),
];
const shortcuts = [
  {
    text: t('fields.today'),
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(moment(start).startOf('day').format('x'));
      end.setTime(moment(end).endOf('day').format('x'));
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
      end.setTime(moment(end).endOf('day').format('x'));
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
      end.setTime(moment(end).endOf('day').format('x'));
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

const request = reactive({
  size: 20,
  current: 1,
  transferDate: [convertStartDate(new Date()), convertDate(new Date())]
});

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
  total: 0,
  totalTransfer: 0
});

function convertDate(date) {
  return moment(date).endOf('day').format('YYYY-MM-DD HH:mm:ss');
}

function convertStartDate(date) {
  return moment(date).startOf('day').format('YYYY-MM-DD HH:mm:ss');
}

function disabledDate(time) {
  return time.getTime() > new Date().getTime();
}

async function loadTransferRecords() {
  page.loading = true;
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  if (request.transferDate !== null) {
    if (request.transferDate.length === 2) {
      query.transferDate = request.transferDate.join(",");
    }
  }
  query.siteId = store.state.user.siteId;
  const { data: ret } = await getTransferRecords(store.state.user.id, query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.total = ret.total;
  const { data: total } = await getTotal(store.state.user.id, query);
  page.totalTransfer = total;
  page.loading = false;
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page;
    loadTransferRecords();
  }
}

onMounted(() => {
  loadTransferRecords();
});
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin: 40px 0 20px;
  display: flex;
}

.inputs-wrap {
  margin: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  .input-small {
    width: 100%;
    max-width: 200px;
    &.el-range-editor--small.el-input__inner {
      height: 40px;
      max-width: 300px;
    }
  }
  .btn-grp {
    display: flex;
  }
}

.el-pagination {
  display: inline-block;
}

.table-footer {
  margin-top: 15px;
  margin-right: 20px;
  float: right;
  font-size: small;
}

@media (max-width: 768px) {
  // .inputs-wrap {
  //   flex-direction: column;
  //   gap: 10px;
  //   .el-input--small {
  //     width: 100% !important;
  //     max-width: unset !important;
  //     margin: 0 !important;
  //     .el-button {
  //       margin: 0 !important;
  //     }
  //   }
  //   .input-small {
  //     max-width: unset;
  //     width: 100%;
  //   &.el-range-editor--small.el-input__inner {
  //     max-width: unset;
  //   }
  //   }
  // }
}
</style>
