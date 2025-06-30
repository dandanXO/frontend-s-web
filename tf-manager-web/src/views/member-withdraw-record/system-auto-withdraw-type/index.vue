<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <!-- <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
          @change="handleChangeSite()"
        >
          <el-option
            v-for="item in list.sites"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select> -->
      </div>
      <div class="btn-group">
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-permission="['sys:systemautowithdraw:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-close"
          size="mini"
          type="danger"
          v-permission="['sys:systemautowithdraw:update']"
          @click="disableAll()"
        >
          {{ t('fields.disableAll') }}
        </el-button>
      </div>
    </div>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="1000px"
    >
      <el-form
        ref="autoPaymentForm"
        v-loading="uiControl.dialogLoading"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.payTypeName')" :required="!uiControl.isShowReviewRule" prop="paymentTypeCode" v-if="!uiControl.isShowReviewRule">
          <el-select
            filterable
            clearable
            v-model="form.paymentTypeCode"
            size="small"
            :placeholder="t('fields.pleaseChoose')"
            class="filter-item"
            style="width: 200px;"
          >
            <el-option
              v-for="item in list.filteredPayTypes"
              :key="item.id"
              :label="item.code"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.reviewRule')" prop="reviewRuleList" v-if="uiControl.isShowReviewRule">
          <el-table
            :data="form.reviewRuleList"
            style="width: 100%"
            size="small"
            :show-header="false"
            :border="false"
          >
            <el-table-column prop="variable" width="310">
              <template #default="scope">
                <template v-if="!scope.row.variable || scope.row.variable.trim() === ''">
                  <el-select
                    v-model="scope.row.variable"
                    size="small"
                    filterable
                    :placeholder="t('fields.pleaseChoose')"
                    style="width: 300px;"
                  >
                    <el-option
                      v-for="item in reviewRuleTypeList.list.filter(x => {
                        if ([16, 17, 18].includes(x.key)) {
                          const hasPlatformRule = form.reviewRuleList.some(y => {
                            const ruleKey = reviewRuleTypeList.list.find(r => r.value === y.variable)?.key;
                            return [16, 17, 18].includes(ruleKey);
                          });
                          if (hasPlatformRule) {
                            return false;
                          }
                        }
                        return !form.reviewRuleList.some(y => y.variable === x.value);
                      })"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                      :disabled="form.reviewRuleList.some(y => y.variable === item.value)"
                    />
                  </el-select>
                </template>
                <template v-if="scope.row.variable && scope.row.variable.trim() !== ''">
                  <el-select
                    v-model="scope.row.variable"
                    size="small"
                    filterable
                    :placeholder="t('fields.pleaseChoose')"
                    style="width: 300px;"
                    disabled
                  >
                    <el-option
                      v-for="item in ruleType.list"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    />
                  </el-select>
                </template>
              </template>
            </el-table-column>
            <el-table-column prop="value" width="210">
              <template #default="scope">
                <template v-if="scope.row.variable && scope.row.variable.includes('financial')">
                  <el-select
                    v-model="scope.row.value"
                    size="small"
                    filterable
                    multiple
                    :placeholder="t('fields.pleaseChoose')"
                    style="width: 200px;"
                  >
                    <el-option
                      v-for="item in list.financials"
                      :key="item.level"
                      :label="item.name"
                      :value="item.level"
                    />
                  </el-select>
                </template>
                <template v-else-if="scope.row.variable && scope.row.variable.includes('vip')">
                  <el-select
                    v-model="scope.row.value"
                    size="small"
                    filterable
                    multiple
                    :placeholder="t('fields.pleaseChoose')"
                    style="width: 200px;"
                  >
                    <el-option
                      v-for="item in list.vips"
                      :key="item.level"
                      :label="item.name"
                      :value="item.level"
                    />
                  </el-select>
                </template>
                <template v-else-if="scope.row.variable && scope.row.variable.includes('risk')">
                  <el-select
                    v-model="scope.row.value"
                    size="small"
                    filterable
                    multiple
                    :placeholder="t('fields.pleaseChoose')"
                    style="width: 200px;"
                  >
                    <el-option
                      v-for="item in list.risks"
                      :key="item.id"
                      :label="item.levelName"
                      :value="item.id"
                    />
                  </el-select>
                </template>
                <template v-else-if="scope.row.variable && scope.row.variable.includes('betCountByPlatform')">
                  <el-select
                    v-model="scope.row.value"
                    size="small"
                    filterable
                    multiple
                    :placeholder="t('fields.pleaseChoose')"
                    style="width: 200px;"
                  >
                    <el-option
                      v-for="item in list.gamePlatforms"
                      :key="item.id"
                      :label="item.code"
                      :value="item.code"
                    />
                  </el-select>
                </template>
                <template v-else>
                  <el-input-number
                    v-model="scope.row.value"
                    :min="-Infinity"
                    class="form-input"
                    :controls="false"
                    :step="1"
                    :precision="2"
                    style="width: 200px;"
                  />
                </template>
              </template>
            </el-table-column>
            <el-table-column prop="action" width="50">
              <template #default="scope">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeReviewRuleRow(scope.$index)"
                />
              </template>
            </el-table-column>
            <el-table-column prop="action" width="50">
              <template #default="scope">
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="mini"
                  @click="addReviewRuleRow(scope.$index)"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item :label="t('fields.autoWithdrawRule')" prop="ruleList" v-if="!uiControl.isShowReviewRule">
          <el-table
            :data="form.ruleList"
            style="width: 100%"
            size="small"
            :show-header="false"
            :border="false"
          >
            <el-table-column prop="variable" width="310">
              <template #default="scope">
                <template v-if="!scope.row.variable || scope.row.variable.trim() === ''">
                  <el-select
                    v-model="scope.row.variable"
                    size="small"
                    filterable
                    :placeholder="t('fields.pleaseChoose')"
                    style="width: 300px;"
                  >
                    <el-option
                      v-for="item in ruleTypeList.list.filter(x => !form.ruleList.some(y => y.variable === x.value))"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                      :disabled="form.ruleList.some(y => y.variable === item.value)"
                    />
                  </el-select>
                </template>
                <template v-if="scope.row.variable && scope.row.variable.trim() !== ''">
                  <el-select
                    v-model="scope.row.variable"
                    size="small"
                    filterable
                    :placeholder="t('fields.pleaseChoose')"
                    style="width: 300px;"
                    disabled
                  >
                    <el-option
                      v-for="item in ruleType.list"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    />
                  </el-select>
                </template>
              </template>
            </el-table-column>
            <el-table-column prop="value" width="210">
              <template #default="scope">
                <template v-if="scope.row.variable && scope.row.variable.includes('matches')">
                  <el-input
                    v-model="scope.row.value"
                    class="form-input"
                    :placeholder="t('fields.pleaseInput')"
                    style="width: 200px;"
                  />
                </template>
                <template v-else>
                  <el-input-number
                    v-model="scope.row.value"
                    :min="0"
                    class="form-input"
                    :controls="false"
                    :step="1"
                    :precision="0"
                    style="width: 200px;"
                  />
                </template>
              </template>
            </el-table-column>
            <el-table-column prop="action" width="50">
              <template #default="scope">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeRuleRow(scope.$index)"
                />
              </template>
            </el-table-column>
            <el-table-column prop="action" width="50">
              <template #default="scope">
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="mini"
                  @click="addRuleRow(scope.$index)"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="cancelDialog">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog
      :title="uiControl.platformDialogTitle"
      v-model="uiControl.platformDialogVisible"
      append-to-body
      width="600px"
    >
      <el-form
        ref="platformForm"
        v-loading="uiControl.dialogLoading"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="250px"
      >
        <el-form-item :label="t('fields.withdrawPlatform')" prop="withdrawPlatformId" required>
          <el-select
            filterable
            clearable
            v-model="form.withdrawPlatformId"
            size="small"
            :placeholder="t('fields.pleaseChoose')"
            class="filter-item"
            style="width: 200px;"
          >
            <el-option
              v-for="item in list.withdrawPlatformByPayType"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="t('fields.minWithdrawAmount')"
          prop="withdrawAmountMin"
          :rules="numberRules.repeatNumberValidation"
        >
          <el-input-number
            v-model="form.withdrawAmountMin"
            :min="0"
            class="form-input"
            :controls="false"
            style="width: 200px;"
          />
        </el-form-item>
        <el-form-item
          :label="t('fields.maxWithdrawAmount')"
          prop="withdrawAmountMax"
          :rules="numberRules.repeatNumberValidation"
          v-if="!isPak(request.siteId)"
        >
          <el-input-number
            v-model="form.withdrawAmountMax"
            :min="form.withdrawAmountMin"
            class="form-input"
            :controls="false"
            style="width: 200px;"
          />
        </el-form-item>
        <el-form-item
          :label="t('fields.sequence')"
          prop="sequence"
          v-if="isPak(request.siteId)"
        >
          <el-input-number
            v-model="form.sequence"
            :min="0"
            class="form-input"
            :controls="false"
            style="width: 200px;"
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submitPlatform()">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-card class="box-card" shadow="never" style="margin-top: 40px">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane :label="t('fields.reviewRule')" name="reviewRule" v-if="uiControl.showReviewRule" />
        <el-tab-pane :label="t('fields.autoWithdrawRule')" name="autoWithdrawRule" />
      </el-tabs>
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.autoWithdrawSetting') }}</span>
        </div>
      </template>
      <el-table
        :data="page.records"
        v-loading="page.loading"
        ref="table"
        row-key="id"
        size="small"
        highlight-current-row
        :empty-text="t('fields.noData')"
        style="width: 100%;"
        v-if="!uiControl.isShowReviewRule"
      >
        <el-table-column type="expand">
          <template #default="props">
            <div class="clearfix">
              <span style="margin-left: 60px; font-size: small;font-weight:bold">{{ t('fields.withdrawPlatform') }}</span>
            </div>
            <el-table :data="props.row.systemAutoWithdrawPlatfromVO" ref="table" size="small" style="margin-left: 60px; width: 50%;" v-if="!isPak(request.siteId)">
              <el-table-column :label="t('fields.withdrawPlatformName')" prop="withdrawPlatformName" />
              <el-table-column :label="t('fields.minWithdrawAmount')" prop="withdrawAmountMin" align="center">
                <template #default="scope">
                  $
                  <span
                    v-formatter="{
                      data: scope.row.withdrawAmountMin,
                      type: 'money',
                    }"
                  />
                </template>
              </el-table-column>
              <el-table-column :label="t('fields.maxWithdrawAmount')" prop="withdrawAmountMax" align="center">
                <template #default="scope">
                  $
                  <span
                    v-formatter="{
                      data: scope.row.withdrawAmountMax,
                      type: 'money',
                    }"
                  />
                </template>
              </el-table-column>
              <el-table-column :label="t('fields.operate')" v-if="hasPermission(['sys:systemautowithdraw:add'])">
                <template #default="scope">
                  <el-button
                    icon="el-icon-delete"
                    size="mini"
                    type="success"
                    @click="deletePlatform(scope.row)"
                  />
                </template>
              </el-table-column>
            </el-table>
            <el-table :data="props.row.withdrawalChannelOrderVO" ref="table" size="small" style="margin-left: 60px; width: 50%;" v-if="isPak(request.siteId)">
              <el-table-column :label="t('fields.withdrawPlatformName')" prop="withdrawPlatformName" />
              <el-table-column prop="status" :label="t('fields.status')" v-if="hasPermission(['sys:systemautowithdraw:update'])">
                <template #default="scope">
                  <el-switch
                    v-model="scope.row.status"
                    active-color="#409EFF"
                    inactive-color="#F56C6C"
                    @change="changePlatformStatus(scope.row, scope.row.status)"
                  />
                </template>
              </el-table-column>
              <el-table-column :label="t('fields.sequence')" prop="sequence">
                <template #default="scope">
                  <el-input-number v-model="scope.row.sequence" :min="1" :max="50" size="small" />
                </template>
              </el-table-column>
              <el-table-column align="right">
                <template #header>
                  <el-button
                    icon="el-icon-save"
                    size="mini"
                    type="success"
                    @click="batchSave(props.row.withdrawalChannelOrderVO)"
                    v-if="isPak(request.siteId) && hasPermission(['sys:systemautowithdraw:update'])"
                  >{{ t('fields.update') }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-table :data="props.row.withdrawalChannelOrderTest" ref="table" size="small" style="margin-left: 60px; width: 50%;" v-if="isPak(request.siteId)">
              <el-table-column :label="t('types.TEST') + ' ' + t('fields.withdrawPlatformName')" prop="withdrawPlatformName">
                <template #default="scope">
                  <el-select
                    filterable
                    clearable
                    v-model="scope.row.withdrawPlatformId"
                    size="small"
                    :placeholder="t('fields.pleaseChoose')"
                    class="filter-item"
                    style="width: 200px;"
                  >
                    <el-option
                      v-for="item in list.siteWithdrawPlatform"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="loginName" :label="t('types.TEST') + ' ' + t('fields.loginName')" v-if="hasPermission(['sys:systemautowithdraw:update'])">
                <template #default="scope">
                  <el-input v-model="scope.row.loginName" style="width: 240px" placeholder="Please input" size="small" />
                </template>
              </el-table-column>
              <el-table-column align="right" :label="t('fields.action')" v-if="hasPermission(['sys:systemautowithdraw:update'])">
                <template #default="scope">
                  <el-button
                    icon="el-icon-save"
                    size="mini"
                    type="success"
                    @click="saveOrder(scope.row)"
                  >{{ t('fields.update') }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="paymentTypeCode" :label="t('fields.payTypeName')" />
        <el-table-column prop="ruleDisplay" :label="t('fields.autoWithdrawRule')">
          <template #default="scope">
            <div v-html="scope.row.ruleDisplay.replace(/\n/g, '<br>')" />
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="t('fields.status')" v-if="hasPermission(['sys:systemautowithdraw:update'])">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#409EFF"
              inactive-color="#F56C6C"
              @change="changeStatus(scope.row, scope.row.status)"
            />
          </template>
        </el-table-column>
        <el-table-column :label="t('fields.action')" v-if="hasPermission(['sys:systemautowithdraw:update'])">
          <template #default="scope">
            <el-button
              icon="el-icon-edit"
              size="mini"
              type="success"
              @click="showEdit(scope.row)"
            />
            <el-button
              icon="el-icon-plus"
              size="mini"
              type="warning"
              @click="showPlatfromDialog('CREATE', scope.row)"
              v-if="!isPak(request.siteId)"
            />
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
        v-if="!uiControl.isShowReviewRule"
      />
      <el-table
        :data="list.reviewRuleRecord"
        v-loading="page.loading"
        ref="table"
        row-key="id"
        size="small"
        highlight-current-row
        :empty-text="t('fields.noData')"
        style="width: 100%;"
        v-if="uiControl.isShowReviewRule"
      >
        <el-table-column prop="ruleDisplay" :label="t('fields.autoWithdrawRule')">
          <template #default="scope">
            <div v-html="scope.row.reviewRuleDisplay.replace(/\n/g, '<br>')" />
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="t('fields.status')" v-if="hasPermission(['sys:systemautowithdraw:update'])">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#409EFF"
              inactive-color="#F56C6C"
              @change="changeWithdrawReviewStatus(scope.row, scope.row.status)"
            />
          </template>
        </el-table-column>
        <el-table-column :label="t('fields.action')" v-if="hasPermission(['sys:systemautowithdraw:update'])">
          <template #default="scope">
            <el-button
              icon="el-icon-edit"
              size="mini"
              type="success"
              @click="showEditWithdrawReview(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref, computed } from 'vue'
import { getSiteListSimple } from '../../../api/site'
import { getActivePaymentTypes } from '../../../api/payment-type'
import { getCurrencyNames } from '../../../api/currency'
import { getConfigList } from '../../../api/config'
import { disableSystemAutoPaymentTypeBySite, getSystemAutoPaymentTypeList, createSystemAutoPaymentType, createSystemAutoPaymentPlaltform, updateystemAutoPaymentType, deleteSystemAutoPaymentPlaltform, updateWithdrawReviewRule } from '../../../api/system-auto-withdraw-type'
import { createWithdrawalChannelOrder, batchupdateWithdrawalOrder } from '../../../api/withdrawal-channel-order'
import { getWithdrawPlatforms } from "../../../api/withdraw-platform";
import { getSiteWithdrawPlatform } from "../../../api/site-withdraw-platform";
import { required } from '../../../utils/validate'
import { ElMessage } from 'element-plus'
import { useStore } from '../../../store'
import { useI18n } from "vue-i18n";
import { TENANT } from '../../../store/modules/user/action-types'
import { hasPermission } from '../../../utils/util'
import { isPak, isIndiaSite, isPh1, isBr1, isNga, isId1 } from '@/utils/site'
import { getFinancialLevels } from "../../../api/financial-level";
import { getVipList } from "../../../api/vip";
import { selectList } from '../../../api/risk-level'
import { getPlatformsBySite } from '../../../api/platform'

const { t } = useI18n()
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const autoPaymentForm = ref(null)
const platformForm = ref(null)
const activeName = ref('reviewRule')
const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  platformDialogVisible: false,
  platformDialogTitle: '',
  platformDialogType: 'CREATE',
  dialogLoading: false,
  useRule: true,
  showReviewRule: true,
  isShowReviewRule: true
})
const request = reactive({
  size: 30,
  current: 1,
  siteId: null,
})
const list = reactive({
  sites: [],
  currencies: [],
  payTypes: [],
  filteredPayTypes: [],
  siteCurrencyIds: [],
  withdrawPlatform: [],
  siteWithdrawPlatform: [],
  withdrawPlatformByPayType: [],
  exclusionList: [],
  financials: [],
  reviewRuleRecord: [],
  vips: [],
  risks: [],
  gamePlatforms: [],
})
const page = reactive({
  pages: 1,
  records: [],
  withdrawalRecords: [],
  loading: false,
})
const form = reactive({
  id: null,
  name: null,
  code: null,
  status: true,
  paymentTypeCode: null,
  withdrawAmountMax: 0,
  withdrawAmountMin: 0,
  rule: null,
  reviewRule: null,
  ruleList: [],
  reviewRuleList: [],
})
const formRules = reactive({
  name: [required(t('message.validateNameRequired'))],
  code: [required(t('message.validateCodeRequired'))],
})
const ruleType = reactive({
  list: [
    { key: 1, name: t('withdrawRuleType.withdrawAmount') + t('withdrawRuleType.max'), value: '#withdraw<' },
    { key: 2, name: t('withdrawRuleType.withdrawAmount') + t('withdrawRuleType.min'), value: '#withdraw>' },
    { key: 3, name: t('withdrawRuleType.financialLevel'), value: "matches '.*,' + T(String).valueOf(#financialLevel) + ',.*'" },
    { key: 4, name: t('withdrawRuleType.todayWithdrawCount') + t('withdrawRuleType.max'), value: '#withdrawCount<' },
    { key: 5, name: t('withdrawRuleType.todayWithdrawCount') + t('withdrawRuleType.min'), value: '#withdrawCount>' },
    { key: 6, name: t('withdrawRuleType.profit') + t('withdrawRuleType.max'), value: '#profit<' },
    { key: 7, name: t('withdrawRuleType.profit') + t('withdrawRuleType.min'), value: '#profit>' },
    { key: 8, name: t('withdrawRuleType.balanceBeforeWithdrawal') + t('withdrawRuleType.max'), value: '#balance<' },
    { key: 9, name: t('withdrawRuleType.balanceBeforeWithdrawal') + t('withdrawRuleType.min'), value: '#balance>' },
    { key: 10, name: t('withdrawRuleType.balanceAfterWithdrawal') + t('withdrawRuleType.max'), value: '#afterBalance<' },
    { key: 11, name: t('withdrawRuleType.balanceAfterWithdrawal') + t('withdrawRuleType.min'), value: '#afterBalance>' },
    { key: 12, name: t('withdrawRuleType.vip'), value: "matches '.*,' + T(String).valueOf(#vipLevel) + ',.*'" },
    { key: 13, name: t('withdrawRuleType.risk'), value: "matches '.*,' + T(String).valueOf(#riskId) + ',.*'" },
    { key: 14, name: t('withdrawRuleType.monthlyProfit') + t('withdrawRuleType.max'), value: '#monthlyProfit<' },
    { key: 15, name: t('withdrawRuleType.monthlyProfit') + t('withdrawRuleType.min'), value: '#monthlyProfit>' },
    { key: 16, name: t('withdrawRuleType.noAutoWithdrawalGamePlatform') + '(' + 1 + t('withdrawRuleType.week') + ')', value: '#betCountByPlatform_7' },
    { key: 17, name: t('withdrawRuleType.noAutoWithdrawalGamePlatform') + '(' + 2 + t('withdrawRuleType.week') + ')', value: '#betCountByPlatform_14' },
    { key: 18, name: t('withdrawRuleType.noAutoWithdrawalGamePlatform') + '(' + 1 + t('withdrawRuleType.month') + ')', value: '#betCountByPlatform_30' },
    { key: 19, name: t('withdrawRuleType.balanceThresholdMultiplier'), value: '#balanceThresholdMultiplier>' },
  ],
})

