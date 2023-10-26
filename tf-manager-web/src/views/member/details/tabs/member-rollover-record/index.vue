<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          multiple
          v-model="request.recordStatus"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="width: 400px; margin-left: 5px;"
        >
          <el-option
            v-for="item in uiControl.recordStatus"
            :key="item.id"
            :label="t('rollover.recordStatus.' + item.displayName)"
            :value="item.value"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadRolloverRecords()"
        >
          {{ t('fields.search') }}
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
      </div>
    </div>

    <el-card class="box-card" shadow="never" style="margin-top: 20px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.rolloverRecord') }}</span>
        </div>
      </template>
      <el-table
        :data="page.records"
        ref="table"
        v-loading="page.loading"
        row-key="id"
        size="mini"
        :resizable="true"
        highlight-current-row
        :empty-text="t('fields.noData')"
      >
        <el-table-column
          prop="depositSerialNumber"
          :label="t('fields.depositSerialNo')"
          align="center"
          min-width="180"
        >
          <template #default="scope">
            <span v-if="scope.row.depositSerialNumber === null">-</span>
            <span v-else>{{ scope.row.depositSerialNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="privilegeSerialNumber"
          :label="t('fields.privilegeSerialNo')"
          align="center"
          min-width="180"
        >
          <template #default="scope">
            <span v-if="scope.row.privilegeSerialNumber === null">-</span>
            <span v-else>{{ scope.row.privilegeSerialNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="rolloverAmount"
          :label="t('fields.rolloverAmount')"
          align="center"
          min-width="150"
        >
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.rolloverAmount, type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column
          prop="totalBetAmount"
          :label="t('fields.totalBetAmount')"
          align="center"
          min-width="150"
        >
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.totalBetAmount, type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column
          prop="lowBalance"
          :label="t('fields.lowBalance')"
          align="center"
          min-width="150"
        >
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.lowBalance, type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column
          prop="recordStatus"
          :label="t('fields.status')"
          align="center"
          min-width="180"
        >
          <template #default="scope">
            <el-tag v-if="scope.row.recordStatus === 'ONGOING'" type="primary">{{ t('rollover.recordStatus.' + scope.row.recordStatus) }}</el-tag>
            <el-tag v-else-if="scope.row.recordStatus === 'COMPLETED'" type="success">{{ t('rollover.recordStatus.' + scope.row.recordStatus) }}</el-tag>
            <el-tag v-else-if="scope.row.recordStatus === 'VOID'" type="warning">{{ t('rollover.recordStatus.' + scope.row.recordStatus) }}</el-tag>
            <el-tag v-else-if="scope.row.recordStatus === 'CANCEL'" type="danger">{{ t('rollover.recordStatus.' + scope.row.recordStatus) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          :label="t('fields.createTime')"
          align="center"
          min-width="180"
        >
          <template #default="scope">
            <span v-if="scope.row.createTime === null">-</span>
            <span v-else>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          :label="t('fields.updateTime')"
          align="center"
          min-width="180"
        >
          <template #default="scope">
            <span v-if="scope.row.updateTime === null">-</span>
            <span v-else>{{ scope.row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          :label="t('fields.remark')"
          align="center"
          min-width="180"
        >
          <template #default="scope">
            <span v-if="scope.row.remark === null">-</span>
            <span v-else>{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.operate')"
          align="right"
          fixed="right"
          v-if="!hasRole(['SUB_TENANT']) && hasPermission(['sys:rollover-record:cancel'])"
        >
          <template #default="scope">
            <el-button
              v-if="scope.row.recordStatus === 'ONGOING'"
              icon="el-icon-close"
              size="mini"
              type="danger"
              v-permission="['sys:rollover-record:cancel']"
              @click="showEdit(scope.row)"
            >
              {{ t('fields.cancel') }}
            </el-button>
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
      <div class="table-footer">
        <span>{{ t('fields.totalBetAmount') }}</span>
        <span style="margin-left: 10px">$</span>
        <span v-formatter="{data: page.totalValidBet, type: 'money'}" />
        <span style="margin-left: 30px">
          {{ t('fields.rolloverAmount') }}
        </span>
        <span style="margin-left: 10px">$</span>
        <span v-formatter="{data: page.rolloverRequired, type: 'money'}" />
      </div>
    </el-card>

    <el-dialog :title="uiControl.dialogTitle" v-model="uiControl.dialogVisible" append-to-body width="680px">
      <el-form v-if="uiControl.dialogType === 'CANCEL'" ref="formRef" :model="form" :rules="formRules" :inline="true" size="small" label-width="120px">
        <el-form-item :label="t('fields.remark')" prop="remark">
          <el-input type="textarea" v-model="form.remark" :rows="6" style="width: 450px;" maxlength="500" show-word-limit />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="cancelRecord">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { defineProps, nextTick, onMounted, reactive, ref } from 'vue'
import { hasPermission, hasRole } from '../../../../../utils/util'
import { useI18n } from 'vue-i18n'
import { cancelRollover, getMemberRolloverRecords, getTotal } from '../../../../../api/member-rollover-records'
import { required } from '../../../../../utils/validate';
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';

const props = defineProps({
  mbrId: {
    type: String,
    required: true
  }
})

const { t } = useI18n()
const route = useRoute()
const site = reactive({
  id: route.query.site
});
const formRef = ref(null)

const uiControl = reactive({
  dialogTitle: t('fields.cancelRolloverRecord'),
  dialogType: 'CANCEL',
  dialogVisible: false,
  recordStatus: [
    { key: 1, displayName: 'ONGOING', value: 'ONGOING' },
    { key: 2, displayName: 'COMPLETED', value: 'COMPLETED' },
    { key: 3, displayName: 'VOID', value: 'VOID' },
    { key: 4, displayName: 'CANCEL', value: 'CANCEL' }
  ],
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
  totalValidBet: 0,
  rolloverRequired: 0
})

const request = reactive({
  size: 30,
  current: 1,
  siteId: null,
  memberId: null,
  recordStatus: ['ONGOING', 'COMPLETED', 'VOID', 'CANCEL']
})

const form = reactive({
  id: null,
  siteId: null,
  memberId: null,
  remark: null
});

const formRules = reactive({
  remark: [required(t('message.validateRemarkRequired'))]
});

function resetQuery() {
  request.recordStatus = ['ONGOING', 'COMPLETED', 'VOID', 'CANCEL'];
}

function checkQuery() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })

  if (request.recordStatus !== null) {
    if (request.recordStatus.length === 1) {
      query.recordStatus = request.recordStatus[0];
    } else {
      query.recordStatus = request.recordStatus.join(",");
    }
  }
  query.memberId = props.mbrId;
  query.siteId = site.id;
  return query
}

async function loadRolloverRecords() {
  page.loading = true
  const query = checkQuery()
  const { data: ret } = await getMemberRolloverRecords(query)
  page.pages = ret.pages
  page.records = ret.records
  if (page.records.length !== 0) {
    const { data: total } = await getTotal(query)
    page.totalValidBet = total.totalValidBet
    page.rolloverRequired = total.rolloverRequired
  } else {
    page.totalValidBet = 0
    page.rolloverRequired = 0
  }
  page.loading = false
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page
    loadRolloverRecords()
  }
}

function showEdit(rolloverRecord) {
  showDialog("CANCEL");
  nextTick(() => {
    for (const key in rolloverRecord) {
      if (Object.keys(form).find(k => k === key)) {
        if (key !== 'remark') {
          form[key] = rolloverRecord[key];
        }
      }
    }
  });
}

function showDialog(type) {
  if (type === "CANCEL") {
    form.remark = null;
    uiControl.dialogTitle = t('fields.cancelRolloverRecord');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

function cancelRecord() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      await cancelRollover(form);
      uiControl.dialogVisible = false;
      ElMessage({ message: t('message.cancelRolloverRecordSuccess'), type: "success" });
      await loadRolloverRecords();
    }
  });
}

onMounted(() => {
  loadRolloverRecords()
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.table-footer {
  margin-bottom: 15px;
  margin-right: 20px;
  float: right;
  font-size: small;
}
</style>
