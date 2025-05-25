<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input
          v-model="request.loginName"
          size="small"
          style="width: 200px;"
          :placeholder="t('fields.loginName')"
        />
        <el-input
          v-model="request.telephone"
          size="small"
          style="width: 200px; margin-left: 5px;"
          :placeholder="t('fields.telephone')"
        />
        <el-input
          v-model="request.affiliateCode"
          size="small"
          style="width: 200px; margin-left: 5px;"
          :placeholder="t('fields.affiliateCode')"
        />
        <el-select
          clearable
          v-model="request.affiliateStatus"
          size="small"
          :placeholder="t('fields.state')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.memberState"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="request.belongType"
          size="small"
          :placeholder="t('fields.belongType')"
          class="filter-item"
          style="width: 120px;margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.belongType"
            :key="item.id"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <!-- <el-select
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
        </el-select> -->
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadAffiliates()"
        >
          {{ t('fields.search') }}
        </el-button>
        <el-button size="mini" type="warning" @click="resetQuery()">
          {{ t('fields.reset') }}
        </el-button>
      </div>
      <div class="btn-group">
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-permission="['sys:affiliate:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          size="mini"
          type="primary"
          v-permission="['sys:affiliate:export']"
          @click="requestExportExcel"
        >
          {{ t('fields.requestExportToExcel') }}
        </el-button>
      </div>
    </div>
    <el-card class="box-card" shadow="never" style="margin-top: 40px">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.affiliateList') }}</span>
        </div>
      </template>

      <el-dialog
        :title="t('fields.exportToExcel')"
        v-model="uiControl.messageVisible"
        append-to-body
        width="500px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <span>{{ t('message.requestExportToExcelDone1') }}</span>
        <router-link :to="`/site-management/download-manager`">
          <el-link type="primary">
            {{ t('menu.DownloadManager') }}
          </el-link>
        </router-link>
        <span>{{ t('message.requestExportToExcelDone2') }}</span>
      </el-dialog>

      <el-dialog
        :title="uiControl.dialogTitle"
        v-model="uiControl.dialogVisible"
        append-to-body
        width="580px"
      >
        <el-form
          v-if="uiControl.dialogType === 'CREATE'"
          ref="memberForm"
          :model="form"
          :rules="formRules"
          :inline="true"
          size="small"
          label-width="150px"
        >
          <el-form-item :label="t('fields.site')" prop="siteId">
            <el-select
              v-model="form.siteId"
              size="small"
              :placeholder="t('fields.site')"
              class="filter-item"
              style="width: 350px;"
              default-first-option
              @focus="loadSites"
              @change="displayShareRatio"
            >
              <el-option
                v-for="item in siteList.list"
                :key="item.id"
                :label="item.siteName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('fields.affiliateCode')" prop="affiliateCode">
            <el-input
              v-model="form.affiliateCode"
              style="width: 350px;"
              maxlength="11"
            />
          </el-form-item>
          <el-form-item :label="t('fields.affiliateCode') + ' ' + t('fields.self')" prop="codePersonalAffiliate" v-if="isKorea(form.siteId)">
            <el-input
              v-model="form.codePersonalAffiliate"
              style="width: 350px;"
              maxlength="6"
              @input="handleInput"
            />
          </el-form-item>
          <el-form-item :label="t('fields.affiliateLevel')" prop="affiliateLevel" v-if="isPK4(form.siteId)">
            <el-select
              v-model="form.affiliateLevel"
              size="small"
              :placeholder="t('fields.affiliateLevel')"
              class="filter-item"
              style="width: 350px"
            >
              <el-option
                v-for="item in uiControl.affiliateLevel"
                :key="item.key"
                :label="item.displayName"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="t('fields.commissionModel')"
            prop="commissionModel"
          >
            <el-select
              v-model="form.commissionModel"
              size="small"
              :placeholder="t('fields.commissionModel')"
              class="filter-item"
              style="width: 350px"
              @change="displayShareRatio"
            >
              <el-option
                v-for="item in uiControl.commissionModel"
                :key="item.key"
                :label="item.displayName"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('fields.timeType')" prop="timeType" v-if="!isPK4(form.siteId)">
            <el-select
              v-model="form.timeType"
              size="small"
              :placeholder="t('fields.timeType')"
              class="filter-item"
              style="width: 350px"
            >
              <el-option
                v-for="item in uiControl.timeType"
                :key="item.key"
                :label="item.displayName"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('fields.loginName')" prop="loginName">
            <el-input
              v-model="form.loginName"
              style="width: 350px;"
              maxlength="11"
            />
          </el-form-item>
          <el-form-item :label="t('fields.password')" prop="password">
            <el-input
              v-model="form.password"
              type="password"
              style="width: 350px;"
              maxlength="11"
            />
          </el-form-item>
          <el-form-item
            :label="t('fields.reenterPassword')"
            prop="reEnterPassword"
          >
            <el-input
              v-model="form.reEnterPassword"
              type="password"
              style="width: 350px;"
              maxlength="11"
            />
          </el-form-item>
          <el-form-item :label="t('fields.telephone')" prop="telephone">
            <el-input
              v-model="form.telephone"
              style="width: 350px;"
              maxlength="20"
            />
          </el-form-item>
          <el-form-item :label="t('fields.email')" prop="email">
            <el-input
              v-model="form.email"
              style="width: 350px;"
              maxlength="50"
            />
          </el-form-item>
          <el-form-item
            :label="t('fields.commission')"
            prop="commission"
            v-loading="uiControl.shareRatioSettingLoading"
          >
            <el-input
              v-model="form.commission"
              style="width: 350px;"
              :maxlength="uiControl.commissionMax"
              @keypress="restrictCommissionDecimalInput($event)"
            />
          </el-form-item>
          <div v-if="!uiControl.shareRatioSettingVisible">
            <el-form-item :label="t('fields.revenueShare')" prop="revenueShare">
              <el-input
                v-model="form.revenueShare"
                style="width: 350px;"
                :maxlength="uiControl.reveunueMax"
                @keypress="restrictRevenueDecimalInput($event)"
              />
            </el-form-item>
          </div>
          <el-form-item
            v-else
            :label="t('fields.shareRatio')"
            prop="shareRatio"
          >
            <div
              v-for="item in shareRatioList.list"
              :key="item.code"
              style="width: 350px; display: flex; margin-bottom:5px;"
            >
              <span>{{ t('affiliateShareRatio.' + item.code) }}</span>
              <el-input
                v-model="item.value"
                style=" width:100px; margin-left: auto; order: 2"
              />
            </div>
          </el-form-item>
          <el-form-item :label="t('fields.belongType')" prop="belongType">
            <el-select
              v-model="form.belongType"
              size="small"
              :placeholder="t('fields.belongType')"
              class="filter-item"
              style="width: 350px"
            >
              <el-option
                v-for="item in uiControl.belongType"
                :key="item.key"
                :label="item.displayName"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <div class="dialog-footer">
            <el-button @click="closeDialog">
              {{ t('fields.cancel') }}
            </el-button>
            <el-button type="primary" @click="addAffiliate">
              {{ t('fields.confirm') }}
            </el-button>
          </div>
        </el-form>
        <el-form
          v-if="uiControl.dialogType === 'DISABLE'"
          ref="freezeMemberForm"
          :model="freezeForm"
          :rules="freezeFormRules"
          :inline="true"
          size="small"
          label-width="150px"
        >
          <el-form-item :label="t('fields.disableType')" prop="freezeType">
            <el-select
              v-model="freezeForm.freezeType"
              size="small"
              :placeholder="t('fields.disableType')"
              class="filter-item"
              style="width: 350px;"
            >
              <el-option
                v-for="item in freezeType.list"
                :key="item.key"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('fields.reason')" prop="reason">
            <el-select
              v-model="freezeForm.reason"
              size="small"
              :placeholder="t('fields.reason')"
              class="filter-item"
              style="width: 350px;"
            >
              <el-option
                v-for="item in freezeReason.list"
                :key="item.key"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="t('fields.remark')"
            prop="remark"
            :required="freezeForm.reason === 'Others'"
          >
            <el-input
              type="textarea"
              v-model="freezeForm.remark"
              :rows="6"
              style="width: 350px;"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
          <div class="dialog-footer">
            <el-button @click="uiControl.dialogVisible = false">
              {{ t('fields.cancel') }}
            </el-button>
            <el-button type="primary" @click="freeze">
              {{ t('fields.confirm') }}
            </el-button>
          </div>
        </el-form>
        <el-form
          v-if="uiControl.dialogType === 'RISK'"
          ref="updateRiskForm"
          :model="riskForm"
          :inline="true"
          size="small"
          label-width="150px"
        >
          <el-form-item :label="t('fields.riskLevel')" prop="risk">
            <el-select
              v-model="riskForm.risk"
              size="small"
              :placeholder="t('fields.riskLevel')"
              class="filter-item"
              style="width: 315px;"
              default-first-option
              @change="populateRiskColor"
              @focus="loadRiskLevels"
            >
              <el-option
                v-for="item in riskList.list"
                :key="item.id"
                :label="item.levelName"
                :value="item.id"
              />
            </el-select>
            <span
              class="level-color"
              :style="{backgroundColor: selectedRiskColor.levelColor}"
            />
          </el-form-item>
          <div class="dialog-footer">
            <el-input
              v-model="riskForm.id"
              style="width: 350px;"
              maxlength="50"
              type="hidden"
            />
            <el-button @click="uiControl.dialogVisible = false">
              {{ t('fields.cancel') }}
            </el-button>
            <el-button type="primary" @click="performUpdate()">
              {{ t('fields.confirm') }}
            </el-button>
          </div>
        </el-form>
      </el-dialog>
      <el-table
        :data="page.records"
        ref="table"
        v-loading="page.loading"
        row-key="id"
        size="mini"
        :resizable="true"
        highlight-current-row
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        :empty-text="t('fields.noData')"
      >
        <el-table-column
          prop="loginName"
          :label="t('fields.loginName')"
          width="180"
        >
          <template
            #default="scope"
            v-if="hasPermission(['sys:affiliate:detail'])"
          >
            <router-link :to="`details/${scope.row.id}?site=${request.siteId}`">
              <el-link type="primary">{{ scope.row.loginName }}</el-link>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="affiliateCode"
          :label="t('fields.affiliateCode')"
          width="150"
        >
          <template #default="scope">
            <span v-if="scope.row.affiliateCode === null">-</span>
            <span v-if="scope.row.affiliateCode !== null">
              {{ scope.row.affiliateCode }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="affiliateLevel"
          :label="t('fields.affiliateLevel')"
          width="150"
        >
          <template #default="scope">
            <span v-if="scope.row.affiliateLevel === null">-</span>
            <span v-if="scope.row.affiliateLevel !== null">
              {{ scope.row.affiliateLevel }}
            </span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="commission" :label="t('fields.commission')" width="120">
          <template #default="scope">
            <span v-if="scope.row.commission === null">0 %</span>
            <span v-if="scope.row.commission !== null">{{ scope.row.commission * 100 }} %</span>
          </template>
        </el-table-column>
        <el-table-column prop="revenueShare" :label="t('fields.revenueShare')" width="120">
          <template #default="scope">
            <span v-if="scope.row.revenueShare === null">0 %</span>
            <span v-if="scope.row.revenueShare !== null">{{ scope.row.revenueShare * 100 }} %</span>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="downlineMember"
          :label="t('fields.totalDownlineMembers')"
          width="160"
        >
          <template #default="scope">
            <span v-if="scope.row.downlineMember === null">0</span>
            <span v-if="scope.row.downlineMember !== null">
              {{ scope.row.downlineMember }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="downlineAffiliate"
          :label="t('fields.totalDownlineAffiliates')"
          width="160"
        >
          <template #default="scope">
            <span v-if="scope.row.downlineAffiliate === null">0</span>
            <span v-if="scope.row.downlineAffiliate !== null">
              {{ scope.row.downlineAffiliate }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="affiliateStatus"
          :label="t('fields.affiliateStatus')"
          width="120"
        >
          <template #default="scope">
            <el-tag v-if="scope.row.affiliateStatus === 'APPLY'" size="mini">
              {{ scope.row.affiliateStatus }}
            </el-tag>
            <el-tag
              v-if="scope.row.affiliateStatus === 'NORMAL'"
              type="success"
              size="mini"
            >
              {{ scope.row.affiliateStatus }}
            </el-tag>
            <el-tag
              v-if="scope.row.affiliateStatus === 'DISABLE'"
              type="danger"
              size="mini"
            >
              {{ scope.row.affiliateStatus }}
            </el-tag>
            <el-tag
              v-if="scope.row.affiliateStatus === null"
              type="info"
              size="mini"
            >
              -
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="site" :label="t('fields.site')" width="120">
          <template #default="scope">
            <span v-if="scope.row.site === null">-</span>
            <span v-if="scope.row.site !== null">{{ scope.row.site }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="belongType"
          :label="t('fields.belongType')"
          width="120"
        >
          <template #default="scope">
            <span v-if="scope.row.belongType === 'OFFICIAL'">
              {{ t('affiliate.belongType.OFFICIAL') }}
            </span>
            <span v-if="scope.row.belongType === 'PACKAGE'">
              {{ t('affiliate.belongType.PACKAGE') }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="balance"
          :label="t('fields.balance')"
          width="120"
        >
          <template #default="scope">
            $
            <span v-formatter="{data: scope.row.balance, type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column
          prop="commissionBalance"
          :label="t('fields.commissionBalance')"
          width="120"
        >
          <template #default="scope">
            $
            <span v-formatter="{data: scope.row.commissionBalance, type: 'money'}" />
          </template>
        </el-table-column>
        <el-table-column
          prop="regTime"
          :label="t('fields.registerTime')"
          width="150"
        >
          <template #default="scope">
            <span v-if="scope.row.regTime === null">-</span>
            <span
              v-if="scope.row.regTime !== null"
              v-formatter="{
                data: scope.row.regTime,
                timeZone: timeZone,
                type: 'date',
              }"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="approveBy"
          :label="t('fields.approveBy')"
          width="160"
        >
          <template #default="scope">
            <span v-if="scope.row.approveBy === null">-</span>
            <span v-if="scope.row.approveBy !== null">
              {{ scope.row.approveBy }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="recycleMoney"
          :label="t('fields.recycleMoney')"
          width="150"
          v-if="isKorea(request.siteId)"
        >
          <template #default="scope">
            <el-switch
              :disabled="!isKorea(scope.row.siteId)"
              v-model="scope.row.recycleMoney"
              active-color="#409EFF"
              inactive-color="#F56C6C"
              @change="
                changeRecycleMoneyState(scope.row.id, scope.row.recycleMoney)
              "
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="displayAmount"
          :label="t('fields.displayAmount')"
          width="150"
          v-if="isKorea(request.siteId)"
        >
          <template #default="scope">
            <el-switch
              :disabled="!isKorea(scope.row.siteId)"
              v-model="scope.row.displayAmount"
              active-color="#409EFF"
              inactive-color="#F56C6C"
              @change="
                changeDisplayAmountState(scope.row.id, scope.row.displayAmount)
              "
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="t('fields.operate')"
          align="center"
          fixed="right"
          width="240"
        >
          <template #default="scope">
            <el-button
              icon="el-icon-check"
              size="mini"
              type="success"
              v-show="scope.row.affiliateStatus === 'APPLY'"
              v-permission="['sys:affiliate:update:approval']"
              @click="approve(scope.row)"
            >
              {{ t('fields.approve') }}
            </el-button>
            <el-button
              icon="el-icon-close"
              size="mini"
              type="danger"
              v-show="scope.row.affiliateStatus === 'NORMAL'"
              v-permission="['sys:affiliate:update:approval']"
              @click="showDialog('DISABLE', scope.row)"
            >
              {{ t('fields.disable') }}
            </el-button>

            <el-button
              size="mini"
              type="success"
              v-permission="['sys:affiliate:update:risk']"
              @click="showDialog('RISK', scope.row)"
            >
              {{ t('fields.riskLevel') }}
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
  </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { email, required, size } from '../../../utils/validate'
import {
  getAffiliates,
  getParentAffiliates,
  getAffiliatesForExport,
  registerAffiliate,
  listApproveAffiliate,
  listDisableAffiliate,
  updateRecycleMoneyState,
  updateDisplayAmountState,
} from '../../../api/member-affiliate'
import { updateRisk } from '../../../api/member'
import { getSiteListSimple } from '../../../api/site'
import { selectList } from '../../../api/risk-level'
import { getConfigListByGroup } from '../../../api/config'
import { hasPermission } from '../../../utils/util'
import { notEmpty } from '../../../utils/common'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { useI18n } from 'vue-i18n'
import moment from 'moment/moment'
import { isKorea, isIndiaSite, isPK4 } from '@/utils/site'

const { t } = useI18n()
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const LOGIN_USER_NAME = computed(() => store.state.user.name)
const site = ref(null)
const memberForm = ref(null)
const freezeMemberForm = ref(null)
const updateRiskForm = ref(null)
const table = ref(null)
const siteList = reactive({
  list: [],
})
const riskList = reactive({
  list: [],
})
const shareRatioList = reactive({
  list: [],
})
const selectedRiskColor = reactive({
  levelColor: null,
})

let timeZone = null
const freezeType = reactive({
  list: [
    { key: 1, name: 'NORMAL', value: 'NORMAL' },
    { key: 2, name: 'TEMPORARY', value: 'TEMPORARY' },
    { key: 3, name: 'PERMANENT', value: 'PERMANENT' },
  ],
})

const freezeReason = reactive({
  list: [
    { key: 1, name: 'Game Violation', value: 'Game Violation' },
    { key: 2, name: 'Member Request', value: 'Member Request' },
    { key: 3, name: 'Others', value: 'Others' },
  ],
})

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  searchDialogVisible: false,
  searchDialogTitle: t('fields.advancedSearch'),
  memberState: [
    { key: 1, displayName: 'ALL', value: null },
    { key: 2, displayName: 'APPLY', value: 'APPLY' },
    { key: 3, displayName: 'NORMAL', value: 'NORMAL' },
    { key: 4, displayName: 'DISABLE', value: 'DISABLE' },
  ],
  colors: [
    { color: '#f56c6c', percentage: 30 },
    { color: '#e6a23c', percentage: 70 },
    { color: '#5cb87a', percentage: 100 },
  ],
  affiliateLevel: [
    // { key: 1, displayName: 'AFFILIATE', value: 'AFFILIATE' },
    { key: 2, displayName: t('fields.pk4_super_affiliate'), value: 'SUPER_AFFILIATE' },
    { key: 3, displayName: t('fields.pk4_master_affiliate'), value: 'MASTER_AFFILIATE' },
    // { key: 4, displayName: 'CHIEF AFFILIATE', value: 'CHIEF_AFFILIATE' },
  ],
  commissionModel: [
    { key: 1, displayName: 'NORMAL', value: 'NORMAL' },
    { key: 2, displayName: 'SIMPLE', value: 'SIMPLE' },
    { key: 3, displayName: 'DETAILS', value: 'DETAILS' },
  ],
  timeType: [
    { key: 1, displayName: 'MONTHLY', value: 'MONTHLY' },
    { key: 2, displayName: 'WEEKLY', value: 'WEEKLY' },
  ],
  belongType: [
    {
      key: 1,
      displayName: t('affiliate.belongType.OFFICIAL'),
      value: 'OFFICIAL',
    },
    {
      key: 2,
      displayName: t('affiliate.belongType.PACKAGE'),
      value: 'PACKAGE',
    },
  ],
  messageVisible: false,
  commissionMax: 2,
  revenueMax: 2,
  shareRatioSettingVisible: false,
  shareRatioSettingLoading: false,
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const request = reactive({
  size: 30,
  current: 1,
  loginName: null,
  telephone: null,
  affiliateStatus: null,
  affiliateCode: null,
  siteId: null,
  belongType: null,
})

const form = reactive({
  id: null,
  loginName: null,
  password: null,
  reEnterPassword: null,
  telephone: null,
  email: null,
  siteId: null,
  affiliateLevel: null,
  affiliateCode: null,
  commission: 0,
  revenueShare: 0,
  commissionModel: null,
  timeType: null,
  belongType: null,
  shareRatio: null,
  codePersonalAffiliate: null,
})

const freezeForm = reactive({
  id: null,
  freezeType: null,
  reason: null,
  remark: null,
  site: null,
})

const riskForm = reactive({
  risk: null,
})

const validatePassword = (rule, value, callback) => {
  if (value !== '' && form.reEnterPassword !== '') {
    memberForm.value.validateField('reEnterPassword')
  }
  callback()
}

const validateReEnterPassword = (rule, value, callback) => {
  if (value !== form.password) {
    callback(new Error(t('message.twoPasswordNotMatch')))
  }
  callback()
}

const validateCommission = (rule, value, callback) => {
  if (value !== '' && (form.commission < 0 || form.commission > 1)) {
    callback(new Error(t('message.validateCommissionFormat')))
  }
  callback()
}

const validateShareRatio = (rule, value, callback) => {
  if (form.commissionModel === 'DETAILS') {
    shareRatioList.list.forEach(item => {
      if (item.value === '' || item.value < 0 || item.value > 1) {
        callback(new Error(t('message.validateShareRatioFormat')))
      }
    })
  }
  callback()
}

const validateRevenue = (rule, value, callback) => {
  if (value !== '' && (form.revenueShare < 0 || form.revenueShare > 1)) {
    callback(new Error(t('message.validateRevenueShareFormat')))
  }
  callback()
}

function restrictCommissionDecimalInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if ((charCode < 48 || charCode > 57) && charCode !== 46) {
    event.preventDefault()
  }

  if (
    form.commission !== null &&
    form.commission.toString().indexOf('.') > -1
  ) {
    if (charCode === 46) {
      event.preventDefault()
    }
    uiControl.commissionMax = 4
  } else if (form.commission === '1') {
    uiControl.commissionMax = 1
  } else {
    uiControl.commissionMax = 2
  }
}

function restrictRevenueDecimalInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if ((charCode < 48 || charCode > 57) && charCode !== 46) {
    event.preventDefault()
  }

  if (
    form.revenueShare !== null &&
    form.revenueShare.toString().indexOf('.') > -1
  ) {
    if (charCode === 46) {
      event.preventDefault()
    }
    uiControl.revenueMax = 4
  } else if (form.revenueShare === '1') {
    uiControl.revenueMax = 1
  } else {
    uiControl.revenueMax = 2
  }
}

const formRules = reactive({
  // affiliateLevel: [required(t('message.validateAffiliateLevelRequired'))],
  loginName: [
    required(t('message.validateLoginNameRequired')),
    size(6, 12, t('message.validateLoginNameSize')),
    {
      required: true,
      pattern: /^[a-zA-Z0-9_][a-zA-Z0-9_]*$/,
      message: t('message.validateLoginNameNoSpecialCharacter'),
      trigger: 'blur',
    },
  ],
  password: [
    required(t('message.validatePasswordRequired')),
    size(6, 12, t('message.validatePasswordSize')),
    { validator: validatePassword, trigger: 'blur' },
  ],
  reEnterPassword: [
    required(t('message.validateReenterPasswordRequired')),
    { validator: validateReEnterPassword, trigger: 'blur' },
  ],
  telephone: [required(t('message.validateTelephoneRequired'))],
  email: [
    required(t('message.validateEmailRequired')),
    email(t('message.validateEmailFormat')),
  ],
  siteId: [required(t('message.validateSiteRequired'))],
  commission: [
    required(t('message.validateCommissionRequired')),
    { validator: validateCommission, trigger: 'blur' },
  ],
  revenueShare: [{ validator: validateRevenue, trigger: 'blur' }],
  commissionModel: [required(t('message.validateCommissionModelRequired'))],
  timeType: [required(t('message.validateTimeTypeRequired'))],
  shareRatio: [{ validator: validateShareRatio, trigger: 'blur' }],
  codePersonalAffiliate: [
    {
      min: 6,
      max: 6,
      message: t('message.required_6_digits_code'),
      trigger: 'change',
    },
    {
      pattern: /^[a-zA-Z1-9][a-zA-Z0-9]*$/,
      message: t('message.required_only_digits_and_alphabet'),
      trigger: 'blur',
    },
  ]
})

const freezeFormRules = reactive({
  freezeType: [required(t('message.validateFreezeTypeRequired'))],
  reason: [required(t('message.validateReasonRequired'))],
})

function resetQuery() {
  request.loginName = null
  request.telephone = null
  request.affiliateStatus = null
  request.affiliateCode = null
  request.siteId = store.state.user.siteId
  request.belongType = null
  uiControl.searchDialogVisible = false
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

async function loadAffiliates() {
  page.loading = true
  uiControl.searchDialogVisible = false
  const query = checkQuery()
  let result = {}
  if (
    notEmpty(request.loginName) ||
    notEmpty(request.affiliateStatus) ||
    notEmpty(request.affiliateCode) ||
    (request.siteId !== null && request.siteId !== '')
  ) {
    result = await getParentAffiliates(query)
  } else {
    result = await getAffiliates(query)
  }

  page.pages = result.data.pages
  page.records = result.data.records
  timeZone = siteList.list.find(e => e.id === request.siteId).timeZone
  page.loading = false
}

async function requestExportExcel() {
  const query = checkQuery()
  query.requestBy = store.state.user.name
  query.requestTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  const { data: ret } = await getAffiliatesForExport(query)
  if (ret) {
    uiControl.messageVisible = true
  }
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page
    loadAffiliates()
  }
}

function showDialog(type, affiliate) {
  if (type === 'CREATE') {
    if (memberForm.value) {
      memberForm.value.resetFields()
    }
    form.siteId = store.state.user.siteId
    form.affiliateLevel = uiControl.affiliateLevel[0].value
    form.commissionModel = uiControl.commissionModel[0].value
    form.timeType = uiControl.timeType[0].value
    form.belongType = uiControl.belongType[0].value
    uiControl.dialogTitle = t('fields.addAffiliate')
  } else if (type === 'DISABLE') {
    if (freezeMemberForm.value) {
      freezeMemberForm.value.resetFields()
    }
    freezeForm.id = affiliate.id
    freezeForm.site = request.siteId
    freezeForm.freezeType = freezeType.list[0].value
    freezeForm.reason = freezeReason.list[0].value
    uiControl.dialogTitle = t('fields.disableAffiliate')
  } else if (type === 'RISK') {
    if (updateRiskForm.value) {
      updateRiskForm.value.resetFields()
    }
    riskForm.id = affiliate.id
    if (affiliate.riskLevel) {
      const risk = riskList.list.find(r => r.levelName === affiliate.riskLevel)
      riskForm.risk = risk.id
      selectedRiskColor.levelColor = risk.levelColor
    } else {
      riskForm.risk = riskList.list[0].id
      selectedRiskColor.levelColor = riskList.list[0].levelColor
    }
    uiControl.dialogTitle = t('fields.updateRiskLevel')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function closeDialog() {
  uiControl.shareRatioSettingVisible = false
  uiControl.dialogVisible = false
}

function addAffiliate() {
  memberForm.value.validate(async valid => {
    if (valid) {
      if (form.commissionModel === 'DETAILS') {
        // join share ratio by comma
        form.shareRatio = shareRatioList.list
          .map(item => item.code + ':' + item.value)
          .join(',')
      }
      await registerAffiliate(form)
      uiControl.dialogVisible = false
      ElMessage({
        message:
          isIndiaSite(form.siteId)
            ? t('message.registerSuccessInd')
            : t('message.registerSuccess'),
        type: 'success',
      })
      if (page.records.length !== 0) {
        await loadAffiliates()
      }
    }
  })
}

function handleInput() {
  form.codePersonalAffiliate = form.codePersonalAffiliate.toUpperCase();
}

async function performUpdate() {
  console.log(riskForm.id)
  updateRiskForm.value.validate(async valid => {
    if (valid) {
      await updateRisk(riskForm.id, riskForm.risk, request.siteId)
      uiControl.dialogVisible = false
      ElMessage({
        message: t('message.updateRiskLevelSuccess'),
        type: 'success',
      })
      if (page.records.length !== 0) {
        await loadAffiliates()
      }
    }
  })
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

const loadRiskLevels = async () => {
  const { data: risk } = await selectList({ siteId: request.siteId })
  riskList.list = risk
}

const populateRiskColor = () => {
  const risk = riskList.list.find(r => r.id === riskForm.risk)
  selectedRiskColor.levelColor = risk.levelColor
}

async function approve(affiliate) {
  await listApproveAffiliate(affiliate.id, LOGIN_USER_NAME.value)
  await loadAffiliates()
  ElMessage({ message: t('message.affiliateApproved'), type: 'success' })
  page.loading = false
}

function freeze() {
  freezeMemberForm.value.validate(async valid => {
    if (valid) {
      await listDisableAffiliate(freezeForm.id, freezeForm)
      await loadAffiliates()
      uiControl.dialogVisible = false
      ElMessage({ message: t('message.affiliateDisabled'), type: 'success' })
    }
  })
}

function displayShareRatio() {
  if (form.commissionModel === 'DETAILS') {
    uiControl.shareRatioSettingVisible = true
    uiControl.shareRatioSettingLoading = true
    getConfigListByGroup('AGENT_SHARE_RATIO', form.siteId).then(res => {
      shareRatioList.list = JSON.parse(JSON.stringify(res.data))
    })
    uiControl.shareRatioSettingLoading = false
  } else {
    uiControl.shareRatioSettingVisible = false
  }
}

async function changeRecycleMoneyState(id, state) {
  await updateRecycleMoneyState(id, state)
}

async function changeDisplayAmountState(id, state) {
  await updateDisplayAmountState(id, state)
}

onMounted(async () => {
  await loadSites()
  request.siteId = store.state.user.siteId
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  }

  await loadRiskLevels()
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

.btn-group {
  margin-top: 15px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.el-progress--line {
  margin-left: 10px;
  margin-bottom: 10px;
  width: 430px;
}

.el-result {
  padding: 0;
}

:deep(.el-table__row:not([class*='el-table__row--level-'])) {
  td:first-child {
    padding-left: 23px;
  }
}

.level-color {
  width: 30px;
  height: 30px;
  display: inline-block;
  vertical-align: middle;
  margin-left: 5px;
}
</style>