const ruleTypeList = reactive({
  list: ruleType.list.filter(x => [1, 2].includes(x.key)),
})
const reviewRuleTypeList = reactive({ ...ruleType });

const handleClick = (tab, event) => {
  switchToList(tab.props.name)
}

async function switchToList(type) {
  if (type === 'reviewRule') {
    uiControl.isShowReviewRule = true;
  } else {
    uiControl.isShowReviewRule = false;
  }
}

const repeatNumberValidation = (msg) => {
  return {
    required: true,
    message: msg,
    trigger: "blur",
    validator: (rule, value, callback) => {
      if (list.exclusionList.includes(value)) {
        callback(new Error());
      } else {
        callback();
      }
    }
  };
};

function removeRuleRow(index) {
  form.ruleList.splice(index, 1)
  if (form.ruleList.length === 0) {
    addRuleRow(index)
  }
}

function addRuleRow(index) {
  form.ruleList.splice(index + 1, 0, {
    variable: '',
    value: 0
  })
}

function removeReviewRuleRow(index) {
  form.reviewRuleList.splice(index, 1)
  if (form.reviewRuleList.length === 0) {
    addReviewRuleRow(index)
  }
}

function addReviewRuleRow(index) {
  form.reviewRuleList.splice(index + 1, 0, {
    variable: '',
    value: 0
  })
}

