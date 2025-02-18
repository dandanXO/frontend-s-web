<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
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
          prop="loginName"
          :label="t('fields.loginName')"
          align="center"
          min-width="180"
        />
        <el-table-column
          prop="currAmount"
          :label="t('fields.currAmount')"
          align="center"
          min-width="150"
        >
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.currAmount, type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column
          prop="currAmount"
          :label="t('fields.calculatedAmount')"
          align="center"
          min-width="150"
        >
          <template #default="scope">
            $ <span v-formatter="{data: scope.row.calculatedAmount, type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column
          prop="calculatedPts"
          :label="t('fields.calculatedPts')"
          align="center"
          min-width="180"
        />
        <el-table-column :label="t('fields.description')" align="center" min-width="280">
          <template #default="scope">
            <span v-for="(item, index) in scope.row.content" :key="index">
              <span v-if="item.type === 'FIRST_FREE_SPIN'">First Free Spin({{ item.pt }}pt) <br></span>
              <span v-if="item.type === 'NEW_INVITE'">New Invite({{ item.pt }}pt): {{ item.count }} invites <br></span>
              <span v-if="item.type === 'TEAM_VALID_BET'">Team Valid Bet({{ item.pt }}pt): Amount ${{ item.amount }} Team Size: {{ item.teamCount }} <br></span>
              <span v-if="item.type === 'TEAM_DEPOSIT'">Team Valid Bet({{ item.pt }}pt): Amount ${{ item.amount }} Team Size: {{ item.teamCount }} <br></span>
              <span v-if="item.type === 'TEAM_PROFIT'">Team Valid Bet({{ item.pt }}pt): Amount ${{ item.amount }} <br></span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          :label="t('fields.startTime')"
          align="center"
          min-width="180"
        >
          <template #default="scope">
            <span v-if="scope.row.startTime === null">-</span>
            <span v-else v-formatter="{data: scope.row.startTime, timeZone: timeZone, type: 'date'}">{{ scope.row.startTime }}</span>
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
            <span v-else v-formatter="{data: scope.row.updateTime, timeZone: timeZone, type: 'date'}">{{ scope.row.updateTime }}</span>
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
    </el-card>

    <el-dialog :title="uiControl.dialogTitle" v-model="uiControl.dialogVisible" append-to-body :width="uiControl.dialogType === 'ROLLOVER_DETAILS' ? '780px' : '680px'">
      <el-form v-if="uiControl.dialogType === 'CANCEL' || uiControl.dialogType === 'CANCEL ALL'" ref="formRef" :model="form" :rules="formRules" :inline="true" size="small" label-width="120px">
        <el-form-item :label="t('fields.remark')" prop="remark">
          <el-input type="textarea" v-model="form.remark" :rows="6" style="width: 450px;" maxlength="500" show-word-limit />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button v-if="uiControl.dialogType === 'CANCEL'" type="primary" @click="cancelRecord">{{ t('fields.confirm') }}</el-button>
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
        <el-table :data="betsPage.showRecords" style="width: 100%">
          <el-table-column prop="platform" :label="t('fields.platform')" width="120" />
          <el-table-column prop="transactionId" :label="t('fields.transactionId')" width="250" />
          <el-table-column prop="ticketNo" :label="t('fields.ticketNo')" width="250" />
          <!-- <el-table-column prop="bet" :label="t('fields.bet')" width="80" />
          <el-table-column prop="payout" :label="t('fields.payout')" width="80" /> -->
          <!-- <el-table-column prop="rollover" :label="t('fields.rollover')" width="80" /> -->
          <el-table-column prop="rolloverAmount" :label="t('fields.rollOverAmt')" width="80" />
          <el-table-column prop="createTime" :label="t('fields.createTime')" width="180" />
        </el-table>
        <el-pagination
          layout="total, prev, pager, next"
          style="margin-top: 10px"
          :total="betsPage.total"
          :page-size="betsPage.size"
          :page-count="betsPage.pages"
          :current-page="betsPage.current"
          @current-change="changeBetsPage"
        />
      </div>
    </el-dialog>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.addDialogVisible"
      append-to-body
      width="580px"
    >
      <el-form
        ref="addRolloverFormRef"
        :model="addRolloverForm"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item :label="t('fields.amount')" prop="amount">
              <el-input-number
                v-model="addRolloverForm.amount"
                style="width: 145px"
                :min="0"
                :controls="false"
                @keypress="restrictInput($event)"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="t('fields.rolloverType')" prop="rolloverType">
              <el-select v-if="!isAffiliateUser"
                         v-model="selectedRolloverType"
                         style="width: 100%;"
                         filterable
                         default-first-option
                         @change="checkRolloverType"
                         :disabled="addAmountAdjustmentType === 'CALCULATE'"
              >
                <el-option
                  v-for="f in uiControl.rolloverType"
                  :key="f.key"
                  :label="f.displayName"
                  :value="f.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <template v-if="uiControl.selectedGameTypeRolloverType !== 'GAME_TYPE'">
            <el-col v-if="!isAffiliateUser" :span="7">
              <el-form-item prop="rollover">
                <el-input-number
                  v-model="addRolloverForm.rollover"
                  style="width: 145px"
                  :min="0"
                  :max="selectedRolloverType === 'MULTIPLE' ? 100 : 999999999999999"
                  :controls="false"
                  @keypress="restrictInput($event)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="7" v-else>
              <el-form-item prop="rollover">
                <el-input-number
                  v-model="addRolloverForm.rollover"
                  style="width: 145px"
                  :controls="false"
                  :disabled="isAffiliateUser"
                />
              </el-form-item>
            </el-col>
            <el-col style="padding:8px 0;" :span="4" v-if="addAmountAdjustmentType === 'CALCULATE'">
              {{ calculateRollover() }}
            </el-col>
          </template>
        </el-row>
        <el-row v-if="!isAffiliateUser">
          <el-form-item
            :label="t('fields.gameTypeRollover')"
            prop="gameTypeRollover"
          >
            <el-select
              v-model="uiControl.selectedGameTypeRolloverType"
              style="width: 250px"
              filterable
            >
              <el-option
                v-for="f in uiControl.gameTypeRolloverTypes"
                :key="f.key"
                :label="f.displayName"
                :value="f.value"
              />
            </el-select>
            <div v-if="uiControl.selectedGameTypeRolloverType !== null && uiControl.selectedGameTypeRolloverType !== 'ALL_TYPES'">
              <div v-for="(item, index) in gameTypes" :key="index">
                <el-select
                  v-model="item.key"
                  size="small"
                  :placeholder="t('fields.gameType')"
                  class="filter-item"
                  style="width: 100px; margin-top: 5px"
                >
                  <el-option
                    v-for="gameType in uiControl.gameTypeRollover"
                    :key="gameType.key"
                    :label="t(`gameType.${gameType.displayName}`)"
                    :value="gameType.value"
                    :disabled="gameTypes.some(({key}) => key === gameType.value)"
                  />
                </el-select>
                <span v-if="uiControl.selectedGameTypeRolloverType === 'GAME_TYPE'">
                  :
                  <el-input-number v-if="item.key" :controls="false" style="width: 100px " v-model="item.value" :min="1" :max="selectedRolloverType === 'MULTIPLE'? 100 : 999999999999999" />
                  <el-input-number v-else :controls="false" style="width: 100px " v-model="item.value" />
                </span>
                <el-button
                  v-if="index === gameTypes.length - 1"
                  icon="el-icon-plus"
                  size="mini"
                  type="primary"
                  style="margin-left: 20px"
                  @click="addRollover()"
                  plain
                >
                  {{ t('fields.add') }}
                </el-button>
                <el-button
                  v-else
                  icon="el-icon-remove"
                  size="mini"
                  type="danger"
                  style="margin-left: 20px"
                  @click="delRollover(index)"
                  plain
                >
                  {{ t('fields.delete') }}
                </el-button>
                <span style="padding: 8px; text-align: center;" v-if="item.key && item.value && addAmountAdjustmentType === 'CALCULATE'">{{ calculateRollover(item.value) }}</span>
              </div>
            </div>
          </el-form-item>
        </el-row>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button
            v-if="uiControl.dialogType === 'CREATE_ADD'"
            type="primary"
          >
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { hasPermission, hasRole } from '../../../utils/util'
import { useI18n } from 'vue-i18n'
import {
  cancelRollover,
} from '../../../api/member-rollover-records'
import {
  getCalculated
} from '../../../api/refer-spin'
import { required } from '../../../utils/validate';
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';
import { getSiteListSimple } from "@/api/site";
import { TENANT } from "@/store/modules/user/action-types";
import { useStore } from "@/store";

