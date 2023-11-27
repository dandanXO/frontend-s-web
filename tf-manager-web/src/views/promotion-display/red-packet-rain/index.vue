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
          @click="loadRedPacketRain"
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
          v-permission="['sys:red-packet-rain:add']"
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
        <el-form-item :label="t('fields.status')" prop="status">
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
        </el-form-item>
        <el-row>
          <el-col>
            <el-form-item :label="t('fields.startTime')" prop="startTime">
              <el-date-picker
                type="date"
                value-format="YYYY-MM-DD"
                v-model="form.startTime"
                style="width: 355px"
                :disabled-date="disabledStartDate"
              />
            </el-form-item>
            <el-form-item :label="t('fields.endTime')" prop="endTime">
              <el-date-picker
                type="date"
                value-format="YYYY-MM-DD"
                v-model="form.endTime"
                style="width: 355px"
                :disabled-date="disabledEndDate"
              />
            </el-form-item>
            <el-form-item :label="t('fields.maxMemberClaimCountPerRain')" prop="maxMemberClaimCountPerRain">
              <el-input-number
                v-if="form.maxMemberClaimCountPerRain >= 0"
                v-model="form.maxMemberClaimCountPerRain"
                style="width: 135px"
                :min="1"
              />
              <el-tag
                v-else
              >
                {{ t('fields.noLimit') }}
              </el-tag>
              <el-button v-if="form.maxMemberClaimCountPerRain >= 0" type="warning" class="button-new-tag ml-1 el-button--success" @click="form.maxMemberClaimCountPerRain = -1"
                         style="display:block;margin-top:4px;"
              >
                {{ t('fields.noLimit') }}
              </el-button>
              <el-button v-else type="success" class="button-new-tag ml-1 el-button--success" @click="form.maxMemberClaimCountPerRain = 0"
                         style="display:block;margin-top:4px;"
              >
                {{ t('fields.addLimit') }}
              </el-button>
            </el-form-item>
            <el-form-item :label="t('fields.maxMemberClaimCountPerDay')" prop="maxMemberClaimCountPerDay">
              <el-input-number
                v-if="form.maxMemberClaimCountPerDay >= 0"
                v-model="form.maxMemberClaimCountPerDay"
                style="width: 135px"
                :min="1"
              />
              <el-tag
                v-else
              >
                {{ t('fields.noLimit') }}
              </el-tag>
              <el-button v-if="form.maxMemberClaimCountPerDay >= 0" type="warning" class="button-new-tag ml-1 el-button--success" @click="form.maxMemberClaimCountPerDay = -1"
                         style="display:block;margin-top:4px;"
              >
                {{ t('fields.noLimit') }}
              </el-button>
              <el-button v-else type="success" class="button-new-tag ml-1 el-button--success" @click="form.maxMemberClaimCountPerDay = 0"
                         style="display:block;margin-top:4px;"
              >
                {{ t('fields.addLimit') }}
              </el-button>
            </el-form-item>
            <el-form-item :label="t('fields.dailyRainDuration')" prop="dailyRainDuration" style="width: 650px;">
              <el-tag
                v-for="item in form.dailyRainDuration"
                :key="item"
                class="ml-1"
                closable
                @close="removeDailyRainDuration(item)"
                :type="isExpiredTime(item) ? 'danger' : ''"
              >
                {{ displayHourMinute(item) }}
              </el-tag>
              <!--              <div v-for="(rainRange) of form.dailyRainDurationArray">-->
              <!--                -->
              <!--              </div>-->

              <el-button class="button-new-tag ml-1 el-button--success" @click="openRangeModal(1)"
                         style="display:block;margin-top:4px;"
              >
                + {{ t('fields.add_new') }}
              </el-button>
            </el-form-item>
            <el-form-item :label="t('fields.dailyRefreshDuration')" prop="dailyRefreshDuration" style="width: 650px;">
              <el-tag
                v-for="item in form.dailyRefreshDuration"
                :key="item"
                class="ml-1"
                closable
                @close="removeDailyRefreshDuration(item)"
                :type="isExpiredTime(item) ? 'danger' : ''"
              >
                {{ displayHourMinute(item) }}
              </el-tag>
              <el-button-group>
                <el-button class="button-new-tag ml-1 el-button--success" size="small" @click="openRangeModal(2)">
                  + {{ t('fields.add_new') }}
                </el-button>
                <el-button class="button-new-tag ml-1" size="small" @click="setRefreshDurationSameAsRainDuration">
                  Set Same As Rain Duration
                </el-button>
              </el-button-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="t('fields.amountLimitPerRain')" prop="amountLimitPerRain" style="width: 600px;">
          $
          <el-input-number
            v-model="form.amountLimitPerRain"
            style="width: 135px"
            :controls="false"
            @keypress="restrictInput($event)"
          />
        </el-form-item>
        <el-form-item :label="t('fields.redPacketAmountAfterReachingLimit')" prop="redPacketAmountAfterReachingLimit"
                      style="width: 600px;"
        >
          $
          <el-input-number
            v-model="form.redPacketAmountAfterReachingLimit"
            style="width: 135px"
            :controls="false"
            @keypress="restrictInput($event)"
          />
        </el-form-item>
        <el-form-item :label="t('fields.vipRules')" prop="vipRules" style="width: 600px;">
          <el-tag
            v-for="item in form.vipRules"
            :key="item"
            class="ml-1"
            closable
            @close="removeVipRule(item)"
          >
            {{ displayVipRule(item) }}
          </el-tag>
          <el-form
            v-if="uiControl.vipRuleVisible"
            ref="vipForm"
            :model="vipRuleForm"
            size="small"
            label-width="50px"
            style="width:100%"
          >
            <el-form-item :label="t('fields.vipLevel')" prop="vipLevel" style="width: 600px;">
              <el-select
                clearable
                v-model="vipRuleForm.vipLevel"
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
                v-model="vipRuleForm.minAmount"
                style="width: 135px"
                :controls="false"
                @keypress="restrictInput($event)"
              />
            </el-form-item>
            <el-form-item :label="t('fields.maxAmount')" prop="maxAmount">
              $
              <el-input-number
                v-model="vipRuleForm.maxAmount"
                style="width: 135px"
                :controls="false"
                @keypress="restrictInput($event)"
              />
            </el-form-item>
            <div class="dialog-footer">
              <el-button @click="uiControl.vipRuleVisible = false">{{ t('fields.cancel') }}</el-button>
              <el-button @click="addVipRule">{{ t('fields.add') }}</el-button>
            </div>
          </el-form>
          <el-button v-else-if="currVipList.list.length > 0" class="button-new-tag ml-1 el-button--success" @click="uiControl.vipRuleVisible = true"
                     style="display:block;margin-top:4px;"
          >
            + {{ t('fields.add_new') }}
          </el-button>
        </el-form-item>
        <el-form-item :label="t('fields.lastDigitMinDayDeposit')" prop="lastDigitMinDayDeposit" style="width: 600px;">
          $
          <el-input-number
            v-model="form.lastDigitMinDayDeposit"
            style="width: 135px"
            :controls="false"
            @keypress="restrictInput($event)"
          />
        </el-form-item>
        <el-form-item :label="t('fields.lastDigitRules')" prop="lastDigitRules">
          <el-tag
            v-for="item in form.lastDigitRules"
            :key="item.lastDigit"
            class="ml-1"
            closable
            @close="removeLastDigitRule(item)"
          >
            {{ displayLastDigitRule(item) }}
          </el-tag>
          <el-form
            v-if="uiControl.lastDigitRuleVisible"
            ref="digitForm"
            :model="lastDigitRuleForm"
            :inline="true"
            size="small"
            label-width="50px"
            style="width:100%"
          >
            <el-form-item :label="t('fields.lastDigit')" prop="lastDigit">
              <el-input
                v-model="lastDigitRuleForm.lastDigit"
              />
            </el-form-item>
            <el-form-item :label="t('fields.amount')" prop="amount">
              $
              <el-input-number
                v-model="lastDigitRuleForm.amount"
                style="width: 135px"
                :controls="false"
                @keypress="restrictInput($event)"
              />
            </el-form-item>
            <div class="dialog-footer">
              <el-button @click="uiControl.lastDigitRuleVisible = false">{{ t('fields.cancel') }}</el-button>
              <el-button @click="addLastDigitRule">{{ t('fields.add') }}</el-button>
            </div>
          </el-form>
          <el-button class="button-new-tag ml-1 el-button--success" @click="uiControl.lastDigitRuleVisible = true"
                     style="display:block;margin-top:4px;"
          >
            + {{ t('fields.add_new') }}
          </el-button>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog
      :title="(uiControl.addRangeType===1) ? 'Add Daily Rain Duration' : 'Add Daily Refresh Duration' "
      v-model="uiControl.rainModelVisible"
      append-to-body
      width="650px"
    >
      <el-radio-group v-model="uiControl.dateRangeType" class="ml-4">
        <el-radio label="1" size="large">{{ $t('fields.add_single_daterange') }}</el-radio>
        <el-radio label="2" size="large">{{ $t('fields.adde_multiple_daterange') }}</el-radio>
      </el-radio-group>

      <div v-if="uiControl.dateRangeType==='1'" style="margin:10px 0px 20px;">

        <label class="dialog-label">{{ $t('fields.add_single_date_steps') }}</label>
        <br>

        <el-date-picker
          v-model="singleRainRangeFrom"
          type="datetime"
          :placeholder="t('fields.pick_start_date')"
          format="YYYY-MM-DD HH:mm"
          date-format="MMM DD, YYYY HH:mm"
          value-format="YYYY-MM-DD HH:mm"
        />

        <el-date-picker
          type="datetime"
          v-model="singleRainRangeTo"
          format="YYYY-MM-DD HH:mm"
          :placeholder="t('fields.pick_end_date')"
          date-format="MMM DD, YYYY HH:mm"
          value-format="YYYY-MM-DD HH:mm"
        />
      </div>

      <div v-if="uiControl.dateRangeType==='2'" style="margin:10px 0px 20px;">
        <label class="dialog-label">{{ $t('fields.add_multiple_date_steps') }}</label>
        <br>

        <div class="grid-table">
          <el-date-picker
            v-model="multiRainRangeDate"
            type="datetime"
            :placeholder="t('fields.pick_date')"
            format="YYYY-MM-DD"
            date-format="MMM DD, YYYY"
          />

          <el-time-picker
            v-model="multiRainRangeTime"
            format="HH:mm"
            value-format="HH:mm"
            is-range
            range-separator="-"
            start-placeholder="Start"
            end-placeholder="End"
          />

          <el-button type="success" style="margin-left: auto;" @click="addMultiRangeDate('date')">
            {{ $t('fields.add_date') }}
          </el-button>
          <el-button type="success" style="margin-left: auto;" @click="addMultiRangeDate('time')">
            {{ $t('fields.add_time') }}
          </el-button>

          <label>{{ $t('fields.date') }}</label>
          <label>{{ $t('fields.timeranges') }}</label>

          <div class="multi-lists"
               :class="isMultiRangeError===true && multiRangeDateLists.length === 0? 'red-box' : ''"
          >
            <template v-for="(multiday,index) of multiRangeDateLists" :key="index">
              <div class="multi-item">{{ multiday }}

                <el-icon class="btn-pointer" @click="multiRangeDateLists.splice(index,1)" color="dark">
                  X
                </el-icon>
              </div>
            </template>

          </div>
          <div class="multi-lists"
               :class="isMultiRangeError===true && multiRangeTimeLists.length === 0? 'red-box' : ''"
          >
            <template v-for="(multitime, index) of multiRangeTimeLists" :key="index">
              <div class="multi-item">{{ multitime }}

                <el-icon class="btn-pointer" @click="multiRangeTimeLists.splice(index,1)" color="dark">
                  X
                </el-icon>
              </div>
            </template>
          </div>
        </div>

      </div>

      <el-button type="primary" @click="addRainRangeItem">{{ t('fields.add') }}</el-button>
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
      <el-table-column prop="status" :label="t('fields.status')" width="150">
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
      </el-table-column>
      <el-table-column prop="startTime" :label="t('fields.startTime')" />
      <el-table-column prop="endTime" :label="t('fields.endTime')" />
      <el-table-column prop="createTime" :label="t('fields.createTime')" />
      <el-table-column prop="createBy" :label="t('fields.createBy')" />
      <el-table-column prop="updateTime" :label="t('fields.updateTime')" />
      <el-table-column prop="updateBy" :label="t('fields.updateBy')" />
      <el-table-column type="title" :label="t('fields.action')"
                       v-if="hasPermission(['sys:banner:update'])|| hasPermission(['sys:banner:del'])"
      >
        <template #default="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            v-permission="['sys:red-packet-rain:update']"
            @click="showEdit(scope.row)"
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
    />
  </div>
