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
        <el-button
          icon="el-icon-refresh"
          size="mini"
          type="primary"
          v-permission="['sys:withdrawable:refresh']"
          @click="refreshWithdrawable()"
        >
          {{ t('fields.refreshWithdrawable') }}
        </el-button>
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-permission="['sys:rollover-record:add']"
          @click="showDialog('CREATE_ADD')"
        >
          {{ t('fields.add') }}
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
            <span v-else v-formatter="{data: scope.row.createTime, timeZone: timeZone, type: 'date'}">{{ scope.row.createTime }}</span>
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
        <span>{{ t('fields.withdrawableBalance') }}</span>
        <span style="margin-left: 10px">$</span>
        <span v-formatter="{data: uiControl.withdrawable, type: 'money'}" />
        <span style="margin-left: 30px">{{ t('fields.totalBetAmount') }}</span>
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
            @click="createAdd"
          >
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
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
  getRolloverBets, addRolloverRecord
} from '../../../../../api/member-rollover-records'
import { getWithdrawableBalance, refreshWithdrawableBalance } from '../../../../../api/member'
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
const addRolloverFormRef = ref(null)
const selectedRolloverType = ref('MULTIPLE');
const isAffiliateUser = ref(false)
const addAmountAdjustmentType = ref('NORMAL');

