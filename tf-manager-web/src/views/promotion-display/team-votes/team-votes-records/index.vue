<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input
          v-model="request.loginName"
          size="small"
          style="width: 200px"
          :placeholder="t('fields.loginName')"
        />
        <el-select
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
        </el-select>
        <el-select
          clearable
          v-model="request.type"
          size="small"
          :placeholder="t('fields.type')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.type"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-permission="['sys:team-votes:list']"
          v-model="request.teamVotesId"
          size="small"
          :placeholder="t('fields.teamName')"
          class="filter-item"
          style="width: 120px;margin-left: 5px"
          @focus="loadTeams"
        >
          <el-option
            v-for="item in teamList.list"
            :key="item.id"
            :label="item.teamNameEn"
            :value="item.id"
          />
        </el-select>
        <el-date-picker
          v-model="request.voteTime"
          format="DD/MM/YYYY HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          size="small"
          type="datetimerange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 300px; margin-left: 5px;"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
          :default-time="defaultTime"
        />
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadTeamVotesRecord"
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
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      :empty-text="t('fields.noData')"
    >
      <el-table-column prop="loginName" :label="t('fields.loginName')" />
      <el-table-column prop="teamNameEn" :label="t('fields.teamName')" />
      <el-table-column prop="type" :label="t('fields.type')" />
      <el-table-column prop="status" :label="t('fields.status')" />
      <el-table-column prop="voteTime" :label="t('fields.voteTime')" />
      <el-table-column
        type="title"
        :label="t('fields.action')"
        v-if="hasPermission(['sys:team-votes-records:cancel'])"
      >
        <template #default="scope">
          <!-- <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            v-permission="['sys:team-votes-records:update']"
            @click="editPromo(scope.row)"
          /> -->
          <el-button
            v-if="scope.row.status === 'NORMAL'"
            icon="el-icon-remove"
            size="mini"
            type="danger"
            v-permission="['sys:team-votes-records:cancel']"
            @click="removeVoteRecord(scope.row)"
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
import {
  getTeamVotesRecord,
  cancelTeamVotesRecord,
  getTeamListSimple,
} from '../../../../api/team-votes'
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, reactive } from 'vue'
import moment from 'moment'
import { useRoute } from 'vue-router'
import { hasPermission } from '../../../../utils/util'
// import { useStore } from '../../../../store';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59),
];
const shortcuts = [
  {
    text: t('fields.today'),
    value: () => {
      const end = new Date()
      const start = new Date()
      return [start, end]
    },
  },
  {
    text: t('fields.yesterday'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .subtract(1, 'days')
          .format('x')
      )
      end.setTime(
        moment(end)
          .subtract(1, 'days')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.thisWeek'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .startOf('isoWeek')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.lastWeek'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .subtract(1, 'weeks')
          .startOf('isoWeek')
          .format('x')
      )
      end.setTime(
        moment(end)
          .subtract(1, 'weeks')
          .endOf('isoWeek')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.thisMonth'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .startOf('month')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.lastMonth'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .subtract(1, 'months')
          .startOf('month')
          .format('x')
      )
      end.setTime(
        moment(end)
          .subtract(1, 'months')
          .endOf('month')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.last3Months'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .subtract(2, 'months')
          .startOf('month')
          .format('x')
      )
      return [start, end]
    },
  },
]
const startDate = new Date()
startDate.setDate(startDate.getDate() - 2)
const defaultStartDate = convertDate(startDate)
const defaultEndDate = convertDate(new Date())

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD HH:mm:ss')
}

function disabledDate(time) {
  return (
    time.getTime() <=
      moment(new Date())
        .subtract(1, 'weeks')
        .format('x') || time.getTime() > new Date().getTime()
  )
}

function resetQuery() {
  request.voteTime = [defaultStartDate, defaultEndDate]
  request.status = null
  request.type = null
  request.teamVotesId = null
  request.loginName = null
  request.loginName = null
}
const request = reactive({
  size: 20,
  current: 1,
  voteTime: [defaultStartDate, defaultEndDate],
  loginName: null,
  status: null,
  type: null,
  teamVotesId: null,
})

