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
          @change="checkDateValue"
          :editable="false"
          :clearable="false"
        />
        <el-button
          style="margin-left: 10px"
          icon="el-icon-search"
          size="mini"
          type="primary"
          @click="loadMemberMoneyChange(true)"
        >
          {{ t('fields.search') }}
        </el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          type="warning"
          @click="resetQuery()"
        >
          {{ t('fields.reset') }}
        </el-button>
        <el-button
          size="mini"
          type="primary"
          v-permission="['sys:member:detail']"
          @click="requestExportExcel"
        >{{ t('fields.requestExportToExcel') }}
        </el-button>
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
        />
        <el-table-column
          prop="recordTime"
          :label="t('fields.recordTime')"
          align="center"
          min-width="180"
          sortable
        >
          <template #default="scope">
            <span v-if="scope.row.recordTime === null">-</span>
            <span
              v-if="scope.row.recordTime !== null"
              v-formatter="{
                data: scope.row.recordTime,
                timeZone: timeZone,
                type: 'date',
              }"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          :label="t('fields.type')"
          align="center"
          min-width="180"
        >
          <template #default="scope">
            <span>{{ t('moneyChange.type.' + scope.row.type) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="subType"
          :label="t('fields.privilege')"
          align="center"
          min-width="180"
        >
          <template #default="scope">
            <span v-if="scope.row.subType === null">-</span>
            <span v-else-if="scope.row.type === 'AFFILIATE_TRANSFER' && scope.row.subType === 'DEPOSIT'">{{ t('moneyChange.subType.AFFILIATE_DEPOSIT') }}</span>
            <span v-else-if="scope.row.type === 'AFFILIATE_TRANSFER' && scope.row.subType === 'COMMISSION'">{{ t('moneyChange.subType.AFFILIATE_COMMISSION') }}</span>
            <span
              v-else-if="scope.row.subType === 'DEPOSIT' || scope.row.subType === 'WITHDRAW' ||
                scope.row.subType === 'TRASNFER_IN' || scope.row.subType === 'TRANSFER_OUT' || scope.row.subType === 'AFFILIATE_SETTLEMENT'"
            >{{ t('moneyChange.subType.' + scope.row.subType) }}</span>
            <span v-else>{{ scope.row.subType }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="platformCode"
          :label="t('fields.platformName')"
          align="center"
          min-width="180"
        >
          <template #default="scope">
            <span v-if="scope.row.platformCode === null">-</span>
            <span v-if="scope.row.platformCode !== null">
              {{ scope.row.platformCode }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="currency"
          :label="t('fields.currency')"
          align="center"
          min-width="180"
        >
          <template #default="scope">
            <span v-if="scope.row.currency === null">-</span>
            <span v-else>
              {{ scope.row.currency }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="amount"
          :label="t('fields.amount')"
          align="center"
          min-width="180"
          sortable
        >
          <template #default="scope">
            <span v-if="scope.row.amount < 0" style="color: red">
              $
              <span v-formatter="{data: scope.row.amount, type: 'money'}" />
            </span>
            <span v-else-if="scope.row.type === 'WITHDRAW_FAIL'" style="color: red">
              $
              <span v-formatter="{data: scope.row.amount, type: 'money'}" />
            </span>
            <span v-else>
              $
              <span v-formatter="{data: scope.row.amount, type: 'money'}" />
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="beforeBalance"
          :label="t('fields.beforeBalance')"
          align="center"
          min-width="180"
        >
          <template #default="scope">
            <span v-if="scope.row.beforeBalance === null">-</span>
            <span v-if="scope.row.beforeBalance !== null">
              $<span v-formatter="{data: scope.row.beforeBalance, type: 'money'}" />
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="afterBalance"
          :label="t('fields.afterBalance')"
          align="center"
          min-width="180"
        >
          <template #default="scope">
            <span v-if="scope.row.afterBalance === null">-</span>
            <span v-if="scope.row.afterBalance !== null">
              $<span v-formatter="{data: scope.row.afterBalance, type: 'money'}" />
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="platformBalance"
          :label="t('fields.platformBalance')"
          align="center"
          min-width="180"
        >
          <template #default="scope">
            <span v-if="scope.row.platformBalance === null">-</span>
            <span v-if="scope.row.platformBalance !== null">
              $<span v-formatter="{data: scope.row.platformBalance, type: 'money'}" />
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :page-sizes="[20, 50, 100, 150]"
        layout="sizes,prev, next"
        style="margin-top: 10px"
        v-model:page-size="request.size"
        v-model:page-count="page.pages"
        v-model:current-page="request.current"
        @current-change="loadMemberMoneyChange"
        @size-change="loadMemberMoneyChange(true)"
      />
    </el-card>

    <el-dialog :title="t('fields.exportToExcel')" v-model="uiControl.messageVisible" append-to-body width="500px"
               :close-on-click-modal="false" :close-on-press-escape="false"
    >
      <span>{{ t('message.requestExportToExcelDone1') }}</span>
      <router-link :to="`/site-management/download-manager`">
        <el-link type="primary">
          {{ t('menu.DownloadManager') }}
        </el-link>
      </router-link>
      <span>{{ t('message.requestExportToExcelDone2') }}</span>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, defineProps, reactive } from 'vue'
import moment from 'moment'
import { getMemberMoneyChangeList, requestMemberMoneyChangeExport } from '../../../../../api/member'
import { useI18n } from 'vue-i18n'
import { getShortcuts } from "@/utils/datetime";
import { formatInputTimeZone } from "@/utils/format-timeZone"
import { ElMessage } from "element-plus";
import { useStore } from "@/store";
import { useRoute } from "vue-router";

const uiControl = reactive({
  messageVisible: false,
});

const props = defineProps({
  mbrId: {
    type: String,
    required: true,
  },
  timeZone: {
    type: String,
    required: true,
  }
})

const { t } = useI18n()
const shortcuts = getShortcuts(t);
const startDate = new Date()
const store = useStore()
startDate.setDate(startDate.getDate() - 2)
const defaultStartDate = convertDate(startDate)
const defaultEndDate = convertDate(new Date())

const request = reactive({
  size: 20,
  current: 1,
  recordTime: [defaultStartDate, defaultEndDate],
  orderBy: 'recordTime',
  sortType: 'DESC',
})

const route = useRoute()
const site = reactive({
  id: route.query.site
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
  request.recordTime = [defaultStartDate, defaultEndDate]
  page.pagingState = null
}

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
  pagingState: '',
})

const sort = column => {
  request.orderBy = column.prop
  if (column.order === 'descending') {
    request.sortType = 'DESC'
  } else {
    request.sortType = 'ASC'
  }
  loadMemberMoneyChange()
}

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

async function loadMemberMoneyChange(frombutton) {
  if (frombutton === true) {
    request.current = 1
    page.pagingState = null
  }

  page.loading = true
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  if (request.recordTime !== null) {
    if (request.recordTime.length === 2) {
      query.recordTime = JSON.parse(JSON.stringify(request.recordTime));
      query.recordTime[0] = formatInputTimeZone(query.recordTime[0], props.timeZone, 'start');
      query.recordTime[1] = formatInputTimeZone(query.recordTime[1], props.timeZone, 'end');
      query.recordTime = query.recordTime.join(',')
    }
  }
  query.siteId = site.id
  query.memberId = props.mbrId
  query.pagingState = page.pagingState
  const { data: ret } = await getMemberMoneyChangeList(props.mbrId, query)
  page.pages = ret.pages
  page.records = ret.records
  page.pagingState = ret.pagingState
  page.loading = false
}

async function requestExportExcel() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  if (request.recordTime !== null) {
    if (request.recordTime.length === 2) {
      query.recordTime = JSON.parse(JSON.stringify(request.recordTime));
      query.recordTime[0] = formatInputTimeZone(query.recordTime[0], props.timeZone, 'start');
      query.recordTime[1] = formatInputTimeZone(query.recordTime[1], props.timeZone, 'end');
      query.recordTime = query.recordTime.join(',')
    }
  }
  query.siteId = site.id;
  query.memberId = props.mbrId
  query.pagingState = page.pagingState
  query.requestBy = store.state.user.name;
  query.requestTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  const { data: ret } = await requestMemberMoneyChangeExport(query);
  if (ret) {
    uiControl.messageVisible = true;
  }
}

onMounted(() => {
  loadMemberMoneyChange()
})
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
