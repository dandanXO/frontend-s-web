<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input
          v-model="request.name"
          size="small"
          style="width: 200px"
          :placeholder="t('fields.title')"
        />
        <el-select
          clearable
          v-model="request.status"
          size="small"
          :placeholder="t('fields.state')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.status"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
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
          @click="loadPromoConfig"
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
      <div class="btn-group">
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-permission="['sys:privi:promo-code-redeem-config:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
      </div>
    </div>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="750px"
    >
      <el-form
        ref="bannerForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="180px"
      >
        <el-form-item :label="t('fields.name')" prop="name">
          <el-input
            v-model="form.name"
            style="width: 350px"
          />
        </el-form-item>
        <el-form-item :label="t('fields.code')" prop="code">
          <el-input
            v-model="form.code"
            style="width: 350px"
          />
        </el-form-item>
        <el-form-item :label="t('fields.redeemCode')" prop="alias">
          <el-input
            v-model="form.alias"
            style="width: 350px"
          />
        </el-form-item>
        <el-form-item :label="t('fields.site')" prop="siteId">
          <el-select
            v-model="form.siteId"
            size="small"
            :placeholder="t('fields.site')"
            class="filter-item"
            style="width: 350px"
            default-first-option
            @focus="loadSites"
            @change="changeSite"
          >
            <el-option
              v-for="item in siteList.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item :label="t('fields.status')" prop="status">
          <el-select
            clearable
            v-model="form.status"
            size="small"
            :placeholder="t('fields.status')"
            class="filter-item"
            style="width: 120px;"
          >
            <el-option
              v-for="item in uiControl.status"
              :key="item.key"
              :label="item.displayName"
              :value="item.value"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item :label="t('fields.status')" prop="status">
          <el-radio-group
            v-model="form.status"
            size="small"
            style="width: 300px"
          >
            <el-radio-button label="OPEN">
              {{ t('common.status.OPEN') }}
            </el-radio-button>
            <el-radio-button label="CLOSE">
              {{ t('common.status.CLOSE') }}
            </el-radio-button>
            <el-radio-button label="TEST">
              {{ t('common.status.TEST') }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-row>
          <el-col>
            <el-form-item :label="t('fields.startTime')" prop="startTime">
              <el-date-picker
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
                v-model="form.startTime"
                style="width: 355px"
                :disabled-date="disabledStartDate"
              />
            </el-form-item>
            <el-form-item :label="t('fields.endTime')" prop="endTime">
              <el-date-picker
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
                v-model="form.endTime"
                style="width: 355px"
                :disabled-date="disabledEndDate"
              />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item :label="t('fields.bonusType')" prop="bonusType">
              <el-radio-group v-model="form.bonusType" @change="showAndResetBonusType">
                <el-radio
                  v-for="b in uiControl.bonusType"
                  :key="b.key"
                  :label="b.value"
                >
                  {{ b.displayName }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="uiControl.bonusFixedVisible" :label="t('fields.bonus')" prop="fixedBonus">
              $
              <el-input-number
                v-model="form.fixedBonus"
                style="width: 135px"
                :controls="false"
                @keypress="restrictInput($event)"
              />
            </el-form-item>
            <el-form-item v-if="uiControl.bonusRangeVisible" :label="t('fields.minBonus')" prop="minBonus">
              $
              <el-input-number
                v-model="form.minBonus"
                style="width: 135px"
                :controls="false"
                @keypress="restrictInput($event)"
              />
            </el-form-item>
            <el-form-item v-if="uiControl.bonusRangeVisible" :label="t('fields.maxBonus')" prop="maxBonus">
              $
              <el-input-number
                v-model="form.maxBonus"
                style="width: 135px"
                :controls="false"
                @keypress="restrictInput($event)"
              />
            </el-form-item>
          </el-col>
          <el-form-item v-if="uiControl.bonusVipFixedVisible" :label="t('fields.fixedVipRules')" prop="fixedVipRules" style="width: 600px;">
            <el-tag
              v-for="item in form.fixedVipRules"
              :key="item"
              class="ml-1"
              closable
              @close="removeFixedVipRule(item)"
            >
              {{ displayFixedVipRule(item) }}
            </el-tag>
            <el-form
              v-if="uiControl.bonusVipFixedPanelVisible"
              ref="rangeVipForm"
              :model="vipFixedRuleForm"
              size="small"
              label-width="50px"
              style="width:100%"
            >
              <el-form-item :label="t('fields.vipLevel')" prop="vipLevel" style="width: 600px;">
                <el-select
                  clearable
                  v-model="vipFixedRuleForm.vipLevel"
                  size="small"
                  :placeholder="t('fields.vipLevel')"
                  class="filter-item"
                  style="width: 200px; margin-left: 5px"
                >
                  <el-option
                    v-for="item in currVipList.list"
                    :key="item.level"
                    :label="item.name"
                    :value="item.level"
                  />
                </el-select>
              </el-form-item>
              <el-form-item :label="t('fields.minAmount')" prop="minAmount">
                $
                <el-input-number
                  v-model="vipFixedRuleForm.minAmount"
                  style="width: 135px"
                  :controls="false"
                  @keypress="restrictInput($event)"
                />
              </el-form-item>
              <div class="dialog-footer">
                <el-button @click="uiControl.bonusVipFixedPanelVisible = false">{{ t('fields.cancel') }}</el-button>
                <el-button @click="addFixedVipRule">{{ t('fields.add') }}</el-button>
              </div>
            </el-form>
            <el-button v-else-if="currVipList.list.length > 0" class="button-new-tag ml-1 el-button--success" @click="uiControl.bonusVipFixedPanelVisible = true"
                       style="display:block;margin-top:4px;"
            >
              + {{ t('fields.add_new') }}
            </el-button>
          </el-form-item>
          <el-form-item v-if="uiControl.bonusVipRangeVisible" :label="t('fields.rangeVipRules')" prop="rangeVipRules" style="width: 600px;">
            <el-tag
              v-for="item in form.rangeVipRules"
              :key="item"
              class="ml-1"
              closable
              @close="removeRangeVipRule(item)"
            >
              {{ displayVipRule(item) }}
            </el-tag>
            <el-form
              v-if="uiControl.bonusVipRangePanelVisible"
              ref="fixedVipForm"
              :model="vipRangeRuleForm"
              size="small"
              label-width="50px"
              style="width:100%"
            >
              <el-form-item :label="t('fields.vipLevel')" prop="vipLevel" style="width: 600px;">
                <el-select
                  clearable
                  v-model="vipRangeRuleForm.vipLevel"
                  size="small"
                  :placeholder="t('fields.vipLevel')"
                  class="filter-item"
                  style="width: 200px; margin-left: 5px"
                >
                  <el-option
                    v-for="item in currVipList.list"
                    :key="item.level"
                    :label="item.name"
                    :value="item.level"
                  />
                </el-select>
              </el-form-item>
              <el-form-item :label="t('fields.minAmount')" prop="minAmount">
                $
                <el-input-number
                  v-model="vipRangeRuleForm.minAmount"
                  style="width: 135px"
                  :controls="false"
                  @keypress="restrictInput($event)"
                />
              </el-form-item>
              <el-form-item :label="t('fields.maxAmount')" prop="maxAmount">
                $
                <el-input-number
                  v-model="vipRangeRuleForm.maxAmount"
                  style="width: 135px"
                  :controls="false"
                  @keypress="restrictInput($event)"
                />
              </el-form-item>
              <div class="dialog-footer">
                <el-button @click="uiControl.bonusVipRangePanelVisible = false">{{ t('fields.cancel') }}</el-button>
                <el-button @click="addVipRule">{{ t('fields.add') }}</el-button>
              </div>
            </el-form>
            <el-button v-else-if="currVipList.list.length > 0" class="button-new-tag ml-1 el-button--success" @click="uiControl.bonusVipRangePanelVisible = true"
                       style="display:block;margin-top:4px;"
            >
              + {{ t('fields.add_new') }}
            </el-button>
          </el-form-item>
          <el-col>
            <!-- <el-form-item :label="t('fields.way')" prop="ways">
              <el-checkbox-group v-model="form.eligibleWays">
                <el-checkbox
                  v-for="item in ways.list"
                  :key="item"
                  :label="item"
                />
              </el-checkbox-group>
            </el-form-item> -->
            <el-form-item :label="t('fields.maxRedeemPerDay')" prop="maxRedeemPerDay">
              <el-input-number
                v-if="form.maxRedeemPerDay >= 0"
                v-model="form.maxRedeemPerDay"
                style="width: 135px"
                :min="1"
              />
              <el-tag
                v-else
              >
                {{ t('fields.noLimit') }}
              </el-tag>
              <el-button v-if="form.maxRedeemPerDay >= 0" type="warning" class="button-new-tag ml-1 el-button--success" @click="form.maxRedeemPerDay = -1"
                         style="display:block;margin-top:4px;"
              >
                {{ t('fields.noLimit') }}
              </el-button>
              <el-button v-else type="success" class="button-new-tag ml-1 el-button--success" @click="form.maxRedeemPerDay = 0"
                         style="display:block;margin-top:4px;"
              >
                {{ t('fields.addLimit') }}
              </el-button>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item :label="t('fields.sameIpLimit')" prop="sameIpLimit">
              <el-input-number
                v-if="form.sameIpLimit >= 0"
                v-model="form.sameIpLimit"
                style="width: 135px"
                :min="1"
              />
              <el-tag
                v-else
              >
                {{ t('fields.noLimit') }}
              </el-tag>
              <el-button v-if="form.sameIpLimit >= 0" type="warning" class="button-new-tag ml-1 el-button--success" @click="form.sameIpLimit = -1"
                         style="display:block;margin-top:4px;"
              >
                {{ t('fields.noLimit') }}
              </el-button>
              <el-button v-else type="success" class="button-new-tag ml-1 el-button--success" @click="form.sameIpLimit = 0"
                         style="display:block;margin-top:4px;"
              >
                {{ t('fields.addLimit') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="t('fields.gameType')" prop="gameType">
          <el-select
            v-model="form.gameTypes"
            :placeholder="t('fields.gameType')"
            style="width: 300px;"
            default-first-option
            filterable
            multiple
            @focus="loadGameTypes"
          >
            <el-option
              v-for="item in gameTypes.list"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.minDayBetAmount')" prop="minDayBetAmount" style="width: 600px;">
          $
          <el-input-number
            v-model="form.minDayBetAmount"
            style="width: 135px"
            :controls="false"
            @keypress="restrictInput($event)"
          />
        </el-form-item>
        <el-form-item :label="t('fields.minDayDepositAmount')" prop="minDayDepositAmount" style="width: 600px;">
          $
          <el-input-number
            v-model="form.minDayDepositAmount"
            style="width: 135px"
            :controls="false"
            @keypress="restrictInput($event)"
          />
        </el-form-item>
        <el-form-item :label="t('fields.minTotalDepositAmount')" prop="minTotalDepositAmount" style="width: 350px;">
          $
          <el-input-number
            v-model="form.minTotalDepositAmount"
            style="width: 135px"
            :controls="false"
            @keypress="restrictInput($event)"
          />
        </el-form-item>
        <el-row>
          <el-form-item :label="t('fields.minTotalDepositDays')" prop="minTotalDepositDays" style="width: 300px;">
            <el-input-number
              v-if="form.minTotalDepositDays > -1"
              v-model="form.minTotalDepositDays"
              style="width: 135px"
              :controls="false"
              @keypress="restrictInput($event)"
            />
            <el-tag
              v-else
            >
              {{ t('fields.noLimit') }}
            </el-tag>
            <el-button v-if="form.minTotalDepositDays >= 0" type="warning" class="button-new-tag ml-1 el-button--success" @click="form.minTotalDepositDays = -1"
                       style="display:block;margin-top:4px;"
            >
              {{ t('fields.noLimit') }}
            </el-button>
            <el-button v-else-if="form.minTotalDepositWeeks === -1" type="success" class="button-new-tag ml-1 el-button--success" @click="form.minTotalDepositDays = 0"
                       style="display:block;margin-top:4px;"
            >
              {{ t('fields.addLimit') }}
            </el-button>
          </el-form-item>
          <el-form-item :label="t('fields.minTotalDepositWeeks')" prop="minTotalDepositWeeks" style="width: 300px;">
            <el-input-number
              v-if="form.minTotalDepositWeeks > -1"
              v-model="form.minTotalDepositWeeks"
              style="width: 135px"
              :controls="false"
              @keypress="restrictInput($event)"
            />
            <el-tag
              v-else
            >
              {{ t('fields.noLimit') }}
            </el-tag>
            <el-button v-if="form.minTotalDepositWeeks >= 0" type="warning" class="button-new-tag ml-1 el-button--success" @click="form.minTotalDepositWeeks = -1"
                       style="display:block;margin-top:4px;"
            >
              {{ t('fields.noLimit') }}
            </el-button>
            <el-button v-else-if="form.minTotalDepositDays === -1" type="success" class="button-new-tag ml-1 el-button--success" @click="form.minTotalDepositWeeks = 0"
                       style="display:block;margin-top:4px;"
            >
              {{ t('fields.addLimit') }}
            </el-button>
          </el-form-item>
        </el-row>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
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
      <el-table-column type="selection" />
      <el-table-column prop="name" :label="t('fields.name')" />
      <el-table-column prop="code" :label="t('fields.code')" />
      <el-table-column prop="alias" :label="t('fields.redeemCode')" />
      <!-- <el-table-column prop="status" :label="t('fields.status')" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 'OPEN'" type="success">
            {{ scope.row.status }}
          </el-tag>
          <el-tag v-if="scope.row.status === 'CLOSE'" type="danger">
            {{ scope.row.status }}
          </el-tag>
          <el-tag v-if="scope.row.status === 'TEST'">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column> -->
      <el-table-column prop="status" :label="t('fields.status')" min-width="150">
        <template #default="scope">
          <el-radio-group
            v-model="scope.row.status"
            size="mini"
            @change="changePromoCodeRedeemConfigStatus(scope.row.privilegeId, scope.row.status)"
          >
            <el-radio-button label="OPEN">{{ t('common.status.OPEN') }}</el-radio-button>
            <el-radio-button label="CLOSE">{{ t('common.status.CLOSE') }}</el-radio-button>
            <el-radio-button label="TEST">{{ t('common.status.TEST') }}</el-radio-button>
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" :label="t('fields.startTime')">
        <template #default="scope">
          <span v-if="scope.row.startTime === null">-</span>
          <span v-if="scope.row.startTime !== null">{{ scope.row.startTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endTime" :label="t('fields.endTime')">
        <template #default="scope">
          <span v-if="scope.row.endTime === null">-</span>
          <span v-if="scope.row.endTime !== null">{{ scope.row.endTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateBy" :label="t('fields.updateBy')" />
      <el-table-column type="title" :label="t('fields.action')"
                       width="150"
      >
        <template #default="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            v-permission="['sys:privi:promo-code-redeem-config:update']"
            @click="showEdit(scope.row)"
          />
          <!-- <el-button
            icon="el-icon-view"
            size="mini"
            type="success"
            v-permission="['sys:privi:red:packet:rain:list']"
            @click="goToList(scope.row)"
          /> -->
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
  </div>
</template>

<script setup>
/* eslint-disable */
import {ElMessage, ElMessageBox} from 'element-plus'
import {computed, nextTick, onMounted, reactive, ref} from 'vue'
import {
  getWays
} from '../../../api/privilege-red-packet-rain'
import {getSiteListSimple} from '../../../api/site'
import {required} from '../../../utils/validate'
import {hasPermission} from '../../../utils/util'
import {useStore} from '../../../store';
import {TENANT} from "../../../store/modules/user/action-types";
import {useI18n} from "vue-i18n";
import {getVipList} from "@/api/vip";
import moment from "moment/moment";
import { useRouter } from 'vue-router'
import { isXF, isThai } from '@/utils/site'
import { createPromoCodeConfig, getPromoCodeConfigList, updatePromoCodeConfig, updatePromoCodeConfigStatus } from '../../../api/privilege-promo-code-config'
import { getGameTypes } from '../../../api/game'

const router = useRouter()
const {t} = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const bannerForm = ref(null)
const fixedVipForm = ref(null)
const rangeVipForm = ref(null)
const siteList = reactive({
  list: [],
})
const totalVipList = reactive({
  list: [],
})
const siteVipList = reactive({
  list: [],
})
const currVipList = reactive({
  list: [],
})
const ways = reactive({
  list: [],
})
let timeZone = null;

const gameTypes = reactive({
  list: [],
})

const uiControl = reactive({
  dialogVisible: false,
  bonusFixedVisible:true, 
  bonusRangeVisible: false,
  bonusVipFixedVisible:false, 
  bonusVipFixedPanelVisible:false, 
  bonusVipRangeVisible:false,
  bonusVipRangePanelVisible:false, 
  vipRuleVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  editBtn: true,
  removeBtn: true,
  dateRangeType: "1",
  status: [
    { key: 1, displayName: t('common.status.OPEN'), value: 'OPEN' },
    { key: 2, displayName: t('common.status.CLOSE'), value: 'CLOSE' },
    { key: 3, displayName: t('common.status.TEST'), value: 'TEST' },
  ],
  bonusType: [
    { key: 1, displayName: 'Fixed', value: 'FIXED' },
    { key: 2, displayName: 'Range', value: 'RANGE' },
    { key: 3, displayName: 'Vip Fixed', value: 'VIP_FIXED' },
    { key: 4, displayName: 'Vip Range', value: 'VIP_RANGE' },
  ],
})

const request = reactive({
  size: 30,
  current: 1,
  name: null,
  status: null,
  siteId: null,
})

const form = reactive({
  id: null,
  siteId: null,
  name: null,
  code: null,
  alias: null,
  startTime: null,
  endTime: null,
  bonusType: 'FIXED',
  fixedBonus:0,
  minBonus:0,
  maxBonus:0,
  maxRedeemPerDay: -1,
  sameIpLimit:-1,
  fixedVipRules: [],
  rangeVipRules: [],
  minDayDepositAmount: 0,
  minTotalDepositAmount: 0,
  minTotalDepositDays: -1,
  minTotalDepositWeeks: -1,
  eligibleWays: [],
  status: null,
  minDayBetAmount: 0,
  gameTypes: null
})

const vipFixedRuleForm = reactive({
  vipLevel: 0,
  minAmount: 0,
})

const vipRangeRuleForm = reactive({
  vipLevel: 0,
  minAmount: 0,
  maxAmount: 0,
})

const page = reactive({
  pages: 0,
  records: [],
})

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  name: [required(t('message.validateNameRequired'))],
  code: [required(t('message.validateCodeRequired'))],
  alias: [required(t('message.validateCodeRequired'))],
  startTime: [required(t('message.validateStartTimeRequired'))],
  endTime: [required(t('message.validateEndTimeRequired'))],
  status: [required(t('message.validateStatusRequired'))]
})

function resetQuery() {
  request.name = null
  request.status = null
  request.siteId = site.value ? site.value.id : siteList.list[0].id
}

function changePage(page) {
  request.current = page
  loadPromoConfig()
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (bannerForm.value) {
      bannerForm.value.resetFields()
      resetAllBonusTypeAmount()
    }
    bannerForm.gameTypes = null
    uiControl.dialogTitle = t('fields.addPromoConfig')
  } else {
    uiControl.dialogTitle = t('fields.editPromoConfig')
  }
  // singleRainRangeFrom.value = null
  // singleRainRangeTo.value = null
  // multiRainRangeDate.value = null
  // multiRainRangeTime.value = null
  // multiRangeDateLists.value = []
  // multiRangeTimeLists.value = []
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function showEdit(banner) {
  getVipBySiteId(banner.siteId)
  getAvailableVip()
  showDialog('EDIT')
  if (!banner) {
    banner = chooseBanner[0]
  }
  nextTick(() => {
    for (const key in banner) {
      if (key === 'gameTypes' ) {
          // game type 需要进行转换
        if (banner[key] != null) {
          form.gameTypes = banner[key].split(',') // string 转 array
        }
      } else if (key === 'fixedVipRules') {
        form.fixedVipRules = JSON.parse(banner[key])
      } else if (key === 'rangeVipRules') {
        form.rangeVipRules = JSON.parse(banner[key])
      } else if (key === 'eligibleWays') {
        form.eligibleWays = JSON.parse(banner[key])
      } else if (Object.keys(form).find(k => k === key)) {
        form[key] = banner[key]
      }
    }
    siteList.list.forEach(element => {
      if (element.siteName === banner.siteName) {
        form.siteId = element.id
      }
    })

    timeZone = siteList.list.find(e => e.id === form.siteId).timeZone;
    showBonusTypeField()
  })
}

function displayFixedVipRule(vipRule) {
  const vip = siteVipList.list.find(vip => vip.level === vipRule.vipLevel)
  const name = vip ? vip.name : ''
  return name + '  $' + vipRule.minAmount;
}
function displayVipRule(vipRule) {
  const vip = siteVipList.list.find(vip => vip.level === vipRule.vipLevel)
  const name = vip ? vip.name : ''
  return name + '  $' + vipRule.minAmount + ' - $' + vipRule.maxAmount;
}

function removeFixedVipRule(item) {
  form.fixedVipRules.splice(form.fixedVipRules.indexOf(item), 1);
  getAvailableVip()
}

function removeRangeVipRule(item) {
  form.rangeVipRules.splice(form.rangeVipRules.indexOf(item), 1);
  getAvailableVip()
}

async function loadPromoConfig() {
  const {data: ret} = await getPromoCodeConfigList(request)
  page.pages = ret.pages
  ret.records.forEach(data => {
    data.timeZone =
      store.state.user.sites.find(e => e.id === data.siteId) !==
      undefined
        ? store.state.user.sites.find(e => e.id === data.siteId)
          .timeZone
        : null
  })
  page.records = ret.records
}

async function loadSites() {
  const {data: site} = await getSiteListSimple()
  siteList.list = site
}

async function removeBanner(banner) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: 'warning',
    }
  ).then(async () => {
    if (banner) {
      // await deleteHomeBanner([banner.id])
    } else {
      // await deleteHomeBanner(chooseBanner.map(u => u.id))
    }
    await loadPromoConfig()
    ElMessage({message: t('message.deleteSuccess'), type: 'success'})
  })
}

function restrictInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if ((charCode < 48 || charCode > 57) && charCode !== 46) {
    event.preventDefault()
  }
}

function changeSite(siteId) {
  if (isXF(siteId)) {
    form.minBalance = 5
  } else if (isThai(siteId)) {
    form.minBalance = 20
  } else {
    form.minBalance = 0
  }
  form.fixedVipRules = []
  form.rangeVipRules = []
  getVipBySiteId(siteId)
  getAvailableVip()
}

async function loadVips() {
  const {data: vip} = await getVipList()
  totalVipList.list = vip
}

async function loadWays() {
  const {data: way} = await getWays()
  ways.list = way
}

async function getAvailableVip() {
  let levels;
  if(form.fixedVipRules != "[]"){
    levels = form.fixedVipRules.map(vip => vip.vipLevel)
  }
  if(form.rangeVipRules != "[]"){
    levels = form.rangeVipRules.map(vip => vip.vipLevel)
  }
  
  currVipList.list = siteVipList.list.filter(vip => {
    return !levels.includes(vip.level)
  });
  if (currVipList.list.length > 0) {
    vipFixedRuleForm.vipLevel = currVipList.list[0].level
    vipFixedRuleForm.vipLevel = currVipList.list[0].level
  }
}

async function getVipBySiteId(siteId) {
  siteVipList.list = totalVipList.list.filter(vip => {
    return vip.siteId === siteId
  });
}

function create() {
  bannerForm.value.validate(async valid => {
    if (valid) {
      if(form.gameTypes){
        form.gameTypes = form.gameTypes.join(",")
      }
      await createPromoCodeConfig(form)
      uiControl.dialogVisible = false
      await loadPromoConfig()
      ElMessage({message: t('message.addSuccess'), type: 'success'})
    }
  })
}

function disabledStartDate(time) {
  if (form.endTime !== null) {
    const changedDate = form.endTime.replace(/(..)\/(..)\/(....)/, '$3-$2-$1')
    var date = new Date(changedDate)
    return (
      time.getTime() <= moment(Date.now()).subtract(1, 'days') ||
      time.getTime() >= moment(date).subtract(1, 'days')
    )
  }
  return time.getTime() <= moment(Date.now()).subtract(1, 'days')
}

function showAndResetBonusType() {
  showBonusTypeField()
  resetAllBonusTypeAmount()
}

function showBonusTypeField() {
  switch(form.bonusType){
    case 'FIXED': uiControl.bonusFixedVisible = true
                  uiControl.bonusRangeVisible = false;
                  uiControl.bonusVipFixedVisible = false;
                  uiControl.bonusVipRangeVisible = false;
                  break;
    case 'RANGE': uiControl.bonusFixedVisible = false
                  uiControl.bonusRangeVisible = true;
                  uiControl.bonusVipFixedVisible = false;
                  uiControl.bonusVipRangeVisible = false;
                  break;
    case 'VIP_FIXED': uiControl.bonusFixedVisible = false
                      uiControl.bonusRangeVisible = false;
                      uiControl.bonusVipFixedVisible = true;
                      uiControl.bonusVipRangeVisible = false;
                      break;
    case 'VIP_RANGE': uiControl.bonusFixedVisible = false
                      uiControl.bonusRangeVisible = false;
                      uiControl.bonusVipFixedVisible = false;
                      uiControl.bonusVipRangeVisible = true;
                      break;
  }
}

function resetAllBonusTypeAmount(){
  form.fixedBonus = 0;
  form.minBonus = 0;
  form.maxBonus = 0;
  form.fixedVipRules = [];
  form.rangeVipRules = [];
}

function addVipRule() {
  form.rangeVipRules.push({
    vipLevel: vipRangeRuleForm.vipLevel,
    minAmount: vipRangeRuleForm.minAmount,
    maxAmount: vipRangeRuleForm.maxAmount
  })
  uiControl.bonusVipRangePanelVisible = false
  getAvailableVip()
  rangeVipForm.value.resetFields()
}

function addFixedVipRule() {
  form.fixedVipRules.push({
    vipLevel: vipFixedRuleForm.vipLevel,
    minAmount: vipFixedRuleForm.minAmount,
  })
  uiControl.bonusVipFixedPanelVisible = false
  getAvailableVip()
  fixedVipForm.value.resetFields()
}

function disabledEndDate(time) {
  if (form.startTime !== null) {
    const changedDate = form.startTime.replace(/(..)\/(..)\/(....)/, '$3-$2-$1')
    var date = new Date(changedDate)
    return time.getTime() <= date.getTime()
  }
  return time.getTime() <= Date.now()
}

function edit() {
  bannerForm.value.validate(async valid => {
    if (valid) {
      if(form.gameTypes){
        form.gameTypes = form.gameTypes.join(",")
      }
      await updatePromoCodeConfig(form)
      uiControl.dialogVisible = false
      await loadPromoConfig()
      ElMessage({message: t('message.editSuccess'), type: 'success'})
    }
  })
}

function submit() {
  if (uiControl.dialogType === 'CREATE') {
    create()
  } else {
    edit()
  }
}

async function loadGameTypes() {
  const { data: gameType } = await getGameTypes()
  gameTypes.list = gameType;
}

async function changePromoCodeRedeemConfigStatus(id, status) {
  await updatePromoCodeConfigStatus(id, status)
  ElMessage({ message: t('message.updateSuccess'), type: 'success' })
  await loadPromoConfig()
}

onMounted(async () => {
  await loadSites();
  await loadVips();
  await loadWays();
  request.siteId = siteList.list[0].id
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  }
  changeSite(request.siteId)
  loadGameTypes()
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

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}

.grid-table {
  margin: 10px 0px 10px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;

  .el-button {
    width: 120px;
  }

  .el-input {
    width: 100%;
  }

  .multi-lists {
    border-radius: 4px;
    border: 1px solid #acacac;
    padding: 8px 4px;
    min-height: 40px;

    &.red-box {
      border: 1px solid #ff0000;
    }

    .multi-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .btn-pointer {
    cursor: pointer;
  }

}

.dialog-label {
  color: #EE9230;
  font-size: 13px;
  padding-bottom: 5px;
  display: block;
}
</style>
