<template>
  <div class="roles-main">
    <el-card class="box-card" shadow="never">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ $t('fields.downlineMember') }}</span>
        </div>
      </template>
      <el-form @submit.prevent>
        <div style="margin: 20px;">
          <el-row :gutter="20">
            <el-col :xl="2" :lg="3" :md="12" :sm="24">
              <el-form-item :label="t('fields.memberTag') + ' :'" />
            </el-col>
            <el-col :xl="18" :lg="16" :md="12" :sm="24">
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAll"
              >
                {{ t('fields.all') }}
              </el-checkbox>
              <el-checkbox-group
                v-model="selected.tags"
                @change="handleCheckedTags"
              >
                <el-checkbox
                  v-for="tag in tagList.description"
                  :key="tag"
                  :label="tag"
                />
              </el-checkbox-group>
            </el-col>
            <el-col class="memberTag" :xl="3" :lg="4" :md="12" :sm="24" style="margin-left: auto; text-align: right;">
              <el-button
                icon="el-icon-setting"
                type="primary"
                @click="goToTagSetting()"
                size="normal"
              >
                {{ $t('fields.tagSetting') }}
              </el-button>
            </el-col>
          </el-row>
        </div>
        <div class="inputs-wrap">
          <el-row :gutter="20">
            <el-col :xl="8" :lg="7" :md="12">
              <el-form-item :label="t('fields.loginName') + ' :'">
                <el-input size="normal" v-model="request.loginName" />
              </el-form-item>
            </el-col>
            <el-col :xl="10" :lg="10" :md="12">
              <el-form-item :label="t('fields.depositAmount') + ' :'">
                <el-input size="normal" v-model="request.depositMinAmount" class="input-min">
                  <template #append>
                    -
                  </template>
                </el-input>
                <el-input
                  v-model="request.depositMaxAmount"
                  class="input-max" size="normal"
                />
              </el-form-item>
            </el-col>
            <el-col :xl="6" :lg="5" :md="12">
              <el-form-item :label="t('fields.betRecord') + ' :'">
                <el-select size="normal" v-model="request.isBet">
                  <el-option key="1" value="-1" :label="t('fields.all')">
                    {{ t('fields.all') }}
                  </el-option>
                  <el-option key="2" value="1" :label="t('fields.yes')">
                    {{ t('fields.yes') }}
                  </el-option>
                  <el-option key="3" value="0" :label="t('fields.no')">
                    {{ t('fields.no') }}
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="inputs-wrap">
          <el-row :gutter="20">
            <el-col :xl="8" :lg="8" :md="12">
              <el-form-item :label="t('fields.recordTime') + ' :'">
                <el-date-picker
                  v-model="request.recordTime"
                  format="DD/MM/YYYY"
                  value-format="YYYY-MM-DD"
                  size="normal"
                  class="input-small"
                  type="daterange"
                  range-separator=":"
                  :start-placeholder="t('fields.startDate')"
                  :end-placeholder="t('fields.endDate')"
                  :shortcuts="shortcuts"
                  :disabled-date="disabledDate"
                  :editable="false"
                  :clearable="false"
                />
              </el-form-item>
            </el-col>
            <el-col :xl="10" :lg="8" :md="12">
              <el-form-item :label="t('fields.registerTime') + ' :'">
                <el-date-picker
                  v-model="request.regTime"
                  format="DD/MM/YYYY"
                  value-format="YYYY-MM-DD"
                  size="normal"
                  class="input-small"
                  type="daterange"
                  range-separator=":"
                  :start-placeholder="t('fields.startDate')"
                  :end-placeholder="t('fields.endDate')"
                  :shortcuts="shortcuts"
                  :disabled-date="disabledDate"
                  :editable="false"
                  :clearable="false"
                />
              </el-form-item>
            </el-col>
            <el-col :xl="6" :lg="6" :md="12">
              <div>
                <el-button
                  icon="el-icon-search"
                  type="primary"
                  @click="loadAffiliateMembers()"
                  size="normal"
                >
                  {{ $t('fields.search') }}
                </el-button>
                <el-button size="normal" type="primary" plain @click="resetQuery()">
                  {{ $t('fields.reset') }}
                </el-button>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="inputs-wrap">
          <el-button
            size="normal"
            type="primary"
            :disabled="uiControl.editBtn"
            @click="showBatchEditTag()"
          >
            {{ $t('fields.batchEditTag') }}
          </el-button>
        </div>
      </el-form>

      <el-table
        :data="page.records"
        ref="table"
        row-key="id"
        size="normal"
        highlight-current-row
        v-loading="page.loading"
        style="margin-top: 15px;"
        @selection-change="handleSelectionChange"
      >
        <template #empty>
          <emptyComp />
        </template>
        <el-table-column type="selection" width="40" />
        <el-table-column
          prop="loginName"
          :label="t('fields.loginName')"
          align="center"
        />
        <!-- <el-table-column
          prop="status"
          :label="t('fields.status')"
          align="center"
          min-width="180"
        >
          <template #default="scope">
            <el-tag
              v-if="scope.row.status === 'NORMAL'"
              type="success"
              size="normal"
            >
              {{ scope.row.status }}
            </el-tag>
            <el-tag
              v-if="scope.row.status === 'FROZEN'"
              type="danger"
              size="normal"
            >
              {{ scope.row.status }}
            </el-tag>
            <el-tag v-if="scope.row.status === null" type="info" size="normal">
              -
            </el-tag>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="totalDeposit"
          :label="t('fields.totalDeposit')"
          align="center"
        >
          <template #default="scope">
            $
            <span
              v-formatter="{data: scope.row.totalDeposit, type: 'money'}"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="totalWithdraw"
          :label="t('fields.totalWithdraw')"
          align="center"
        >
          <template #default="scope">
            $
            <span
              v-formatter="{data: scope.row.totalWithdraw, type: 'money'}"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="winLoss"
          :label="t('fields.winLoss')"
          align="center"
        >
          <template #default="scope">
            $
            <span v-formatter="{data: scope.row.winLoss, type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column
          prop="regTime"
          :label="t('fields.registerTime')"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.regTime === null">-</span>
            <span
              v-if="scope.row.regTime !== null"
              v-formatter="{
                data: scope.row.regTime,
                formatter: 'YYYY/MM/DD HH:mm:ss',
                type: 'date',
              }"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="lastLoginTime"
          :label="t('fields.lastLoginTime')"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.lastLoginTime === null">-</span>
            <span
              v-if="scope.row.lastLoginTime !== null"
              v-formatter="{
                data: scope.row.lastLoginTime,
                formatter: 'YYYY/MM/DD HH:mm:ss',
                type: 'date',
              }"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="tags"
          :label="t('fields.memberTag')"
          align="center"
        >
          <template #default="scope">
            {{ formatTag(scope.row.tags) }}
          </template>
        </el-table-column>
        <el-table-column :label="t('fields.operate')" align="center">
          <template #default="scope">
            <el-dropdown trigger="click">
              <el-link
                :underline="false"
                type="primary"
                class="el-dropdown-link"
              >
                {{ t('fields.more') }}
              </el-link>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="showMemberInfo(scope.row)">
                    {{ t('fields.memberInfo') }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click="transferRedirect(scope.row.loginName)"
                  >
                    {{ t('menu.Transfer') }}
                  </el-dropdown-item>
                  <el-dropdown-item @click="showEditTag(scope.row)">
                    {{ t('fields.editTag') }}
                  </el-dropdown-item>
                  <el-dropdown-item @click="showEditRemark(scope.row)">
                    {{ t('fields.remark') }}
                  </el-dropdown-item>
                  <el-dropdown-item @click="showDepositRecord(scope.row)">
                    {{ t('fields.depositRecord') }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click="showGameRecord(scope.row.loginName)"
                  >
                    {{ t('fields.betRecord') }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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
    :title="t('fields.memberInfo')"
    v-model="uiControl.infoDialogVisible"
    append-to-body
    width="1000px"
  >
    <el-form>
      <div style="display: flex; gap: 10px;">
        <el-form-item
          :label="t('fields.recordTime') + ' :'"
          style="width: 50%; margin-bottom: 0;"
        >
          <el-date-picker
            v-model="memberRequest.recordTime"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
            size="normal"
            class="input-small"
            type="daterange"
            range-separator=":"
            :start-placeholder="t('fields.startDate')"
            :end-placeholder="t('fields.endDate')"
            :shortcuts="shortcuts"
            :disabled-date="disabledDate"
            :editable="false"
            :clearable="false"
          />
        </el-form-item>
        <el-button
          icon="el-icon-search"
          type="primary"
          @click="showMemberInfo()"
          size="normal"
        >
          {{ $t('fields.search') }}
        </el-button>
      </div>
    </el-form>
    <div class="scrollable-container" v-loading="dialog.loading">
      <div class="info-container">
        <el-form label-suffix=" : ">
          <div class="info-row-container">
            <el-form-item :label="t('fields.loginName')">
              {{ memberInfo.loginName }}
            </el-form-item>
            <el-form-item :label="t('fields.status')">
              <el-tag
                v-if="memberInfo.status === 'NORMAL'"
                type="success"
                size="normal"
              >
                {{ t('member.status.normal') }}
              </el-tag>
              <el-tag
                v-if="memberInfo.status === 'FROZEN'"
                type="danger"
                size="normal"
              >
                {{ t('member.status.frozen') }}
              </el-tag>
              <el-tag v-if="memberInfo.status === null" type="info" size="normal">
                -
              </el-tag>
            </el-form-item>
            <el-form-item :label="t('fields.deposit')">
              {{ memberInfo.totalDeposit }}
            </el-form-item>
            <el-form-item :label="t('fields.withdraw')">
              {{ memberInfo.totalWithdraw }}
            </el-form-item>
            <el-form-item :label="t('fields.bonus')">
              {{ memberInfo.totalBonus }}
            </el-form-item>
          </div>
          <div class="info-row-container">
            <el-form-item :label="t('fields.rebate')">
              {{ memberInfo.totalRebate }}
            </el-form-item>
            <el-form-item :label="t('fields.validBet')">
              {{ memberInfo.totalValidBet }}
            </el-form-item>
            <el-form-item :label="t('fields.totalBet')">
              {{ memberInfo.totalBet }}
            </el-form-item>
            <el-form-item :label="t('fields.adjustAmount')">
              {{ memberInfo.totalAdjustment }}
            </el-form-item>
            <el-form-item :label="t('fields.winLoss')">
              {{ memberInfo.winLoss }}
            </el-form-item>
          </div>
          <div class="info-row-container">
            <el-form-item :label="t('fields.registerTime')">
              {{ memberInfo.regTime }}
            </el-form-item>
            <el-form-item :label="t('fields.ftdTime')">
              {{ memberInfo.ftdTime }}
            </el-form-item>
            <el-form-item :label="t('fields.transferRecord')">
              {{ memberInfo.transferRecord }}
            </el-form-item>
          </div>
          <div class="info-row-container">
            <el-form-item :label="t('fields.memberTag')">
              {{ memberInfo.tags }}
            </el-form-item>
          </div>
          <div class="info-row-container">
            <el-form-item :label="t('fields.remark')">
              {{ memberInfo.remark }}
            </el-form-item>
          </div>
        </el-form>
      </div>
      <el-table
        :data="memberInfo.memberBetRecordSummaryVOList"
      >
        <template #empty>
          <emptyComp />
        </template>
        <el-table-column :label="t('fields.sequence')" align="left">
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column :label="t('fields.platform')" align="left">
          <template #default="scope">
            {{ scope.row.platform + ' - ' + scope.row.gameType }}
          </template>
        </el-table-column>
        <el-table-column
          prop="validBet"
          :label="t('fields.validBet')"
          align="left"
        />
        <el-table-column
          prop="winLoss"
          :label="t('fields.winLoss')"
          align="left"
        />
      </el-table>
    </div>
  </el-dialog>
  <el-dialog
    :title="t('fields.editTag')"
    v-model="uiControl.tagDialogVisible"
    append-to-body
  >
    <el-form @submit.prevent>
      <el-form-item :label="t('fields.loginName')">
        <b v-if="uiControl.editType === 'One'">
          {{ selectedMember.loginName }}
        </b>
        <b v-else>{{ selectedMemberList.loginName.join(', ') }}</b>
      </el-form-item>
      <el-form-item :label="t('fields.memberTag')">
        <el-checkbox-group v-model="tagRequest.tags">
          <el-checkbox
            v-for="tag in assignTaglist"
            :key="tag.id"
            :label="tag.description"
          />
        </el-checkbox-group>
      </el-form-item>
    </el-form>

    <div class="dialog-footer">
      <el-button @click="uiControl.tagDialogVisible = false">
        {{ $t('fields.cancel') }}
      </el-button>
      <el-button type="primary" @click="submitTag()">
        {{ $t('fields.confirm') }}
      </el-button>
    </div>
  </el-dialog>
  <el-dialog
    :title="t('fields.editTag')"
    v-model="uiControl.remarkDialogVisible"
    append-to-body
  >
    <el-form @submit.prevent>
      <el-form-item :label="t('fields.loginName')">
        <b>{{ selectedMember.loginName }}</b>
      </el-form-item>
      <el-form-item :label="t('fields.remark')">
        <el-input
          v-model="selectedMember.remark"
          :rows="2"
          type="textarea"
          :placeholder="t('message.remarkMessage')"
        />
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="uiControl.remarkDialogVisible = false">
        {{ $t('fields.cancel') }}
      </el-button>
      <el-button type="primary" @click="submitRemark()">
        {{ $t('fields.confirm') }}
      </el-button>
    </div>
  </el-dialog>

  <el-dialog
    :title="t('fields.depositRecord')"
    v-model="uiControl.depositDialogVisible"
    width="900px"
    append-to-body
  >
    <el-form label-suffix=" : " style="margin-top: -20px;">
      <div class="info-row-container">
        <el-form-item :label="t('fields.loginName')">
          {{ memberDepositInfo.loginName }}
        </el-form-item>
        <el-form-item :label="t('fields.realName')">
          {{ memberDepositInfo.realName }}
        </el-form-item>
        <el-form-item :label="t('fields.registerTime')">
          {{ memberDepositInfo.regTime }}
        </el-form-item>
      </div>
      <el-table
        :data="memberDepositInfo.page.records"
        v-loading="memberDepositInfo.page.loading"
      >
        <template #empty>
          <emptyComp />
        </template>
        <el-table-column :label="t('fields.sequence')" align="left" width="50">
          <template #default="scope">
            {{ (depositRequest.current - 1) * 10 + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="serialNumber"
          :label="t('fields.serialNumber')"
          align="left"
        />
        <el-table-column
          prop="depositAmount"
          :label="t('fields.depositAmount')"
          align="left"
        >
          <template #default="scope">
            $
            <span
              v-formatter="{data: scope.row.depositAmount, type: 'money'}"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="depositDate"
          :label="t('fields.depositDate')"
          align="left"
        >
          <template #default="scope">
            <span v-if="scope.row.depositDate === null">-</span>
            <span
              v-if="scope.row.depositDate !== null"
              v-formatter="{
                data: scope.row.depositDate,
                formatter: 'YYYY/MM/DD HH:mm:ss',
                type: 'date',
              }"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="finishDate"
          :label="t('fields.finishDate')"
          align="left"
        >
          <template #default="scope">
            <span v-if="scope.row.finishDate === null">-</span>
            <span
              v-if="scope.row.finishDate !== null"
              v-formatter="{
                data: scope.row.finishDate,
                formatter: 'YYYY/MM/DD HH:mm:ss',
                type: 'date',
              }"
            />
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="t('fields.status')" align="left">
          <template #default="scope">
            <el-tag
              v-if="
                scope.row.status === 'SUCCESS' ||
                  scope.row.status === 'SUPPLEMENT_SUCCESS'
              "
              type="success"
              size="normal"
            >
              {{ t('depositStatus.' + scope.row.status) }}
            </el-tag>
            <el-tag
              v-else-if="scope.row.status === 'CLOSED'"
              type="danger"
              size="normal"
            >
              {{ t('depositStatus.' + scope.row.status) }}
            </el-tag>
            <el-tag
              v-else-if="scope.row.status === 'PENDING'"
              type="warning"
              size="normal"
            >
              {{ t('depositStatus.' + scope.row.status) }}
            </el-tag>
            <el-tag v-else type="info" size="normal">-</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        @current-change="changeDepositPage"
        layout="total, prev, pager, next"
        :total="memberDepositInfo.page.total"
        :page-size="depositRequest.size"
        :page-count="memberDepositInfo.page.pages"
        :current-page="depositRequest.current"
      />
    </el-form>
  </el-dialog>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useStore } from '@/store'
import moment from 'moment'
import {
  loadMemberSummary,
  loadMemberInfo,
  assignTag,
  assignRemark,
} from '../../../api/affiliate'
import { getAffiliateTagList } from '../../../api/affiliate-tag'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getMemberDepositRecords } from '../../../api/affiliate-deposit-record';
import emptyComp from '@/components/empty';

const store = useStore()
const { t } = useI18n()
const router = useRouter()
const startDate = new Date()
const defaultStartDate = convertDate(
  startDate.setTime(
    moment(startDate)
      .startOf('month')
      .format('x')
  )
)
const defaultEndDate = convertDate(new Date())
const tagList = reactive({
  list: [],
  description: [],
})
let assignTaglist = []
const table = ref(null)
const selected = reactive({
  tags: [],
})

const uiControl = reactive({
  infoDialogVisible: false,
  tagDialogVisible: false,
  remarkDialogVisible: false,
  depositDialogVisible: false,
  editBtn: true,
  editType: 'One',
})

const memberInfo = reactive({
  loginName: '',
  realName: '',
  status: '',
  totalDeposit: 0,
  totalWithdraw: 0,
  totalBonus: 0,
  totalRebate: 0,
  totalValidBet: 0,
  totalBet: 0,
  totalAdjustment: 0,
  winLoss: 0,
  regTime: '',
  ftdTime: '',
  transferRecord: 0,
  remark: '',
  memberBetRecordSummaryVOList: [],
})

const memberDepositInfo = reactive({
  loginName: '',
  realName: '',
  regTime: '',
  page: {
    pages: 0,
    records: [],
    loading: false,
    total: 0,
    totalDeposit: 0,
  },
})

const depositRequest = reactive({
  size: 10,
  current: 1,
  loginName: null,
})

const checkAll = ref(false)
const isIndeterminate = ref(false)
const unAssigned = reactive({
  id: -1,
  description: t('fields.unAssigned'),
})
const dialog = reactive({
  loading: false,
})

const shortcuts = [
  {
    text: t('fields.today'),
    value: () => {
      const end = new Date()
      const start = new Date()
      return [start, end]
    },
  },
  {
    text: t('fields.yesterday'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .subtract(1, 'days')
          .format('x')
      )
      end.setTime(
        moment(end)
          .subtract(1, 'days')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.thisWeek'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .startOf('isoWeek')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.lastWeek'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .subtract(1, 'weeks')
          .startOf('isoWeek')
          .format('x')
      )
      end.setTime(
        moment(end)
          .subtract(1, 'weeks')
          .endOf('isoWeek')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.thisMonth'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .startOf('month')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.lastMonth'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .subtract(1, 'months')
          .startOf('month')
          .format('x')
      )
      end.setTime(
        moment(end)
          .subtract(1, 'months')
          .endOf('month')
          .format('x')
      )
      return [start, end]
    },
  },
]