const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const { t } = useI18n()
const store = useStore()
const route = useRoute()
const site = reactive({
  id: route.query.site
});
const formRef = ref(null)
const addRolloverFormRef = ref(null)
const selectedRolloverType = ref('MULTIPLE');
const isAffiliateUser = ref(false)
const addAmountAdjustmentType = ref('NORMAL');
const siteList = reactive({
  list: []
});

const uiControl = reactive({
  dialogTitle: t('fields.cancelRolloverRecord'),
  dialogType: 'CANCEL',
  dialogVisible: false,
  addDialogVisible: false,
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
  totalValidBet: 0,
  rolloverRequired: 0
})

const betsPage = reactive({
  pages: 0,
  total: 0,
  records: [],
  showRecords: [],
  loading: false,
  current: 1,
  size: 5
})

const request = reactive({
  size: 30,
  id: null,
  current: 1,
  siteId: null,
  memberId: null,
})

const form = reactive({
  id: null,
  siteId: null,
  memberId: null,
  remark: null
});

const addRolloverForm = reactive({
  siteId: null,
  memberId: null,
  amount: null,
  rollover: null,
});

function addRollover() {
  gameTypes.value.push({
    key: '',
    value: '',
  })
}

function delRollover(index) {
  gameTypes.value.splice(index, 1)
}