const numberRules = reactive({
  repeatNumberValidation: [repeatNumberValidation(t('message.validateNoRepeatAmount'))],
})

async function loadSites() {
  const { data: ret } = await getSiteListSimple()
  list.sites = ret
}

async function loadPayTypes() {
  const { data: payType } = await getActivePaymentTypes()
  list.payTypes = payType
}

async function loadCurrency() {
  const { data: ret } = await getCurrencyNames()
  list.currencies = ret
}

async function loadGamePlatforms() {
  const { data: ret } = await getPlatformsBySite(request.siteId)
  list.gamePlatforms = ret
}

async function loadAutoPaymentType() {
  const { data: ret } = await getSystemAutoPaymentTypeList(request)
  ret.forEach(item => {
    item.withdrawAmountMax = getValue(item.rule, '#withdraw')
    item.ruleList = getValueList(item.rule)
    item.ruleDisplay = createVariableValueString(item.ruleList)
    item.reviewRuleList = getValueList(item.reviewRule)
    item.reviewRuleDisplay = createVariableValueString(item.reviewRuleList)
  })
  page.records = ret
}

async function loadSearchConditionFinancial() {
  const { data: financial } = await getFinancialLevels({
    siteId: request.siteId,
  })
  list.financials = financial
}

async function loadWithdrawReviewRule() {
  const { data: reviewRule } = await getConfigList("auto_withdraw_review_rule", request.siteId);
  if (reviewRule.length === 0) {
    reviewRule.push({ value: 0, describes: "" })
  }
  reviewRule.forEach(item => {
    item.paymentTypeCode = 'ALL'
    item.status = item.value === '1'
    item.reviewRule = item.describes
    item.reviewRuleList = getValueList(item.reviewRule)
    item.reviewRuleDisplay = createVariableValueString(item.reviewRuleList)
    item.siteId = request.siteId
  })
  list.reviewRuleRecord = reviewRule
}