</template>

<script setup>
/* eslint-disable */
import {ElMessage, ElMessageBox} from 'element-plus'
import {computed, nextTick, onMounted, reactive, ref} from 'vue'
import {
  getRedPacketRains,
  createRedPacketRain,
  updateRedPacketRain
} from '../../../api/privilege-red-packet-rain'
import {getSiteListSimple} from '../../../api/site'
import {required} from '../../../utils/validate'
import {hasPermission} from '../../../utils/util'
import {useStore} from '../../../store';
import {TENANT} from "../../../store/modules/user/action-types";
import {useI18n} from "vue-i18n";
import {getVipList} from "@/api/vip";
import moment from "moment/moment";

const {t} = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const bannerForm = ref(null)
const vipForm = ref(null)
const digitForm = ref(null)
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

const singleRainRangeFrom = ref(null);
const singleRainRangeTo = ref(null);

const multiRainRangeDate = ref(null);
const multiRainRangeTime = ref(null);

const multiRangeDateLists = ref([]);
const multiRangeTimeLists = ref([]);
const isMultiRangeError = ref(false);
// const vipRule = ref(null)

const uiControl = reactive({
  dialogVisible: false,
  rainRangeVisible: false,
  rainModelVisible: false,
  addRangeType: null,
  refreshRangeVisible: false,
  vipRuleVisible: false,
  lastDigitRuleVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  editBtn: true,
  removeBtn: true,
  dateRangeType: "1",
  status: [
    { key: 1, displayName: 'Open', value: 'OPEN' },
    { key: 2, displayName: 'Close', value: 'CLOSE' },
    { key: 3, displayName: 'Test', value: 'TEST' },
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
  startTime: null,
  endTime: null,
  dailyRainDuration: [],
  dailyRefreshDuration: [],
  maxMemberClaimCountPerRain: 1,
  maxMemberClaimCountPerDay: 1,
  amountLimitPerRain: 0,
  redPacketAmountAfterReachingLimit: 0,
  vipRules: [],
  lastDigitMinDayDeposit: 0,
  lastDigitRules: [],
  status: null,
})

const vipRuleForm = reactive({
  vipLevel: 0,
  minAmount: 0,
  maxAmount: 0,
})

const lastDigitRuleForm = reactive({
  lastDigit: "",
  amount: 0,
})

const page = reactive({
  pages: 0,
  records: [],
})

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  name: [required(t('message.validateNameRequired'))],
  code: [required(t('message.validateCodeRequired'))],
  startTime: [required(t('message.validateStartTimeRequired'))],
  endTime: [required(t('message.validateEndTimeRequired'))],
  dailyRainDuration: [required(t('message.validateDailyRainDurationRequired'))],
  dailyRefreshDuration: [required(t('message.validateDailyRefreshDurationRequired'))],
  vipRules: [required(t('message.validateVipRulesRequired'))],
  status: [required(t('message.validateStatusRequired'))],
})

