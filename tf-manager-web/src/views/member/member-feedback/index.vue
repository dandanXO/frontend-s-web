<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 100px;"
          default-first-option
          @focus="loadSites"
          @change="loadFeedbackTypesBySiteId"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-input
          v-model="request.loginName"
          size="small"
          style="width: 200px;margin-left: 5px"
          :placeholder="t('fields.loginName')"
        />
        <el-select
          clearable
          v-model="request.feedbackType"
          size="small"
          :placeholder="t('fields.memberFeedbackType')"
          class="filter-item"
          style="width: 120px;margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.feedbackTypes"
            :key="item.id"
            :label="item.value"
            :value="item.value"
          />
        </el-select>
        <el-checkbox v-model="request.isNotRead" :true-label="true" :false-label="false" style="margin-left:10px;">{{ t('fields.notRead') }}</el-checkbox>
        <el-checkbox v-model="request.isNotReplied" :true-label="true" :false-label="false">{{ t('fields.notReplied') }}</el-checkbox>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadFeedback"
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
    <el-dialog
      :title="t('message.replyFeedback')"
      v-model="uiControl.formVisible"
      append-to-body
      width="580px"
    >
      <el-form
        ref="feedbackForm"
        :model="form"
        :rules="feedbackReplyRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.memberFeedbackType')" prop="feedbackType">
          <el-input disabled style="width: 350px" v-model="form.feedbackType" />
        </el-form-item>
        <el-form-item :label="t('fields.title')" prop="title">
          <el-input disabled style="width: 350px" v-model="form.title" />
        </el-form-item>
        <el-form-item :label="t('fields.content')" prop="content">
          <el-input type="textarea" :rows="10" disabled style="width: 350px" v-model="form.content" />
        </el-form-item>
        <el-form-item :label="t('fields.replyTitle')" prop="replyTitle">
          <el-input :disabled="uiControl.formDisabled" style="width: 350px" v-model="form.replyTitle" />
        </el-form-item>
        <el-form-item :label="t('fields.replyContent')" prop="replyContent">
          <el-input :disabled="uiControl.formDisabled" type="textarea" :rows="10" style="width: 350px" v-model="form.replyContent" />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.formVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="submitReply">
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
    >
      <el-table-column
        prop="senderName"
        :label="t('fields.loginName')"
        min-width="100"
      />
      <el-table-column
        prop="feedbackType"
        :label="t('fields.memberFeedbackType')"
        min-width="140"
      />
      <el-table-column
        prop="sendTime"
        :label="t('fields.sendTime')"
        min-width="140"
      >
        <template #default="scope">
          <span v-if="scope.row.sendTime === null">-</span>
          <!-- eslint-disable -->
          <span
            v-if="scope.row.sendTime !== null"
            v-formatter="{
              data: scope.row.sendTime,
              timeZone: timeZone,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        :label="t('fields.status')"
        min-width="140"
      >
        <template #default="scope">
          <el-tag v-if="scope.row.readTime === null" type="danger">UNREAD</el-tag>
          <el-tag v-else-if="scope.row.replyTime === null" type="danger">UNREPLIED</el-tag>
          <el-tag v-else type="success">REPLIED</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="hasPermission(['sys:feedback:read'])"
        :label="t('fields.operate')"
        align="center"
        min-width="100"
        fixed="right"
      >
        <template #default="scope">
          <el-button
            size="mini"
            type="primary"
            @click="showReadFeedback(scope.row)"
          >
            {{ scope.row.readTime === null || scope.row.replyTime === null? t('fields.edit') : t('fields.show')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-pagination
    class="pagination"
    @current-change="changePage"
    layout="prev, pager, next"
    :page-size="request.size"
    :page-count="page.pages"
    :current-page="request.current"
  />
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import {
  getFeedbacks,
  readFeedback,
  replyFeedback
} from '../../../api/member-feedback'
import { required } from '../../../utils/validate'
import { useI18n } from 'vue-i18n'
import { getSiteListSimple } from '../../../api/site'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { hasPermission } from '../../../utils/util'
import { getConfigList } from "@/api/config";

const { t } = useI18n()
const feedbackForm = ref(null)
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const siteList = reactive({
  list: [],
})

const uiControl = reactive({
  formVisible: false,
  formDisabled: false,
  dialogTitle: '',
  dialogType: 'EDIT',
  editBtn: true,
  feedbackTypes: []
})
const request = reactive({
  size: 30,
  loginName: null,
  current: null,
  siteId: null,
  feedbackType: null,
  isNotRead: false,
  isNotReplied: false,
})

let timeZone = null;

function resetQuery() {
  request.loginName = null
  request.feedbackType = null
  request.siteId = siteList.list[0].id
  request.isNotRead = false
  request.isNotReplied = false
}

const form = reactive({
  id: null,
  siteId: null,
  senderName: null,
  feedbackType: null,
  title: null,
  content: null,
  replyTitle: null,
  replyContent: null,
})

const feedbackReplyRules = reactive({
  replyTitle: [required(t('message.validateReplyTitleRequired'))],
  replyContent: [required(t('message.validateReplyContentRequired'))]
})

const page = reactive({
  pages: 0,
  records: [],
})

async function loadFeedback() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  const { data: ret } = await getFeedbacks(query)
  page.pages = ret.pages
  timeZone = siteList.list.find(e => e.id === request.siteId).timeZone;
  page.records = ret.records
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

async function showReadFeedback(feedback) {
  const { data: ret } = await readFeedback(feedback)
  uiControl.formVisible = true
  nextTick(() => {
    for (const key in ret) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = ret[key];
      }
    }
    if (form.replyTitle || form.replyContent) {
      uiControl.formDisabled = true
    } else {
      form.replyTitle = "RE: " + form.title
      uiControl.formDisabled = false
    }
  });
}

function submitReply() {
  feedbackForm.value.validate(async (valid) => {
    if (valid) {
      await replyFeedback(form.id, form.siteId, form.replyTitle, form.replyContent);
      uiControl.formVisible = false;
      await loadFeedback();
      ElMessage({ message: t('message.success'), type: "success" });
    }
  });
}

async function loadFeedbackTypesBySiteId() {
  console.log(request.siteId)
  if (request.siteId) {
    const { data: adjustType } = await getConfigList("feedback_type", request.siteId);
    uiControl.feedbackTypes = adjustType;
  }
}

onMounted(async () => {
  await loadSites()
  request.siteId = siteList.list[0].id
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  }
  loadFeedbackTypesBySiteId()
  loadFeedback()
})

function changePage(page) {
  request.current = page
  loadFeedback()
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

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}
</style>