function createVariableValueString(originalData) {
  const data = JSON.parse(JSON.stringify(originalData))
  const result = data.map(item => {
    if (item.variable && item.value !== null) {
      item.variable = item.variable.trim()
      if (item.variable === 'matches \'.*,\' + T(String).valueOf(#riskId) + \',.*\'') {
        const riskNames = item.value.map(val => {
          const riskItem = list.risks.find(risk => risk.id === val);
          return riskItem ? riskItem.levelName : '';
        });
        item.value = riskNames.join(',');
      }
      if (item.variable === 'matches \'.*,\' + T(String).valueOf(#financialLevel) + \',.*\'') {
        const financialNames = item.value.map(val => {
          const financialItem = list.financials.find(financial => financial.level === val);
          return financialItem ? financialItem.name : '';
        });
        item.value = financialNames.join(',');
      }
      if (item.variable === 'matches \'.*,\' + T(String).valueOf(#vipLevel) + \',.*\'') {
        const vipNames = item.value.map(val => {
          const vipItem = list.vips.find(vip => vip.level === val);
          return vipItem ? vipItem.name : '';
        });
        item.value = vipNames.join(',');
      }
      const variableName = ruleType.list.find(a => a.value === item.variable)?.name;
      item.variable = variableName ?? item.variable;
      return `${item.variable} : ${item.value}`;
    }
    return null;
  }).filter(Boolean);
  return result.join('\n');
}

