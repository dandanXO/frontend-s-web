<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input
          v-model="request.name"
          size="small"
          style="width: 200px"
          :placeholder="t('fields.name')"
        />
        <el-select
          clearable
          v-model="request.platform"
          size="small"
          :placeholder="t('fields.platform')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in platform.list"
            :key="item.key"
            :label="item.platform"
            :value="item.platform"
          />
        </el-select>
        <el-select
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
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadMemberPlatform"
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
      <div class="btn-group">
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:promp:page:del']"
          @click="removeMemberPlatform()"
          :disabled="uiControl.removeBtn"
        >
          {{ t('fields.delete') }}
        </el-button>
      </div>
    </div>
    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      @selection-change="handleSelectionChange"
      :empty-text="t('fields.noData')"
    >
      <el-table-column type="selection" />
      <el-table-column prop="loginName" :label="t('fields.loginName')" />
      <el-table-column prop="platform" :label="t('fields.platform')" />
      <el-table-column prop="status" :label="t('fields.status')">
        <template #default="scope">
          <el-tag
            v-if="scope.row.status === '1'"
            type="success"
            effect="dark"
            style="margin-left: 10px"
          >
            {{ t('fields.registered') }}
          </el-tag>
          <el-tag
            v-else
            type="danger"
            effect="dark"
            style="margin-left: 10px"
          >
            {{ t('fields.notRegister') }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column type="title" :label="t('fields.action')">
        <template #default="scope">
          <el-button
            icon="el-icon-refresh"
            size="mini"
            type="success"
            @click="manual(scope.row)"
          />
          <el-button
            icon="el-icon-remove"
            size="mini"
            type="danger"
            @click="removeMemberPlatform(scope.row)"
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, onMounted, reactive, ref } from 'vue'
import {
  getMemberPlatformList,
  getPlatformList,
  manualRegister,
  deleteMemberPlatform,
} from '../../../api/member-platform'
import { getSiteListSimple } from '../../../api/site'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
let chooseMemberPlatform = []
const siteList = reactive({
  list: [],
})

const platform = reactive({
  list: [],
})

const uiControl = reactive({
  removeBtn: true,
})
const request = reactive({
  size: 30,
  current: 1,
  name: null,
  platform: null,
  siteId: null,
})

const page = reactive({
  pages: 0,
  records: [],
})

function resetQuery() {
  request.name = null
  request.platform = null
  request.siteId = site.value ? site.value.id : siteList.list[0].id
}

function changePage(page) {
  request.current = page
  loadMemberPlatform()
}

async function loadMemberPlatform() {
  const { data: ret } = await getMemberPlatformList(request)
  page.pages = ret.pages
  page.records = ret.records
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

async function loadPlatform() {
  const { data: p } = await getPlatformList(request)
  platform.list = p
}

async function manual(row) {
  const { data: p } = await manualRegister(row)
  if (p === '注册成功') {
    ElMessage({ message: p, type: "success" });
  } else {
    ElMessage({ message: p, type: "error" });
  }
}

async function removeMemberPlatform(memberPlatform) {
  ElMessageBox.confirm(t('message.confirmDelete'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    if (memberPlatform) {
      await deleteMemberPlatform([memberPlatform.id])
    } else {
      await deleteMemberPlatform(chooseMemberPlatform.map(u => u.id))
    }
    await loadPlatform()
    await loadMemberPlatform()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

function handleSelectionChange(val) {
  chooseMemberPlatform = val
  if (chooseMemberPlatform.length === 0) {
    uiControl.removeBtn = true;
  } else {
    uiControl.removeBtn = false;
  }
}

onMounted(async () => {
  await loadSites()
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  } else {
    request.siteId = siteList.list[0].id
  }

  await loadPlatform()
  await loadMemberPlatform()
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
</style>
