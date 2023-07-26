<template>
  <div class="roles-main">
    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ $t('fields.downlineMember') }}</span>
        </div>
      </template>
      <div class="inputs-wrap">
        <el-date-picker
          v-model="request.regTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          class="input-small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
        />
        <el-input v-model="request.loginName" class="input-small" :placeholder="t('fields.loginName')" />
        <el-input v-model="request.realName" class="input-small" :placeholder="t('fields.name')" />
        <el-input v-model="request.telephone" class="input-small" :placeholder="t('fields.telephone')" />
        <el-input v-model="request.email" class="input-small" :placeholder="t('fields.email')" />
        <div class="btn-grp">
          <el-button icon="el-icon-search" type="primary" @click="loadAffiliateMembers()" size="mini">
            {{ $t('fields.search') }}
          </el-button>
          <el-button size="mini" type="warning" @click="resetQuery()">
            {{ $t('fields.reset') }}
          </el-button>
        </div>
      </div>
      <el-table :data="page.records" ref="table"
                row-key="id"
                size="small"
                highlight-current-row
                v-loading="page.loading"
                style="margin-top: 15px;"
                :empty-text="t('fields.noData')"
      >
        <el-table-column prop="loginName" :label="t('fields.loginName')" align="center" min-width="180" />
        <el-table-column prop="status" :label="t('fields.status')" align="center" min-width="180">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 'NORMAL'" type="success" size="mini">{{ scope.row.status }}</el-tag>
            <el-tag v-if="scope.row.status === 'FROZEN'" type="danger" size="mini">{{ scope.row.status }}</el-tag>
            <el-tag v-if="scope.row.status === null" type="info" size="mini">-</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="site" :label="t('fields.site')" align="center" min-width="180" />
        <el-table-column prop="balance" :label="t('fields.balance')" align="center" min-width="180">
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.balance,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="regTime" :label="t('fields.registerTime')" align="center" min-width="180">
          <template #default="scope">
            <span v-if="scope.row.regTime === null">-</span>
            <span
              v-if="scope.row.regTime !== null"
              v-formatter="{data: scope.row.regTime, formatter: 'YYYY/MM/DD HH:mm:ss', type: 'date'}"
            />
          </template>
        </el-table-column>
        <el-table-column prop="totalDeposit" :label="t('fields.totalDeposit')" align="center" min-width="180">
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.totalDeposit,type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column prop="totalWithdraw" :label="t('fields.totalWithdraw')" align="center" min-width="180">
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.totalWithdraw,type: 'money'}" />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        @current-change="changePage"
        layout="prev, pager, next"
        :page-size="request.size"
        :page-count="page.pages"
        :current-page="request.current"
      />
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import { useStore } from "@/store";
import moment from 'moment';
import { getAffiliateDownline } from '../../../api/affiliate';
import { useI18n } from "vue-i18n";

const store = useStore();
const { t } = useI18n();
const defaultDate = convertDate(new Date());

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
  }
];

const request = reactive({
  regTime: [defaultDate, defaultDate],
  loginName: null,
  realName: null,
  telephone: null,
  email: null,
  size: 20,
  current: 1
});

const page = reactive({
  pages: 0,
  records: [],
  loading: false
});

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD');
}

function disabledDate(time) {
  return time.getTime() > new Date().getTime();
}

function resetQuery() {
  request.regTime = [defaultDate, defaultDate];
  request.loginName = null;
  request.realName = null;
  request.telephone = null;
  request.email = null;
}

async function loadAffiliateMembers() {
  page.loading = true;
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  if (request.regTime !== null) {
    if (request.regTime.length === 2) {
      query.regTime = request.regTime.join(",");
    }
  }
  query.siteId = store.state.user.siteId;
  query.memberTypes = "NORMAL,TEST";
  const { data: ret } = await getAffiliateDownline(store.state.user.id, query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.loading = false;
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page;
    loadAffiliateMembers();
  }
}

onMounted(() => {
  loadAffiliateMembers();
});
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin: 40px 0 20px;
  display: flex;
}

.box-card {
  ::v-deep(.el-card__body) {
    padding: 0;
  }
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

@media (max-width: 768px) {
  .inputs-wrap {
    flex-direction: column;
    gap: 10px;
    .el-input--small {
      width: 100% !important;
      max-width: unset !important;
      margin: 0 !important;
      .el-button {
        margin: 0 !important;
      }
    }
    .input-small {
      max-width: unset;
      width: 100%;
    &.el-range-editor--small.el-input__inner {
      max-width: unset;
    }
    }
  }
}
</style>
