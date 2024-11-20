<template>
  <div class="roles-main">
    <el-card class="box-card" shadow="never">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ $t('fields.systemAnnouncement') }}</span>
        </div>
      </template>
      <el-tabs
        v-model="activeName"
        style="margin: 0 20px;"
        @tab-click="handleTabClick"
      >
        <el-tab-pane
          :label="item.name"
          :name="item.id"
          :key="item.id"
          v-for="item in type.getTypeList"
        >
          <el-row :gutter="20" style="gap:10px;">
            <el-col :xl="4" :lg="6" :md="6" :sm="5">
              <el-input
                v-model="request.title"
                class="input-small"
                :placeholder="t('fields.title')"
                size="normal"
              />
            </el-col>
            <el-col :xl="16" :lg="12" :md="18" :sm="18">
              <el-button
                icon="el-icon-search"
                type="primary"
                @click="loadAffiliateAnnouncement(type.getCurrentTab)"
                size="normal"
              >
                {{ $t('fields.search') }}
              </el-button>
              <el-button
                size="normal"
                type="primary"
                plain
                @click="resetQuery()"
              >
                {{ $t('fields.reset') }}
              </el-button>
              <el-button
                icon="el-icon-edit"
                size="normal"
                type="success"
                :disabled="uiControl.editBtn"
                @click="readAnnouncement()"
              >
                {{ t('fields.bulk_read') }}
              </el-button>
              <el-button
                icon="el-icon-remove"
                size="normal"
                type="danger"
                v-permission="['sys:annou:del']"
                :disabled="uiControl.removeBtn"
                @click="removeAnnouncement()"
              >
                {{ t('fields.bulk_delete') }}
              </el-button>
            </el-col>
          </el-row>

          <el-dialog
            v-model="uiControl.dialogVisible"
            :title="uiControl.dialogTitle"
            @close="handleClose"
            append-to-body
            width="580px"
          >
            <el-form
              ref="announcementForm"
              :model="form"
              :rules="formRules"
              :inline="true"
              size="normal"
              label-width="150px"
            >
              <el-form-item>
                <div v-html="formattedText(uiControl.dialogContent)"></div>
              </el-form-item>
            </el-form>
          </el-dialog>

          <el-table
            :data="page.records"
            ref="table"
            row-key="id"
            size="normal"
            highlight-current-row
            v-loading="page.loading"
            style="margin-top: 15px; margin-left: 15px;"
            @selection-change="handleSelectionChange"
            @row-click="handleRowClick"
          >
            <template #empty>
              <emptyComp />
            </template>
            <el-table-column type="selection" width="55" />
            <el-table-column
              prop="title"
              :label="t('fields.title')"
              align="center"
              width="200"
            />

            <el-table-column
              :label="t('fields.status')"
              align="right"
              width="200"
            >
              <template #default="scope">
                <span v-if="scope.row.isRead">{{ t('fields.readed') }}</span>
                <span v-else>{{ t('fields.unread') }}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="createTime"
              :label="t('fields.createTime')"
              align="center"
            >
              <template #default="scope">
                <span
                  v-formatter="{ data: scope.row.createTime, type: 'date' }"
                />
              </template>
            </el-table-column>

            <el-table-column :label="t('fields.operate')" align="left">
              <template #default="scope">
                <el-button
                  icon="el-icon-delete"
                  size="normal"
                  type="delete"
                  @click.stop="removeAnnouncement(scope.row)"
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
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useStore } from '@/store'
import { useI18n } from 'vue-i18n'
import { getActiveAffAnnouncementType } from '../../../api/affiliate-announcement-type'
import {
  getAffAnnouncement,
  readAffAnnouncementDetails,
  deleteAffAnnouncement,
} from '../../../api/affiliate-announcement'
import { ElMessage, ElMessageBox } from 'element-plus'
import emptyComp from '@/components/empty'

const store = useStore()
const { t } = useI18n()
const activeName = ref('announcement-type')

const request = reactive({
  siteId: null,
  type: null,
  size: 20,
  current: 1,
  status: true,
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const type = reactive({
  getTypeList: [],
  getActiveTab: '',
  getCurrentTab: '',
})

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogContent: '',
  editBtn: true,
  removeBtn: true,
})

let chooseAnnouncement = []
function handleSelectionChange(val) {
  chooseAnnouncement = val
  if (chooseAnnouncement.length === 0) {
    uiControl.editBtn = true
    uiControl.removeBtn = true
  } else if (chooseAnnouncement.length === 1) {
    uiControl.editBtn = false
    uiControl.removeBtn = false
  } else {
    uiControl.editBtn = false
    uiControl.removeBtn = false
  }
}

const formattedText = text => {
  return text.replace(/\n/g, '<br/>')
}

function handleClose() {
  uiControl.dialogVisible = false
}

function handleRowClick(row) {
  readAnnouncement(row)
}
/**
 * 读公告
 */
async function readAnnouncement(announcement) {
  const userId = store.state.user.id
  if (announcement) {
    const { data: ret } = await readAffAnnouncementDetails(
      userId,
      announcement.id
    )

    uiControl.dialogTitle = ret.title
    uiControl.dialogContent = ret.content
    uiControl.dialogType = type
    uiControl.dialogVisible = true
  } else {
    await chooseAnnouncement.map(a => {
      readAffAnnouncementDetails(userId, a.id)
    })
    ElMessage({ message: t('fields.bulk_read'), type: 'success' })
  }
  await loadAffiliateAnnouncement(type.getCurrentTab)
}

async function removeAnnouncement(announcement) {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  const userId = store.state.user.id

  ElMessageBox.confirm(t('message.confirmDelete'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    if (announcement) {
      await deleteAffAnnouncement(userId, announcement.id)
    } else {
      await chooseAnnouncement.map(a => {
        deleteAffAnnouncement(userId, a.id)
      })
    }
    await loadAffiliateAnnouncement(type.getCurrentTab)
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

function resetQuery() {
  request.title = null
  loadAffiliateAnnouncement(type.getCurrentTab)
}

async function loadAffiliateAnnouncementType() {
  const siteId = store.state.user.siteId

  const { data: ret } = await getActiveAffAnnouncementType(siteId)
  if (ret && ret.length > 0) {
    type.getTypeList = ret
    type.getActiveTab = ret[0].id
    type.getCurrentTab = ret[0].id

    activeName.value = ret[0].id
    loadAffiliateAnnouncement(type.getCurrentTab)
  }
}

async function handleTabClick(tab) {
  type.getCurrentTab = tab.props.name
  loadAffiliateAnnouncement(tab.props.name)
}

async function loadAffiliateAnnouncement(tabId) {
  page.loading = true
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })

  const userId = store.state.user.id
  const siteId = store.state.user.siteId
  query.siteId = siteId
  query.type = tabId

  const { data: ret } = await getAffAnnouncement(userId, query)
  page.pages = ret.pages
  page.records = ret.records

  page.loading = false
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page
    loadAffiliateAnnouncement(type.getCurrentTab)
  }
}

onMounted(() => {
  loadAffiliateAnnouncementType()
})
</script>

<style lang="scss" scoped>
.header-container {
  margin: 40px 0 20px;
  display: flex;
}

.box-card {
  ::v-deep(.el-card__body) {
    padding: 0;
  }
}
.el-button {
  margin-bottom: 10px;
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
</style>

<style lang="scss">
@media (max-width: 768px) {
  .el-dialog {
    width: 100%;
  }
}
</style>
