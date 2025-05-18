<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <span style="font-size: small;margin-top: 10px;margin-left:20px">
          {{ t('fields.feedbackTime') }}
        </span>

        <el-date-picker
          v-model="request.feedbackTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 300px;margin-left:20px"
          :shortcuts="shortcuts"
          :editable="false"
          :clearable="false"
        />

        <el-input
          v-model="request.name"
          size="small"
          style="width: 200px;margin-left:5px"
          :placeholder="t('fields.memberName')"
        />

        <el-input
          v-model="request.orderNo"
          size="small"
          style="width: 200px;margin-left:5px"
          :placeholder="t('fields.orderNo')"
        />

        <el-select
          v-model="request.type"
          size="small"
          :placeholder="t('fields.feedbackType')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in typeList.list"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="request.status"
          size="small"
          :placeholder="t('fields.feedbackStatus')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in statusList.list"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="header-container" style="margin-top: 10px;margin-left:20px">
        <span style="font-size: small">{{ t('fields.commitTime') }}</span>

        <el-date-picker
          v-model="request.commitTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 300px;margin-left:30px"
          :shortcuts="shortcuts"
          :editable="false"
          :clearable="false"
        />

        <!-- <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select> -->

        <el-input
          v-model="request.updateBy"
          size="small"
          style="width: 200px;margin-left:5px"
          :placeholder="t('fields.updateBy')"
        />

        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadFinanceFeedback()"
          :disabled="page.loading"
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
      </div>
    </div>

    <el-table
      height="700"
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      v-loading="page.loading"
      style="height:calc(100vh - 220px);"
      :empty-text="t('fields.noData')"
    >
      <el-table-column
        prop="name"
        :label="t('fields.member')"
        align="center"
        min-width="100"
      >
        <template
          #default="scope"
          v-if="hasPermission(['sys:member:detail'])"
        >
          <router-link
            v-if="scope.row.memberType === 'AFFILIATE'"
            :to="`/affiliate/details/${scope.row.memberId}?site=${request.siteId}`"
          >
            <el-link type="primary">{{ scope.row.name }}</el-link>
          </router-link>
          <router-link :to="`/member/details/${scope.row.memberId}?site=${request.siteId}`">
            <el-link type="primary">{{ scope.row.name }}</el-link>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column
        prop="orderNo"
        :label="t('fields.orderNo')"
        width="120"
      />

      <el-table-column prop="amount" :label="t('fields.amount')" width="120" />

      <el-table-column
        prop="status"
        :label="t('fields.financeStatus')"
        align="center"
        min-width="100"
      >
        <template #default="scope">
          <span
            style="font-size: small;margin-top: 10px;"
            v-if="scope.row.status === 1"
          >
            {{ t('fields.feedbackStatusPending') }}
          </span>

          <span
            style="font-size: small;margin-top: 10px;"
            v-if="scope.row.status === 2"
          >
            {{ t('fields.feedbackStatusSuccess') }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="type"
        :label="t('fields.financeType')"
        align="center"
        min-width="100"
      >
        <template #default="scope">
          <span
            style="font-size: small;margin-top: 10px;"
            v-if="scope.row.type === 1"
          >
            {{ t('fields.feedbackTypeDeposit') }}
          </span>

          <span
            style="font-size: small;margin-top: 10px;"
            v-if="scope.row.type === 2"
          >
            {{ t('fields.feedbackTypeWithdraw') }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="memberRemark"
        :label="t('fields.memberRemark')"
        width="120"
      />

      <el-table-column
        prop="financeRemark"
        :label="t('fields.financeRemark')"
        width="120"
      />

      <el-table-column
        prop="photos"
        :label="t('fields.financePhotos')"
        align="center"
        min-width="100"
      >
        <template #default="scope">
          <el-image
            v-if="scope?.row?.photos && (scope.row.photos.endsWith('.png') || scope.row.photos.endsWith('.jpeg') || scope.row.photos.endsWith('.jpg'))"
            hide-on-click-modal
            style="width: 30px; height: 30px; border: 1px solid grey"
            :src="fixOldImgUrl(scope.row.photos)"
            :preview-src-list="[fixOldImgUrl(scope.row.photos)]"
            fit="cover"
          />
        </template>
      </el-table-column>

      <el-table-column
        prop="commitTime"
        :label="t('fields.commitTime')"
        width="120"
      >
        <template #default="scope">
          <span v-if="scope.row.commitTime === null">-</span>
          <span
            v-if="scope.row.commitTime !== null"
            v-formatter="{data: scope.row.commitTime, timeZone: timeZone, type: 'date'}"
          />
        </template>
      </el-table-column>

      <el-table-column
        prop="feedbackTime"
        :label="t('fields.feedbackTime')"
        width="120"
      >
        <template #default="scope">
          <span v-if="scope.row.feedbackTime === null">-</span>
          <span
            v-if="scope.row.feedbackTime !== null"
            v-formatter="{data: scope.row.feedbackTime, timeZone: timeZone, type: 'date'}"
          />
        </template>
      </el-table-column>

      <el-table-column
        prop="updateTime"
        :label="t('fields.updateTime')"
        width="120"
      >
        <template #default="scope">
          <span v-if="scope.row.updateTime === null">-</span>
          <span
            v-if="scope.row.updateTime !== null"
            v-formatter="{data: scope.row.updateTime, timeZone: timeZone, type: 'date'}"
          />
        </template>
      </el-table-column>

      <el-table-column
        prop="updateBy"
        :label="t('fields.updateBy')"
        width="120"
      />

      <el-table-column
        prop="status"
        :label="t('fields.action')"
        width="120"
        fixed="right"
      >
        <template #default="scope1">
          <el-button
            v-if="scope1.row.status === 1 && hasPermission(['sys:deposit:feedback:update'])"
            size="mini"
            type="primary"
            @click="showDialog(scope1.row)"
          >
            {{ t('fields.review') }}
          </el-button>
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

    <el-dialog
      :title="t('fields.financeRemark')"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="dialog-footer">
        <el-form
          ref="reviewForm"
          :model="form"
          :inline="true"
          size="small"
          label-width="150px"
        >
          <el-form-item :label="t('fields.financeRemark')" prop="remark">
            <el-input
              v-model="form.remark"
              style="width: 350px;"
              :rows="7"
              type="textarea"
            />
          </el-form-item>

          <div class="dialog-footer">
            <el-button @click="uiControl.dialogVisible = false">
              {{ t('fields.cancel') }}
            </el-button>
            <el-button type="primary" @click="submit">
              {{ t('fields.confirm') }}
            </el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
// import moment from 'moment'
import {
  getFinanceFeedback,
  updateFinanceFeedback,
} from '../../../api/finance-feedback'
import { getSiteListSimple } from '../../../api/site'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { useI18n } from 'vue-i18n'
import { hasPermission } from '../../../utils/util'
import { getShortcuts } from "@/utils/datetime";
import { formatInputTimeZone } from "@/utils/format-timeZone"

const { t } = useI18n()
const startDate = new Date()
startDate.setDate(startDate.getDate())
// const defaultStartDate = convertDate(startDate)
// const defaultEndDate = convertDate(new Date())
const reviewForm = ref()
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)

const siteList = reactive({
  list: [],
})
let timeZone = null;
const typeList = reactive({
  list: [
    { label: t('fields.feedbackTypeAll'), value: '0' },
    { label: t('fields.feedbackTypeDeposit'), value: '1' },
    { label: t('fields.feedbackTypeWithdraw'), value: '2' },
  ],
})
const statusList = reactive({
  list: [
    { label: t('fields.feedbackStatusAll'), value: '0' },
    { label: t('fields.feedbackStatusPending'), value: '1' },
    { label: t('fields.feedbackStatusSuccess'), value: '2' },
  ],
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const form = reactive({
  id: null,
  remark: null,
})

const request = reactive({
  size: 30,
  current: 1,
  name: null,
  feedbackTime: [null, null],
  commitTime: [null, null],
  siteId: null,
  orderNo: null,
  status: null,
  type: null,
  updateBy: null,
})

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
})

const shortcuts = getShortcuts(t);

// function disabledDate(time) {
//   return (
//     time.getTime() <=
//       moment(new Date())
//         .subtract(4, 'weeks')
//         .format('x') || time.getTime() > new Date().getTime()
//   )
// }

// function convertDate(date) {
//   return moment(date).format('YYYY-MM-DD')
// }

async function submit() {
  if (form.remark === null || form.remark === '') {
    alert('请输入备注')
    return
  }
  await updateFinanceFeedback(form.id, form.remark)
  uiControl.dialogVisible = false
  if (reviewForm.value) {
    reviewForm.value.resetFields()
  }
  await loadFinanceFeedback()
}

function resetQuery() {
  request.name = null
  request.feedbackTime = [null, null]
  request.commitTime = [null, null]
  request.siteId = store.state.user.siteId
  request.orderNo = null
  request.type = typeList.list[0].value
  request.status = statusList.list[0].value
  request.updateBy = null
}

async function loadFinanceFeedback() {
  page.loading = true
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  timeZone = siteList.list.find(e => e.id === request.siteId).timeZone;

  if (request.feedbackTime !== null) {
    if (request.feedbackTime.length === 2) {
      query.feedbackTime = JSON.parse(JSON.stringify(request.feedbackTime));
      if (query.feedbackTime[0] !== null && query.feedbackTime[1] !== null) {
        query.feedbackTime[0] = formatInputTimeZone(query.feedbackTime[0], timeZone, 'start');
        query.feedbackTime[1] = formatInputTimeZone(query.feedbackTime[1], timeZone, 'end');
      }
      query.feedbackTime = query.feedbackTime.join(',')
    }
  }

  if (request.commitTime !== null) {
    if (request.commitTime.length === 2) {
      query.commitTime = JSON.parse(JSON.stringify(request.commitTime));
      if (query.commitTime[0] !== null && query.commitTime[1] !== null) {
        query.commitTime[0] = formatInputTimeZone(query.commitTime[0], timeZone, 'start');
        query.commitTime[1] = formatInputTimeZone(query.commitTime[1], timeZone, 'end');
      }
      query.commitTime = query.commitTime.join(',')
    }
  }

  const { data: ret } = await getFinanceFeedback(query)

  page.pages = ret.pages
  page.records = ret.records

  page.loading = false
}

function changePage(page) {
  request.current = page
  loadFinanceFeedback()
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

onMounted(async () => {
  await loadSites()

  request.siteId = store.state.user.siteId
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  }

  request.status = statusList.list[0].value
  request.type = typeList.list[0].value

  await loadFinanceFeedback()
})

async function showDialog(record) {
  if (reviewForm.value) {
    reviewForm.value.resetFields()
  }
  form.id = record.id
  uiControl.dialogVisible = true
}

function fixOldImgUrl(url) {
  const _url = url.replace(/(\.com)(order)/, "$1/$2");
  return _url.replace(/https:\/\/(.*?)\/\//g, 'https://$1/');
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin-bottom: 10px;
}

.search {
  display: flex;
  justify-content: flex-start;
}

.btn-group {
  margin-top: 15px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.el-table--enabled-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}

.el-input-number:deep(.el-input__inner) {
  text-align: left;
}
</style>
