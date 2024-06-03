<template>
  <el-select
    v-model="request.siteId"
    size="small"
    :placeholder="t('fields.site')"
    class="filter-item"
    style="width: 120px"
    default-first-option
    @focus="loadSites"
    @change="loadPiggyBankSettings"
  >
    <el-option
      v-for="item in siteList.list"
      :key="item.id"
      :label="item.siteName"
      :value="item.id"
    />
  </el-select>
  <el-form ref="formRef" :model="form" :rules="formRules" :inline="true" size="small" label-width="200px" style="margin-top: 10px;">
    <el-row>
      <el-form-item :label="t('fields.referrerEligibility')" prop="eligibleType">
        <el-radio-group v-model="form.referrerEligibleType">
          <el-radio v-for="item in uiControl.referrerEligibility" :key="item.key" :label="item.value">{{ item.displayName }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-row>
    <el-row v-if="form.referrerEligibleType === 'VIP_LEVEL'">
      <el-form-item label="VIP" prop="vips">
        <el-checkbox
          v-model="checkboxes.vipReferrer.checkAll"
          :indeterminate="checkboxes.vipReferrer.isIndeterminate"
          @change="handleVIPCheckAllChange"
        >{{ t('fields.checkall') }}</el-checkbox>
        <el-checkbox-group
          v-model="selectedReferrerVIPs.vipChecked"
          @change="handleCheckedChange('VIP', true)"
          style="width: 300px"
        >
          <el-checkbox v-for="v in vipList.list" :label="v.id" :key="v.id">
            {{ v.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-row>
    <el-row v-if="form.referrerEligibleType === 'AFFILIATE_ID'">
      <el-form-item :label="t('fields.affiliateLoginName')">
        <el-input
          type="textarea"
          v-model="uiControl.referrerParamPlaceHolder"
          :rows="5"
          style="width: 350px; white-space: pre-line"
          placeholder="xxxxx,yyyyy,zzzzz (comma separated)"
        />
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.refereeEligibility')" prop="eligibleType">
        <el-radio-group v-model="form.refereeEligibleType">
          <el-radio v-for="item in uiControl.refereeEligibility" :key="item.key" :label="item.value">{{ item.displayName }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-row>
    <el-row v-if="form.refereeEligibleType === 'AFFILIATE_ID'">
      <el-form-item :label="t('fields.affiliateLoginName')">
        <el-input
          type="textarea"
          v-model="uiControl.refereeParamPlaceHolder"
          :rows="5"
          style="width: 350px; white-space: pre-line"
          placeholder="xxxxx,yyyyy,zzzzz (comma separated)"
        />
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.needPhoneVerified')" prop="needPhoneVerified">
        <el-switch
          v-model="form.needPhoneVerified"
          active-text="Yes"
          inactive-text="No"
          active-value="true"
          inactive-value="false"
        />
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.needIpUniqueInMonth')" prop="needIpUniqueInMonth">
        <el-switch
          v-model="form.needIpUniqueInMonth"
          active-text="Yes"
          inactive-text="No"
          active-value="true"
          inactive-value="false"
        />
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.refereeMinTotalDeposit')" prop="minTotalDeposit">
        <el-input v-model="form.minTotalDeposit" />
      </el-form-item>
      <el-form-item :label="t('fields.refereeMinTotalBet')" prop="minTotalBet">
        <el-input v-model="form.minTotalBet" />
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.virtualAmount')" prop="virtualAmount">
        <el-input-number
          v-model="form.virtualAmount"
          style="width: 145px"
          :min="0"
          :max="9999999999"
          :controls="false"
          @keypress="restrictDecimalInput($event)"
        />
      </el-form-item>
      <el-form-item :label="t('fields.virtualMultiplier')" prop="virtualMultiplier">
        <el-input-number
          v-model="form.virtualMultiplier"
          style="width: 145px"
          :min="1"
          :max="99999"
          :controls="false"
          @keypress="restrictInput($event)"
        />
      </el-form-item>
    </el-row>
    <div class="dialog-footer">
      <el-button v-permission="['sys:refer-rebate:setting:update']" type="primary" @click="edit">{{ t('fields.confirm') }}</el-button>
    </div>
  </el-form>
</template>

<script setup>

import { onMounted, reactive, ref, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { getEligibilitySettings, getSiteWithPromo, updateEligibilitySettings } from "@/api/refer-rebate";
import { getVipList } from '@/api/vip'
import { useI18n } from "vue-i18n";
import { required } from "@/utils/validate";

const { t } = useI18n();
const siteList = reactive({
  list: []
});
const vipList = reactive({
  list: [],
})
const formRef = ref(null);
const rulesParam = ref([]);
const uiControl = reactive({
  referrerEligibility: [
    { key: 1, displayName: t('fields.allMembers'), value: 'ALL' },
    { key: 2, displayName: t('fields.selectedVipLevels'), value: 'VIP_LEVEL' },
    { key: 3, displayName: t('fields.selectedAffiliates'), value: 'AFFILIATE_ID' },
  ],
  refereeEligibility: [
    { key: 1, displayName: t('fields.allMembers'), value: 'ALL' },
    { key: 2, displayName: t('fields.selectedAffiliates'), value: 'AFFILIATE_ID' },
  ],
  referrerParamPlaceHolder: null,
  refereeParamPlaceHolder: null,
});

const selectedReferrerVIPs = reactive({ vipChecked: [] })
const selectedRefereeVIPs = reactive({ vipChecked: [] })
const checkboxes = reactive({
  vipReferrer: {
    checkAll: false,
    isIndeterminate: false
  },
  vipReferee: {
    checkAll: false,
    isIndeterminate: false
  }
});

const request = reactive({
  siteId: null
});
const form = reactive({
  referrerEligibleType: null,
  refereeEligibleType: null,
  referrerEligibleParam: null,
  refereeEligibleParam: null,
  needPhoneVerified: false,
  needIpUniqueInMonth: false,
  minTotalDeposit: 0,
  minTotalBet: 0,
  oneTimeBonusStatus: false,
  depositRebateStatus: false,
  betRebateStatus: false,
  virtualAmount: 0,
  virtualMultiplier: 1,
});

const validateRules = (rule, value, callback) => {
  const param = JSON.parse(constructParam())
  if (!param.rules[0].minDeposit && !param.rules[0].bonus) {
    callback(new Error(t('message.validateRulesRequired')))
  }
  callback()
}

const formRules = reactive({
  minWithdrawAmount: [required(t('message.validateMinWithdrawRequired'))],
  rules: [{ validator: validateRules, trigger: 'blur' }],
})

const handleVIPCheckAllChange = (val, isReferrer) => {
  if (isReferrer) {
    selectedReferrerVIPs.vipChecked = []
    if (val) {
      vipList.list.forEach(vip => {
        selectedReferrerVIPs.vipChecked.push(vip.id)
      })
    }
  } else {
    selectedRefereeVIPs.vipChecked = []
    if (val) {
      vipList.list.forEach(vip => {
        selectedRefereeVIPs.vipChecked.push(vip.id)
      })
    }
  }
  handleCheckedChange('VIP', isReferrer)
}

function handleCheckedChange(type, isReferrer) {
  if (type === 'VIP') {
    if (isReferrer) {
      form.referrerEligibleParam = JSON.stringify(selectedReferrerVIPs.vipChecked.join(','))
    } else {
      form.refereeEligibleParam = JSON.stringify(selectedRefereeVIPs.vipChecked.join(','))
    }
  }
  handleIndividualCheckChange()
}

function handleIndividualCheckChange() {
  const vipIds = [...new Set(vipList.list.map(el => el.id))];
  handleCategoryChange(selectedReferrerVIPs.vipChecked, checkboxes.vipReferrer, vipIds)
}

function handleCategoryChange(selectedList, checkboxData, dataList) {
  const selectedCount = selectedList.filter(el => dataList.includes(el)).length
  const listCount = dataList.length
  checkboxData.checkAll = selectedCount === listCount
  checkboxData.isIndeterminate = selectedCount > 0 && selectedCount < listCount
}

async function loadSites() {
  const { data: site } = await getSiteWithPromo();
  siteList.list = site;
}

async function loadVips() {
  const { data: vip } = await getVipList()
  vipList.list = vip
}

async function getVipBySiteId(siteId) {
  await loadVips()
  vipList.list = vipList.list.filter(vip => vip.siteId === siteId)
}

async function loadPiggyBankSettings() {
  rulesParam.value = [];
  formRef.value.resetFields();
  const { data: ret } = await getEligibilitySettings(request.siteId);
  await getVipBySiteId(request.siteId)
  nextTick(() => {
    if (ret) {
      Object.entries(ret).forEach(([key, value]) => {
        if (Object.keys(form).find(k => k === key)) {
          form[key] = value;
        }
        if (key === 'referrerEligibleParam') {
          if (ret.referrerEligibleType === 'VIP_LEVEL') {
            selectedReferrerVIPs.vipChecked = JSON.parse(value).split(',').map(Number)
          } else if (ret.referrerEligibleType === 'AFFILIATE_ID') {
            uiControl.referrerParamPlaceHolder = value
          }
        } else if (key === 'refereeEligibleParam') {
          if (ret.refereeEligibleType === 'AFFILIATE_ID') {
            uiControl.refereeParamPlaceHolder = value
          }
        }
      })
    }

    // if (rulesParam.value.length === 0) {
    //   addParam();
    // }
  });
  console.log(selectedReferrerVIPs.vipChecked)
}

function edit() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      const params = constructParam();
      await updateEligibilitySettings(request.siteId, params);
      await loadPiggyBankSettings();
      ElMessage({ message: t('message.editSuccess'), type: "success" });
    }
  });
}

function constructParam() {
  const json = {};
  Object.entries(form).forEach(([key, value]) => {
    json[key] = value;
  })
  if (form.referrerEligibleType === 'AFFILIATE_ID') {
    json.referrerEligibleParam = uiControl.referrerParamPlaceHolder
  }
  if (form.refereeEligibleType === 'AFFILIATE_ID') {
    json.refereeEligibleParam = uiControl.refereeParamPlaceHolder
  }
  return JSON.stringify(json);
}

function restrictInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if (charCode < 48 || charCode > 57) {
    event.preventDefault()
  }
}

function restrictDecimalInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if (
    (charCode < 48 || charCode > 57) &&
    charCode !== 46 &&
    form.rebateRate.toString().indexOf('.') > -1
  ) {
    event.preventDefault()
  }

  if (
    form.rebateRate !== null &&
    form.rebateRate.toString().indexOf('.') > -1
  ) {
    if (form.rebateRate.split('.')[1].length > 1) {
      event.preventDefault()
    }
    uiControl.bonusAmountRatioMax = 16
  } else {
    uiControl.bonusAmountRatioMax = 15
  }
}

onMounted(async() => {
  await loadSites();
  request.siteId = siteList.list[0].id;
  await loadPiggyBankSettings();
});

</script>

<style scoped>

.btn-group {
  margin-top: 15px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-start;
}

.param-label {
  display: inline-block;
  width: 80px;
  margin-top: 5px;
  margin-left: 5px;
  font-size: var(--el-form-label-font-size);
  color: var(--el-text-color-regular);
}

.param-input {
  width: 170px;
  margin-top: 5px;
  margin-left: 5px;
  margin-right: 15px;
  font-size: var(--el-form-label-font-size);
  color: var(--el-text-color-regular);
}

.param-select {
  margin-left: 5px;
  margin-right: 15px;
  font-size: var(--el-form-label-font-size);
  color: var(--el-text-color-regular);
}
</style>