function resetQuery() {
  request.name = null
  request.status = null
  request.siteId = site.value ? site.value.id : null;
}

function changePage(page) {
  request.current = page
  loadRedPacketRain()
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (bannerForm.value) {
      bannerForm.value.resetFields()

    }
    uiControl.dialogTitle = t('fields.addBanner')
  } else {
    uiControl.dialogTitle = t('fields.editBanner')
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
      if (key === 'dailyRainDuration') {
        form.dailyRainDuration = JSON.parse(banner[key])
      } else if (key === 'dailyRefreshDuration') {
        form.dailyRefreshDuration = JSON.parse(banner[key])
      } else if (key === 'vipRules') {
        form.vipRules = JSON.parse(banner[key])
      } else if (key === 'lastDigitRules') {
        form.lastDigitRules = JSON.parse(banner[key])
      } else if (key === 'startTime' || key === 'endTime') {
        form[key] = moment(banner[key]).format('YYYY-MM-DD HH:mm:ss')
      } else if (Object.keys(form).find(k => k === key)) {
        form[key] = banner[key]
      }
    }
    siteList.list.forEach(element => {
      if (element.siteName === banner.siteName) {
        form.siteId = element.id
      }
    })
    console.log("===========")
    console.log(banner)
    console.log(form)
    console.log("===========")
  })
}