const request = reactive({
  regTime: null,
  recordTime: [defaultStartDate, defaultEndDate],
  loginName: null,
  realName: null,
  telephone: null,
  email: null,
  isBet: '-1',
  depositMinAmount: null,
  depositMaxAmount: null,
  size: 20,
  current: 1,
  memberTags: [],
})

const memberRequest = reactive({
  memberId: null,
  recordTime: [defaultStartDate, defaultEndDate],
})

const tagRequest = reactive({
  tags: [],
})

const selectedMember = reactive({
  id: null,
  loginName: null,
  remark: null,
})

const selectedMemberList = reactive({
  id: [],
  loginName: [],
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

function disabledDate(time) {
  return time.getTime() > new Date().getTime()
}

function resetQuery() {
  request.regTime = null
  request.recordTime = [defaultStartDate, defaultEndDate]
  request.loginName = null
  request.realName = null
  request.telephone = null
  request.email = null
  request.isBet = '-1'
  request.depositMinAmount = null
  request.depositMaxAmount = null
  selected.tags = []
  checkAll.value = false
}

async function loadAffiliateMembers() {
  selectedMemberList.id.length = 0
  selectedMemberList.loginName.length = 0
  table.value.clearSelection()
  uiControl.editBtn = true
  page.loading = true
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  if (request.regTime !== null) {
    if (request.regTime.length === 2) {
      query.regTime = request.regTime.join(',')
    }
  } else {
    query.regTime = null
  }
  if (request.recordTime !== null) {
    if (request.recordTime.length === 2) {
      query.recordTime = request.recordTime.join(',')
    }
  }
  query.siteId = store.state.user.siteId
  query.memberTypes = 'NORMAL,TEST'
  switch (query.isBet) {
    case '-1':
      query.isBet = null
      break
    case '1':
      query.isBet = true
      break
    case '0':
      query.isBet = false
      break
  }
  query.memberTags = tagList.list.filter(function(obj) {
    return selected.tags.includes(obj.description)
  })
  query.memberTags = query.memberTags
    .map(function(obj) {
      return obj.id
    })
    .join(',')
  const { data: ret } = await loadMemberSummary(store.state.user.id, query)

  page.pages = ret.pages
  page.records = ret.records
  page.loading = false
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page
    loadAffiliateMembers()
  }
}

function changeDepositPage(page) {
  if (depositRequest.current >= 1) {
    depositRequest.current = page
    loadDepositRecords()
  }
}

function formatTag(tags) {
  if (tags.length > 0) {
    tags = tagList.list.filter(function(obj) {
      return tags.includes(obj.id)
    })
    tags = tags
      .map(function(obj) {
        return obj.description
      })
      .join(',')
    return tags
  }
  return '-'
}

async function loadAllTags() {
  const { data: ret } = await getAffiliateTagList(store.state.user.id)
  tagList.list = ret
  assignTaglist = JSON.parse(JSON.stringify(ret))
  tagList.list.push(unAssigned)
  tagList.description = tagList.list.map(function(obj) {
    return obj.description
  })
}

function goToTagSetting() {
  router.push('/downline/tag-setting')
}

function transferRedirect(name) {
  router.push(`/affiliate/transfer?user=${name}`)
}

function showGameRecord(name) {
  router.push(`/downline/game-record?user=${name}`)
}

function showDepositRecord(member) {
  memberDepositInfo.loginName = member.loginName
  memberDepositInfo.realName = member.realName
  memberDepositInfo.regTime = member.regTime
  uiControl.depositDialogVisible = true
  depositRequest.current = 1
  depositRequest.loginName = member.loginName
  depositRequest.siteId = store.state.user.siteId
  loadDepositRecords()
}

async function loadDepositRecords() {
  memberDepositInfo.page.loading = true
  const { data: ret } = await getMemberDepositRecords(
    store.state.user.id,
    depositRequest
  )
  memberDepositInfo.page = ret
  memberDepositInfo.page.loading = false
}

function handleCheckAll(val) {
  selected.tags = val ? tagList.description : []
  isIndeterminate.value = false
}

function handleCheckedTags(value) {
  const checkedCount = value.length
  checkAll.value = checkedCount === tagList.description.length
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < tagList.description.length
}

async function showMemberInfo(row) {
  if (row) {
    uiControl.infoDialogVisible = true
    memberRequest.recordTime = [defaultStartDate, defaultEndDate]
    memberRequest.memberId = row.id
    memberInfo.tags = formatTag(row.tags)
    memberInfo.remark = row.remark
  }
  dialog.loading = true
  const { data: ret } = await loadMemberInfo(
    store.state.user.id,
    memberRequest.memberId,
    memberRequest.recordTime.join(',')
  )
  Object.entries(ret).forEach(([key, value]) => {
    if (value) {
      memberInfo[key] = value
    } else {
      memberInfo[key] = 0
    }
  })
  dialog.loading = false
}

function showEditTag(member) {
  selectedMember.id = member.id
  selectedMember.loginName = member.loginName
  tagRequest.tags = assignTaglist.filter(function(obj) {
    return member.tags.includes(obj.id)
  })
  tagRequest.tags = tagRequest.tags.map(function(obj) {
    return obj.description
  })
  uiControl.editType = 'One'
  uiControl.tagDialogVisible = true
}

function showBatchEditTag() {
  tagRequest.tags = []
  uiControl.editType = 'Many'
  uiControl.tagDialogVisible = true
}

async function submitTag() {
  tagRequest.tags = assignTaglist.filter(function(obj) {
    return tagRequest.tags.includes(obj.description)
  })
  tagRequest.tags = tagRequest.tags.map(function(obj) {
    return obj.id
  })
  if (uiControl.editType === 'One') {
    await assignTag(store.state.user.id, selectedMember.id, tagRequest.tags)
    selectedMember.id = null
    selectedMember.loginName = null
  } else {
    await assignTag(
      store.state.user.id,
      selectedMemberList.id.join(','),
      tagRequest.tags
    )
  }
  ElMessage({ message: t('message.editSuccess'), type: 'success' })
  await loadAffiliateMembers()
  uiControl.tagDialogVisible = false
}

function handleSelectionChange(val) {
  selectedMemberList.loginName = val.map(function(item) {
    return item.loginName
  })
  selectedMemberList.id = val.map(function(item) {
    return item.id
  })
  if (selectedMemberList.id.length === 0) {
    uiControl.editBtn = true
  } else {
    uiControl.editBtn = false
  }
}

function showEditRemark(member) {
  selectedMember.id = member.id
  selectedMember.loginName = member.loginName
  uiControl.remarkDialogVisible = true
  selectedMember.remark = member.remark
}

async function submitRemark() {
  await assignRemark(
    store.state.user.id,
    selectedMember.id,
    selectedMember.remark
  )
  ElMessage({ message: t('message.editSuccess'), type: 'success' })
  await loadAffiliateMembers()
  uiControl.remarkDialogVisible = false
}

onMounted(() => {
  loadAllTags()
  loadAffiliateMembers()
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
  margin: 0px 20px;
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
  .el-row .el-col {
    display: flex;
    margin-bottom: 10px;
  }
}

.number-division {
  display: inline-flex;
  align-items: center;
}

.amount-input input {
  border: 5px solid red;
}

.input-min {
  width: 55%;

  :deep(.el-input-group__append) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
}

.el-input-group {
  vertical-align: unset;
}
.input-max {
  width: 40%;

  :deep(.el-input__inner) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}

:deep(.el-date-editor.el-input__inner) {
  width: 100%;
}

.scrollable-container {
  max-height: 600px;
  overflow-y: auto;
}

.info-container {
  border-radius: 5px;
  border: 1px solid #f2f2f6;
  padding: 0 20px;
  margin: 24px 0;
}

.info-row-container {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .el-form-item {
    flex: 1;
    margin-bottom: 0;
  }
}

.el-form-item {
  flex: 1;
  margin-bottom: 0;
}

.info-row-container:not(:first-child) {
  border-top: 1px solid #f2f2f6;
}

.dialog-footer {
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .memberTag {
    position: absolute;
    top: -20px;
    right: 0;
  }
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
