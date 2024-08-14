<template>
  <div class="roles-main">
    <el-card class="box-card" shadow="never">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ $t('fields.message') }}</span>
        </div>
      </template>

      <div class="inputs-wrap">
        <el-date-picker
          v-model="request.sendTime"
          format="DD/MM/YYYY HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          size="normal"
          class="input-normal"
          type="datetimerange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
        />
        <el-select
          v-model="request.type"
          size="normal"
          :placeholder="t('fields.sendMessageType')"
          class="filter-item"
          style="margin-left: 5px; width: 200px;"
        >
          <el-option
            v-for="item in uiControl.messageType"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <div class="btn-grp">
          <el-button
            icon="el-icon-search"
            type="primary"
            @click="loadMessageList()"
          >
            {{ $t('fields.search') }}
          </el-button>
          <el-button type="primary" plain @click="resetQuery()">
            {{ $t('fields.reset') }}
          </el-button>
        </div>
      </div>
      <div class="dialog-footer" style="margin-right: 20px;">
        <el-button
          icon="el-icon-plus"
          type="primary"
          size="normal"
          @click="showDialog('CREATE')"
        >
          {{ $t('fields.add') }}
        </el-button>
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
          prop="memberUsername"
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
          prop="type"
          :label="t('fields.messageType')"
          align="center"
          min-width="200"
        />

        <el-table-column
          prop="sendTime"
          :label="t('fields.messageSendTime')"
          align="center"
          min-width="200"
        >
          <template #default="scope">
            <span v-formatter="{ data: scope.row.sendTime, type: 'date'}" />
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

    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="580px"
    >
      <el-form
        v-if="uiControl.dialogType === 'CREATE'"
        :model="formRequest"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.messageType')">
          <el-select
            size="small"
            class="filter-item"
            style="margin-left: 5px; width: 200px;"
            v-model="formRequest.type"
            :placeholder="t('fields.sendMessageType')"
          >
            <el-option
              v-for="item in uiControl.messageType"
              :key="item.key"
              :label="item.displayName"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.receivedType')">
          <el-radio-group v-model="formRequest.receivedType">
            <el-radio-button label="ALL_DOWNLINE_MEMBER">
              {{ t('sendMessageType.ALL_DOWNLINE_MEMBER') }}
            </el-radio-button>
            <el-radio-button label="SELECTED_MEMBER">
              {{ t('sendMessageType.SELECTED_MEMBER') }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :label="t('fields.receivedMembers')"
          v-if="formRequest.receivedType === 'SELECTED_MEMBER'"
        >
          <el-input
            style="width: 350px;"
            v-model="formRequest.receivedMembers"
          />
          <div class="note">{{ t('fields.example') }}: memberA,memberB</div>
        </el-form-item>
        <el-form-item :label="t('fields.messageTitle')">
          <el-input style="width: 350px;" v-model="formRequest.title" />
        </el-form-item>
        <el-form-item :label="t('fields.messageContent')">
          <el-input style="width: 350px;" v-model="formRequest.content" />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">
            {{ $t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="composeEmail()">
            {{ $t('fields.messageSend') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { useStore } from '@/store'
import { useI18n } from 'vue-i18n'
import { sendMessage, getMessageList } from '../../../api/member-message'
import { ElMessage } from 'element-plus'
import { convertDateToStart, convertDateToEnd } from '@/utils/datetime'

const store = useStore()
const { t } = useI18n()

const request = reactive({
  siteId: null,
  type: null,
  sendTime: null,
  size: 20,
  current: 1,
})

const formRequest = reactive({
  affiliateId: null,
  title: null,
  content: null,
  type: null,
  siteId: null,
  sender: null,
  receivedType: null,
  receivedMembers: null,
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogContent: '',
  editBtn: true,
  removeBtn: true,
  messageType: [
    {
      key: '1',
      displayName: t('sendMessageType.NOTIFICATION'),
      value: 'NOTIFICATION',
    },
    { key: '2', displayName: t('sendMessageType.ACTIVITY'), value: 'ACTIVITY' },
    {
      key: '3',
      displayName: t('sendMessageType.ANNOUNCEMENT'),
      value: 'ANNOUNCEMENT',
    },
  ],
})

function showDialog(type) {
  if (type === 'CREATE') {
    uiControl.dialogTitle = t('fields.addAffiliateMessage')
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.editAffiliateMessage')
  }
  formRequest.receivedType = 'ALL_DOWNLINE_MEMBER'
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

async function loadMessageList() {
  page.loading = true
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })

  if (request.sendTime !== null) {
    if (request.sendTime.length === 2) {
      query.sendTime = request.sendTime.join(',')
    }
  }

  query.siteId = store.state.user.siteId
  query.sender = store.state.user.name

  const { data: ret } = await getMessageList(query)
  page.pages = ret.pages
  page.records = ret.records

  page.loading = false
}

async function composeEmail() {
  formRequest.affiliateId = store.state.user.id
  formRequest.siteId = store.state.user.siteId
  formRequest.sender = store.state.user.name

  await sendMessage(formRequest)
  ElMessage({ message: t('message.sendSuccess'), type: 'success' })
  await loadMessageList()
  uiControl.dialogVisible = false
}

function resetQuery() {
  request.sendTime = [
    convertDateToStart(new Date()),
    convertDateToEnd(new Date()),
  ]
  request.type = null

  loadMessageList()
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page
    loadMessageList()
  }
}

onMounted(() => {
  loadMessageList()
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