function getValue(str, keyword) {
  if (!str) return null;
  const regex = new RegExp(`${keyword}\\s*[<>]\\s*\\d+`, 'g');
  const matches = str.match(regex);
  if (matches === null) return null;
  const numbers = matches.map(match => {
    const num = match.match(/\d+/);
    return parseInt(num, 10);
  });
  return Math.max(...numbers);
}

function getValueList(str) {
  const conditionRegex = /(#\w+)\s*(<=|>=|==|<|>)\s*(-?\d+(?:\.\d+)?)/g;
  const matchesRegex = /\(([^)]+)\)\s+matches\s+'(.*)'/g;
  const platformRegex = /#betCountByPlatform_([a-zA-Z0-9_]+)_(\d+)/g;
  const results = [];
  let match;
  if (!str) {
    results.push({ variable: '', operator: '', value: null });
    return results;
  }
  function extractConditions(conditionStr) {
    while ((match = conditionRegex.exec(conditionStr)) !== null) {
      const variable = match[1] + match[2];
      const operator = match[2];
      const value = parseFloat(match[3]);
      results.push({ variable, operator, value });
    }
    while ((match = matchesRegex.exec(conditionStr)) !== null) {
      const expression = match[1];
      const pattern = match[2];
      const innerValue = expression.replace(/[^0-9,]+/g, '').split(',').filter(item => item !== '').map(Number);
      results.push({ variable: "matches '" + pattern + "'", operator: 'matches', value: innerValue });
    }
    while ((match = platformRegex.exec(conditionStr)) !== null) {
      const platformList = match[1].split('_');
      const numericPart = match[2];
      const variable = '#betCountByPlatform_' + numericPart;
      const value = platformList;
      results.push({ variable, operator: '', value });
    }
  }
  const andConditions = str.split(/\s+and\s+/).filter(condition => condition.trim());
  for (const condition of andConditions) {
    extractConditions(condition.trim());
  }
  results.push({ variable: '', operator: '', value: null });
  return results.length > 0 ? results : null;
}