const formRules = reactive({
  remark: [required(t('message.validateRemarkRequired'))]
});
const cachedGameTypes = ref([]);
const cachedUIAmt = ref([]);
const gameTypes = ref([])

const checkRolloverType = () => {
  if (selectedRolloverType.value === 'MULTIPLE') {
    cachedUIAmt.value = form.rollover
    if (form.rollover > 100) {
      form.rollover = 100
    } else {
      form.rollover = undefined
    }
    cachedGameTypes.value = gameTypes.value.map(type => ({ ...type }));
    gameTypes.value.forEach(type => {
      if (type.value > 100) {
        type.value = 100;
      }
    });
  } else {
    // gameTypes.value = cachedGameTypes.value.map(type => ({ ...type }));
    if (cachedGameTypes.value.length > 0) {
      gameTypes.value = cachedGameTypes.value.map(type => ({ ...type }));
    }
    if (cachedUIAmt.value) {
      form.rollover = cachedUIAmt.value
    }
  }
}

function getShowRecords() {
  betsPage.showRecords = [];
  const startIndex = (betsPage.current * betsPage.size) - betsPage.size;
  const endIndex = Math.min((betsPage.current * betsPage.size) - 1, betsPage.total - 1);
  for (let i = startIndex; i <= endIndex; i++) {
    betsPage.showRecords.push(betsPage.records[i]);
  }
}

const changeBetsPage = (page) => {
  if (betsPage.current >= 1) {
    betsPage.current = page;
    getShowRecords();
  }
};

function resetQuery() {
  request.id = null;
  request.siteId = siteList.list[0].id;
}

function checkQuery() {
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  return query
}

function restrictInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if (charCode < 48 || charCode > 57) {
    event.preventDefault()
  }
}

async function loadRolloverRecords() {
  page.loading = true
  const query = checkQuery()
  const { data: ret } = await getCalculated(query)
  ret.records.forEach(
    (item) => {
      item.content = JSON.parse(item.content)
    }
  )
  page.pages = ret.pages
  page.records = ret.records
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
    uiControl.dialogVisible = true;
  } else if (type === "CANCEL ALL") {
    form.remark = null;
    uiControl.dialogTitle = t('fields.cancelAllRolloverRecord');
    uiControl.dialogVisible = true;
  } else if (type === 'CREATE_ADD') {
    if (addRolloverFormRef.value) {
      addRolloverFormRef.value.resetFields()
      addRolloverForm.rollover = undefined
    }
    uiControl.dialogTitle = t('fields.add')
    gameTypes.value = []
    addRollover()
    uiControl.addDialogVisible = true
  }
  uiControl.dialogType = type;
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

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  siteList.list = site;
  request.siteId = siteList.list[0].id;
};

onMounted(async () => {
  await loadSites()
  request.siteId = siteList.list[0].id
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName)
    request.siteId = site.value.id
  }
  await loadRolloverRecords()
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
