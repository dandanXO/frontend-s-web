<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px;margin-left: 5px"
          @focus="loadSites"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-date-picker
          v-model="request.createTime"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          size="small"
          type="daterange"
          range-separator=":"
          :start-placeholder="t('fields.startDate')"
          :end-placeholder="t('fields.endDate')"
          style="margin-left: 5px; width: 250px"
        />
        <el-input
          v-model="request.memberName"
          size="small"
          style="margin-left: 5px; width: 150px;"
          :placeholder="t('fields.memberName')"
        />
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadMessageOutbox"
        >{{ t('fields.search') }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
      </div>
      <div class="btn-group" v-if="!hasRole(['SUB_TENANT'])">
        <!-- <el-button icon="el-icon-plus" size="mini" type="primary" @click="showDialog()">{{ t('fields.add') }}</el-button> -->
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:outbox:del']"
          @click="removeSystemMessage()"
          :disabled="uiControl.removeBtn"
        >{{ t('fields.delete') }}</el-button>
      </div>
    </div>
    <el-dialog :title="form.title" v-model="uiControl.dialogVisible" append-to-body width="600px">
      <el-form v-if="uiControl.dialogType === 'VIEW'" ref="dialogForm" :model="form" :inline="true" size="small" label-width="50px">
        <el-row :gutter="20">
          <el-col :span="3">From</el-col>
          <el-col :span="21">{{ form.memberName }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="dialog">{{ form.content }}</div>
          </el-col>
        </el-row>
        <div class="dialog-footer">
          <el-button v-permission="['sys:outbox:reply']" v-if="form.memberName" @click="showDialog(form, 'REPLY')">{{ t('fields.reply') }}</el-button>
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
        </div>
      </el-form>
      <el-form v-else-if="uiControl.dialogType === 'REPLY'" ref="dialogForm" :model="form" :inline="true" size="small" label-width="50px">
        <el-row :gutter="20">
          <el-col :span="3">To</el-col>
          <el-col :span="21">{{ form.memberName }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item prop="content">
              <el-input
                v-model="form.content"
                :rows="8"
                type="textarea"
                :placeholder="t('fields.message')"
                style="width: 540px"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="dialog-footer">
          <el-button @click="send()">{{ t('fields.send') }}</el-button>
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-table
      :data="page.records"
      ref="table"
      size="small"
      highlight-current-row
      tooltip-effect="light"
      @selection-change="handleSelectionChange"
      @row-click="(row) => showDialog(row, 'VIEW')"
      :empty-text="t('fields.noData')"
    >
      <el-table-column type="selection" v-if="!hasRole(['SUB_TENANT'])" />
      <el-table-column prop="siteName" :label="t('fields.site')" />
      <el-table-column prop="memberName" :label="t('fields.memberName')" />
      <el-table-column prop="title" :label="t('fields.title')" />
      <el-table-column
        prop="content"
        :label="t('fields.content')"
        :show-overflow-tooltip="true"
      />
      <el-table-column prop="createTime" :label="t('fields.sendTime')">
        <template #default="scope">
          <span v-if="scope.row.createTime === null">-</span>
          <!-- eslint-disable -->
          <span
            v-if="scope.row.createTime !== null"
            v-formatter="{ data: scope.row.createTime, timeZone: scope.row.timeZone, type: 'date' }"
          />
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
import { ElMessage, ElMessageBox } from "element-plus";
import { computed, nextTick, onMounted, reactive, ref } from "vue";
import { hasRole } from "../../../../utils/util";
import { deleteMessageOutbox, getMessageOutbox } from "../../../../api/message-outbox";
import { useI18n } from "vue-i18n";
import { getSiteIdByName, getSiteListSimple } from "../../../../api/site";
import { createSystemMessageTemplate } from "../../../../api/system-message-template";
import { useStore } from '../../../../store';
import { TENANT } from "../../../../store/modules/user/action-types";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const dialogForm = ref(null);
const siteList = reactive({
  list: []
});
const uiControl = reactive({
  dialogType: null,
  dialogVisible: false,
  removeBtn: true,
  receiptInputVisible: false,
  receiveType: [{ typeName: "All", value: "ALL" }, { typeName: "Specific Recipient", value: "MULTIPLE" }, { typeName: "Specific VIP", value: "VIP" }],
  size: null
});

const request = reactive({
  size: 30,
  current: 1,
  createTime: [],
  memberName: null,
  siteId: null
});

function resetQuery() {
  request.createTime = [];
  request.memberName = null;
  request.siteId = null;
}

const form = reactive({
  memberName: [],
  title: null,
  content: null,
  siteName: null
});

let chooseMessage = [];

function showDialog(row, type) {
  if (type === 'VIEW') {
    if (dialogForm.value) {
      dialogForm.value.resetFields();
    }
    uiControl.dialogVisible = true;

    nextTick(() => {
      for (const key in row) {
        if (Object.keys(form).find(k => k === key)) {
          form[key] = row[key];
        }
        console.log("row %O", row)
      }
    });
    console.log(form)
  } else if (type === 'REPLY') {
    if (dialogForm.value) {
      dialogForm.value.resetFields();
    }
    form.content = null;
    form.title = 'RE: ' + form.title;
    uiControl.dialogVisible = true;
  }
  uiControl.dialogType = type;
}

function handleSelectionChange(val) {
  chooseMessage = val;
  if (chooseMessage.length === 0) {
    uiControl.removeBtn = true;
  } else if (chooseMessage.length === 1) {
    uiControl.removeBtn = false;
  } else {
    uiControl.removeBtn = false;
  }
}

async function removeSystemMessage(systemMessage) {
  console.log(systemMessage)
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(async () => {
    if (systemMessage) {
      await deleteMessageOutbox([systemMessage.id]);
    } else {
      await deleteMessageOutbox(chooseMessage.map(u => u.id));
    }
    await loadMessageOutbox();
    ElMessage({ message: t('message.deleteSuccess'), type: "success" });
  });
}

const page = reactive({
  pages: 0,
  records: []
});

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  siteList.list = site;
}

async function loadMessageOutbox() {
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  if (request.createTime.length === 2) {
    query.createTime = request.createTime.join(",");
  }
  if (request.siteId === null) {
    const siteIdList = siteList.list.map(s => s.id);
    query.siteId = siteIdList.join(',');
  }
  const { data: ret } = await getMessageOutbox(query);
  page.pages = ret.pages;
  ret.records.forEach(data => {
    data.timeZone = store.state.user.sites.find(e => e.siteName === data.siteName) !== undefined
      ? store.state.user.sites.find(e => e.siteName === data.siteName).timeZone
      : null
  });
  page.records = ret.records;
}

function send() {
  dialogForm.value.validate(async valid => {
    if (valid) {
      const item = {};
      const arr = [];
      const { data: id } = await getSiteIdByName(form.siteName);
      item.siteId = id;
      arr.push(form.memberName)
      item.recipient = arr;
      item.receiveType = 'MULTIPLE';
      Object.entries(form).forEach(([k, v]) => {
        if (k !== "siteName" && k !== "memberName") {
          item[k] = v;
        }
      });
      await createSystemMessageTemplate(item)
      uiControl.dialogVisible = false
      await loadMessageOutbox()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

onMounted(async() => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  }
  await loadMessageOutbox();
});

function changePage(page) {
  request.current = page;
  loadMessageOutbox();
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
.el-row {
  margin-bottom: 20px;
}

.dialog {
  height: 30vh;
  overflow: auto;
}
</style>