async function loadSiteWithdrawPlatform(siteId) {
  const { data: ret } = await getSiteWithdrawPlatform(siteId);
  list.siteWithdrawPlatform = ret;
  list.siteWithdrawPlatform.forEach(platform => {
    const matchingItem = list.withdrawPlatform.find(item => item.id === platform.withdrawPlatformId);
    if (matchingItem) {
      platform.name = matchingItem.name;
      platform.id = matchingItem.id;
      platform.type = matchingItem.type;
      platform.status = matchingItem.status;
    }
  });
  list.siteWithdrawPlatform = list.siteWithdrawPlatform.filter(platform => platform.status)
}

async function loadWithdrawPlatform() {
  const { data: ret } = await getWithdrawPlatforms(request);
  list.withdrawPlatform = ret.records
}

const loadVips = async () => {
  const { data: vip } = await getVipList({ siteId: request.siteId })
  list.vips = vip
}

const loadRiskLevels = async () => {
  const { data: risk } = await selectList({ siteId: request.siteId })
  list.risks = risk
}

function filterPayTypeByCurrency() {
  const currentSite = list.sites.find(s => s.id === request.siteId)
  const currencyCodeList = currentSite.currency.split(',').map(currencyName => currencyName)
  list.siteCurrencyIds = [
    ...currencyCodeList.map(currencyName => {
      const currency = list.currencies.find(c => c.currencyCode.toUpperCase() === currencyName.toUpperCase())
      return currency ? currency.id : null
    }).filter(Boolean)
  ]
  list.filteredPayTypes = list.payTypes.filter(payTypeByCurrencyID)
  payTypeByExistingPayType()
}

