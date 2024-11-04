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
        <el-input
          v-model="request.id"
          size="small"
          placeholder="ID"
          style="width: 200px; margin-left: 5px;"
        />
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
        <el-button
          icon="el-icon-close"
          size="mini"
          type="danger"
          v-permission="['sys:rollover-record:cancel']"
          :disabled="!uiControl.foundOngoingRecord"
          @click="showCancelAllEdit()"
        >
          {{ t('fields.batchCancel') }}
        </el-button>
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
          prop="id"
          :label="t('fields.id')"
          align="center"
          min-width="180"
        />
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
        <el-table-column :label="t('fields.description')" align="center" min-width="150">
          <template #default="scope">
            <span v-for="(item, index) in scope.row.progress" @click="getRolloverDetails(scope.row)" :key="index" :style="{color: getProgressColor(item)}" style="text-decoration: underline; cursor: pointer;">
              {{ item.type }}: {{ item.progress }} / {{ item.total }}  <br>
            </span>
            <span v-if="scope.row.platformGames">{{ scope.row.platformGames }}</span>
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
            <span v-else v-formatter="{data: scope.row.createTime, type: 'date'}">{{ scope.row.createTime }}</span>
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
            <span v-else v-formatter="{data: scope.row.updateTime, type: 'date'}">{{ scope.row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="updateBy"
          :label="t('fields.updateBy')"
          align="center"
          min-width="180"
        />
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

    <el-dialog :title="uiControl.dialogTitle" v-model="uiControl.dialogVisible" append-to-body :width="uiControl.dialogType === 'ROLLOVER_DETAILS' ? '780px' : '680px'">
      <el-form v-if="uiControl.dialogType === 'CANCEL' || uiControl.dialogType === 'CANCEL ALL'" ref="formRef" :model="form" :rules="formRules" :inline="true" size="small" label-width="120px">
        <el-form-item :label="t('fields.remark')" prop="remark">
          <el-input type="textarea" v-model="form.remark" :rows="6" style="width: 450px;" maxlength="500" show-word-limit />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button v-if="uiControl.dialogType === 'CANCEL'" type="primary" @click="cancelRecord">{{ t('fields.confirm') }}</el-button>
          <el-button v-else type="primary" @click="cancelAllRecord">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
      <div class="rollover-details" v-if="uiControl.dialogType === 'ROLLOVER_DETAILS'">
        <!-- <el-row>
          <el-col :span="12">{{ t('fields.rolloverAmount') }}</el-col>
          <el-col :span="12">{{ rolloverDetails.rolloverAmt || 0 }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="12">{{ t('fields.rolloverAmount') }}</el-col>
          <el-col :span="12">{{ rolloverDetails.rolloverAmt || 0 }}%</el-col>
        </el-row>
        <el-row>
          <el-col :span="12">{{ t('fields.rolloverAmount') }}</el-col>
          <el-col :span="12">{{ rolloverDetails.rolloverAmt || 0 }}</el-col>
        </el-row> -->
        <el-table :data="parsedData" style="width: 100%">
          <el-table-column prop="platform" :label="t('fields.platform')" width="120" />
          <el-table-column prop="transactionId" :label="t('fields.transactionId')" width="250" />
          <el-table-column prop="ticketNo" :label="t('fields.ticketNo')" width="250" />
          <!-- <el-table-column prop="bet" :label="t('fields.bet')" width="80" />
          <el-table-column prop="payout" :label="t('fields.payout')" width="80" /> -->
          <!-- <el-table-column prop="rollover" :label="t('fields.rollover')" width="80" /> -->
          <el-table-column prop="rolloverAmount" :label="t('fields.rollOverAmt')" width="80" />
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { defineProps, nextTick, onMounted, reactive, ref } from 'vue'
import { hasPermission, hasRole } from '../../../../../utils/util'
import { useI18n } from 'vue-i18n'
import {
  cancelAllRollover,
  cancelRollover,
  getMemberRolloverRecords,
  getTotal, hasOngoingRecords,
  getRolloverBets
} from '../../../../../api/member-rollover-records'
import { required } from '../../../../../utils/validate';
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';

const props = defineProps({
  mbrId: {
    type: String,
    required: true
  },
  timeZone: {
    type: String,
    required: true,
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
  foundOngoingRecord: false,
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
  id: null,
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

const parsedData = ref([]);

const getRolloverDetails = async (item) => {
  const res = await getRolloverBets(item.siteId, item.memberId, item.id);
  // Parsing each content entry to get JSON object
  parsedData.value = res.data.map(item => {
    const contentParts = item.content.split("|");
    const content = JSON.parse(contentParts[0]);
    const parseAmt = contentParts.length > 1 ? parseFloat(contentParts[1]) : null;
    return {
      ...content,
      createTime: item.createTime,
      rolloverAmount: parseAmt
    };
  });

  uiControl.dialogTitle = t('fields.rolloverDetails');
  uiControl.dialogType = 'ROLLOVER_DETAILS';
  uiControl.dialogVisible = true;
};
function resetQuery() {
  request.recordStatus = ['ONGOING', 'COMPLETED', 'VOID', 'CANCEL'];
  request.id = null;
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
  const { data: result } = await hasOngoingRecords(query);
  uiControl.foundOngoingRecord = result;
  page.loading = false
}

function getProgressColor(progress) {
  if (progress.progress / progress.total === 1) {
    return 'green'
  }
  return 'blue'
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

function showCancelAllEdit() {
  if (page.records.length > 0) {
    showDialog("CANCEL ALL");
    var record = page.records[0];
    form.siteId = record.siteId;
    form.memberId = record.memberId;
  }
}

function showDialog(type) {
  if (type === "CANCEL") {
    form.remark = null;
    uiControl.dialogTitle = t('fields.cancelRolloverRecord');
  } else if (type === "CANCEL ALL") {
    form.remark = null;
    uiControl.dialogTitle = t('fields.cancelAllRolloverRecord');
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

function cancelAllRecord() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      await cancelAllRollover(form);
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
::v-deep .el-table{
  .cell {
    white-space: pre-line !important;
  }
}

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
.rollover-details {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
