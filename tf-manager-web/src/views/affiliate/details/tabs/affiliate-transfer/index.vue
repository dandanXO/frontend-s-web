<template>
  <div class="roles-main">
    <div class="inputs-wrap">
      <el-date-picker
        v-model="request.transferDate"
        format="DD/MM/YYYY"
        value-format="YYYY-MM-DD HH:mm:ss"
        size="small"
        type="daterange"
        :start-placeholder="t('fields.startDate')"
        :end-placeholder="t('fields.endDate')"
        style="width: 380px"
        :shortcuts="shortcuts"
        :disabled-date="disabledDate"
        :editable="false"
        :clearable="false"
        :default-time="defaultTime"
      />
      <div class="btn-grp">
        <el-button icon="el-icon-search" type="primary" @click="loadTransferRecords()" size="mini">
          {{ $t('fields.search') }}
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
      <el-table-column prop="memberName" :label="t('fields.loginName')" align="center" min-width="150" />
      <el-table-column prop="transferAmount" :label="t('fields.affiliateTransferAmount')" align="center" min-width="100">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.transferAmount,type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="transferDate" :label="t('fields.transferDate')" align="center" min-width="150">
        <template #default="scope">
          <span v-if="scope.row.transferDate === null">-</span>
          <span
            v-if="scope.row.transferDate !== null"
            v-formatter="{data: scope.row.transferDate, timeZone: timeZone, type: 'date'}"
          />
        </template>
      </el-table-column>
      <el-table-column prop="rollover" :label="t('fields.rollover')" align="center" min-width="100" />
    </el-table>
    <el-pagination
      class="pagination"
      @current-change="changePage"
      layout="prev, pager, next"
      :page-size="request.size"
      :page-count="page.pages"
      :current-page="request.current"
    />
  </div>
</template>

<script setup>
import { onMounted, defineProps, reactive } from 'vue';
import moment from 'moment';
import { getTransferRecords } from '@/api/member-affiliate';
import { useI18n } from "vue-i18n";
import { useRoute } from 'vue-router';
import { getShortcuts } from "@/utils/datetime";
import { formatInputTimeZone } from "@/utils/format-timeZone"

const { t } = useI18n();
const props = defineProps({
  affId: {
    type: String,
    required: true,
  },
  timeZone: {
    type: String,
    required: true
  }
})

const route = useRoute()
const site = reactive({
  id: route.query.site
});

const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59),
];
const shortcuts = getShortcuts(t);

const request = reactive({
  size: 20,
  current: 1,
  transferDate: [convertStartDate(new Date()), convertDate(new Date())]
});

const page = reactive({
  pages: 0,
  records: [],
  loading: false
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
      query.transferDate = JSON.parse(JSON.stringify(request.transferDate));
      query.transferDate[0] = formatInputTimeZone(query.transferDate[0], props.timeZone);
      query.transferDate[1] = formatInputTimeZone(query.transferDate[1], props.timeZone);
      query.transferDate = query.transferDate.join(',')
    }
  }
  query.siteId = site.id;
  const { data: ret } = await getTransferRecords(props.affId, query);
  page.pages = ret.pages;
  page.records = ret.records;
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