function payTypeByCurrencyID (record) {
  if (record.currencyIds) {
    const currencyIdsList = record.currencyIds.split(',')
    return currencyIdsList.filter(currencyId => list.siteCurrencyIds.includes(parseInt(currencyId))).length > 0
  }
}

function payTypeByExistingPayType() {
  list.filteredPayTypes = list.filteredPayTypes.filter(payType => {
    return !page.records.some(record => record.paymentTypeCode === payType.code);
  });
}

async function handleChangeSite() {
  checkUseRule()
  await loadWithdrawPlatform()
  await loadAutoPaymentType()
  await loadSiteWithdrawPlatform(request.siteId)
  filterPayTypeByCurrency()
}

async function disableAll() {
  await disableSystemAutoPaymentTypeBySite(request)
  loadAutoPaymentType()
}

function changeStatus(data, status) {
  data.status = status
  updateystemAutoPaymentType(data)
}

async function changeWithdrawReviewStatus(data, status) {
  data.status = status
  await updateWithdrawReviewRule(data)
  await loadWithdrawReviewRule()
  ElMessage({ message: t('message.updateSuccess'), type: 'success' })
}

async function saveOrder(data) {
  await createWithdrawalChannelOrder(data)
  await loadAutoPaymentType()
  ElMessage({ message: t('message.addSuccess'), type: 'success' })
}

async function batchSave(data) {
  var sequenceList = []
  var isDuplicate = false
  var isSequenceEmpty = false
  data.forEach(setting => {
    if (setting.sequence === undefined) {
      isSequenceEmpty = true
    }
    if (!isDuplicate && setting.status) {
      if (sequenceList.includes(setting.sequence)) {
        isDuplicate = true
      } else {
        sequenceList.push(setting.sequence)
      }
    }
  })
  if (isSequenceEmpty) {
    ElMessage({ message: t("message.sequenceEmpty"), type: 'error' })
    return
  }
  if (isDuplicate) {
    ElMessage({ message: t('message.validateWithdrawChannel'), type: 'error' })
    return
  }
  await batchupdateWithdrawalOrder(data)
  await loadAutoPaymentType()
  ElMessage({ message: t('message.addSuccess'), type: 'success' })
}

function showEdit(data) {
  showDialog('EDIT')
  nextTick(() => {
    for (const key in data) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = data[key]
      }
    }
  })
}

function showEditWithdrawReview(data) {
  showDialog('EDIT_REVIEW_RULE')
  nextTick(() => {
    for (const key in data) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = data[key]
      }
    }
  })
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (autoPaymentForm.value) {
      handleChangeSite()
      autoPaymentForm.value.resetFields()
    }
    form.id = null
    form.ruleList = getValueList(null)
    form.reviewRuleList = getValueList(null)
    uiControl.dialogTitle = t('fields.addPayType')
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.editPayType')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function showPlatfromDialog(type, data) {
  list.exclusionList = []
  data.systemAutoWithdrawPlatfromVO.forEach(item => {
    list.exclusionList.push(item.withdrawAmountMin)
    list.exclusionList.push(item.withdrawAmountMax)
  })
  form.withdrawAmountMax = 0
  form.withdrawAmountMin = 0
  list.withdrawPlatformByPayType = []
  list.siteWithdrawPlatform.forEach(item => {
    if (item.type === data.paymentTypeCode) {
      list.withdrawPlatformByPayType.push(item)
    }
  })
  if (type === 'CREATE') {
    if (platformForm.value) {
      platformForm.value.resetFields()
    }
    form.autoWithdrawTypeId = data.id
    uiControl.platformDialogTitle = t('fields.addWithdrawPlatform')
  } else if (type === 'EDIT') {
    uiControl.platformDialogTitle = t('fields.editWithdrawPlatform')
  }
  uiControl.platformDialogType = type
  uiControl.platformDialogVisible = true
}

async function deletePlatform(data) {
  await deleteSystemAutoPaymentPlaltform(data)
  loadAutoPaymentType()
}