const page = reactive({
  pages: 0,
  records: [],
})

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  editBtn: true,
  removeBtn: true,
  status: [
    { key: 1, displayName: 'NORMAL', value: 'NORMAL' },
    { key: 2, displayName: 'CANCEL', value: 'CANCEL' },
  ],
  type: [
    { key: 1, displayName: 'REAL', value: 'REAL' },
    { key: 2, displayName: 'VIRTUAL', value: 'VIRTUAL' },
  ],
})
function changePage(page) {
  request.current = page
  loadTeamVotesRecord()
}

const route = useRoute()
// const router = useRouter()

async function removeVoteRecord(voteRecord) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: 'warning',
    }
  ).then(async () => {
    if (voteRecord) {
      await cancelTeamVotesRecord(voteRecord.id)
    } else {
      await cancelTeamVotesRecord(voteRecord.map(u => u.id))
    }
    await loadTeamVotesRecord()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}
const teamList = reactive({
  list: [],
})
async function loadTeams() {
  const { data: team } = await getTeamListSimple()
  teamList.list = team
}
async function loadTeamVotesRecord() {
  page.loading = true
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  if (request.voteTime !== null) {
    if (request.voteTime.length === 2) {
      query.voteTime = request.voteTime.join(',')
    }
  }
  const { data: ret } = await getTeamVotesRecord(query)
  page.pages = ret.pages
  page.records = ret.records
}
onMounted(async () => {
  if (route.query.current != null) {
    request.current = Number(route.query.current)
  }
  await loadTeams()
  await loadTeamVotesRecord()
})
</script>
<!--script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, onMounted, reactive, ref } from 'vue'
import {
  getPromoPagesList,
  updatePromoPagesState,
  deletePromoPages,
} from '../../../../api/promoPages'
import { useRoute, useRouter } from 'vue-router'
import { getSiteListSimple } from '../../../../api/site'
import { hasPermission } from '../../../../utils/util'
import { useStore } from '../../../../store';
import { TENANT } from "../../../../store/modules/user/action-types";

const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
let choosePromo = []
const siteList = reactive({
  list: [],
})

const uiControl = reactive({
  removeBtn: true,
  promoState: [
    { key: 1, displayName: 'active', value: true },
    { key: 2, displayName: 'disable', value: false },
  ],
})
const request = reactive({
  size: 30,
  current: 1,
  title: null,
  status: null,
  siteId: null
})

const page = reactive({
  pages: 0,
  records: [],
})

function resetQuery() {
  request.title = null
  request.status = null
  request.siteId = site.value ? site.value.id : null;
}

function changePage(page) {
  request.current = page
  loadPromoPages()
}

const router = useRouter()
function showDialog(type) {
  if (type === 'CREATE') {
    router.push({
      name: 'Add Promo',
    })
  }
}

function handleSelectionChange(val) {
  choosePromo = val
  if (choosePromo.length === 0) {
    uiControl.removeBtn = true
  } else if (choosePromo.length === 1) {
    uiControl.removeBtn = false
  } else {
    uiControl.removeBtn = false
  }
}

function editPromo(promoPages) {
  if (!promoPages) {
    promoPages = choosePromo[0]
  }
  router.push({
    name: 'Edit Promo',
    params: { id: promoPages.id },
  })
}

async function loadPromoPages() {
  const { data: ret } = await getPromoPagesList(request)
  page.pages = ret.pages
  page.records = ret.records
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

async function removeVoteRecord(promoPages) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: 'warning',
    }
  ).then(async () => {
    if (promoPages) {
      await deletePromoPages([promoPages.id])
    } else {
      await deletePromoPages(choosePromo.map(u => u.id))
    }
    await loadPromoPages()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

async function changePromoPagesState(id, status) {
  await updatePromoPagesState(id, status)
}

const route = useRoute()

onMounted(async () => {
  if (route.query.current != null) {
    request.current = Number(route.query.current)
  }
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.teamName === store.state.user.teamName);
    request.siteId = site.value.id;
  }
  await loadPromoPages();
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

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}
</style-->

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

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}
</style>
