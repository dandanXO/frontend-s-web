<template>
  <div class="roles-main">
    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">系统公告</span>
        </div>
      </template>

      <div class="inputs-wrap" style="width: 100%;">
        <el-row :gutter="20">
          <el-col
            v-for="item in type.activeAffAnnouncementType"
            :key="item.id"
            :span="8"
          >
            <el-button @click="changeType(item.id)">
              {{ item.name }}
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div class="inputs-wrap">
        <el-input
          v-model="request.title"
          class="input-small"
          :placeholder="t('fields.title')"
          size="normal"
        />
        <div class="btn-grp">
          <el-button
            icon="el-icon-search"
            type="primary"
            @click="loadAffiliateAnnouncement()"
            size="normal"
          >
            {{ $t('fields.search') }}
          </el-button>
          <el-button size="normal" type="primary" plain @click="resetQuery()">
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
        </div>
      </div>

      <el-dialog
        v-model="uiControl.dialogVisible"
        :title="uiControl.dialogTitle"
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
            {{ uiControl.dialogContent }}
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

        <el-table-column :label="t('fields.status')" align="right" width="200">
          <template #default="scope">
            <span v-if="scope.row.isRead">{{ t('fields.readed') }}</span>
            <span v-else>{{ t('fields.unread') }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="createTime"
          :label="t('fields.createTime')"
          align="center"
        />

        <el-table-column :label="t('fields.operate')" align="left">
          <template #default="scope">
            <el-button
              icon="el-icon-view"
              size="normal"
              type="success"
              @click="readAnnouncement(scope.row)"
            />
            <el-button
              icon="el-icon-delete"
              size="normal"
              type="delete"
              @click="removeAnnouncement(scope.row)"
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
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
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
const request = reactive({
  siteId: null,
  type: null,
  size: 20,
  current: 1,
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const type = reactive({
  activeAffAnnouncementType: [],
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

/**
 * 读公告
 */
async function readAnnouncement(announcement) {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
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
    loadAffiliateAnnouncement()
  }
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
    await loadAffiliateAnnouncement()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

function resetQuery() {
  request.title = null
  loadAffiliateAnnouncement()
}

async function loadAffiliateAnnouncementType() {
  const { data: ret } = await getActiveAffAnnouncementType()
  type.activeAffAnnouncementType = ret
  request.type = ret[0].id
  loadAffiliateAnnouncement()
}

async function loadAffiliateAnnouncement() {
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

  const { data: ret } = await getAffAnnouncement(userId, query)

  page.pages = ret.pages
  page.records = ret.records

  page.loading = false
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page
    loadAffiliateAnnouncement()
  }
}

function changeType(typeId) {
  request.type = typeId
  loadAffiliateAnnouncement()
}

onMounted(() => {
  loadAffiliateAnnouncementType()
})
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
  //     &.el-range-editor--small.el-input__inner {
  //       max-width: unset;
  //     }
  //   }
  // }
}
</style>