function displayHourMinute(rangeString) {
  return rangeString.startTime + ' - ' + rangeString.endTime;
}

function displayVipRule(vipRule) {
  const vip = siteVipList.list.find(vip => vip.level === vipRule.vipLevel)
  const name = vip ? vip.name : ''
  return name + '  $' + vipRule.minAmount + ' - $' + vipRule.maxAmount;
}

function displayLastDigitRule(lastDigitRule) {
  return lastDigitRule.lastDigit + ' - $' + lastDigitRule.amount;
}

function removeDailyRainDuration(item) {
  form.dailyRainDuration.splice(form.dailyRainDuration.indexOf(item), 1);
}

function removeDailyRefreshDuration(item) {
  form.dailyRefreshDuration.splice(form.dailyRefreshDuration.indexOf(item), 1);
}

function removeVipRule(item) {
  form.vipRules.splice(form.vipRules.indexOf(item), 1);
  getAvailableVip()
}

function removeLastDigitRule(item) {
  form.lastDigitRules.splice(form.lastDigitRules.indexOf(item), 1);
}

function isExpiredTime(rangeString) {
  // rangeString.startTime + ' - ' + rangeString.endTime;
  if (rangeString.endTime < moment().format("YYYY-MM-DD-HH:mm")) {
    return true;
  }
  if (rangeString.endTime < rangeString.startTime) {
    return true;
  }
  return false;
}

