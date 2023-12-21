<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-date-picker
          v-model="request.createTime"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          size="small"
          type="datetimerange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="width: 400px;margin-right: 20px"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :editable="false"
          :clearable="false"
          :default-time="defaultTime"
        />
        <el-input v-model="request.topic" size="small" style="width: 200px;" :placeholder="t('fields.topic')" />
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadErrorQueue">
          {{ t('fields.search') }}
        </el-button>
        <el-button style="margin-left: 20px" icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">
          {{ t('fields.reset') }}
        </el-button>
      </div>
      <div class="btn-group">
        <el-button
          size="mini"
          type="primary"
          :disabled="uiControl.removeBtn"
          @click="resendMsg()"
        >
          {{ t('fields.resend') }}
        </el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          @click="removeMessagelist()"
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
      v-loading="page.loading"
      :empty-text="t('fields.noData')"
    >
      <el-table-column type="selection" />
      <el-table-column prop="createTime" :label="t('fields.createTime')" width="250" />
      <el-table-column prop="topic" :label="t('fields.topic')" width="250" />
      <el-table-column prop="groupId" :label="t('fields.groupId')" width="250" />
      <el-table-column prop="message" :label="t('fields.message')" width="800">
        <template #default="scope">
          <el-collapse>
            <el-collapse-item :title="getOverview(scope.row.message)" name="1">
              <pre v-html="scope.row.prettyMessage" style="overflow-wrap: break-word;" />
            </el-collapse-item>
          </el-collapse>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="page.total"
      :page-sizes="[20, 50, 100, 150]"
      layout="total,sizes,prev, pager, next"
      style="margin-top: 10px"
      v-model:page-size="request.size"
      v-model:page-count="page.pages"
      v-model:current-page="request.current"
      @current-change="loadErrorQueue"
      @size-change="loadErrorQueue"
    />
  </div>
</template>

<script setup>

import { reactive } from "vue";
import moment from 'moment';
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getErrorQueue, deleteErrors, resendErrors
} from "../../../api/sys-error-queue";
import { onMounted } from "@vue/runtime-core";
import { useI18n } from "vue-i18n";
import { getLogShortcuts } from "@/utils/datetime";

const { t } = useI18n();

const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59),
];

const shortcuts = getLogShortcuts(t);

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "CREATE",
  removeBtn: true
});
const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false
});

let choose = [];

const endDate = new Date()
const startDate = new Date(endDate.getTime() - 15 * 60 * 1000)
const defaultStartDate = convertDate(startDate)
const defaultEndDate = convertDate(endDate)

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD HH:mm:ss')
}

function disabledDate(time) {
  return (
    time.getTime() <
      moment(new Date())
        .subtract(2, 'months')
        .startOf('month')
        .format('x') || time.getTime() > new Date().getTime()
  )
}

const request = reactive({
  size: 20,
  current: 1,
  createTime: [defaultStartDate, defaultEndDate],
  topic: null
});

function handleSelectionChange(val) {
  choose = val;
  if (choose.length === 0) {
    uiControl.removeBtn = true;
  } else if (choose.length === 1) {
    uiControl.removeBtn = false;
  } else {
    uiControl.removeBtn = false;
  }
}

function resetQuery() {
  request.createTime = [defaultStartDate, defaultEndDate]
}

async function loadErrorQueue() {
  page.loading = true;
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
  }
  const { data: ret } = await getErrorQueue(query);
  page.pages = ret.pages
  page.records = ret.records
  page.records.forEach((item) => {
    item.prettyMessage = syntaxHighlight(item.message)
  })
  page.total = ret.total
  choose = [];
  page.loading = false;
}

async function resendMsg() {
  if (choose.length === 0) {
    ElMessage({ message: t('message.selectOne'), type: "warning" });
    return;
  }
  await resendErrors(choose.map(a => a.id));
  await loadErrorQueue();
  ElMessage({ message: t('message.resendSuccess'), type: "success" });
}

async function removeMessagelist() {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(async () => {
    if (choose.length === 0) {
      ElMessage({ message: t('message.selectOne'), type: "warning" });
      return;
    }
    await deleteErrors(choose.map(a => a.id));
    await loadErrorQueue();
    ElMessage({ message: t('message.deleteSuccess'), type: "success" });
  });
}

function syntaxHighlight(json) {
  json = JSON.stringify(JSON.parse(json), undefined, 2);
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    var cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
}

function getOverview(error) {
  return error.substr(0, 50) + "...";
}

onMounted(() => {
  loadErrorQueue();
});

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

.el-form-item--level-color:deep .el-form-item__content {
  display: flex !important;
}

pre {outline: 1px solid #ccc; padding: 5px; margin: 5px; white-space: pre-wrap;}
:deep {
  .string { color: green; }
  .number { color: darkorange; }
  .boolean { color: blue; }
  .null { color: magenta; }
  .key { color: red; }
}
</style>