const uiControl = reactive({
  dialogTitle: t('fields.cancelRolloverRecord'),
  dialogType: 'CANCEL',
  dialogVisible: false,
  addDialogVisible: false,
  foundOngoingRecord: false,
  recordStatus: [
    { key: 1, displayName: 'ONGOING', value: 'ONGOING' },
    { key: 2, displayName: 'COMPLETED', value: 'COMPLETED' },
    { key: 3, displayName: 'VOID', value: 'VOID' },
    { key: 4, displayName: 'CANCEL', value: 'CANCEL' }
  ],
  withdrawable: 0,
  selectedGameTypeRolloverType: 'ALL_TYPES',
  rolloverType: [
    { key: 1, displayName: t('fields.rollOverAmt'), value: 'AMOUNT' },
    { key: 2, displayName: t('fields.rollOverMulti'), value: 'MULTIPLE' },
  ],
  gameTypeRolloverTypes: [
    { key: 1, displayName: t('gameTypeRolloverSetting.anyTypes'), value: 'ALL_TYPES' },
    { key: 2, displayName: t('gameTypeRolloverSetting.specifyTypes'), value: 'SPECIFY_TYPES' },
    { key: 3, displayName: t('gameTypeRolloverSetting.excludeTypes'), value: 'EXCLUDE_TYPES' },
    { key: 4, displayName: t('gameTypeRolloverSetting.specifyGameType'), value: 'GAME_TYPE' },
  ],
  gameTypeRollover: [
    { key: 1, displayName: 'SLOT', value: 'slot' },
    { key: 2, displayName: 'LIVE', value: 'live' },
    { key: 3, displayName: 'FISH', value: 'fish' },
    { key: 4, displayName: 'SPORT', value: 'sport' },
    { key: 5, displayName: 'ESPORT', value: 'esport' },
    { key: 6, displayName: 'POKER', value: 'poker' },
    { key: 7, displayName: 'LOTTERY', value: 'lottery' },
    { key: 8, displayName: 'CASUAL', value: 'casual' },
  ],
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
  recordStatus: ['ONGOING', 'COMPLETED', 'VOID', 'CANCEL']
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

const getRolloverDetails = async (item) => {
  betsPage.loading = true;
  const res = await getRolloverBets(item.siteId, item.memberId, item.id);
  // Parsing each content entry to get JSON object
  betsPage.records = res.data.map(item => {
    const contentParts = item.content.split("|");
    const content = JSON.parse(contentParts[0]);
    const parseAmt = contentParts.length > 1 ? parseFloat(contentParts[1]) : null;
    return {
      ...content,
      createTime: item.createTime,
      rolloverAmount: parseAmt
    };
  });
  betsPage.total = betsPage.records.length;
  betsPage.pages = Math.ceil(betsPage.total / betsPage.size);
  getShowRecords();

  betsPage.loading = false;

  uiControl.dialogTitle = t('fields.rolloverDetails');
  uiControl.dialogType = 'ROLLOVER_DETAILS';
  uiControl.dialogVisible = true;
};

function createAdd() {
  addRolloverFormRef.value.validate(async valid => {
    if (valid) {
      addRolloverForm.siteId = site.id;
      addRolloverForm.memberId = props.mbrId;

      if (isAffiliateUser.value === true) {
        addRolloverForm.rollover = 0;
        addRolloverForm.gameTypeRollover = null;
      } else {
        addRolloverForm.gameTypeRollover = constructRollover();
      }

      await addRolloverRecord(addRolloverForm);
      uiControl.dialogVisible = false;
      await loadRolloverRecords();
      uiControl.addDialogVisible = false;
      ElMessage({ message: t('message.addSuccess'), type: 'success' });
    }
  });
}

function constructRollover() {
  const json = { newRollover: true };
  if (uiControl.selectedGameTypeRolloverType === 'GAME_TYPE') {
    json.rolloverType = 'INDIVIDUAL_' + selectedRolloverType.value + '_SPECIFY_TYPES'
    if (addAmountAdjustmentType.value === 'CALCULATE' && uiControl.dialogType === 'CREATE_ADD') {
      json.rolloverType = 'INDIVIDUAL_AMOUNT_SPECIFY_TYPES'
    }
    Object.values(gameTypes.value).forEach(item => {
      if (item.key) {
        if (!item.originalValue) {
          item.originalValue = { ...item }; // Deep clone the entire item for safekeeping
        }
        if (addAmountAdjustmentType.value === 'CALCULATE' && uiControl.dialogType === 'CREATE_ADD') {
          // Calculate the rollover for each game type
          const amount = +addRolloverForm.amount || 0; // Assuming item.value has an amount
          const rolloverMultiplier = item.value || 1;
          // Calculate the new rollover value
          const calculatedRollover = (amount) * rolloverMultiplier;
          json[item.key] = calculatedRollover;
        } else {
          json[item.key] = item.value;
        }
      }
    });
  } else {
    json.rolloverType = 'TOTAL_' + selectedRolloverType.value + '_' + uiControl.selectedGameTypeRolloverType
    if (addAmountAdjustmentType.value === 'CALCULATE' && uiControl.dialogType === 'CREATE_ADD') {
      json.rolloverType = 'TOTAL_AMOUNT_' + uiControl.selectedGameTypeRolloverType
      json.rollover = calculateRollover()
    } else {
      json.rollover = addRolloverForm.rollover
    }
    const excludeTypes = [];
    Object.values(gameTypes.value).forEach(item => {
      if (item.key) {
        excludeTypes.push(item.key);
      }
    });

    json.gameTypes = excludeTypes;
  }

  if (addAmountAdjustmentType.value === 'CALCULATE' && uiControl.dialogType === 'CREATE_ADD') {
    addRolloverForm.rollover = typeof addRolloverForm.rollover === 'number' ? calculateRollover() : 1
  } else {
    addRolloverForm.rollover = typeof addRolloverForm.rollover === 'number' ? form.rollover : 1;
  }
  console.log("json", json)
  return JSON.stringify(json)
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

function restrictInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if (charCode < 48 || charCode > 57) {
    event.preventDefault()
  }
}

async function loadWithdrawableBalance() {
  const { data: ret } = await getWithdrawableBalance(props.mbrId, site.id)
  uiControl.withdrawable = ret
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

async function refreshWithdrawable() {
  await refreshWithdrawableBalance(props.mbrId, site.id)
  await loadWithdrawableBalance()
  loadRolloverRecords()
}

function calculateRollover(item) {
  if (!form.amount || !form.deposit) {
    return undefined
  }
  const amount = +form.amount || 0;
  const deposit = +form.deposit || 0;
  if (item) {
    const multi = +item || 1
    return ((amount + deposit) * multi) - deposit;
  } else {
    const multi = form.rollover || 1;
    return ((amount + deposit) * multi) - deposit;
  }
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
  loadWithdrawableBalance()
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