function create() {
  autoPaymentForm.value.validate(async valid => {
    if (valid) {
      form.siteId = request.siteId
      form.rule = createConditionString(form.ruleList)
      form.reviewRule = createConditionString(form.reviewRuleList)
      await createSystemAutoPaymentType(form)
      uiControl.dialogVisible = false
      await loadAutoPaymentType()
      payTypeByExistingPayType()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function createPlatform() {
  platformForm.value.validate(async valid => {
    if (valid) {
      form.siteId = request.siteId
      form.id = null
      await createSystemAutoPaymentPlaltform(form)
      uiControl.platformDialogVisible = false
      await loadAutoPaymentType()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

async function editReviewRule() {
  form.siteId = request.siteId
  form.reviewRule = createConditionString(form.reviewRuleList)
  await updateWithdrawReviewRule(form)
  uiControl.dialogVisible = false
  await loadWithdrawReviewRule()
  ElMessage({ message: t('message.addSuccess'), type: 'success' })
}

function edit() {
  autoPaymentForm.value.validate(async valid => {
    if (valid) {
      form.siteId = request.siteId
      form.rule = createConditionString(form.ruleList)
      form.reviewRule = createConditionString(form.reviewRuleList)
      await updateystemAutoPaymentType(form)
      uiControl.dialogVisible = false
      await loadAutoPaymentType()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

function createConditionString(data) {
  const conditions = data.map(item => {
    const variable = item.variable.trim();
    const value = item.value;
    if (variable !== '' && value !== null) {
      if (variable.includes('matches')) {
        return `(',' + '${value}' + ',') ${variable}`;
      }
      if (variable.startsWith("#betCountByPlatform_") && value instanceof Array) {
        const parts = variable.split('_');
        const platforms = value.join('_');
        const numberPart = parts[parts.length - 1];
        return `#betCountByPlatform_${platforms}_${numberPart}`;
      }
      return `${variable} ${value}`;
    }
    return null;
  }).filter(Boolean);
  return conditions.join(' and ');
}

function cancelDialog() {
  page.records.forEach(item => {
    item.ruleList = getValueList(item.rule)
    item.ruleDisplay = createVariableValueString(item.ruleList)
    item.reviewRuleList = getValueList(item.reviewRule)
    item.reviewRuleDisplay = createVariableValueString(item.reviewRuleList)
  })
  uiControl.dialogVisible = false
}

function submit() {
  uiControl.dialogLoading = true
  if (uiControl.dialogType === 'CREATE') {
    create()
    payTypeByExistingPayType()
  } else if (uiControl.dialogType === 'EDIT') {
    edit()
  } else if (uiControl.dialogType === 'EDIT_REVIEW_RULE') {
    editReviewRule()
  }
  uiControl.dialogLoading = false
}

function submitPlatform() {
  uiControl.dialogLoading = true
  if (uiControl.platformDialogType === 'CREATE') {
    createPlatform()
  }
  uiControl.dialogLoading = false
}

function changePage(page) {
  request.current = page
}

function checkUseRule() {
  if (isIndiaSite(request.siteId) || isPh1(request.siteId) || isBr1(request.siteId) || isNga(request.siteId) || isId1(request.siteId)) {
    uiControl.useRule = false;
  } else {
    uiControl.useRule = true;
  }
}

onMounted(async() => {
  await loadSites()
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = list.sites.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  } else {
    site.value = list.sites[0];
    request.siteId = store.state.user.siteId
  }
  const { data: config } = await getConfigList("auto_withdraw_review_control", request.siteId);
  uiControl.showReviewRule = uiControl.isShowReviewRule = config.length > 0 && config[0].value !== 'CLOSE';
  if (uiControl.showReviewRule) {
    await loadSearchConditionFinancial()
    await loadVips()
    await loadRiskLevels()
    await loadWithdrawReviewRule()
    await loadGamePlatforms()
  }
  checkUseRule()
  await loadWithdrawPlatform()
  await loadSiteWithdrawPlatform(request.siteId)
  loadCurrency()
  loadPayTypes()
  await loadAutoPaymentType()
  filterPayTypeByCurrency()
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
  margin-right: 18px;
}

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

:deep(.el-radio__input) {
  display: none !important;
}

:deep(.el-radio.is-bordered.is-checked) {
  background-color: var(--el-color-primary);
}

:deep(.is-checked .el-radio__label) {
  color: white;
}

.el-radio {
  margin-right: 10px;
  margin-bottom: 5px;
}

.el-radio.is-bordered+.el-radio.is-bordered {
  margin-left: 0;
}

.form-border {
  border-color: #dcdfe6;
  border-style: solid;
  border-width: 1px
}

.form-header {
  color: white;
  background-color: var(--el-color-primary);
  padding: 10px;
}

.form-body {
  padding: 10px;
}

.el-icon-caret-top {
  color: red;
}

.el-icon-caret-bottom {
  color: green;
}
</style>
