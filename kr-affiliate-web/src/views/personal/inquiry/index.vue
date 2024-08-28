<template>
  <div class="roles-main">
    <el-card class="box-card" shadow="never">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ $t('fields.inquiry') }}</span>
        </div>
      </template>

      <div class="inputs-wrap">
        <el-date-picker
          v-model="request.createTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="normal"
          class="input-normal"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
        />
        <el-input
          v-model="request.memberName"
          size="normal"
          style="width: 200px;"
          :placeholder="t('fields.memberUsername')"
        />
        <div class="btn-grp">
          <el-button
            icon="el-icon-search"
            type="primary"
            @click="loadMessageOutboxList()"
          >
            {{ $t('fields.search') }}
          </el-button>
          <el-button type="primary" plain @click="resetQuery()">
            {{ $t('fields.reset') }}
          </el-button>
        </div>
      </div>

      <el-table
        :data="page.records"
        ref="table"
        row-key="id"
        size="normal"
        highlight-current-row
        v-loading="page.loading"
        style="margin-top: 15px; margin-left: 15px;"
      >
        <el-table-column
          prop="memberName"
          :label="t('fields.memberUsername')"
          align="center"
          min-width="200"
        />
        <el-table-column
          prop="title"
          :label="t('fields.messageTitle')"
          align="center"
          min-width="200"
        />

        <el-table-column
          prop="content"
          :label="t('fields.messageContent')"
          align="center"
          min-width="200"
        />

        <el-table-column
          prop="status"
          :label="t('fields.status')"
          align="center"
          min-width="200"
        >
          <template #default="scope">
            <span v-if="scope.row.status === 1">
              {{ t('fields.hasBeenReplied') }}
            </span>
            <span v-else>{{ t('fields.notYetReply') }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="createTime"
          :label="t('fields.createTime')"
          align="center"
          min-width="200"
        >
          <template #default="scope">
            <span v-formatter="{ data: scope.row.createTime, type: 'date'}" />
          </template>
        </el-table-column>

        <el-table-column :label="t('fields.operate')" align="left">
          <template #default="scope">
            <el-button
              v-if="scope.row.status === 1"
              icon="el-icon-view"
              size="normal"
              @click="reply(scope.row)"
            />

            <el-button
              v-else
              icon="el-icon-edit"
              size="normal"
              @click="reply(scope.row)"
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
  <el-dialog
    :title="uiControl.dialogTitle"
    v-model="uiControl.dialogVisible"
    width="580px"
    append-to-body
  >
    <el-form :v-model="replyForm">
      <div style="padding-bottom: 20px;">
        <span :aria-label="t('fields.to')" style="width: 200px;">
          To : {{ replyForm.recipient.join(', ') }}
        </span>
      </div>

      <el-form-item v-if="replyForm.edit === true">
        <el-input
          v-model="replyForm.content"
          type="textarea"
          :rows="5"
          :placeholder="t('fields.message')"
        />
      </el-form-item>
      <span :aria-label="t('fields.to')" style="width: 200px;" v-else>
        {{ replyForm.content }}
      </span>
    </el-form>
    <div class="dialog-footer" v-if="replyForm.edit === true">
      <el-button @click="uiControl.dialogVisible = false">
        {{ $t('fields.cancel') }}
      </el-button>
      <el-button type="primary" @click="submitReply()">
        {{ $t('fields.confirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { useStore } from '@/store'
import { useI18n } from 'vue-i18n'
import { getMessageOutboxList, replyMessage } from '../../../api/message-outbox'
import { ElMessage } from 'element-plus'

const store = useStore()
const { t } = useI18n()

const request = reactive({
  siteId: null,
  memberName: null,
  createTime: null,
  size: 20,
  current: 1,
})

const replyForm = reactive({
  receiveType: 'INDIVIDUAL',
  affiliateId: null,
  recipient: [],
  id: null,
  siteId: null,
  content: null,
  title: null,
  edit: true,
})

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

async function loadMessageOutboxList() {
  page.loading = true
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })

  if (request.createTime !== null) {
    if (request.createTime.length === 2) {
      query.createTime = request.createTime.join(',')
    }
  } else {
    query.createTime = null
  }

  query.siteId = store.state.user.siteId
  query.affiliateId = store.state.user.id

  const { data: ret } = await getMessageOutboxList(query)
  page.pages = ret.pages
  page.records = ret.records

  page.loading = false
}

function resetQuery() {
  request.createTime = null
  request.memberName = null
  loadMessageOutboxList()
}

function resetReplyForm() {
  replyForm.receiveType = 'INDIVIDUAL'
  replyForm.affiliateId = null
  replyForm.recipient = []
  replyForm.id = null
  replyForm.siteId = null
  replyForm.content = null
  replyForm.title = null
  replyForm.edit = true
}

async function reply(data) {
  uiControl.dialogVisible = true
  resetReplyForm()

  replyForm.title = 'RE : ' + data.title
  uiControl.dialogTitle = replyForm.title

  replyForm.recipient = [data.memberName]
  replyForm.affiliateId = store.state.user.id
  replyForm.siteId = store.state.user.siteId
  replyForm.id = data.id

  if (data.status === 1) {
    replyForm.edit = false
    replyForm.content = data.content
  }
}

async function submitReply() {
  await replyMessage(replyForm)
  ElMessage({ message: t('message.replySuccess'), type: 'success' })
  await loadMessageOutboxList()
  uiControl.dialogVisible = false
}

onMounted(() => {
  loadMessageOutboxList()
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
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
    .button-end {
      justify-content: flex-end;
    }
  }
}
.el-pagination {
  display: inline-block;
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