function setRefreshDurationSameAsRainDuration() {
  form.dailyRefreshDuration = [...form.dailyRainDuration]
}

async function loadRedPacketRain() {
  const {data: ret} = await getRedPacketRains(request)
  page.pages = ret.pages
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
    await loadRedPacketRain()
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
  if (siteId === 1) {
    form.minBalance = 5
  } else if (siteId === 3) {
    form.minBalance = 20
  } else {
    form.minBalance = 0
  }
  form.vipRules = []
  getVipBySiteId(siteId)
  getAvailableVip()
}

async function loadVips() {
  const {data: vip} = await getVipList()
  totalVipList.list = vip
}

async function getAvailableVip() {
  const levels = form.vipRules.map(vip => vip.vipLevel)
  currVipList.list = siteVipList.list.filter(vip => {
    return !levels.includes(vip.level)
  });
  if (currVipList.list.length > 0) {
    vipRuleForm.vipLevel = currVipList.list[0].level
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
      await createRedPacketRain(form)
      uiControl.dialogVisible = false
      await loadRedPacketRain()
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

const openRangeModal = (type) => {
  uiControl.addRangeType = type;
  uiControl.rainModelVisible = true;
  isMultiRangeError.value = false;
  singleRainRangeFrom.value = null;
  singleRainRangeTo.value = null;
  multiRangeDateLists.value = [];
  multiRangeTimeLists.value = [];
  multiRainRangeDate.value = null;
  multiRainRangeTime.value = null;
}


function addRainRangeItem() {
  console.log(singleRainRangeFrom.value);
  console.log(singleRainRangeTo.value);
  isMultiRangeError.value = false;

  if (uiControl.addRangeType === 1) {

    if (uiControl.dateRangeType === "1") {

      if (singleRainRangeFrom.value && singleRainRangeTo.value) {
        form.dailyRainDuration.push({
          startTime: singleRainRangeFrom.value.replace(" ", "-"),
          endTime: singleRainRangeTo.value.replace(" ", "-")
        })
        console.log(form.dailyRainDuration);
        ElMessage({message: t('fields.date_added'), type: 'success'});
      } else {
        ElMessage({message: t('fields.please_select_datetime'), type: 'error'});
        return;
      }
    } else {
      if (multiRangeDateLists.value.length > 0 && multiRangeTimeLists.value.length > 0) {
        multiRangeDateLists.value.forEach((date) => {
          multiRangeTimeLists.value.forEach((time) => {

            let timerange = time.split("--");

            form.dailyRainDuration.push({
              startTime: date + '-' + timerange[0],
              endTime: date + '-' + timerange[1]
            })

          });
        })
        ElMessage({message: t('fields.multiple_rain_added'), type: 'success'});
      } else {
        ElMessage({message: t('fields.please_add_at_least_one_date_time'), type: 'error'});
        isMultiRangeError.value = true;
        return;
      }
    }
  } else {

    if (uiControl.dateRangeType === "1") {
      if (singleRainRangeFrom.value && singleRainRangeTo.value) {
        form.dailyRainDuration.push({
          startTime: singleRainRangeFrom.value.replace(" ", "-"),
          endTime: singleRainRangeTo.value.replace(" ", "-")
        })
        console.log(form.dailyRainDuration);
        ElMessage({message: t('fields.date_added'), type: 'success'});
      } else {
        ElMessage({message: t('fields.please_select_datetime'), type: 'error'});
        return;
      }
    } else {
      if (multiRangeDateLists.value.length > 0 && multiRangeTimeLists.value.length > 0) {
        multiRangeDateLists.value.forEach((date) => {
          multiRangeTimeLists.value.forEach((time) => {

            let timerange = time.split("--");

            form.dailyRefreshDuration.push({
              startTime: date + '-' + timerange[0],
              endTime: date + '-' + timerange[1]
            })

          });
        })
        ElMessage({message: t('fields.multiple_rain_added'), type: 'success'});
      } else {
        ElMessage({message: t('fields.please_add_at_least_one_date_time'), type: 'error'});
        isMultiRangeError.value = true;
        return;
      }
    }

  }


  uiControl.rainModelVisible = false;

}

const addMultiRangeDate = (type) => {
  if (type === 'date' && multiRainRangeDate.value) {
    let date = moment(multiRainRangeDate.value).format("YYYY-MM-DD");
    if (multiRangeDateLists.value.indexOf(date) > -1) {
      ElMessage({message: t('fields.date_already_exists'), type: 'error'});
    } else {
      multiRangeDateLists.value.push(date)
    }

  } else if (type === 'time' && multiRainRangeTime.value && multiRainRangeTime.value[0] && multiRainRangeTime.value[1]) {
    if (multiRangeTimeLists.value.indexOf(multiRainRangeTime.value[0] + '--' + multiRainRangeTime.value[1]) > -1) {
      ElMessage({message: t('fields.time_already_exists'), type: 'error'});
    } else {
      multiRangeTimeLists.value.push(multiRainRangeTime.value[0] + '--' + multiRainRangeTime.value[1])
    }

  }
}

// function addRainRange(arr) {
//   if (arr[0] && arr[1]) {
//     form.dailyRainDurationArray.push({ startTime: arr[0], endTime: arr[1] })
//     rainRange.value = null
//   }
//   uiControl.rainRangeVisible = false
// }

function addVipRule() {
  form.vipRules.push({
    vipLevel: vipRuleForm.vipLevel,
    minAmount: vipRuleForm.minAmount,
    maxAmount: vipRuleForm.maxAmount
  })
  uiControl.vipRuleVisible = false
  getAvailableVip()
  vipForm.value.resetFields()
}

function addLastDigitRule() {
  form.lastDigitRules.push({
    lastDigit: lastDigitRuleForm.lastDigit,
    amount: lastDigitRuleForm.amount,
  })
  uiControl.lastDigitRuleVisible = false
  digitForm.value.resetFields()
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
      console.log(form)
      await updateRedPacketRain(form)
      uiControl.dialogVisible = false
      await loadRedPacketRain()
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

onMounted(async () => {
  await loadSites();
  await loadVips();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  }
  await loadRedPacketRain();
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
