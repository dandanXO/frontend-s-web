<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input
          v-model="participantRequest.name"
          size="small"
          style="width: 200px"
          :placeholder="t('fields.name')"
        />
        <!-- <el-select
          clearable
          v-model="request.status"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.status"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select> -->
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
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadParticipant"
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
        <el-button size="mini" type="success" @click="calculateResult(id)">
          {{ $t('fields.processResult') }}
        </el-button>
        <el-button
          icon="el-icon-view"
          size="mini"
          type="success"
          @click="showDialog(id)"
        >
          {{ $t('fields.winner') }}
        </el-button>
      </div>
    </div>
    <el-dialog
      :title="$t('fields.winner')"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="700px"
    >
      <el-table :data="winnerList.records" max-height="550">
        <el-table-column prop="memberName" :label="t('fields.username')" />
        <el-table-column prop="prize" :label="t('fields.rank')" />
        <el-table-column prop="amount" :label="t('fields.amount')" />
      </el-table>
    </el-dialog>
    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      v-loading="page.loading"
      :empty-text="t('fields.noData')"
    >
      <el-table-column prop="memberName" :label="t('fields.name')" />
      <el-table-column
        prop="realName"
        :label="t('fields.realName')"
        width="150"
      >
        <template #default="scope">
          <span v-if="scope.row.realName === null">-</span>
          <span v-if="scope.row.realName !== null">
            {{ scope.row.realName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="balance" :label="t('fields.balance')" width="200">
        <template #default="scope">
          $
          <span v-formatter="{data: scope.row.balance, type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="status" :label="t('fields.status')" width="150">
        <template #default="scope">
          <el-tag
            v-if="scope.row.status === 'NORMAL'"
            type="success"
            size="mini"
          >
            {{ scope.row.status }}
          </el-tag>
          <el-tag
            v-if="scope.row.status === 'FROZEN'"
            type="danger"
            size="mini"
          >
            {{ scope.row.status }}
          </el-tag>
          <el-tag v-if="scope.row.status === null" type="info" size="mini">
            -
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="memberType"
        :label="t('fields.memberType')"
        width="150"
      >
        <template #default="scope">
          <el-tag
            v-if="scope.row.memberType === 'NORMAL'"
            type="success"
            size="mini"
          >
            {{ scope.row.memberType }}
          </el-tag>
          <el-tag
            v-if="scope.row.memberType === 'TEST'"
            type="primary"
            size="mini"
          >
            {{ scope.row.memberType }}
          </el-tag>
          <el-tag
            v-if="scope.row.memberType === 'OUTSIDE'"
            type="warning"
            size="mini"
          >
            {{ scope.row.memberType }}
          </el-tag>
          <el-tag v-if="scope.row.memberType === null" type="info" size="mini">
            -
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="vipName" :label="t('menu.VIP')" width="200" />
      <el-table-column prop="createTime" :label="t('fields.createTime')" width="200">
        <template #default="scope">
          <span v-if="scope.row.createTime === null">-</span>
          <span
            v-if="scope.row.createTime !== null"
            v-formatter="{data: scope.row.createTime, timeZone: timeZone, type: 'date'}"
          />
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
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
// import moment from 'moment'
// import { required } from '../../../utils/validate'
// import { ElMessage } from 'element-plus'
import { getPrivilegeInfo } from '../../../api/privilege-info'
// import { getSiteListSimple } from '../../../api/site'
// import { hasPermission } from '../../../utils/util'
import { useStore } from '../../../store'
// import { TENANT } from '../../../store/modules/user/action-types'
import { useI18n } from 'vue-i18n'
import {
  getWinnerList,
  calculateWinner,
  getParticipants,
} from '../../../api/privi-christmas'
import { ElMessage } from "element-plus";

const { t } = useI18n()
const store = useStore()
// const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
// const site = ref(null)
// const siteList = reactive({
//   list: [],
// })
const id = ref(1)

const uiControl = reactive({
  dialogVisible: false,
})

let timeZone = null

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const winnerList = reactive({
  records: [],
})

const request = reactive({
  size: 30,
  current: 1,
  name: null,
  code: 'jolly_event',
  // status: null,
  // siteId: null,
})

const participantRequest = reactive({
  size: 30,
  current: 1,
  id: id,
  name: '',
})

function resetQuery() {
  participantRequest.name = null
  // request.status = null
  // request.siteId = site.value ? site.value.id : null
}

async function loadPrivilegeInfo() {
  const { data: ret } = await getPrivilegeInfo(request)
  id.value = ret.records[0].id
}

async function loadParticipant() {
  page.loading = true
  const { data: ret } = await getParticipants(participantRequest)
  page.pages = ret.pages
  ret.records.forEach(data => {
    data.timeZone =
      store.state.user.sites.find(e => e.id === data.siteId) !== undefined
        ? store.state.user.sites.find(e => e.id === data.siteId).timeZone
        : null
  })
  page.records = ret.records
  page.loading = false
}

// async function loadSites() {
//   const { data: site } = await getSiteListSimple()
//   siteList.list = site
// }

async function calculateResult(id) {
  await calculateWinner(id);
  ElMessage({ message: t('message.resultCalculateSuccess'), type: "success" });
}

function changePage(page) {
  request.current = page
  loadPrivilegeInfo()
}

async function showDialog(id) {
  const { data: ret } = await getWinnerList(id)
  winnerList.records = ret
  uiControl.dialogVisible = true
}

onMounted(async () => {
  // await loadSites()
  // if (LOGIN_USER_TYPE.value === TENANT.value) {
  //   site.value = siteList.list.find(
  //     s => s.siteName === store.state.user.siteName
  //   )
  //   request.siteId = site.value.id
  // }
  await loadPrivilegeInfo()
  await loadParticipant()
  timeZone = store.state.user.sites[0].timeZone
})
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

.el-input-number:deep .el-input__inner {
  text-align: left;
}
</style>
