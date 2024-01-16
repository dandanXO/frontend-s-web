<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
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
          v-permission="['sys:member:platform:del']"
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
          <el-tag v-else type="danger" effect="dark" style="margin-left: 10px">
            {{ t('fields.notRegister') }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column type="title" :label="t('fields.memberPlatformAction')">
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
            v-permission="['sys:member:platform:del']"
            @click="removeMemberPlatform(scope.row)"
          />
        </template>
      </el-table-column>

      <el-table-column type="title" :label="t('fields.memberPlatformUpdate')">
        <template #default="scope">
          <el-button
            v-if="scope.row.platform === 'PT'"
            icon="el-icon-refresh"
            size="mini"
            type="success"
            @click="update(scope.row)"
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
import { defineProps, onMounted, reactive } from 'vue'
import {
  getMemberPlatformList,
  getPlatformList,
  manualRegister,
  deleteMemberPlatform,
  updatePassword,
} from '../../../../../api/member-platform'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

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

const route = useRoute()
const site = reactive({
  id: route.query.site
});

const { t } = useI18n()
let chooseMemberPlatform = []

const platform = reactive({
  list: [],
})

const uiControl = reactive({
  removeBtn: true,
})
const request = reactive({
  size: 30,
  current: 1,
  id: null,
  platform: null,
  siteId: null,
})

const page = reactive({
  pages: 0,
  records: [],
})

function resetQuery() {
  request.platform = null
}

function changePage(page) {
  request.current = page
  loadMemberPlatform()
}

async function loadMemberPlatform() {
  request.id = props.mbrId
  request.siteId = site.id
  console.log(request.site)
  console.log(request.id)
  const { data: ret } = await getMemberPlatformList(request)
  page.pages = ret.pages
  page.records = ret.records
}

async function loadPlatform() {
  request.siteId = site.id
  const { data: p } = await getPlatformList(request)
  platform.list = p
}

async function manual(row) {
  const { data: p } = await manualRegister(row)
  if (p === '注册成功') {
    loadMemberPlatform()
    ElMessage({ message: p, type: 'success' })
  } else {
    ElMessage({ message: p, type: 'error' })
  }
}

async function update(row) {
  const { data: p } = await updatePassword(row)
  if (p === '同步成功') {
    ElMessage({ message: p, type: 'success' })
  } else {
    ElMessage({ message: p, type: 'error' })
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
    uiControl.removeBtn = true
  } else {
    uiControl.removeBtn = false
  }
}

onMounted(async () => {
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
